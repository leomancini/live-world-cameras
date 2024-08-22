import React from "react";
import styled from "styled-components";
import ScanlineImage from "./components/Image";

const Page = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: calc(100vh - 4rem);
  font-size: 0;
  background: #000000;
  flex-direction: column;
  padding: 2rem;

  @media (max-width: 1000px) {
    height: unset;
    margin-bottom: 3rem;
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

const ImageWrapper = styled.div`
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
        <ImageWrapper>
          <ScanlineImage cameraId="195870e2-8714-45c6-86ba-8ae079ef738c" />
        </ImageWrapper>
        <ImageWrapper>
          <ScanlineImage cameraId="4b601090-d552-4c2c-804f-1360305f3dd5" />
        </ImageWrapper>
        <ImageWrapper>
          <ScanlineImage cameraId="6a5f91d8-042f-4678-a722-2c3c560dedf2" />
        </ImageWrapper>
      </Row>
      <Row>
        <ImageWrapper>
          <ScanlineImage cameraId="ba4a1b3a-6e33-4742-a471-18f204f488ef" />
        </ImageWrapper>
        <ImageWrapper>
          <ScanlineImage cameraId="8a60eb4e-4069-4c0f-9bca-b8cc52915ffb" />
        </ImageWrapper>
        <ImageWrapper>
          <ScanlineImage cameraId="b963b25c-9fcf-4a12-b502-c57468510315" />
        </ImageWrapper>
      </Row>
    </Page>
  );
}

export default App;
