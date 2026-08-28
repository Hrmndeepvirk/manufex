import { keyframes } from "styled-components";
import {
  fadeInRight,
  fadeInLeft,
  fadeIn,
  slideInDown,
  zoomIn,
  zoomOut,
  headShake,
} from "react-animations";

export const SlideInLeftAnimation = keyframes`${fadeInLeft}`;
export const SlideInRightAnimation = keyframes`${fadeInRight}`;
export const fadeInAnimation = keyframes`${fadeIn}`;
export const slideInDownAnimation = keyframes`${slideInDown}`;
export const zoomInAnimation = keyframes`${zoomIn}`;
export const zoomOutAnimation = keyframes`${zoomOut}`;
export const headShakeAnimation = keyframes`${headShake}`;
