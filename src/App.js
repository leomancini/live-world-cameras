import React from "react";
import styled from "styled-components";
import NYCTrafficVideo from "./types/NYCTrafficVideo";

const Page = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - 4rem);
  font-size: 0;
  background: #000000;
  flex-direction: column;
  padding: 1rem 2rem 2rem 2rem;

  @media (max-width: 1000px) {
    height: unset;
    margin-top: 0.5rem;
    margin-bottom: 2.5rem;
    padding: 0;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const CameraWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <Page>
      <Row>
        <CameraWrapper>
          <NYCTrafficVideo src="https://s51.nysdot.skyvdn.com:443/rtplive/R11_127/playlist.m3u8" />
        </CameraWrapper>
        <CameraWrapper>
          <NYCTrafficVideo src="https://s53.nysdot.skyvdn.com:443/rtplive/R11_083/playlist.m3u8" />
        </CameraWrapper>
        <CameraWrapper>
          <NYCTrafficVideo src="https://s51.nysdot.skyvdn.com:443/rtplive/R11_070/playlist.m3u8" />
        </CameraWrapper>
      </Row>
      <Row>
        <CameraWrapper>
          <NYCTrafficVideo src="https://s51.nysdot.skyvdn.com:443/rtplive/R11_122/playlist.m3u8" />
        </CameraWrapper>
        <CameraWrapper>
          <NYCTrafficVideo src="https://s9.nysdot.skyvdn.com:443/rtplive/R11_296/playlist.m3u8" />
        </CameraWrapper>
        <CameraWrapper>
          <NYCTrafficVideo src="https://s9.nysdot.skyvdn.com:443/rtplive/R11_223/playlist.m3u8" />
        </CameraWrapper>
      </Row>
    </Page>
  );
}

export default App;
