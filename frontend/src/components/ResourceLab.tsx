/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Smile, 
  Code, 
  Image as ImageIcon, 
  Music, 
  Hash, 
  Volume2, 
  Bookmark, 
  FolderHeart, 
  User, 
  Info, 
  Plus, 
  Heart 
} from 'lucide-react';

interface ResourceLabProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

type TabType = 'symbols' | 'bios' | 'layouts' | 'banners' | 'customizer';
type SymbolCategory = 'celestial' | 'dividers' | 'brackets' | 'kaomoji' | 'music';
type FontStyleType = 'gothic' | 'double' | 'cursive' | 'fullwidth' | 'bubble';

export const ResourceLab: React.FC<ResourceLabProps> = ({ activeAtmosphere, isDarkMode }) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const getDiscordCardTheme = () => {
    const theme = activeAtmosphere.colorTheme;
    if (isDarkMode) {
      switch (theme) {
        case 'neon-mint':
          return {
            bg: 'bg-[#0b120f]',
            border: 'border-[#14231d]/80',
            innerBg: 'bg-[#121c18]/90',
            innerBorder: 'border-[#1a2d26]/60',
            preBg: 'bg-[#090d0b]',
            textPrimary: 'text-zinc-100',
            textSecondary: 'text-zinc-400',
            labelColor: 'text-[#52c49b]',
            statusRing: 'ring-[#0b120f]'
          };
        case 'crimson-moon':
          return {
            bg: 'bg-[#120808]',
            border: 'border-[#261010]/80',
            innerBg: 'bg-[#1b0d0d]/90',
            innerBorder: 'border-[#301616]/60',
            preBg: 'bg-[#0a0505]',
            textPrimary: 'text-zinc-100',
            textSecondary: 'text-zinc-400',
            labelColor: 'text-[#e74c3c]',
            statusRing: 'ring-[#120808]'
          };
        case 'monochrome':
          return {
            bg: 'bg-[#121212]',
            border: 'border-[#242424]/80',
            innerBg: 'bg-[#1c1c1c]/90',
            innerBorder: 'border-[#2a2a2a]/60',
            preBg: 'bg-[#0a0a0a]',
            textPrimary: 'text-zinc-100',
            textSecondary: 'text-zinc-400',
            labelColor: 'text-zinc-400',
            statusRing: 'ring-[#121212]'
          };
        case 'classic':
        default:
          return {
            bg: 'bg-[#111214]',
            border: 'border-[#1e2022]/80',
            innerBg: 'bg-[#1e1f22]/90',
            innerBorder: 'border-[#2b2d31]/60',
            preBg: 'bg-[#111214]',
            textPrimary: 'text-zinc-100',
            textSecondary: 'text-zinc-400',
            labelColor: 'text-rose-400',
            statusRing: 'ring-[#111214]'
          };
      }
    } else {
      switch (theme) {
        case 'neon-mint':
          return {
            bg: 'bg-[#f4faf7]',
            border: 'border-emerald-200/60',
            innerBg: 'bg-white',
            innerBorder: 'border-emerald-100/80',
            preBg: 'bg-[#ebf5f0]',
            textPrimary: 'text-[#060607]',
            textSecondary: 'text-[#4e5058]',
            labelColor: 'text-emerald-600 font-bold',
            statusRing: 'ring-[#f4faf7]'
          };
        case 'crimson-moon':
          return {
            bg: 'bg-[#fdf5f5]',
            border: 'border-red-200/60',
            innerBg: 'bg-white',
            innerBorder: 'border-red-100/80',
            preBg: 'bg-[#f9eaea]',
            textPrimary: 'text-[#060607]',
            textSecondary: 'text-[#4e5058]',
            labelColor: 'text-red-600 font-bold',
            statusRing: 'ring-[#fdf5f5]'
          };
        case 'monochrome':
          return {
            bg: 'bg-[#f4f4f5]',
            border: 'border-zinc-300/60',
            innerBg: 'bg-white',
            innerBorder: 'border-zinc-200/80',
            preBg: 'bg-[#e4e4e7]',
            textPrimary: 'text-[#060607]',
            textSecondary: 'text-[#4e5058]',
            labelColor: 'text-zinc-600 font-bold',
            statusRing: 'ring-[#f4f4f5]'
          };
        case 'classic':
        default:
          return {
            bg: 'bg-[#fdf8f9]',
            border: 'border-rose-200/60',
            innerBg: 'bg-white',
            innerBorder: 'border-rose-100/80',
            preBg: 'bg-[#f9ebeef0]',
            textPrimary: 'text-[#060607]',
            textSecondary: 'text-[#4e5058]',
            labelColor: 'text-rose-600 font-bold',
            statusRing: 'ring-[#fdf8f9]'
          };
      }
    }
  };

  const cardTheme = getDiscordCardTheme();

  const [activeTab, setActiveTab] = useState<TabType>('symbols');
  const [activeSymbolCategory, setActiveSymbolCategory] = useState<SymbolCategory>('celestial');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Profile Customizer State
  const [customName, setCustomName] = useState<string>('sakura bloom');
  const [customStatus, setCustomStatus] = useState<string>('✨ adrift in deep space...');
  const [customBio, setCustomBio] = useState<string>(
    `╭ ── · ✙ · ── ╮\n  ★ Name : sakura\n  ✦ Age : eighteen\n  ✧ Status : blooming\n╰ ── · ✙ · ── ╯`
  );
  const [bannerColor, setBannerColor] = useState<string>('#ff8da1');
  const [bannerImage, setBannerImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=600&auto=format&fit=crop'
  );
  const [badgeNitro, setBadgeNitro] = useState<boolean>(true);
  const [badgeDev, setBadgeDev] = useState<boolean>(true);
  const [badgeBooster, setBadgeBooster] = useState<boolean>(true);
  const [discordStatus, setDiscordStatus] = useState<'online' | 'idle' | 'dnd' | 'streaming'>('online');

  const bioInputRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const handleInsertSymbol = (symbol: string) => {
    const textarea = bioInputRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newBio = customBio.substring(0, start) + symbol + customBio.substring(end);
      setCustomBio(newBio);
      
      // Reset cursor position after state update
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + symbol.length, start + symbol.length);
      }, 50);
    } else {
      setCustomBio(prev => prev + symbol);
    }
  };

  const tabs = [
    { id: 'symbols', label: 'AESTHETIC SYMBOLS', icon: Smile },
    { id: 'bios', label: 'PROFILE BIOS', icon: Bookmark },
    { id: 'layouts', label: 'SERVER LAYOUTS', icon: Code },
    { id: 'banners', label: 'PROFILE BANNERS', icon: ImageIcon },
    { id: 'customizer', label: 'PROFILE DESIGNER', icon: Sparkles }
  ];

  const symbolCategories = [
    { id: 'celestial', label: 'CELESTIAL & STARS' },
    { id: 'dividers', label: 'DIVIDERS & LINES' },
    { id: 'brackets', label: 'BRACKETS & CORNERS' },
    { id: 'kaomoji', label: 'KAOMOJI EMOTES' },
    { id: 'music', label: 'MUSIC & METERS' }
  ];

  const symbols = {
    celestial: [
      '✦', '✧', '★', '☆', '☄', '☾', '🌌', '🪐', '🛰️', '🛸', '☀️', '☁️', '⚡', '❄️', '✨',
      '☄️', '☽', '☼', '☀', '☁', '☔', '❄', '❅', '❆', '❇', '❈', '❉', '❊', '❋', '🌌'
    ],
    dividers: [
      '━━━━━ • ✙ • ━━━━━',
      '─── ⋆⋅☆⋅⋆ ───',
      '︶︶︶︶︶︶︶︶︶︶',
      '━━━━━━━━━━━━━━━',
      '─────── ✧ ───────',
      '•───────────────────•',
      '  ⋮  ⋮  ⋮  ⋮  ⋮  ⋮  ',
      '─── ∘°❉°∘ ───',
      '═━═━═━═━═━═━═━═━═'
    ],
    brackets: [
      '﹝ ﹞', '〖 〗', '【 】', '〔 〕', '《 》', '「 」', '『 』', '⟨ ⟩', '❨ ❩', '⎡ ⎤',
      '╍╍╍', '『  』', '⌈  ⌉', '⟦  ⟧', '⦗  ⦘', '⟨  ⟩'
    ],
    kaomoji: [
      '(｡•̀ᴗ-)✧', '(◡‿◡✿)', '(◕‿◕✿)', '(｡♥‿♥｡)', '(•‿•)', '(￣▽￣)ノ', '(´｡• ᵕ •｡`)',
      '(*^‿^*)', '(◕▿◕✿)', '(っ◕‿◕)っ', '(^‿^✿)', '(✿◠‿◠)', '(ᗒᗣᗕ)՞', '(ノ_<。)'
    ],
    music: [
      '♩', '♪', '♫', '♬', '♭', '♮', '♯', '🎵', '🎶', '📻', '🎧', '🎙️', '🎚️', '🎛️',
      ' ▂ ▃ ▄ ▅ ▆ █ 100%',
      '───●──────────',
      '↻   ◄◄   ▍▍   ►►   ↺'
    ]
  };

  const bios = [
    {
      id: 'bio-sakura',
      title: 'Sakura Minimalist',
      content: `╭ ── · ✙ · ── ╮\n  ★ Name : sakura\n  ✦ Age : eighteen\n  ✧ Status : blooming\n╰ ── · ✙ · ── ╯`
    },
    {
      id: 'bio-cosmic',
      title: 'Cosmic Traveler',
      content: `┌─── ⋆⋅☆⋅⋆ ───┐\n   🪐 explorer\n   ☄️ they / them\n   ✨ adrift in code\n└─── ⋆⋅☆⋅⋆ ───┘`
    },
    {
      id: 'bio-music',
      title: 'Audio Visual Loop',
      content: `•───────────────────•\n  ♩ now playing: inefontop loops\n  0:00 ───●────────── 3:45\n  ↻     ◄◄    ▍▍    ►►    ↺\n•───────────────────•`
    },
    {
      id: 'bio-goth',
      title: 'Brutalist Terminal',
      content: `◤━━━━━━━━━━━━━━━━━━━━◥\n   SYSTEM: ONLINE // 2026\n   NODE: OSAKA CHASSIS\n   VIBE: MONOCHROMATIC\n◣━━━━━━━━━━━━━━━━━━━━◢`
    }
  ];

  const serverLayouts = [
    {
      id: 'layout-sakura',
      theme: 'Sakura Petal Blossom (Cafe Theme)',
      channels: [
        { type: 'category', name: '🌸・lobby desk' },
        { type: 'text', name: '📌・welcome-desk' },
        { type: 'text', name: '📜・server-laws' },
        { type: 'category', name: '💬・chat rooms' },
        { type: 'text', name: '🌸・petal-talk' },
        { type: 'text', name: '📸・visuals-only' },
        { type: 'category', name: '🔊・drift channels' },
        { type: 'voice', name: 'Lobby Desk 01' },
        { type: 'voice', name: 'Cozy Corner' }
      ]
    },
    {
      id: 'layout-cyber',
      theme: 'Cyberpunk Neon Mint (Tech Theme)',
      channels: [
        { type: 'category', name: '⚡・control room' },
        { type: 'text', name: '📟・terminal-log' },
        { type: 'text', name: '💡・ideas-blueprint' },
        { type: 'category', name: '📡・transmissions' },
        { type: 'text', name: '💬・general-comms' },
        { type: 'text', name: '🛠️・sandbox-code' },
        { type: 'category', name: '🔊・voice lines' },
        { type: 'voice', name: 'SANDBOX_NODE_A' },
        { type: 'voice', name: 'AUDIO_STREAM_01' }
      ]
    }
  ];

  const banners = [
    {
      id: 'banner-sakura',
      title: 'Inefontop Drift Sakura',
      image: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'banner-cyber',
      title: 'Tokyo Neon Cyber Lounge',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'banner-brutalist',
      title: 'Icelandic Minimalist Monolith',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'banner-space',
      title: 'Monochromatic Star System',
      image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const fontOptions: { id: FontStyleType; label: string }[] = [
    { id: 'gothic', label: 'GOTHIC FRAKTUR' },
    { id: 'double', label: 'BLACKBOARD BOLD' },
    { id: 'cursive', label: 'CURSIVE SCRIPT' },
    { id: 'fullwidth', label: 'FULLWIDTH VAPOR' },
    { id: 'bubble', label: 'BUBBLE CIRCLE' }
  ];

  const mapToFancy = (text: string, type: FontStyleType): string => {
    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const fancy = {
      gothic: "𝔄𝔅𝔖𝔇𝔈𝔉𝔊𝔋𝔌𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔𝔕𝔖𝔗𝔘𝔙𝔚𝔛𝔜𝔝𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷0123456789",
      double: "𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
      cursive: "𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃0123456789",
      fullwidth: "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９",
      bubble: "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨"
    };

    const set = fancy[type];
    return text.split('').map(char => {
      const idx = normal.indexOf(char);
      return idx !== -1 ? set[idx] || char : char;
    }).join('');
  };

  return (
    <div id="resource-lab-section" className={`border-t ${themeStyles.borderMuted} pt-24 pb-12 transition-all`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
            INEF.CC // DIGITAL STYLE RESOURCE DATABASE
          </span>
          <h2 className={`text-3xl md:text-5xl font-sans tracking-tight font-extrabold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase`}>
            Aesthetic Discord Lab
          </h2>
          <p className={`${themeStyles.textSecondary} font-sans text-sm md:text-base font-light leading-relaxed`}>
            Take your Discord profile and server design to the absolute top. Browse premium components or design your profile live with instant copyable templates.
          </p>
        </div>

        {/* Copy Success Toast Alert */}
        <AnimatePresence>
          {copiedText && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className={`fixed bottom-6 right-6 z-50 border font-mono text-[10px] tracking-widest px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 ${
                isDarkMode 
                  ? 'bg-emerald-950 border-emerald-500/30 text-emerald-300' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>COPIED TO CLIPBOARD</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary Lab Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                id={`lab-tab-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`p-4 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center gap-3 cursor-pointer group ${
                  isActive
                    ? `${themeStyles.accentBg} ${isDarkMode ? 'text-zinc-950 border-white' : 'text-white border-zinc-300'} scale-102 font-bold shadow-lg`
                    : `${themeStyles.bgCard} ${themeStyles.borderMuted} ${
                        isDarkMode 
                          ? 'text-zinc-400 hover:text-white hover:border-zinc-500' 
                          : 'text-zinc-600 hover:text-zinc-900 hover:border-zinc-400'
                      }`
                }`}
              >
                <Icon className={`w-6 h-6 transition-transform group-hover:scale-110 ${isActive ? (isDarkMode ? 'text-zinc-950' : 'text-white') : themeStyles.accentText}`} />
                <span className="font-mono text-[10px] tracking-widest uppercase">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Database & Customizer Views */}
        <div className={`${themeStyles.bgCard} border ${themeStyles.borderMuted} rounded-3xl p-6 md:p-8 shadow-xl min-h-[400px]`}>
          
          {/* SYMBOLS TAB */}
          {activeTab === 'symbols' && (
            <div className="space-y-8 animate-fade-in">
              <div className={`flex flex-wrap items-center gap-2 border-b pb-6 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}>
                {symbolCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSymbolCategory(cat.id as SymbolCategory)}
                    className={`px-4 py-2 font-mono text-[9px] tracking-wider rounded-lg border transition-all cursor-pointer ${
                      activeSymbolCategory === cat.id
                        ? `${themeStyles.accentBg} ${isDarkMode ? 'text-zinc-950 border-white' : 'text-white border-zinc-400'} font-semibold`
                        : `${
                            isDarkMode 
                              ? 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:text-white' 
                              : 'bg-zinc-100/80 border-zinc-200 text-zinc-600 hover:text-zinc-900'
                          }`
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4">
                {symbols[activeSymbolCategory].map((sym, idx) => {
                  const getFontSizeClass = (text: string) => {
                    if (text.length > 15) return 'text-[9px] md:text-[10px] font-mono tracking-tight';
                    if (text.length > 8) return 'text-xs md:text-sm font-mono';
                    if (text.length > 4) return 'text-base';
                    return 'text-xl';
                  };
                  return (
                    <button
                      id={`symbol-copy-btn-${activeSymbolCategory}-${idx}`}
                      key={idx}
                      onClick={() => handleCopy(sym)}
                      className={`h-16 rounded-xl border flex items-center justify-center transition-all duration-200 group relative cursor-pointer overflow-hidden ${getFontSizeClass(sym)} ${
                        isDarkMode 
                          ? 'bg-zinc-950/40 border-zinc-900 text-white hover:bg-zinc-900 hover:border-zinc-500' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100 hover:border-zinc-400'
                      }`}
                      title="Click to copy"
                    >
                      <span className="truncate max-w-full px-2 block text-center select-none">{sym}</span>
                      <span className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-200 ${
                        isDarkMode ? 'bg-zinc-950/90' : 'bg-white/95'
                      }`}>
                        <Copy className={`w-4 h-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} />
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className={`${themeStyles.textMuted} font-mono text-[9px] tracking-wider text-center uppercase`}>
                ⚡ CLICK ANY SYMBOL TO COPY INSTANTLY FOR NICKNAMES OR BIOS
              </p>
            </div>
          )}

          {/* BIOS TAB */}
          {activeTab === 'bios' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              {bios.map((bio) => (
                <div 
                  id={`bio-card-${bio.id}`}
                  key={bio.id} 
                  className={`border rounded-2xl p-6 flex flex-col justify-between space-y-4 group transition-colors ${
                    isDarkMode 
                      ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-500/40' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>{bio.title}</h4>
                      <span className={`font-mono text-[8px] ${themeStyles.accentText} ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-200'} px-2 py-0.5 rounded`}>COPYABLE</span>
                    </div>
                    <pre className={`font-mono text-xs p-4 rounded-xl border overflow-x-auto whitespace-pre leading-relaxed font-light ${
                      isDarkMode 
                        ? 'text-zinc-300 bg-zinc-950 border-zinc-900/60' 
                        : 'text-zinc-700 bg-white border-zinc-200/80'
                    }`}>
                      {bio.content}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`copy-bio-btn-${bio.id}`}
                      onClick={() => handleCopy(bio.content)}
                      className={`w-full py-2.5 font-mono text-[9px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer border ${
                        isDarkMode 
                          ? 'bg-zinc-900/50 hover:bg-white border-zinc-900 hover:border-white text-zinc-400 hover:text-zinc-950' 
                          : 'bg-white hover:bg-zinc-900 border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-white'
                      }`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>COPY BIO</span>
                    </button>
                    <button
                      onClick={() => {
                        setCustomBio(bio.content);
                        setActiveTab('customizer');
                      }}
                      className={`w-full py-2.5 border font-mono text-[9px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        isDarkMode 
                          ? 'bg-zinc-950/80 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-300' 
                          : 'bg-white hover:bg-zinc-100 border-zinc-200 hover:border-zinc-300 text-zinc-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      <span>CUSTOMIZE</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SERVER LAYOUTS TAB */}
          {activeTab === 'layouts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
              {serverLayouts.map((lay) => (
                <div 
                  id={`layout-card-${lay.id}`}
                  key={lay.id} 
                  className={`border rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-colors ${
                    isDarkMode 
                      ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-500/40' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="space-y-4">
                    <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'}`}>
                      <div className="flex items-center space-x-2">
                        <FolderHeart className={`w-4 h-4 ${themeStyles.accentText}`} />
                        <h4 className={`font-sans text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-800'}`}>{lay.theme}</h4>
                      </div>
                      <span className="font-mono text-[8px] text-zinc-500">DISCORD STANDARD</span>
                    </div>
                    <div className={`space-y-2 font-mono text-[11px] p-4 rounded-xl border max-h-60 overflow-y-auto ${
                      isDarkMode 
                        ? 'text-zinc-400 bg-zinc-950 border-zinc-900' 
                        : 'text-zinc-600 bg-white border-zinc-200'
                    }`}>
                      {lay.channels.map((chan, idx) => (
                        <div key={idx} className="flex items-center space-x-2 py-0.5">
                          {chan.type === 'category' ? (
                            <span className={`${isDarkMode ? 'text-zinc-600' : 'text-zinc-400'} uppercase text-[9px] tracking-widest font-bold mt-2 first:mt-0 block`}>▼ {chan.name}</span>
                          ) : chan.type === 'voice' ? (
                            <span className="pl-4 text-emerald-500 flex items-center space-x-1 font-medium">
                              <Volume2 className="w-3 h-3 shrink-0" />
                              <span>{chan.name}</span>
                            </span>
                          ) : (
                            <span className="pl-4 flex items-center space-x-1">
                              <Hash className={`w-3 h-3 shrink-0 ${isDarkMode ? 'text-zinc-700' : 'text-zinc-300'}`} />
                              <span className={isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}>{chan.name}</span>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    id={`copy-layout-btn-${lay.id}`}
                    onClick={() => {
                      const text = lay.channels.map(c => c.name).join('\n');
                      handleCopy(text);
                    }}
                    className={`w-full py-3 border font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-zinc-900/50 hover:bg-white border-zinc-900 hover:border-white text-zinc-400 hover:text-zinc-950' 
                        : 'bg-white hover:bg-zinc-900 border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-white'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY CHANNELS LIST</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* BANNERS TAB */}
          {activeTab === 'banners' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {banners.map((ban) => (
                <div 
                  id={`banner-card-${ban.id}`}
                  key={ban.id} 
                  className={`group border rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-500/40' 
                      : 'bg-zinc-50 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-950">
                    <img 
                      src={ban.image} 
                      alt={ban.title} 
                      className={`w-full h-full object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500 ${
                        isDarkMode ? 'grayscale group-hover:grayscale-0' : ''
                      }`}
                    />
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className={`font-sans text-[11px] font-bold uppercase tracking-wide truncate ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>{ban.title}</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        id={`copy-banner-btn-${ban.id}`}
                        onClick={() => handleCopy(ban.image)}
                        className={`py-2 border font-mono text-[8px] tracking-widest font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                          isDarkMode 
                            ? 'bg-zinc-950 hover:bg-white border-zinc-900 hover:border-white text-zinc-400 hover:text-zinc-950' 
                            : 'bg-white hover:bg-zinc-900 border-zinc-200 hover:border-zinc-900 text-zinc-600 hover:text-white'
                        }`}
                      >
                        <Copy className="w-3 h-3" />
                        <span>COPY URL</span>
                      </button>
                      <button
                        onClick={() => {
                          setBannerImage(ban.image);
                          setActiveTab('customizer');
                        }}
                        className={`py-2 border font-mono text-[8px] tracking-widest font-bold rounded-lg transition-all flex items-center justify-center space-x-1 cursor-pointer ${
                          isDarkMode 
                            ? 'bg-zinc-900/50 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-rose-400' 
                            : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-600'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>APPLY BANNER</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE DESIGNER TAB (NEW!) */}
          {activeTab === 'customizer' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in text-left">
              
              {/* Left Column: Interactive Tools */}
              <div className="lg:col-span-7 space-y-8">
                
                {/* Name & Fancy Fonts */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={`font-mono text-[10px] tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      1. ENTER PROFILE NAME
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">UNICODE GENERATOR</span>
                  </div>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Type name here..."
                    className={`w-full px-4 py-3 border rounded-xl font-sans focus:outline-none transition-colors text-sm ${
                      isDarkMode 
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-rose-400' 
                        : 'bg-white border-zinc-200 text-zinc-800 focus:border-rose-500'
                    }`}
                  />
                  
                  {/* Fancy Font Previews */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {fontOptions.map((font) => {
                      const converted = mapToFancy(customName || 'sakura', font.id);
                      return (
                        <div 
                          key={font.id}
                          className={`p-3 border rounded-lg flex items-center justify-between group transition-colors ${
                            isDarkMode 
                              ? 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800' 
                              : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                          }`}
                        >
                          <div className="space-y-0.5 max-w-[70%]">
                            <span className="block text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{font.label}</span>
                            <span className={`block text-sm truncate font-light font-sans ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{converted}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => setCustomName(converted)}
                              className={`px-2 py-1 border text-[8px] font-mono rounded tracking-wider transition-colors cursor-pointer ${
                                isDarkMode 
                                  ? 'bg-zinc-900 hover:bg-rose-400 hover:text-zinc-950 border-zinc-800' 
                                  : 'bg-zinc-100 hover:bg-rose-500 hover:text-white border-zinc-200'
                              }`}
                              title="Apply to mockup"
                            >
                              APPLY
                            </button>
                            <button
                              onClick={() => handleCopy(converted)}
                              className={`p-1 border rounded transition-colors cursor-pointer ${
                                isDarkMode 
                                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white' 
                                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-500 hover:text-zinc-800'
                              }`}
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status & Badge Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className={`font-mono text-[10px] tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} block`}>
                      2. CUSTOM STATUS
                    </label>
                    <input
                      type="text"
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      placeholder="e.g. ✨ adrift..."
                      className={`w-full px-4 py-3 border rounded-xl font-sans focus:outline-none transition-colors text-sm ${
                        isDarkMode 
                          ? 'bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-rose-400' 
                          : 'bg-white border-zinc-200 text-zinc-800 focus:border-rose-500'
                      }`}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className={`font-mono text-[10px] tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} block`}>
                      3. ONLINE STATUS
                    </label>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 'online', label: 'ONLINE', color: 'bg-emerald-500' },
                        { id: 'idle', label: 'IDLE', color: 'bg-amber-500' },
                        { id: 'dnd', label: 'DND', color: 'bg-rose-600' },
                        { id: 'streaming', label: 'STREAM', color: 'bg-purple-600' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setDiscordStatus(st.id as any)}
                          className={`py-2 px-1 rounded-lg border text-[8px] font-mono font-bold tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                            discordStatus === st.id
                              ? isDarkMode 
                                ? 'bg-zinc-900 border-white text-white scale-102 shadow' 
                                : 'bg-zinc-100 border-zinc-400 text-zinc-950 scale-102 shadow'
                              : isDarkMode 
                                ? 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800' 
                                : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${st.color}`} />
                          <span>{st.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Theme / Banner Options */}
                <div className="space-y-3">
                  <label className={`font-mono text-[10px] tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} block`}>
                    4. CARD BANNER & THEME ACCENT
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Color picker circle presets */}
                    {[
                      { id: 'pink', hex: '#ff8da1', name: 'Sakura' },
                      { id: 'mint', hex: '#10b981', name: 'Mint' },
                      { id: 'crimson', hex: '#ef4444', name: 'Crimson' },
                      { id: 'blurple', hex: '#5865f2', name: 'Blurple' },
                      { id: 'charcoal', hex: '#2b2d31', name: 'Dark' }
                    ].map((col) => (
                      <button
                        key={col.id}
                        onClick={() => {
                          setBannerColor(col.hex);
                          setBannerImage(null); // Remove image if color is explicitly chosen
                        }}
                        className={`w-8 h-8 rounded-full border transition-transform flex items-center justify-center relative cursor-pointer ${
                          bannerColor === col.hex && !bannerImage 
                            ? 'scale-110 border-white ring-2 ring-rose-500/20' 
                            : isDarkMode ? 'border-zinc-900 hover:scale-105' : 'border-zinc-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      >
                        {bannerColor === col.hex && !bannerImage && (
                          <Check className="w-4 h-4 text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                    <span className="text-zinc-600">//</span>
                    {/* Image preset banner buttons */}
                    {banners.map((ban) => (
                      <button
                        key={ban.id}
                        onClick={() => {
                          setBannerImage(ban.image);
                          setBannerColor('#1a1c1e');
                        }}
                        className={`px-3 py-1.5 rounded-lg border text-[8px] font-mono tracking-wider transition-all truncate max-w-[120px] cursor-pointer ${
                          bannerImage === ban.image
                            ? isDarkMode 
                              ? `${themeStyles.accentBg} text-zinc-950 border-white font-bold`
                              : 'bg-zinc-900 border-zinc-800 text-white font-bold'
                            : isDarkMode 
                              ? 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:border-zinc-800' 
                              : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        {ban.title.replace('Inefontop Drift ', '')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Profile Bio Editor with Decorative Symbol Quick Insert */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className={`font-mono text-[10px] tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      5. EDIT AESTHETIC BIO
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">ONE-CLICK SYMBOL INSERT</span>
                  </div>
                  
                  {/* Decorative symbols quick insert bar */}
                  <div className={`p-3 border rounded-xl flex items-center gap-1.5 overflow-x-auto max-w-full whitespace-nowrap scrollbar-thin ${
                    isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
                  }`}>
                    <span className="text-[8px] font-mono text-zinc-500 tracking-wider mr-2 uppercase shrink-0">ADD:</span>
                    {symbols.celestial.slice(0, 10).map((sym, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleInsertSymbol(sym)}
                        className={`px-2 py-1 border rounded text-xs transition-all cursor-pointer shrink-0 font-sans ${
                          isDarkMode 
                            ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 text-white' 
                            : 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                    {symbols.music.slice(0, 4).map((sym, idx) => (
                      <button
                        key={`music-${idx}`}
                        onClick={() => handleInsertSymbol(sym)}
                        className={`px-2 py-1 border rounded text-xs transition-all cursor-pointer shrink-0 font-sans ${
                          isDarkMode 
                            ? 'bg-zinc-950 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900 text-white' 
                            : 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  <textarea
                    ref={bioInputRef}
                    rows={6}
                    value={customBio}
                    onChange={(e) => setCustomBio(e.target.value)}
                    placeholder="Compose bio layout here..."
                    className={`w-full p-4 border rounded-xl font-mono text-xs focus:outline-none transition-colors leading-relaxed whitespace-pre-wrap ${
                      isDarkMode 
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-200 focus:border-rose-400' 
                        : 'bg-white border-zinc-200 text-zinc-800 focus:border-rose-500'
                    }`}
                  />
                </div>

                {/* Discord Badge Options */}
                <div className="space-y-3">
                  <label className={`font-mono text-[10px] tracking-widest uppercase ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} block`}>
                    6. DISPLAY DISCORD BADGES
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className={`flex items-center space-x-2 text-xs font-mono cursor-pointer select-none ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      <input
                        type="checkbox"
                        checked={badgeNitro}
                        onChange={(e) => setBadgeNitro(e.target.checked)}
                        className={`rounded text-rose-500 focus:ring-0 cursor-pointer ${
                          isDarkMode ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-300 bg-white'
                        }`}
                      />
                      <span>DISCORD NITRO</span>
                    </label>
                    <label className={`flex items-center space-x-2 text-xs font-mono cursor-pointer select-none ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      <input
                        type="checkbox"
                        checked={badgeDev}
                        onChange={(e) => setBadgeDev(e.target.checked)}
                        className={`rounded text-rose-500 focus:ring-0 cursor-pointer ${
                          isDarkMode ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-300 bg-white'
                        }`}
                      />
                      <span>ACTIVE DEVELOPER</span>
                    </label>
                    <label className={`flex items-center space-x-2 text-xs font-mono cursor-pointer select-none ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      <input
                        type="checkbox"
                        checked={badgeBooster}
                        onChange={(e) => setBadgeBooster(e.target.checked)}
                        className={`rounded text-rose-500 focus:ring-0 cursor-pointer ${
                          isDarkMode ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-300 bg-white'
                        }`}
                      />
                      <span>SERVER BOOSTER</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Pixel-Perfect Discord Mockup Card */}
              <div className="lg:col-span-5 flex flex-col justify-start">
                <div 
                  className={`sticky top-28 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1.5 pb-6 scrollbar-thin ${
                    isDarkMode 
                      ? 'scrollbar-thumb-zinc-800 scrollbar-track-transparent' 
                      : 'scrollbar-thumb-zinc-300 scrollbar-track-transparent'
                  }`}
                >
                  <span className={`font-mono text-[10px] tracking-widest uppercase text-center block ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    LIVE PREVIEW
                  </span>

                  {/* Discord Profile Card Inner Mockup */}
                  <div 
                    id="discord-mockup-profile-card"
                    className={`w-full ${cardTheme.bg} rounded-2xl border ${cardTheme.border} shadow-2xl overflow-hidden font-sans relative transition-colors duration-300`}
                  >
                    
                    {/* Header Banner */}
                    <div 
                      className="h-28 w-full relative transition-all duration-300 overflow-hidden"
                      style={{ backgroundColor: bannerColor }}
                    >
                      {bannerImage && (
                        <img 
                          src={bannerImage} 
                          alt="Banner Theme" 
                          className="w-full h-full object-cover select-none"
                        />
                      )}
                    </div>

                    {/* Avatar with Status Badge */}
                    <div className="absolute left-4 top-16">
                      <div className="relative">
                        <div 
                          className="w-20 h-20 rounded-full bg-zinc-800 border-[6px] flex items-center justify-center overflow-hidden transition-colors"
                          style={{ 
                            borderColor: isDarkMode 
                              ? (activeAtmosphere.colorTheme === 'neon-mint' ? '#0b120f' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#120808' : activeAtmosphere.colorTheme === 'monochrome' ? '#121212' : '#111214') 
                              : (activeAtmosphere.colorTheme === 'neon-mint' ? '#f4faf7' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#fdf5f5' : activeAtmosphere.colorTheme === 'monochrome' ? '#f4f4f5' : '#fdf8f9') 
                          }}
                        >
                          <img 
                            src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=200&auto=format&fit=crop" 
                            alt="Aesthetic Avatar" 
                            className="w-full h-full object-cover select-none"
                          />
                        </div>
                        {/* Status dot representation */}
                        <div 
                          className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{ 
                            backgroundColor: isDarkMode 
                              ? (activeAtmosphere.colorTheme === 'neon-mint' ? '#0b120f' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#120808' : activeAtmosphere.colorTheme === 'monochrome' ? '#121212' : '#111214') 
                              : (activeAtmosphere.colorTheme === 'neon-mint' ? '#f4faf7' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#fdf5f5' : activeAtmosphere.colorTheme === 'monochrome' ? '#f4f4f5' : '#fdf8f9') 
                          }}
                        >
                          {discordStatus === 'online' && (
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" title="Online" />
                          )}
                          {discordStatus === 'idle' && (
                            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 relative" title="Idle">
                              <span 
                                className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full" 
                                style={{ 
                                  backgroundColor: isDarkMode 
                                    ? (activeAtmosphere.colorTheme === 'neon-mint' ? '#0b120f' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#120808' : activeAtmosphere.colorTheme === 'monochrome' ? '#121212' : '#111214') 
                                    : (activeAtmosphere.colorTheme === 'neon-mint' ? '#f4faf7' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#fdf5f5' : activeAtmosphere.colorTheme === 'monochrome' ? '#f4f4f5' : '#fdf8f9') 
                                }}
                              />
                            </span>
                          )}
                          {discordStatus === 'dnd' && (
                            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 flex items-center justify-center" title="Do Not Disturb">
                              <span 
                                className="w-2 h-0.5 rounded" 
                                style={{ 
                                  backgroundColor: isDarkMode 
                                    ? (activeAtmosphere.colorTheme === 'neon-mint' ? '#0b120f' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#120808' : activeAtmosphere.colorTheme === 'monochrome' ? '#121212' : '#111214') 
                                    : (activeAtmosphere.colorTheme === 'neon-mint' ? '#f4faf7' : activeAtmosphere.colorTheme === 'crimson-moon' ? '#fdf5f5' : activeAtmosphere.colorTheme === 'monochrome' ? '#f4f4f5' : '#fdf8f9') 
                                }}
                              />
                            </span>
                          )}
                          {discordStatus === 'streaming' && (
                            <span className="w-3.5 h-3.5 rounded-full bg-purple-600 flex items-center justify-center text-[7px] text-white font-bold" title="Streaming">
                              ▲
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Badge List Overlay */}
                    <div className={`flex items-center space-x-2 absolute right-4 top-[136px] ${cardTheme.innerBg} px-2 py-1 rounded-lg border ${cardTheme.innerBorder} shadow-md transition-colors duration-300`}>
                      {badgeNitro && (
                        <span className="text-[11px] text-[#ff73fa] font-bold select-none cursor-help hover:scale-110 transition-transform" title="Discord Nitro">✦</span>
                      )}
                      {badgeBooster && (
                        <span className="text-[11px] text-[#00aff4] select-none cursor-help hover:scale-110 transition-transform" title="Server Booster">💎</span>
                      )}
                      {badgeDev && (
                        <span className="text-[11px] text-zinc-400 select-none cursor-help hover:scale-110 transition-transform" title="Active Developer">⚙️</span>
                      )}
                      {!badgeNitro && !badgeBooster && !badgeDev && (
                        <span className="text-[8px] text-zinc-500 font-mono">NO BADGES</span>
                      )}
                    </div>

                    {/* Discord Card Details Area */}
                    <div className="p-4 pt-10 mt-2 space-y-4">
                      
                      {/* Name & Discord Tag */}
                      <div className="space-y-0.5">
                        <h4 className={`text-base font-bold ${cardTheme.textPrimary} tracking-wide truncate`}>
                          {customName || 'sakura bloom'}
                        </h4>
                        <p className={`text-[11px] ${cardTheme.textSecondary} font-medium opacity-90`}>
                          sakurabloom <span className="opacity-60 font-mono">#0000</span>
                        </p>
                      </div>

                      {/* Custom status field */}
                      {customStatus && (
                        <div className={`p-2 ${cardTheme.innerBg} border ${cardTheme.innerBorder} rounded-lg text-[11px] ${cardTheme.textPrimary} font-normal leading-relaxed flex items-center space-x-2 transition-colors duration-300`}>
                          <span className="truncate">{customStatus}</span>
                        </div>
                      )}

                      {/* Thin separator line */}
                      <div className={`border-t ${cardTheme.innerBorder} opacity-60`} />

                      {/* ABOUT ME SECTION */}
                      <div className="space-y-2">
                        <span className={`block text-[9px] font-bold ${cardTheme.textSecondary} uppercase tracking-widest opacity-80`}>
                          ABOUT ME
                        </span>
                        <pre className={`font-mono text-[10px] ${cardTheme.textPrimary} ${cardTheme.preBg} p-3 rounded-xl border ${cardTheme.innerBorder} overflow-x-auto whitespace-pre leading-relaxed font-light transition-colors duration-300`}>
                          {customBio || 'No biography written...'}
                        </pre>
                      </div>

                      {/* MEMBER SINCE */}
                      <div className="space-y-1">
                        <span className={`block text-[9px] font-bold ${cardTheme.textSecondary} uppercase tracking-widest opacity-80`}>
                          MEMBER SINCE
                        </span>
                        <div className={`flex items-center space-x-1.5 ${cardTheme.textSecondary} text-[10px]`}>
                          <span>🗓️ Jul 2, 2026</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Copy bio directly from preview */}
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    <button
                      id="copy-custom-bio-btn"
                      onClick={() => handleCopy(customBio)}
                      className={`w-full py-4 ${themeStyles.accentBg} ${themeStyles.accentBgHover} ${isDarkMode ? 'text-zinc-950' : 'text-white'} font-mono text-[10px] tracking-widest font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer`}
                    >
                      <Copy className="w-4 h-4 shrink-0" />
                      <span>COPY DESIGNED BIO</span>
                    </button>
                    <p className={`text-[9px] font-mono text-center uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      ★ Instantly copy your designed bio to paste inside Discord's profile settings!
                    </p>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

