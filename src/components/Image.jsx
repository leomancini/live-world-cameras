import React, { useState, useEffect } from "react";
import styled from "styled-components";
import maskImage from "../assets/mask.svg";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${maskImage});
  background-size: 100%;
  pointer-events: none;
  z-index: 3;
`;

const ScanlineOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(255, 225, 255, 0.2) 2px,
    rgba(255, 225, 255, 0.2) 4px
  );
  pointer-events: none;
  z-index: 2;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  aspect-ratio: 352 / 240;
`;

const ScanlineImage = ({ cameraId }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const updateImage = () => {
      const newUrl = `https://webcams.nyctmc.org/api/cameras/${cameraId}/image?t=${new Date().getTime()}`;
      setImageUrl(newUrl);
    };

    updateImage(); // Initial update
    const refreshInterval = setInterval(updateImage, 2000);

    return () => clearInterval(refreshInterval);
  }, [cameraId]);

  return (
    <ImageContainer>
      <Mask />
      <ScanlineOverlay />
      {imageUrl && <StyledImage src={imageUrl} alt="Camera feed" />}
    </ImageContainer>
  );
};

export default ScanlineImage;
