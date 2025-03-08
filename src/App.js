import React from "react";
import styled from "styled-components";

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
    margin-top: 0.5rem;
    margin-bottom: 2.5rem;
    padding: 0;
  }
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

function App() {
  return (
    <Page>
      {Object.keys(CONFIG).map((key) => {
        const Component = COMPONENTS[CONFIG[key].type];
        if (!Component) {
          console.error(
            `Component type "${CONFIG[key].type}" not found. Available components:`,
            Object.keys(COMPONENTS)
          );
          return null;
        }
        return <Component key={key} source={CONFIG[key].source} />;
      })}
    </Page>
  );
}

export default App;
