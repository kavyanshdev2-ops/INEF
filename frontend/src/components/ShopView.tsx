/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { 
  Search, 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  Zap, 
  ArrowLeft, 
  SlidersHorizontal, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Tag, 
  Ruler, 
  Check, 
  MapPin
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

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: 'hoodies' | 'tees' | 'pants' | 'jackets' | 'accessories';
  isSakura: boolean;
  isAssured: boolean;
  rating: number;
  reviewsCount: number;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  description: string;
  specs: Record<string, string>;
  offers: string[];
}

// Exact Theme Colors from User Swatch (#FA5F88)
const CHERRY_PINK = '#FA5F88';
const CHERRY_PINK_HOVER = '#e64f77';

const PRODUCTS: ProductItem[] = [
  {
    id: 'sakura-drift-hoodie',
    name: 'Ineffable "Sakura Drift" 450GSM Heavyweight Oversized Hoodie',
    price: 88.00,
    originalPrice: 120.00,
    discount: 26,
    category: 'hoodies',
    isSakura: true,
    isAssured: true,
    rating: 4.9,
    reviewsCount: 184,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Sakura Cherry Pink', 'Obsidian Black', 'Pure White'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 8,
    description: 'Constructed from 450GSM double-faced French Terry organic cotton. Features dropped shoulders, clean seamless kangaroo pocket, and high-density embossed cherry blossom drift graphics on the back.',
    specs: {
      'Fabric': '100% Organic French Terry Cotton (450 GSM)',
      'Fit': 'Oversized Boxy Streetwear Drape',
      'Neck': 'Double-Layered Structured Hood',
      'Sleeve': 'Full Sleeve with Ribbed Cuffs',
      'Pattern': 'Embossed Sakura Drift Puff Print',
      'Wash Care': 'Machine Wash Cold Inside Out, Tumble Dry Low'
    },
    offers: [
      'Special Price: Extra $32 off (Included in price)',
      'Bank Offer: 10% Instant Discount on credit & debit cards',
      'Sakura Perk: Complimentary holographic Ineffable sticker pack',
      'Free Express Delivery on orders above $75'
    ]
  },
  {
    id: 'hanami-varsity-jacket',
    name: 'Ineffable "Hanami" Chenille Embroidered Melton Varsity Bomber',
    price: 185.00,
    originalPrice: 240.00,
    discount: 23,
    category: 'jackets',
    isSakura: true,
    isAssured: true,
    rating: 5.0,
    reviewsCount: 92,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Cherry Blossom & Bone Leather', 'Charcoal Midnight'],
    sizes: ['M', 'L', 'XL'],
    stock: 4,
    description: 'Heavyweight Melton wool collegiate bomber outfitted with ultra-soft vegan bone leather sleeves, chenille cherry blossom crest embroidery, and quilted cherry pink satin thermal lining.',
    specs: {
      'Fabric': '80% Heavy Melton Wool, 20% Vegan Leather',
      'Lining': '100% Quilted Satin Lining (Blossom Pink)',
      'Fit': 'Regular Bomber Fit',
      'Closure': 'Heavy Duty Matte Metal Snap Buttons',
      'Wash Care': 'Dry Clean Only'
    },
    offers: [
      'Special Price: $55 flat discount applied',
      'Bank Offer: 5% Unlimited Cashback on Ineffable Card',
      'Partner Offer: Free Garment Dust Bag included'
    ]
  },
  {
    id: 'sakura-blossom-tee',
    name: 'Ineffable "Petal Drift" 280GSM Heavyweight Streetwear Boxy Tee',
    price: 48.00,
    originalPrice: 65.00,
    discount: 26,
    category: 'tees',
    isSakura: true,
    isAssured: true,
    rating: 4.8,
    reviewsCount: 135,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Vintage Blossom Pink', 'Washed Black', 'Snow White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 19,
    description: 'Heavy 280GSM combed ringspun cotton tee with tight mock neck collar. Front features cyber-zen cherry blossom equation artwork printed with breathable reactive dye.',
    specs: {
      'Fabric': '100% Ringspun Combed Cotton (280 GSM)',
      'Fit': 'Boxy Relaxed Fit',
      'Neck': 'Reinforced Mock Ribbed Collar',
      'Pattern': 'Screen Printed Graphic',
      'Wash Care': 'Machine Wash Cold, Hang to Dry'
    },
    offers: [
      'Combo Offer: Buy with Sakura Hoodie and get 15% off',
      'Bank Offer: Flat $5 instant off with UPI'
    ]
  },
  {
    id: 'petal-tech-cargo',
    name: 'Ineffable "Petal-Tech" Articulated Tactical Ripstop Cargo Trousers',
    price: 115.00,
    originalPrice: 150.00,
    discount: 23,
    category: 'pants',
    isSakura: false,
    isAssured: true,
    rating: 4.7,
    reviewsCount: 78,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Slate Charcoal', 'Stealth Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 11,
    description: 'Durable Cordura ripstop cargo pants featuring articulated knee darts, magnetic Fidlock buckle belt, 6 utility cargo pockets, and adjustable cherry blossom ankle pull-cords.',
    specs: {
      'Fabric': '70% Cotton, 30% Cordura Nylon Ripstop',
      'Fit': 'Relaxed Tapered Fit',
      'Pockets': '6 Multi-Utility Pockets',
      'Finish': 'DWR Water-Repellent Coating'
    },
    offers: [
      'Special Price: Extra $35 off',
      'Bank Offer: 10% Instant Discount on debit cards'
    ]
  },
  {
    id: 'komorebi-knit-crew',
    name: 'Ineffable "Komorebi" Hand-Distressed Chunky Slub Knit Crewneck',
    price: 98.00,
    originalPrice: 135.00,
    discount: 27,
    category: 'hoodies',
    isSakura: true,
    isAssured: true,
    rating: 4.9,
    reviewsCount: 64,
    images: [
      'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Cherry Pink & Ash', 'Oatmeal Heather'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 5,
    description: 'Chunky loose-knit sweater woven from breathable cotton-linen yarn with subtle cherry blossom pink contrast threads and hand-finished deconstructed fray details.',
    specs: {
      'Fabric': '65% Recycled Cotton, 35% Slub Linen',
      'Fit': 'Dropped Shoulder Relaxed Fit',
      'Neck': 'Chunky Ribbed Crewneck',
      'Wash Care': 'Hand Wash Cold, Lay Flat to Dry'
    },
    offers: [
      'Special Price: Flat $37 off',
      'Complimentary Express Doorstep Shipping'
    ]
  },
  {
    id: 'sakura-cyber-vest',
    name: 'Ineffable "Sakura Blade" Waterproof Modular Urban Tactical Gilet',
    price: 130.00,
    originalPrice: 175.00,
    discount: 25,
    category: 'jackets',
    isSakura: true,
    isAssured: true,
    rating: 4.8,
    reviewsCount: 42,
    images: [
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Cherry Pink & Black', 'Midnight Stealth'],
    sizes: ['M', 'L', 'XL'],
    stock: 7,
    description: 'Urban technical vest with magnetic quick-release chest rigs, heat-sealed YKK Aquaguard zippers, and cherry pink reinforced nylon webbing straps.',
    specs: {
      'Fabric': '500D Cordura Waterproof Ballistic Nylon',
      'Hardware': 'Fidlock Magnetic Buckles + YKK Aquaguard Zips',
      'Fit': 'Adjustable Modular Fit'
    },
    offers: [
      'Special Price: Extra $45 off',
      'Bank Offer: Extra 5% with UPI payments'
    ]
  },
  {
    id: 'sakura-blossom-cap',
    name: 'Ineffable "Bloom" Vintage Pigment-Dyed Washed Cotton Cap',
    price: 38.00,
    originalPrice: 50.00,
    discount: 24,
    category: 'accessories',
    isSakura: true,
    isAssured: false,
    rating: 4.7,
    reviewsCount: 110,
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Washed Charcoal', 'Cherry Pink'],
    sizes: ['Free Size'],
    stock: 22,
    description: 'Low profile 6-panel unstructured dad cap with subtle distressed brim and tonally embroidered cherry blossom branch emblem. Solid brass strap adjuster.',
    specs: {
      'Fabric': '100% Washed Heavy Cotton Twill',
      'Closure': 'Solid Brass Tri-Glide Buckle',
      'Fit': 'Adjustable One Size'
    },
    offers: [
      'Special Price: Extra $12 off',
      'Add with any hoodie for free shipping'
    ]
  },
  {
    id: 'sakura-key-pendant',
    name: 'Ineffable "Petal Key" Grade-5 Anodized Titanium Artifact Pendant',
    price: 55.00,
    originalPrice: 75.00,
    discount: 26,
    category: 'accessories',
    isSakura: true,
    isAssured: true,
    rating: 5.0,
    reviewsCount: 57,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop'
    ],
    colors: ['Cherry Pink Anodized', 'Raw Titanium Silver'],
    sizes: ['One Size'],
    stock: 14,
    description: 'Machined from aerospace Grade 5 titanium billet on a 5-axis CNC. Features laser-etched cherry blossom motif and dual-mount for mechanical switch or included steel chain.',
    specs: {
      'Material': 'Grade 5 Aerospace Titanium',
      'Finish': 'PVD Cherry Pink Anodized',
      'Chain': '55cm 2.5mm Stainless Steel Curb Chain'
    },
    offers: [
      'Limited Collectible: Only 50 units produced worldwide',
      'Bank Offer: Flat 5% off on online payments'
    ]
  }
];

export const ShopView: React.FC<ShopViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  onAddToCart,
  setCurrentPage,
  wishlist = [],
  onToggleWishlist,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Search and Filters (Flipkart Style)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<'all' | 'under-50' | '50-100' | '100-plus'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [onlySakura, setOnlySakura] = useState<boolean>(false);
  const [onlyAssured, setOnlyAssured] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'price-low' | 'price-high' | 'newest' | 'discount'>('popularity');

  // Mobile Filter Drawer Toggle
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Product Detail Page State
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [selectedQty, setSelectedQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeProduct = useMemo(() => {
    return PRODUCTS.find(p => p.id === activeProductId);
  }, [activeProductId]);

  // Delivery date string
  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Filter products logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = p.name.toLowerCase().includes(q) || 
                      p.category.toLowerCase().includes(q) || 
                      p.description.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Sakura Theme Filter
      if (onlySakura && !p.isSakura) return false;

      // Assured
      if (onlyAssured && !p.isAssured) return false;

      // In Stock
      if (onlyInStock && p.stock <= 0) return false;

      // Min Rating
      if (minRating > 0 && p.rating < minRating) return false;

      // Price Range
      if (priceRange === 'under-50' && p.price >= 50) return false;
      if (priceRange === '50-100' && (p.price < 50 || p.price > 100)) return false;
      if (priceRange === '100-plus' && p.price < 100) return false;

      // Size
      if (selectedSizeFilter !== 'all' && !p.sizes.includes(selectedSizeFilter)) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, onlySakura, onlyAssured, onlyInStock, minRating, priceRange, selectedSizeFilter]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'popularity') {
      return list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (b.isSakura ? 1 : 0) - (a.isSakura ? 1 : 0));
    }
    if (sortBy === 'discount') {
      return list.sort((a, b) => b.discount - a.discount);
    }
    return list;
  }, [filteredProducts, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setMinRating(0);
    setOnlySakura(false);
    setOnlyAssured(false);
    setOnlyInStock(false);
    setSelectedSizeFilter('all');
    setSearchQuery('');
  };

  const handleAddProductToCart = (prod: ProductItem, sizeToUse?: string, qtyToUse?: number) => {
    const chosenSize = sizeToUse || (prod.sizes[0] || 'M');
    const chosenQty = qtyToUse || 1;

    onAddToCart({
      id: `${prod.id}-${chosenSize}`,
      name: prod.name,
      price: prod.price,
      image: prod.images[0],
      type: 'shop',
      size: chosenSize,
      quantity: chosenQty
    } as any);

    setToastMessage(`Added 1 item: ${prod.name} (${chosenSize}) to cart`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckPincode = () => {
    if (!pincode || pincode.trim().length < 5) {
      setPincodeStatus('Please enter a valid 5-6 digit postal code');
      return;
    }
    setPincodeStatus(`Available! Express Delivery by ${getDeliveryDate()} | Free Shipping`);
  };

  return (
    <div id="flipkart-shop-container" className="relative min-h-screen font-sans">
      <div className={`pt-24 pb-20 px-3 sm:px-6 max-w-7xl mx-auto relative z-10 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-800'}`}>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              id="shop-alert-toast"
              style={{ backgroundColor: CHERRY_PINK }}
              className="fixed top-24 right-6 z-50 text-white font-medium text-xs px-4 py-3 rounded-lg shadow-xl flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP FLIPKART-STYLE SEARCH HEADER WITH CHERRY PINK THEME (#FA5F88) & TRANSLUCENT AESTHETIC */}
        <div className={`mb-6 p-4 rounded-xl border ${
          isDarkMode 
            ? 'bg-black/30 backdrop-blur-md border-white/10 shadow-lg' 
            : 'bg-white/50 backdrop-blur-md border-zinc-200/80 shadow-sm'
        } space-y-3`}>
          <div className="flex items-center gap-3">

            {/* Flipkart Style Search Box with Exact Cherry Pink Accents */}
            <div className="relative flex-grow">
              <input
                id="flipkart-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for hoodies, graphic tees, cargo pants, sakura collection..."
                className={`w-full pl-10 pr-10 py-2.5 rounded-lg border text-xs sm:text-sm transition-all focus:outline-none ${
                  isDarkMode 
                    ? 'bg-black/30 border-white/10 text-white placeholder-zinc-400 focus:border-[#FA5F88]' 
                    : 'bg-white/60 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#FA5F88] focus:bg-white'
                }`}
              />
              <Search 
                style={{ color: CHERRY_PINK }}
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" 
              />
              {searchQuery && (
                <button 
                  id="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cart Quick Button in User's Exact Cherry Pink (#FA5F88) */}
            <button
              id="nav-cart-btn"
              onClick={() => setCurrentPage('cart')}
              style={{ backgroundColor: CHERRY_PINK }}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg text-white text-xs font-bold transition-all hover:opacity-90 cursor-pointer shrink-0 shadow-md"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden md:inline">Cart</span>
            </button>
          </div>

          {/* Quick Search Chips with Cherry Pink Hover */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-zinc-500 text-[11px] shrink-0 font-medium">Popular:</span>
            {['Sakura Drift Hoodie', 'Graphic Tees', 'Hanami Varsity', 'Cargo Pants', 'Komorebi Knit'].map((chip) => (
              <button
                key={chip}
                onClick={() => setSearchQuery(chip.split(' ')[0])}
                className={`px-2.5 py-1 rounded-full text-[11px] border shrink-0 transition-colors cursor-pointer ${
                  isDarkMode 
                    ? 'bg-black/30 border-white/10 text-zinc-300 hover:border-[#FA5F88] hover:text-[#FA5F88]' 
                    : 'bg-white/60 border-zinc-200 text-zinc-700 hover:border-[#FA5F88] hover:text-[#FA5F88]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!activeProductId ? (
            /* =========================================================================
               FLIPKART CATALOG LAYOUT: TRANSLUCENT FILTERS + TRANSLUCENT PRODUCT GRID
               ========================================================================= */
            <motion.div
              key="catalog-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* MOBILE FILTER TRIGGER BUTTON */}
              <div className={`lg:hidden col-span-1 flex items-center justify-between p-3 rounded-lg border ${
                isDarkMode ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white/50 backdrop-blur-md border-zinc-200'
              }`}>
                <span className="text-xs font-bold uppercase">Showing {sortedProducts.length} Items</span>
                <button
                  id="mobile-filter-open-btn"
                  onClick={() => setIsMobileFilterOpen(true)}
                  style={{ backgroundColor: CHERRY_PINK }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-white text-xs font-bold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
              </div>

              {/* LEFT SIDEBAR FILTERS (FLIPKART STYLE - TRANSLUCENT) */}
              <aside className={`lg:col-span-3 ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end' : 'hidden lg:block'}`}>
                <div className={`w-full max-w-xs lg:max-w-none h-full lg:h-auto overflow-y-auto lg:overflow-visible p-5 rounded-xl border ${
                  isDarkMode ? 'bg-black/30 backdrop-blur-md border-white/10 shadow-lg' : 'bg-white/50 backdrop-blur-md border-zinc-200 shadow-sm'
                } space-y-6 sticky top-24`}>
                  
                  {/* Header: Filters + Clear All */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
                    <div className="flex items-center space-x-2">
                      <SlidersHorizontal style={{ color: CHERRY_PINK }} className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-wide">Filters</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        id="clear-all-filters-btn"
                        onClick={clearAllFilters}
                        style={{ color: CHERRY_PINK }}
                        className="text-xs hover:underline font-semibold cursor-pointer uppercase"
                      >
                        Clear All
                      </button>
                      {isMobileFilterOpen && (
                        <button onClick={() => setIsMobileFilterOpen(false)} className="lg:hidden p-1 text-zinc-400">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter 1: Ineffable Sakura Assured */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                      <input
                        id="filter-sakura-assured"
                        type="checkbox"
                        checked={onlyAssured}
                        onChange={(e) => setOnlyAssured(e.target.checked)}
                        style={{ accentColor: CHERRY_PINK }}
                        className="rounded w-4 h-4 cursor-pointer"
                      />
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold">🌸 INEF Assured</span>
                        <span 
                          style={{ backgroundColor: 'rgba(250, 95, 136, 0.15)', color: CHERRY_PINK }}
                          className="text-[10px] px-1.5 py-0.2 rounded font-bold"
                        >
                          PLUS
                        </span>
                      </div>
                    </label>
                    <p className="text-[11px] text-zinc-400 pl-6.5">Quality tested & express dispatch items</p>
                  </div>

                  {/* Filter 2: Categories */}
                  <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Category</span>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { id: 'all', label: 'All Categories' },
                        { id: 'hoodies', label: 'Hoodies & Knitwear' },
                        { id: 'tees', label: 'Graphic T-Shirts' },
                        { id: 'pants', label: 'Tactical Cargo Pants' },
                        { id: 'jackets', label: 'Varsity & Outerwear' },
                        { id: 'accessories', label: 'Caps & Accessories' }
                      ].map((cat) => (
                        <label key={cat.id} className="flex items-center space-x-2 cursor-pointer py-0.5">
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === cat.id}
                            onChange={() => setSelectedCategory(cat.id)}
                            style={{ accentColor: CHERRY_PINK }}
                          />
                          <span 
                            style={selectedCategory === cat.id ? { color: CHERRY_PINK, fontWeight: 'bold' } : undefined}
                            className={selectedCategory === cat.id ? '' : 'text-zinc-600 dark:text-zinc-300'}
                          >
                            {cat.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter 3: Pink Cherry Capsule Only */}
                  <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        id="filter-only-sakura"
                        type="checkbox"
                        checked={onlySakura}
                        onChange={(e) => setOnlySakura(e.target.checked)}
                        style={{ accentColor: CHERRY_PINK }}
                        className="rounded w-4 h-4 cursor-pointer"
                      />
                      <span style={{ color: CHERRY_PINK }} className="text-xs font-bold">
                        🌸 Cherry Blossom Theme Only
                      </span>
                    </label>
                  </div>

                  {/* Filter 4: Price Range */}
                  <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Price Range</span>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { id: 'all', label: 'All Prices' },
                        { id: 'under-50', label: 'Under $50' },
                        { id: '50-100', label: '$50 to $100' },
                        { id: '100-plus', label: '$100 & Above' }
                      ].map((pr) => (
                        <label key={pr.id} className="flex items-center space-x-2 cursor-pointer py-0.5">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={priceRange === pr.id}
                            onChange={() => setPriceRange(pr.id as any)}
                            style={{ accentColor: CHERRY_PINK }}
                          />
                          <span 
                            style={priceRange === pr.id ? { color: CHERRY_PINK, fontWeight: 'bold' } : undefined}
                            className={priceRange === pr.id ? '' : 'text-zinc-600 dark:text-zinc-300'}
                          >
                            {pr.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter 5: Customer Ratings */}
                  <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Customer Ratings</span>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { rating: 4.8, label: '4.8★ & above' },
                        { rating: 4.5, label: '4.5★ & above' },
                        { rating: 0, label: 'All Ratings' }
                      ].map((r) => (
                        <label key={r.rating} className="flex items-center space-x-2 cursor-pointer py-0.5">
                          <input
                            type="radio"
                            name="rating"
                            checked={minRating === r.rating}
                            onChange={() => setMinRating(r.rating)}
                            style={{ accentColor: CHERRY_PINK }}
                          />
                          <span 
                            style={minRating === r.rating ? { color: CHERRY_PINK, fontWeight: 'bold' } : undefined}
                            className={minRating === r.rating ? '' : 'text-zinc-600 dark:text-zinc-300'}
                          >
                            {r.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Filter 6: Size Filter */}
                  <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <span className="text-xs font-bold uppercase tracking-wider block text-zinc-400">Size</span>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                        const isSelected = selectedSizeFilter === sz;
                        return (
                          <button
                            key={sz}
                            onClick={() => setSelectedSizeFilter(sz)}
                            style={isSelected ? { backgroundColor: CHERRY_PINK, color: '#ffffff', borderColor: CHERRY_PINK } : undefined}
                            className={`py-1.5 rounded text-center border font-bold transition-colors cursor-pointer ${
                              isSelected
                                ? 'shadow-xs' 
                                : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-[#FA5F88]'
                            }`}
                          >
                            {sz === 'all' ? 'All' : sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter 7: In Stock Only */}
                  <div className="space-y-2 pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        id="filter-only-instock"
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        style={{ accentColor: CHERRY_PINK }}
                        className="rounded w-4 h-4 cursor-pointer"
                      />
                      <span className="text-xs font-semibold">In Stock Only</span>
                    </label>
                  </div>

                  {/* Close for mobile */}
                  {isMobileFilterOpen && (
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      style={{ backgroundColor: CHERRY_PINK }}
                      className="w-full py-2.5 rounded-lg text-white font-bold text-xs uppercase"
                    >
                      Apply Filters
                    </button>
                  )}

                </div>
              </aside>

              {/* RIGHT SIDE: SORT STRIP + PRODUCTS LISTING (TRANSLUCENT SURFACES) */}
              <main className="lg:col-span-9 space-y-4">
                
                {/* FLIPKART-STYLE HORIZONTAL SORT BAR WITH TRANSLUCENCY */}
                <div className={`p-3 rounded-xl border ${
                  isDarkMode 
                    ? 'bg-black/30 backdrop-blur-md border-white/10 shadow-lg' 
                    : 'bg-white/50 backdrop-blur-md border-zinc-200 shadow-sm'
                } flex flex-wrap items-center justify-between gap-3`}>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-zinc-400 font-bold uppercase">Sort By:</span>
                    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar">
                      {[
                        { id: 'popularity', label: 'Popularity' },
                        { id: 'price-low', label: 'Price -- Low to High' },
                        { id: 'price-high', label: 'Price -- High to Low' },
                        { id: 'newest', label: 'Newest First' },
                        { id: 'discount', label: 'Discount' }
                      ].map((tab) => {
                        const isActive = sortBy === tab.id;
                        return (
                          <button
                            key={tab.id}
                            id={`sort-tab-${tab.id}`}
                            onClick={() => setSortBy(tab.id as any)}
                            style={isActive ? { color: CHERRY_PINK, borderColor: CHERRY_PINK, backgroundColor: 'rgba(250, 95, 136, 0.12)' } : undefined}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                              isActive
                                ? 'border-b-2 font-bold'
                                : 'text-zinc-400 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                    Showing {sortedProducts.length} results
                  </span>
                </div>

                {/* PRODUCTS LISTING */}
                {sortedProducts.length === 0 ? (
                  <div className={`py-20 px-6 rounded-xl border text-center ${
                    isDarkMode ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white/50 backdrop-blur-md border-zinc-200'
                  }`}>
                    <div 
                      style={{ backgroundColor: 'rgba(250, 95, 136, 0.15)', color: CHERRY_PINK }}
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base mb-1">No products found</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                      Your search or selected filters did not match any items. Try clearing your filters.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      style={{ backgroundColor: CHERRY_PINK }}
                      className="px-4 py-2 rounded-lg text-white text-xs font-bold cursor-pointer hover:opacity-90"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedProducts.map((product) => {
                      const isWishlisted = wishlist.includes(product.id);
                      const isSoldOut = product.stock <= 0;

                      return (
                        <div
                          key={product.id}
                          id={`product-card-${product.id}`}
                          onClick={() => {
                            setActiveProductId(product.id);
                            setSelectedImageIdx(0);
                            setSelectedSize(product.sizes[0] || 'M');
                            setSelectedQty(1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`group relative rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                            isDarkMode 
                              ? 'bg-black/25 backdrop-blur-md border-white/10 hover:bg-black/40 hover:border-[#FA5F88]/60 hover:shadow-xl hover:shadow-[#FA5F88]/15' 
                              : 'bg-white/45 backdrop-blur-md border-white/60 hover:bg-white/65 hover:border-[#FA5F88]/60 hover:shadow-md'
                          }`}
                        >
                          {/* Image Container */}
                          <div className={`relative h-64 overflow-hidden ${isDarkMode ? 'bg-black/10' : 'bg-white/10'}`}>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />

                            {/* Wishlist Button in Cherry Pink */}
                            <button
                              id={`wishlist-btn-${product.id}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onToggleWishlist) onToggleWishlist(product.id);
                              }}
                              style={isWishlisted ? { backgroundColor: CHERRY_PINK } : undefined}
                              className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-colors cursor-pointer ${
                                isWishlisted 
                                  ? 'text-white shadow-lg' 
                                  : 'bg-black/70 text-zinc-300 hover:text-[#FA5F88]'
                              }`}
                              title="Add to Wishlist"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>

                            {/* Sakura Badge */}
                            {product.isSakura && (
                              <div 
                                style={{ backgroundColor: CHERRY_PINK }}
                                className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"
                              >
                                🌸 SAKURA
                              </div>
                            )}

                            {/* Sold Out Badge */}
                            {isSoldOut && (
                              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                <span className="bg-[#111111] text-white text-xs font-bold px-3 py-1 rounded border border-zinc-700">
                                  OUT OF STOCK
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Card Info */}
                          <div className="p-4 space-y-2 flex-grow flex flex-col justify-between bg-transparent">
                            <div className="space-y-1.5">
                              
                              {/* Brand & Assured */}
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                                  INEFFABLE
                                </span>
                                {product.isAssured && (
                                  <span 
                                    style={{ color: CHERRY_PINK, backgroundColor: 'rgba(250, 95, 136, 0.12)' }}
                                    className="text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center space-x-1"
                                  >
                                    <span>INEF</span>
                                    <span className="font-serif italic">Assured</span>
                                  </span>
                                )}
                              </div>

                              {/* Product Title */}
                              <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#FA5F88] transition-colors">
                                {product.name}
                              </h3>

                              {/* Rating pill */}
                              <div className="flex items-center space-x-2 pt-0.5">
                                <span 
                                  style={{ backgroundColor: CHERRY_PINK }}
                                  className="inline-flex items-center space-x-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
                                >
                                  <span>{product.rating}</span>
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                </span>
                                <span className="text-[11px] text-zinc-500 font-medium">
                                  ({product.reviewsCount})
                                </span>
                              </div>

                              {/* Price Strip: Flipkart Style in Translucent Dark & Cherry Pink */}
                              <div className="flex items-baseline space-x-2 pt-1">
                                <span className="font-bold text-base text-zinc-900 dark:text-white">
                                  ${product.price.toFixed(2)}
                                </span>
                                <span className="text-xs text-zinc-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                                <span style={{ color: CHERRY_PINK }} className="text-xs font-bold">
                                  {product.discount}% off
                                </span>
                              </div>

                              {/* Free Delivery Tag */}
                              <span className="text-[11px] text-emerald-400 font-semibold block">
                                Free delivery by {getDeliveryDate()}
                              </span>

                              {/* Available Sizes Tag */}
                              <div className="flex items-center space-x-1 pt-1 text-[10px] text-zinc-500">
                                <span>Size:</span>
                                <span className="font-medium text-zinc-300">
                                  {product.sizes.join(', ')}
                                </span>
                              </div>
                            </div>

                            {/* Quick Add To Cart Button */}
                            <div className="pt-3 border-t border-zinc-800/80">
                              <button
                                id={`quick-add-btn-${product.id}`}
                                disabled={isSoldOut}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddProductToCart(product);
                                }}
                                style={!isSoldOut ? { backgroundColor: CHERRY_PINK } : undefined}
                                className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                                  isSoldOut 
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                                    : 'hover:opacity-90 text-white shadow-md'
                                }`}
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>{isSoldOut ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </main>
            </motion.div>
          ) : (
            /* =========================================================================
               FLIPKART PRODUCT DETAIL PAGE VIEW (COMPLETE SOLID BLACK + CHERRY PINK)
               ========================================================================= */
            <motion.div
              key="product-detail"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              {/* Back to Products Navigation Bar */}
              <div className="flex items-center justify-between border-b pb-4 border-zinc-800/80">
                <button
                  id="back-to-catalog-btn"
                  onClick={() => setActiveProductId(null)}
                  style={{ color: CHERRY_PINK }}
                  className="flex items-center space-x-2 text-xs font-bold hover:underline cursor-pointer uppercase"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to all products</span>
                </button>
                <div className="text-xs text-zinc-400">
                  Home &gt; {activeProduct?.category} &gt; <span style={{ color: CHERRY_PINK }} className="font-semibold">{activeProduct?.name}</span>
                </div>
              </div>

              {/* FLIPKART 2-COLUMN DETAIL VIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: PRODUCT IMAGES + ADD TO CART & BUY NOW BUTTONS */}
                <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
                  {/* Main Large Image */}
                  <div className="relative h-96 rounded-xl overflow-hidden bg-black/25 backdrop-blur-md border border-white/10 shadow-2xl">
                    <img
                      src={activeProduct?.images[selectedImageIdx]}
                      alt={activeProduct?.name}
                      className="w-full h-full object-cover"
                    />
                    {activeProduct?.isSakura && (
                      <div 
                        style={{ backgroundColor: CHERRY_PINK }}
                        className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded shadow"
                      >
                        🌸 SAKURA CAPSULE
                      </div>
                    )}
                    <button
                      onClick={() => activeProduct && onToggleWishlist && onToggleWishlist(activeProduct.id)}
                      style={activeProduct && wishlist.includes(activeProduct.id) ? { backgroundColor: CHERRY_PINK } : undefined}
                      className={`absolute top-3 right-3 p-2.5 rounded-full cursor-pointer ${
                        activeProduct && wishlist.includes(activeProduct.id)
                          ? 'text-white shadow-md'
                          : 'bg-black/70 text-zinc-300 hover:text-[#FA5F88]'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${activeProduct && wishlist.includes(activeProduct.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Thumbnails Row */}
                  <div className="flex items-center space-x-3">
                    {activeProduct?.images.map((img, idx) => {
                      const isSelected = selectedImageIdx === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIdx(idx)}
                          style={isSelected ? { borderColor: CHERRY_PINK } : undefined}
                          className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-black/40 ${
                            isSelected 
                              ? 'shadow-md' 
                              : 'border-zinc-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>

                  {/* DUAL MASTER FLIPKART BUTTONS: ADD TO CART & BUY NOW */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      id="pdp-add-to-cart-btn"
                      disabled={activeProduct ? activeProduct.stock <= 0 : true}
                      onClick={() => activeProduct && handleAddProductToCart(activeProduct, selectedSize, selectedQty)}
                      className="py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm uppercase flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-40 shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </button>
                    
                    <button
                      id="pdp-buy-now-btn"
                      disabled={activeProduct ? activeProduct.stock <= 0 : true}
                      onClick={() => {
                        if (!activeProduct) return;
                        handleAddProductToCart(activeProduct, selectedSize, selectedQty);
                        setCurrentPage('cart');
                      }}
                      style={{ backgroundColor: CHERRY_PINK }}
                      className="py-3.5 rounded-lg hover:opacity-90 text-white font-bold text-xs sm:text-sm uppercase flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg disabled:opacity-40"
                    >
                      <Zap className="w-4 h-4" />
                      <span>BUY NOW</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: TITLES, PRICING, OFFERS, SIZING, SPECS (TRANSLUCENT) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Title & Brand */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">INEFFABLE</span>
                      {activeProduct?.isAssured && (
                        <span 
                          style={{ color: CHERRY_PINK, backgroundColor: 'rgba(250, 95, 136, 0.12)' }}
                          className="text-[10px] font-extrabold px-2 py-0.5 rounded flex items-center space-x-1"
                        >
                          <span>INEF</span>
                          <span className="font-serif italic">Assured</span>
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold leading-tight text-white">
                      {activeProduct?.name}
                    </h1>

                    {/* Rating block */}
                    <div className="flex items-center space-x-3 pt-1">
                      <span 
                        style={{ backgroundColor: CHERRY_PINK }}
                        className="inline-flex items-center space-x-1 text-white text-xs font-bold px-2 py-0.5 rounded"
                      >
                        <span>{activeProduct?.rating}</span>
                        <Star className="w-3 h-3 fill-current" />
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        {activeProduct?.reviewsCount} Ratings & Reviews
                      </span>
                    </div>
                  </div>

                  {/* Price Display: Flipkart Style Translucent Card */}
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-black/30 backdrop-blur-md border-white/10 shadow-lg' 
                      : 'bg-white/50 backdrop-blur-md border-zinc-200 shadow-sm'
                  } space-y-1`}>
                    <span className="text-xs font-semibold text-emerald-400">Special Price</span>
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-black text-white">
                        ${activeProduct?.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-zinc-500 line-through">
                        ${activeProduct?.originalPrice.toFixed(2)}
                      </span>
                      <span style={{ color: CHERRY_PINK }} className="text-sm font-bold">
                        {activeProduct?.discount}% off
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500 block pt-1">Inclusive of all taxes</span>
                  </div>

                  {/* Available Offers: Flipkart Style */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Available Offers</span>
                    <div className="space-y-2 text-xs">
                      {activeProduct?.offers.map((offer, oIdx) => (
                        <div key={oIdx} className="flex items-start space-x-2">
                          <Tag style={{ color: CHERRY_PINK }} className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span className="text-zinc-300">{offer}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery & Pincode Check: Flipkart Style Translucent Card */}
                  <div className={`p-4 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-black/30 backdrop-blur-md border-white/10 shadow-lg' 
                      : 'bg-white/50 backdrop-blur-md border-zinc-200 shadow-sm'
                  } space-y-3`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                        <MapPin style={{ color: CHERRY_PINK }} className="w-3.5 h-3.5" />
                        <span>Delivery Options</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        id="pincode-input"
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="Enter Postal / Zip Code"
                        className={`px-3 py-2 rounded-lg border text-xs w-48 focus:outline-none focus:border-[#FA5F88] ${
                          isDarkMode 
                            ? 'bg-black/50 border-zinc-800 text-white placeholder-zinc-500' 
                            : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                        }`}
                      />
                      <button
                        id="check-pincode-btn"
                        onClick={handleCheckPincode}
                        className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-[#FA5F88] text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Check
                      </button>
                    </div>

                    {pincodeStatus ? (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>{pincodeStatus}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-400 space-y-1">
                        <p>Delivery by <strong className="text-white">{getDeliveryDate()}</strong> | Free Shipping</p>
                        <p className="text-[11px] text-zinc-500">Cash on Delivery & Instant UPI/Card available</p>
                      </div>
                    )}
                  </div>

                  {/* Size Selector */}
                  {activeProduct && activeProduct.sizes.length > 0 && activeProduct.sizes[0] !== 'Free Size' && (
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                          Select Size: <strong style={{ color: CHERRY_PINK }}>{selectedSize}</strong>
                        </span>
                        <button
                          onClick={() => setIsSizeGuideOpen(true)}
                          style={{ color: CHERRY_PINK }}
                          className="text-xs font-bold underline flex items-center space-x-1 cursor-pointer"
                        >
                          <Ruler className="w-3.5 h-3.5" />
                          <span>Size Chart</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        {activeProduct.sizes.map((sz) => {
                          const isSelected = selectedSize === sz;
                          return (
                            <button
                              key={sz}
                              id={`pdp-size-btn-${sz}`}
                              onClick={() => setSelectedSize(sz)}
                              style={isSelected ? { backgroundColor: CHERRY_PINK, borderColor: CHERRY_PINK } : undefined}
                              className={`w-12 h-10 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                isSelected
                                  ? 'text-white shadow-md'
                                  : 'bg-black/40 border-zinc-800 text-zinc-300 hover:border-[#FA5F88]'
                              }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Product Description */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Product Description</span>
                    <p className="text-xs leading-relaxed text-zinc-300">
                      {activeProduct?.description}
                    </p>
                  </div>

                  {/* Flipkart Style Specifications Table (Translucent) */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Specifications</span>
                    <div className={`border rounded-xl overflow-hidden text-xs ${
                      isDarkMode 
                        ? 'border-white/10 bg-black/30 backdrop-blur-md' 
                        : 'border-zinc-200 bg-white/50 backdrop-blur-md'
                    }`}>
                      <table className="w-full text-left">
                        <tbody className="divide-y divide-zinc-800/40">
                          {activeProduct && Object.entries(activeProduct.specs).map(([k, v], idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? (isDarkMode ? 'bg-white/[0.02]' : 'bg-zinc-50/40') : ''}>
                              <td className="p-3 font-semibold text-zinc-400 w-1/3">{k}</td>
                              <td className="p-3 text-zinc-200">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-zinc-800/80 text-center">
                    <div className={`p-3 rounded-lg border space-y-1 ${
                      isDarkMode ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white/50 border-zinc-200'
                    }`}>
                      <ShieldCheck style={{ color: CHERRY_PINK }} className="w-4 h-4 mx-auto" />
                      <span className="text-[11px] font-bold block text-white">100% Authentic</span>
                    </div>
                    <div className={`p-3 rounded-lg border space-y-1 ${
                      isDarkMode ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white/50 border-zinc-200'
                    }`}>
                      <RotateCcw style={{ color: CHERRY_PINK }} className="w-4 h-4 mx-auto" />
                      <span className="text-[11px] font-bold block text-white">7 Days Return</span>
                    </div>
                    <div className={`p-3 rounded-lg border space-y-1 ${
                      isDarkMode ? 'bg-black/30 backdrop-blur-md border-white/10' : 'bg-white/50 border-zinc-200'
                    }`}>
                      <Truck style={{ color: CHERRY_PINK }} className="w-4 h-4 mx-auto" />
                      <span className="text-[11px] font-bold block text-white">Free Shipping</span>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SIZING CHART MODAL */}
        <AnimatePresence>
          {isSizeGuideOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-[#0a0a0a] text-white rounded-xl p-6 space-y-4 shadow-2xl border border-zinc-800"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm uppercase">Size Chart (Inches)</h3>
                  <button onClick={() => setIsSizeGuideOpen(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <table className="w-full text-xs text-left border border-zinc-800 rounded">
                  <thead className="bg-[#141417] font-bold">
                    <tr>
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5">Chest</th>
                      <th className="p-2.5">Length</th>
                      <th className="p-2.5">Sleeve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    <tr><td className="p-2.5 font-bold">S</td><td className="p-2.5">24.0"</td><td className="p-2.5">26.0"</td><td className="p-2.5">24.5"</td></tr>
                    <tr style={{ backgroundColor: 'rgba(250, 95, 136, 0.15)', color: CHERRY_PINK }} className="font-bold">
                      <td className="p-2.5">M</td><td className="p-2.5">25.5"</td><td className="p-2.5">27.0"</td><td className="p-2.5">25.5"</td>
                    </tr>
                    <tr><td className="p-2.5 font-bold">L</td><td className="p-2.5">27.0"</td><td className="p-2.5">28.0"</td><td className="p-2.5">26.5"</td></tr>
                    <tr><td className="p-2.5 font-bold">XL</td><td className="p-2.5">28.5"</td><td className="p-2.5">29.0"</td><td className="p-2.5">27.5"</td></tr>
                  </tbody>
                </table>
                <p className="text-[11px] text-zinc-400">Streetwear boxy cut. Select one size smaller for regular fit.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
