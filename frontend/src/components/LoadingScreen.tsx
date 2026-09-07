/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Sparkles, Terminal, Activity, Wifi, ShieldCheck, Zap } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
  onFinished: () => void;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  websiteSettings?: Record<string, any>;
}

const BOOT_STAGES = [
  { progress: 15, text: 'WORK IN PROGRESS CUITIEEE', sector: 'MUWAH' }, ,
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  onFinished,
  activeAtmosphere,
  isDarkMode,
  websiteSettings = {} as Record<string, any>,
}) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setIsDone(true);
      return;
    }

    setProgress(0);
    setStageIndex(0);
    setIsDone(false);

    const startTime = Date.now();
    const duration = 1600; // 1.6s smooth cinematic loader

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / duration, 1);

      // Custom easing curve: snappy start, gentle mid-pause, swift completion
      const easedProgress = Math.floor(
        ratio < 0.6
          ? 70 * Math.sin((ratio / 0.6) * (Math.PI / 2))
          : 70 + 30 * Math.pow((ratio - 0.6) / 0.4, 1.5)
      );

      const boundedProgress = Math.min(Math.max(easedProgress, 0), 100);
      setProgress(boundedProgress);

      // Update stage index based on progress
      if (boundedProgress < 25) setStageIndex(0);
      else if (boundedProgress < 50) setStageIndex(1);
      else if (boundedProgress < 75) setStageIndex(2);
      else if (boundedProgress < 98) setStageIndex(3);
      else setStageIndex(4);

      if (ratio >= 1) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsDone(true);
          onFinished();
        }, 320);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [isLoading, onFinished]);

  return (
    <AnimatePresence>
      {isLoading && !isDone && (
        <motion.div
          id="ineffable-loading-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: 'blur(10px)',
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none bg-black/95 text-white"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${isDarkMode ? 'rgba(250, 95, 136, 0.12)' : 'rgba(250, 95, 136, 0.18)'
              } 0%, rgba(10, 10, 14, 0.98) 70%, #050508 100%)`,
          }}
        >
          {/* Decorative Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Ambient Glowing Rings */}
          <div className="absolute w-[440px] h-[440px] md:w-[580px] md:h-[580px] rounded-full border border-[#FA5F88]/15 animate-ping pointer-events-none opacity-40 duration-1000" />
          <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full border border-dashed border-[#FA5F88]/20 animate-spin-slow pointer-events-none" />

          {/* Top Telemetry Header */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-zinc-400">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FA5F88] animate-pulse" />
              <span className="text-[#FA5F88] font-bold">INEFFABLE</span>
              <span className="opacity-40">//</span>
              <span className="hidden sm:inline">BOOT</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Wifi className="w-3 h-3 text-[#FA5F88]" />
                <span className="hidden sm:inline">CONNECTED: 18MS</span>
              </span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">SSL: ENCRYPTED</span>
              </span>
            </div>
          </div>

          {/* Central Logo & Radial Core */}
          <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6">
            <div className="relative mb-8">
              {/* Outer Pulsing Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#FA5F88]/30 via-rose-500/20 to-transparent blur-xl animate-pulse" />

              {/* Logo Frame */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-zinc-900/80 border border-[#FA5F88]/40 flex items-center justify-center p-3.5 backdrop-blur-xl shadow-[0_0_35px_rgba(250,95,136,0.3)]">
                <img
                  src={websiteSettings.logo_url || '/image.png'}
                  alt="INEFFABLE"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(250,95,136,0.6)] animate-pulse"
                />
              </div>

              {/* Corner Tech Accents */}
              <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#FA5F88]" />
              <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#FA5F88]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#FA5F88]" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#FA5F88]" />
            </div>

            {/* Brand Title */}
            <h1 className="font-display font-black text-2xl md:text-3xl tracking-[0.35em] text-white uppercase mb-1 drop-shadow-md">
              INEFFABLE
            </h1>
            <p className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] text-zinc-400 uppercase mb-8 text-center">
              Kavyansh
            </p>

            {/* Progress Bar Container */}
            <div className="w-full space-y-3">
              {/* Status Text & Percentage */}
              <div className="flex items-center justify-between font-mono text-xs tracking-wider">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <Terminal className="w-3.5 h-3.5 text-[#FA5F88] animate-spin-slow" />
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#FA5F88]">
                    {BOOT_STAGES[stageIndex]?.text || 'LOADING ARCHIVES...'}
                  </span>
                </div>
                <span className="text-[#FA5F88] font-bold text-sm tracking-widest tabular-nums">
                  {progress.toString().padStart(3, '0')}%
                </span>
              </div>

              {/* Progress Rail */}
              <div className="relative w-full h-2 bg-zinc-900/90 rounded-full overflow-hidden border border-zinc-800 p-[1px]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-[#FA5F88] to-pink-300 relative shadow-[0_0_14px_rgba(250,95,136,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                >
                  {/* Glowing Spark at head of progress */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-80" />
                </motion.div>
              </div>

              {/* Technical Sub-status Strip */}
              <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500 tracking-[0.18em] pt-1">
                <span>{BOOT_STAGES[stageIndex]?.sector || 'SECTOR // 01'}</span>
                <span className="flex items-center space-x-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  <span>MUWAHAHAHA</span>
                </span>
                <span>MUWAH</span>
              </div>
            </div>

            {/* Quick Bypass / Skip Button */}
            <button
              onClick={() => {
                setProgress(100);
                setIsDone(true);
                onFinished();
              }}
              className="mt-8 px-4 py-1.5 rounded-full border border-zinc-800 hover:border-[#FA5F88]/50 bg-zinc-900/60 hover:bg-zinc-800/80 text-zinc-400 hover:text-white font-mono text-[10px] tracking-[0.2em] transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              SKIP INTRO [ESC]
            </button>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-zinc-400">
            <span></span>
            <div className="flex items-center space-x-1 text-[#FA5F88]">
              <Sparkles className="w-3 h-3" />
              <span>INEF ON TOP</span>
            </div>
            <span></span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
