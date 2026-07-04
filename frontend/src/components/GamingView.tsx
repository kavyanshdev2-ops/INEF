import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, Swords, Users, Shield, Compass, ChevronLeft, 
  Sparkles, ExternalLink, Activity, Terminal, Copy, Check, 
  Layers, Cpu, Trophy, Target, Box, Flame, RefreshCw 
} from 'lucide-react';
import { MinecraftStatusWidget } from './MinecraftStatusWidget';

interface GamingViewProps {
  activeAtmosphere: {
    colorTheme: string;
    accentText: string;
    borderMuted: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    indicatorBg: string;
  };
  isDarkMode: boolean;
}

interface Petal {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  rotate: number;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
}

export function GamingView({ activeAtmosphere, isDarkMode }: GamingViewProps) {
  const [selectedGame, setSelectedGame] = useState<'list' | 'minecraft' | 'roblox' | 'amongus' | 'mechachameleon' | 'krunker'>('list');
  const [copied, setCopied] = useState(false);
  
  // Custom Minecraft States
  const [inventory, setInventory] = useState({
    diamonds: 3,
    redstone: 18,
    emeralds: 5,
    lapis: 9,
    gold: 4,
    sakuraPetals: 12
  });
  const [petals, setPetals] = useState<Petal[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [miningFeed, setMiningFeed] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);
  const [craftedItems, setCraftedItems] = useState<string[]>([]);

  // Roblox state
  const [robloxRobux, setRobloxRobux] = useState(1337);
  const [robloxSkins, setRobloxSkins] = useState<'classic' | 'cyber_punk' | 'voxel_couture'>('classic');

  // Among Us state
  const [amongUsStatus, setAmongUsStatus] = useState<'safe' | 'impostor_alert' | 'sabotage'>('safe');
  const [crewCount, setCrewCount] = useState(10);

  // Mecha Chameleon state
  const [chameleonColor, setChameleonColor] = useState('#10b981'); // Green

  // Krunker state
  const [krunkerWeapon, setKrunkerWeapon] = useState('Sniper Rifle');

  // Generate floating cherry blossom petals in light mode
  useEffect(() => {
    if (selectedGame === 'minecraft' && !isDarkMode) {
      const newPetals = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        size: Math.random() * 10 + 6,
        delay: Math.random() * 6,
        duration: Math.random() * 7 + 5,
        rotate: Math.random() * 360
      }));
      setPetals(newPetals);
    } else {
      setPetals([]);
    }
  }, [selectedGame, isDarkMode]);

  // Generate floating magma / core cave embers in dark mode
  useEffect(() => {
    if (selectedGame === 'minecraft' && isDarkMode) {
      const colors = ['#f43f5e', '#ef4444', '#f59e0b', '#38bdf8', '#10b981'];
      const newSparks = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 110 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 5,
        duration: Math.random() * 6 + 4
      }));
      setSparks(newSparks);
    } else {
      setSparks([]);
    }
  }, [selectedGame, isDarkMode]);

  // Handler for Mine Ores
  const handleMine = (oreName: string, text: string, color: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setInventory(prev => ({
      ...prev,
      [oreName]: prev[oreName as keyof typeof prev] + (oreName === 'redstone' ? 4 : oreName === 'lapis' ? 3 : 1)
    }));

    // Calculate relative coordinate on button click relative to the parent-most container
    const outerContainer = document.getElementById('mining-outer-container');
    const containerRect = outerContainer?.getBoundingClientRect();
    const x = e.clientX - (containerRect?.left ?? 0);
    const y = e.clientY - (containerRect?.top ?? 0) - 15;

    const newFeed = {
      id: Date.now() + Math.random(),
      text,
      x,
      y,
      color
    };
    setMiningFeed(prev => [...prev, newFeed]);
  };

  // Auto clean mining feed floating bubbles
  useEffect(() => {
    if (miningFeed.length > 0) {
      const timer = setTimeout(() => {
        setMiningFeed(prev => prev.slice(1));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [miningFeed]);

  const handleCopyIP = () => {
    navigator.clipboard.writeText('ineffable.mc-play.org');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const games = [
    {
      id: 'minecraft' as const,
      title: 'MINECRAFT',
      subtitle: 'INEFFABLE ANARCHY GRID',
      desc: 'Connect to our dedicated cyber-couture survival sandbox. Built for brutalist architects, designers, and block-builders alike.',
      ip: 'ineffable.mc-play.org',
      tags: ['Anarchy', 'SMP', '1.20-1.21.x'],
      img: 'https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=800&auto=format&fit=crop',
      accentColor: 'text-emerald-400 border-emerald-500/30'
    },
    {
      id: 'roblox' as const,
      title: 'ROBLOX',
      subtitle: 'INEFFABLE METAVERSE',
      desc: 'Our decentralized fashion runaways, high-fashion clothing catalog, and interactive social gathering grid.',
      tags: ['Fashion Runaway', 'Hangout', 'Interactive'],
      img: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=800&auto=format&fit=crop',
      accentColor: 'text-rose-400 border-rose-500/30'
    },
    {
      id: 'amongus' as const,
      title: 'AMONG US',
      subtitle: 'DEEP SPACE DETECTOR',
      desc: 'Unmask the digital saboteur lurking in the ventilation ducts. Optimized with high-contrast UI overlays and proximity voice logs.',
      tags: ['Social Deduction', 'Co-op', 'Skins'],
      img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
      accentColor: 'text-red-400 border-red-500/30'
    },
    {
      id: 'mechachameleon' as const,
      title: 'MECHA CHAMELEON',
      subtitle: 'COLOR STEALTH COUPLER',
      desc: 'Interactive color-shifting platformer module. Command an mechanical chameleon using real-time hex spectrum selectors.',
      tags: ['Color Shifting', 'Puzzle', 'Stealth'],
      img: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=800&auto=format&fit=crop',
      accentColor: 'text-amber-400 border-amber-500/30'
    },
    {
      id: 'krunker' as const,
      title: 'KRUNKER',
      subtitle: 'VOXEL STRIKE TERMINAL',
      desc: 'High-octane client-side first-person voxel shooter. Load custom weapon wrappers, view match metrics, and launch custom servers.',
      tags: ['FPS', 'Fast-paced', 'Custom Loadout'],
      img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      accentColor: 'text-sky-400 border-sky-500/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 relative min-h-screen">
      
      {/* Dynamic atmospheric header when listing */}
      <AnimatePresence mode="wait">
        {selectedGame === 'list' ? (
          <motion.div 
            key="list-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] text-rose-400 font-mono uppercase tracking-widest">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Ineffable Gaming Terminal</span>
            </div>
            <h2 className={`font-mono text-3xl tracking-[0.25em] ${activeAtmosphere.textPrimary} uppercase`}>
              THE GRID ARCADE
            </h2>
            <p className={`${activeAtmosphere.textSecondary} text-xs font-sans font-light leading-relaxed max-w-xl mx-auto`}>
              Interact with custom digital playgrounds, multiplayer sandboxes, and retro simulators configured exclusively for members of the Ineffable cyber matrix.
            </p>
          </motion.div>
        ) : (
          <motion.button
            key="back-btn"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedGame('list')}
            className={`flex items-center space-x-2 px-4 py-2 border ${activeAtmosphere.borderMuted} rounded-xl hover:border-zinc-500 hover:text-white transition-all text-zinc-400 font-mono text-xs cursor-pointer mb-10`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>RETURN TO THE GRID ARCADE</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* GAME CARDS LIST VIEW */}
        {selectedGame === 'list' && (
          <motion.div 
            key="games-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {games.map((g, idx) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`group ${activeAtmosphere.bgCard} border ${activeAtmosphere.borderMuted} hover:border-zinc-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl`}
              >
                {/* Card Header Image */}
                <div className="relative h-64 overflow-hidden bg-zinc-950">
                  <img 
                    src={g.img} 
                    alt={g.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    {g.tags.map(tag => (
                      <span key={tag} className="bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800/80 px-2.5 py-1 rounded-full font-mono text-[8px] tracking-widest font-bold uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Floating Arcade Badge */}
                  <div className="absolute bottom-4 right-4 bg-zinc-950/70 backdrop-blur-md border border-zinc-800/50 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-white font-mono text-[9px] font-bold">ARCADE</span>
                  </div>
                </div>

                {/* Card Details & Launcher */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className={`font-sans text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase tracking-wide`}>
                        {g.title}
                      </h3>
                    </div>
                    <span className="text-[9px] tracking-widest text-zinc-500 uppercase font-mono block">
                      {g.subtitle}
                    </span>
                    <p className={`${activeAtmosphere.textSecondary} text-xs font-light leading-relaxed line-clamp-3`}>
                      {g.desc}
                    </p>
                  </div>

                  {/* Interactive Launch Button */}
                  <button
                    onClick={() => setSelectedGame(g.id)}
                    className={`w-full py-3.5 mt-4 border font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                      isDarkMode
                        ? `bg-zinc-900/60 border-zinc-800/80 text-white group-hover:bg-zinc-100 group-hover:border-white group-hover:text-zinc-950`
                        : `bg-zinc-900 border-zinc-900 text-white group-hover:bg-zinc-850 group-hover:border-zinc-850 group-hover:text-white`
                    }`}
                  >
                    <span>LAUNCH PORTAL</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* MINECRAFT IMMERSIVE ESTHETIC PAGE */}
        {selectedGame === 'minecraft' && (
          <motion.div
            key="minecraft-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-12 relative"
          >
            {/* Custom Google Fonts & Minecraft Styling Rule injection */}
            <style dangerouslySetInnerHTML={{ __html: `
              @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
              .font-minecraft {
                font-family: 'Press Start 2P', monospace;
              }
              .font-vt323 {
                font-family: 'VT323', monospace;
              }
              .text-shadow-mc {
                text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.85);
              }
              .text-shadow-glow-cyan {
                text-shadow: 0 0 15px rgba(34, 211, 238, 0.6), 2px 2px 0px rgba(0, 0, 0, 0.9);
              }
              .text-shadow-glow-pink {
                text-shadow: 0 0 15px rgba(244, 114, 182, 0.6), 2px 2px 0px rgba(0, 0, 0, 0.9);
              }
              .text-shadow-glow-emerald {
                text-shadow: 0 0 15px rgba(16, 185, 129, 0.6), 2px 2px 0px rgba(0, 0, 0, 0.9);
              }
              .bg-cave-mesh {
                background-image: radial-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px);
                background-size: 24px 24px;
              }
              .bg-cherry-mesh {
                background-image: radial-gradient(rgba(244, 114, 182, 0.05) 1px, transparent 1px);
                background-size: 24px 24px;
              }
              @keyframes float-slow {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-10px) rotate(180deg); }
              }
              .animate-float-slow {
                animation: float-slow 12s infinite ease-in-out;
              }
            `}} />

            {/* Floating Cherry Blossom Petals container - rendered in Light Mode only */}
            {!isDarkMode && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {petals.map((petal) => (
                  <motion.div
                    key={petal.id}
                    initial={{ 
                      x: `${petal.x}%`, 
                      y: `${petal.y}%`, 
                      rotate: petal.rotate,
                      opacity: 0 
                    }}
                    animate={{ 
                      y: ['-5%', '105%'], 
                      x: [`${petal.x}%`, `${petal.x + (petal.id % 2 === 0 ? 10 : -10)}%`],
                      rotate: [petal.rotate, petal.rotate + 360],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                      duration: petal.duration, 
                      repeat: Infinity, 
                      delay: petal.delay,
                      ease: 'linear'
                    }}
                    className="absolute rounded-full bg-pink-300/60 blur-[0.5px] border border-pink-400/30"
                    style={{ 
                      width: petal.size, 
                      height: petal.size * 0.7,
                      boxShadow: '0 0 8px rgba(244, 114, 182, 0.3)'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Floating Glowing Cave Embers / Sparks - rendered in Dark Mode only */}
            {isDarkMode && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {sparks.map((spark) => (
                  <motion.div
                    key={spark.id}
                    initial={{ 
                      x: `${spark.x}%`, 
                      y: `${spark.y}%`, 
                      scale: 0.5,
                      opacity: 0 
                    }}
                    animate={{ 
                      y: ['105%', '-5%'], 
                      x: [`${spark.x}%`, `${spark.x + (spark.id % 2 === 0 ? 6 : -6)}%`],
                      scale: [0.5, 1.2, 0.5],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{ 
                      duration: spark.duration, 
                      repeat: Infinity, 
                      delay: spark.delay,
                      ease: 'easeOut'
                    }}
                    className="absolute rounded"
                    style={{ 
                      width: '4px', 
                      height: '4px',
                      backgroundColor: spark.color,
                      boxShadow: `0 0 10px ${spark.color}`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Immersive Minecraft Aesthetic Banner */}
            <div className={`relative border-4 rounded-3xl overflow-hidden transition-all duration-700 shadow-2xl p-8 lg:p-12 ${
              isDarkMode 
                ? 'border-[#12161a] bg-gradient-to-br from-[#0c0f12] via-[#14191f] to-[#07090b]' 
                : 'border-pink-200 bg-gradient-to-br from-[#fff0f5] via-[#ffe4e1] to-[#fcfcfc]'
            }`}>
              
              {/* Background specific mesh */}
              <div className={`absolute inset-0 pointer-events-none opacity-40 ${isDarkMode ? 'bg-cave-mesh' : 'bg-cherry-mesh'}`} />
              
              {/* Top thematic block border */}
              {isDarkMode ? (
                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-cyan-600 via-purple-600 to-cyan-600 border-b-4 border-cyan-950" />
              ) : (
                <div className="absolute top-0 left-0 w-full h-3 bg-pink-400 border-b-4 border-pink-500" />
              )}

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded text-[9px] font-mono uppercase tracking-widest border ${
                    isDarkMode 
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.15)]' 
                      : 'bg-pink-100 border-pink-300 text-pink-600'
                  }`}>
                    <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>{isDarkMode ? 'UNDERGROUND CAVE BIOME' : 'CHERRY BLOSSOM CANOPY'}</span>
                  </div>
                  
                  <h1 className={`text-4xl lg:text-5xl font-bold tracking-wider font-minecraft uppercase select-none ${
                    isDarkMode 
                      ? 'text-cyan-400 text-shadow-glow-cyan' 
                      : 'text-pink-500 text-shadow-glow-pink'
                  }`}>
                    {isDarkMode ? 'DEEPSLATE GRID' : 'SAKURA SHORES'}
                  </h1>

                  <p className={`text-xs font-sans font-light max-w-xl leading-relaxed ${
                    isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                  }`}>
                    {isDarkMode 
                      ? 'Deep within the underground deepslate matrix. Minecraft ores glow intensely under ancient stone vaults. Harness cybernetic extraction vectors, harvest glowing resources, and reinforce your base terminal.' 
                      : 'Wander beneath a shower of elegant cherry blossoms. The Sakura Canopy is safe, filled with light, fresh air, and delicate resources. Gather petals to craft high-fashion armor sets and cosmic jewelry.'}
                  </p>
                  
                  {/* Real-time Dynamic coordinates and Biome details */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 font-mono text-[10px] select-none pt-2">
                    <span className={`px-2.5 py-1 border rounded backdrop-blur-md ${
                      isDarkMode 
                        ? 'bg-zinc-950/60 border-cyan-500/20 text-cyan-400' 
                        : 'bg-white/60 border-pink-300/30 text-pink-500'
                    }`}>
                      📍 X: <span className="font-bold">432</span> Y: <span className="font-bold">{isDarkMode ? '-58' : '72'}</span> Z: <span className="font-bold">1024</span>
                    </span>
                    <span className={`px-2.5 py-1 border rounded backdrop-blur-md ${
                      isDarkMode 
                        ? 'bg-zinc-950/60 border-cyan-500/20 text-cyan-400' 
                        : 'bg-white/60 border-pink-300/30 text-pink-500'
                    }`}>
                      💎 MULTIPLIER: <span className="font-bold">2.5x</span>
                    </span>
                    <span className={`px-2.5 py-1 border rounded backdrop-blur-md ${
                      isDarkMode 
                        ? 'bg-zinc-950/60 border-cyan-500/20 text-cyan-400' 
                        : 'bg-white/60 border-pink-300/30 text-pink-500'
                    }`}>
                      🌀 TPS: <span className="font-bold text-emerald-400">20.0</span>
                    </span>
                  </div>
                </div>

                {/* Cyber block design */}
                <div className="w-36 h-36 md:w-44 md:h-44 flex-shrink-0 relative group select-none">
                  <div className={`w-full h-full relative border-4 rounded-3xl [image-rendering:pixelated] overflow-hidden flex items-center justify-center transition-all duration-700 ${
                    isDarkMode 
                      ? 'border-[#1a2128] bg-[#0f1318] shadow-[0_0_30px_rgba(34,211,238,0.2)]' 
                      : 'border-pink-300 bg-pink-100 shadow-[0_0_25px_rgba(244,114,182,0.25)]'
                  }`}>
                    {/* Floating server logo */}
                    <img 
                      src="https://api.mcsrvstat.us/icon/ineffable.mc-play.org" 
                      alt="Server Icon"
                      className="w-20 h-20 md:w-28 md:h-28 [image-rendering:pixelated] drop-shadow-2xl animate-float-slow z-10"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=150";
                      }}
                      referrerPolicy="no-referrer"
                    />
                    {/* Visual Grass top border styled blocky */}
                    {isDarkMode ? (
                      <div className="absolute top-0 left-0 w-full h-4 bg-cyan-950/60 border-b-2 border-cyan-500/30 backdrop-blur-sm" />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-4 bg-pink-400/80 border-b-2 border-pink-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE ORE EXTRACTION / SAKURA HARVEST GRID */}
            <div 
              id="mining-outer-container"
              className={`border-2 rounded-3xl p-6 lg:p-8 space-y-6 transition-all duration-700 relative overflow-hidden ${
                isDarkMode 
                  ? 'border-cyan-500/20 bg-zinc-950/20 shadow-[0_0_50px_rgba(34,211,238,0.1)] backdrop-blur-xl' 
                  : 'border-pink-300/20 bg-white/40 shadow-[0_0_40px_rgba(244,114,182,0.1)] backdrop-blur-md'
              }`}
            >
              
              {/* Floating particles clicked by user */}
              <AnimatePresence>
                {miningFeed.map((feed) => (
                  <motion.div
                    key={feed.id}
                    initial={{ opacity: 0, y: feed.y, x: feed.x, scale: 0.8 }}
                    animate={{ opacity: 1, y: feed.y - 45, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`absolute font-minecraft text-[10px] z-50 pointer-events-none font-bold ${feed.color}`}
                  >
                    {feed.text}
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800/20 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Trophy className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-pink-500'}`} />
                    <h3 className={`font-minecraft text-xs tracking-widest ${isDarkMode ? 'text-cyan-400' : 'text-pink-500'}`}>
                      {isDarkMode ? 'COSMIC ORE EXTRACTION TERMINAL' : 'SAKURA HARVEST REGISTRY'}
                    </h3>
                  </div>
                  <p className="text-[10px] text-zinc-500 font-sans mt-1">
                    {isDarkMode 
                      ? 'Click on the glowing deepslate ores below to extract resources and load them directly into your cyber transceiver.' 
                      : 'Gather beautiful sakura petals and enchant them into cosmic clothing. Click the cherry blossom foliage to harvest petals!'}
                  </p>
                </div>

                {/* Resource Inventory */}
                <div className={`p-3 border rounded-2xl flex flex-wrap gap-4 font-mono text-[10px] ${
                  isDarkMode ? 'bg-zinc-950/80 border-cyan-500/20' : 'bg-white/80 border-pink-200'
                }`}>
                  <span className="text-zinc-500 border-r border-zinc-800/10 pr-2 block select-none">INVENTORY:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sky-400 font-bold">💎 {inventory.diamonds}</span>
                    <span className="text-zinc-500 text-[8px]">DIAMOND</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-red-500 font-bold">🔴 {inventory.redstone}</span>
                    <span className="text-zinc-500 text-[8px]">REDSTONE</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-emerald-400 font-bold">💚 {inventory.emeralds}</span>
                    <span className="text-zinc-500 text-[8px]">EMERALD</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-pink-400 font-bold">🌸 {inventory.sakuraPetals}</span>
                    <span className="text-zinc-500 text-[8px]">PETAL</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-amber-400 font-bold">🪙 {inventory.gold}</span>
                    <span className="text-zinc-500 text-[8px]">GOLD</span>
                  </div>
                </div>
              </div>

              {/* Ore / Canopy Main Playground */}
              {isDarkMode ? (
                /* DARK MODE CAVE PLAYGROUND (GLOWING ORES) */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-2">
                  {[
                    { key: 'diamonds', label: 'DIAMOND ORE', color: 'text-sky-400', glow: 'shadow-[0_0_20px_rgba(56,189,248,0.3)] border-sky-500/30 hover:border-sky-400 bg-sky-950/10', icon: '💎', floatColor: 'text-sky-400 text-shadow-glow-cyan', text: '+1 DIAMOND' },
                    { key: 'redstone', label: 'REDSTONE ORE', color: 'text-red-500', glow: 'shadow-[0_0_25px_rgba(239,68,68,0.3)] border-red-500/30 hover:border-red-400 bg-red-950/10', icon: '🔴', floatColor: 'text-red-500 text-shadow-glow-cyan', text: '+4 REDSTONE' },
                    { key: 'emeralds', label: 'EMERALD ORE', color: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)] border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/10', icon: '💚', floatColor: 'text-emerald-400 text-shadow-glow-emerald', text: '+1 EMERALD' },
                    { key: 'lapis', label: 'LAPIS LAZULI', color: 'text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500/30 hover:border-blue-400 bg-blue-950/10', icon: '🌀', floatColor: 'text-blue-400 text-shadow-glow-cyan', text: '+3 LAPIS' },
                    { key: 'gold', label: 'GOLD ORE', color: 'text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)] border-amber-500/30 hover:border-amber-400 bg-amber-950/10', icon: '🪙', floatColor: 'text-amber-400 text-shadow-glow-cyan', text: '+1 GOLD' },
                    { key: 'sakuraPetals', label: 'NETHERITE SCRAP', color: 'text-purple-400', glow: 'shadow-[0_0_25px_rgba(168,85,247,0.3)] border-purple-500/30 hover:border-purple-400 bg-purple-950/10', icon: '🌋', floatColor: 'text-purple-400 text-shadow-glow-pink', text: '+1 SAKURA PETAL' },
                  ].map((ore) => (
                    <button
                      key={ore.key}
                      onClick={(e) => handleMine(ore.key, ore.text, ore.floatColor, e)}
                      className={`h-36 rounded-2xl border flex flex-col justify-between p-4 relative group cursor-pointer transition-all duration-300 ${ore.glow}`}
                    >
                      {/* Pixelated core texture backing */}
                      <div className="absolute inset-0.5 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] bg-[size:4px_4px] rounded-xl pointer-events-none" />
                      
                      {/* Floating glow aura in back */}
                      <div className="absolute inset-4 bg-current opacity-5 blur-2xl group-hover:scale-125 transition-transform" />

                      <div className="flex items-center justify-between w-full relative z-10">
                        <span className="text-[7px] font-minecraft opacity-60">MC-ORE</span>
                        <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      </div>

                      <div className="text-3xl text-center select-none transform group-hover:scale-110 group-active:scale-95 transition-all relative z-10">
                        {ore.icon}
                      </div>

                      <div className="w-full relative z-10 text-left">
                        <h4 className="font-minecraft text-[8px] leading-tight tracking-wider text-zinc-100 group-hover:text-cyan-400 transition-colors">
                          {ore.label}
                        </h4>
                        <span className="text-[7px] font-mono text-zinc-500 block mt-1">TAP TO EXTRACT</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                /* LIGHT MODE CHERRY BLOSSOM CANOPY PLAYGROUND */
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-2">
                  {/* Cherry blossom tree Canopy clicker */}
                  <div className="md:col-span-6 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#f472b610_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                    
                    <div className="space-y-2 relative z-10">
                      <span className="text-[9px] font-minecraft text-pink-600 block uppercase">Foliage Canopy</span>
                      <h4 className="font-minecraft text-sm text-pink-700 tracking-wide">
                        CHERRY BLOSSOM CANOPY
                      </h4>
                      <p className="text-[11px] text-pink-900/80 font-sans leading-relaxed">
                        The cherry tree blossoms are in full bloom. Gently shake or click the canopy block below to release floating sakura petals!
                      </p>
                    </div>

                    <div className="my-6 flex justify-center relative z-10">
                      <button
                        onClick={(e) => {
                          setInventory(prev => ({ ...prev, sakuraPetals: prev.sakuraPetals + 1 }));
                          // Add relative floating text relative to the parent-most container
                          const outerContainer = document.getElementById('mining-outer-container');
                          const containerRect = outerContainer?.getBoundingClientRect();
                          const x = e.clientX - (containerRect?.left ?? 0);
                          const y = e.clientY - (containerRect?.top ?? 0) - 15;
                          setMiningFeed(prev => [...prev, {
                            id: Date.now() + Math.random(),
                            text: '🌸 +1 PETAL',
                            x,
                            y,
                            color: 'text-pink-500 text-shadow-glow-pink'
                          }]);
                        }}
                        className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 border-4 border-pink-600 text-3xl flex items-center justify-center select-none shadow-lg shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        title="Shake Canopy"
                      >
                        🌸
                      </button>
                    </div>

                    <span className="text-[8px] font-minecraft text-pink-600/70 text-center block">
                      CLICK CANOPY TO SHAKE LOOSE PETALS
                    </span>
                  </div>

                  {/* Sakura Cosmetic Crafting Panel */}
                  <div className="md:col-span-6 flex flex-col justify-between p-6 rounded-2xl bg-white border border-pink-200 shadow-lg relative">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-pink-500" />
                        <h4 className="font-minecraft text-xs text-zinc-800 uppercase tracking-widest">
                          SAKURA COSMETIC SYNTHESIZER
                        </h4>
                      </div>

                      <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                        Combine your harvested sakura petals with gold and diamonds to craft celestial gear items.
                      </p>

                      <div className="space-y-3 pt-1">
                        {[
                          { id: 'crown', label: 'SAKURA QUEEN CROWN', cost: '10 Petals, 3 Gold', item: '👑', req: { sakuraPetals: 10, gold: 3 } },
                          { id: 'wand', label: 'CHERRY ENCHANTED WAND', cost: '15 Petals, 2 Diamonds', item: '🪄', req: { sakuraPetals: 15, diamonds: 2 } },
                          { id: 'shield', label: 'CHERRY GLOWING SHIELD', cost: '5 Petals, 1 Emerald', item: '🛡️', req: { sakuraPetals: 5, emeralds: 1 } }
                        ].map((recipe) => {
                          const hasSakura = inventory.sakuraPetals >= (recipe.req.sakuraPetals ?? 0);
                          const hasGold = !recipe.req.gold || inventory.gold >= recipe.req.gold;
                          const hasDiamonds = !recipe.req.diamonds || inventory.diamonds >= recipe.req.diamonds;
                          const hasEmeralds = !recipe.req.emeralds || inventory.emeralds >= recipe.req.emeralds;
                          const canCraft = hasSakura && hasGold && hasDiamonds && hasEmeralds;
                          const isCrafted = craftedItems.includes(recipe.id);

                          return (
                            <div 
                              key={recipe.id}
                              className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-xl select-none">{recipe.item}</span>
                                <div>
                                  <span className="text-[9px] font-minecraft text-zinc-700 block">{recipe.label}</span>
                                  <span className="text-[8px] font-mono text-zinc-500">COST: {recipe.cost}</span>
                                </div>
                              </div>

                              <button
                                disabled={isCrafted || !canCraft}
                                onClick={() => {
                                  // Deduct requirements
                                  setInventory(prev => ({
                                    ...prev,
                                    sakuraPetals: prev.sakuraPetals - (recipe.req.sakuraPetals ?? 0),
                                    gold: prev.gold - (recipe.req.gold ?? 0),
                                    diamonds: prev.diamonds - (recipe.req.diamonds ?? 0),
                                    emeralds: prev.emeralds - (recipe.req.emeralds ?? 0),
                                  }));
                                  setCraftedItems(prev => [...prev, recipe.id]);
                                }}
                                className={`px-3 py-1.5 font-minecraft text-[8px] rounded border-b-2 transition-all cursor-pointer ${
                                  isCrafted
                                    ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed border-b-0'
                                    : canCraft
                                      ? 'bg-pink-500 border-pink-600 text-white hover:bg-pink-600'
                                      : 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed border-b-0'
                                }`}
                              >
                                {isCrafted ? 'SYNTHESIZED' : 'SYNTHESIZE'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {craftedItems.length > 0 && (
                      <div className="mt-4 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2">
                        <span className="text-emerald-500 font-bold font-minecraft text-[8px]">⭐ CRAFTED:</span>
                        <div className="flex items-center space-x-1.5 font-minecraft text-[8px] text-emerald-800">
                          {craftedItems.map(item => (
                            <span key={item} className="uppercase bg-emerald-100/50 px-1.5 py-0.5 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Connection Info & Voxel terminal */}
            <div className={`border-4 rounded-3xl overflow-hidden transition-all duration-700 p-1 relative ${
              isDarkMode ? 'border-cyan-500/20 bg-zinc-950/80 shadow-[0_0_40px_rgba(34,211,238,0.15)]' : 'border-pink-300 bg-white/40 shadow-[0_0_30px_rgba(244,114,182,0.15)]'
            }`}>
              {/* Retro digital matrix grid lines in back */}
              <div className={`absolute inset-0 pointer-events-none opacity-[0.03] ${isDarkMode ? 'bg-zinc-100' : 'bg-pink-500'}`} style={{ backgroundImage: 'linear-gradient(0deg, currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
              
              <MinecraftStatusWidget isDarkMode={isDarkMode} activeAtmosphere={activeAtmosphere} />
            </div>

          </motion.div>
        )}

        {/* ROBLOX VIEW */}
        {selectedGame === 'roblox' && (
          <motion.div
            key="roblox-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`border ${activeAtmosphere.borderMuted} ${activeAtmosphere.bgCard} rounded-3xl p-8 space-y-8`}
          >
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-6`}>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[9px] text-rose-400 uppercase font-mono tracking-wider">INEFFABLE EXPERIENCE NODE</span>
                <h2 className={`font-mono text-2xl tracking-widest ${activeAtmosphere.textPrimary} font-bold`}>
                  ROBLOX FASHION SANCTUARY
                </h2>
              </div>
              <div className={`flex items-center space-x-3 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'} p-2 border rounded-xl shadow-sm`}>
                <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center font-bold text-black font-mono">
                  R$
                </div>
                <div className="flex flex-col pr-2">
                  <span className={`text-[8px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>YOUR METAVERSE ROBUX</span>
                  <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{robloxRobux}</span>
                </div>
                <button 
                  onClick={() => setRobloxRobux(prev => prev + 100)}
                  className={`p-1.5 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-amber-50 border-amber-200 hover:border-amber-300'} text-amber-500 text-[10px] font-mono rounded cursor-pointer border`}
                >
                  +100
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <h3 className={`font-mono text-xs uppercase ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Custom Skin Configurator</h3>
                <p className={`${activeAtmosphere.textSecondary} text-xs font-sans leading-relaxed`}>
                  Configure exclusive high-end cyberpunk garments directly on your Roblox avatar template. Export texture shaders or copy direct experience IDs.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { id: 'classic', label: 'Classic Robux Hoodie', price: 'Free' },
                    { id: 'cyber_punk', label: 'Ineffable Mech Cloak', price: '500 R$' },
                    { id: 'voxel_couture', label: 'Neon Pixel Shell', price: '1200 R$' }
                  ].map((skin) => (
                    <button
                      key={skin.id}
                      onClick={() => setRobloxSkins(skin.id as any)}
                      className={`p-3.5 border rounded-xl text-left flex flex-col justify-between h-28 cursor-pointer transition-all ${
                        robloxSkins === skin.id 
                          ? 'border-rose-500/40 bg-rose-500/10 text-rose-500 font-bold shadow-[0_0_15px_rgba(244,114,182,0.15)]' 
                          : `${isDarkMode ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 text-zinc-400' : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'}`
                      }`}
                    >
                      <span className="text-[10px] font-bold tracking-wider">{skin.label}</span>
                      <span className="text-[9px] font-mono text-zinc-500">{skin.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center items-center">
                <div className={`w-full max-w-sm ${isDarkMode ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'} border rounded-2xl p-6 text-center space-y-4 shadow-sm`}>
                  <div className={`aspect-square w-24 mx-auto rounded-2xl ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-rose-50 border-rose-100'} border flex items-center justify-center text-4xl select-none`}>
                    {robloxSkins === 'classic' ? '🧥' : robloxSkins === 'cyber_punk' ? '🧛' : '💠'}
                  </div>
                  <div>
                    <span className={`text-[9px] uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} block`}>SELECTED AVATAR WRAPPER</span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'} uppercase font-mono block mt-1`}>{robloxSkins.replace('_', ' ')}</span>
                  </div>
                  <button className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                    DEPLOY TO ROBLOX PORTAL
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AMONG US VIEW */}
        {selectedGame === 'amongus' && (
          <motion.div
            key="amongus-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`border ${activeAtmosphere.borderMuted} ${activeAtmosphere.bgCard} rounded-3xl p-8 space-y-8`}
          >
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-6`}>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[9px] text-red-400 uppercase font-mono tracking-wider">SKELD REACTOR TERMINAL</span>
                <h2 className={`font-mono text-2xl tracking-widest ${activeAtmosphere.textPrimary} font-bold`}>
                  AMONG US REACTOR CONTROLLER
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest">REACTOR THREAT STATUS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`space-y-4 p-5 ${isDarkMode ? 'bg-zinc-950/50 border-zinc-900' : 'bg-white/80 border-zinc-200'} border rounded-2xl flex flex-col justify-between shadow-sm`}>
                <div className="space-y-3">
                  <h3 className={`font-mono text-xs uppercase ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Reactor Core Diagnostics</h3>
                  <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} text-[11px] leading-relaxed`}>
                    Audit real-time spaceship parameters. Click the emergency action terminal to simulate network alert states.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className={`p-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-xl`}>
                      <span className="text-[8px] text-zinc-500 block">CREWMATE RATIO</span>
                      <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>{crewCount} / 10 INTACT</span>
                    </div>
                    <div className={`p-3 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} border rounded-xl`}>
                      <span className="text-[8px] text-zinc-500 block">DIAGNOSTIC STATUS</span>
                      <span className={`text-xs font-mono font-bold uppercase ${amongUsStatus === 'safe' ? 'text-emerald-400' : 'text-red-500 animate-pulse'}`}>
                        {amongUsStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button 
                    onClick={() => {
                      setAmongUsStatus('impostor_alert');
                      setCrewCount(c => Math.max(1, c - 1));
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] uppercase font-bold tracking-wider rounded-xl cursor-pointer"
                  >
                    🚨 IMPOSTOR ALARM
                  </button>
                  <button 
                    onClick={() => {
                      setAmongUsStatus('safe');
                      setCrewCount(10);
                    }}
                    className={`px-4 py-2.5 ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300' : 'bg-zinc-100 border-zinc-300 hover:border-zinc-400 text-zinc-700'} font-mono text-[9px] uppercase font-bold rounded-xl cursor-pointer border`}
                  >
                    RESET
                  </button>
                </div>
              </div>

              {/* Big Emergency Button */}
              <div className={`flex flex-col items-center justify-center p-8 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white/80 border-zinc-200'} border rounded-2xl relative overflow-hidden group shadow-sm`}>
                <div className="absolute inset-0 bg-red-600/[0.02] group-hover:bg-red-600/[0.04] transition-all" />
                <button 
                  onClick={() => setAmongUsStatus(p => p === 'safe' ? 'sabotage' : 'safe')}
                  className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] border-4 border-red-800 flex items-center justify-center text-white font-mono font-extrabold text-xs text-center p-3 cursor-pointer"
                >
                  EMERGENCY BUTTON
                </button>
                <span className={`text-[8px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} mt-4 uppercase tracking-widest font-mono`}>
                  TAP TO CHANNELS ALERTER
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* MECHA CHAMELEON VIEW */}
        {selectedGame === 'mechachameleon' && (
          <motion.div
            key="chameleon-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`border ${activeAtmosphere.borderMuted} ${activeAtmosphere.bgCard} rounded-3xl p-8 space-y-8`}
          >
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-6`}>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[9px] text-amber-400 uppercase font-mono tracking-wider">BIO-STEALTH INTERFACE</span>
                <h2 className={`font-mono text-2xl tracking-widest ${activeAtmosphere.textPrimary} font-bold`}>
                  MECHA CHAMELEON SPECTRA
                </h2>
              </div>
              <span className={`text-[10px] font-mono ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>HEX CALIBRATION: <span className={`${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'} font-bold`}>{chameleonColor}</span></span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className={`font-mono text-xs uppercase ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Spectral Stealther Calibration</h3>
                <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} text-[11px] leading-relaxed`}>
                  Calibrate the camouflage matrix of your cybernetic chameleon module. Toggle color wavelengths below to blend into the grid environment.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {[
                    { hex: '#10b981', name: 'Emerald Forest' },
                    { hex: '#ec4899', name: 'Cyber Rose' },
                    { hex: '#f59e0b', name: 'Redstone Ember' },
                    { hex: '#3b82f6', name: 'Atmosphere Sky' },
                    { hex: '#8b5cf6', name: 'Obsidian Void' }
                  ].map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setChameleonColor(color.hex)}
                      className={`px-4 py-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-zinc-900'} font-mono text-[9px] uppercase font-bold rounded-xl flex items-center space-x-2 cursor-pointer transition-all border shadow-sm`}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Holographic Chameleon Render */}
              <div className="lg:col-span-5 flex justify-center">
                <div 
                  className="w-full max-w-sm rounded-2xl p-8 border-2 text-center space-y-4 transition-all duration-700 relative overflow-hidden"
                  style={{ 
                    borderColor: `${chameleonColor}30`, 
                    backgroundColor: `${chameleonColor}05` 
                  }}
                >
                  {/* Hologram visual glitch */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                  
                  <div 
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl transition-all duration-700 shadow-2xl"
                    style={{ 
                      backgroundColor: `${chameleonColor}20`,
                      boxShadow: `0 0 30px ${chameleonColor}25`
                    }}
                  >
                    🦎
                  </div>
                  <div>
                    <span className={`text-[8px] uppercase tracking-widest ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} block`}>STEALTH MATRIX MATCHED</span>
                    <span className="text-xs font-bold font-mono uppercase block mt-1" style={{ color: chameleonColor }}>
                      Camouflage Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* KRUNKER VIEW */}
        {selectedGame === 'krunker' && (
          <motion.div
            key="krunker-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`border ${activeAtmosphere.borderMuted} ${activeAtmosphere.bgCard} rounded-3xl p-8 space-y-8`}
          >
            <div className={`flex flex-col md:flex-row items-center justify-between gap-6 border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-6`}>
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[9px] text-sky-400 uppercase font-mono tracking-wider">TACTICAL ARENA INTERFACE</span>
                <h2 className={`font-mono text-2xl tracking-widest ${activeAtmosphere.textPrimary} font-bold`}>
                  KRUNKER VOXEL TERMINAL
                </h2>
              </div>
              <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'} px-3 py-1.5 rounded-lg text-[10px] border`}>
                <span>ACTIVE MATCHMAKING CLIENT</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-4">
                <h3 className={`font-mono text-xs uppercase ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>Class & Loadout customization</h3>
                <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} text-[11px] leading-relaxed`}>
                  Choose your voxel operative class and weapon wraps. Synchronize tactical loadouts directly to browser game instances.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    { id: 'Sniper Rifle', class: 'Hunter', skin: 'Voxel Cosmic' },
                    { id: 'Assault Rifle', class: 'Triggerman', skin: 'Redstone Camo' },
                    { id: 'Shotgun', class: 'Vince', skin: 'Monochrome Matte' }
                  ].map((weapon) => (
                    <button
                      key={weapon.id}
                      onClick={() => setKrunkerWeapon(weapon.id)}
                      className={`p-4 border rounded-xl text-left flex flex-col justify-between h-24 cursor-pointer transition-all ${
                        krunkerWeapon === weapon.id 
                          ? 'border-sky-500/40 bg-sky-500/10 text-sky-500 font-bold' 
                          : `${isDarkMode ? 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/20 text-zinc-400' : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'}`
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider">{weapon.class}</span>
                      <span className="text-[9px] text-zinc-500 font-sans mt-1">{weapon.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className={`w-full max-w-sm ${isDarkMode ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/80 border-zinc-200'} border rounded-2xl p-6 text-center space-y-4 shadow-sm`}>
                  <div className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-sky-500/10 border-sky-500/30' : 'bg-sky-50 border-sky-100'} border flex items-center justify-center text-sky-500 text-xl mx-auto`}>
                    🔫
                  </div>
                  <div>
                    <span className={`text-[8px] uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'} block`}>CURRENT TACTICAL SELECTION</span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'} uppercase font-mono block mt-1`}>{krunkerWeapon}</span>
                  </div>
                  <button className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                    DEPLOY TO LIVE TERMINAL
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
