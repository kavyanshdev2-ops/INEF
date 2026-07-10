/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Menu, X, Sun, Moon, Radio, ExternalLink, ShoppingCart, Bell } from 'lucide-react';
import { LanguageTranslator } from './LanguageTranslator';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  cartCount: number;
  currentUser: any;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  activeAtmosphere,
  isDarkMode,
  onToggleDarkMode,
  cartCount,
  currentUser
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const isAdmin = currentUser?.toLowerCase() === 'kavyanshshakya' || currentUser?.toLowerCase() === 'admin';

  const menuItems = [
    { id: 'home' as PageId, label: 'HOME' },
    { id: 'gaming' as PageId, label: 'GAMING' },
    { id: 'membership' as PageId, label: 'MEMBERSHIP' },
    { id: 'shop' as PageId, label: 'SHOP' },
    { id: 'journals' as PageId, label: 'JOURNALS' },
    { id: 'contact' as PageId, label: 'CONTACT' },
    { id: 'cart' as PageId, label: 'CART' },
    { id: 'login' as PageId, label: 'LOGIN' },
    ...(isAdmin ? [{ id: 'admin' as PageId, label: 'ADMIN' }] : []),
  ];

  return (
    <nav 
      id="inefontop-navbar"
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 rounded-2xl border ${themeStyles.borderMuted} ${themeStyles.bgHeader} backdrop-blur-xl transition-all duration-300 shadow-xl`}
    >
      <div className="px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-3 group text-left cursor-pointer"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Spinning background decorative compass/radial */}
            <svg viewBox="0 0 100 100" className={`absolute w-8 h-8 ${themeStyles.accentText} opacity-30 animate-[spin_12s_linear_infinite]`} fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
              <path d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {/* Solid modern central logo mark */}
            <svg viewBox="0 0 100 100" className={`w-6 h-6 ${themeStyles.accentText} drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]`} fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" />
              <path d="M50 25 V75" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M35 50 H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="50" cy="50" r="4.5" fill="currentColor" />
            </svg>
          </div>
          <div>
            <h1 className={`font-mono text-sm tracking-[0.3em] ${themeStyles.textPrimary} leading-none ${themeStyles.groupTextHover} transition-colors`}>
              INEFFABLE
            </h1>
            <span className={`font-sans text-[10px] tracking-[0.25em] ${themeStyles.textSecondary} block mt-1`}>
              DIVISION
            </span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div id="desktop-menu-items" className="hidden xl:flex items-center space-x-1">
          {menuItems.filter(item => item.id !== 'cart').map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                id={`nav-item-${item.id}`}
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`relative px-4 py-2 font-mono text-xs tracking-[0.2em] transition-all duration-300 cursor-pointer flex items-center space-x-1.5 ${
                  isActive 
                    ? `${themeStyles.textPrimary} font-bold` 
                    : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
                }`}
              >
                {item.id === 'login' && currentUser ? (
                  <span className="text-emerald-400 font-extrabold uppercase">
                    PROFILE
                  </span>
                ) : (
                  <span>{item.label}</span>
                )}
                
                {isActive && (
                  <span 
                    id={`active-indicator-${item.id}`}
                    className={`absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-4 h-[2px] ${themeStyles.indicatorBg} rounded-full`} 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* System Info & Theme Switcher Cluster */}
        <div id="system-status-cluster" className="hidden xl:flex items-center space-y-0 space-x-2.5">
          {/* Custom Language Translator Dropdown */}
          <LanguageTranslator themeStyles={themeStyles} isDarkMode={isDarkMode} />

          <div className={`h-6 w-[1px] ${themeStyles.borderMuted} hidden lg:block`} />

          {/* Notification Icon Button - Placed beside Cart */}
          <button
            id="nav-notification-btn-desktop"
            className={`relative p-2.5 rounded-xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:border-zinc-500/50 transition-all cursor-pointer flex items-center justify-center shadow-sm shrink-0`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_6px_rgba(236,72,153,0.8)] animate-pulse" />
          </button>

          {/* Cart Icon Button - Positioned fixed/secured next to Join Server */}
          <button
            id="nav-cart-btn-desktop"
            onClick={() => setCurrentPage('cart')}
            className={`relative p-2.5 rounded-xl border ${currentPage === 'cart' ? `${themeStyles.borderHighlight} bg-rose-500/10 text-rose-400` : `${themeStyles.borderMuted} ${themeStyles.bgCard} ${themeStyles.textSecondary}`} hover:${themeStyles.textPrimary} hover:border-zinc-500/50 transition-all cursor-pointer flex items-center justify-center shadow-sm shrink-0`}
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-mono text-[8px] px-1.5 py-0.5 rounded-full font-extrabold shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <div className={`h-6 w-[1px] ${themeStyles.borderMuted} hidden lg:block`} />

          {/* Discord direct link button - styled like inef.cc but matching active theme, sized smaller */}
          <a
            href="https://discord.gg/ineffable"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-1.5 ${themeStyles.accentBg} ${themeStyles.accentBgHover} hover:shadow-[0_0_12px_rgba(255,255,255,0.12)] text-zinc-950 px-3.5 py-1.5 rounded-lg font-mono text-[9px] tracking-widest transition-all cursor-pointer border ${themeStyles.borderHighlight} shrink-0`}
          >
            <Radio className="w-3 h-3 text-zinc-950 animate-pulse" />
            <span className="font-extrabold">JOIN SERVER</span>
            <ExternalLink className="w-2 h-2 opacity-80 text-zinc-950" />
          </a>

          <div className={`h-6 w-[1px] ${themeStyles.borderMuted}`} />
          
          {/* Animated Light/Dark Mode Toggle Button */}
          <button
            id="desktop-theme-toggle"
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full border ${themeStyles.borderMuted} ${themeStyles.bgCard} hover:scale-105 active:scale-95 transition-all duration-500 cursor-pointer flex items-center justify-center shadow-sm shrink-0`}
            title={isDarkMode ? 'Transition to Light Atmosphere' : 'Transition to Dark Atmosphere'}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-500" />
              )}
            </div>
          </button>
        </div>

        {/* Mobile menu trigger and toggle */}
        <div className="xl:hidden flex items-center space-x-2.5">
          {/* Notification Icon Button - Sized nicely for Mobile/Tablet */}
          <button
            id="nav-notification-btn-mobile"
            className={`relative p-2 rounded-full border ${themeStyles.borderMuted} ${themeStyles.bgCard} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-all cursor-pointer flex items-center justify-center`}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-pink-500 rounded-full shadow-[0_0_6px_rgba(236,72,153,0.8)] animate-pulse" />
          </button>

          <button
            id="mobile-theme-toggle"
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full border ${themeStyles.borderMuted} ${themeStyles.bgCard} cursor-pointer flex items-center justify-center`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className={`${themeStyles.textSecondary} hover:${themeStyles.textPrimary} focus:outline-none cursor-pointer`}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          id="mobile-drawer-container"
          className={`xl:hidden absolute top-24 left-0 w-full rounded-2xl ${themeStyles.drawerOverlay} backdrop-blur-2xl border ${themeStyles.borderMuted} transition-all duration-300 py-6 shadow-2xl z-40`}
        >
          <div id="mobile-menu-list" className="flex flex-col space-y-3 px-6">
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  id={`mobile-nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full py-3 text-left font-mono text-xs tracking-[0.2em] border-b ${themeStyles.borderMuted} flex justify-between items-center ${
                    isActive ? `${themeStyles.accentText} font-bold` : themeStyles.textSecondary
                  }`}
                >
                  {item.id === 'cart' ? (
                    <span className="flex items-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{item.label}</span>
                      {cartCount > 0 && (
                        <span className="bg-rose-500 text-white font-mono text-[9px] px-2 py-0.5 rounded-full font-bold">
                          {cartCount}
                        </span>
                      )}
                    </span>
                  ) : item.id === 'login' && currentUser ? (
                    <span className="text-emerald-400 font-extrabold">PROFILE</span>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </button>
              );
            })}
            {/* Mobile Discord direct link */}
            <a
              href="https://discord.gg/ineffable"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between ${themeStyles.accentBg} ${themeStyles.accentBgHover} border ${themeStyles.borderHighlight} px-4 py-3 rounded-lg font-mono text-xs tracking-widest text-zinc-950 transition-all cursor-pointer mt-2`}
            >
              <span className="flex items-center space-x-2">
                <Radio className="w-3.5 h-3.5 text-zinc-950 animate-pulse" />
                <span>JOIN INEFFABLE SERVER</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* Mobile Custom Language Translator */}
            <div className={`py-3.5 border-b ${themeStyles.borderMuted} flex justify-between items-center`}>
              <span className={`font-mono text-xs tracking-[0.2em] ${themeStyles.textSecondary}`}>LANGUAGE</span>
              <LanguageTranslator themeStyles={themeStyles} isDarkMode={isDarkMode} />
            </div>

            <div className={`pt-3 flex items-center space-x-2 font-mono text-[9px] tracking-wider ${themeStyles.textMuted}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
              <span>INEFFABLE // ACTIVE NODE</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
