import React, { useEffect, useRef, useState } from "react";
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
`;

const InnerWrapper = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 120%;
  height: 120%;
  overflow: hidden;
  pointer-events: none;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(1.3);
    transform-origin: center center;
    border: 0;
    pointer-events: none;
  }
`;

const YouTubeLoopingVideo = ({ source, startTime = 0, zoom = 1.3 }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [playerId] = useState(
    () => `youtube-player-${Math.random().toString(36).substr(2, 9)}`
  );

  useEffect(() => {
    // Load YouTube IFrame Player API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    const initPlayer = () => {
      playerRef.current = new window.YT.Player(playerId, {
        videoId: source,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          modestbranding: 1,
          mute: 1,
          playsinline: 1,
          rel: 0,
          start: startTime,
          loop: 1
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            if (containerRef.current) {
              containerRef.current.classList.add("video-loaded");
            }
          },
          onStateChange: (event) => {
            // YT.PlayerState.ENDED = 0
            if (event.data === 0) {
              event.target.seekTo(startTime);
              event.target.playVideo();
            }
          }
        }
      });
    };

    // Initialize player if API is already loaded
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Chain the API ready handlers to support multiple instances
      const oldReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (oldReady) oldReady();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [source, startTime, playerId]);

  return (
    <VideoContainer ref={containerRef}>
      <AspectRatioContainer>
        <VideoWrapper>
          <Mask />
          <ScaledWrapper>
            <Scanline />
            <Color />
            <InnerWrapper>
              <div
                id={playerId}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  pointerEvents: "none"
                }}
              />
            </InnerWrapper>
          </ScaledWrapper>
        </VideoWrapper>
      </AspectRatioContainer>
    </VideoContainer>
  );
};

export default YouTubeLoopingVideo;
