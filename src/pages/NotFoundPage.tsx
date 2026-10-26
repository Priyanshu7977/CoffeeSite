import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] flex flex-col items-center justify-center p-6 text-center">
      <div className="h-20 w-20 rounded-3xl bg-white border border-[#2D2926]/10 shadow-lg flex items-center justify-center text-[#E05A7E] mb-6">
        <Coffee className="h-10 w-10 animate-bounce" />
      </div>
      <div className="font-mono text-sm uppercase tracking-widest text-[#8C827A] mb-2">
        Error 404 • Terroir Not Found
      </div>
      <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#2D2926] max-w-md">
        The Extraction Path Has Drifted
      </h1>
      <p className="mt-4 text-sm sm:text-base text-[#5E5854] max-w-md">
        The lot or page you are looking for has been relocated or archived in our cellar.
      </p>

      <div className="mt-8 flex flex-wrap gap-4 justify-center">
        <Link
          to="/"
          className="px-6 py-3 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-xs flex items-center gap-2 hover:bg-black transition-colors shadow-md"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/collection"
          className="px-6 py-3 rounded-full bg-white border border-[#2D2926]/15 text-[#2D2926] font-bold text-xs flex items-center gap-2 hover:bg-neutral-100 transition-colors"
        >
          <Compass className="h-4 w-4 text-[#E05A7E]" />
          <span>Explore 10 Coffee Lots</span>
        </Link>
      </div>
    </div>
  );
};
