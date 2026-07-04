import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Copy, Check, Gamepad2, Users, Terminal, Activity, Layers, Cpu } from 'lucide-react';

interface MinecraftStatus {
  online: boolean;
  ip: string;
  players: {
    online: number;
    max: number;
    list: string[];
  };
  version: string;
  motd: string[];
  hostname: string;
  port: number;
  isFallback?: boolean;
}

interface MinecraftStatusWidgetProps {
  isDarkMode: boolean;
  activeAtmosphere: {
    colorTheme: string;
    accentText: string;
    borderMuted: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
  };
}

export function MinecraftStatusWidget({ isDarkMode, activeAtmosphere }: MinecraftStatusWidgetProps) {
  const [status, setStatus] = useState<MinecraftStatus | null>(null);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeBlocks, setActiveBlocks] = useState<Record<string, boolean>>({
    '0-0': true, '1-2': true, '2-1': true, '3-3': true, '4-0': true, '5-2': true
  });
  const [redstoneState, setRedstoneState] = useState(true);

  // Fetch server status from local simulation
  useEffect(() => {
    const fetchStatus = () => {
      const mockStatus: MinecraftStatus = {
        online: true,
        ip: 'ineffable.mc-play.org',
        players: {
          online: 18,
          max: 100,
          list: ['Kavyansh', 'Ineffable_Dev', 'Notch_Cyber', 'Xero_G', 'Zenith_A', 'NovaFlow']
        },
        version: '1.20.4',
        motd: ['§d§lINEFFABLE§r §7// §bDIGITAL EXPERIENCE', '§e[OFFICIAL LAUNCH] §fJoin our physical-virtual convergence!'],
        hostname: 'ineffable.mc-play.org',
        port: 25565,
        isFallback: false
      };
      setStatus(mockStatus);
      setLoading(false);
    };

    fetchStatus();
    const interval = setInterval(() => {
      setStatus(prev => {
        if (!prev) return null;
        const change = Math.random() > 0.5 ? 1 : -1;
        const nextOnline = Math.max(10, Math.min(80, prev.players.online + change));
        return {
          ...prev,
          players: {
            ...prev.players,
            online: nextOnline
          }
        };
      });
    }, 15000); // Fluctuate player count slightly every 15s
    return () => clearInterval(interval);
  }, []);

  // Copy IP handler
  const handleCopyIP = () => {
    navigator.clipboard.writeText('ineffable.mc-play.org');
    setCopied(true);
    setShowToast(true);
  };

  // Auto dismiss toast
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setCopied(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Redstone sound / block toggle simulation
  const handleBlockClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setActiveBlocks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    // Toggle overall redstone state to cause visual flutter
    setRedstoneState(p => !p);
  };

  // Aesthetic theme overrides for Minecraft feel
  const mcGreen = isDarkMode ? 'text-emerald-400 border-emerald-950/40 bg-emerald-950/10' : 'text-emerald-600 border-emerald-200 bg-emerald-50';
  const mcRed = 'text-rose-500 border-rose-950/40 bg-rose-950/10';

  return (
    <div className={`w-full font-mono text-xs border ${activeAtmosphere.borderMuted} rounded-2xl overflow-hidden ${activeAtmosphere.bgCard} shadow-2xl relative transition-all duration-700`}>
      
      {/* Subtle toast notification banner */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-4 right-4 z-50 flex items-center space-x-3 bg-zinc-950/95 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl shadow-emerald-950/40 backdrop-blur-md"
        >
          <div className="flex h-5 w-5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg items-center justify-center">
            <Check className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-100 tracking-wider">REGISTRY UPDATED</span>
            <span className="text-[9px] text-emerald-400 font-mono">ineffable.mc-play.org copied!</span>
          </div>
        </motion.div>
      )}

      {/* Visual cyber mesh pattern backing */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Grid Layout: Controls / Info & Minecraft Voxel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-8 relative z-10">
        
        {/* Left Column: Server Coordinates & Direct Connect */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative shrink-0">
                <img 
                  src="https://api.mcsrvstat.us/icon/ineffable.mc-play.org" 
                  alt="Server Icon" 
                  className="w-12 h-12 rounded-xl border border-emerald-500/30 bg-zinc-950 p-1 [image-rendering:pixelated] shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=150";
                  }}
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-zinc-950"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">Ineffable Multiplayer Node</span>
                <h3 className={`text-sm tracking-[0.3em] font-bold ${activeAtmosphere.textPrimary} uppercase`}>
                  INEFFABLE SANDBOX GRID
                </h3>
              </div>
            </div>

            <p className={`${activeAtmosphere.textSecondary} text-[11px] leading-relaxed max-w-xl font-sans font-light`}>
              Synchronize your client directly to our high-frequency anarchy voxel grid. Gather resources, establish modular shelters, and deploy decentralized cyber outposts beside the community.
            </p>

            {/* Live stats feed */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className={`p-3 border ${activeAtmosphere.borderMuted} rounded-xl bg-zinc-950/5`}>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider">VERSION CAPABILITY</span>
                <span className={`text-xs font-bold ${activeAtmosphere.textPrimary} tracking-tight`}>
                  {loading ? 'SYNCING...' : status?.version || '1.20 - 1.21.x'}
                </span>
              </div>
              <div className={`p-3 border ${activeAtmosphere.borderMuted} rounded-xl bg-zinc-950/5`}>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider">NETWORK LATENCY</span>
                <span className={`text-xs font-bold text-emerald-500 flex items-center space-x-1`}>
                  <Activity className="w-3.5 h-3.5 inline mr-1 animate-pulse" />
                  <span>14 MS</span>
                </span>
              </div>
              <div className={`p-3 border ${activeAtmosphere.borderMuted} rounded-xl bg-zinc-950/5 col-span-2 md:col-span-1`}>
                <span className="text-[8px] text-zinc-500 block uppercase tracking-wider">GRID DENSITY</span>
                <span className={`text-xs font-bold ${activeAtmosphere.textPrimary} flex items-center space-x-1`}>
                  <Users className="w-3.5 h-3.5 inline mr-1 text-zinc-400" />
                  <span>{loading ? '...' : `${status?.players.online || 0} / ${status?.players.max || 150}`} ONLINE</span>
                </span>
              </div>
            </div>
          </div>

          {/* Minecraft Direct IP Link block */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className={`flex-1 flex items-center justify-between p-3.5 ${isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white/60 border-zinc-200'} border rounded-xl relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-emerald-500/[0.01] group-hover:bg-emerald-500/[0.03] transition-all duration-300" />
                <div className="flex items-center space-x-3 z-10">
                  <Gamepad2 className="w-4 h-4 text-emerald-500" />
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-500 uppercase tracking-widest">MINECRAFT SERVER ADDRESS</span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} tracking-wider`}>ineffable.mc-play.org</span>
                  </div>
                </div>
                
                {/* Live copy toggle button */}
                <button 
                  onClick={handleCopyIP}
                  className={`p-2 border rounded-lg transition-all duration-300 cursor-pointer ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-emerald-950/30 hover:text-emerald-400 hover:border-emerald-900/50' 
                      : 'bg-zinc-100 border-zinc-300 text-zinc-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                  }`}
                  title="Copy IP Address"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                onClick={handleCopyIP}
                className="px-5 py-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-950/25 flex items-center justify-center space-x-2"
              >
                <span>COPY SECURE IP</span>
              </button>
            </div>
            
            {copied && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] text-emerald-500 flex items-center space-x-1.5"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>COORDINATES SAVED TO TRANSCEIVER REGISTRY! OPEN MINECRAFT CLIENT AND CONNECT DIRECTLY.</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Minecraft Redstone & Block grid sandbox */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">interactive redstone grid</span>
              </div>
              <span className={`text-[8px] px-2 py-0.5 border ${redstoneState ? 'text-rose-400 border-rose-950/55 bg-rose-950/10' : 'text-zinc-500 border-zinc-800 bg-zinc-900/10'} rounded-full uppercase tracking-wider`}>
                {redstoneState ? 'REDSTONE PULSE: ACTIVE' : 'REDSTONE COLD'}
              </span>
            </div>

            {/* Custom Interactive Grid resembling Minecraft hotbar/block pattern */}
            <div className={`grid grid-cols-6 gap-2 p-3 ${isDarkMode ? 'bg-zinc-950/60 border-zinc-900' : 'bg-white/60 border-zinc-200'} border rounded-xl relative`}>
              {Array.from({ length: 24 }).map((_, idx) => {
                const row = Math.floor(idx / 6);
                const col = idx % 6;
                const key = `${row}-${col}`;
                const isActive = activeBlocks[key];
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleBlockClick(row, col)}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center relative group transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.15)] text-emerald-400' 
                        : isDarkMode 
                          ? 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-700 text-zinc-600 hover:text-zinc-400' 
                          : 'bg-zinc-100 border-zinc-200 hover:border-zinc-300 text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    {/* Visual pattern overlay for classic voxel texture */}
                    <div className="absolute inset-0.5 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] bg-[size:3px_3px] pointer-events-none rounded" />
                    
                    {/* Retro corner ticks */}
                    <span className={`absolute top-0.5 left-0.5 w-1 h-1 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-transparent'}`} />

                    {/* Miniature pixel coordinate label */}
                    <span className="text-[7px] font-mono opacity-50 select-none group-hover:scale-105 transition-transform">
                      {row},{col}
                    </span>
                  </button>
                );
              })}
            </div>
            
            <span className="text-[8px] text-zinc-500 leading-relaxed block">
              💡 <span className="text-zinc-400">Voxel Interaction Sandbox:</span> Toggle the grid terminals above to dynamically channel digital redstone power vectors throughout the server lobby.
            </span>
          </div>

          {/* Player roster feed when online */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase text-zinc-500 tracking-widest block">Active Roster Stream</span>
            <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto pr-1">
              {loading ? (
                <span className="text-zinc-600 text-[9px] uppercase">Retrieving operative registry...</span>
              ) : status?.players.list && status.players.list.length > 0 ? (
                status.players.list.map((player) => (
                  <span 
                    key={player}
                    className={`px-2 py-0.5 border text-[8px] rounded uppercase font-mono tracking-wider hover:text-emerald-400 hover:border-emerald-900 transition-colors ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    👤 {player}
                  </span>
                ))
              ) : (
                ['KavyanshShakya', 'Ineffable_Operative', 'cyber_fleur', 'VoxelSovereign', 'brutalist_builder'].map((player) => (
                  <span 
                    key={player}
                    className={`px-2 py-0.5 border text-[8px] rounded uppercase font-mono tracking-wider hover:text-emerald-400 hover:border-emerald-900 transition-colors ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'
                    }`}
                  >
                    👤 {player}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
