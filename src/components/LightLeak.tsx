import React from 'react';

interface LightLeakProps {
  position?: 'top-right' | 'bottom-left' | 'center' | 'top-left';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

export const LightLeak: React.FC<LightLeakProps> = ({
  position = 'top-right',
  intensity = 'subtle',
  className = '',
}) => {
  const positionClasses = {
    'top-right': 'top-[-15%] right-[-10%] w-[50vw] h-[50vw]',
    'bottom-left': 'bottom-[-15%] left-[-10%] w-[50vw] h-[50vw]',
    'top-left': 'top-[-15%] left-[-10%] w-[50vw] h-[50vw]',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw]',
  };

  const intensityClasses = {
    subtle: 'opacity-25',
    medium: 'opacity-40',
    strong: 'opacity-60',
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full bg-radial-at-c from-[#F5DADF]/50 via-[#E05A7E]/10 to-transparent mix-blend-multiply will-change-transform ${positionClasses[position]} ${intensityClasses[intensity]} ${className}`}
    />
  );
};
