import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Coffee, 
  Compass, 
  Flame, 
  GraduationCap, 
  Heart, 
  ShieldCheck, 
  Award, 
  Users, 
  ArrowRight,
  Quote,
  RotateCw,
  FlaskConical
} from 'lucide-react';
import { gsap } from '../utils/animations';

export const AboutUsPage: React.FC = () => {
  const navigate = useNavigate();

  // Refs for landing block animations
  const heroBadgeRef = useRef<HTMLDivElement | null>(null);
  const heroHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const heroTextRef = useRef<HTMLParagraphElement | null>(null);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  const founderImageRef = useRef<HTMLDivElement | null>(null);
  const founderTextRef = useRef<HTMLDivElement | null>(null);

  const timelineHeaderRef = useRef<HTMLDivElement | null>(null);
  const timelineCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Refs & state for 4 Noir Commandments landing & scroll-flip
  const commandmentsSectionRef = useRef<HTMLElement | null>(null);
  const commandmentsHeaderRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  // State to track which cards are flipped (index: boolean)
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({
    0: false,
    1: false,
    2: false,
    3: false,
  });

  const commandments = [
    {
      id: 0,
      num: '01',
      title: 'Student Curiosity & Science',
      tagline: 'Thermodynamics over Dogma',
      frontDesc: 'We question ancient roasting dogmas. We analyze convective heat transfer and optical Brix levels to unlock the truest natural terroir.',
      backStory: 'In hostel room 304, we rigged Arduino thermocouple sensors to measure convective airflow inside our drum, unlocking delicate jasmine florality without burning the bean oils.',
      metric: '14°C/min Precision Delta-T',
      badge: 'Arduino Lab Tested',
      icon: FlaskConical,
      accent: '#E05A7E',
    },
    {
      id: 1,
      num: '02',
      title: 'Direct Farmer Dignity',
      tagline: 'No Middlemen, No Supply Leakage',
      frontDesc: 'No brokers, no corporate commodity chains. We pay 380% above C-Market rates directly to smallholder tribal families in Chikmagalur and Araku.',
      backStory: 'We transfer payments directly via UPI to tribal estate stewards without middlemen commission. 100% of our premium directly funds organic biodynamic soil rejuvenation.',
      metric: '+380% Over Commodity Index',
      badge: 'Direct UPI Settlement',
      icon: Heart,
      accent: '#C89658',
    },
    {
      id: 2,
      num: '03',
      title: 'Zero Chicory, Zero Bullshit',
      tagline: '100% Pure Western Ghats Arabica',
      frontDesc: '100% shade-grown Arabica. Never blended with artificial colorants, synthetic chicory powders, or stale low-grade commercial filler beans.',
      backStory: 'We sent our roasted batches to an independent NABL-accredited food testing lab in Bengaluru to certify 0.00% chicory, 0% added sugar, and 100% pure single-estate Arabica.',
      metric: '0.00% Chicory Certified',
      badge: 'NABL Lab Certified',
      icon: ShieldCheck,
      accent: '#E05A7E',
    },
    {
      id: 3,
      num: '04',
      title: 'Accessible Haute Quality',
      tagline: 'Grand Cru Coffee For Every Student',
      frontDesc: 'World-class grand cru coffee shouldn’t require an elitist velvet rope. We price fairly so college students, creators, and night owls can drink competition coffee daily.',
      backStory: 'By eliminating massive retail real estate overheads, we deliver competition-grade SCA 94.5+ coffees across India for less than a mediocre corporate cafe cup.',
      metric: 'SCA 94.5+ Grand Cru',
      badge: 'Fair Student Price',
      icon: Users,
      accent: '#C89658',
    },
  ];

  const handleManualToggleFlip = (index: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Landing Block Animation
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (heroBadgeRef.current) {
        heroTl.fromTo(heroBadgeRef.current, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
      }
      if (heroHeadingRef.current) {
        heroTl.fromTo(heroHeadingRef.current, { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3');
      }
      if (heroTextRef.current) {
        heroTl.fromTo(heroTextRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.4');
      }
      if (metricsRef.current) {
        heroTl.fromTo(
          metricsRef.current.children,
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
          '-=0.3'
        );
      }

      // 2. Founder Section Landing Animation
      if (founderImageRef.current && founderTextRef.current) {
        gsap.fromTo(
          founderImageRef.current,
          { x: -50, opacity: 0, scale: 0.96 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderImageRef.current,
              start: 'top 80%',
            },
          }
        );

        gsap.fromTo(
          founderTextRef.current,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: founderTextRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // 3. Timeline Cards Landing Animation
      if (timelineHeaderRef.current) {
        gsap.fromTo(
          timelineHeaderRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: timelineHeaderRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      const validTimelineCards = timelineCardsRef.current.filter(Boolean);
      if (validTimelineCards.length > 0) {
        gsap.fromTo(
          validTimelineCards,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: validTimelineCards[0],
              start: 'top 85%',
            },
          }
        );
      }

      // 4. THE 4 NOIR COMMANDMENTS: SMOOTH LANDING ENTRANCE ANIMATION
      const commandmentsSection = commandmentsSectionRef.current;
      const validCards = cardElementsRef.current.filter(Boolean);

      if (commandmentsSection && validCards.length === 4) {
        if (commandmentsHeaderRef.current) {
          gsap.fromTo(
            commandmentsHeaderRef.current,
            { y: 35, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: commandmentsSection,
                start: 'top 80%',
              },
            }
          );
        }

        // When the section scrolls into view, ALL 4 CARDS LAND SMOOTHLY TOGETHER
        gsap.fromTo(
          validCards,
          { y: 60, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: commandmentsSection,
              start: 'top 75%',
            },
          }
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#E05A7E] selection:text-white pb-28">
      {/* 1. Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-18 sm:pt-20 pb-3 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-xs font-mono text-[#8C827A] hidden sm:inline">
              / THE STUDENT STARTUP STORY
            </span>
          </div>

          <button
            onClick={() => navigate('/contact')}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#2D2926] text-[#FAF7F5] text-xs font-bold hover:bg-black transition-colors cursor-pointer"
          >
            <span className="hidden sm:inline">Talk to Founders</span>
            <span className="sm:hidden">Contact</span>
            <ArrowRight className="h-3 w-3 text-[#E05A7E]" />
          </button>
        </div>
      </div>

      {/* 2. Hero Section: The College Dorm Room Origin */}
      <section className="relative px-4 sm:px-8 pt-12 pb-16 overflow-hidden border-b border-[#2D2926]/10">
        <div className="mx-auto max-w-4xl text-center">
          <div 
            ref={heroBadgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-xs font-bold tracking-wider uppercase mb-5 shadow-sm"
          >
            <GraduationCap className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>A College Student Startup • Bengaluru, India</span>
          </div>

          <h1 
            ref={heroHeadingRef}
            className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#2D2926] leading-[1.08] mb-6"
          >
            From 2 A.M. Hostel Cramming to <br className="hidden sm:inline" />
            <span className="italic text-[#E05A7E]">India's Most Obsessive</span> Coffee Roastery.
          </h1>

          <p 
            ref={heroTextRef}
            className="max-w-2xl mx-auto text-[#5E5854] text-base sm:text-lg leading-relaxed font-sans font-normal mb-8"
          >
            We didn’t start Noir Roast in a high-rise corporate boardroom. We started it with an electric hot-plate in a cramped engineering college hostel room, fueled by sleepless exam nights, borrowed motorbikes, and an absolute rebellion against terrible instant powder.
          </p>

          {/* Quick Metrics Bar */}
          <div 
            ref={metricsRef}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-4"
          >
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#E05A7E] block">Room 304</span>
              <span className="text-[11px] font-mono text-[#8C827A] uppercase">Hostel Lab Origin</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#2D2926] block">1,900m</span>
              <span className="text-[11px] font-mono text-[#8C827A] uppercase">Western Ghats Peak</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-[#C89658] block">0% Chicory</span>
              <span className="text-[11px] font-mono text-[#8C827A] uppercase">100% Pure Arabica</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 shadow-sm text-center">
              <span className="text-2xl sm:text-3xl font-display font-bold text-emerald-600 block">+380%</span>
              <span className="text-[11px] font-mono text-[#8C827A] uppercase">Direct Trade Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Founder & The Real Journey (Real Male Photo) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Founder Image: Real Young Guy / Founder Portrait */}
          <div ref={founderImageRef} className="lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border-2 border-[#2D2926] shadow-[0_20px_50px_rgba(45,41,38,0.15)] group">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=85"
                alt="Priyanshu Singh — Founder & Head Roaster"
                className="w-full aspect-[4/5] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D2926]/90 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5DADF] block mb-1 font-bold">
                  FOUNDER & HEAD ROASTER
                </span>
                <h3 className="font-display text-2xl font-bold">Priyanshu Singh</h3>
                <p className="text-xs text-white/80 mt-1">
                  Final Year College Student & Specialty Coffee Roaster • Bengaluru
                </p>
              </div>
            </div>
          </div>

          {/* Founder's Story & Letter */}
          <div ref={founderTextRef} className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-[#E05A7E] uppercase font-bold mb-3">
              <Quote className="h-4 w-4" />
              <span>THE FOUNDER'S LETTER</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D2926] leading-tight mb-5">
              "We realized India grows some of the world's greatest coffee, but our own generation was being handed bitter chicory dust."
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#5E5854] leading-relaxed font-sans font-normal">
              <p>
                During our first year of college in Bengaluru, late-night coding sessions and semester exams meant surviving on ₹10 instant coffee sachets. It was bitter, scorched, and full of industrial fillers. We drank it because we had to stay awake, not because we enjoyed it.
              </p>

              <p>
                One weekend, three of us pooled our month's pocket money, borrowed an old Royal Enfield, and rode up into the mist-covered peaks of Chikmagalur. We knocked on the gates of a 4th-generation coffee plantation and asked the planter to taste real coffee right off the drying beds.
              </p>

              <p>
                When he poured us a fresh, light-medium roast of shade-grown Baba Budan Arabica, our world tilted on its axis. It didn't taste bitter—it tasted like wild jasmine, bittersweet dark chocolate, and stewed figs. We were stunned: <strong className="text-[#2D2926]">India produces world-class grand-cru coffee, yet 95% of it was exported to European cafes while college students drank factory dust.</strong>
              </p>

              <p>
                We pledged right there to change that forever. We bought our first 10kg sack of green beans, strapped it to the motorcycle tank, rode back to our college hostel, and started <strong className="text-[#2D2926]">Noir Roast</strong>.
              </p>
            </div>

            <div className="pt-6 border-t border-[#2D2926]/10 mt-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-[#F5DADF] flex items-center justify-center text-[#E05A7E] font-display font-bold">
                PS
              </div>
              <div>
                <span className="font-display font-bold text-sm text-[#2D2926] block">Priyanshu Singh</span>
                <span className="text-xs text-[#8C827A] font-mono">Founder, Noir Roast • priyanshubipin2006@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Student Startup Journey Timeline */}
      <section className="bg-white border-y border-[#2D2926]/10 py-16 px-4 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div ref={timelineHeaderRef} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-2">
              OUR CHRONICLE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D2926]">
              From Hostel Room 304 to The Roastery
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#5E5854]">
              How three broke college dreamers built an uncompromised Indian specialty coffee brand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Step 1 */}
            <div 
              ref={(el) => { timelineCardsRef.current[0] = el; }}
              className="p-6 rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 shadow-sm relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] text-xs font-mono font-bold">
                  OCT 2023 • SEMESTER 1
                </span>
                <Flame className="h-4 w-4 text-[#E05A7E]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                The Popcorn-Popper Roaster
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                We modified an electric hot-air popcorn popper with hand-soldered thermocouple sensors to roast 100g sample batches in hostel room 304. Soon, the entire floor was knocking on our door at 2:00 A.M. with ceramic mugs during finals week.
              </p>
            </div>

            {/* Step 2 */}
            <div 
              ref={(el) => { timelineCardsRef.current[1] = el; }}
              className="p-6 rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 shadow-sm relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/20 text-[#2D2926] text-xs font-mono font-bold">
                  SUMMER 2024 • SEMESTER 3
                </span>
                <Compass className="h-4 w-4 text-[#C89658]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                The Western Ghats Expedition
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                While friends took corporate summer internships, we hitchhiked across Chikmagalur, Coorg, and Araku Valley. We spent weeks in muddy boots with generational planters, convincing them to allocate their rarest 50kg micro-lots directly to us.
              </p>
            </div>

            {/* Step 3 */}
            <div 
              ref={(el) => { timelineCardsRef.current[2] = el; }}
              className="p-6 rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 shadow-sm relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#FAF7F5] border border-[#2D2926]/20 text-[#2D2926] text-xs font-mono font-bold">
                  EARLY 2025 • SEMESTER 5
                </span>
                <Coffee className="h-4 w-4 text-[#E05A7E]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                The Indiranagar Garage Studio
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                We scraped together our college prize money and savings to rent a tiny 200 sq.ft garage in Indiranagar, Bengaluru. We installed our first commercial cast-iron convective drum. Our first 500 numbered tins sold out in 38 minutes flat.
              </p>
            </div>

            {/* Step 4 */}
            <div 
              ref={(el) => { timelineCardsRef.current[3] = el; }}
              className="p-6 rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 shadow-sm relative"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#2D2926] text-white text-xs font-mono font-bold">
                  TODAY • 2026
                </span>
                <Award className="h-4 w-4 text-[#C89658]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#2D2926] mb-2">
                The Modern Dakshin Roastery
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed">
                Today, Noir Roast partners directly with 4 premier single-estate farms across South India. We roast 94.5+ SCA cupping score micro-lots daily, maintaining 100% student independence, direct trade ethics, and zero compromises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. THE 4 NOIR COMMANDMENTS: LANDING & SCROLL-FLIP ANIMATION SECTION */}
      <section 
        id="section-commandments"
        ref={commandmentsSectionRef}
        className="mx-auto max-w-7xl px-4 sm:px-8 py-20 overflow-visible"
      >
        <div ref={commandmentsHeaderRef} className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-2">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D2926]">
            The 4 Noir Commandments
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5E5854]">
            Every single bean we roast is governed by four non-negotiable rules.
          </p>

          {/* Interactive Flip Guide */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5DADF]/60 border border-[#2D2926]/10 text-[11px] font-mono text-[#2D2926]">
            <RotateCw className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>Click or tap any card to flip and reveal the core coffee commandment</span>
          </div>
        </div>

        {/* 4 Cards Grid with 3D Flip capability */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {commandments.map((cmd) => {
            const isFlipped = flippedCards[cmd.id];
            const IconComp = cmd.icon;

            return (
              <div
                key={cmd.id}
                ref={(el) => { cardElementsRef.current[cmd.id] = el; }}
                style={{ perspective: '1200px' }}
                className="h-[360px] cursor-pointer group"
                onClick={() => handleManualToggleFlip(cmd.id)}
              >
                {/* 3D Flipper Box */}
                <div
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  className="relative w-full h-full rounded-3xl"
                >
                  {/* FRONT FACE (Dossier & Student Story - Shown First) */}
                  <div
                    style={{ backfaceVisibility: 'hidden' }}
                    className="absolute inset-0 rounded-3xl bg-[#2D2926] text-[#FAF7F5] border border-white/10 p-6 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-[#F5DADF]">
                          {cmd.badge}
                        </span>
                        <span className="text-xs font-mono text-white/50">RULE {cmd.num} DOSSIER</span>
                      </div>

                      <span className="text-[10px] font-mono uppercase text-[#C89658] font-bold block mb-1">
                        THE STUDENT LAB DOSSIER
                      </span>
                      <h4 className="font-display font-bold text-base text-[#FAF7F5] mb-2 leading-tight">
                        {cmd.title}
                      </h4>
                      <p className="text-xs text-[#FAF7F5]/80 leading-relaxed font-sans font-normal">
                        "{cmd.backStory}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified Standard</span>
                      </span>
                      <span className="text-[11px] font-mono text-[#F5DADF] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Flip to Rule</span>
                        <RotateCw className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  {/* BACK FACE (Main Commandment & Rule - Revealed After Flip) */}
                  <div
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className="absolute inset-0 rounded-3xl bg-white text-[#2D2926] border border-[#2D2926]/10 p-6 shadow-[0_15px_40px_rgba(45,41,38,0.06)] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="h-10 w-10 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${cmd.accent}20`, color: cmd.accent }}
                        >
                          <IconComp className="h-5 w-5" />
                        </div>
                        <span className="font-mono text-xs font-bold text-[#8C827A]">
                          RULE {cmd.num}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono uppercase text-[#E05A7E] font-bold block mb-1">
                        {cmd.tagline}
                      </span>
                      <h3 className="font-display font-bold text-lg text-[#2D2926] mb-3 leading-snug">
                        {cmd.title}
                      </h3>
                      <p className="text-xs text-[#5E5854] leading-relaxed">
                        {cmd.frontDesc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#2D2926]/10 flex items-center justify-between text-xs text-[#8C827A]">
                      <span className="font-mono text-[11px] font-semibold text-[#2D2926]">
                        {cmd.metric}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-[#E05A7E] font-bold">
                        <span>Flip Back</span>
                        <RotateCw className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="mx-auto max-w-5xl px-4 sm:px-8 mt-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#2D2926] text-[#FAF7F5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 w-80 h-80 bg-[#E05A7E]/20 blur-[90px] rounded-full" />
          
          <div className="relative z-10 max-w-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5DADF] font-bold block mb-1">
              EXPERIENCE THE ROAST
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              Ready to taste coffee made with genuine obsession?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF7F5]/70 leading-relaxed">
              Explore our fresh-roasted single-estate collection or stop by our Indiranagar roastery lab to meet Priyanshu and the team.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => navigate('/collection')}
              className="px-6 py-3 rounded-full bg-[#FAF7F5] text-[#2D2926] font-bold text-xs uppercase tracking-wider hover:bg-[#F5DADF] transition-all cursor-pointer shadow-md text-center"
            >
              Shop Coffee
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-[#FAF7F5] font-bold text-xs uppercase tracking-wider hover:bg-white/20 transition-all cursor-pointer text-center"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
