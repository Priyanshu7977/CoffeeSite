import React, { useEffect, useRef, useState } from 'react';

interface PageLoaderProps {
  onLoadingComplete: () => void;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isFading, setIsFading] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. Procedural Highland Mist & Morning Sunbeam Volumetrics on Coffee Farm
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Drifting mountain mist clouds
    const mistClouds = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      radius: Math.random() * 250 + 150,
      vx: Math.random() * 0.4 + 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      alpha: Math.random() * 0.25 + 0.1,
    }));

    // Floating golden dew particles
    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      vx: Math.random() * 0.3 - 0.15,
      vy: -Math.random() * 0.5 - 0.2,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Drifting Mountain Mist
      mistClouds.forEach((cloud) => {
        cloud.x += cloud.vx;
        cloud.y += cloud.vy;

        if (cloud.x - cloud.radius > width) {
          cloud.x = -cloud.radius;
        }

        const gradient = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          0,
          cloud.x,
          cloud.y,
          cloud.radius
        );
        gradient.addColorStop(0, `rgba(245, 218, 223, ${cloud.alpha * 0.6})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${cloud.alpha * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Floating Golden Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(245, 218, 223, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Loading Progression Timeline
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 2;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            onLoadingComplete();
          }, 800);
        }, 500);
      } else {
        setProgress(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  // Circumference for the circular progress ring (r = 46)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`fixed inset-0 z-[300] flex items-center justify-center select-none overflow-hidden transition-all duration-800 ease-in-out bg-[#0D0B0A] ${
        isFading
          ? 'opacity-0 scale-105 pointer-events-none filter blur-md'
          : 'opacity-100 scale-100'
      }`}
    >
      {/* 1. Full-Bleed Cinematic Coffee Farm Living Landscape */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Layer 1: High-Altitude Western Ghats Coffee Farm Canopy with Drone Sweep Motion */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=2000&auto=format&fit=crop&q=90"
            alt="Western Ghats Coffee Estate"
            className="h-full w-full object-cover object-center filter brightness-90 contrast-105 scale-105 animate-[pulse_6s_ease-in-out_infinite] transition-transform duration-[8000ms] ease-out transform scale-110"
            style={{
              animation: 'panDrone 10s ease-in-out infinite alternate',
            }}
          />
        </div>

        {/* Layer 2: Live Procedural Mountain Mist & Sunbeam Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none mix-blend-screen" />

        {/* Layer 3: Warm Anamorphic Lens Flare & Luxury Coffee Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B0A]/90 via-[#0D0B0A]/35 to-[#0D0B0A]/70" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#2D2926]/40 to-[#0D0B0A]/90 mix-blend-multiply" />
      </div>

      {/* 2. Minimalist Centerpiece: Pure Luxury Brand Logo & Circular Reveal (NO TEXT) */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Ambient Warm Golden Glow */}
          <div className="absolute h-44 w-44 sm:h-52 sm:w-52 rounded-full bg-[#F5DADF]/25 filter blur-2xl animate-pulse" />

          {/* SVG Circular Progress Ring */}
          <svg className="h-32 w-32 sm:h-36 sm:w-36 -rotate-90 transform">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="2.5"
            />
            {/* Active Filling Stroke */}
            <circle
              cx="50%"
              cy="50%"
              r={radius}
              fill="transparent"
              stroke="#F5DADF"
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
          </svg>

          {/* Center Luxury Emblem */}
          <div className="absolute h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/95 border border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col items-center justify-center text-[#2D2926] transition-transform duration-500 hover:scale-105">
            <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#2D2926]">
              N
            </span>
            <div className="h-[2.5px] w-4 bg-[#E05A7E] rounded-full mt-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
