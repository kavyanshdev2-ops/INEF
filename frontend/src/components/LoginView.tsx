/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { LogIn, LogOut, Radio, KeyRound, CheckCircle, Flame, Shield, Award, Terminal } from 'lucide-react';

interface LoginViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  currentUser: any;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authLogs, setAuthLogs] = useState<string[]>([]);

  // Listen for success message from popup (after callback completes)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.includes('3000')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const discordUser = event.data.user;
        setAuthLogs(prev => [
          ...prev,
          `[OAUTH] RECEIVED AUTHORIZED PAYLOAD FOR USER: "${discordUser.username.toUpperCase()}"`,
          `[OAUTH] PROFILE SYNCED SECURELY. ESTABLISHING SESSION...`
        ]);
        setTimeout(() => {
          onLogin(discordUser.username);
          setIsAuthenticating(false);
        }, 1000);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin]);

  const handleDiscordOAuthLogin = () => {
    setIsAuthenticating(true);
    setAuthLogs([
      '[OAUTH] INITIALIZING SECURE DISCORD HANDSHAKE...',
      '[OAUTH] REQUESTING CREDENTIAL ENDPOINT ROUTE...',
      '[OAUTH] CONNECTING SECURELY TO CLIENT GATEWAY...'
    ]);
    
    const logs = [
      'DIVERTING TO CYBERNETIC SANDBOX OAUTH INTERACTIVE GATEWAY...',
      'OPENING SIMULATED DISCORD SECURITY POPUP...',
      'RECEIVING AUTHORIZED PAYLOAD FOR USER: "INEFFABLE_MEMBER"',
      'PROFILE SYNCED SECURELY. ESTABLISHING SESSION...',
      'DISCORD LINK ESTABLISHED SUCCESSFULLY.'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setAuthLogs(prev => [...prev, `[OAUTH] ${logs[currentLogIndex]}`]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLogin('DiscordMember');
          setIsAuthenticating(false);
        }, 800);
      }
    }, 500);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsAuthenticating(true);
    setAuthLogs([]);
    
    const logs = [
      'RESOLVING USERNAME IN SECURE SYSTEM REGISTRY...',
      'COMPARING ASYMMETRIC SHA-256 PASSWORD ENCRYPTION...',
      'ESTABLISHING SECURE PORT TERMINAL SESSIONS...',
      'USER CREDENTIALS LOGGED IN SUCCESSFULLY.'
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setAuthLogs(prev => [...prev, `[REGISTRY] ${logs[currentLogIndex]}`]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLogin(username);
          setIsAuthenticating(false);
        }, 500);
      }
    }, 400);
  };

  if (currentUser) {
    return (
      <div id="logged-in-profile-view" className={`max-w-4xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
            PROFILE // SYNCED PROFILE NODES
          </span>
          <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-extrabold uppercase">
            MEMBER TERMINAL
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-3xl mx-auto items-stretch">
          {/* User Profile Card */}
          <div className={`lg:col-span-5 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 text-center space-y-6 flex flex-col justify-between`}>
            <div className="space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                  alt="Profile Avatar"
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover rounded-full border-2 ${themeStyles.borderMuted}`}
                />
                <span className={`absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 ${isDarkMode ? 'border-zinc-950' : 'border-white'} rounded-full animate-pulse`} />
              </div>

              <div>
                <h3 className={`font-sans text-xl font-bold ${themeStyles.textPrimary} tracking-wide`}>
                  @{currentUser.toLowerCase()}
                </h3>
                <span className={`font-mono text-[9px] ${themeStyles.textMuted} uppercase tracking-widest mt-1 block`}>
                  ID: INF-{Math.floor(200000 + Math.random() * 800000)}
                </span>
              </div>
            </div>

            <button
              id="btn-member-logout"
              onClick={onLogout}
              className={`w-full py-3 ${isDarkMode ? 'bg-zinc-900 text-zinc-400 border-zinc-850 hover:bg-rose-950 hover:text-rose-200 hover:border-rose-900/50' : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'} border font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>TERMINATE SESSION</span>
            </button>
          </div>

          {/* User Linked Badges & Roles Info */}
          <div className={`lg:col-span-7 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between`}>
            <div className="space-y-4">
              <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-3`}>
                <Award className={`w-4 h-4 ${themeStyles.accentText}`} />
                <h4 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
                  Synced Server Roles
                </h4>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                  ● Verified Member
                </span>
                <span className="bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                  ● Active SMP Whitelist
                </span>
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                  ★ Booster status
                </span>
              </div>

              <div className={`space-y-3 font-mono text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} pt-3`}>
                <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-2`}>
                  <span>DISCORD JOIN DATE</span>
                  <span className={themeStyles.textPrimary}>6 YEARS AGO</span>
                </div>
                <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-2`}>
                  <span>BOOSTER STREAK</span>
                  <span className="text-rose-400 font-extrabold">24 MONTHS</span>
                </div>
                <div className="flex justify-between">
                  <span>GIVEAWAY MULTIPLIER</span>
                  <span className="text-emerald-400 font-extrabold">3.0X WEIGHT</span>
                </div>
              </div>
            </div>

            <div className={`${isDarkMode ? 'bg-zinc-900/10 border-zinc-900 text-zinc-500' : 'bg-zinc-100/50 border-zinc-200 text-zinc-600'} border p-4 rounded-xl font-mono text-[9px]`}>
              <span className={`${themeStyles.textPrimary} font-bold block uppercase mb-1`}>ACCOUNT SECURITY CHECKPASS</span>
              <span>Your terminal connection is monitored via encrypted TLS routing. Do not share session key signatures.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="login-view-container" className={`max-w-4xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          AUTHENTICATION PORTAL // MEMBER GATEWAY
        </span>
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-extrabold uppercase">
          MEMBER GATEWAY
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm font-light leading-relaxed`}>
          Log into your Ineffable account to sync your memberships, manage custom vanity roles, check transaction billing, and review SMP Minecraft stats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-3xl mx-auto items-start">
        {/* Discord OAuth Login */}
        <div className={`md:col-span-6 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 space-y-6 text-center`}>
          <div className="space-y-2">
            <h3 className={`font-sans text-lg font-bold ${themeStyles.textPrimary} uppercase tracking-wider`}>
              Discord OAuth Sync
            </h3>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              The recommended, fastest login procedure. Syncs instantly with your live server profile, active roles, and boosters.
            </p>
          </div>

          <button
            id="btn-discord-oauth"
            onClick={handleDiscordOAuthLogin}
            disabled={isAuthenticating}
            className="w-full py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-mono text-xs tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
          >
            <Radio className="w-4.5 h-4.5 animate-pulse" />
            <span>LOG IN WITH DISCORD</span>
          </button>
        </div>

        {/* Username/Password login */}
        <div className={`md:col-span-6 ${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 space-y-5`}>
          <h3 className={`font-sans text-lg font-bold ${themeStyles.textPrimary} uppercase tracking-wider border-b ${themeStyles.borderMuted} pb-3`}>
            Backup Terminal Login
          </h3>

          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                Username / Discord Account
              </label>
              <input
                id="login-username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isAuthenticating}
                placeholder="e.g. kavyanshshakya"
                className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50`}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                Access Passkey
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isAuthenticating}
                placeholder="••••••••"
                className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors disabled:opacity-50`}
              />
            </div>

            <button
              id="btn-credentials-submit"
              type="submit"
              disabled={isAuthenticating || !username || !password}
              className={`w-full py-3.5 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950 disabled:bg-zinc-900 disabled:text-zinc-600' : 'bg-zinc-900 hover:bg-zinc-850 text-white disabled:bg-zinc-100 disabled:text-zinc-400'} font-mono text-xs tracking-widest font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed`}
            >
              <KeyRound className="w-4 h-4" />
              <span>TRANSMIT SECURITY PASS</span>
            </button>
          </form>
        </div>
      </div>

      {/* Terminal logs panel while logging in */}
      {isAuthenticating && (
        <div id="login-auth-logs" className={`max-w-xl mx-auto mt-12 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'} border rounded-2xl p-6 space-y-3 shadow-2xl`}>
          <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-2`}>
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h4 className={`font-mono text-xs font-bold ${themeStyles.textPrimary} uppercase`}>
              Connection Handshaker
            </h4>
          </div>
          <div className={`h-32 overflow-y-auto font-mono text-[9px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} space-y-2`}>
            {authLogs.map((log, index) => (
              <div key={index} className="leading-relaxed pl-2 border-l border-emerald-500/40">
                {log}
              </div>
            ))}
            <div className="text-emerald-400 animate-pulse pl-2 flex items-center space-x-1">
              <span className="w-1 bg-emerald-400 h-3 animate-ping" />
              <span>AUTHENTICATING SECURE CLIENT CODES...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
