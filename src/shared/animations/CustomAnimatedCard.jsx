import React from "react";
import { zoomInAnimation } from "./ReactAnimations";
import { styled } from "styled-components";
const Div = styled.div`
  animation: ${zoomInAnimation} ${({ time }) => `${(time * 10) / 120}s`} both;
`;

export default function CustomAnimatedCard({ index = 3, children, ...props }) {
  return (
    <Div time={index} {...props}>
      {children}
    </Div>
  );
}
