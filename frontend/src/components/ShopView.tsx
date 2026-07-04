/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { ShoppingBag, ShoppingCart, CheckCircle2, Tag, Star, Sparkles, Filter } from 'lucide-react';

interface ShopViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  onAddToCart: (item: Omit<CartItem, 'quantity'>) => void;
  setCurrentPage: (page: 'cart' | 'membership' | 'home') => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  onAddToCart,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'digital' | 'perks' | 'merch'>('all');
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'ALL PRODUCTS' },
    { id: 'perks', label: 'SERVER PERKS' },
    { id: 'digital', label: 'DIGITAL UTILITIES' },
    { id: 'merch', label: 'CYBER COUTURE' }
  ];

  const products = [
    {
      id: 'custom-role-pkg',
      name: 'Custom Vanity Role',
      price: 7.00,
      category: 'perks',
      description: 'Acquire your own named vanity Discord role. Fully control its hex color code, select self-assigned tags, and gain high placement on the server sidebar list.',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=400&auto=format&fit=crop',
      rating: 4.9,
      badge: 'TOP SELLER'
    },
    {
      id: 'spotlight-promo',
      name: 'Spotlight Text Announcement',
      price: 25.00,
      category: 'digital',
      description: 'Pin a custom rich announcement in our community channel for 48 hours. Promote your Discord server, social media, or projects to our 13,000+ active members.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&auto=format&fit=crop',
      rating: 4.8,
      badge: 'PROMOTION'
    },
    {
      id: 'mc-booster-pack',
      name: 'SMP Minecraft Booster Pack',
      price: 5.00,
      category: 'perks',
      description: 'Enhance your experience on our 24/7 Survival SMP Minecraft Node. Receive 10x Netherite blocks, 3 custom supply key drops, and command access to `/fly` in builds.',
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop',
      rating: 4.7,
      badge: 'MC EXCLUSIVE'
    },
    {
      id: 'bot-integration-slot',
      name: 'Premium Bot Sandbox Slot',
      price: 12.00,
      category: 'digital',
      description: 'Gain a dedicated container sandbox slot to host your custom-coded Discord bot. Run test scripts, trigger webhook handlers, and test features with real members.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
      rating: 5.0,
      badge: 'LIMITED'
    },
    {
      id: 'couture-hoodie-white',
      name: 'Ineffable "Signature" Hoodie',
      price: 45.00,
      category: 'merch',
      description: 'Premium heavyweight organic cotton hoodie in deep chalk gray. Features brutalist structural prints, reflective neon labels, and custom double-stitch tailoring.',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop',
      rating: 4.9,
      badge: 'CYBER COUTURE'
    },
    {
      id: 'couture-tshirt-black',
      name: 'Ineffable "Drift" Oversized Tee',
      price: 28.00,
      category: 'merch',
      description: 'Oversized black cotton drop-shoulder t-shirt. Emblazoned with a physical representation of our cherry blossom drift particle equations on the front canvas.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=400&auto=format&fit=crop',
      rating: 4.8,
      badge: 'NEW DROP'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: typeof products[0]) => {
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      type: 'shop'
    });
    setAddedItemName(product.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  return (
    <div id="shop-view-container" className={`max-w-7xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          STORE // DIGITAL & MERCH SHOP
        </span>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-extrabold uppercase">
          THE INEFFABLE SHOP
        </h2>
        <p className={`${themeStyles.textSecondary} font-sans text-sm md:text-base font-light leading-relaxed`}>
          Secure direct digital server upgrades, branding packages, or high-end bespoke cyber couture merchandise custom designed by our community designers.
        </p>
      </div>

      {/* Added Toast Alert */}
      {addedItemName && (
        <div id="added-cart-toast" className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] tracking-widest px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>ADDED {addedItemName.toUpperCase()} TO CART</span>
        </div>
      )}

      {/* Category Filter Controls */}
      <div id="shop-category-filters" className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              id={`shop-filter-${cat.id}`}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-5 py-2.5 font-mono text-[10px] tracking-widest rounded-full border transition-all duration-300 cursor-pointer ${
                isActive
                  ? `${themeStyles.accentBg} text-zinc-950 border-white font-bold scale-105`
                  : `${themeStyles.bgCard} ${themeStyles.textSecondary} ${themeStyles.borderMuted} hover:${themeStyles.textPrimary}`
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div id="shop-products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {filteredProducts.map((product) => (
          <div
            id={`shop-product-card-${product.id}`}
            key={product.id}
            className={`group ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl`}
          >
            {/* Product Image Section */}
            <div className="relative h-64 overflow-hidden bg-zinc-950">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60" />
              
              {/* Floating Badge */}
              <div className="absolute top-4 left-4">
                <span className="bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800/80 px-3 py-1 rounded-full font-mono text-[9px] tracking-widest font-bold uppercase">
                  {product.badge}
                </span>
              </div>

              {/* Floating Rating info */}
              <div className="absolute bottom-4 right-4 bg-zinc-950/70 backdrop-blur-md border border-zinc-800/50 px-2.5 py-1 rounded-lg flex items-center space-x-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-white font-mono text-[10px] font-bold">{product.rating}</span>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-sans text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase tracking-wide`}>
                    {product.name}
                  </h3>
                  <span className={`font-mono text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-zinc-900'} shrink-0 mt-0.5`}>
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed line-clamp-3`}>
                  {product.description}
                </p>
              </div>

              {/* Add to Cart button */}
              <button
                id={`add-cart-product-${product.id}`}
                onClick={() => handleAddToCart(product)}
                className={`w-full py-3.5 mt-4 border font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  isDarkMode
                    ? `bg-zinc-900/60 border-zinc-800/80 text-white group-hover:bg-zinc-100 group-hover:border-white group-hover:text-zinc-950`
                    : `bg-zinc-900 border-zinc-900 text-white group-hover:bg-zinc-850 group-hover:border-zinc-850 group-hover:text-white`
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
                <span>ADD TO BASKET</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promotional Callout Banner */}
      <div id="shop-guarantee-banner" className={`rounded-3xl border ${themeStyles.borderMuted} bg-gradient-to-r from-zinc-950/40 via-zinc-900/10 to-transparent p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl`}>
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center space-x-2">
            <Tag className={`w-4 h-4 ${themeStyles.accentText}`} />
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase">SATISFACTION GUARANTEED</span>
          </div>
          <h4 className="text-xl md:text-2xl font-sans tracking-tight font-extrabold uppercase">
            SAFE SECURE PAYMENT TERMINALS
          </h4>
          <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
            All financial transactions are secured using standard Stripe encryption channels. We support PayPal, credit card gateways, and Apple Pay checkouts. Digital items sync to your Discord profile instantly.
          </p>
        </div>
        <button
          id="cta-shop-tiers"
          onClick={() => setCurrentPage('membership')}
          className={`px-8 py-4 font-mono text-xs tracking-widest font-bold rounded-xl transition-all shrink-0 shadow-lg border cursor-pointer ${
            isDarkMode
              ? 'bg-zinc-100 hover:bg-white text-zinc-950 border-white'
              : 'bg-zinc-900 hover:bg-zinc-850 text-white border-zinc-900'
          }`}
        >
          VIEW MEMBERSHIPS Instead
        </button>
      </div>
    </div>
  );
};
