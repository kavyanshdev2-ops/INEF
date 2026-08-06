/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageId, AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { Menu, X, Sun, Moon, ShoppingCart, Search, User, ChevronDown, ChevronRight, Compass, Home, ShoppingBag, BookOpen, Crown, Gamepad2, Info, Mail, ShieldAlert, MoreVertical, SlidersHorizontal, Sparkles } from 'lucide-react';
import { LanguageTranslator } from './LanguageTranslator';
import { motion, AnimatePresence } from 'motion/react';
import { AnimatedThemeToggler } from '@/registry/magicui/animated-theme-toggler';

interface NavbarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  cartCount: number;
  currentUser: any;
  websiteSettings?: Record<string, any>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  activeAtmosphere,
  isDarkMode,
  onToggleDarkMode,
  cartCount,
  currentUser,
  websiteSettings = {} as Record<string, any>
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const isAdmin = currentUser?.toLowerCase() === 'kavyanshshakya' || 
                   currentUser?.toLowerCase() === 'admin' || 
                   currentUser?.toLowerCase() === 'kavyashakya251';

  const menuItems = [
    { id: 'home' as PageId, label: 'HOME', icon: Home },
    { id: 'shop' as PageId, label: 'SHOP', icon: ShoppingBag },
    { id: 'journals' as PageId, label: 'JOURNALS', icon: BookOpen },
    { id: 'membership' as PageId, label: 'MEMBERSHIP', icon: Crown },
    { id: 'gaming' as PageId, label: 'GAMING', icon: Gamepad2 },
    { id: 'about' as PageId, label: 'ABOUT', icon: Info },
    { id: 'contact' as PageId, label: 'CONTACT', icon: Mail },
    ...(isAdmin ? [{ id: 'admin' as PageId, label: 'ADMIN', icon: ShieldAlert }] : []),
  ];

  const currentMenuItem = menuItems.find(item => item.id === currentPage);

  return (
    <>
      {/* Translucent Black Background Overlay when Shop Dropdown is Open */}
      <AnimatePresence>
        {isShopDropdownOpen && (
          <motion.div
            key="main-nav-shop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsShopDropdownOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>

      <nav
        id="inef-liquid-navbar"
        className={`fixed top-3 lg:top-4 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] md:w-[calc(100%-3rem)] max-w-7xl z-50 rounded-lg md:rounded-xl py-2.5 px-4 md:px-6 glass-panel backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300 border ${themeStyles.borderMuted}`}
      >
        <div className="flex items-center justify-between">

          {/* Brand Logo & Name */}
          <button
            id="nav-logo-btn"
            onClick={() => {
              setCurrentPage('home');
              setIsOpen(false);
              setIsShopDropdownOpen(false);
            }}
            className="flex items-center space-x-3 group text-left cursor-pointer shrink-0"
          >
            <div className={`relative w-9 h-9 rounded-md ${themeStyles.bgCard} border ${themeStyles.borderMuted} flex items-center justify-center p-1.5 transition-all duration-300 group-hover:scale-105 shadow-xs backdrop-blur-md`}>
              <img
                src={websiteSettings.logo_url || "/image.png"}
                alt="INEFFABLE Logo"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-black text-xs md:text-sm tracking-[0.25em] ${themeStyles.textPrimary} uppercase transition-colors group-hover:${themeStyles.accentText}`}>
                INEFFABLE
              </span>
              <span className={`font-mono text-[8px] tracking-[0.3em] ${themeStyles.accentText} uppercase font-semibold -mt-0.5 opacity-90`}>
                EST. 2020 // COMMUNITY
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Large Screens >= 1024px) */}
          <div id="desktop-menu-items" className={`hidden lg:flex items-center ${themeStyles.bgCard} p-1 rounded-lg border ${themeStyles.borderMuted} backdrop-blur-xl shadow-inner`}>
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;

              if (item.id === 'shop') {
                return (
                  <div key={item.id} className="relative">
                    <button
                      id={`nav-item-${item.id}`}
                      onClick={() => {
                        setCurrentPage('shop');
                        setIsShopDropdownOpen(!isShopDropdownOpen);
                      }}
                      className={`relative px-3.5 py-1.5 rounded-md font-mono text-[11px] tracking-[0.18em] transition-all duration-200 cursor-pointer flex items-center space-x-1 ${
                        isActive || isShopDropdownOpen
                          ? `${themeStyles.accentBg} text-zinc-950 font-black shadow-xs scale-[1.02]`
                          : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/5 dark:hover:bg-white/10`
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Floating White Dropdown Menu for Shop */}
                    <AnimatePresence>
                      {isShopDropdownOpen && (
                        <motion.div
                          id="main-nav-shop-dropdown"
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white text-zinc-950 rounded-2xl p-2.5 shadow-2xl border border-zinc-200/90 z-50 font-sans text-left space-y-1"
                        >
                          {[
                            { label: 'New Arrivals' },
                            { label: 'Old Money Polo' },
                            { label: 'Oversized T-shirts' },
                            { label: 'T-Shirts' },
                            { label: 'Shirts' },
                            { label: 'Tanks' },
                            { label: 'Active Wear' },
                            { label: 'Monsoon Sale (60% OFF)' },
                          ].map((collection, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCurrentPage('shop');
                                setIsShopDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2.5 rounded-xl font-extrabold text-xs tracking-wide text-zinc-900 hover:text-black hover:bg-zinc-100 transition-all flex items-center justify-between cursor-pointer"
                            >
                              <span>{collection.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" />
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setIsShopDropdownOpen(false);
                  }}
                  className={`relative px-3.5 py-1.5 rounded-md font-mono text-[11px] tracking-[0.18em] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? `${themeStyles.accentBg} text-zinc-950 font-black shadow-xs scale-[1.02]`
                      : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/5 dark:hover:bg-white/10`
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

        {/* System Icons & Action Cluster (Desktop >= 1024px) */}
        <div id="system-status-cluster" className="hidden lg:flex items-center space-x-2.5">
          
          {/* Search Trigger */}
          <button
            id="nav-search-btn"
            onClick={() => {
              setCurrentPage('shop');
            }}
            className={`w-9 h-9 rounded-md ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:${themeStyles.borderMain} ${themeStyles.textPrimary} hover:${themeStyles.accentText} transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95`}
            title="Search Collection"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Language Translator Dropdown */}
          <LanguageTranslator themeStyles={themeStyles} isDarkMode={isDarkMode} />

          {/* Account / Login */}
          <button
            id="nav-user-btn"
            onClick={() => setCurrentPage('login')}
            className={`w-9 h-9 rounded-md ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:${themeStyles.borderMain} ${themeStyles.textPrimary} hover:${themeStyles.accentText} transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95`}
            title={currentUser ? `Logged in as ${currentUser}` : 'Account Login'}
          >
            <User className="w-3.5 h-3.5" />
          </button>

          {/* Cart Button */}
          <button
            id="nav-cart-btn-desktop"
            onClick={() => setCurrentPage('cart')}
            className={`relative w-9 h-9 rounded-md border transition-all cursor-pointer flex items-center justify-center shadow-xs active:scale-95 ${
              currentPage === 'cart'
                ? `${themeStyles.accentBg} ${themeStyles.borderHighlight} text-zinc-950`
                : `${themeStyles.bgCard} ${themeStyles.borderMuted} hover:${themeStyles.borderMain} ${themeStyles.textPrimary}`
            }`}
            title="Shopping Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 ${themeStyles.accentBg} text-zinc-950 font-mono text-[9px] w-4 h-4 rounded-full font-black flex items-center justify-center shadow-md animate-pulse`}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Light / Dark Mode Switcher */}
          <AnimatedThemeToggler
            isDark={isDarkMode}
            onToggle={onToggleDarkMode}
            size="sm"
          />
        </div>

        {/* Mobile & Tablet Navigation Trigger (ONLY symbol/dropdown button on navbar top right) */}
        <div className="flex lg:hidden items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className={`h-9 px-3 rounded-md border ${themeStyles.borderMuted} ${
              isOpen ? themeStyles.accentBg + ' text-zinc-950 font-bold' : themeStyles.bgCard + ' ' + themeStyles.textPrimary
            } flex items-center space-x-2 focus:outline-none cursor-pointer transition-all active:scale-95 shadow-xs`}
            aria-label="Toggle Navigation Dropdown Menu"
            title="Menu Options"
          >
            {isOpen ? (
              <>
                <X className="w-4 h-4" />
                <span className="font-mono text-[10px] tracking-widest font-extrabold uppercase">CLOSE</span>
              </>
            ) : (
              <>
                <MoreVertical className="w-4 h-4" />
                <span className="font-mono text-[10px] tracking-widest font-extrabold uppercase">MORE</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Dropdown Menu Overlay Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer-container"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`lg:hidden mt-3 pt-3 pb-3 px-1 border-t ${themeStyles.borderMuted} flex flex-col space-y-4 font-mono text-xs relative z-10 overflow-hidden`}
          >
            {/* Quick Action Controls (Cart, Theme, Search, Account) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-1 pt-1">
              {/* Cart Button */}
              <button
                onClick={() => { setCurrentPage('cart'); setIsOpen(false); }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md border transition-all cursor-pointer ${
                  currentPage === 'cart'
                    ? `${themeStyles.accentBg} text-zinc-950 border-transparent font-extrabold`
                    : `${themeStyles.bgCard} ${themeStyles.textPrimary} ${themeStyles.borderMuted} hover:${themeStyles.borderMain}`
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-[11px] font-bold">CART</span>
                </div>
                {cartCount > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
                    currentPage === 'cart' ? 'bg-zinc-950 text-white' : `${themeStyles.accentBg} text-zinc-950`
                  }`}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Theme Toggle Button */}
              <AnimatedThemeToggler
                isDark={isDarkMode}
                onToggle={onToggleDarkMode}
                showLabel
                size="sm"
                className="w-full justify-start py-2.5 px-3"
              />

              {/* Search Button */}
              <button
                onClick={() => { setCurrentPage('shop'); setIsOpen(false); }}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-md border ${themeStyles.bgCard} ${themeStyles.textPrimary} ${themeStyles.borderMuted} hover:${themeStyles.borderMain} transition-all cursor-pointer`}
              >
                <Search className="w-4 h-4" />
                <span className="text-[11px] font-bold">SEARCH</span>
              </button>

              {/* Account / Login Button */}
              <button
                onClick={() => { setCurrentPage('login'); setIsOpen(false); }}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-md border ${themeStyles.bgCard} ${themeStyles.textPrimary} ${themeStyles.borderMuted} hover:${themeStyles.borderMain} transition-all cursor-pointer truncate`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold truncate">{currentUser ? currentUser : 'LOGIN'}</span>
              </button>
            </div>

            {/* Section Divider & Header */}
            <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-mono tracking-widest uppercase text-zinc-400 font-bold">
              <span className="flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>PAGES NAVIGATION</span>
              </span>
              <span className="text-[9px] opacity-60">SELECT PAGE</span>
            </div>

            {/* Pages Navigation Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-1">
              {menuItems.map((item) => {
                const isActive = currentPage === item.id;
                const ItemIcon = item.icon;
                return (
                  <button
                    id={`mobile-nav-item-${item.id}`}
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsOpen(false);
                    }}
                    className={`py-2.5 px-3.5 rounded-md text-left tracking-widest transition-all flex items-center justify-between cursor-pointer border ${
                      isActive
                        ? `${themeStyles.accentBg} text-zinc-950 font-black shadow-xs border-transparent`
                        : `${themeStyles.bgCard} ${themeStyles.textSecondary} ${themeStyles.borderMuted} hover:${themeStyles.textPrimary} hover:border-zinc-400/30`
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <ItemIcon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : themeStyles.accentText}`} />
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-sm bg-zinc-950 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Language Translator Toolbar */}
            <div className={`pt-2.5 border-t ${themeStyles.borderMuted} flex items-center justify-between px-2 gap-2 flex-wrap`}>
              <span className={`text-[10px] ${themeStyles.textMuted} uppercase tracking-widest font-semibold flex items-center space-x-1`}>
                <span>LANGUAGE TRANSLATION</span>
              </span>
              <LanguageTranslator themeStyles={themeStyles} isDarkMode={isDarkMode} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </>
  );
};
