import React, { useState, useEffect } from "react";
import styled, { StyleSheetManager } from "styled-components";
import isPropValid from "@emotion/is-prop-valid";

import YouTubeLiveVideo from "./types/YouTubeLiveVideo";
import NYCTrafficImage from "./types/NYCTrafficImage";
import NYCTrafficVideo from "./types/NYCTrafficVideo";

import GLOBAL_AIRPORTS from "./configs/GLOBAL_AIRPORTS.json";
import NYC_TRAFFIC_VIDEOS from "./configs/NYC_TRAFFIC_VIDEOS.json";
import NYC_TRAFFIC_IMAGES from "./configs/NYC_TRAFFIC_IMAGES.json";

const CONFIGS = {
  GLOBAL_AIRPORTS,
  NYC_TRAFFIC_VIDEOS,
  NYC_TRAFFIC_IMAGES
};

const COMPONENTS = {
  YouTubeLiveVideo,
  NYCTrafficImage,
  NYCTrafficVideo
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

let CONFIG = CONFIGS.NYC_TRAFFIC_VIDEOS;
const queryParams = new URLSearchParams(window.location.search);
const configParam = queryParams.get("config");

if (window.location.hostname.includes("live-cameras")) {
  CONFIG = CONFIGS[configParam] || CONFIG;
}

if (configParam) {
  CONFIG = CONFIGS[configParam] || CONFIG;
}

const toTitleCase = (str) => {
  return str
    .split("_")
    .map((word) =>
      word === "NYC"
        ? "NYC"
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

const activeConfigName =
  Object.entries(CONFIGS).find(([_, value]) => value === CONFIG)?.[0] ||
  "Default Config";
document.title = toTitleCase(activeConfigName);

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
        {Object.keys(CONFIG).map((key) => {
          const CameraComponent = COMPONENTS[CONFIG[key].type];
          if (!CameraComponent) {
            console.error(
              `Component type "${CONFIG[key].type}" not found. Available components:`,
              Object.keys(COMPONENTS)
            );
            return null;
          }
          return (
            <CameraContainer key={key} isVisible={isVisible}>
              <CameraComponent source={CONFIG[key].source} />
              {CONFIG[key].label && <Label>{CONFIG[key].label}</Label>}
            </CameraContainer>
          );
        })}
      </Page>
    </StyleSheetManager>
  );
}

export default App;
