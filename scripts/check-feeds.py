#!/usr/bin/env python3
"""Check every camera in src/configs/*.json and report which ones are broken.

usage: python3 scripts/check-feeds.py [--frames DIR] [--json]

- NYCTrafficVideo (NYSDOT HLS): pulls the playlist and decodes a real frame
  with ffmpeg. a playlist that loads but won't decode, or decodes to a flat
  gray/black frame, counts as broken.
- NYCTrafficImage (NYC DOT webcams): checks isOnline in the nyctmc camera list
  and that the image downloads and isn't blank.
- YouTubeLiveVideo: YouTube Data API v3. must be live right now and embeddable.
- YouTubeLoopingVideo: YouTube Data API v3. must exist, be public and embeddable
  (these are archival clips, so they're not expected to be live).

YouTube checks need an API key for www.googleapis.com. it can come from the
YOUTUBE_API_KEY env var, or from an environment network secret that injects
the X-goog-api-key header. without one, youtube cams come back UNKNOWN.

needs: ffmpeg, python3 with Pillow.
"""
import glob, json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "live-world-cameras-feed-check"}


def fetch(url, timeout=20):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()


def stddev(path):
    from PIL import Image, ImageStat
    return ImageStat.Stat(Image.open(path).convert("L")).stddev[0]


def check_hls(url, frames_dir):
    try:
        pl = fetch(url, 10).decode()
    except Exception as e:
        return "BAD", f"playlist failed: {e.__class__.__name__}"
    if "#EXTM3U" not in pl:
        return "BAD", "empty playlist"
    res = (re.findall(r"RESOLUTION=(\d+x\d+)", pl) or ["?"])[0]
    out = os.path.join(frames_dir, re.sub(r"\W", "_", url.split("/rtplive/")[-1].split("/")[0]) + ".png")
    try:
        p = subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", url, "-t", "4",
                            "-vf", r"select=eq(n\,30)", "-frames:v", "1", "-update", "1", out],
                           capture_output=True, text=True, timeout=40)
        errs = len(re.findall(r"error|no frame", p.stderr))
    except subprocess.TimeoutExpired:
        return "BAD", "ffmpeg timed out"
    if not os.path.exists(out) or os.path.getsize(out) == 0:
        return "BAD", f"no decodable frame ({res})"
    sd = stddev(out)
    if errs > 3:
        return "BAD", f"{errs} decode errors ({res})"
    if sd < 12:
        return "BAD", f"blank frame sd={sd:.0f} ({res})"
    return "OK", f"{res} sd={sd:.0f} frame={out}"


_tmc = None
def check_tmc(cam_id, frames_dir):
    global _tmc
    if _tmc is None:
        try:
            _tmc = {c["id"]: c for c in json.loads(fetch("https://webcams.nyctmc.org/api/cameras"))}
        except Exception:
            _tmc = {}
    meta = _tmc.get(cam_id)
    if _tmc and not meta:
        return "BAD", "not in nyctmc camera list"
    if meta and str(meta.get("isOnline")).lower() != "true":
        return "BAD", "nyctmc says offline"
    out = os.path.join(frames_dir, cam_id + ".jpg")
    try:
        open(out, "wb").write(fetch(f"https://webcams.nyctmc.org/api/cameras/{cam_id}/image"))
        sd = stddev(out)
    except Exception as e:
        return "BAD", f"image failed: {e.__class__.__name__}"
    if sd < 12:
        return "BAD", f"blank image sd={sd:.0f}"
    return "OK", f"sd={sd:.0f} frame={out}"


def yt_videos(ids):
    """returns {id: item} from videos.list, or None if the API isn't usable."""
    key = os.environ.get("YOUTUBE_API_KEY")
    out = {}
    for i in range(0, len(ids), 50):
        q = {"part": "snippet,status,liveStreamingDetails", "id": ",".join(ids[i:i + 50])}
        if key:
            q["key"] = key
        try:
            data = json.loads(fetch("https://www.googleapis.com/youtube/v3/videos?" + urllib.parse.urlencode(q)))
        except Exception as e:
            print(f"youtube api unavailable: {e}", file=sys.stderr)
            return None
        out.update({it["id"]: it for it in data.get("items", [])})
    return out


def check_youtube(vid, typ, yt):
    if yt is None:
        return "UNKNOWN", "no youtube api access"
    it = yt.get(vid)
    if not it:
        return "BAD", "video not found (deleted/private)"
    st, sn = it.get("status", {}), it.get("snippet", {})
    if st.get("privacyStatus") == "private":
        return "BAD", "private"
    if not st.get("embeddable", False):
        return "BAD", "not embeddable"
    title = f'"{sn.get("title", "")}" by {sn.get("channelTitle", "")}'
    if typ == "YouTubeLiveVideo" and sn.get("liveBroadcastContent") != "live":
        return "BAD", f"not live ({sn.get('liveBroadcastContent')}) {title}"
    return "OK", title


def main():
    frames_dir = tempfile.mkdtemp(prefix="feed-frames-")
    if "--frames" in sys.argv:
        frames_dir = sys.argv[sys.argv.index("--frames") + 1]
        os.makedirs(frames_dir, exist_ok=True)
    configs = sorted(glob.glob(os.path.join(ROOT, "src/configs/*.json")))
    cams = []
    for f in configs:
        for i, c in enumerate(json.load(open(f))["cameras"]):
            cams.append({"config": os.path.basename(f), "index": i, **c})
    yt_ids = [c["source"] for c in cams if c["type"].startswith("YouTube")]
    yt = yt_videos(yt_ids) if yt_ids else {}
    from concurrent.futures import ThreadPoolExecutor

    def run(c):
        t = c["type"]
        if t == "NYCTrafficVideo":
            return check_hls(c["source"], frames_dir)
        if t == "NYCTrafficImage":
            return check_tmc(c["source"], frames_dir)
        if t.startswith("YouTube"):
            return check_youtube(c["source"], t, yt)
        return "UNKNOWN", f"no checker for type {t}"

    with ThreadPoolExecutor(8) as ex:
        results = list(ex.map(run, cams))
    for c, (status, why) in zip(cams, results):
        c["status"], c["detail"] = status, why
    if "--json" in sys.argv:
        print(json.dumps(cams, indent=1))
    else:
        for c in cams:
            print(f'{c["status"]:8} {c["config"]:28} {c.get("label", ""):28} {c["source"]}  {c["detail"]}')
    bad = [c for c in cams if c["status"] == "BAD"]
    print(f"\n{len(cams)} cameras, {len(bad)} broken, "
          f"{sum(c['status'] == 'UNKNOWN' for c in cams)} unknown. frames in {frames_dir}", file=sys.stderr)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
