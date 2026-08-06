/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig, CartItem, PageId } from '../types';
import { getThemeStyles } from '../lib/theme';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface CartViewProps {
  setCurrentPage: (page: PageId) => void;
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currentUser?: any;
}

export const CartView: React.FC<CartViewProps> = ({
  setCurrentPage,
  activeAtmosphere,
  isDarkMode,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      onClearCart();
      setCurrentPage('payment-success');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-28 space-y-12">
      <div className="text-center space-y-4">
        <span className="font-mono text-xs tracking-[0.3em] text-rose-500 font-bold uppercase block">
          YOUR ACQUISITION MANIFEST
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-zinc-950 dark:text-white uppercase">
          SHOPPING CART ({cart.reduce((a, b) => a + b.quantity, 0)})
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className={`p-16 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl text-center space-y-6 max-w-xl mx-auto`}>
          <ShoppingBag className="w-16 h-16 text-rose-500/50 mx-auto" />
          <h3 className="font-display font-bold text-xl text-zinc-950 dark:text-white">
            YOUR CART IS EMPTY
          </h3>
          <p className="text-xs text-zinc-400 font-mono">
            Explore our collection or membership ranks to add items.
          </p>
          <button
            onClick={() => setCurrentPage('shop')}
            className="px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-mono text-xs tracking-widest font-bold transition-all cursor-pointer inline-flex items-center space-x-2 shadow-lg shadow-rose-600/30"
          >
            <span>EXPLORE SHOP</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart items list */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className={`p-4 sm:p-6 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
              >
                <div className="flex items-center space-x-4">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover bg-zinc-900 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-sm text-zinc-950 dark:text-white uppercase truncate">
                      {item.name}
                    </h4>
                    <span className="font-mono text-xs text-rose-500 font-bold">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/20">
                  <div className="flex items-center space-x-2 bg-black/20 border border-white/10 rounded-full px-3 py-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 text-zinc-500 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout summary */}
          <div className="lg:col-span-4">
            <div className={`p-8 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl space-y-6 sticky top-28`}>
              <h3 className="font-display font-bold text-lg text-zinc-950 dark:text-white uppercase border-b border-zinc-200 dark:border-white/10 pb-4">
                SUMMARY
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>SUBTOTAL</span>
                  <span className="text-zinc-950 dark:text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>NETWORK TAX</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">INCLUDED</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-zinc-950 dark:text-white pt-3 border-t border-zinc-200 dark:border-white/10">
                  <span>TOTAL DUE</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-mono text-xs tracking-widest font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isCheckingOut ? 'PROCESSING TRANSACTION...' : 'EXECUTE CHECKOUT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
