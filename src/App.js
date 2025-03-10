import React, { useState, useEffect } from "react";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

import NYCTrafficImage from "./types/NYCTrafficImage";
import NYCTrafficVideo from "./types/NYCTrafficVideo";
import YouTubeLiveVideo from "./types/YouTubeLiveVideo";
import YouTubeLoopingVideo from "./types/YouTubeLoopingVideo";

import WORLD_AIRPORTS from "./configs/WORLD_AIRPORTS.json";
import WORLD_CITIES from "./configs/WORLD_CITIES.json";
import US_CITIES from "./configs/US_CITIES.json";
import NYC_TRAFFIC_VIDEOS from "./configs/NYC_TRAFFIC_VIDEOS.json";
import NYC_TRAFFIC_IMAGES from "./configs/NYC_TRAFFIC_IMAGES.json";
import NYC_STREETS from "./configs/NYC_STREETS.json";
import NYC_OLD_STREETS from "./configs/NYC_OLD_STREETS.json";

const CONFIGS = {
  WORLD_AIRPORTS,
  WORLD_CITIES,
  US_CITIES,
  NYC_TRAFFIC_VIDEOS,
  NYC_TRAFFIC_IMAGES,
  NYC_STREETS,
  NYC_OLD_STREETS
};

const COMPONENTS = {
  NYCTrafficImage,
  NYCTrafficVideo,
  YouTubeLiveVideo,
  YouTubeLoopingVideo
};

const Page = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - 4rem);
  font-size: 0;
  background: #000000;
  flex-direction: column;
  padding: 1rem 2rem 2rem 2rem;

  @media (max-width: 1000px) {
    display: flex;
    flex-direction: column;
    height: unset;
    align-items: unset;
    padding: 0 0 2rem 0;
  }
`;

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? "visible" : "hidden")};
  transition: ${(props) =>
    props.isVisible ? "opacity 0.3s ease-in-out, visibility 0s" : "none"};
`;

const Label = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: -0.5rem;
  z-index: 2;
  font-weight: 500;
  font-family: "Overpass Mono", monospace;
`;

let CONFIG;
const queryParams = new URLSearchParams(window.location.search);
const configParam = queryParams.get("config");
const pathConfig = window.location.pathname.substring(1); // Remove leading slash

const formatConfigName = (name) => {
  if (!name) return null;
  // First replace global with world, then handle the formatting
  const formattedName = name
    .toLowerCase()
    .replace(/global/g, "world")
    .toUpperCase()
    .replace(/-/g, "_");
  return formattedName;
};

let configName = formatConfigName(configParam);
if (!configName && pathConfig) {
  configName = formatConfigName(pathConfig);
}

if (window.location.hostname.includes("live-world-cameras")) {
  CONFIG =
    configName && CONFIGS[configName] ? CONFIGS[configName] : CONFIGS.US_CITIES;
} else {
  CONFIG =
    configName && CONFIGS[configName]
      ? CONFIGS[configName]
      : CONFIGS.NYC_TRAFFIC_VIDEOS;
}

document.title = CONFIG.metadata.name;

const shouldForwardProp = (prop) => isPropValid(prop) && prop !== "isVisible";

function App() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Hide immediately when tab becomes hidden
        setIsVisible(false);
      } else {
        // Show after delay when tab becomes visible
        setTimeout(() => {
          setIsVisible(true);
        }, 500);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <Page>
        {CONFIG.cameras.map((camera, index) => {
          const CameraComponent = COMPONENTS[camera.type];
          if (!CameraComponent) {
            console.error(
              `Component type "${camera.type}" not found. Available components:`,
              Object.keys(COMPONENTS)
            );
            return null;
          }
          return (
            <CameraContainer key={index} isVisible={isVisible}>
              <CameraComponent
                source={camera.source}
                startTime={camera.startTime}
                zoom={camera.zoom}
              />
              {camera.label && <Label>{camera.label}</Label>}
            </CameraContainer>
          );
        })}
      </Page>
    </StyleSheetManager>
  );
}

export default App;
