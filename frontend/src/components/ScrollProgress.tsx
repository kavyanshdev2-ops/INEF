import React, { useState, useEffect } from 'react';
import { AtmosphereConfig } from '../types';

interface ScrollProgressProps {
  activeAtmosphere?: AtmosphereConfig;
  isDarkMode?: boolean;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  activeAtmosphere,
  isDarkMode = true
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeColor, setActiveColor] = useState('#f43f5e'); // Default Rose
  const [glowColor, setGlowColor] = useState('rgba(244, 63, 94, 0.6)');

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      const totalScrollable = documentHeight - windowHeight;
      if (totalScrollable <= 0) {
        setScrollProgress(0);
        return;
      }

      const progress = Math.min(100, Math.max(0, (scrollTop / totalScrollable) * 100));
      setScrollProgress(progress);

      // Section Color Transition Logic
      // Detect if there are sections on the current view or map based on scroll progress
      const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id], [data-section]'));
      
      let currentSectionTheme: string | null = null;
      if (sections.length > 0) {
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= windowHeight * 0.4 && rect.bottom >= windowHeight * 0.1) {
            const sectionId = section.id || section.getAttribute('data-section') || '';
            if (sectionId.includes('hero')) {
              currentSectionTheme = '#f43f5e'; // Rose
            } else if (sectionId.includes('membership') || sectionId.includes('shop') || sectionId.includes('highlight') || sectionId.includes('ranks')) {
              currentSectionTheme = '#06b6d4'; // Cyan
            } else if (sectionId.includes('journals') || sectionId.includes('arcade') || sectionId.includes('gaming') || sectionId.includes('media')) {
              currentSectionTheme = '#a855f7'; // Purple
            } else if (sectionId.includes('contact') || sectionId.includes('footer') || sectionId.includes('sanctuary') || sectionId.includes('faq')) {
              currentSectionTheme = '#10b981'; // Emerald
            }
            break;
          }
        }
      }

      if (currentSectionTheme) {
        setActiveColor(currentSectionTheme);
        setGlowColor(`${currentSectionTheme}88`);
      } else {
        // Fallback smooth gradient interpolation based on scroll percentage ratio
        if (progress < 25) {
          setActiveColor('#f43f5e'); // Crimson Rose (Hero / Top)
          setGlowColor('rgba(244, 63, 94, 0.7)');
        } else if (progress < 50) {
          setActiveColor('#06b6d4'); // Cyber Cyan (Mid Top)
          setGlowColor('rgba(6, 182, 212, 0.7)');
        } else if (progress < 75) {
          setActiveColor('#a855f7'); // Neon Purple (Mid Bottom)
          setGlowColor('rgba(168, 85, 247, 0.7)');
        } else {
          setActiveColor('#10b981'); // Emerald Sanctuary (Bottom / Footer)
          setGlowColor('rgba(16, 185, 129, 0.7)');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeAtmosphere]);

  return (
    <div
      id="scroll-progress-container"
      className="fixed top-0 left-0 right-0 z-[100] h-[3px] w-full bg-zinc-950/10 dark:bg-black/20 pointer-events-none backdrop-blur-[1px]"
    >
      <div
        id="scroll-progress-bar"
        className="h-full relative transition-[width] duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: activeColor,
          boxShadow: `0 0 12px ${glowColor}, 0 0 4px ${activeColor}`
        }}
      >
        {/* Leading edge bright glowing head */}
        {scrollProgress > 0 && (
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-[1px] animate-pulse pointer-events-none"
            style={{
              backgroundColor: '#ffffff',
              boxShadow: `0 0 10px ${activeColor}, 0 0 15px ${glowColor}`
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ScrollProgress;
