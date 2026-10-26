import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [activeSection, setActiveSection] = useState<string>('00');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;
    let lastSection = '00';
    let lastProgress = 0;

    const updateScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      const currentProgress = Math.min(100, Math.max(0, Math.round(rawProgress)));

      if (currentProgress !== lastProgress) {
        lastProgress = currentProgress;
        setProgress(currentProgress);
      }

      if (scrollY < window.innerHeight * 0.35) {
        if (lastSection !== '00') {
          lastSection = '00';
          setActiveSection('00');
        }
        ticking = false;
        return;
      }

      const sections = [
        { id: 'hero', code: '00' },
        { id: 'section-bean', code: '01' },
        { id: 'section-roast', code: '02' },
        { id: 'section-pour', code: '03' },
        { id: 'section-collection', code: '04' },
        { id: 'section-gallery', code: '05' },
        { id: 'section-brew-ritual', code: '06' },
        { id: 'section-reserve', code: '07' },
      ];

      const viewportCenter = window.innerHeight * 0.45;
      let currentActive = '00';

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom > 0) {
            currentActive = sections[i].code;
          }
        }
      }

      if (currentActive !== lastSection) {
        lastSection = currentActive;
        setActiveSection(currentActive);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    updateScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return { activeSection, progress };
}
