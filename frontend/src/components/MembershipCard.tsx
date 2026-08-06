/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, CheckCircle2, Gem, Shield, Sparkles, Terminal, Package, Palette } from 'lucide-react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { LiquidButton } from './LiquidButton';

export interface RankData {
  id: string;
  tag: string;
  name: string;
  price: number;
  period: string;
  badge: string;
  description: string;
  icon: 'diamond' | 'titanium' | 'mystical';
  perks: {
    cmds: string[];
    kits: string[];
    style: string[];
  };
}

interface MembershipCardProps {
  rank: RankData;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number; size?: string }) => void;
}

export const defaultRanks: RankData[] = [
  {
    id: 'rank-diamond',
    tag: 'DIAMOND',
    name: 'DIAMOND RANK',
    price: 10.00,
    period: 'LIFETIME',
    badge: 'PERMANENT',
    description: 'Step up your game with Diamond perks: Backpack capacity, multiple sethomes, daily currency allowances, and boat keys.',
    icon: 'diamond',
    perks: {
      cmds: [
        '/sit and /crawl utility commands',
        'Set up to 10 Unique Homes via /sethome',
        'Virtual portable enderchest via /ec anywhere',
        'Gain 2500 Land Claim Blocks to protect builds'
      ],
      kits: [
        'Diamond Armor Set (Protection IV, Unbreaking III)',
        'Weekly Diamond Tool Supply Kit',
        'Daily Food & Currency Allowance Bundle'
      ],
      style: [
        'Custom Cyan Nameplate Prefix',
        'Exclusive Diamond Chat Badge & Glow',
        'Access to 12 Custom Particle Effects'
      ]
    }
  },
  {
    id: 'rank-titanium',
    tag: 'TITANIUM',
    name: 'TITANIUM RANK',
    price: 15.00,
    period: 'LIFETIME',
    badge: 'PERMANENT',
    description: 'Gain the power of Titanium: all Diamond benefits, larger virtual backpack, more homes, item repairs, and virtual smoker/grindstone.',
    icon: 'titanium',
    perks: {
      cmds: [
        'Includes all utility perks of Diamond Rank',
        'Set up to 15 Unique Homes via /sethome',
        '/fix command (Repair Your Item - 12hr Cooldown)',
        'Virtual portable /smoker command access anywhere',
        'Virtual portable /grindstone command access anywhere'
      ],
      kits: [
        'Titanium Netherite Armor Kit (Protection IV)',
        'Bi-weekly Enchanted Tool & Equipment Crate',
        '3x XP Booster Tokens every week'
      ],
      style: [
        'Custom Metallic Titanium Nameplate & Rank Tag',
        'Unlock Voice Channel Soundboard Permissions',
        'Access to 25 Custom Trails & Particle Effects'
      ]
    }
  },
  {
    id: 'rank-mystical',
    tag: 'MYSTICAL',
    name: 'MYSTICAL RANK',
    price: 25.00,
    period: 'LIFETIME',
    badge: 'PERMANENT',
    description: 'Ascend to the Mystical Tier: all Diamond & Titanium benefits, 4-row backpack, item renaming, virtual anvil, and feed command.',
    icon: 'mystical',
    perks: {
      cmds: [
        'Includes all utility perks of Diamond & Titanium',
        'Set up to 25 Unique Homes via /sethome',
        '/rename command (Rename any item in hand)',
        'Virtual /Anvil command access anywhere',
        'Virtual /brewingstand command access anywhere',
        '/feed and /heal utility access (30m cooldown)'
      ],
      kits: [
        'God-Tier Mystical Netherite Gear Kit',
        'Unlimited Claim Blocks + Monthly VIP Crate Keys',
        '5x XP Booster Tokens & Max Shulker Box Kits'
      ],
      style: [
        'Custom Animated Rainbow Nameplate & VIP Role',
        'External Sticker, Emoji & Soundboard Permissions',
        'Full Particle Aura System & Wings Effect'
      ]
    }
  }
];

export const MembershipCard: React.FC<MembershipCardProps> = ({
  rank,
  activeAtmosphere,
  isDarkMode,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<'cmds' | 'kits' | 'style'>('cmds');
  const [added, setAdded] = useState(false);
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const renderIcon = () => {
    switch (rank.icon) {
      case 'diamond':
        return <Gem className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />;
      case 'titanium':
        return <Shield className="w-6 h-6 text-sky-500 dark:text-sky-400" />;
      case 'mystical':
      default:
        return <Sparkles className="w-6 h-6 text-rose-500 dark:text-rose-400" />;
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: rank.id,
      name: rank.name,
      price: rank.price,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      size: 'Lifetime Rank'
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const currentPerks = rank.perks[activeTab] || [];

  // Determine rank-specific top glow gradient and hover glow shadow
  const getRankGlow = () => {
    switch (rank.icon) {
      case 'diamond':
        return {
          topGradient: isDarkMode
            ? 'from-cyan-500/25 via-teal-500/10 to-transparent'
            : 'from-cyan-400/35 via-teal-300/20 to-transparent',
          hoverGlow: 'hover:shadow-[0_0_45px_rgba(34,211,238,0.25)] hover:border-cyan-400/60'
        };
      case 'titanium':
        return {
          topGradient: isDarkMode
            ? 'from-sky-500/25 via-blue-500/10 to-transparent'
            : 'from-sky-400/35 via-blue-300/20 to-transparent',
          hoverGlow: 'hover:shadow-[0_0_45px_rgba(56,189,248,0.25)] hover:border-sky-400/60'
        };
      case 'mystical':
      default:
        return {
          topGradient: isDarkMode
            ? 'from-rose-500/25 via-pink-500/10 to-transparent'
            : 'from-rose-300/40 via-pink-200/25 to-transparent',
          hoverGlow: 'hover:shadow-[0_0_45px_rgba(244,63,94,0.25)] hover:border-rose-400/60'
        };
    }
  };

  const rankGlow = getRankGlow();

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border overflow-hidden ${
        isDarkMode
          ? 'bg-zinc-900/50 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'bg-white/70 border-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.05)]'
      } ${rankGlow.hoverGlow} backdrop-blur-2xl group`}
    >
      {/* Top soft gradient bloom glow overlay */}
      <div className={`absolute top-0 left-0 right-0 h-44 bg-gradient-to-b ${rankGlow.topGradient} pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-80`} />

      {/* Dashed retro inner border frame for card effect */}
      <div className={`absolute inset-1.5 pointer-events-none rounded-[22px] border border-dashed transition-colors duration-300 ${
        isDarkMode ? 'border-white/10 group-hover:border-white/20' : 'border-zinc-900/10 group-hover:border-zinc-900/20'
      }`} />

      {/* Window Dots Top Right */}
      <div className="absolute top-5 right-5 flex items-center space-x-1.5 opacity-60 z-10">
        <span className="w-2 h-2 rounded-full bg-cyan-400/80 dark:bg-cyan-400" />
        <span className="w-2 h-2 rounded-full bg-teal-400/80 dark:bg-teal-400" />
        <span className="w-2 h-2 rounded-full bg-emerald-400/80 dark:bg-emerald-400" />
      </div>

      <div className="relative z-10">
        {/* Top Tag & Badge */}
        <div className="flex items-center justify-between mb-5 pr-10">
          <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-500 dark:text-zinc-400 uppercase font-bold">
            {rank.tag}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] tracking-wider uppercase font-extrabold border ${
            rank.icon === 'mystical'
              ? 'text-rose-600 dark:text-rose-400 border-rose-400/50 bg-rose-500/10'
              : 'text-cyan-600 dark:text-cyan-400 border-cyan-400/50 bg-cyan-500/10'
          }`}>
            {rank.badge}
          </span>
        </div>

        {/* Title + Icon */}
        <div className="flex items-center space-x-3.5 mb-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
            isDarkMode 
              ? 'bg-zinc-800/90 border-zinc-700/80 shadow-inner' 
              : 'bg-white border-zinc-200/90 shadow-xs'
          }`}>
            {renderIcon()}
          </div>
          <h3 className={`text-xl sm:text-2xl font-display font-black tracking-tight ${themeStyles.textPrimary} uppercase`}>
            {rank.name}
          </h3>
        </div>

        {/* Short Description */}
        <p className={`text-xs ${themeStyles.textSecondary} leading-relaxed font-light mb-6 min-h-[2.5rem]`}>
          {rank.description}
        </p>

        {/* Price display */}
        <div className="flex items-baseline space-x-2 mb-6">
          <span className={`font-mono text-3xl sm:text-4xl font-black ${themeStyles.textPrimary}`}>
            ${rank.price.toFixed(2)}
          </span>
          <span className="font-mono text-[10px] tracking-widest text-zinc-400 dark:text-zinc-500 uppercase font-semibold">
            / {rank.period}
          </span>
        </div>

        {/* Tabs Filter Bar */}
        <div className={`flex items-center p-1 rounded-2xl border mb-5 ${
          isDarkMode ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-100/90 border-zinc-200/80'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('cmds')}
            className={`flex-1 py-1.5 px-2 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeTab === 'cmds'
                ? isDarkMode
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                  : 'bg-white text-emerald-600 border border-zinc-200 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3 shrink-0" />
            <span>&gt;_ CMDS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kits')}
            className={`flex-1 py-1.5 px-2 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeTab === 'kits'
                ? isDarkMode
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                  : 'bg-white text-emerald-600 border border-zinc-200 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-3 h-3 shrink-0" />
            <span>KITS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('style')}
            className={`flex-1 py-1.5 px-2 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer flex items-center justify-center space-x-1 ${
              activeTab === 'style'
                ? isDarkMode
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-xs'
                  : 'bg-white text-emerald-600 border border-zinc-200 shadow-xs'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3 h-3 shrink-0" />
            <span>STYLE</span>
          </button>
        </div>

        {/* Scrollable Perks Checklist */}
        <div className="min-h-[140px] max-h-[180px] overflow-y-auto pr-1 mb-6 space-y-3 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="space-y-2.5"
            >
              {currentPerks.map((perk, i) => (
                <div key={i} className="flex items-start space-x-2.5 text-xs">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                    rank.icon === 'mystical'
                      ? 'text-rose-500 dark:text-rose-400'
                      : 'text-cyan-500 dark:text-cyan-400'
                  }`} />
                  <span className={`${themeStyles.textSecondary} leading-snug font-normal`}>
                    {perk}
                  </span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Button */}
      <LiquidButton
        id={`add-rank-cart-${rank.id}`}
        onClick={handleAddToCart}
        variant={added ? 'emerald' : 'primary'}
        isDarkMode={isDarkMode}
        className="w-full py-3.5 px-4 rounded-2xl text-xs font-black shadow-md"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>{added ? 'ADDED TO CART!' : 'ADD TO STORE CART'}</span>
      </LiquidButton>
    </motion.div>
  );
};
