/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { 
  ShoppingBag, 
  ShoppingCart, 
  CheckCircle2, 
  Tag, 
  Star, 
  Sparkles, 
  Filter, 
  Heart, 
  Eye, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Ruler, 
  Truck, 
  RotateCcw, 
  Search, 
  ArrowLeft, 
  Package, 
  Calendar,
  Layers,
  Sparkle
} from 'lucide-react';

interface ShopViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number; size?: string }) => void;
  setCurrentPage: (page: any) => void;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  currentUser?: any;
}

// Hardcoded streetwear catalog focusing exclusively on high-end cyber couture merchandise
const products = [
  {
    id: 'couture-hoodie-white',
    name: 'Inefontop "Signature" Oversized Hoodie',
    price: 85.00,
    category: 'hoodies',
    description: 'Heavyweight 450GSM organic French Terry cotton hoodie. Features a double-lined hood without drawstrings for a clean minimalist drape, dropped shoulders, kangaroo pocket, and high-density branding puff print on the chest canvas.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    badge: 'BEST SELLER',
    stock: 8,
    fabric: '100% Organic French Terry Cotton, 450GSM',
    care: 'Machine wash cold inside out. Tumble dry low. Do not iron directly on graphics.'
  },
  {
    id: 'couture-tshirt-black',
    name: 'Inefontop "Drift" Heavyweight Tee',
    price: 45.00,
    category: 'tees',
    description: 'Boxy, oversized streetwear tee in a deep custom dyed coal tone. Tight-knit mock collar double-stitched for durability. Front artwork displays custom cherry blossom drift equations printed in high-definition ink.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    badge: 'NEW DROP',
    stock: 15,
    fabric: '100% Ringspun Combed Organic Cotton, 280GSM',
    care: 'Gentle cold wash. Line dry in shade. Do not bleach.'
  },
  {
    id: 'couture-cargo-pants',
    name: 'Inefontop "Genesis" Cargoes',
    price: 110.00,
    category: 'pants',
    description: 'Relaxed technical fit cargo pants with ergonomic articulating paneling. Adjustable webbing waist belt and elastic drawcords at cuffs. Outfitted with multiple geometric pockets and solid laser-etched metal hardware.',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 5.0,
    badge: 'LIMITED',
    stock: 4,
    fabric: '70% Cotton Twill, 30% Cordura Nylon Ripstop with DWR coating',
    care: 'Machine wash cold on delicate cycle. Air dry flat. Do not dry clean.'
  },
  {
    id: 'couture-varsity-jacket',
    name: 'Inefontop "Blossom" Varsity',
    price: 185.00,
    category: 'jackets',
    description: 'Bespoke heavy collegiate varsity jacket constructed from dense premium Melton wool with ultra-soft vegan PU leather sleeve drapes. Embellished with custom quilted satin linings, heavy rib trims, and complex chenille floral embroidery.',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508127269354-76811ff3f584?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    badge: 'LIMITED',
    stock: 3,
    fabric: '80% Premium Melton Wool Body, 20% Vegan Leather Sleeves. 100% Polyester Satin Lining.',
    care: 'Professional dry clean only.'
  },
  {
    id: 'couture-cap-black',
    name: 'Inefontop "Oracle" Distressed Cap',
    price: 35.00,
    category: 'accessories',
    description: 'Six-panel low-profile dad cap crafted from vintage washed heavy cotton twill. Detailed with manual distressing at the brim edge, metal buckle adjuster on the back, and tonally embroidered front branding.',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    badge: 'NEW DROP',
    stock: 22,
    fabric: '100% Heavy Washed Cotton Twill',
    care: 'Spot clean only with a cold damp cloth.'
  },
  {
    id: 'couture-brutalist-crew',
    name: 'Inefontop "Brutalist" Knit Crew',
    price: 95.00,
    category: 'hoodies',
    description: 'Deconstructed loose knit crewneck crafted from a soft, bulky cotton-blend yarn. Features stylized distressed knit holes, chunky ribbed edges, dropped armholes, and subtle raw edge highlights throughout.',
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.9,
    badge: 'BEST SELLER',
    stock: 6,
    fabric: '60% Recycled Cotton Yarn, 40% Chunky Acrylic Blend',
    care: 'Hand wash cold. Dry flat. Never hang to store as weight will stretch the knit.'
  },
  {
    id: 'couture-phantom-vest',
    name: 'Inefontop "Phantom" Tech Vest',
    price: 125.00,
    category: 'jackets',
    description: 'High-utility tactical gilet designed for urban exploration. Boasts modular clip-on utility chest bags, quick-release fidlock magnetic buckles, water-repellent zippers, and a mesh harness core.',
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    badge: 'SOLD OUT',
    stock: 0,
    fabric: '100% Cordura Ballistic Waterproof Nylon',
    care: 'Wipe with damp cloth. Do not wash or iron.'
  }
];

const REVIEWS_MOCK = [
  { id: 'rev-1', author: 'Kaleb J.', rating: 5, date: 'May 14, 2026', title: 'Absolute Grail piece!', text: 'The weight of this French Terry cotton is unreal. Standard oversized hoodies usually fit weird, but this drape is perfect. Well worth the price.', verified: true },
  { id: 'rev-2', author: 'Kenji O.', rating: 5, date: 'April 28, 2026', title: 'Exceptional details', text: 'The structural stitching is incredibly robust. Reflector details are highly responsive under ambient light. Beautiful luxury presentation boxes.', verified: true },
  { id: 'rev-3', author: 'Clara S.', rating: 4, date: 'April 09, 2026', title: 'Top-tier materials', text: 'Super soft inside and very heavy. I sized down for a slightly less boxy streetwear look and it fits incredibly well. Shipping was very rapid.', verified: true }
];

export const ShopView: React.FC<ShopViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  onAddToCart,
  setCurrentPage,
  wishlist = [],
  onToggleWishlist,
  currentUser,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hoodies' | 'tees' | 'pants' | 'jackets' | 'accessories'>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popularity'>('popularity');

  // Interactive View States
  const [quickViewProduct, setQuickViewProduct] = useState<typeof products[0] | null>(null);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [addedItemToast, setAddedItemToast] = useState<string | null>(null);

  // Product page interactive states
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>('M');
  const [selectedQty, setSelectedQty] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [hoveredImageZoom, setHoveredImageZoom] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });

  // Accordion expanded states (Product page)
  const [expandedSection, setExpandedSection] = useState<'fabric' | 'shipping' | 'returns' | null>('fabric');

  // Recently viewed states
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'ALL COLLECTIONS' },
    { id: 'hoodies', label: 'HOODIES & KNITS' },
    { id: 'tees', label: 'PREMIUM TEES' },
    { id: 'pants', label: 'UTILITY PANTS' },
    { id: 'jackets', label: 'OUTERWEAR' },
    { id: 'accessories', label: 'ACCESSORIES' }
  ];

  // Estimated delivery date calculator (standard: 3-5 days, express: 1-2 days)
  const getDeliveryDateStr = (isExpress = false) => {
    const daysToAdd = isExpress ? 2 : 4;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysToAdd);
    return targetDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  // Load recently viewed
  useEffect(() => {
    const cached = localStorage.getItem('inefontop_recently_viewed');
    if (cached) {
      setRecentlyViewedIds(JSON.parse(cached));
    }
  }, [activeProductId]);

  // Track recently viewed
  const trackRecentlyViewed = (id: string) => {
    setRecentlyViewedIds((prev) => {
      const updated = [id, ...prev.filter((item) => item !== id)].slice(0, 4);
      localStorage.setItem('inefontop_recently_viewed', JSON.stringify(updated));
      return updated;
    });
  };

  // Handle opening a product page
  const handleProductClick = (product: typeof products[0]) => {
    setActiveProductId(product.id);
    setSelectedImageIdx(0);
    setSelectedSize('M');
    setSelectedQty(1);
    trackRecentlyViewed(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Trigger loading skeleton simulation on filter changes
  const triggerFilterRefreshes = () => {
    setIsFilterLoading(true);
    setTimeout(() => {
      setIsFilterLoading(false);
    }, 550);
  };

  useEffect(() => {
    triggerFilterRefreshes();
  }, [selectedCategory, selectedSizeFilter, selectedPriceFilter, sortBy, searchQuery]);

  // Apply filters and sorting
  const filteredProducts = products.filter((p) => {
    // Category match
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;

    // Search query match
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.badge.toLowerCase().includes(searchQuery.toLowerCase());

    // Price match
    let priceMatch = true;
    if (selectedPriceFilter === 'under-50') priceMatch = p.price < 50;
    else if (selectedPriceFilter === '50-100') priceMatch = p.price >= 50 && p.price <= 100;
    else if (selectedPriceFilter === 'over-100') priceMatch = p.price > 100;

    // Size filter simulation
    // All of our clothing has sizes XS to XXL, so it fits, but Accessories (caps) don't have clothing sizes
    let sizeMatch = true;
    if (selectedSizeFilter !== 'all') {
      if (p.category === 'accessories') sizeMatch = false; // Caps are OS (One size)
    }

    return categoryMatch && searchMatch && priceMatch && sizeMatch;
  });

  // Apply Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return a.badge === 'NEW DROP' ? -1 : 1;
    // Popularity sorting (descending rating)
    return b.rating - a.rating;
  });

  const handleAddToCart = (product: typeof products[0], customSize?: string, customQty?: number) => {
    const finalSize = customSize || (product.category === 'accessories' ? 'ONE SIZE' : 'M');
    const finalQty = customQty || 1;

    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      type: 'shop',
      size: finalSize,
      quantity: finalQty
    } as any);

    setAddedItemToast(`${finalQty}X ${product.name.toUpperCase()} (${finalSize})`);
    setTimeout(() => setAddedItemToast(null), 3000);
  };

  // Zoom tracker helper
  const handleZoomMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  // Render Product Page Detail mode
  const activeProduct = products.find((p) => p.id === activeProductId);
  const relatedProducts = activeProduct 
    ? products.filter((p) => p.id !== activeProduct.id && (p.category === activeProduct.category || Math.random() > 0.5)).slice(0, 3)
    : [];
  const recentlyViewedProducts = products.filter((p) => recentlyViewedIds.includes(p.id) && p.id !== activeProductId).slice(0, 3);

  return (
    <div id="shop-view-container" className={`max-w-7xl mx-auto px-4 md:px-8 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Toast alert popup */}
      <AnimatePresence>
        {addedItemToast && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            id="added-cart-toast" 
            className="fixed bottom-6 right-6 z-50 bg-zinc-950 border border-emerald-500/30 text-white font-mono text-[10px] tracking-widest px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-emerald-400 font-bold">ADDED TO BASKET</span>
              <span className="text-[9px] text-zinc-400 mt-0.5">{addedItemToast}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeProductId ? (
          /* ========================================================
             1. SHOP MAIN CATALOG INDEX VIEW
             ======================================================== */
          <motion.div
            key="catalog-list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            id="shop-catalog-view"
          >
            {/* Elegant Header */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className={`font-mono text-xs tracking-[0.4em] ${themeStyles.accentText} uppercase block`}>
                INEFONTOP // APPAREL
              </span>
              <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-black uppercase text-glow">
                CYBER COUTURE
              </h2>
              <div className="w-12 h-[2px] bg-rose-500/75 mx-auto rounded-full" />
              <p className={`${themeStyles.textSecondary} font-sans text-xs md:text-sm font-light leading-relaxed tracking-wider`}>
                Premium tailored streetwear constructed with heavyweight organic fabrics, brutalist geometric layouts, and structural detailing.
              </p>
            </div>

            {/* Filter and Live Search Panel */}
            <div id="shop-controls-container" className={`p-6 rounded-2xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} mb-12 space-y-6 shadow-md`}>
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                {/* Live Search */}
                <div className="relative w-full lg:max-w-md">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${themeStyles.textMuted}`} />
                  <input
                    id="shop-live-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="SEARCH COUTURE APPAREL..."
                    className={`w-full ${isDarkMode ? 'bg-zinc-950/80 border-zinc-900 text-zinc-100 placeholder-zinc-600 focus:border-rose-500/55' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-rose-500/50'} pl-11 pr-4 py-3 rounded-xl border text-xs font-mono tracking-wider focus:outline-none transition-all duration-300`}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sub-Filters: Sort, Price, Size */}
                <div className="flex flex-wrap gap-3 items-center justify-end w-full lg:w-auto">
                  {/* Price Filter */}
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider">PRICE:</span>
                    <select
                      id="price-filter-select"
                      value={selectedPriceFilter}
                      onChange={(e) => setSelectedPriceFilter(e.target.value)}
                      className={`px-3 py-2 font-mono text-[10px] tracking-widest rounded-xl border ${themeStyles.bgCard} ${themeStyles.borderMuted} ${themeStyles.textPrimary} focus:outline-none`}
                    >
                      <option value="all">ALL PRICES</option>
                      <option value="under-50">UNDER $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="over-100">OVER $100</option>
                    </select>
                  </div>

                  {/* Size Filter */}
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider">SIZE:</span>
                    <select
                      id="size-filter-select"
                      value={selectedSizeFilter}
                      onChange={(e) => setSelectedSizeFilter(e.target.value)}
                      className={`px-3 py-2 font-mono text-[10px] tracking-widest rounded-xl border ${themeStyles.bgCard} ${themeStyles.borderMuted} ${themeStyles.textPrimary} focus:outline-none`}
                    >
                      <option value="all">ALL SIZES</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider">SORT:</span>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className={`px-3 py-2 font-mono text-[10px] tracking-widest rounded-xl border ${themeStyles.bgCard} ${themeStyles.borderMuted} ${themeStyles.textPrimary} focus:outline-none`}
                    >
                      <option value="popularity">BEST SELLING</option>
                      <option value="newest">NEW RELEASES</option>
                      <option value="price-low">PRICE: LOW TO HIGH</option>
                      <option value="price-high">PRICE: HIGH TO LOW</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Filter Pills */}
              <div id="shop-category-filters" className="flex flex-wrap items-center justify-start gap-2 pt-2 border-t border-zinc-800/20">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      id={`shop-filter-${cat.id}`}
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as any)}
                      className={`px-4 py-2 font-mono text-[9px] tracking-widest rounded-lg border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? `${themeStyles.accentBg} text-zinc-950 border-white font-bold scale-[1.03] shadow-md`
                          : `${themeStyles.bgCard} ${themeStyles.textSecondary} ${themeStyles.borderMuted} hover:${themeStyles.textPrimary}`
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Products Listing and Loading Skeletons */}
            {isFilterLoading ? (
              <div id="shop-skeletons" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={`h-[420px] rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} animate-pulse overflow-hidden p-6 flex flex-col justify-between`}>
                    <div className="w-full h-56 bg-zinc-800/40 rounded-xl" />
                    <div className="space-y-3 mt-4">
                      <div className="h-4 bg-zinc-800/50 w-2/3 rounded-md" />
                      <div className="h-3 bg-zinc-800/30 w-full rounded-md" />
                      <div className="h-3 bg-zinc-800/30 w-5/6 rounded-md" />
                    </div>
                    <div className="h-10 bg-zinc-800/50 rounded-xl mt-6 w-full" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              /* Beautiful Empty State */
              <div id="shop-empty-state" className="text-center py-24 max-w-md mx-auto space-y-6">
                <div className={`w-20 h-20 rounded-full border border-dashed ${themeStyles.borderMuted} flex items-center justify-center mx-auto text-zinc-500`}>
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-xl font-bold uppercase tracking-wider">No Items Found</h3>
                  <p className={`${themeStyles.textSecondary} text-xs leading-relaxed`}>
                    We could not find any apparel matching your active filters. Try adjusting your search query, price ranges, or sizes.
                  </p>
                </div>
                <button
                  id="reset-shop-filters"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedPriceFilter('all');
                    setSelectedSizeFilter('all');
                    setSortBy('popularity');
                  }}
                  className={`px-6 py-3 border font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950 border-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900'}`}
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              /* Product Grid */
              <div id="shop-products-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                {sortedProducts.map((product) => {
                  const isSoldOut = product.stock === 0;
                  const isWishlisted = wishlist.includes(product.id);
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -6 }}
                      id={`shop-product-card-${product.id}`}
                      key={product.id}
                      className={`group ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-500 relative shadow-md hover:shadow-2xl`}
                    >
                      {/* Product Image and Hover Actions */}
                      <div 
                        onClick={() => !isSoldOut && handleProductClick(product)}
                        className="relative h-72 overflow-hidden bg-zinc-950 cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110 filter brightness-90 group-hover:brightness-95"
                        />
                        {/* Elegant gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent opacity-80" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {isSoldOut ? (
                            <span className="bg-red-600 text-white font-mono text-[8px] tracking-widest px-3 py-1 rounded-md font-bold shadow-md">
                              SOLD OUT
                            </span>
                          ) : (
                            <span className={`bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800/60 px-3 py-1 rounded-md font-mono text-[8px] tracking-widest font-bold uppercase`}>
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Quick Actions Panel */}
                        {!isSoldOut && (
                          <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button
                              id={`quick-preview-${product.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuickViewProduct(product);
                              }}
                              className="p-3 bg-white text-zinc-950 hover:bg-zinc-100 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                              title="Quick View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              id={`detail-page-${product.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductClick(product);
                              }}
                              className="p-3 bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-700/50 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
                              title="Full Details"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Ratings floating badge */}
                        <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/40 px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-white font-mono text-[9px] font-bold">{product.rating}</span>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-4">
                            <h3 
                              onClick={() => !isSoldOut && handleProductClick(product)}
                              className={`font-sans text-sm md:text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase tracking-wide cursor-pointer hover:text-rose-500 transition-colors leading-snug`}
                            >
                              {product.name}
                            </h3>
                            <span className={`font-mono text-xs md:text-sm font-black ${isDarkMode ? 'text-white' : 'text-zinc-900'} shrink-0 mt-0.5`}>
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed line-clamp-2`}>
                            {product.description}
                          </p>
                        </div>

                        {/* Buy/Wishlist Action bar */}
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            id={`add-cart-product-${product.id}`}
                            disabled={isSoldOut}
                            onClick={() => handleAddToCart(product)}
                            className={`flex-grow py-3 px-4 border font-mono text-[9px] tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                              isSoldOut 
                                ? 'bg-zinc-800/30 border-zinc-800 text-zinc-500 cursor-not-allowed'
                                : isDarkMode
                                  ? 'bg-zinc-900/60 border-zinc-800 text-white hover:bg-zinc-100 hover:border-white hover:text-zinc-950 shadow-sm'
                                  : 'bg-zinc-950 border-zinc-950 text-white hover:bg-zinc-800 hover:border-zinc-800 shadow-sm'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isSoldOut ? 'SOLD OUT' : 'ADD TO BASKET'}</span>
                          </button>

                          {/* Wishlist button */}
                          <button
                            id={`wishlist-toggle-${product.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onToggleWishlist) onToggleWishlist(product.id);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              isWishlisted
                                ? 'bg-rose-500 border-rose-400 text-white shadow-md'
                                : `${themeStyles.bgCard} ${themeStyles.borderMuted} ${themeStyles.textSecondary} hover:text-rose-500 hover:border-rose-500/40`
                            }`}
                            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Premium Guarantee Info / Trust Banner */}
            <div id="shop-guarantee-banner" className={`rounded-3xl border ${themeStyles.borderMuted} bg-gradient-to-r ${isDarkMode ? 'from-zinc-950/40 via-zinc-900/10 to-transparent' : 'from-white via-zinc-100/10 to-transparent'} p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-md`}>
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center space-x-2">
                  <Tag className={`w-4 h-4 ${themeStyles.accentText}`} />
                  <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase font-bold">LIMITED QUANTITY RUNS</span>
                </div>
                <h4 className="text-xl md:text-2xl font-sans tracking-tight font-black uppercase">
                  PREMIUM COUTURE GUARANTEE
                </h4>
                <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
                  All items are tailored in small capsule batches with strict eco-certifications. We offer tracked door-to-door express deliveries worldwide, 14-day hassle-free return labels, and complete digital ownership audits synced securely to your portal.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="flex items-center space-x-2 font-mono text-[9px] text-zinc-400">
                    <Truck className="w-3.5 h-3.5 text-rose-500" />
                    <span>SECURED DISPATCH</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-[9px] text-zinc-400">
                    <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
                    <span>HASSLE-FREE RETURNS</span>
                  </div>
                  <div className="flex items-center space-x-2 font-mono text-[9px] text-zinc-400 col-span-2 md:col-span-1">
                    <Package className="w-3.5 h-3.5 text-rose-500" />
                    <span>100% ECO-COTTON</span>
                  </div>
                </div>
              </div>
              <button
                id="cta-shop-tiers"
                onClick={() => setCurrentPage('membership')}
                className={`px-8 py-4 font-mono text-xs tracking-widest font-bold rounded-xl transition-all shrink-0 shadow-md border cursor-pointer ${
                  isDarkMode
                    ? 'bg-zinc-100 hover:bg-white text-zinc-950 border-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900'
                }`}
              >
                VIEW DISCORD MEMBERSHIPS INSTEAD
              </button>
            </div>
          </motion.div>
        ) : (
          /* ========================================================
             2. IMMERSIVE PRODUCT DETAIL PAGE VIEW
             ======================================================== */
          <motion.div
            key="product-detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            id={`product-page-${activeProduct?.id}`}
            className="space-y-16"
          >
            {/* Back Button and Navigation indicator */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/20 pb-6">
              <button
                id="back-to-catalog"
                onClick={() => setActiveProductId(null)}
                className={`flex items-center space-x-2 font-mono text-xs tracking-widest font-semibold cursor-pointer ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO COLLECTIONS</span>
              </button>
              <div className="font-mono text-[10px] text-zinc-500 tracking-wider flex items-center space-x-2">
                <span className="uppercase">STORE</span>
                <span>/</span>
                <span className="uppercase">{activeProduct?.category}</span>
                <span>/</span>
                <span className={`uppercase font-bold ${themeStyles.accentText}`}>{activeProduct?.name}</span>
              </div>
            </div>

            {/* Product Layout: Dual Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Product Image Gallery */}
              <div className="lg:col-span-7 space-y-4">
                {/* Large main stage image */}
                <div 
                  className="relative h-[480px] md:h-[600px] rounded-2xl bg-zinc-950 border border-zinc-800/30 overflow-hidden cursor-crosshair select-none"
                  onMouseEnter={() => setHoveredImageZoom(true)}
                  onMouseLeave={() => setHoveredImageZoom(false)}
                  onMouseMove={handleZoomMouseMove}
                >
                  <img
                    src={activeProduct?.images[selectedImageIdx]}
                    alt={activeProduct?.name}
                    referrerPolicy="no-referrer"
                    style={
                      hoveredImageZoom
                        ? {
                            transform: 'scale(1.8)',
                            transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                          }
                        : undefined
                    }
                    className="w-full h-full object-cover transition-transform duration-100 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Floating badge inside detail gallery */}
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <span className="bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800/60 px-4 py-1.5 rounded-lg font-mono text-[9px] tracking-widest font-bold uppercase">
                      {activeProduct?.badge}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800/40 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 pointer-events-none">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white font-mono text-[10px] font-bold">{activeProduct?.rating} // 5.0</span>
                  </div>
                </div>

                {/* Grid Thumbnails */}
                <div className="grid grid-cols-3 gap-4">
                  {activeProduct?.images.map((imgUrl, idx) => (
                    <button
                      id={`gallery-thumb-${idx}`}
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`h-24 md:h-32 rounded-xl bg-zinc-900 border overflow-hidden cursor-pointer transition-all duration-300 ${
                        selectedImageIdx === idx 
                          ? 'border-rose-500 scale-98 shadow-md' 
                          : 'border-zinc-800/40 hover:border-zinc-500 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt="Product thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Product purchasing control */}
              <div className="lg:col-span-5 space-y-8">
                {/* Branding, Name, Price */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-rose-500">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    <span className="font-mono text-[9px] tracking-[0.3em] font-extrabold uppercase">INEFONTOP DIVISION // BRAND ORIGINAL</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-sans font-black uppercase tracking-tight leading-none">
                    {activeProduct?.name}
                  </h1>
                  <div className="flex items-baseline space-x-3 pt-2">
                    <span className="text-2xl md:text-3xl font-mono font-black">${activeProduct?.price.toFixed(2)}</span>
                    <span className="font-mono text-[9px] text-zinc-500 tracking-wider">SECURE TRANSACTION GATEWAY</span>
                  </div>
                </div>

                {/* Stock availability & Delivery info */}
                <div className={`p-4 rounded-xl border ${activeProduct && activeProduct.stock > 0 
                  ? (isDarkMode ? 'bg-emerald-950/20 border-emerald-500/20' : 'bg-emerald-50/90 border-emerald-300/80') 
                  : (isDarkMode ? 'bg-red-950/20 border-red-500/20' : 'bg-red-50/90 border-red-300/80')} space-y-2`}>
                  <div className="flex items-center space-x-2">
                    <Package className={`w-4 h-4 ${activeProduct && activeProduct.stock > 0 
                      ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700') 
                      : (isDarkMode ? 'text-red-400' : 'text-red-700')}`} />
                    <span className={`font-mono text-[10px] tracking-widest font-extrabold ${activeProduct && activeProduct.stock > 0 
                      ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700') 
                      : (isDarkMode ? 'text-red-400' : 'text-red-700')} uppercase`}>
                      {activeProduct && activeProduct.stock > 0 
                        ? `IN STOCK // ONLY ${activeProduct.stock} BATCHES LEFT` 
                        : 'SOLD OUT // JOIN WAITLIST'}
                    </span>
                  </div>
                  {activeProduct && activeProduct.stock > 0 && (
                    <div className={`flex items-center space-x-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-700 font-medium'} font-mono text-[9px] tracking-wider`}>
                      <Calendar className={`w-3.5 h-3.5 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`} />
                      <span>Est. standard delivery: <strong className={isDarkMode ? 'text-white' : 'text-zinc-950 font-black'}>{getDeliveryDateStr(false)}</strong></span>
                    </div>
                  )}
                </div>

                {/* Short description */}
                <p className={`${themeStyles.textSecondary} font-sans text-sm font-light leading-relaxed tracking-wide`}>
                  {activeProduct?.description}
                </p>

                {/* Sizing selection (Apparel only) */}
                {activeProduct?.category !== 'accessories' && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[10px] text-zinc-400 tracking-widest font-extrabold uppercase">SELECT SIZE</span>
                      <button
                        id="size-guide-trigger"
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="flex items-center space-x-1.5 font-mono text-[9px] text-zinc-400 hover:text-zinc-900 dark:hover:text-white tracking-widest cursor-pointer border-b border-zinc-400 dark:border-zinc-600 pb-0.5"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>SIZE GUIDE</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {(['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                        <button
                          id={`size-option-${sz}`}
                          key={sz}
                          onClick={() => setSelectedSize(sz)}
                          className={`py-3 font-mono text-xs font-bold border rounded-lg transition-all duration-300 cursor-pointer ${
                            selectedSize === sz
                              ? `${themeStyles.accentBg} text-zinc-950 border-white shadow-md scale-98`
                              : `${themeStyles.bgCard} ${themeStyles.borderMuted} ${themeStyles.textPrimary} hover:border-zinc-500`
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity selection & Buy buttons */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {/* Quantity count widget */}
                    <div className="space-y-1.5 shrink-0">
                      <span className="font-mono text-[10px] text-zinc-400 tracking-widest block uppercase font-bold">QTY</span>
                      <div className={`flex items-center space-x-2 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'} border rounded-xl px-3 py-2 h-12`}>
                        <button
                          id="qty-dec-btn"
                          disabled={selectedQty <= 1 || (activeProduct?.stock === 0)}
                          onClick={() => setSelectedQty(selectedQty - 1)}
                          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-xs font-black w-6 text-center">{selectedQty}</span>
                        <button
                          id="qty-inc-btn"
                          disabled={activeProduct ? selectedQty >= activeProduct.stock : true}
                          onClick={() => setSelectedQty(selectedQty + 1)}
                          className="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-30"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Master Buy / Add to Cart Button */}
                    <div className="flex-grow pt-[18px]">
                      <button
                        id="add-cart-detail-btn"
                        disabled={activeProduct ? activeProduct.stock === 0 : true}
                        onClick={() => activeProduct && handleAddToCart(activeProduct, selectedSize, selectedQty)}
                        className={`w-full h-12 font-mono text-xs tracking-widest font-black rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg ${
                          activeProduct?.stock === 0
                            ? 'bg-zinc-800/30 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                            : isDarkMode
                              ? 'bg-white hover:bg-zinc-100 text-zinc-950 border-white'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-900'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{activeProduct?.stock === 0 ? 'SOLD OUT' : 'ADD TO BASKET'}</span>
                      </button>
                    </div>

                    {/* Favorite toggle button */}
                    <div className="pt-[18px]">
                      <button
                        id="wishlist-toggle-detail"
                        onClick={() => activeProduct && onToggleWishlist && onToggleWishlist(activeProduct.id)}
                        className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                          activeProduct && wishlist.includes(activeProduct.id)
                            ? 'bg-rose-500 border-rose-400 text-white shadow-md'
                            : `${themeStyles.bgCard} ${themeStyles.borderMuted} ${themeStyles.textSecondary} hover:text-rose-500 hover:border-rose-500/40`
                        }`}
                        title="Wishlist product"
                      >
                        <Heart className={`w-4 h-4 ${activeProduct && wishlist.includes(activeProduct.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Technical Specs / Accordion Details */}
                <div id="product-specs-accordion" className="space-y-2 border-t border-zinc-800/20 pt-6">
                  {/* Item 1: Material & Care */}
                  <div className={`rounded-xl border ${expandedSection === 'fabric' ? `${themeStyles.borderHighlight} ${themeStyles.bgCard}` : 'border-zinc-800/10'} overflow-hidden`}>
                    <button
                      id="accordion-fabric-btn"
                      onClick={() => setExpandedSection(expandedSection === 'fabric' ? null : 'fabric')}
                      className={`w-full px-4 py-3 flex items-center justify-between font-mono text-[10px] tracking-widest font-bold uppercase text-left ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'} transition-colors`}
                    >
                      <span>MATERIAL & FABRIC COMPLEXITY</span>
                      {expandedSection === 'fabric' ? <ChevronLeft className="w-3.5 h-3.5 rotate-90" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {expandedSection === 'fabric' && (
                      <div className="p-4 pt-1 font-sans text-xs font-light text-zinc-400 leading-relaxed border-t border-zinc-800/10 space-y-2">
                        <p>{activeProduct?.fabric}</p>
                        <p className="font-mono text-[9px] tracking-wide text-zinc-500 uppercase mt-2">CARE METHOD:</p>
                        <p>{activeProduct?.care}</p>
                      </div>
                    )}
                  </div>

                  {/* Item 2: Shipping Policy */}
                  <div className={`rounded-xl border ${expandedSection === 'shipping' ? `${themeStyles.borderHighlight} ${themeStyles.bgCard}` : 'border-zinc-800/10'} overflow-hidden`}>
                    <button
                      id="accordion-shipping-btn"
                      onClick={() => setExpandedSection(expandedSection === 'shipping' ? null : 'shipping')}
                      className={`w-full px-4 py-3 flex items-center justify-between font-mono text-[10px] tracking-widest font-bold uppercase text-left ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'} transition-colors`}
                    >
                      <span>SECURED WORLDWIDE DELIVERY</span>
                      {expandedSection === 'shipping' ? <ChevronLeft className="w-3.5 h-3.5 rotate-90" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                    {expandedSection === 'shipping' && (
                      <div className="p-4 pt-1 font-sans text-xs font-light text-zinc-400 leading-relaxed border-t border-zinc-800/10 space-y-2">
                        <p>We provide tracked door-to-door express deliveries internationally. Items ship within 24-48 hours. Express shipping (DHL/FedEx) clears custom clearances rapidly.</p>
                        <p>Standard Free Shipping takes 3-5 days. Express Shipping takes 1-2 days.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* Custom Customer Reviews Section */}
            <div 
              id="product-reviews-section" 
              className={`rounded-2xl border ${isDarkMode ? `${themeStyles.borderMuted} ${themeStyles.bgCard}` : 'border-zinc-300/80 bg-zinc-100/70'} p-6 md:p-8 space-y-8 shadow-sm`}
            >
              <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isDarkMode ? 'border-zinc-800/20' : 'border-zinc-350/50'} pb-6`}>
                <div className="space-y-1">
                  <h3 className={`font-sans text-lg font-black uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>REVIEWS</h3>
                  <p className={`${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'} font-mono text-[10px] tracking-wider uppercase`}>VERIFIED BUYER RESPONSES</p>
                </div>
                
                {/* Visual aggregate */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`font-mono text-2xl font-black block leading-none ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{activeProduct?.rating}</span>
                    <span className="text-zinc-500 font-mono text-[9px] tracking-widest uppercase">OUT OF 5.0</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <span className="text-zinc-500 font-mono text-[9px] mt-1 tracking-wider uppercase">100% RECOMMENDATION</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {REVIEWS_MOCK.map((rev) => (
                  <div key={rev.id} className={`border-b ${isDarkMode ? themeStyles.borderMuted : 'border-zinc-300/60'} pb-6 last:border-0 last:pb-0 space-y-3`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-mono text-[10px] font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{rev.author.toUpperCase()}</span>
                          <span className={`font-mono text-[7px] tracking-widest px-1.5 py-0.5 rounded uppercase font-extrabold ${
                            isDarkMode 
                              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                              : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-800'
                          }`}>VERIFIED CLIENT</span>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      <span className={`${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} font-mono text-[9px]`}>{rev.date}</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-sans text-xs font-bold uppercase ${isDarkMode ? 'text-zinc-200' : 'text-zinc-900'}`}>{rev.title}</h4>
                      <p className={`font-sans text-xs font-light ${isDarkMode ? themeStyles.textSecondary : 'text-zinc-700'} leading-relaxed`}>{rev.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Products carousel row */}
            {relatedProducts.length > 0 && (
              <div id="related-products-row" className="space-y-6 pt-6">
                <div className="space-y-1">
                  <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-500 uppercase block font-extrabold">COMPLETE THE LOOK</span>
                  <h3 className="font-sans text-lg font-black uppercase tracking-tight">RELATED STREETWEAR</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {relatedProducts.map((p) => (
                    <div
                      id={`related-product-${p.id}`}
                      key={p.id}
                      onClick={() => handleProductClick(p)}
                      className={`group ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500/30 p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between`}
                    >
                      <div className="h-48 rounded-xl overflow-hidden bg-zinc-950 mb-4 relative">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800/80 px-2 py-0.5 rounded font-mono text-[7px] tracking-widest uppercase">
                            {p.badge}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`font-sans text-xs font-bold uppercase ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'} line-clamp-1 group-hover:text-rose-400 transition-colors`}>{p.name}</h4>
                          <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>${p.price.toFixed(2)}</span>
                        </div>
                        <p className="text-zinc-500 text-[10px] font-light line-clamp-1 leading-normal">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recently Viewed carousel row */}
            {recentlyViewedProducts.length > 0 && (
              <div id="recently-viewed-row" className="space-y-6 border-t border-zinc-800/20 pt-12">
                <div className="space-y-1">
                  <span className="font-mono text-[8px] tracking-[0.3em] text-zinc-500 uppercase block font-extrabold">RETURNING CHANNELS</span>
                  <h3 className="font-sans text-lg font-black uppercase tracking-tight">RECENTLY VIEWED COUTURE</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {recentlyViewedProducts.map((p) => (
                    <div
                      id={`recently-viewed-${p.id}`}
                      key={p.id}
                      onClick={() => handleProductClick(p)}
                      className={`group ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500/30 p-4 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between`}
                    >
                      <div className="h-48 rounded-xl overflow-hidden bg-zinc-950 mb-4">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`font-sans text-xs font-bold uppercase ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'} line-clamp-1 group-hover:text-rose-400 transition-colors`}>{p.name}</h4>
                          <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>${p.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Interactive Overlay Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="quick-view-overlay"
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setQuickViewProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-3xl rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMain} overflow-hidden shadow-2xl relative max-h-[90vh] overflow-y-auto`}
            >
              <button
                id="close-quick-view"
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 text-zinc-400 hover:text-white hover:scale-105 transition-transform z-10 border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left side: main image */}
                <div className="h-64 md:h-auto bg-zinc-950 relative">
                  <img
                    src={quickViewProduct.images[0]}
                    alt={quickViewProduct.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-zinc-950/80 backdrop-blur-md text-white border border-zinc-800/80 px-2.5 py-1 rounded font-mono text-[8px] tracking-widest uppercase">
                      {quickViewProduct.badge}
                    </span>
                  </div>
                </div>

                {/* Right side: quick details */}
                <div className="p-6 md:p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[8px] tracking-[0.2em] text-rose-500 uppercase block font-bold">QUICK PREVIEW</span>
                      <h3 className={`font-sans text-xl md:text-2xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'} leading-tight`}>
                        {quickViewProduct.name}
                      </h3>
                      <span className={`font-mono text-base font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} block mt-1`}>${quickViewProduct.price.toFixed(2)}</span>
                    </div>

                    <p className="text-zinc-400 text-xs font-light leading-relaxed">
                      {quickViewProduct.description}
                    </p>

                    <div className="space-y-1.5 font-mono text-[9px] text-zinc-500 uppercase">
                      <div className="flex justify-between">
                        <span>FABRIC SPEC</span>
                        <span className="text-zinc-300 font-bold">{quickViewProduct.category}</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-800/30 pt-1.5">
                        <span>STOCK LATENCY</span>
                        <span className={quickViewProduct.stock > 0 ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                          {quickViewProduct.stock > 0 ? `IN STOCK [${quickViewProduct.stock}]` : 'SOLD OUT'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-3 pt-4 border-t ${themeStyles.borderMuted}`}>
                    <button
                      id={`quick-preview-add-btn-${quickViewProduct.id}`}
                      disabled={quickViewProduct.stock === 0}
                      onClick={() => {
                        handleAddToCart(quickViewProduct, 'M', 1);
                        setQuickViewProduct(null);
                      }}
                      className={`w-full py-3.5 font-mono text-[9px] tracking-widest font-black rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        quickViewProduct.stock === 0
                          ? `${isDarkMode ? 'bg-zinc-800/30 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'} text-zinc-500 cursor-not-allowed`
                          : isDarkMode
                            ? 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-lg'
                            : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>{quickViewProduct.stock === 0 ? 'SOLD OUT' : 'ADD TO BASKET'}</span>
                    </button>
                    <button
                      id={`quick-preview-details-btn-${quickViewProduct.id}`}
                      onClick={() => {
                        handleProductClick(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className={`w-full py-3 border ${themeStyles.borderMain} ${isDarkMode ? 'bg-zinc-900/40 text-zinc-400 hover:text-white' : 'bg-zinc-50 text-zinc-600 hover:text-zinc-900'} font-mono text-[9px] tracking-widest font-bold rounded-xl transition-all cursor-pointer text-center block`}
                    >
                      VIEW FULL DETAILS PAGE
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sizing Guide modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="size-guide-modal"
            className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsSizeGuideOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMain} p-6 space-y-6 shadow-2xl relative`}
            >
              <button
                id="close-size-guide"
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="font-mono text-[8px] tracking-[0.2em] text-rose-500 uppercase block font-bold">METRICS AUDITS</span>
                <h3 className={`font-sans text-xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>STREETWEAR SIZE GUIDE</h3>
                <p className="text-zinc-500 font-mono text-[9px] uppercase">Boxy Oversized Fits — All Measurements are in Inches</p>
              </div>

              {/* Sizing guide table */}
              <div className={`overflow-x-auto border ${themeStyles.borderMuted} rounded-xl`}>
                <table className={`w-full text-left font-mono text-[10px] ${themeStyles.textSecondary}`}>
                  <thead className={`${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-800'} uppercase tracking-wider text-[9px]`}>
                    <tr className={`border-b ${themeStyles.borderMuted}`}>
                      <th className="p-3">SIZE</th>
                      <th className="p-3">CHEST</th>
                      <th className="p-3">LENGTH</th>
                      <th className="p-3">SLEEVE</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${themeStyles.borderMuted}`}>
                    <tr>
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>XS</td>
                      <td className="p-3">22.5</td>
                      <td className="p-3">25.0</td>
                      <td className="p-3">23.5</td>
                    </tr>
                    <tr>
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>S</td>
                      <td className="p-3">24.0</td>
                      <td className="p-3">26.0</td>
                      <td className="p-3">24.5</td>
                    </tr>
                    <tr className="bg-rose-500/5">
                      <td className="p-3 font-bold text-rose-400">M [STANDARD]</td>
                      <td className={`p-3 ${isDarkMode ? 'text-rose-200' : 'text-rose-700'}`}>25.5</td>
                      <td className={`p-3 ${isDarkMode ? 'text-rose-200' : 'text-rose-700'}`}>27.0</td>
                      <td className={`p-3 ${isDarkMode ? 'text-rose-200' : 'text-rose-700'}`}>25.5</td>
                    </tr>
                    <tr>
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>L</td>
                      <td className="p-3">27.0</td>
                      <td className="p-3">28.0</td>
                      <td className="p-3">26.5</td>
                    </tr>
                    <tr>
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>XL</td>
                      <td className="p-3">28.5</td>
                      <td className="p-3">29.0</td>
                      <td className="p-3">27.5</td>
                    </tr>
                    <tr>
                      <td className={`p-3 font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>XXL</td>
                      <td className="p-3">30.0</td>
                      <td className="p-3">30.0</td>
                      <td className="p-3">28.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={`flex items-start space-x-2 rounded-xl ${isDarkMode ? 'bg-zinc-950/50' : 'bg-zinc-50'} p-3 border ${themeStyles.borderMuted}`}>
                <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-sans text-[10px] text-zinc-500 leading-normal">
                  Our products generally sport a heavy boxy streetwear fit. If you prefer a traditional standard fitted outline, we highly recommend selecting <strong className={isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}>one size smaller</strong>.
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
