import styled from "styled-components";
import maskImage from "../assets/mask.svg";

export const Mask = styled.div`
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

export const Scanline = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 96%;
  height: 96%;
  transform: translate(-50%, -50%);
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.2) 2px,
    rgba(0, 0, 0, 0.2) 4px
  );
  pointer-events: none;
  z-index: 3;
  mix-blend-mode: overlay;
`;

export const Color = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(0, 0, 0, 0.25) 70%
  );
  mix-blend-mode: overlay;
  z-index: 2;
`;
