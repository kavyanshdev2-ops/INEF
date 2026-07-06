/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { 
  Compass, 
  Flame, 
  Shield, 
  Users, 
  Radio, 
  CheckCircle2, 
  ShoppingCart, 
  Sparkles,
  Pickaxe,
  Swords,
  Crown,
  Box,
  Gem,
  Hammer,
  Package,
  Palette,
  Terminal,
  Zap,
  ChevronRight
} from 'lucide-react';

interface MembershipViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
  setCurrentPage: (page: 'cart' | 'shop' | 'home') => void;
}

export const MembershipView: React.FC<MembershipViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  onAddToCart,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'discord' | 'minecraft'>('minecraft');

  // Interactive tab state for each Minecraft card
  const [activeCardTabs, setActiveCardTabs] = useState<Record<string, 'utilities' | 'kits' | 'cosmetics'>>({
    'vanguard-rank': 'utilities',
    'elite-rank': 'utilities',
    'overlord-rank': 'utilities',
    'inefontop-rank': 'utilities'
  });

  const setCardTab = (cardId: string, tab: 'utilities' | 'kits' | 'cosmetics') => {
    setActiveCardTabs(prev => ({ ...prev, [cardId]: tab }));
  };

  // Discord Tiers (Monthly subscription)
  const discordTiers = [
    {
      id: 'plat-access',
      name: 'Platinum Access',
      price: 3.00,
      period: 'month',
      description: 'Built for active members who want to stand out and enjoy extra privileges. Simple, practical perks that keep the vibes flowing.',
      icon: Compass,
      perks: [
        'External Emoji, Sticker & GIF permissions in all chat rooms',
        'Use custom Soundboard permissions natively',
        'Custom Nickname control system',
        'External Reaction access in all general channels',
        'Elegant "Platinum" role badge in Discord'
      ],
      color: 'from-blue-500/10 via-blue-600/5 to-transparent',
      border: 'hover:border-blue-400/50',
      tag: 'COMMUNITY',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'diam-access',
      name: 'Diamond Access',
      price: 9.00,
      period: 'month',
      description: 'Our most popular, balanced premium tier. Stand out on voice and text with custom styling, high priority and unique access.',
      icon: Flame,
      perks: [
        'All benefits included in Platinum Access',
        'VC + Soundboard external soundboards enabled',
        'Custom self-assignable Color Role with custom HEX color code',
        'Higher priority support tickets with admins',
        'Double entry weight in all automated server giveaways',
        'Unique "Diamond" role badge & standout name color'
      ],
      color: 'from-rose-500/10 via-rose-600/5 to-transparent',
      border: 'hover:border-rose-400/50',
      tag: 'POPULAR',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'
    },
    {
      id: 'titan-access',
      name: 'Titanium Access',
      price: 15.00,
      period: 'month',
      description: 'The elite tier for dedicated supporters. Gain total aesthetic control, exclusive administration visibility, and VIP server access.',
      icon: Shield,
      perks: [
        'All benefits included in Diamond Access',
        'Access to server Premium Audit log insights',
        'Gift 2 free Platinum monthly codes to friends every month',
        'Global spam whitelist and chat filter immunity',
        'Direct feedback channel access to administration board',
        'Elite "Titanium Legend" custom role and priority VC rooms'
      ],
      color: 'from-zinc-500/10 via-zinc-600/5 to-transparent',
      border: 'hover:border-zinc-400/50',
      tag: 'ELITE',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'
    }
  ];

  // Minecraft Donor Tiers (Lifetime Purchases, fully split and custom styled)
  const minecraftTiers = [
    {
      id: 'vanguard-rank',
      name: 'Vanguard Rank',
      price: 9.99,
      period: 'lifetime',
      description: 'The solid foundation for survival builders. Unlock essential kits, land-claim utilities, and gray-iron chat cosmetics.',
      icon: Pickaxe,
      tag: 'STONE & IRON',
      badgeBg: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
      color: 'from-slate-500/15 via-zinc-500/5 to-transparent',
      border: 'hover:border-zinc-400/60',
      glow: 'shadow-zinc-500/5',
      accentColor: 'text-zinc-400',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      parts: {
        utilities: [
          'Set up to 3 teleport home locations via /sethome',
          'Access to /back command to return to previous death point',
          'Access to /workbench command (portable virtual crafting table)',
          'Priority queue slot during peak SMP server traffic hours'
        ],
        kits: [
          'Full set of Protection II / Unbreaking II Iron Armor',
          'Iron Tools: Efficiency III Pickaxe, Axe, and Shovel',
          'Food Supply: 64x Cooked Beef & 16x Golden Apples',
          'Resource starter kit: 64x Stone Bricks & 32x Oak Logs'
        ],
        cosmetics: [
          'Permanent custom "[Vanguard]" chat prefix (Sleek Gray)',
          'Access to /hat cosmetic command (wear any block as a hat)',
          'Custom gray and white chat message coloring options',
          'Unique join chime sound effect in the server hub area'
        ]
      }
    },
    {
      id: 'elite-rank',
      name: 'Elite Rank',
      price: 24.99,
      period: 'lifetime',
      description: 'Command the skies and stand out in the wilderness. Includes claim flight, virtual portable utilities, and premium item kits.',
      icon: Swords,
      tag: 'GOLD & LAPIS',
      badgeBg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      color: 'from-sky-500/15 via-blue-500/5 to-transparent',
      border: 'hover:border-sky-400/60',
      glow: 'shadow-sky-500/5',
      accentColor: 'text-sky-400',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop',
      parts: {
        utilities: [
          'Set up to 8 teleport home locations via /sethome',
          'Global flight mechanics: toggle /fly inside all safe build claims',
          'Virtual portable utilities: /craft and /anvil anywhere instantly',
          'Access to /feed command (saturate hunger, 5-minute cooldown)',
          'EXP Safe: Suffer 50% less experience level loss upon death'
        ],
        kits: [
          'Full set of Protection III / Unbreaking II Diamond Armor',
          'Diamond Tools: Efficiency IV, Fortune II Pickaxe & Sword',
          'Food Supply: 64x Golden Carrots & 32x Glistering Melons',
          'Elite kit bonus: 8x Lapis Lazuli Blocks & 16x Glowstone'
        ],
        cosmetics: [
          'Radiant custom "[Elite]" gold & cyan chat prefix',
          'Access to /trails particle menu (Flame, Hearts, Notes effects)',
          'Custom chat message formatting: Gold & Aqua text options',
          'Custom join notification broadcasted to all online survival players'
        ]
      }
    },
    {
      id: 'overlord-rank',
      name: 'Overlord Rank',
      price: 39.99,
      period: 'lifetime',
      description: 'The supreme conqueror of the nether and overworld. Gain virtual storage vault control, bypass cooldowns, and command absolute power.',
      icon: Hammer,
      tag: 'DIAMOND & OBSIDIAN',
      badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      color: 'from-purple-500/15 via-fuchsia-500/5 to-transparent',
      border: 'hover:border-purple-400/60',
      glow: 'shadow-purple-500/5',
      accentColor: 'text-purple-400',
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop',
      parts: {
        utilities: [
          'Set up to 15 teleport home locations via /sethome',
          'Full wilderness flight: toggle /fly anywhere except PVP zones',
          'Portable storage: open virtual enderchests anywhere via /enderchest',
          'Access to /heal command (restore health, 10-minute cooldown)',
          'Zero teleport cooldowns: instantly warp to friends via /tpa'
        ],
        kits: [
          'Full set of Protection III / Unbreaking III Netherite Armor',
          'Netherite Tools: Efficiency V, Fortune III, Unbreaking III tools',
          'Elite traversal gear: 1x Elytra & 64x Firework Rockets (Duration 3)',
          'Resource bonus: 32x Obsidian Blocks & 4x Netherite Scrap'
        ],
        cosmetics: [
          'Menacing custom "[Overlord]" violet & crimson chat prefix',
          'Full companion pets menu access: spawn wolves, slimes, or cats',
          'Aura trail pack: toggle Smoke, Lava drip, and Bubble particle trails',
          'Custom join message with deep purple layout style and alert sounds'
        ]
      }
    },
    {
      id: 'inefontop-rank',
      name: 'Inefontop Rank',
      price: 59.99,
      period: 'lifetime',
      description: 'The legendary ultimate rank of the SMP network. Keep-inventory protection, unlimited homes, triple vaults, rideable mounts, and permanent fame.',
      icon: Crown,
      tag: 'EMERALD & COSMIC',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      color: 'from-emerald-500/15 via-teal-500/5 to-transparent',
      border: 'hover:border-emerald-400/60',
      glow: 'shadow-emerald-500/5',
      accentColor: 'text-emerald-400',
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=400&auto=format&fit=crop',
      parts: {
        utilities: [
          'Set unlimited sethomes & access instant cross-dimension warp channels',
          'Unrestricted flight access: /fly toggles everywhere across all dimensions',
          'Keep-Inventory Protection: Keep 100% of armor, items, and XP on death',
          'Triple private storage vaults: expand inventory via /vault 1, 2, 3',
          'Instant /heal & /feed commands with absolutely no cooldown duration'
        ],
        kits: [
          'Fully Enchanted Netherite Overgod Armor (Protection IV, Mending, Thorns)',
          'Fully Enchanted God Tools (Efficiency V, Fortune III, Mending, Silk Touch)',
          'Cosmic travel: 2x Elytras & 128x Firework Rockets (Duration 3)',
          'Ultimate supply: 32x Enchanted Golden Apples & 64x Emerald Blocks'
        ],
        cosmetics: [
          'Legendary custom "[Inefontop]" chromatic gradient cycling chat prefix',
          'Exclusive rideable mounts: summon and ride Dragons, Griffins, or Wyverns',
          'Access to all trails: block trails, music notes, lightning sparkles',
          'Permanent custom monument engraving on the Spawn Lobby Hall of Fame'
        ]
      }
    }
  ];

  const handleAddToCart = (tier: typeof discordTiers[0] | typeof minecraftTiers[0]) => {
    onAddToCart({
      id: tier.id,
      name: tier.name,
      price: tier.price,
      image: tier.image,
      type: 'membership'
    });
    setAddedItemName(tier.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  const pageTitle = activeTab === 'discord' ? 'COMMUNITY MEMBERSHIPS' : 'MINECRAFT SERVER RANKS';
  const pageTagline = activeTab === 'discord' ? 'UPGRADES // MEMBERSHIP PLANS' : 'SERVER STORE // LIFETIME DONATIONS';
  const pageSub = activeTab === 'discord'
    ? 'Support Inefontop hosting nodes and fund active development. Gain immediate, automated premium roles, custom cosmetic permissions, and exclusive Discord perks linked to your account.'
    : 'Enhance your survival gameplay on the Inefontop SMP server with premium donor ranks. Experience fully customizable glassy cards featuring tabbed sub-sections for commands, kits, and cosmetics.';

  return (
    <div id="membership-view-container" className={`max-w-7xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          {pageTagline}
        </span>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-extrabold uppercase transition-all duration-300">
          {pageTitle}
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm md:text-base font-light leading-relaxed h-16 transition-all duration-300`}>
          {pageSub}
        </p>
      </div>

      {/* Added Toast Alert */}
      {addedItemName && (
        <div id="added-cart-toast" className={`fixed bottom-6 right-6 z-50 border font-mono text-[10px] tracking-widest px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in ${
          isDarkMode 
            ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>ADDED {addedItemName.toUpperCase()} TO CART</span>
        </div>
      )}

      {/* Segmented Controls (Tab Switcher) */}
      <div id="membership-tab-switcher" className="flex justify-center mb-16">
        <div className={`inline-flex p-1.5 rounded-2xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} backdrop-blur-xl gap-2 shadow-inner`}>
          <button
            id="tab-discord-btn"
            onClick={() => setActiveTab('discord')}
            className={`px-6 py-3 rounded-xl font-mono text-[10px] tracking-wider transition-all cursor-pointer flex items-center space-x-2.5 ${
              activeTab === 'discord'
                ? `${themeStyles.accentBg} ${isDarkMode ? 'text-zinc-950 font-bold' : 'text-white font-bold'} shadow-lg scale-102`
                : `${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`
            }`}
          >
            <Radio className="w-4 h-4 shrink-0" />
            <span>DISCORD MEMBERSHIPS</span>
          </button>
          
          <button
            id="tab-minecraft-btn"
            onClick={() => setActiveTab('minecraft')}
            className={`px-6 py-3 rounded-xl font-mono text-[10px] tracking-wider transition-all cursor-pointer flex items-center space-x-2.5 ${
              activeTab === 'minecraft'
                ? `${themeStyles.accentBg} ${isDarkMode ? 'text-zinc-950 font-bold' : 'text-white font-bold'} shadow-lg scale-102`
                : `${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'}`
            }`}
          >
            <Pickaxe className="w-4 h-4 shrink-0" />
            <span>MINECRAFT SERVER RANKS</span>
          </button>
        </div>
      </div>

      {/* Tiers Grid */}
      <div id="membership-tiers-grid" className={`grid grid-cols-1 ${activeTab === 'minecraft' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6 items-stretch mb-20`}>
        {activeTab === 'discord' ? (
          discordTiers.map((tier) => {
            const TierIcon = tier.icon;
            return (
              <div
                id={`membership-tier-card-${tier.id}`}
                key={tier.id}
                className={`relative group ${themeStyles.bgCard} border ${themeStyles.borderMuted} ${tier.border} rounded-2xl p-8 flex flex-col justify-between overflow-hidden backdrop-blur-md transition-all duration-300 hover:shadow-2xl`}
              >
                {/* Top gradient glow overlay */}
                <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${tier.color} opacity-85 pointer-events-none`} />

                <div className="relative z-10 space-y-6">
                  {/* Badge Tag */}
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-[9px] tracking-[0.2em] ${themeStyles.textMuted} uppercase`}>
                      {tier.tag}
                    </span>
                    {(tier.tag === 'POPULAR' || tier.tag === 'ELITE') && (
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[8px] tracking-wider font-semibold border bg-rose-500/10 text-rose-400 border-rose-500/20">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  {/* Tier Name & Price */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center bg-zinc-900/40 border-zinc-800/50 ${themeStyles.accentText}`}>
                        <TierIcon className="w-5 h-5" />
                      </div>
                      <h3 className={`font-sans text-xl font-bold uppercase tracking-wider ${
                        isDarkMode ? 'text-white' : 'text-zinc-900'
                      }`}>
                        {tier.name}
                      </h3>
                    </div>
                    <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed h-12 overflow-hidden mt-2`}>
                      {tier.description}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className={`py-4 border-b flex items-baseline space-x-1 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-100'}`}>
                    <span className={`text-3xl md:text-4xl font-extrabold tracking-tight font-mono ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      ${tier.price.toFixed(2)}
                    </span>
                    <span className={`${themeStyles.textMuted} font-mono text-[10px] uppercase tracking-wider`}>
                      / {tier.period}
                    </span>
                  </div>

                  {/* Perks Checklist */}
                  <div className="space-y-3.5 pt-2 h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                    {tier.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${themeStyles.accentText}`} />
                        <span className={`${themeStyles.textSecondary} text-xs font-light leading-snug`}>
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  id={`add-cart-membership-${tier.id}`}
                  onClick={() => handleAddToCart(tier)}
                  className="relative z-10 w-full py-4 mt-8 font-mono text-xs tracking-widest font-bold rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4 text-zinc-950" />
                  <span>ADD TO CART</span>
                </button>
              </div>
            );
          })
        ) : (
          minecraftTiers.map((tier) => {
            const TierIcon = tier.icon;
            const currentSubTab = activeCardTabs[tier.id] || 'utilities';

            // Custom Glassmorphic styling based on theme and rank hover properties
            const cardShadowStyle = isDarkMode 
              ? 'shadow-[4px_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.12)]' 
              : 'shadow-[4px_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_0_25px_rgba(16,185,129,0.08)]';
            
            const cardBgStyle = isDarkMode 
              ? 'bg-zinc-950/45 border-zinc-800/80' 
              : 'bg-white/45 border-zinc-200/80';

            const activePerkList = tier.parts[currentSubTab];

            // Define custom badge and icon colors based on rank tier
            let glowAccent = 'text-emerald-400 border-emerald-500/20';
            if (tier.id === 'vanguard-rank') glowAccent = 'text-zinc-400 border-zinc-500/20';
            else if (tier.id === 'elite-rank') glowAccent = 'text-sky-400 border-sky-500/20';
            else if (tier.id === 'overlord-rank') glowAccent = 'text-purple-400 border-purple-500/20';

            return (
              <div
                id={`membership-tier-card-${tier.id}`}
                key={tier.id}
                className={`relative group ${cardBgStyle} border ${cardShadowStyle} rounded-2xl p-6 flex flex-col justify-between overflow-hidden backdrop-blur-md transition-all duration-300 ${tier.border} hover:-translate-y-1`}
              >
                {/* Top gradient glow overlay */}
                <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${tier.color} opacity-80 pointer-events-none`} />

                {/* Retro dashed inner line styling for Minecraft feeling */}
                <div className={`absolute inset-1 pointer-events-none rounded-[14px] border border-dashed ${
                  isDarkMode ? 'border-white/5' : 'border-zinc-900/5'
                }`} />

                {/* Small ornamental pixel decoration */}
                <div className="absolute top-2 right-2 flex space-x-0.5 opacity-40 pointer-events-none">
                  <div className={`w-1.5 h-1.5 rounded-sm bg-current ${tier.accentColor}`} />
                  <div className={`w-1.5 h-1.5 rounded-sm bg-current ${tier.accentColor} opacity-70`} />
                  <div className={`w-1.5 h-1.5 rounded-sm bg-current ${tier.accentColor} opacity-40`} />
                </div>

                <div className="relative z-10 space-y-4">
                  {/* Badge Tag */}
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-[8px] tracking-[0.2em] uppercase ${
                      isDarkMode ? 'text-zinc-400' : 'text-zinc-500 font-medium'
                    }`}>
                      {tier.tag}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-mono text-[7px] tracking-wider font-semibold border ${
                      tier.id === 'inefontop-rank'
                        ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] animate-pulse'
                        : `bg-zinc-500/5 ${glowAccent}`
                    }`}>
                      PERMANENT
                    </span>
                  </div>

                  {/* Tier Title */}
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2 rounded-xl border flex items-center justify-center ${
                        isDarkMode 
                          ? 'bg-zinc-900/90 border-zinc-800 text-zinc-200' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800'
                      } ${tier.accentColor}`}>
                        <TierIcon className="w-4.5 h-4.5" />
                      </div>
                      <h3 className={`font-sans text-lg font-extrabold uppercase tracking-wide ${
                        isDarkMode ? 'text-white' : 'text-zinc-900'
                      }`}>
                        {tier.name}
                      </h3>
                    </div>
                    <p className={`${themeStyles.textSecondary} text-[11px] font-light leading-relaxed h-14 overflow-hidden`}>
                      {tier.description}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className={`py-2.5 border-b flex items-baseline space-x-1 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-100'}`}>
                    <span className={`text-2xl font-black font-mono tracking-tight ${
                      isDarkMode ? 'text-white' : 'text-zinc-900'
                    }`}>
                      ${tier.price.toFixed(2)}
                    </span>
                    <span className={`${themeStyles.textMuted} font-mono text-[9px] uppercase tracking-wider`}>
                      / {tier.period}
                    </span>
                  </div>

                  {/* SEPARATE THE PART: Nested tabs inside card */}
                  <div className="space-y-3">
                    <div className={`grid grid-cols-3 p-1 rounded-xl border font-mono text-[8px] font-bold tracking-wider gap-0.5 ${
                      isDarkMode ? 'bg-zinc-950/75 border-zinc-900' : 'bg-zinc-100/90 border-zinc-200'
                    }`}>
                      <button
                        onClick={() => setCardTab(tier.id, 'utilities')}
                        className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          currentSubTab === 'utilities'
                            ? (isDarkMode ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' : 'bg-white text-emerald-600 shadow-sm border border-zinc-200')
                            : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')
                        }`}
                      >
                        <Terminal className="w-3 h-3 shrink-0" />
                        <span>CMDS</span>
                      </button>
                      
                      <button
                        onClick={() => setCardTab(tier.id, 'kits')}
                        className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          currentSubTab === 'kits'
                            ? (isDarkMode ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' : 'bg-white text-emerald-600 shadow-sm border border-zinc-200')
                            : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')
                        }`}
                      >
                        <Package className="w-3 h-3 shrink-0" />
                        <span>KITS</span>
                      </button>

                      <button
                        onClick={() => setCardTab(tier.id, 'cosmetics')}
                        className={`py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          currentSubTab === 'cosmetics'
                            ? (isDarkMode ? 'bg-zinc-900 text-emerald-400 border border-zinc-800' : 'bg-white text-emerald-600 shadow-sm border border-zinc-200')
                            : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900')
                        }`}
                      >
                        <Palette className="w-3 h-3 shrink-0" />
                        <span>STYLE</span>
                      </button>
                    </div>

                    {/* Active Perk list display with custom scrollbar */}
                    <div className={`space-y-3 pt-1 h-[180px] overflow-y-auto pr-1 scrollbar-thin`}>
                      {activePerkList.map((perk, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            tier.id === 'vanguard-rank' ? 'text-zinc-400' :
                            tier.id === 'elite-rank' ? 'text-sky-400' :
                            tier.id === 'overlord-rank' ? 'text-purple-400' : 'text-emerald-400'
                          }`} />
                          <span className={`${themeStyles.textSecondary} text-[11px] font-light leading-snug`}>
                            {perk}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  id={`add-cart-membership-${tier.id}`}
                  onClick={() => handleAddToCart(tier)}
                  className={`relative z-10 w-full py-3.5 mt-6 font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                    isDarkMode 
                      ? 'bg-zinc-900 hover:bg-white text-zinc-400 hover:text-zinc-950 border border-zinc-800 hover:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)] hover:shadow-none' 
                      : 'bg-white hover:bg-zinc-900 border border-zinc-300 hover:border-zinc-900 text-zinc-600 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.06)] hover:shadow-none'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>ADD TO STORE CART</span>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Perks Highlight Banner */}
      <div id="membership-perks-highlight" className={`rounded-3xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} p-8 md:p-12 relative overflow-hidden shadow-2xl`}>
        <div className={`absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l ${themeStyles.glowPrimary} blur-[80px] opacity-10 pointer-events-none`} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className={`w-5 h-5 ${themeStyles.accentText}`} />
              <span className={`font-mono text-xs tracking-[0.2em] uppercase ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>SYSTEM-LINKED SYNC</span>
            </div>
            <h4 className={`text-2xl md:text-3xl font-sans tracking-tight font-extrabold uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Immediate Automated Account Provisioning
            </h4>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              Once checked out, our automatic transaction gateways synchronize your purchases with your unique profiles. Discord roles are linked via our bot hub, and Minecraft ranks are synced directly to your Mojang uuid on the survival servers instantly.
            </p>
            <div className="flex items-center space-x-6 pt-4">
              <div className="space-y-1">
                <span className={`font-mono text-lg font-bold block ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>100%</span>
                <span className={`${themeStyles.textMuted} font-mono text-[9px] uppercase tracking-wider`}>BOT AUTOMATED</span>
              </div>
              <div className="space-y-1">
                <span className={`font-mono text-lg font-bold block ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>&lt; 3 Sec</span>
                <span className={`${themeStyles.textMuted} font-mono text-[9px] uppercase tracking-wider`}>SYNC LATENCY</span>
              </div>
              <div className="space-y-1">
                <span className={`font-mono text-lg font-bold block ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>24/7/365</span>
                <span className={`${themeStyles.textMuted} font-mono text-[9px] uppercase tracking-wider`}>GATEWAY ONLINE</span>
              </div>
            </div>
          </div>

          <div className={`border rounded-2xl p-6 space-y-4 ${
            isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
          }`}>
            <h5 className={`font-mono text-xs font-bold uppercase border-b pb-3 ${
              isDarkMode ? 'text-zinc-300 border-zinc-900' : 'text-zinc-800 border-zinc-200'
            }`}>
              Minecraft Connection Info
            </h5>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              Connect to the Survival server using our custom play node address below. Ranks apply globally to all server areas and lobby nodes immediately.
            </p>
            <div className={`p-3 rounded-lg font-mono text-xs flex justify-between items-center ${
              isDarkMode ? 'bg-zinc-950 text-emerald-400 border border-zinc-900' : 'bg-white text-emerald-600 border border-zinc-200'
            }`}>
              <span>SERVER IP:</span>
              <span className="font-bold tracking-widest">PLAY.INEF.CC</span>
            </div>
            <button
              id="cta-membership-contact"
              onClick={() => setCurrentPage('shop')}
              className={`w-full py-3.5 ${themeStyles.accentBg} ${themeStyles.accentBgHover} text-zinc-950 font-mono text-[10px] tracking-widest font-bold rounded-lg transition-colors cursor-pointer border ${themeStyles.borderHighlight}`}
            >
              EXPLORE PROMOTIONS IN SHOP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
