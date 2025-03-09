import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Mask, Scanline, Color } from "../components/Overlay";

const ImageContainer = styled.div`
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

  &.image-loaded {
    opacity: 1;
  }
`;

const AspectRatioContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: calc(240 / 320 * 100%);
  max-height: 100%;
`;

const ImageWrapper = styled.div`
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

const StyledImage = styled.img`
  width: 110%;
  height: 110%;
  object-fit: cover;
  position: absolute;
  top: -5%;
  left: -5%;
`;

const ScanlineImage = ({ source }) => {
  const [imageUrl, setImageUrl] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const updateImage = () => {
      const newUrl = `https://webcams.nyctmc.org/api/cameras/${source}/image?t=${new Date().getTime()}`;
      setImageUrl(newUrl);
    };

    updateImage();
    const refreshInterval = setInterval(updateImage, 2000);

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.add("image-loaded");
      }
    }, 1000);

    return () => clearInterval(refreshInterval);
  }, [source]);

  return (
    <ImageContainer ref={containerRef}>
      <AspectRatioContainer>
        <ImageWrapper>
          <Mask />
          <ScaledWrapper>
            <Scanline />
            <Color />
            {imageUrl && <StyledImage src={imageUrl} alt="Camera feed" />}
          </ScaledWrapper>
        </ImageWrapper>
      </AspectRatioContainer>
    </ImageContainer>
  );
};

export default ScanlineImage;
