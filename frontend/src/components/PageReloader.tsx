/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RotateCw, RefreshCw, Sparkles, Check, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';

interface PageReloaderProps {
  onReload: (type: 'soft' | 'hard') => void;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

export const PageReloader: React.FC<PageReloaderProps> = ({
  onReload,
  activeAtmosphere,
  isDarkMode,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Keyboard shortcut: Press 'r' (when not inside an input field) to trigger soft reload
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if ((e.key === 'r' || e.key === 'R') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Soft reload trigger
        handleSoftReload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSoftReload = () => {
    setIsSpinning(true);
    setShowMenu(false);
    showToast('RELOADING SYSTEM...');
    onReload('soft');

    setTimeout(() => {
      setIsSpinning(false);
    }, 1200);
  };

  const handleHardReload = () => {
    setIsSpinning(true);
    setShowMenu(false);
    showToast('RESTORING FULL CACHE...');
    onReload('hard');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 font-mono text-[11px] tracking-wider px-3.5 py-2 rounded-lg bg-zinc-950/90 text-white border border-[#FA5F88]/50 shadow-[0_4px_20px_rgba(250,95,136,0.3)] backdrop-blur-xl flex items-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FA5F88] animate-spin" />
            <span className="font-bold text-[#FA5F88]">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Reloader Control */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
        {/* Dropup Options Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className={`mb-2 p-1.5 rounded-xl border ${
                isDarkMode
                  ? 'bg-zinc-950/90 border-zinc-800 text-zinc-200'
                  : 'bg-white/95 border-zinc-200 text-zinc-800'
              } shadow-2xl backdrop-blur-xl font-mono text-[11px] min-w-[190px] space-y-1`}
            >
              <div className="px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] text-zinc-400 uppercase border-b border-zinc-500/10">
                RELOAD OPTIONS
              </div>

              {/* Soft Reload Option */}
              <button
                id="btn-soft-reload"
                onClick={handleSoftReload}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#FA5F88]/15 hover:text-[#FA5F88] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <RotateCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="font-semibold">Smooth Reload</span>
                </div>
                <span className="text-[9px] opacity-60 font-bold px-1 py-0.5 rounded bg-zinc-500/10">[R]</span>
              </button>

              {/* Hard Reload Option */}
              <button
                id="btn-hard-reload"
                onClick={handleHardReload}
                className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#FA5F88]/15 hover:text-[#FA5F88] transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-amber-400" />
                  <span className="font-semibold">Hard Browser Reload</span>
                </div>
                <span className="text-[9px] opacity-60 font-bold px-1 py-0.5 rounded bg-zinc-500/10">F5</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Trigger Button */}
        <div className="flex items-center space-x-1.5">
          <button
            id="page-reloader-floating-btn"
            onClick={handleSoftReload}
            onContextMenu={(e) => {
              e.preventDefault();
              setShowMenu(!showMenu);
            }}
            className={`group relative flex items-center space-x-2 px-3.5 py-2.5 rounded-full border shadow-lg backdrop-blur-xl transition-all duration-300 cursor-pointer active:scale-95 ${
              isDarkMode
                ? 'bg-zinc-900/85 border-zinc-700/60 hover:border-[#FA5F88]/60 text-zinc-200 hover:text-white shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                : 'bg-white/90 border-zinc-200 hover:border-[#FA5F88]/60 text-zinc-800 hover:text-black shadow-[0_4px_24px_rgba(250,95,136,0.15)]'
            }`}
            title="Reload Page [R] (Right-click or toggle chevron for options)"
          >
            {/* Spinning Indicator Icon */}
            <RotateCw
              className={`w-3.5 h-3.5 text-[#FA5F88] transition-transform duration-700 ${
                isSpinning ? 'animate-spin' : 'group-hover:rotate-180'
              }`}
            />
            <span className="font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
              RELOAD
            </span>

            {/* Glowing Accent Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FA5F88] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FA5F88]" />
            </span>
          </button>

          {/* Options toggle button */}
          <button
            id="page-reloader-options-toggle"
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-full border backdrop-blur-xl transition-all cursor-pointer active:scale-95 ${
              isDarkMode
                ? 'bg-zinc-900/85 border-zinc-700/60 text-zinc-400 hover:text-white'
                : 'bg-white/90 border-zinc-200 text-zinc-600 hover:text-black'
            } ${showMenu ? 'border-[#FA5F88] text-[#FA5F88]' : ''}`}
            title="More reload options"
          >
            <ChevronUp className={`w-3.5 h-3.5 transition-transform duration-300 ${showMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </>
  );
};
