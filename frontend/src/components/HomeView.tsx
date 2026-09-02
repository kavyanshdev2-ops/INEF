/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, ApparelItem, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { MembershipCard, defaultRanks } from './MembershipCard';
import { ScrollDissolveReveal, TextScrollDissolveReveal } from './ScrollDissolveReveal';
import { KineticText } from '@/registry/magicui/kinetic-text';
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
  onAddToCart?: (item: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ setCurrentPage, activeAtmosphere, isDarkMode, currentUser, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<ApparelItem | null>(null);
  const [acquiredSuccess, setAcquiredSuccess] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [stats, setStats] = useState({ members: 0, sanctuaries: 0, years: 0 });
  const statsSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const targets = { members: 2500, sanctuaries: 50, years: 6 };
    const duration = 3200;
    let animationFrame = 0;
    let hasStarted = false;

    const startAnimation = () => {
      if (hasStarted) return;
      hasStarted = true;
      const startedAt = performance.now();

      const animateStats = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setStats({
          members: Math.floor(targets.members * easedProgress),
          sanctuaries: Math.floor(targets.sanctuaries * easedProgress),
          years: Math.floor(targets.years * easedProgress),
        });

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animateStats);
        }
      };

      animationFrame = requestAnimationFrame(animateStats);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        startAnimation();
        observer.disconnect();
      }
    }, { threshold: 0.25 });

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

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
      'from-pink-300 to-rose-300'
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
        { bg: 'bg-rose-500/10', border: 'hover:border-rose-500/40 border-rose-500/10', text: 'text-rose-400', hoverText: 'group-hover:text-rose-400' },
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
        { bg: 'bg-rose-500/15 border-rose-500/30', border: 'hover:border-rose-500/60 border-zinc-200/60', text: 'text-rose-700', hoverText: 'group-hover:text-rose-700' },
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
      description: 'Jump into blocky chaos, community builds, and laid-back custom survival perks on our 24/7 dedicated Minecraft server.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'node-events',
      name: 'Weekly Movie & Sound',
      category: 'COMMUNITY',
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
      a: "You can purchase any of our premium membership tiers directly here or through our Discord Server Shop. These tiers help cover our hosting and grant you immediate premium roles, extra reactions, custom colors, and soundboard permissions."
    },
    {
      q: "Are the Minecraft server and weekly gaming events free?",
      a: "Yes! All verified server members can join our survival Minecraft server, movie nights, gaming tournaments, and LFG chats at zero cost. Premium tiers simply add awesome optional customization options to show off your support."
    },
    {
      q: "How can I partner or promote my brand within Inefontop?",
      a: "We offer dedicated promotion slots, spotlight text announcements, and event sponsorship opportunities. Click on 'PREVIEW' under the Premium Promotions section above or contact our administration team through the Connect page."
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
    <div id="home-view-container" className="relative min-h-screen pt-24 pb-32 overflow-hidden selection:bg-zinc-800 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Decorative Ambient Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-tr from-zinc-500/5 via-rose-500/5 to-transparent blur-[140px] rounded-full" />
      </div>

      {/* FULL-SCREEN HERO SECTION */}
      <section
        id="home-hero-section"
        className="relative min-h-[85vh] flex flex-col justify-center items-center px-4 md:px-8 py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-col items-center text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 max-w-7xl w-full flex flex-col items-center"
          >
            {/* Ambient Radial Spotlight Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-500/15 dark:bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Kinetic Text Hero Animation */}
            <div className="relative w-full flex items-center justify-center my-2 sm:my-4 select-none overflow-visible max-w-full">
              <KineticText
                text="INEFFABLE"
                letterSpacing="0.18em"
                unhoveredOpacity={0.68}
                hoveredOpacity={1.0}
                className="font-anton text-[clamp(2.2rem,8.5vw,12.5rem)] leading-none uppercase text-black dark:text-white dark:drop-shadow-[0_4px_30px_rgba(255,255,255,0.15)]"
              />
            </div>

            {/* Short Description */}
            <TextScrollDissolveReveal
              text="INEFFABLE bridges high-end streetwear architecture, cyber-couture craftsmanship, and an exclusive global community sanctuary running strong for 6 years."
              className="max-w-xl text-base md:text-lg mt-4 font-normal tracking-wide opacity-90"
              wordClassName={`${themeStyles.textSecondary} font-sans`}
            />

            {/* CTA Buttons */}
            <div id="hero-actions" className="flex flex-wrap justify-center items-center gap-4 mt-10">
              <a
                href="https://discord.gg/inefontop"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-3 ${themeStyles.accentBg} ${themeStyles.accentBgHover} text-zinc-950 font-mono text-xs tracking-[0.2em] font-extrabold py-3.5 px-8 rounded-full shadow-[0_4px_20px_rgba(244,63,94,0.3)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer`}
              >
                <Radio className="w-4 h-4 animate-pulse text-zinc-950" />
                <span>JOIN DISCORD</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 text-zinc-950" />
              </a>

              <button
                id="hero-cta-about"
                onClick={() => setCurrentPage('about')}
                className={`flex items-center space-x-3 ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-400 ${themeStyles.textPrimary} font-mono text-xs tracking-[0.2em] font-bold py-3.5 px-8 rounded-full transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer backdrop-blur-xl shadow-xs`}
              >
                <Users className={`w-4 h-4 ${themeStyles.accentIconColor}`} />
                <span>ABOUT US</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Real-time Editorial Metrics Board */}
      <motion.section
        id="home-stats-section"
        ref={statsSectionRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-6 py-12 relative z-10"
      >
        <div className="glass-panel rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
          <div className="space-y-2 pb-6 md:pb-0">
            <div className="text-4xl lg:text-5xl font-display font-black text-zinc-950 dark:text-white">{stats.members.toLocaleString()}</div>
            <div className={`font-mono text-[10px] tracking-[0.25em] ${themeStyles.accentText} uppercase font-semibold`}>VERIFIED MEMBERS</div>
          </div>
          <div className="space-y-2 py-6 md:py-0 md:px-6">
            <div className="text-4xl lg:text-5xl font-display font-black text-zinc-950 dark:text-white">{stats.sanctuaries}+</div>
            <div className={`font-mono text-[10px] tracking-[0.25em] ${themeStyles.accentText} uppercase font-semibold`}>VOICE SANCTUARIES</div>
          </div>
          <div className="space-y-2 pt-6 md:pt-0">
            <div className="text-4xl lg:text-5xl font-display font-black text-zinc-950 dark:text-white">{stats.years} YEARS</div>
            <div className={`font-mono text-[10px] tracking-[0.25em] ${themeStyles.accentText} uppercase font-semibold`}>CONTINUOUS HERITAGE</div>
          </div>
        </div>
      </motion.section>

      {/* Modern Bento Grid: Core Pillars */}
      <section
        id="home-about-section"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-black/10 dark:border-white/10 relative z-10"
      >
        <div className="mb-14 text-center lg:text-left space-y-3">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} font-bold uppercase block`}>
            01 // ARCHITECTURAL PILLARS
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-zinc-950 dark:text-white">
            Community Spheres & Culture
          </h2>
          <TextScrollDissolveReveal
            text="Designed for those who appreciate high craftsmanship, collaborative gaming, and effortless digital lifestyle connection."
            className="max-w-xl text-sm md:text-base font-light"
            wordClassName="text-zinc-600 dark:text-zinc-400 font-sans"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Sector 1: Anime */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`glass-panel p-7 rounded-3xl transition-all duration-300 hover:${themeStyles.borderHighlight} group cursor-pointer`}
          >
            <div className={`w-12 h-12 rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} flex items-center justify-center mb-6 ${themeStyles.accentIconColor} group-hover:scale-110 transition-transform`}>
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-zinc-950 dark:text-white mb-2">Anime & Culture</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Debate episodes, discover hidden gems, and stream cinema with enthusiasts in high-definition salons.
            </p>
          </motion.div>

          {/* Sector 2: Gaming LFG */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`glass-panel p-7 rounded-3xl transition-all duration-300 hover:${themeStyles.borderHighlight} group cursor-pointer`}
          >
            <div className={`w-12 h-12 rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} flex items-center justify-center mb-6 ${themeStyles.accentIconColor} group-hover:scale-110 transition-transform`}>
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-zinc-950 dark:text-white mb-2">Gaming LFG</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Connect instantly with skilled squads for Valorant, Minecraft, CS, and competitive titles.
            </p>
          </motion.div>

          {/* Sector 3: Weekly Events */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`glass-panel p-7 rounded-3xl transition-all duration-300 hover:${themeStyles.borderHighlight} group cursor-pointer`}
          >
            <div className={`w-12 h-12 rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} flex items-center justify-center mb-6 ${themeStyles.accentIconColor} group-hover:scale-110 transition-transform`}>
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-zinc-950 dark:text-white mb-2">Weekly Events</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Curated movie streams, acoustic jamming, trivia nights, and exclusive member giveaways.
            </p>
          </motion.div>

          {/* Sector 4: Active VCs */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className={`glass-panel p-7 rounded-3xl transition-all duration-300 hover:${themeStyles.borderHighlight} group cursor-pointer`}
          >
            <div className={`w-12 h-12 rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} flex items-center justify-center mb-6 ${themeStyles.accentIconColor} group-hover:scale-110 transition-transform`}>
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-zinc-950 dark:text-white mb-2">Voice Sanctuaries</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              24/7 active voice rooms to chill, share screens, or unwind with global members.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Exclusive Services Grid */}
      <section
        id="home-apparel-section"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-black/10 dark:border-white/10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="space-y-3">
            <span className="font-mono text-xs tracking-[0.3em] text-rose-700 dark:text-rose-400 font-bold uppercase block">
              02 // EXCLUSIVE CHANNELS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-zinc-950 dark:text-white">
              Featured Services
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-zinc-400 uppercase mt-2 md:mt-0">
            VERIFIED COMMUNITY HIGHLIGHTS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {promotionalNodes.map((item, index) => (
            <motion.div
              id={`product-card-${item.id}`}
              key={item.id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="group glass-panel rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-rose-500/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 mb-4">
                <img
                  id={`product-img-${item.id}`}
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <button
                    id={`view-product-btn-${item.id}`}
                    onClick={() => setSelectedProduct(item as any)}
                    className="w-full py-2.5 px-4 bg-white/90 dark:bg-zinc-900/90 text-zinc-950 dark:text-white rounded-full text-[10px] font-mono tracking-widest font-bold transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer hover:bg-rose-500 hover:text-white"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>PREVIEW DETAILS</span>
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-rose-600 dark:text-rose-400 uppercase font-bold block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-display text-base font-bold text-zinc-950 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mt-2 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4 border-t border-black/5 dark:border-white/10 pt-3">
                  <span className="font-mono text-xs font-bold text-zinc-900 dark:text-white">
                    {item.price}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-400 uppercase">
                    [ONLINE]
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Membership Tiers */}
      <section
        id="home-tiers-section"
        className="max-w-7xl mx-auto px-6 py-20 border-t border-black/10 dark:border-white/10"
      >
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-mono text-xs tracking-[0.3em] text-rose-700 dark:text-rose-400 font-bold uppercase block">
            03 // DONATE & BOOST
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-zinc-950 dark:text-white">
            Membership Access Tiers
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-sans text-sm md:text-base leading-relaxed font-light">
            Support server infrastructure and unlock exclusive roles, custom color privileges, sticker/GIF perms, and priority status.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {defaultRanks.map((rank) => (
            <MembershipCard
              key={rank.id}
              rank={rank}
              activeAtmosphere={activeAtmosphere}
              isDarkMode={isDarkMode}
              onAddToCart={(item) => {
                if (onAddToCart) {
                  onAddToCart(item);
                } else {
                  setSelectedProduct({
                    id: item.id,
                    name: item.name,
                    price: `$${item.price.toFixed(2)}`,
                    description: rank.description,
                    category: 'MEMBERSHIP TIER',
                    image: item.image
                  } as any);
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* Editorial FAQ */}
      <section
        id="home-faq-section"
        className="max-w-4xl mx-auto px-6 py-20 border-t border-black/10 dark:border-white/10"
      >
        <div className="text-center mb-16 space-y-4">
          <span className="font-mono text-xs tracking-[0.3em] text-rose-700 dark:text-rose-400 font-bold uppercase block">
            04 // INFORMATION GATE
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-zinc-950 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="glass-panel rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-display font-bold text-zinc-950 dark:text-white text-sm md:text-base cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 text-rose-500' : ''}`} />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-black/5 dark:border-white/10 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Product Overlay Drawer */}
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
              className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button
                id="product-drawer-close"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-zinc-900">
                <img
                  id="product-drawer-img"
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] tracking-widest text-rose-600 dark:text-rose-400 font-bold uppercase">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-zinc-950 dark:text-white mt-1 uppercase">
                    {selectedProduct.name}
                  </h3>
                  <span className="font-mono text-lg text-zinc-900 dark:text-zinc-100 block mt-2 font-bold">
                    {selectedProduct.price}
                  </span>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs mt-6 leading-relaxed font-light">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-8">
                  {acquiredSuccess ? (
                    <div id="acquire-success-banner" className="w-full py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] tracking-widest text-center rounded-full animate-pulse">
                      TRANSMISSION INITIALIZED... ACCESS LOGGED
                    </div>
                  ) : (
                    <button
                      id="product-drawer-buy-btn"
                      onClick={handleAcquire}
                      className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs tracking-widest font-bold transition-all rounded-full flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ACQUIRE ACCESS</span>
                    </button>
                  )}
                  <span className="text-[9px] text-zinc-400 font-mono tracking-wide text-center block mt-3 uppercase">
                    SECURE ENCRYPTED ACCESS // INEFFABLE COUTURE
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
