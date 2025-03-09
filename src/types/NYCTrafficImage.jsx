import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Mask, Scanline, Color } from "../components/Overlay";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  aspect-ratio: 352 / 240;
`;

const ScanlineImage = ({ source }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const updateImage = () => {
      const newUrl = `https://webcams.nyctmc.org/api/cameras/${source}/image?t=${new Date().getTime()}`;
      setImageUrl(newUrl);
    };

    updateImage(); // Initial update
    const refreshInterval = setInterval(updateImage, 2000);

    return () => clearInterval(refreshInterval);
  }, [source]);

  return (
    <ImageContainer>
      <Mask />
      <Scanline />
      <Color />
      {imageUrl && <StyledImage src={imageUrl} alt="Camera feed" />}
    </ImageContainer>
  );
};

export default ScanlineImage;
