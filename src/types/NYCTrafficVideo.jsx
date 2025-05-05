import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import styled from "styled-components";
import { Mask, Scanline, Color } from "../components/Overlay";

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-in;
  background: black;

  &.video-loaded {
    opacity: 1;
  }
`;

const AspectRatioContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: calc(240 / 320 * 100%);
  max-height: 100%;
`;

const VideoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  max-width: calc(100vh * (352 / 240));
  max-height: 100%;
  overflow: hidden;
`;

const ScaledWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 96%;
  height: 96%;
  transform: translate(-50%, -50%);
  overflow: hidden;

  .video-js {
    width: 100%;
    height: 100%;
  }

  .video-js video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ScanlineVideo = ({ source }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const initializePlayer = () => {
    if (!playerRef.current) {
      try {
        playerRef.current = videojs(videoRef.current, {
          controls: false,
          autoplay: true,
          muted: true,
          preload: "auto",
          fluid: true,
          playsinline: true,
          html5: {
            hls: {
              enableLowInitialPlaylist: true,
              smoothQualityChange: true,
              overrideNative: true
            }
          },
          sources: [
            {
              src: source,
              type: source.includes("playlist.m3u8")
                ? "application/x-mpegURL"
                : "video/mp4"
            }
          ]
        });

        playerRef.current.on("loadeddata", () => {
          setIsAvailable(true);
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.classList.add("video-loaded");
            }
          }, 1000);
        });

        playerRef.current.on("error", (error) => {
          setIsAvailable(false);
          if (playerRef.current) {
            playerRef.current.pause();
          }
          if (containerRef.current) {
            containerRef.current.classList.add("video-loaded");
          }
        });

        playerRef.current.ready(() => {
          const playPromise = playerRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Ignore play errors silently
            });
          }
        });

        const handleVisibilityChange = () => {
          if (document.hidden) {
            if (playerRef.current) {
              playerRef.current.pause();
            }
          } else {
            if (playerRef.current && !playerRef.current.paused()) {
              const playPromise = playerRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Ignore play errors silently
                });
              }
            }
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange
          );
        };
      } catch (error) {
        console.debug("Player initialization error:", error);
        setIsAvailable(false);
      }
    }
  };

  useEffect(() => {
    initializePlayer();
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose();
        } catch (error) {
          // Ignore errors
        }
        playerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  return (
    <VideoContainer ref={containerRef}>
      <AspectRatioContainer>
        <VideoWrapper>
          <Mask />
          <ScaledWrapper>
            <Scanline />
            <Color />
            <video ref={videoRef} className="video-js vjs-default-skin">
              <p className="vjs-no-js">
                To view this video please enable JavaScript, and consider
                upgrading to a web browser that supports HTML5 video
              </p>
            </video>
            {!isAvailable && <Placeholder />}
          </ScaledWrapper>
        </VideoWrapper>
      </AspectRatioContainer>
    </VideoContainer>
  );
};

export default ScanlineVideo;
