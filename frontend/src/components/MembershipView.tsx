/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import {
  Flame,
  Shield,
  CheckCircle2,
  ShoppingCart,
  Sparkles,
  Gem,
  MessageSquare
} from 'lucide-react';

const CHERRY_PINK = '#FA5F88';

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

  // Discord Community Tiers (Monthly subscription)
  const discordTiers = [
    {
      id: 'plat-access',
      name: 'Platinum Access',
      price: 3.00,
      period: 'month',
      description: 'The essential starter tier. Unlock external stickers, soundboard permissions, and a signature Platinum badge.',
      icon: Gem,
      tag: 'PLATINUM',
      badgeBg: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
      color: 'from-teal-500/15 via-emerald-500/5 to-transparent',
      border: 'hover:border-teal-400/60',
      glow: 'shadow-teal-500/5',
      accentColor: 'text-teal-400',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      perks: [
        'External Emoji, Sticker & GIF permissions in all chat rooms',
        'Use custom Soundboard permissions natively',
        'Custom Nickname control system',
        'External Reaction access in all general channels',
        'Elegant "Platinum" role badge in Discord'
      ],
    },
    {
      id: 'diam-access',
      name: 'Diamond Access',
      price: 9.00,
      period: 'month',
      description: 'Our most popular premium tier. Stand out on voice and text with custom HEX color styling, high priority and unique access.',
      icon: Flame,
      perks: [
        'All benefits included in Platinum Access',
        'VC + Soundboard external soundboards enabled',
        'Custom self-assignable Color Role with custom HEX color code',
        'Higher priority support tickets with admins',
        'Double entry weight in all automated server giveaways',
        'Unique "Diamond" role badge & standout name color'
      ],
      color: 'from-[#FA5F88]/15 via-rose-600/5 to-transparent',
      border: 'hover:border-[#FA5F88]/60',
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

  const handleAddToCart = (tier: typeof discordTiers[0]) => {
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

  return (
    <div id="membership-view-container" className={`max-w-7xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span 
          style={{ color: CHERRY_PINK }}
          className="font-mono text-xs tracking-[0.3em] uppercase block font-semibold"
        >
          UPGRADES // MEMBERSHIP PLANS
        </span>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-extrabold uppercase transition-all duration-300">
          COMMUNITY MEMBERSHIPS
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto transition-all duration-300`}>
          Support Ineffable hosting and fund active development. Gain immediate, automated premium roles, custom cosmetic permissions, and exclusive Discord perks linked directly to your account.
        </p>
      </div>

      {/* Added Toast Alert */}
      {addedItemName && (
        <div id="added-cart-toast" className={`fixed bottom-6 right-6 z-50 border font-mono text-[10px] tracking-widest px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in ${isDarkMode
          ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300'
          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>ADDED {addedItemName.toUpperCase()} TO CART</span>
        </div>
      )}

      {/* Tiers Grid */}
      <div id="membership-tiers-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-20">
        {discordTiers.map((tier) => {
          const TierIcon = tier.icon;
          const isHighlighted = tier.tag === 'POPULAR';

          return (
            <div
              id={`membership-tier-card-${tier.id}`}
              key={tier.id}
              className={`relative group rounded-2xl p-8 flex flex-col justify-between overflow-hidden backdrop-blur-md transition-all duration-300 border ${
                isDarkMode 
                  ? 'bg-black/30 border-white/10 hover:bg-black/45 hover:border-[#FA5F88]/60 hover:shadow-2xl hover:shadow-[#FA5F88]/10' 
                  : 'bg-white/60 border-zinc-200/80 hover:bg-white/80 hover:border-[#FA5F88]/60 hover:shadow-xl'
              } ${isHighlighted ? 'ring-1 ring-[#FA5F88]/40' : ''}`}
            >
              {/* Top subtle glow overlay */}
              <div className={`absolute top-0 left-0 right-0 h-48 bg-gradient-to-b ${tier.color} opacity-70 pointer-events-none`} />

              <div className="relative z-10 space-y-6">
                {/* Badge Tag */}
                <div className="flex justify-between items-center">
                  <span className={`font-mono text-[9px] tracking-[0.2em] uppercase font-semibold ${isHighlighted ? 'text-[#FA5F88]' : themeStyles.textMuted}`}>
                    {tier.tag}
                  </span>
                  {isHighlighted && (
                    <span 
                      style={{ backgroundColor: 'rgba(250, 95, 136, 0.15)', color: CHERRY_PINK, borderColor: 'rgba(250, 95, 136, 0.3)' }}
                      className="px-2.5 py-0.5 rounded-full font-mono text-[8px] tracking-wider font-bold border"
                    >
                      MOST POPULAR
                    </span>
                  )}
                  {tier.tag === 'ELITE' && (
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[8px] tracking-wider font-semibold border bg-zinc-500/10 text-zinc-300 border-zinc-500/20">
                      VIP ACCESS
                    </span>
                  )}
                </div>

                {/* Tier Name & Description */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div 
                      style={isHighlighted ? { backgroundColor: 'rgba(250, 95, 136, 0.15)', color: CHERRY_PINK } : undefined}
                      className={`p-2.5 rounded-xl border flex items-center justify-center ${
                        isHighlighted 
                          ? 'border-[#FA5F88]/30' 
                          : 'bg-zinc-900/40 border-zinc-800/50 text-zinc-300'
                      }`}
                    >
                      <TierIcon className="w-5 h-5" />
                    </div>
                    <h3 className={`font-sans text-xl font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {tier.name}
                    </h3>
                  </div>
                  <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed h-12 overflow-hidden mt-2`}>
                    {tier.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className={`py-4 border-b flex items-baseline space-x-1 ${isDarkMode ? 'border-white/10' : 'border-zinc-200'}`}>
                  <span className={`text-3xl md:text-4xl font-extrabold tracking-tight font-mono ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
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
                      <CheckCircle2 
                        style={{ color: CHERRY_PINK }}
                        className="w-4 h-4 shrink-0 mt-0.5" 
                      />
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
                style={isHighlighted ? { backgroundColor: CHERRY_PINK } : undefined}
                className={`relative z-10 w-full py-3.5 mt-8 font-mono text-xs tracking-widest font-bold rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center space-x-2 ${
                  isHighlighted 
                    ? 'text-white hover:brightness-110' 
                    : 'bg-zinc-100 hover:bg-white text-zinc-950'
                }`}
              >
                <ShoppingCart className={`w-4 h-4 ${isHighlighted ? 'text-white' : 'text-zinc-950'}`} />
                <span>ADD TO CART</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Perks Highlight Banner */}
      <div id="membership-perks-highlight" className={`rounded-3xl border ${
        isDarkMode 
          ? 'bg-black/30 backdrop-blur-md border-white/10' 
          : 'bg-white/60 backdrop-blur-md border-zinc-200'
      } p-8 md:p-12 relative overflow-hidden shadow-2xl`}>
        <div 
          style={{ background: `radial-gradient(circle, rgba(250,95,136,0.12) 0%, transparent 70%)` }}
          className="absolute top-0 right-0 w-[40%] h-full blur-[70px] pointer-events-none" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles style={{ color: CHERRY_PINK }} className="w-5 h-5" />
              <span className={`font-mono text-xs tracking-[0.2em] uppercase font-bold ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>
                SYSTEM-LINKED SYNC
              </span>
            </div>
            <h4 className={`text-2xl md:text-3xl font-sans tracking-tight font-extrabold uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Immediate Automated Account Provisioning
            </h4>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              Once checked out, our automatic transaction gateways synchronize your purchases with your unique profile. Discord roles, soundboard permissions, and custom cosmetic badges are linked via our bot hub instantly upon order confirmation.
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
            isDarkMode ? 'bg-black/40 border-white/10' : 'bg-white/80 border-zinc-200'
          }`}>
            <h5 className={`font-mono text-xs font-bold uppercase border-b pb-3 flex items-center space-x-2 ${
              isDarkMode ? 'text-zinc-300 border-white/10' : 'text-zinc-800 border-zinc-200'
            }`}>
              <MessageSquare style={{ color: CHERRY_PINK }} className="w-4 h-4" />
              <span>Discord Community Hub</span>
            </h5>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              Join over 12,000+ members in our official Discord community. Connect with active creators, participate in weekly events, and enjoy custom voice perks.
            </p>
            <div className={`p-3 rounded-lg font-mono text-xs flex justify-between items-center ${
              isDarkMode ? 'bg-black/60 text-zinc-200 border border-white/10' : 'bg-white text-zinc-800 border border-zinc-200'
            }`}>
              <span className="text-zinc-400">OFFICIAL SERVER:</span>
              <span style={{ color: CHERRY_PINK }} className="font-bold tracking-wider">discord.gg/ineffable</span>
            </div>
            <button
              id="cta-membership-contact"
              onClick={() => setCurrentPage('shop')}
              style={{ backgroundColor: CHERRY_PINK }}
              className="w-full py-3.5 text-white font-mono text-[10px] tracking-widest font-bold rounded-lg transition-all hover:brightness-110 cursor-pointer shadow-md"
            >
              EXPLORE PROMOTIONS IN SHOP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
