/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Server, Users, RefreshCw, Copy, Check } from 'lucide-react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';

interface MinecraftStatusWidgetProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
}

export const MinecraftStatusWidget: React.FC<MinecraftStatusWidgetProps> = ({
  activeAtmosphere,
  isDarkMode
}) => {
  const [copied, setCopied] = useState(false);
  const [onlinePlayers, setOnlinePlayers] = useState(42);
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const serverIp = 'play.ineffable-network.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(35 + Math.floor(Math.random() * 20));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl shadow-xl space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-zinc-950 dark:text-white uppercase">
              MC SURVIVAL
            </h4>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE // VER 1.20.4</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
          <Users className="w-3.5 h-3.5" />
          <span>{onlinePlayers} / 100</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-black/20 border border-white/10 font-mono text-xs">
        <span className="text-zinc-400 select-all">{serverIp}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white transition-colors cursor-pointer"
          title="Copy IP"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
