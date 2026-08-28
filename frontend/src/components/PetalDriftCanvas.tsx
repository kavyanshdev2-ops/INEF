/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { AtmosphereConfig } from '../types';

interface PetalDriftCanvasProps {
  config: AtmosphereConfig;
  isDarkMode: boolean;
}

interface Petal {
  x: number;
  y: number;
  z: number; // depth layer: 0.2 to 1.5
  size: number;
  angle: number;
  angleSpeed: number;
  vx: number;
  vy: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  opacity: number;
}

export const PetalDriftCanvas: React.FC<PetalDriftCanvasProps> = ({ config, isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let petals: Petal[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Get color array based on theme
    const getThemeColors = (theme: AtmosphereConfig['colorTheme']) => {
      if (isDarkMode) {
        // Dark Mode: "make the petalss a bit dark", pink theme is elegant and slightly dark rose/wine colors
        switch (theme) {
          case 'neon-mint':
            return [
              'rgba(16, 120, 85, 0.45)',   // deep forest mint
              'rgba(4, 85, 60, 0.4)',      // dark mint
              'rgba(13, 148, 136, 0.4)',    // dark cyber teal
            ];
          case 'crimson-moon':
            return [
              'rgba(153, 27, 27, 0.5)',    // crimson dark
              'rgba(190, 24, 74, 0.45)',   // rose dark
              'rgba(127, 29, 29, 0.45)',   // dark wine
            ];
          case 'monochrome':
            return [
              'rgba(113, 113, 122, 0.4)',  // zinc medium-dark
              'rgba(82, 82, 91, 0.35)',    // zinc dark
              'rgba(39, 39, 42, 0.3)',     // zinc deep dark
            ];
          case 'classic':
          default:
            return [
              'rgba(180, 20, 60, 0.55)',   // elegant deep rose-600
              'rgba(140, 10, 40, 0.5)',    // rich dark wine-rose-800
              'rgba(219, 39, 119, 0.45)',  // darker pink-600
              'rgba(131, 24, 67, 0.5)',    // deep dark plum-rose-900
            ];
        }
      } else {
        // Light Mode: "on light mode make it bright baby pink theme"
        switch (theme) {
          case 'neon-mint':
            return [
              'rgba(52, 211, 153, 0.65)',  // bright mint
              'rgba(167, 243, 208, 0.55)', // bright mint light
              'rgba(6, 182, 212, 0.5)',    // cyber blue accent
            ];
          case 'crimson-moon':
            return [
              'rgba(239, 68, 68, 0.65)',   // bright crimson
              'rgba(251, 113, 133, 0.6)',  // bright rose
              'rgba(225, 29, 72, 0.55)',   // vibrant red
            ];
          case 'monochrome':
            return [
              'rgba(161, 161, 170, 0.6)',  // zinc light-medium
              'rgba(212, 212, 216, 0.7)',  // zinc light
              'rgba(113, 113, 122, 0.5)',  // zinc medium
            ];
          case 'classic':
          default:
            return [
              'rgba(244, 114, 182, 0.85)', // bright baby pink-400
              'rgba(244, 143, 177, 0.8)',  // sweet baby pink-300
              'rgba(251, 180, 215, 0.9)',  // vibrant baby pink
              'rgba(219, 39, 119, 0.7)',   // bright rose accent
            ];
        }
      }
    };

    // Initialize petals
    const createPetal = (isInitial = false): Petal => {
      const colors = getThemeColors(config.colorTheme);
      const color = colors[Math.floor(Math.random() * colors.length)];
      const z = Math.random() * 1.3 + 0.2; // depth multiplier

      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : -20,
        z,
        size: (Math.random() * 24 + 18) * (z * 0.8),
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() * 0.02 - 0.01) / z,
        vx: 0,
        vy: 0,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.02 + 0.005,
        color,
        opacity: Math.min(0.85, (Math.random() * 0.4 + 0.4) * (z > 1 ? 1 : z)),
      };
    };

    const initPetals = () => {
      petals = Array.from({ length: config.petalCount }, () => createPetal(true));
    };

    const initPetalsNoSizeChange = () => {}; // Helper to keep structure consistent if needed

    initPetals();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPetals();
    };

    let lastScrollY = window.scrollY;
    let scrollSpeed = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);
      scrollSpeed = Math.min(18, scrollSpeed + diff * 0.12);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const render = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      const radAngle = (config.windAngle * Math.PI) / 180;
      const baseWindX = Math.cos(radAngle) * config.driftVelocity;
      const baseWindY = Math.sin(radAngle) * config.driftVelocity + config.gravity;
      scrollSpeed *= 0.92;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.wobble += p.wobbleSpeed;

        const flowX = Math.sin(timestamp * 0.0008 + i * 0.9) * 0.25;
        const flowY = Math.cos(timestamp * 0.0007 + i * 0.6) * 0.18;

        const windX = baseWindX * p.z + flowX;
        const windY = baseWindY * p.z + flowY;
        const scrollBoostX = scrollSpeed * 0.06 * p.z * (config.windAngle > 90 ? -1 : 1);
        const scrollBoostY = scrollSpeed * 0.12 * p.z;

        p.vx = windX + Math.sin(p.wobble) * 0.35 + scrollBoostX;
        p.vy = windY + Math.cos(p.wobble) * 0.2 + scrollBoostY;

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.angleSpeed;

        const renderX = p.x + Math.sin(timestamp * 0.001 + i) * 0.8 * p.z;
        const renderY = p.y + Math.cos(timestamp * 0.0012 + i) * 0.6 * p.z;

        const padding = 100;
        if (
          renderY > height + padding ||
          renderX < -padding ||
          renderX > width + padding
        ) {
          petals[i] = createPetal(false);
          petals[i].x = Math.random() * width;
          petals[i].y = -20;
        }

        ctx.save();
        ctx.translate(renderX, renderY);
        ctx.rotate(p.angle);

        if (p.z < 0.5) {
          ctx.shadowBlur = 3;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size / 3, p.size, -p.size / 3, p.size, 0);
        ctx.bezierCurveTo(p.size, p.size / 3, p.size / 2, p.size / 3, 0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(p.size, 0);
        ctx.stroke();

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [config, isDarkMode]);

  return (
    <canvas
      ref={canvasRef}
      id="petal-drift-canvas"
      className="fixed inset-0 pointer-events-none z-10 w-full h-full block"
      style={{ mixBlendMode: isDarkMode ? 'screen' : 'normal', transform: 'translate3d(0,0,0)', willChange: 'transform' }}
    />
  );
};
