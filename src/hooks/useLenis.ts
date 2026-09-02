import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger, gsap } from '../utils/animations';

let globalLenis: Lenis | null = null;

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Enable mobile resize resilience for iOS Safari & Chrome address bar transitions
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load,resize',
    });

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      syncTouch: false, // Preserves hardware-accelerated 120Hz native touch on iOS/Android
      touchMultiplier: 1.0,
      autoResize: true,
    });

    lenisRef.current = lenis;
    globalLenis = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // GSAP Ticker integration for 60fps / 120fps stutter-free sync
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33); // Smooth lag recovery if frame drops occur

    // Refresh ScrollTrigger after initial layout settles
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    // Also handle mobile orientation / resize changes cleanly
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
      lenis.destroy();
      lenisRef.current = null;
      globalLenis = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement, offset: number = 0) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset, duration: 1.2 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return { lenis: lenisRef.current, scrollTo };
}

export function getGlobalLenis() {
  return globalLenis;
}
