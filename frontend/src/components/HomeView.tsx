/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, ApparelItem, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { ResourceLab } from './ResourceLab';
import { 
  ArrowUpRight, 
  Compass, 
  Shield, 
  Flame, 
  Check, 
  ShoppingBag, 
  Eye, 
  X, 
  Users, 
  Volume2, 
  Tv, 
  Gamepad2, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Radio,
  MessageSquare, 
  Heart, 
  Smile, 
  Star, 
  HelpCircle,
  MessageCircle,
  TrendingUp,
  Award,
  Zap,
  ChevronDown
} from 'lucide-react';

interface HomeViewProps {
  setCurrentPage: (page: PageId) => void;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser?: string | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentPage, activeAtmosphere, isDarkMode, currentUser }) => {
  const [selectedProduct, setSelectedProduct] = useState<ApparelItem | null>(null);
  const [acquiredSuccess, setAcquiredSuccess] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const getGradientToClass = () => {
    if (activeAtmosphere.colorTheme === 'neon-mint') {
      return isDarkMode ? 'to-emerald-400' : 'to-emerald-600';
    }
    if (activeAtmosphere.colorTheme === 'crimson-moon') {
      return isDarkMode ? 'to-red-400' : 'to-red-600';
    }
    if (activeAtmosphere.colorTheme === 'monochrome') {
      return isDarkMode ? 'to-zinc-200' : 'to-zinc-800';
    }
    return isDarkMode ? 'to-rose-300' : 'to-rose-600'; // classic / sakura
  };

  const getStatsGradient = (index: number) => {
    const theme = activeAtmosphere.colorTheme;
    if (theme === 'neon-mint') {
      const gradients = [
        'from-emerald-400 to-emerald-300',
        'from-emerald-300 to-teal-300',
        'from-teal-300 to-cyan-400'
      ];
      return gradients[index];
    }
    if (theme === 'crimson-moon') {
      const gradients = [
        'from-red-400 to-rose-500',
        'from-orange-400 to-red-500',
        'from-rose-500 to-fuchsia-400'
      ];
      return gradients[index];
    }
    if (theme === 'monochrome') {
      const gradients = [
        'from-white to-zinc-400',
        'from-zinc-300 to-zinc-500',
        'from-zinc-200 to-zinc-400'
      ];
      return gradients[index];
    }
    // Classic/Sakura
    const gradients = [
      'from-rose-400 to-rose-300',
      'from-rose-300 to-pink-300',
      'from-pink-300 to-amber-200'
    ];
    return gradients[index];
  };

  const getSectorStyles = (index: number) => {
    const theme = activeAtmosphere.colorTheme;
    if (isDarkMode) {
      if (theme === 'neon-mint') {
        const colors = [
          { bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/40 border-emerald-500/10', text: 'text-emerald-400', hoverText: 'group-hover:text-emerald-400' },
          { bg: 'bg-teal-500/10', border: 'hover:border-teal-500/40 border-teal-500/10', text: 'text-teal-400', hoverText: 'group-hover:text-teal-400' },
          { bg: 'bg-cyan-500/10', border: 'hover:border-cyan-500/40 border-cyan-500/10', text: 'text-cyan-400', hoverText: 'group-hover:text-cyan-400' },
          { bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/40 border-emerald-500/10', text: 'text-emerald-400', hoverText: 'group-hover:text-emerald-400' }
        ];
        return colors[index];
      }
      if (theme === 'crimson-moon') {
        const colors = [
          { bg: 'bg-red-500/10', border: 'hover:border-red-500/40 border-red-500/10', text: 'text-red-400', hoverText: 'group-hover:text-red-400' },
          { bg: 'bg-rose-500/10', border: 'hover:border-rose-500/40 border-rose-500/10', text: 'text-rose-400', hoverText: 'group-hover:text-rose-400' },
          { bg: 'bg-orange-500/10', border: 'hover:border-orange-500/40 border-orange-500/10', text: 'text-orange-400', hoverText: 'group-hover:text-orange-400' },
          { bg: 'bg-red-500/10', border: 'hover:border-red-500/40 border-red-500/10', text: 'text-red-400', hoverText: 'group-hover:text-red-400' }
        ];
        return colors[index];
      }
      if (theme === 'monochrome') {
        const colors = [
          { bg: 'bg-zinc-100/10', border: 'hover:border-zinc-400/40 border-zinc-800', text: 'text-zinc-200', hoverText: 'group-hover:text-zinc-200' },
          { bg: 'bg-zinc-200/10', border: 'hover:border-zinc-400/40 border-zinc-800', text: 'text-zinc-300', hoverText: 'group-hover:text-zinc-300' },
          { bg: 'bg-zinc-300/10', border: 'hover:border-zinc-400/40 border-zinc-800', text: 'text-zinc-400', hoverText: 'group-hover:text-zinc-400' },
          { bg: 'bg-zinc-100/10', border: 'hover:border-zinc-400/40 border-zinc-800', text: 'text-zinc-200', hoverText: 'group-hover:text-zinc-200' }
        ];
        return colors[index];
      }
      // Classic/Sakura
      const colors = [
        { bg: 'bg-rose-500/10', border: 'hover:border-rose-500/40 border-rose-500/10', text: 'text-rose-400', hoverText: 'group-hover:text-rose-400' },
        { bg: 'bg-pink-500/10', border: 'hover:border-pink-500/40 border-pink-500/10', text: 'text-pink-400', hoverText: 'group-hover:text-pink-400' },
        { bg: 'bg-amber-500/10', border: 'hover:border-amber-500/40 border-amber-500/10', text: 'text-amber-400', hoverText: 'group-hover:text-amber-400' },
        { bg: 'bg-rose-500/10', border: 'hover:border-rose-500/40 border-rose-500/10', text: 'text-rose-400', hoverText: 'group-hover:text-rose-400' }
      ];
      return colors[index];
    } else {
      // LIGHT MODE (High Contrast)
      if (theme === 'neon-mint') {
        const colors = [
          { bg: 'bg-emerald-500/15 border-emerald-500/30', border: 'hover:border-emerald-500/60 border-zinc-200/60', text: 'text-emerald-700', hoverText: 'group-hover:text-emerald-700' },
          { bg: 'bg-teal-500/15 border-teal-500/30', border: 'hover:border-teal-500/60 border-zinc-200/60', text: 'text-teal-700', hoverText: 'group-hover:text-teal-700' },
          { bg: 'bg-cyan-500/15 border-cyan-500/30', border: 'hover:border-cyan-500/60 border-zinc-200/60', text: 'text-cyan-700', hoverText: 'group-hover:text-cyan-700' },
          { bg: 'bg-emerald-500/15 border-emerald-500/30', border: 'hover:border-emerald-500/60 border-zinc-200/60', text: 'text-emerald-700', hoverText: 'group-hover:text-emerald-700' }
        ];
        return colors[index];
      }
      if (theme === 'crimson-moon') {
        const colors = [
          { bg: 'bg-red-500/15 border-red-500/30', border: 'hover:border-red-500/60 border-zinc-200/60', text: 'text-red-700', hoverText: 'group-hover:text-red-700' },
          { bg: 'bg-rose-500/15 border-rose-500/30', border: 'hover:border-rose-500/60 border-zinc-200/60', text: 'text-rose-700', hoverText: 'group-hover:text-rose-700' },
          { bg: 'bg-orange-500/15 border-orange-500/30', border: 'hover:border-orange-500/60 border-zinc-200/60', text: 'text-orange-700', hoverText: 'group-hover:text-orange-700' },
          { bg: 'bg-red-500/15 border-red-500/30', border: 'hover:border-red-500/60 border-zinc-200/60', text: 'text-red-700', hoverText: 'group-hover:text-red-700' }
        ];
        return colors[index];
      }
      if (theme === 'monochrome') {
        const colors = [
          { bg: 'bg-zinc-200/40 border-zinc-300', border: 'hover:border-zinc-500/60 border-zinc-200/60', text: 'text-zinc-800', hoverText: 'group-hover:text-zinc-800' },
          { bg: 'bg-zinc-200/40 border-zinc-300', border: 'hover:border-zinc-500/60 border-zinc-200/60', text: 'text-zinc-800', hoverText: 'group-hover:text-zinc-800' },
          { bg: 'bg-zinc-200/40 border-zinc-300', border: 'hover:border-zinc-500/60 border-zinc-200/60', text: 'text-zinc-800', hoverText: 'group-hover:text-zinc-800' },
          { bg: 'bg-zinc-200/40 border-zinc-300', border: 'hover:border-zinc-500/60 border-zinc-200/60', text: 'text-zinc-800', hoverText: 'group-hover:text-zinc-800' }
        ];
        return colors[index];
      }
      // Classic/Sakura
      const colors = [
        { bg: 'bg-rose-500/15 border-rose-500/30', border: 'hover:border-rose-500/60 border-zinc-200/60', text: 'text-rose-700', hoverText: 'group-hover:text-rose-700' },
        { bg: 'bg-pink-500/15 border-pink-500/30', border: 'hover:border-pink-500/60 border-zinc-200/60', text: 'text-pink-700', hoverText: 'group-hover:text-pink-700' },
        { bg: 'bg-amber-500/15 border-amber-500/30', border: 'hover:border-amber-500/60 border-zinc-200/60', text: 'text-amber-700', hoverText: 'group-hover:text-amber-700' },
        { bg: 'bg-rose-500/15 border-rose-500/30', border: 'hover:border-rose-500/60 border-zinc-200/60', text: 'text-rose-700', hoverText: 'group-hover:text-rose-700' }
      ];
      return colors[index];
    }
  };

  const tiers = [
    {
      id: 'platinum',
      name: 'Platinum Access',
      price: '$3 / mo',
      description: 'Platinum is built for members who want a smoother day-to-day experience inside the server. It keeps the vibe premium with practical upgrades.',
      features: [
        'External Emoji, Sticker, GIF and Image perms',
        'Soundboard non-external permissions',
        'Expressive custom Nick perms',
        'Selective external reactions in chat rooms'
      ],
      icon: Compass,
      color: `${themeStyles.borderMain} ${themeStyles.accentText}`
    },
    {
      id: 'diamond',
      name: 'Diamond Access',
      price: '$9 / mo',
      description: 'The balanced premium tier with stronger voice features, wider reaction access, and a personal color role for standout identity.',
      features: [
        'Everything in Platinum tier',
        'VC plus Soundboard external permissions',
        'Manage Nick permissions in key zones',
        'External Reaction in all channels',
        'Personal custom color role'
      ],
      icon: Flame,
      color: `${themeStyles.borderHighlight} ${themeStyles.bgCard} ${themeStyles.accentText}`
    },
    {
      id: 'titanium',
      name: 'Titanium Access',
      price: '$15 / mo',
      description: 'Designed for our most invested elite members. Includes high-value administrative-style visibility and total personalization.',
      features: [
        'Everything in Diamond tier',
        'Premium Audit log access',
        'Gift 2 free Platinum memberships to friends',
        'Custom self-role control systems',
        'Global spam whitelist immunity'
      ],
      icon: Shield,
      color: `${themeStyles.borderMain} ${themeStyles.bgCard} ${themeStyles.textPrimary}`
    }
  ];

  const promotionalNodes = [
    {
      id: 'node-promo',
      name: 'Premium Promotions',
      category: 'MARKETPLACE',
      price: 'Contact Us',
      description: 'Boost your brand or server reach with spotlight announcements, pin placements, and custom roles in our high-traffic channels.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'node-minecraft',
      name: 'Survival SMP Access',
      category: 'GAMING HUB',
      price: 'Free for Members',
      description: 'Jump into blocky chaos, community builds, and laid-back custom survival perks on our 24/7 dedicated Minecraft node.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'node-events',
      name: 'Weekly Movie & Sound',
      category: 'COMMUNITY NODE',
      price: 'Included',
      description: 'Access movie nights, karaoke, game tournaments, and live music jam sessions hosted by our awesome event coordinators.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'node-gaming',
      name: 'Squad Finder & LFG',
      category: 'GAMING SQUADS',
      price: 'Included',
      description: 'Find active teammates instantly for Valorant, Minecraft, League of Legends, and more through our pingable roles.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const faqs = [
    {
      q: "What is INEFFABLE?",
      a: "INEFFABLE is a premium, legendary community server running strong for over 6 years. It is built on friendships, loyalty, fun, and unforgettable memories, providing members with highly active voice rooms, secure text channels, and regular community events."
    },
    {
      q: "How do I upgrade to Platinum, Diamond, or Titanium Access?",
      a: "You can purchase any of our premium membership tiers directly here or through our Discord Server Shop. These tiers help cover our hosting nodes and grant you immediate premium roles, extra reactions, custom colors, and soundboard permissions."
    },
    {
      q: "Are the Minecraft server and weekly gaming events free?",
      a: "Yes! All verified server members can join our survival Minecraft server, movie nights, gaming tournaments, and LFG chats at zero cost. Premium tiers simply add awesome optional customization options to show off your support."
    },
    {
      q: "How can I partner or promote my brand within Inefontop?",
      a: "We offer dedicated promotion slots, spotlight text announcements, and event sponsorship opportunities. Click on 'PREVIEW' under the Premium Promotions node above or contact our administration team through the Connect page."
    }
  ];

  const handleAcquire = () => {
    if (!currentUser) {
      setSelectedProduct(null);
      setCurrentPage('login');
      return;
    }
    setAcquiredSuccess(true);
    setTimeout(() => {
      setAcquiredSuccess(false);
      setSelectedProduct(null);
    }, 2500);
  };

  return (
    <div id="home-view-container" className={`relative ${themeStyles.textPrimary} pb-24`}>
      
      {/* Cinematic Hero - Discord Rebrand */}
      <section 
        id="home-hero-section"
        className="relative min-h-screen flex flex-col justify-center px-6 lg:px-16 overflow-hidden pt-24"
      >
        {/* Background mesh glow */}
        <div className={`absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full ${themeStyles.glowPrimary} blur-[120px] pointer-events-none`} />
        <div className={`absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] rounded-full ${themeStyles.glowSecondary} blur-[100px] pointer-events-none`} />

        <div className="max-w-7xl mx-auto w-[1280px] max-w-full pl-0 pt-0 mt-0 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: HERO CONTENT (OLD THEME PRESERVED) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start"
          >


            <h1 
              id="hero-main-title"
              className={`text-6xl md:text-8xl xl:text-9xl font-sans tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 ${getGradientToClass()} leading-[0.9] uppercase filter drop-shadow-2xl`}
            >
              INEFFABLE
            </h1>
            
            <h2 
              id="hero-sub-title"
              className={`text-xl md:text-2xl font-mono tracking-[0.05em] ${themeStyles.accentText} font-medium mt-6`}
            >
              A Legendary Community Server Running Strong For 6 Years
            </h2>

            <p 
              id="hero-brief"
              className={`${themeStyles.textSecondary} font-sans max-w-2xl text-base md:text-lg mt-6 leading-relaxed font-light mx-auto lg:mx-0`}
            >
              Built on friendships, loyalty, fun, and unforgettable memories. Join active voice chats, gaming events, and a place where everyone belongs—from old legends to new members.
            </p>

            <div id="hero-actions" className="flex flex-wrap justify-center lg:justify-start gap-4 mt-10">
              <a
                href="https://discord.gg/inefontop"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-2 ${themeStyles.accentBg} ${themeStyles.accentBgHover} text-zinc-950 font-mono text-[10px] tracking-widest font-bold transition-all duration-300 rounded-xl px-5 py-2.5 cursor-pointer border ${themeStyles.borderHighlight} hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]`}
              >
                <Radio className="w-3.5 h-3.5 text-zinc-950 animate-pulse" />
                <span>JOIN DISCORD NODE</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-80 text-zinc-950" />
              </a>
              <button
                id="hero-cta-gallery"
                onClick={() => setCurrentPage('about')}
                className={`flex items-center space-x-2 ${themeStyles.bgCard} hover:bg-zinc-500/10 border ${themeStyles.borderMain} ${themeStyles.textPrimary} font-mono text-[10px] tracking-widest font-bold transition-all duration-300 rounded-xl px-5 py-2.5 cursor-pointer`}
              >
                <span>ABOUT US</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: LOGO */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 flex justify-center items-center w-full"
          >
            <motion.div
              className="w-80 h-80 md:w-[480px] md:h-[480px] relative flex items-center justify-center select-none"
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {/* Glassy background */}
              <div className={`absolute inset-0 rounded-3xl backdrop-blur-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} shadow-xl transition-all duration-300`} />
              
              {/* Your logo image with transparent background */}
              <img 
                src="/inefwebsitegif.gif" 
                alt="INEFFABLE Logo" 
                className="w-[90%] h-[90%] z-10 object-contain drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              />
            </motion.div>
          </motion.div>

        </div>

        {/* Minimal Scroll down indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none">
          <span className={`font-mono text-[9px] tracking-[0.3em] ${themeStyles.textMuted} uppercase`}>
            SCROLL TO GATEWAY
          </span>
          <div className={`w-[1px] h-12 bg-gradient-to-b ${themeStyles.accentLine} to-transparent animate-pulse`} />
        </div>
      </section>

      {/* Real-time Stats Board */}
      <motion.section 
        id="home-stats-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 py-12 relative z-10"
      >
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${themeStyles.bgCard} backdrop-blur-xl border ${themeStyles.borderMuted} rounded-3xl p-8 md:p-12 text-center shadow-xl`}>
          <div className={`space-y-2 border-b md:border-b-0 md:border-r ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200'} pb-6 md:pb-0`}>
            <div className={`text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${getStatsGradient(0)}`}>13,000+</div>
            <div className={`font-mono text-[10px] tracking-widest ${themeStyles.textMuted} uppercase`}>Verified Members</div>
          </div>
          <div className={`space-y-2 border-b md:border-b-0 md:border-r ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200'} py-6 md:py-0`}>
            <div className={`text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${getStatsGradient(1)}`}>50+</div>
            <div className={`font-mono text-[10px] tracking-widest ${themeStyles.textMuted} uppercase`}>Active Voice Zones</div>
          </div>
          <div className="space-y-2 pt-6 md:pt-0">
            <div className={`text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${getStatsGradient(2)}`}>100+</div>
            <div className={`font-mono text-[10px] tracking-widest ${themeStyles.textMuted} uppercase`}>Epic Giveaways</div>
          </div>
        </div>
      </motion.section>

      {/* Bento Grid: Core Sectors */}
      <section 
        id="home-about-section"
        className={`max-w-7xl mx-auto px-6 py-24 border-t ${themeStyles.borderMuted}`}
      >
        <div className="mb-12 text-center lg:text-left space-y-2">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
            01 // SERVER SPHERES
          </span>
          <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${themeStyles.textPrimary}`}>
            Interactive Server Activities
          </h2>
          <p className={`${themeStyles.textSecondary} max-w-xl font-sans text-sm md:text-base leading-relaxed font-light`}>
            Explore our main interactive sectors custom-built to keep the energy, friendship, and fun alive at all hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Sector 1: Anime */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${themeStyles.bgCard} backdrop-blur-md hover:${isDarkMode ? 'bg-zinc-900/45' : 'bg-white/95'} border ${getSectorStyles(0).border} rounded-2xl p-6 transition-all duration-300 group shadow-lg`}
          >
            <div className={`w-12 h-12 rounded-xl ${getSectorStyles(0).bg} border ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/60'} flex items-center justify-center mb-6 ${getSectorStyles(0).text} group-hover:scale-110 transition-transform`}>
              <Tv className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${getSectorStyles(0).hoverText} transition-colors`}>Anime & Manga</h3>
            <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed font-light`}>
              Catch up on the latest episodes, discuss chapters, and find your next favorites in our active discussion zones.
            </p>
          </motion.div>

          {/* Sector 2: Gaming LFG */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${themeStyles.bgCard} backdrop-blur-md hover:${isDarkMode ? 'bg-zinc-900/45' : 'bg-white/95'} border ${getSectorStyles(1).border} rounded-2xl p-6 transition-all duration-300 group shadow-lg`}
          >
            <div className={`w-12 h-12 rounded-xl ${getSectorStyles(1).bg} border ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/60'} flex items-center justify-center mb-6 ${getSectorStyles(1).text} group-hover:scale-110 transition-transform`}>
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${getSectorStyles(1).hoverText} transition-colors`}>Gaming LFG</h3>
            <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed font-light`}>
              Never play alone. Find groups for Valorant, Minecraft, Among Us, and more instantly through our ping systems.
            </p>
          </motion.div>

          {/* Sector 3: Weekly Events */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${themeStyles.bgCard} backdrop-blur-md hover:${isDarkMode ? 'bg-zinc-900/45' : 'bg-white/95'} border ${getSectorStyles(2).border} rounded-2xl p-6 transition-all duration-300 group shadow-lg`}
          >
            <div className={`w-12 h-12 rounded-xl ${getSectorStyles(2).bg} border ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/60'} flex items-center justify-center mb-6 ${getSectorStyles(2).text} group-hover:scale-110 transition-transform`}>
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${getSectorStyles(2).hoverText} transition-colors`}>Weekly Events</h3>
            <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed font-light`}>
              Movie nights, karaoke, and tournaments hosted regularly by our amazing staff to keep the vibes high.
            </p>
          </motion.div>

          {/* Sector 4: Active VCs */}
          <motion.div 
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`${themeStyles.bgCard} backdrop-blur-md hover:${isDarkMode ? 'bg-zinc-900/45' : 'bg-white/95'} border ${getSectorStyles(3).border} rounded-2xl p-6 transition-all duration-300 group shadow-lg`}
          >
            <div className={`w-12 h-12 rounded-xl ${getSectorStyles(3).bg} border ${isDarkMode ? 'border-zinc-800/60' : 'border-zinc-200/60'} flex items-center justify-center mb-6 ${getSectorStyles(3).text} group-hover:scale-110 transition-transform`}>
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold mb-2 ${getSectorStyles(3).hoverText} transition-colors`}>Voice Zones</h3>
            <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed font-light`}>
              Jump into our VCs anytime. Stream games, blast music, debate, or just chill. The community is always awake.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Aesthetic Resource Lab from inef.cc */}
      <ResourceLab activeAtmosphere={activeAtmosphere} isDarkMode={isDarkMode} />

      {/* Promotional Nodes & Minecraft Realms */}
      <section 
        id="home-apparel-section"
        className={`max-w-7xl mx-auto px-6 py-24 border-t ${themeStyles.borderMuted}`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-4">
            <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
              02 // EXCLUSIVE CHANNELS
            </span>
            <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${themeStyles.textPrimary}`}>
              Premium Services & Nodes
            </h2>
          </div>
          <p className={`${themeStyles.textMuted} font-mono text-[10px] tracking-widest mt-4 md:mt-0 uppercase`}>
            COMMUNITY NODES & SPONSORED SLOTS
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promotionalNodes.map((item, index) => (
            <motion.div 
              id={`product-card-${item.id}`}
              key={item.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative flex flex-col ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500 rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-950 mb-4">
                <img 
                  id={`product-img-${item.id}`}
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:brightness-90 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <button
                    id={`view-product-btn-${item.id}`}
                    onClick={() => setSelectedProduct(item as any)}
                    className={`flex-1 py-2 ${themeStyles.accentBg} ${themeStyles.accentBgHover} text-zinc-950 rounded-lg text-[10px] font-mono tracking-widest transition-all flex items-center justify-center space-x-1 cursor-pointer font-bold`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>PREVIEW DETAILEDINFO</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className={`font-mono text-[9px] tracking-[0.2em] ${themeStyles.accentTextMuted} block mb-1`}>
                    {item.category}
                  </span>
                  <h3 className={`font-sans text-base tracking-wide font-bold ${themeStyles.textPrimary} ${themeStyles.groupTextHover} transition-colors`}>
                    {item.name}
                  </h3>
                  <p className={`text-xs ${themeStyles.textSecondary} line-clamp-2 mt-2 font-light leading-relaxed`}>
                    {item.description}
                  </p>
                </div>
                <div className={`flex items-center justify-between mt-4 border-t ${themeStyles.borderMuted} pt-3`}>
                  <span className={`font-mono text-xs ${themeStyles.accentText} font-bold`}>
                    {item.price}
                  </span>
                  <span className={`font-mono text-[9px] ${themeStyles.textMuted} tracking-wider uppercase`}>
                    [ONLINE NODE]
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inefontop Tiers */}
      <section 
        id="home-tiers-section"
        className={`max-w-7xl mx-auto px-6 py-24 border-t ${themeStyles.borderMuted}`}
      >
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
            03 // DONATE / BOOST
          </span>
          <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${themeStyles.textPrimary}`}>
            Support INEFFABLE
          </h2>
          <p className={`${themeStyles.textSecondary} font-sans text-sm md:text-base leading-relaxed font-light`}>
            Support our hosting and secure exclusive customized roles, extra reactions, external stickers permissions, global custom color roles, and elite voice privileges.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {tiers.map((t, index) => {
            const IconComponent = t.icon;
            const isFeatured = t.id === 'diamond';
            return (
              <motion.div 
                id={`tier-card-${t.id}`}
                key={t.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 ${t.color} ${
                  isFeatured 
                    ? `${isDarkMode ? 'bg-zinc-900/40' : 'bg-zinc-50'} ${themeStyles.borderHighlight} hover:shadow-2xl` 
                    : `${themeStyles.bgCard} opacity-95`
                }`}
              >
                {isFeatured && (
                  <span className={`absolute top-4 right-4 ${themeStyles.accentBg} text-zinc-950 font-mono text-[9px] tracking-widest px-3 py-1 rounded-full border ${themeStyles.borderHighlight} font-bold uppercase animate-pulse`}>
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <div className={`w-12 h-12 rounded-xl ${themeStyles.bgCard} border ${isFeatured ? themeStyles.borderHighlight : themeStyles.borderMuted} flex items-center justify-center mb-6`}>
                    <IconComponent className={`w-6 h-6 ${isFeatured ? themeStyles.accentText : ''}`} />
                  </div>
                  <h3 className={`text-xl font-sans tracking-wide font-extrabold ${themeStyles.textPrimary}`}>
                    {t.name}
                  </h3>
                  <div className="flex items-baseline mt-2 mb-6">
                    <span className={`font-mono text-3xl font-extrabold ${themeStyles.textPrimary}`}>{t.price}</span>
                  </div>
                  <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed mb-6`}>
                    {t.description}
                  </p>
                  
                  <ul className={`space-y-3.5 border-t ${themeStyles.borderMuted} pt-6`}>
                    {t.features.map((feat, idx) => (
                      <li key={idx} className={`flex items-center space-x-3 text-xs ${themeStyles.textSecondary} font-light`}>
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  id={`tier-acquire-btn-${t.id}`}
                  onClick={() => {
                    setSelectedProduct({
                      id: t.id,
                      name: t.name,
                      price: t.price,
                      description: t.description,
                      category: 'MEMBERSHIP TIER',
                      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
                    });
                  }}
                  className={`w-full mt-8 py-3.5 rounded-xl font-mono text-[10px] tracking-[0.2em] transition-all duration-300 cursor-pointer ${
                    isFeatured 
                      ? `${themeStyles.accentBg} ${themeStyles.accentBgHover} text-zinc-950 font-bold shadow-lg` 
                      : `${isDarkMode ? 'bg-zinc-900/20 hover:bg-zinc-900/40' : 'bg-zinc-100 hover:bg-zinc-200'} ${themeStyles.textPrimary} border ${themeStyles.borderMuted}`
                  }`}
                >
                  ACQUIRE TIER ACCESS
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section 
        id="home-faq-section"
        className={`max-w-4xl mx-auto px-6 py-24 border-t ${themeStyles.borderMuted}`}
      >
        <div className="text-center mb-16 space-y-4">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
            04 // HELP CENTER
          </span>
          <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${themeStyles.textPrimary}`}>
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`${themeStyles.bgCard} border ${themeStyles.borderMuted} rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className={`w-full px-6 py-5 flex items-center justify-between text-left hover:${isDarkMode ? 'bg-zinc-900/40' : 'bg-zinc-100/50'} transition-colors font-sans font-bold ${themeStyles.textPrimary} text-sm md:text-base cursor-pointer`}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ${activeFaq === i ? `rotate-180 ${themeStyles.textPrimary}` : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className={`px-6 pb-6 pt-2 border-t ${isDarkMode ? 'border-zinc-800/40' : 'border-zinc-100'} text-xs md:text-sm ${themeStyles.textSecondary} font-light leading-relaxed`}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dynamic Product Overlay Drawers */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            id="product-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md"
          >
            <motion.div 
              id="product-drawer-body"
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`relative w-full max-w-2xl ${isDarkMode ? 'bg-zinc-950' : 'bg-white'} border ${themeStyles.borderMuted} rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row`}
            >
              <button
                id="product-drawer-close"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-900/95 text-zinc-400 hover:text-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[450px] bg-zinc-950">
                <img 
                  id="product-drawer-img"
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover grayscale"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className={`font-mono text-[10px] tracking-widest ${themeStyles.accentText}`}>
                    {selectedProduct.category}
                  </span>
                  <h3 className={`font-sans text-2xl font-light ${themeStyles.textPrimary} mt-1 uppercase`}>
                    {selectedProduct.name}
                  </h3>
                  <span className={`font-mono text-lg ${themeStyles.accentText} block mt-2 font-light`}>
                    {selectedProduct.price}
                  </span>
                  <p className={`${themeStyles.textSecondary} text-xs mt-6 leading-relaxed font-light`}>
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-8">
                  {acquiredSuccess ? (
                    <div id="acquire-success-banner" className="w-full py-3 bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] tracking-widest text-center rounded-lg animate-pulse">
                      TRANSMISSION INITIALIZED... SECURE PAYMENT LOGGED
                    </div>
                  ) : (
                    <button
                      id="product-drawer-buy-btn"
                      onClick={handleAcquire}
                      className={`w-full py-4 ${themeStyles.accentBg} ${themeStyles.accentBgHover} text-zinc-950 font-mono text-xs tracking-widest font-bold transition-all rounded-lg flex items-center justify-center space-x-2 cursor-pointer shadow-lg`}
                    >
                      <ShoppingBag className="w-4 h-4 text-zinc-950" />
                      <span>GET ACCESS</span>
                    </button>
                  )}
                  <span className={`text-[9px] ${themeStyles.textMuted} font-mono tracking-wide text-center block mt-3`}>
                    SECURE CRYPTO AND CREDITS ACCEPTS // 128-BIT ENCRYPTION
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
