/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { PageId, AtmosphereConfig, CartItem } from './types';
import { PetalDriftCanvas } from './components/PetalDriftCanvas';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MembershipView } from './components/MembershipView';
import { ShopView } from './components/ShopView';
import { ContactView } from './components/ContactView';
import { JournalsView } from './components/JournalsView';
import { AdminView } from './components/AdminView';
import { CartView } from './components/CartView';
import { LoginView } from './components/LoginView';
import { GamingView } from './components/GamingView';
import { AboutView } from './components/AboutView';
import { getThemeStyles } from './lib/theme';
import { Disc, Sparkles, MapPin, Instagram, Github, Youtube, Twitter } from 'lucide-react';

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 127.14 96.36" 
    className={className}
    fill="currentColor"
  >
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.45-5c1-.73,2-1.51,3-2.31a75.12,75.12,0,0,0,71.79,0c1,.8,2,1.58,3,2.31a68.43,68.43,0,0,1-10.45,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,49.58,124.2,26.85,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
  </svg>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [atmosphere, setAtmosphere] = useState<AtmosphereConfig>({
    petalCount: 80,
    driftVelocity: 1.2,
    windAngle: 120,
    gravity: 1.1,
    colorTheme: 'classic'
  });
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Global cart & login state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const themeStyles = getThemeStyles(atmosphere.colorTheme, isDarkMode);

  // Cart actions
  const handleAddToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Auth actions
  const handleLogin = (username: string) => {
    setCurrentUser(username);
    setCurrentPage('home'); // Redirect to home after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Dynamic selection style classes
  const getSelectionClass = () => {
    switch (atmosphere.colorTheme) {
      case 'neon-mint':
        return isDarkMode ? 'selection:bg-emerald-500/20 selection:text-emerald-200' : 'selection:bg-emerald-500/10 selection:text-emerald-800';
      case 'crimson-moon':
        return isDarkMode ? 'selection:bg-red-500/20 selection:text-red-200' : 'selection:bg-red-500/10 selection:text-red-800';
      case 'monochrome':
        return isDarkMode ? 'selection:bg-zinc-100/10 selection:text-zinc-100' : 'selection:bg-zinc-800/10 selection:text-zinc-800';
      case 'classic':
      default:
        return isDarkMode ? 'selection:bg-rose-500/20 selection:text-rose-200' : 'selection:bg-rose-500/10 selection:text-rose-800';
    }
  };

  // Get dynamic atmospheric sky gradient background classes
  const getBackgroundGradientClass = () => {
    if (isDarkMode) {
      switch (atmosphere.colorTheme) {
        case 'neon-mint':
          return 'bg-gradient-to-tr from-[#052b20] via-[#111726] to-[#0a1324]';
        case 'crimson-moon':
          return 'bg-gradient-to-tr from-[#440d0d] via-[#1a1c26] to-[#111621]';
        case 'monochrome':
          return 'bg-gradient-to-tr from-[#1f1f24] via-[#16161a] to-[#0f0f12]';
        case 'classic':
        default:
          return 'bg-gradient-to-tr from-[#122e58] via-[#1a1e2f] to-[#101423]';
      }
    } else {
      switch (atmosphere.colorTheme) {
        case 'neon-mint':
          return 'bg-gradient-to-tr from-[#bbf7d0] via-[#cbd5e1] to-[#ccfbf1]';
        case 'crimson-moon':
          return 'bg-gradient-to-tr from-[#fecdd3] via-[#e2e8f0] to-[#fda4af]';
        case 'monochrome':
          return 'bg-gradient-to-tr from-[#cbd5e1] via-[#d4d4d8] to-[#cbd5e1]';
        case 'classic':
        default:
          return 'bg-gradient-to-tr from-[#93c5fd] via-[#cbd5e1] to-[#fbcfe8]'; // beautiful daylight sky/pink blossom tones
      }
    }
  };

  // Get dynamic background photographic image according to the color theme
  const getBackgroundImageUrl = () => {
    switch (atmosphere.colorTheme) {
      case 'neon-mint':
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop'; // Premium organic neon-mint curves
      case 'crimson-moon':
        return 'https://images.unsplash.com/photo-1618005198143-d3667cd354c6?q=80&w=2000&auto=format&fit=crop'; // Elegant abstract deep-crimson moonlit waves
      case 'monochrome':
        return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop'; // Brutalist modern concrete structures
      case 'classic':
      default:
        return '/src/assets/images/cherry_blossom_bg_1782902853761.jpg'; // Soft dynamic cherry blossom branches
    }
  };

  return (
    <div 
      id="ineffable-root-canvas" 
      className={`min-h-screen ${getBackgroundGradientClass()} font-sans ${getSelectionClass()} relative overflow-x-hidden transition-all duration-1000 ease-in-out`}
    >
      
      {/* Dynamic photographic background matching the active theme */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <img 
          src={getBackgroundImageUrl()} 
          alt="Atmospheric Theme Background" 
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out ${
            isDarkMode 
              ? 'opacity-20 md:opacity-30 filter brightness-[0.7] contrast-[1.0]' 
              : 'opacity-35 md:opacity-55 filter brightness-[0.95] contrast-[0.95]'
          }`}
        />
        {/* Soft overlays to ensure contrast and readability */}
        <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          isDarkMode 
            ? 'bg-gradient-to-b from-transparent via-zinc-900/40 to-zinc-900/90' 
            : 'bg-gradient-to-b from-transparent via-zinc-300/45 to-zinc-300/90'
        }`} />
        <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
          isDarkMode 
            ? 'bg-gradient-to-r from-zinc-900/15 via-transparent to-zinc-900/15' 
            : 'bg-gradient-to-r from-zinc-300/15 via-transparent to-zinc-300/15'
        }`} />
      </div>
      
      {/* Background Interactive Canvas Particle simulation */}
      <PetalDriftCanvas config={atmosphere} isDarkMode={isDarkMode} />

      {/* Global Navigation Header with Glassmorphism blur */}
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        activeAtmosphere={atmosphere}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        cartCount={totalCartCount}
        currentUser={currentUser}
      />

      {/* Main Render Views */}
      <main id="ineffable-main-view" className="relative z-20">
        {currentPage === 'home' && (
          <HomeView setCurrentPage={setCurrentPage} activeAtmosphere={atmosphere} isDarkMode={isDarkMode} />
        )}
        {currentPage === 'gaming' && (
          <GamingView activeAtmosphere={{ ...themeStyles, ...atmosphere }} isDarkMode={isDarkMode} />
        )}
        {currentPage === 'membership' && (
          <MembershipView setCurrentPage={setCurrentPage} activeAtmosphere={atmosphere} isDarkMode={isDarkMode} onAddToCart={handleAddToCart} />
        )}
        {currentPage === 'shop' && (
          <ShopView setCurrentPage={setCurrentPage} activeAtmosphere={atmosphere} isDarkMode={isDarkMode} onAddToCart={handleAddToCart} />
        )}
        {currentPage === 'journals' && (
          <JournalsView activeAtmosphere={atmosphere} isDarkMode={isDarkMode} currentUser={currentUser} />
        )}
        {currentPage === 'admin' && (
          <AdminView activeAtmosphere={atmosphere} isDarkMode={isDarkMode} currentUser={currentUser} setCurrentPage={setCurrentPage} />
        )}
        {currentPage === 'contact' && (
          <ContactView activeAtmosphere={atmosphere} isDarkMode={isDarkMode} />
        )}
        {currentPage === 'about' && (
          <AboutView activeAtmosphere={atmosphere} isDarkMode={isDarkMode} />
        )}
        {currentPage === 'cart' && (
          <CartView 
            setCurrentPage={setCurrentPage} 
            activeAtmosphere={atmosphere} 
            isDarkMode={isDarkMode} 
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
          />
        )}
        {currentPage === 'login' && (
          <LoginView 
            activeAtmosphere={atmosphere} 
            isDarkMode={isDarkMode} 
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Corporate Luxury Footer */}
      <footer 
        id="ineffable-footer" 
        className={`relative z-30 ${themeStyles.bgFooter} border-t ${themeStyles.borderMuted} py-16 px-6 backdrop-blur-md transition-all duration-1000`}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 font-sans font-light">
          
          {/* Column 1 - Brand Identity */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/img.png" 
                alt="Ineffable Logo" 
                className="w-6 h-6 object-contain rounded-md"
                referrerPolicy="no-referrer"
              />
              <h4 className={`font-mono text-sm tracking-[0.3em] ${themeStyles.textPrimary} uppercase`}>
                INEFFABLE
              </h4>
            </div>
            <p className={`${themeStyles.textSecondary} text-xs max-w-sm leading-relaxed`}>
              INEFFABLE is an open-ended digital experimental brand blurring the boundary of cyber couture clothing, brutalist architecture, and dynamic physics loops.
            </p>
            <div className={`flex items-center space-x-3 ${themeStyles.textMuted} font-mono text-[9px] tracking-wider`}>
              <MapPin className={`w-3.5 h-3.5 ${themeStyles.accentTextMuted}`} />
              <span>MULTIPLE NODES: TOKYO // REYKJAVIK // OSAKA</span>
            </div>
          </div>

          {/* Column 2 - Quick navigation */}
          <div className="md:col-span-3 space-y-4 font-mono text-xs">
            <h5 className={`${themeStyles.textSecondary} tracking-[0.2em] font-medium uppercase px-4`}>SYSTEM ARCHIVE</h5>
            <div className="flex flex-col space-y-1">
              {[
                { id: 'home' as PageId, label: 'LOBBY DESK' },
                { id: 'about' as PageId, label: 'ABOUT US' },
                { id: 'membership' as PageId, label: 'MEMBERSHIP UPGRADES' },
                { id: 'shop' as PageId, label: 'STORE MARKET' },
                { id: 'journals' as PageId, label: 'COMMUNITY JOURNALS' },
                { id: 'contact' as PageId, label: 'CONNECT CHASSIS' },
                { id: 'cart' as PageId, label: 'CART SUMMARY' },
                { id: 'login' as PageId, label: 'MEMBER PORTAL' },
              ].map((lnk) => {
                const isActive = currentPage === lnk.id;
                return (
                  <button
                    id={`footer-nav-link-${lnk.id}`}
                    key={lnk.id}
                    onClick={() => {
                      setCurrentPage(lnk.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative px-4 py-2 font-mono text-[10px] tracking-[0.2em] transition-all duration-300 cursor-pointer flex items-center space-x-1.5 rounded-lg w-fit text-left ${
                      isActive 
                        ? `${themeStyles.textPrimary} bg-zinc-500/10 font-bold` 
                        : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-zinc-500/5`
                    }`}
                  >
                    <span>{lnk.label}</span>
                    {isActive && (
                      <span 
                        id={`footer-active-indicator-${lnk.id}`}
                        className={`absolute left-1 top-1/2 -translate-y-1/2 w-[2px] h-3.5 ${themeStyles.indicatorBg} rounded-full`} 
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3 - Technical stats & coordinates */}
          <div className={`md:col-span-4 space-y-4 font-mono text-[10px] ${themeStyles.textSecondary} leading-normal`}>
            <h5 className={`${themeStyles.textSecondary} tracking-[0.2em] font-medium uppercase`}>CORE SPECIFICATION</h5>
            <div className={`space-y-2 ${themeStyles.bgCard} p-4 rounded-xl border ${themeStyles.borderMuted}`}>
              <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-1.5`}>
                <span>SYSTEM RENDER</span>
                <span className="text-emerald-500">PETAL_DRIFT_V4</span>
              </div>
              <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-1.5`}>
                <span>ACTIVE VELOCITY</span>
                <span className={themeStyles.textPrimary}>{atmosphere.driftVelocity} M/S</span>
              </div>
              <div className={`flex justify-between border-b ${themeStyles.borderMuted} pb-1.5`}>
                <span>GRAVITY MASS</span>
                <span className={themeStyles.textPrimary}>{atmosphere.gravity} G</span>
              </div>
              <div className="flex justify-between">
                <span>CONNECTION STATUS</span>
                <span className={`${themeStyles.accentText} uppercase`}>{atmosphere.colorTheme}</span>
              </div>
            </div>
            
            {/* Social Cluster */}
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-600 hover:text-[#E1306C] transition-colors duration-300"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-600 hover:text-[#1DA1F2] transition-colors duration-300"
                title="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-600 hover:text-[#FF0000] transition-colors duration-300"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://discord.gg/inefontop" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-600 hover:text-[#5865F2] transition-colors duration-300"
                title="Discord"
              >
                <DiscordIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-600 hover:text-white transition-colors duration-300"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <span className="text-zinc-600">//</span>
              <div className="flex items-center space-x-1 text-zinc-600">
                <Sparkles className={`w-3 h-3 ${themeStyles.accentText}`} />
                <span>SECURE CRYPTO PROTOCOLS LOCK</span>
              </div>
            </div>
          </div>
        </div>



        {/* Legal block */}
        <div className={`max-w-7xl mx-auto border-t ${themeStyles.borderMuted} mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between font-mono text-[9px] ${themeStyles.textMuted} space-y-4 sm:space-y-0`}>
          <span>© 2026 INEFFABLE INC. ALL CHANNELS RESERVED.</span>
          <div className="flex space-x-6">
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">PRIVACY PROTOCOL</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">SECURITY SCHEMAS</span>
            <span className="hover:text-zinc-400 transition-colors cursor-pointer">TERMINAL GATEWAY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
