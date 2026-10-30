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
  FlaskConical,
  Lock,
  ArrowDown
} from 'lucide-react';
import { gsap } from '../utils/animations';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';

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

  // Refs & state for 4 Noir Commandments landing & automated scroll-flip
  const commandmentsSectionRef = useRef<HTMLElement | null>(null);
  const commandmentsHeaderRef = useRef<HTMLDivElement | null>(null);
  const cardsTrackRef = useRef<HTMLDivElement | null>(null);
  const cardContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardFlippersRef = useRef<(HTMLDivElement | null)[]>([]);

  // Track live scroll unseal progress step (0 to 4)
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentStepRef = useRef<number>(0);

  const commandments = [
    {
      id: 0,
      num: '01',
      roman: 'I',
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
      roman: 'II',
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
      roman: 'III',
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
      roman: 'IV',
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

      // 4. THE 4 NOIR COMMANDMENTS: PINNED SCROLL-DRIVEN CARD FLIPPING AUTOMATION
      const commandmentsSection = commandmentsSectionRef.current;
      const validFlippers = cardFlippersRef.current.filter(Boolean) as HTMLDivElement[];
      const validContainers = cardContainersRef.current.filter(Boolean) as HTMLDivElement[];

      if (commandmentsSection && validFlippers.length === 4) {
        // Ensure initial state: all 4 cards start showing blank front (0deg)
        gsap.set(validFlippers, { rotateY: 0 });

        const mm = gsap.matchMedia();

        // 1. DESKTOP / LARGE SCREENS (min-width: 1024px)
        // All 4 cards sit side-by-side in a 4-column grid and flip 1-by-1 on scroll
        mm.add('(min-width: 1024px)', () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: commandmentsSection,
              start: 'top top',
              end: '+=2400',
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                let step = 0;
                if (p >= 0.90) step = 4;
                else if (p >= 0.68) step = 3;
                else if (p >= 0.44) step = 2;
                else if (p >= 0.18) step = 1;

                if (step !== currentStepRef.current) {
                  currentStepRef.current = step;
                  setActiveStep(step);
                }
              },
            },
          });

          // Card 0 flips from blank (0deg) to revealed (180deg)
          tl.to(validFlippers[0], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 0.05);
          tl.to(validContainers[0], { scale: 1.03, duration: 0.45, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 0.05);

          // Card 1 flips
          tl.to(validFlippers[1], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 1.05);
          tl.to(validContainers[1], { scale: 1.03, duration: 0.45, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 1.05);

          // Card 2 flips
          tl.to(validFlippers[2], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 2.05);
          tl.to(validContainers[2], { scale: 1.03, duration: 0.45, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 2.05);

          // Card 3 flips
          tl.to(validFlippers[3], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 3.05);
          tl.to(validContainers[3], { scale: 1.03, duration: 0.45, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 3.05);

          // Hold briefly so user sees all 4 unsealed cards before unpinning to next section
          tl.to({}, { duration: 0.8 }, 4.0);

          return () => {
            tl.kill();
          };
        });

        // 2. MOBILE & TABLET SCREENS (< 1024px)
        // Horizontal sliding track centers each card and flips it sequentially on scroll
        mm.add('(max-width: 1023px)', () => {
          const cardsTrack = cardsTrackRef.current;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: commandmentsSection,
              start: 'top top',
              end: '+=2800',
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                let step = 0;
                if (p >= 0.90) step = 4;
                else if (p >= 0.68) step = 3;
                else if (p >= 0.44) step = 2;
                else if (p >= 0.18) step = 1;

                if (step !== currentStepRef.current) {
                  currentStepRef.current = step;
                  setActiveStep(step);
                }
              },
            },
          });

          // Card 0 flips
          tl.to(validFlippers[0], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 0.05);

          // Slide track to Card 1 and flip
          if (cardsTrack) {
            tl.to(cardsTrack, {
              x: () => {
                const w = validContainers[0]?.offsetWidth || 320;
                return -(w + 20);
              },
              ease: 'power1.inOut',
              duration: 0.7,
            }, 1.0);
          }
          tl.to(validFlippers[1], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 1.3);

          // Slide track to Card 2 and flip
          if (cardsTrack) {
            tl.to(cardsTrack, {
              x: () => {
                const w = validContainers[0]?.offsetWidth || 320;
                return -2 * (w + 20);
              },
              ease: 'power1.inOut',
              duration: 0.7,
            }, 2.3);
          }
          tl.to(validFlippers[2], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 2.6);

          // Slide track to Card 3 and flip
          if (cardsTrack) {
            tl.to(cardsTrack, {
              x: () => {
                const w = validContainers[0]?.offsetWidth || 320;
                return -3 * (w + 20);
              },
              ease: 'power1.inOut',
              duration: 0.7,
            }, 3.6);
          }
          tl.to(validFlippers[3], { rotateY: 180, ease: 'power2.inOut', duration: 0.9 }, 3.9);

          // Hold
          tl.to({}, { duration: 0.8 }, 4.9);

          return () => {
            tl.kill();
          };
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#E05A7E] selection:text-white pb-28">
      <SeoHead
        title="About Our Roastery & Heritage"
        description="Founded on the sacred heritage of Baba Budan Giri. Discover the story of NOIR ROAST, our cast-iron convection drum roasting, and ethical single-estate partnerships in Karnataka."
        canonical="/about"
        keywords="about noir roast, baba budan roastery history, specialty coffee roasters bangalore, shade grown coffee heritage, artisanal coffee roaster chikmagalur"
        ogType="article"
        breadcrumbs={[{ name: 'About Us & Heritage', url: '/about' }]}
      />
      {/* 1. Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-[max(calc(env(safe-area-inset-top)+5.25rem),6.5rem)] sm:pt-28 md:pt-32 pb-3.5 sm:pb-4 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/80 backdrop-blur-md">
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
      <section className="relative px-4 sm:px-8 pt-8 pb-16 overflow-hidden border-b border-[#2D2926]/10">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={[{ name: 'About Us & Heritage', url: '/about' }]} className="mb-4" />
        </div>
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

      {/* 5. THE 4 NOIR COMMANDMENTS: PINNED SCROLL-DRIVEN CARD FLIPPING SECTION */}
      <section 
        id="section-commandments"
        ref={commandmentsSectionRef}
        className="relative w-full min-h-screen py-14 sm:py-20 flex flex-col justify-center items-center overflow-hidden bg-[#FAF7F5] border-b border-[#2D2926]/10"
      >
        <div ref={commandmentsHeaderRef} className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-2">
            OUR PHILOSOPHY
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2D2926]">
            The 4 Noir Commandments
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5E5854]">
            Every single bean we roast is governed by four non-negotiable rules.
          </p>

          {/* Dynamic Live Scroll Unseal Progress Indicator */}
          <div className="mt-4 inline-flex items-center gap-2.5 sm:gap-3 px-4 py-2 rounded-full bg-white border border-[#2D2926]/10 text-xs font-mono shadow-xs">
            <span className="text-[#8C827A] font-semibold text-[11px] sm:text-xs">Scroll to Unseal:</span>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeStep > idx ? 'w-5 sm:w-6 bg-[#2D2926]' : 'w-2 bg-[#2D2926]/20'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs text-[#E05A7E] font-bold">
              {activeStep === 0 && '0 / 4 Unsealed'}
              {activeStep === 1 && '1 / 4 Unsealed'}
              {activeStep === 2 && '2 / 4 Unsealed'}
              {activeStep === 3 && '3 / 4 Unsealed'}
              {activeStep >= 4 && 'All 4 Unsealed ✓'}
            </span>
          </div>
        </div>

        {/* 4 Cards Track with 3D Scroll-Flip Automation */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 overflow-hidden">
          <div 
            ref={cardsTrackRef}
            className="flex lg:grid lg:grid-cols-4 gap-5 sm:gap-6 w-full items-stretch"
          >
            {commandments.map((cmd) => {
              return (
                <div
                  key={cmd.id}
                  ref={(el) => { cardContainersRef.current[cmd.id] = el; }}
                  style={{ perspective: '1400px' }}
                  className="relative h-[390px] sm:h-[405px] w-[82vw] sm:w-[360px] lg:w-auto shrink-0 select-none"
                >
                  {/* 3D Flipper Box - Animated directly on scroll by GSAP ScrollTrigger */}
                  <div
                    ref={(el) => { cardFlippersRef.current[cmd.id] = el; }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'rotateY(0deg)',
                    }}
                    className="relative w-full h-full rounded-3xl"
                  >
                    {/* FRONT FACE (Blank / Sealed Dossier Card Back - Shown First) */}
                    <div
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(0deg)',
                      }}
                      className="absolute inset-0 rounded-3xl bg-[#2D2926] text-[#FAF7F5] border border-white/10 p-6 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden"
                    >
                      {/* Ambient Watermark Glow */}
                      <div className="pointer-events-none absolute -right-12 -top-12 w-44 h-44 rounded-full bg-[#E05A7E]/5 blur-2xl" />
                      <div className="pointer-events-none absolute -left-12 -bottom-12 w-44 h-44 rounded-full bg-[#C89658]/5 blur-2xl" />

                      {/* Top Row: Sealed Capsule Badge */}
                      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-[#F5DADF] font-bold uppercase">
                          <Lock className="h-3 w-3 text-[#C89658]" />
                          <span>SEALED</span>
                        </div>
                        <span className="text-xs font-mono text-white/40 tracking-wider">
                          RULE {cmd.num}
                        </span>
                      </div>

                      {/* Center Monogram: Clean Minimalist Blank Seal */}
                      <div className="relative z-10 my-auto text-center py-4">
                        <div className="h-20 w-20 rounded-2xl border border-[#C89658]/30 bg-black/30 backdrop-blur-sm flex flex-col items-center justify-center mx-auto shadow-inner mb-4">
                          <span className="font-serif text-2xl font-bold text-[#C89658] tracking-widest">
                            {cmd.roman}
                          </span>
                          <span className="text-[8px] font-mono tracking-[0.25em] text-white/40 uppercase mt-0.5">
                            DOSSIER
                          </span>
                        </div>

                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C89658] font-bold block mb-1">
                          THE STUDENT LAB DOSSIER
                        </span>
                        <span className="text-xs font-mono text-white/40 tracking-widest uppercase block">
                          CONFIDENTIAL • LOT #{cmd.num}
                        </span>
                      </div>

                      {/* Bottom Status Row */}
                      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-white/40 flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#C89658] animate-pulse" />
                          <span>Awaiting Unseal</span>
                        </span>
                        <span className="text-[10px] font-mono text-[#F5DADF]/70 font-semibold flex items-center gap-1">
                          <span>Scroll to Flip</span>
                          <ArrowDown className="h-3 w-3 animate-bounce" />
                        </span>
                      </div>
                    </div>

                    {/* BACK FACE (Main Commandment & Revealed Dossier - Revealed on Scroll) */}
                    <div
                      style={{ 
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      className="absolute inset-0 rounded-3xl bg-[#201D1B] text-[#FAF7F5] border border-[#C89658]/40 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden"
                    >
                      {/* Ambient Gold Glow */}
                      <div className="pointer-events-none absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[#C89658]/10 blur-3xl" />

                      {/* Top Row: Provenance Badge */}
                      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-[#F5DADF] border border-white/10">
                          {cmd.badge}
                        </span>
                        <span className="text-xs font-mono text-[#C89658] font-bold">
                          RULE {cmd.num} DOSSIER
                        </span>
                      </div>

                      {/* Content: Story Quote & Core Philosophy */}
                      <div className="relative z-10 my-auto py-2 space-y-2">
                        <span className="text-[10px] font-mono uppercase text-[#C89658] font-bold block tracking-wider">
                          THE STUDENT LAB DOSSIER
                        </span>
                        <h4 className="font-display font-bold text-base sm:text-lg text-[#FAF7F5] leading-snug">
                          {cmd.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-[#FAF7F5]/85 leading-relaxed font-sans font-normal italic">
                          "{cmd.backStory}"
                        </p>
                        <div className="pt-1">
                          <span className="text-[10px] font-mono text-[#E05A7E] font-semibold uppercase tracking-wider block">
                            {cmd.tagline}
                          </span>
                          <p className="text-[11px] text-[#FAF7F5]/65 leading-relaxed line-clamp-2">
                            {cmd.frontDesc}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Metric & Verified Standard Row */}
                      <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Verified Standard</span>
                        </span>
                        <span className="text-[11px] font-mono text-[#F5DADF] font-bold">
                          {cmd.metric}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
