/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AtmosphereConfig } from '../types';

export interface ThemeStyles {
  accentText: string;        // e.g. text-rose-300 / text-emerald-300 / text-red-400 / text-zinc-100
  accentTextMuted: string;   // e.g. text-rose-400/80 / text-emerald-400/80 etc.
  accentBg: string;          // e.g. bg-rose-400 / bg-emerald-400 / bg-red-500 / bg-zinc-100
  accentBgHover: string;     // e.g. hover:bg-rose-300 / hover:bg-emerald-300 etc.
  accentTextHover: string;   // e.g. hover:text-rose-300 / hover:text-emerald-300 etc.
  groupTextHover: string;    // e.g. group-hover:text-rose-300 / group-hover:text-emerald-300 etc.
  indicatorBg: string;       // e.g. bg-rose-400/80 / bg-emerald-400/80 etc.
  borderHighlight: string;   // e.g. border-rose-900/60 / border-emerald-900/60 etc.
  badgeStyles: string;       // e.g. text-emerald-300 bg-emerald-950/30 border-emerald-900/30 etc.
  taglineText: string;       // e.g. text-emerald-300 / text-emerald-300 / text-red-400 / text-zinc-300
  taglineBg: string;         // e.g. bg-emerald-950/30 / bg-emerald-950/30 / bg-red-950/30 / bg-zinc-900/40
  taglineBorder: string;     // e.g. border-emerald-900/30 / border-emerald-900/30 / border-red-900/30 / border-zinc-800/40
  glowPrimary: string;       // e.g. bg-rose-500/5 / bg-emerald-500/5 / bg-red-500/5 / bg-zinc-500/5
  glowSecondary: string;     // e.g. bg-emerald-500/5 / bg-cyan-500/5 / bg-rose-500/5 / bg-zinc-600/5
  accentIconColor: string;   // e.g. text-rose-300 / text-emerald-300 / text-red-400 / text-zinc-200
  focusBorder: string;       // e.g. focus:border-rose-400 / focus:border-emerald-400 etc.
  accentLine: string;        // e.g. from-rose-300 / from-emerald-300 etc.
  scrollbarThumb: string;    // e.g. scrollbar-thumb-zinc-800 / scrollbar-thumb-emerald-800 etc.
  buttonActiveBorder: string;// e.g. border-zinc-200 / border-emerald-200 / border-red-800 / border-zinc-400
  buttonActiveBg: string;    // e.g. bg-zinc-100 / bg-zinc-100 / bg-zinc-100 / bg-zinc-100
  themeSelectorActive: string; // e.g. styles for theme selection buttons
  chamberStatuses: {
    vault1: string;
    vault2: string;
    vault3: string;
  };
  textPrimary: string;       // e.g. text-zinc-100 in dark vs text-zinc-800 in light
  textSecondary: string;     // e.g. text-zinc-400 in dark vs text-zinc-600 in light
  textMuted: string;         // e.g. text-zinc-500 in dark vs text-zinc-400 in light
  bgMain: string;            // e.g. bg-zinc-950 in dark vs bg-zinc-50 in light
  bgCard: string;            // e.g. bg-zinc-900/20 in dark vs bg-white/70 in light
  borderMain: string;        // e.g. border-zinc-900 in dark vs border-zinc-200 in light
  borderMuted: string;       // e.g. border-zinc-900/40 in dark vs border-zinc-200/50 in light
  bgHeader: string;          // e.g. bg-zinc-950/20 in dark vs bg-white/40 in light
  bgFooter: string;          // e.g. bg-zinc-950/60 in dark vs bg-zinc-100/70 in light
  drawerOverlay: string;     // e.g. bg-zinc-950/80 in dark vs bg-white/85 in light
}

export const getThemeStyles = (theme: AtmosphereConfig['colorTheme'], isDarkMode = true): ThemeStyles => {
  if (isDarkMode) {
    switch (theme) {
      case 'neon-mint':
        return {
          accentText: 'text-emerald-300',
          accentTextMuted: 'text-emerald-400/80',
          accentBg: 'bg-emerald-400',
          accentBgHover: 'hover:bg-emerald-300',
          accentTextHover: 'hover:text-emerald-300',
          groupTextHover: 'group-hover:text-emerald-300',
          indicatorBg: 'bg-emerald-400/80',
          borderHighlight: 'border-emerald-500/40',
          badgeStyles: 'text-emerald-300 bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-md',
          taglineText: 'text-emerald-300',
          taglineBg: 'bg-emerald-950/30',
          taglineBorder: 'border-emerald-900/30',
          glowPrimary: 'bg-emerald-500/5',
          glowSecondary: 'bg-cyan-500/5',
          accentIconColor: 'text-emerald-300',
          focusBorder: 'focus:border-emerald-400',
          accentLine: 'from-emerald-300',
          scrollbarThumb: 'scrollbar-thumb-emerald-800',
          buttonActiveBorder: 'border-emerald-200',
          buttonActiveBg: 'bg-zinc-100',
          themeSelectorActive: 'bg-emerald-400 text-zinc-950 font-bold border-emerald-300',
          chamberStatuses: {
            vault1: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md',
            vault2: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20 backdrop-blur-md',
            vault3: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-100',
          textSecondary: 'text-zinc-300',
          textMuted: 'text-zinc-500',
          bgMain: 'bg-zinc-950/30 backdrop-blur-3xl',
          bgCard: 'bg-emerald-950/15 border border-emerald-500/20 backdrop-blur-xl shadow-2xl shadow-emerald-950/50',
          borderMain: 'border-emerald-500/35',
          borderMuted: 'border-emerald-500/15',
          bgHeader: 'bg-emerald-950/10 border-b border-emerald-500/15 backdrop-blur-md',
          bgFooter: 'bg-emerald-950/35 border-t border-emerald-500/15 backdrop-blur-md',
          drawerOverlay: 'bg-[#02110c]'
        };
      case 'crimson-moon':
        return {
          accentText: 'text-red-400',
          accentTextMuted: 'text-red-500/80',
          accentBg: 'bg-red-500',
          accentBgHover: 'hover:bg-red-400',
          accentTextHover: 'hover:text-red-400',
          groupTextHover: 'group-hover:text-red-400',
          indicatorBg: 'bg-red-500/80',
          borderHighlight: 'border-red-500/40',
          badgeStyles: 'text-red-300 bg-red-950/40 border border-red-500/20 backdrop-blur-md',
          taglineText: 'text-red-400',
          taglineBg: 'bg-red-950/30',
          taglineBorder: 'border-red-900/30',
          glowPrimary: 'bg-red-500/5',
          glowSecondary: 'bg-rose-500/5',
          accentIconColor: 'text-red-400',
          focusBorder: 'focus:border-red-500',
          accentLine: 'from-red-400',
          scrollbarThumb: 'scrollbar-thumb-red-900',
          buttonActiveBorder: 'border-red-800',
          buttonActiveBg: 'bg-zinc-100',
          themeSelectorActive: 'bg-red-500 text-zinc-950 font-bold border-red-400',
          chamberStatuses: {
            vault1: 'text-red-400 border-red-500/20 bg-red-950/20 backdrop-blur-md',
            vault2: 'text-rose-400 border-rose-500/20 bg-rose-950/20 backdrop-blur-md',
            vault3: 'text-red-400 border-red-500/20 bg-red-950/20 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-100',
          textSecondary: 'text-zinc-300',
          textMuted: 'text-zinc-500',
          bgMain: 'bg-zinc-950/30 backdrop-blur-3xl',
          bgCard: 'bg-red-950/15 border border-red-500/20 backdrop-blur-xl shadow-2xl shadow-red-950/50',
          borderMain: 'border-red-500/35',
          borderMuted: 'border-red-500/15',
          bgHeader: 'bg-red-950/10 border-b border-red-500/15 backdrop-blur-md',
          bgFooter: 'bg-red-950/35 border-t border-red-500/15 backdrop-blur-md',
          drawerOverlay: 'bg-[#100101]'
        };
      case 'monochrome':
        return {
          accentText: 'text-zinc-100',
          accentTextMuted: 'text-zinc-300/85',
          accentBg: 'bg-zinc-100',
          accentBgHover: 'hover:bg-zinc-200',
          accentTextHover: 'hover:text-zinc-200',
          groupTextHover: 'group-hover:text-zinc-200',
          indicatorBg: 'bg-zinc-200/80',
          borderHighlight: 'border-zinc-500/40',
          badgeStyles: 'text-zinc-300 bg-zinc-900/40 border border-zinc-700/30 backdrop-blur-md',
          taglineText: 'text-zinc-300',
          taglineBg: 'bg-zinc-900/40',
          taglineBorder: 'border-zinc-800/40',
          glowPrimary: 'bg-zinc-700/5',
          glowSecondary: 'bg-zinc-600/5',
          accentIconColor: 'text-zinc-200',
          focusBorder: 'focus:border-zinc-300',
          accentLine: 'from-zinc-300',
          scrollbarThumb: 'scrollbar-thumb-zinc-700',
          buttonActiveBorder: 'border-zinc-400',
          buttonActiveBg: 'bg-zinc-100',
          themeSelectorActive: 'bg-zinc-100 text-zinc-950 font-bold border-zinc-200',
          chamberStatuses: {
            vault1: 'text-zinc-400 border-zinc-700/20 bg-zinc-900/20 backdrop-blur-md',
            vault2: 'text-zinc-300 border-zinc-700/20 bg-zinc-900/20 backdrop-blur-md',
            vault3: 'text-zinc-400 border-zinc-700/20 bg-zinc-900/20 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-100',
          textSecondary: 'text-zinc-300',
          textMuted: 'text-zinc-500',
          bgMain: 'bg-zinc-950/30 backdrop-blur-3xl',
          bgCard: 'bg-zinc-900/25 border border-zinc-700/35 backdrop-blur-xl shadow-2xl shadow-black/50',
          borderMain: 'border-zinc-700/40',
          borderMuted: 'border-zinc-850/40',
          bgHeader: 'bg-zinc-950/10 border-b border-zinc-800/30 backdrop-blur-md',
          bgFooter: 'bg-zinc-950/45 border-t border-zinc-800/30 backdrop-blur-md',
          drawerOverlay: 'bg-zinc-950'
        };
      case 'classic':
      default:
        return {
          accentText: 'text-rose-300',
          accentTextMuted: 'text-rose-400/80',
          accentBg: 'bg-rose-400',
          accentBgHover: 'hover:bg-rose-300',
          accentTextHover: 'hover:text-rose-300',
          groupTextHover: 'group-hover:text-rose-300',
          indicatorBg: 'bg-rose-400/80',
          borderHighlight: 'border-rose-500/40',
          badgeStyles: 'text-rose-300 bg-rose-950/40 border border-rose-500/20 backdrop-blur-md',
          taglineText: 'text-emerald-300',
          taglineBg: 'bg-emerald-950/30',
          taglineBorder: 'border-emerald-900/30',
          glowPrimary: 'bg-rose-500/5',
          glowSecondary: 'bg-emerald-500/5',
          accentIconColor: 'text-rose-300',
          focusBorder: 'focus:border-rose-400',
          accentLine: 'from-rose-300',
          scrollbarThumb: 'scrollbar-thumb-zinc-800',
          buttonActiveBorder: 'border-zinc-200',
          buttonActiveBg: 'bg-zinc-100',
          themeSelectorActive: 'bg-zinc-100 text-zinc-950 font-bold border-zinc-200',
          chamberStatuses: {
            vault1: 'text-rose-400 border-rose-500/20 bg-rose-950/20 backdrop-blur-md',
            vault2: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md',
            vault3: 'text-rose-400 border-rose-500/20 bg-rose-950/20 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-100',
          textSecondary: 'text-zinc-300',
          textMuted: 'text-zinc-500',
          bgMain: 'bg-zinc-950/30 backdrop-blur-3xl',
          bgCard: 'bg-zinc-950/25 border border-rose-500/20 backdrop-blur-xl shadow-2xl shadow-black/40',
          borderMain: 'border-rose-500/35',
          borderMuted: 'border-rose-500/15',
          bgHeader: 'bg-zinc-950/10 border-b border-rose-500/15 backdrop-blur-md',
          bgFooter: 'bg-zinc-950/45 border-t border-rose-500/15 backdrop-blur-md',
          drawerOverlay: 'bg-zinc-950'
        };
    }
  } else {
    // LIGHT MODE
    switch (theme) {
      case 'neon-mint':
        return {
          accentText: 'text-emerald-600',
          accentTextMuted: 'text-emerald-600/80',
          accentBg: 'bg-emerald-500',
          accentBgHover: 'hover:bg-emerald-600',
          accentTextHover: 'hover:text-emerald-600',
          groupTextHover: 'group-hover:text-emerald-600',
          indicatorBg: 'bg-emerald-500',
          borderHighlight: 'border-emerald-300/60',
          badgeStyles: 'text-emerald-700 bg-white/50 border border-emerald-200/50 backdrop-blur-md',
          taglineText: 'text-emerald-700',
          taglineBg: 'bg-emerald-50',
          taglineBorder: 'border-emerald-200/50',
          glowPrimary: 'bg-emerald-500/10',
          glowSecondary: 'bg-cyan-500/10',
          accentIconColor: 'text-emerald-600',
          focusBorder: 'focus:border-emerald-500',
          accentLine: 'from-emerald-500',
          scrollbarThumb: 'scrollbar-thumb-emerald-200',
          buttonActiveBorder: 'border-emerald-500',
          buttonActiveBg: 'bg-emerald-500 text-white',
          themeSelectorActive: 'bg-emerald-500 text-white font-bold border-emerald-400',
          chamberStatuses: {
            vault1: 'text-emerald-600 border-emerald-200/50 bg-white/40 backdrop-blur-md',
            vault2: 'text-cyan-600 border-cyan-200/50 bg-white/40 backdrop-blur-md',
            vault3: 'text-emerald-600 border-emerald-200/50 bg-white/40 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-800',
          textSecondary: 'text-zinc-650',
          textMuted: 'text-zinc-400',
          bgMain: 'bg-emerald-50/20 backdrop-blur-3xl',
          bgCard: 'bg-white/45 border border-emerald-500/20 backdrop-blur-xl shadow-lg shadow-emerald-100/30',
          borderMain: 'border-emerald-200/60',
          borderMuted: 'border-emerald-200/30',
          bgHeader: 'bg-white/40 border-b border-emerald-200/40 backdrop-blur-md',
          bgFooter: 'bg-emerald-50/70 border-t border-emerald-200/40 backdrop-blur-md',
          drawerOverlay: 'bg-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] border border-emerald-200'
        };
      case 'crimson-moon':
        return {
          accentText: 'text-red-600',
          accentTextMuted: 'text-red-600/80',
          accentBg: 'bg-red-500',
          accentBgHover: 'hover:bg-red-600',
          accentTextHover: 'hover:text-red-600',
          groupTextHover: 'group-hover:text-red-600',
          indicatorBg: 'bg-red-500',
          borderHighlight: 'border-red-300/60',
          badgeStyles: 'text-red-700 bg-white/50 border border-red-200/50 backdrop-blur-md',
          taglineText: 'text-red-700',
          taglineBg: 'bg-red-50',
          taglineBorder: 'border-red-200/50',
          glowPrimary: 'bg-red-500/10',
          glowSecondary: 'bg-rose-500/10',
          accentIconColor: 'text-red-600',
          focusBorder: 'focus:border-red-500',
          accentLine: 'from-red-500',
          scrollbarThumb: 'scrollbar-thumb-red-200',
          buttonActiveBorder: 'border-red-500',
          buttonActiveBg: 'bg-red-500 text-white',
          themeSelectorActive: 'bg-red-500 text-white font-bold border-red-400',
          chamberStatuses: {
            vault1: 'text-red-600 border-red-200/50 bg-white/40 backdrop-blur-md',
            vault2: 'text-rose-600 border-rose-200/50 bg-white/40 backdrop-blur-md',
            vault3: 'text-red-600 border-red-200/50 bg-white/40 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-800',
          textSecondary: 'text-zinc-650',
          textMuted: 'text-zinc-400',
          bgMain: 'bg-red-50/20 backdrop-blur-3xl',
          bgCard: 'bg-white/45 border border-red-500/15 backdrop-blur-xl shadow-lg shadow-red-100/30',
          borderMain: 'border-red-200/60',
          borderMuted: 'border-red-200/30',
          bgHeader: 'bg-white/40 border-b border-red-200/40 backdrop-blur-md',
          bgFooter: 'bg-red-50/70 border-t border-red-200/40 backdrop-blur-md',
          drawerOverlay: 'bg-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] border border-red-250'
        };
      case 'monochrome':
        return {
          accentText: 'text-zinc-900',
          accentTextMuted: 'text-zinc-700/80',
          accentBg: 'bg-zinc-800',
          accentBgHover: 'hover:bg-zinc-900',
          accentTextHover: 'hover:text-zinc-900',
          groupTextHover: 'group-hover:text-zinc-900',
          indicatorBg: 'bg-zinc-900',
          borderHighlight: 'border-zinc-400/60',
          badgeStyles: 'text-zinc-800 bg-white/50 border border-zinc-200/60 backdrop-blur-md',
          taglineText: 'text-zinc-800',
          taglineBg: 'bg-zinc-100',
          taglineBorder: 'border-zinc-200',
          glowPrimary: 'bg-zinc-400/10',
          glowSecondary: 'bg-zinc-300/10',
          accentIconColor: 'text-zinc-800',
          focusBorder: 'focus:border-zinc-800',
          accentLine: 'from-zinc-800',
          scrollbarThumb: 'scrollbar-thumb-zinc-300',
          buttonActiveBorder: 'border-zinc-800',
          buttonActiveBg: 'bg-zinc-800 text-white',
          themeSelectorActive: 'bg-zinc-800 text-white font-bold border-zinc-700',
          chamberStatuses: {
            vault1: 'text-zinc-700 border-zinc-200/50 bg-white/40 backdrop-blur-md',
            vault2: 'text-zinc-800 border-zinc-200/50 bg-white/40 backdrop-blur-md',
            vault3: 'text-zinc-700 border-zinc-200/50 bg-white/40 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-800',
          textSecondary: 'text-zinc-650',
          textMuted: 'text-zinc-400',
          bgMain: 'bg-zinc-100/20 backdrop-blur-3xl',
          bgCard: 'bg-white/45 border border-zinc-300/60 backdrop-blur-xl shadow-lg shadow-zinc-200/30',
          borderMain: 'border-zinc-300/80',
          borderMuted: 'border-zinc-200/55',
          bgHeader: 'bg-white/40 border-b border-zinc-200/60 backdrop-blur-md',
          bgFooter: 'bg-zinc-100/80 border-t border-zinc-200/60 backdrop-blur-md',
          drawerOverlay: 'bg-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] border border-zinc-200'
        };
      case 'classic':
      default:
        return {
          accentText: 'text-rose-600',
          accentTextMuted: 'text-rose-600/80',
          accentBg: 'bg-rose-500',
          accentBgHover: 'hover:bg-rose-600',
          accentTextHover: 'hover:text-rose-600',
          groupTextHover: 'group-hover:text-rose-600',
          indicatorBg: 'bg-rose-500',
          borderHighlight: 'border-rose-300/60',
          badgeStyles: 'text-rose-700 bg-white/50 border border-rose-200/50 backdrop-blur-md',
          taglineText: 'text-emerald-700',
          taglineBg: 'bg-emerald-50',
          taglineBorder: 'border-emerald-200/50',
          glowPrimary: 'bg-rose-500/10',
          glowSecondary: 'bg-emerald-500/10',
          accentIconColor: 'text-rose-600',
          focusBorder: 'focus:border-rose-500',
          accentLine: 'from-rose-500',
          scrollbarThumb: 'scrollbar-thumb-rose-200',
          buttonActiveBorder: 'border-rose-500',
          buttonActiveBg: 'bg-rose-500 text-white',
          themeSelectorActive: 'bg-rose-500 text-white font-bold border-rose-400',
          chamberStatuses: {
            vault1: 'text-rose-600 border-rose-200/50 bg-white/40 backdrop-blur-md',
            vault2: 'text-emerald-600 border-emerald-200/50 bg-white/40 backdrop-blur-md',
            vault3: 'text-rose-600 border-rose-200/50 bg-white/40 backdrop-blur-md'
          },
          textPrimary: 'text-zinc-800',
          textSecondary: 'text-zinc-650',
          textMuted: 'text-zinc-400',
          bgMain: 'bg-rose-50/20 backdrop-blur-3xl',
          bgCard: 'bg-white/45 border border-rose-500/15 backdrop-blur-xl shadow-lg shadow-rose-100/30',
          borderMain: 'border-rose-200/60',
          borderMuted: 'border-rose-200/30',
          bgHeader: 'bg-white/40 border-b border-rose-200/40 backdrop-blur-md',
          bgFooter: 'bg-rose-50/70 border-t border-rose-200/40 backdrop-blur-md',
          drawerOverlay: 'bg-white shadow-[0_15px_30px_rgba(0,0,0,0.15)] border border-rose-200'
        };
    }
  }
};
