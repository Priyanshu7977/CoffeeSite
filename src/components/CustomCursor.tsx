import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/animations';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only enable on desktop/hover pointer devices
    if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const halo = haloRef.current;

    if (!cursor || !dot || !halo) return;

    // Use GSAP quickTo for ultra-smooth 120fps hardware-accelerated tracking
    const setDotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    const setHaloX = gsap.quickTo(halo, 'x', { duration: 0.35, ease: 'power3.out' });
    const setHaloY = gsap.quickTo(halo, 'y', { duration: 0.35, ease: 'power3.out' });

    let isHoveringInteractive = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Unhide cursor on first move
      gsap.set(cursor, { opacity: 1 });

      setDotX(x);
      setDotY(y);
      setHaloX(x);
      setHaloY(y);

      // Calculate velocity for organic droplet stretch
      const dx = x - lastX;
      const dy = y - lastY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = Math.min(1.45, 1 + distance * 0.008);
      const squeeze = 1 / Math.sqrt(stretch);

      if (!isHoveringInteractive && distance > 2) {
        gsap.to(halo, {
          rotation: angle,
          scaleX: stretch,
          scaleY: squeeze,
          duration: 0.15,
          ease: 'power1.out',
          overwrite: 'auto',
        });
      }

      lastX = x;
      lastY = y;

      // Check for interactive targets directly without React re-render overhead
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest('button, a, input, textarea, select, [role="button"], [data-cursor]');

      if (interactive && !isHoveringInteractive) {
        isHoveringInteractive = true;
        gsap.to(halo, {
          scale: 1.85,
          scaleX: 1.85,
          scaleY: 1.85,
          rotation: 0,
          backgroundColor: 'rgba(245, 218, 223, 0.45)',
          borderColor: '#E05A7E',
          boxShadow: '0 0 20px rgba(224, 90, 126, 0.3)',
          duration: 0.3,
          ease: 'back.out(2)',
        });
        gsap.to(dot, {
          scale: 0.5,
          duration: 0.2,
        });
      } else if (!interactive && isHoveringInteractive) {
        isHoveringInteractive = false;
        gsap.to(halo, {
          scale: 1.0,
          scaleX: 1.0,
          scaleY: 1.0,
          backgroundColor: 'rgba(245, 218, 223, 0.15)',
          borderColor: 'rgba(224, 90, 126, 0.35)',
          boxShadow: '0 0 8px rgba(245, 218, 223, 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        });
        gsap.to(dot, {
          scale: 1.0,
          duration: 0.2,
        });
      }
    };

    const onMouseDown = () => {
      gsap.to([dot, halo], {
        scale: 0.8,
        duration: 0.12,
        ease: 'power2.inOut',
      });
    };

    const onMouseUp = () => {
      gsap.to([dot, halo], {
        scale: isHoveringInteractive ? 1.85 : 1.0,
        duration: 0.3,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    const onMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[500] overflow-hidden opacity-0 transition-opacity duration-300 hidden md:block"
    >
      {/* Outer Spring/Inertial Halo with Liquid Velocity Stretch */}
      <div
        ref={haloRef}
        className="fixed top-0 left-0 -ml-4 -mt-4 h-8 w-8 rounded-full border border-[#E05A7E]/40 bg-[#F5DADF]/15 will-change-transform"
      />

      {/* Center Laser-Sharp Espresso Core Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-[#2D2926] shadow-[0_0_6px_#E05A7E] will-change-transform"
      />
    </div>
  );
};
