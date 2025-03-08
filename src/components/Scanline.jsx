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

export const ScanlineOverlay = styled.div`
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
