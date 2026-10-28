import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Feather, HeartHandshake, TreePine, SunDim } from 'lucide-react';
import { SectionManifesto } from '../components/SectionManifesto';

export const ManifestoPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-[max(calc(env(safe-area-inset-top)+5.25rem),6.5rem)] sm:pt-28 md:pt-32 pb-4 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A]">
            The Terroir Manifesto • Est. 1998
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-8 pt-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] text-xs font-bold uppercase tracking-wider mb-3">
            <Feather className="h-3.5 w-3.5 text-[#E05A7E]" /> Roastery Philosophy
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#2D2926] tracking-tight">
            Coffee Without Compromise
          </h1>
          <p className="mt-4 text-[#5E5854] text-base leading-relaxed">
            In 1670, Baba Budan smuggled seven raw coffee seeds out of Yemen strapped to his chest, planting them in the misty Chandragiri hills of Karnataka. That sacred act began Indian coffee. We carry forward that lineage without dilution.
          </p>
        </div>

        {/* Existing SectionManifesto component */}
        <SectionManifesto />

        {/* Core Pillars */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white border border-[#2D2926]/10">
            <TreePine className="h-8 w-8 text-[#E05A7E] mb-4" />
            <h3 className="font-display font-bold text-xl text-[#2D2926]">
              Two-Tier Shade Canopy
            </h3>
            <p className="mt-2 text-sm text-[#5E5854] leading-relaxed">
              100% of our beans are grown under native silver oak, rosewood, and wild fig canopies. Shade decelerates cherry ripening by 40%, concentrating natural sugars and volatile aromatics.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#2D2926]/10">
            <SunDim className="h-8 w-8 text-[#E05A7E] mb-4" />
            <h3 className="font-display font-bold text-xl text-[#2D2926]">
              Monsoon Wind Maturation
            </h3>
            <p className="mt-2 text-sm text-[#5E5854] leading-relaxed">
              Our Malabar lots undergo historical 16-week curing open to moisture-laden Arabian sea breezes, transforming bean geometry, neutralizing sharp acids, and delivering deep fudge notes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#2D2926]/10">
            <HeartHandshake className="h-8 w-8 text-[#E05A7E] mb-4" />
            <h3 className="font-display font-bold text-xl text-[#2D2926]">
              Direct Tribal Micro-Fairness
            </h3>
            <p className="mt-2 text-sm text-[#5E5854] leading-relaxed">
              We bypass commercial commodity brokers entirely. We purchase entire harvests upfront directly from tribal cooperatives at 220% above Fair Trade minimum pricing.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
