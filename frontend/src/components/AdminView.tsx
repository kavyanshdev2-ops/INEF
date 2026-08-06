/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig, PageId } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Shield, Users, ShoppingBag, Settings, Save, Check, Terminal, Database } from 'lucide-react';
import { getWebsiteSettings, saveWebsiteSettings } from '../lib/supabase';

interface AdminViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser?: any;
  setCurrentPage: (page: PageId) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  currentUser,
  setCurrentPage
}) => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'INEFFABLE',
    announcement: 'Mystical Tier Ranks are now active across all nodes.',
    maintenanceMode: false
  });

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveWebsiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-28 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] text-rose-500 font-bold uppercase block">
            ADMINISTRATOR CONTROL MATRIX
          </span>
          <h1 className="text-3xl font-display font-bold text-zinc-950 dark:text-white uppercase">
            SYSTEM MANAGEMENT PORTAL
          </h1>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-bold">
          <Shield className="w-4 h-4" />
          <span>VERIFIED ACCESS // {currentUser || 'ADMIN'}</span>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl`}>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">ACTIVE COMMUNITY USERS</span>
          <span className="text-3xl font-mono font-bold text-rose-400 mt-2 block">1,482</span>
        </div>
        <div className={`p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl`}>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">MONTHLY ACQUISITIONS</span>
          <span className="text-3xl font-mono font-bold text-emerald-400 mt-2 block">$14,290</span>
        </div>
        <div className={`p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl`}>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">NODE HEALTH</span>
          <span className="text-3xl font-mono font-bold text-sky-400 mt-2 block">99.98%</span>
        </div>
      </div>

      {/* Global Config Form */}
      <div className={`p-8 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl space-y-6`}>
        <div className="flex items-center space-x-3">
          <Settings className="w-5 h-5 text-rose-500" />
          <h3 className="font-display font-bold text-lg text-zinc-950 dark:text-white uppercase">
            GLOBAL NETWORK SETTINGS
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase block">SITE BRAND TITLE</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-black/20 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-600 dark:text-zinc-400 uppercase block">NETWORK ANNOUNCEMENT BANNER</label>
            <input
              type="text"
              value={settings.announcement}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-black/20 border border-zinc-300 dark:border-white/10 text-zinc-950 dark:text-white font-mono text-xs focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs tracking-widest font-bold rounded-2xl transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-rose-600/30"
          >
            {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'SETTINGS COMMITTED' : 'SAVE CONFIGURATION'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
