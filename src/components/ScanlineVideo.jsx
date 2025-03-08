import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import styled from "styled-components";
import { Mask, ScanlineOverlay } from "./Scanline";

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.5s ease-in;

  &.video-loaded {
    opacity: 1;
  }

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

const ScanlineVideo = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: false,
        autoplay: true,
        muted: true,
        preload: "auto",
        fluid: true,
        playsinline: true,
        sources: [
          {
            src: src,
            type: src.includes("playlist.m3u8")
              ? "application/x-mpegURL"
              : "video/mp4"
          }
        ]
      });

      // Add loaded event listener with delay
      playerRef.current.on("loadeddata", () => {
        setTimeout(() => {
          containerRef.current.classList.add("video-loaded");
        }, 1000); // Wait 1 second before fading in
      });

      // Force play on player ready
      playerRef.current.ready(() => {
        playerRef.current.play();
      });
    }

    // Dispose the Video.js player when the component unmounts
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <VideoContainer ref={containerRef}>
      <Mask />
      <ScanlineOverlay />
      <video ref={videoRef} className="video-js vjs-default-skin">
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to
          a web browser that supports HTML5 video
        </p>
      </video>
    </VideoContainer>
  );
};

export default ScanlineVideo;
