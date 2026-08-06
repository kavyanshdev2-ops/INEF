/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { AtmosphereConfig } from '../types';

interface MouseGlowTrackerProps {
  atmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

export const MouseGlowTracker: React.FC<MouseGlowTrackerProps> = ({
  atmosphere,
  isDarkMode,
}) => {
  const glowRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth lerp loop for liquid fluid movement
    const updatePosition = () => {
      const lerpFactor = 0.08; // smooth trailing fluid effect
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentPos.current.x - 350}px, ${currentPos.current.y - 350}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(updatePosition);
    };

    animFrameId.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  // Determine glow gradient colors according to current color theme
  const getGlowColors = () => {
    switch (atmosphere.colorTheme) {
      case 'neon-mint':
        return isDarkMode
          ? 'from-emerald-500/25 via-cyan-500/15 to-transparent'
          : 'from-emerald-400/35 via-cyan-300/20 to-transparent';
      case 'crimson-moon':
        return isDarkMode
          ? 'from-red-600/25 via-rose-500/15 to-transparent'
          : 'from-red-400/35 via-rose-300/20 to-transparent';
      case 'monochrome':
        return isDarkMode
          ? 'from-white/20 via-zinc-400/10 to-transparent'
          : 'from-zinc-900/15 via-zinc-400/10 to-transparent';
      case 'classic':
      default:
        return isDarkMode
          ? 'from-rose-500/25 via-emerald-500/15 to-transparent'
          : 'from-rose-400/35 via-emerald-300/20 to-transparent';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      <div
        ref={glowRef}
        className={`absolute w-[700px] h-[700px] rounded-full bg-radial ${getGlowColors()} filter blur-3xl opacity-80 transition-opacity duration-700 ease-out`}
        style={{
          willChange: 'transform',
        }}
      />
    </div>
  );
};
