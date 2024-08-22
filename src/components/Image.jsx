import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const maskSvg = `
<svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="blur">
      <feGaussianBlur stdDeviation="4" />
    </filter>
  </defs>
  <path d="M6.6912 43.8549C10.3552 23.4383 27.2038 7.98307 47.8601 6.09062L62.5107 4.74838C126.037 -1.07169 189.963 -1.07169 253.489 4.74838L268.14 6.09061C288.796 7.98307 305.645 23.4383 309.309 43.8549V43.8549C317.041 86.9408 317.041 131.059 309.309 174.145V174.145C305.645 194.562 288.796 210.017 268.14 211.909L253.489 213.252C189.963 219.072 126.037 219.072 62.5107 213.252L47.8601 211.909C27.2039 210.017 10.3552 194.562 6.6912 174.145V174.145C-1.04117 131.059 -1.04117 86.9408 6.6912 43.8549V43.8549Z" fill="white" filter="url(#blur)"/>
</svg>
`;

const StyledCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  mask-image: url("data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}");
  -webkit-mask-image: url("data:image/svg+xml;utf8,${encodeURIComponent(
    maskSvg
  )}");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
`;

const ScanlineOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(255, 255, 255, 0.1) 1.5px,
    rgba(255, 255, 255, 0.1) 3px
  );
  pointer-events: none;
  mask-image: url("data:image/svg+xml;utf8,${encodeURIComponent(maskSvg)}");
  -webkit-mask-image: url("data:image/svg+xml;utf8,${encodeURIComponent(
    maskSvg
  )}");
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
`;

const ScanlineImage = ({ cameraId }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();

    const updateImage = () => {
      const newUrl = `https://webcams.nyctmc.org/api/cameras/${cameraId}/image?t=${new Date().getTime()}`;
      image.src = newUrl;
    };

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
    };

    updateImage();

    const refreshInterval = setInterval(updateImage, 2000);

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line
  }, []);

  return (
    <ImageContainer>
      <StyledCanvas ref={canvasRef} />
      <ScanlineOverlay />
    </ImageContainer>
  );
};

export default ScanlineImage;
