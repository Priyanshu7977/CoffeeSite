import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASINGS = {
  cinematic: 'power3.out',
  smooth: 'power2.inOut',
  slowMo: 'power4.out',
  expo: 'expo.out',
};
