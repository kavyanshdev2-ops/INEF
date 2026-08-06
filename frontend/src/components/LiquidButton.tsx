/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'emerald' | 'amber' | 'rose' | 'cherry';
  isDarkMode?: boolean;
  className?: string;
  id?: string;
}

export const LiquidButton: React.FC<LiquidButtonProps> = ({
  children,
  variant = 'primary',
  isDarkMode = true,
  className = '',
  onClick,
  id,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    }
    if (onClick) {
      onClick(e);
    }
  };

  // Base styling for variant
  const getVariantStyles = () => {
    if (variant === 'emerald') {
      return 'bg-emerald-500 text-white border-emerald-400/80 shadow-[0_4px_20px_rgba(16,185,129,0.3)]';
    }
    if (variant === 'amber' || variant === 'rose' || variant === 'cherry') {
      return 'bg-rose-600 text-white border-rose-400/80 shadow-[0_4px_20px_rgba(244,63,94,0.35)] font-black hover:bg-rose-500';
    }
    if (variant === 'secondary') {
      return isDarkMode
        ? 'bg-zinc-900/80 text-white border-zinc-700/80 hover:border-zinc-500/80'
        : 'bg-zinc-100 text-zinc-900 border-zinc-200 hover:border-zinc-400';
    }

    // Default primary
    return isDarkMode
      ? 'bg-white/95 text-zinc-950 border-white/80 hover:bg-white shadow-[0_4px_25px_rgba(255,255,255,0.2)]'
      : 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-950 shadow-[0_4px_25px_rgba(0,0,0,0.18)]';
  };

  return (
    <button
      ref={buttonRef}
      id={id}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group cursor-pointer transition-all duration-300 border font-mono tracking-widest font-bold backdrop-blur-md active:scale-[0.98] ${getVariantStyles()} ${className}`}
      {...props}
    >
      {/* Liquid fluid color shift gradient sweep */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, ${
            variant === 'emerald'
              ? 'rgba(255,255,255,0.35), rgba(52,211,153,0.2), transparent 80%)'
              : variant === 'amber' || variant === 'rose' || variant === 'cherry'
              ? 'rgba(255,255,255,0.45), rgba(244,63,94,0.3), transparent 80%)'
              : isDarkMode
              ? 'rgba(56,189,248,0.25), rgba(168,85,247,0.2), transparent 80%)'
              : 'rgba(56,189,248,0.25), rgba(244,63,94,0.15), transparent 80%)'
          }`,
        }}
      />

      {/* Surface liquid glass wave sheen animation */}
      <div
        className={`absolute inset-0 pointer-events-none transition-transform duration-1000 ease-out bg-gradient-to-r ${
          isDarkMode
            ? 'from-transparent via-white/20 to-transparent'
            : 'from-transparent via-white/30 to-transparent'
        } ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}
      />

      {/* Ripple wave elements on click/touch */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((item) => item.id !== r.id));
            }}
            className="absolute rounded-full pointer-events-none bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
            style={{
              left: r.x - 20,
              top: r.y - 20,
              width: 40,
              height: 40,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Inner label content */}
      <span className="relative z-10 flex items-center justify-center space-x-2 w-full h-full">
        {children}
      </span>
    </button>
  );
};
