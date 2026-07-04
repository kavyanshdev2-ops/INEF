/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

interface CartViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  cart: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  setCurrentPage: (page: 'shop' | 'membership' | 'home') => void;
}

export const CartView: React.FC<CartViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<number>(0);
  const [discordUsername, setDiscordUsername] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const processingFee = subtotal > 0 ? 0.99 : 0.00;
  const total = subtotal + processingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordUsername) return;

    setIsCheckingOut(true);
    setCheckoutStep(1);

    // Progressive secure terminal logs for absolute immersion
    setTimeout(() => {
      setCheckoutStep(2); // Contacting Stripe server
      setTimeout(() => {
        setCheckoutStep(3); // Verifying Discord node link
        setTimeout(() => {
          setCheckoutStep(4); // Provisioning secure backend databases
          
          // Dispatch order details - simulated client-side
          setTimeout(() => {
            const existingLogsRaw = localStorage.getItem('ineffable_audit_logs');
            const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
            existingLogs.push(`[CHECKOUT] ORDER COMPLETED FOR DISCORD USER "${discordUsername.toUpperCase()}" | TOTAL: $${total.toFixed(2)}`);
            localStorage.setItem('ineffable_audit_logs', JSON.stringify(existingLogs));

            setPaymentSuccess(true);
            setIsCheckingOut(false);
            onClearCart();
          }, 1500);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  if (paymentSuccess) {
    return (
      <div id="checkout-success-view" className={`max-w-3xl mx-auto px-6 py-32 text-center ${themeStyles.textPrimary}`}>
        <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-10 space-y-8 shadow-2xl relative overflow-hidden`}>
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b ${themeStyles.glowPrimary} blur-[60px] opacity-25 pointer-events-none`} />
          
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full ${themeStyles.accentBg} text-zinc-950 flex items-center justify-center animate-bounce shadow-xl`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase font-bold`}>
              TRANSACTION SECURED // COMPLETE
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-extrabold uppercase">
              ORDER PROVISIONED!
            </h2>
            <p className={`${themeStyles.textSecondary} text-xs font-light max-w-md mx-auto leading-relaxed`}>
              Thank you for supporting Ineffable. Your payment has cleared successfully. Our bot gateway has logged the transaction and synced updates directly to your Discord account.
            </p>
          </div>

          {/* Verification Details */}
          <div className={`${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'} rounded-xl border p-6 max-w-sm mx-auto space-y-3 font-mono text-[10px] text-left`}>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'} pb-2`}>
              <span>DESTINATION DISCORD</span>
              <span className={`${isDarkMode ? 'text-white' : 'text-zinc-900'} font-bold`}>@{discordUsername.toLowerCase()}</span>
            </div>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'} pb-2`}>
              <span>TRANSACTION STATUS</span>
              <span className="text-emerald-500 font-bold">SUCCESS_SYNCED</span>
            </div>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'} pb-2`}>
              <span>RECEIPT NUMBER</span>
              <span className={isDarkMode ? 'text-white' : 'text-zinc-900'}>#INF-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            <div className="flex justify-between">
              <span>LATENCY TERM</span>
              <span className="text-emerald-500">1.84s DEPLOY_OK</span>
            </div>
          </div>

          <button
            id="success-back-home"
            onClick={() => {
              setPaymentSuccess(false);
              setDiscordUsername('');
              setCheckoutStep(0);
              setCurrentPage('home');
            }}
            className={`px-8 py-3.5 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-850 text-white'} font-mono text-xs tracking-widest font-bold rounded-xl transition-all cursor-pointer shadow-lg`}
          >
            RETURN TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-view-container" className={`max-w-7xl mx-auto px-6 py-24 pt-32 ${themeStyles.textPrimary}`}>
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <span className={`font-mono text-xs tracking-[0.3em] ${themeStyles.accentText} uppercase block`}>
          BASKET // CHECKOUT
        </span>
        <h2 className="text-4xl md:text-6xl font-sans tracking-tight font-extrabold uppercase">
          YOUR BASKET
        </h2>
      </div>

      {cart.length === 0 ? (
        <div id="cart-empty-state" className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className={`w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-zinc-100 border-zinc-200'} border flex items-center justify-center mx-auto ${themeStyles.textSecondary}`}>
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className={`font-sans text-lg font-bold uppercase ${themeStyles.textPrimary}`}>Your basket is empty</h3>
            <p className={`${themeStyles.textSecondary} text-xs font-light`}>
              You have not added any membership upgrades or store items to your cart yet.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              id="empty-go-memberships"
              onClick={() => setCurrentPage('membership')}
              className={`px-6 py-3 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'} font-mono text-[10px] tracking-widest font-bold rounded-lg transition-colors cursor-pointer`}
            >
              MEMBERSHIP PLANS
            </button>
            <button
              id="empty-go-shop"
              onClick={() => setCurrentPage('shop')}
              className={`px-6 py-3 ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800 text-white' : 'bg-white hover:bg-zinc-50 text-zinc-900'} border ${themeStyles.borderMuted} font-mono text-[10px] tracking-widest font-bold rounded-lg transition-colors cursor-pointer`}
            >
              BROWSE PRODUCTS
            </button>
          </div>
        </div>
      ) : (
        <div id="cart-grid-container" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            <div className={`flex items-center justify-between border-b ${themeStyles.borderMuted} pb-3 font-mono text-[10px] ${themeStyles.textMuted}`}>
              <span className="uppercase tracking-widest">SELECTED ITEMS</span>
              <span className="uppercase tracking-widest">{cart.length} item(s)</span>
            </div>

            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {cart.map((item) => (
                <div
                  id={`cart-item-${item.id}`}
                  key={item.id}
                  className={`flex items-center space-x-4 ${themeStyles.bgCard} border ${themeStyles.borderMain} p-4 rounded-xl justify-between`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className={`w-12 h-12 object-cover rounded-lg border ${themeStyles.borderMuted}`}
                    />
                    <div>
                      <h4 className={`font-sans text-xs font-bold ${themeStyles.textPrimary} uppercase tracking-wider`}>
                        {item.name}
                      </h4>
                      <span className={`font-mono text-[9px] ${themeStyles.textMuted} uppercase tracking-widest block mt-0.5`}>
                        {item.type} // ${item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Quantity controls */}
                    <div className={`flex items-center space-x-1.5 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-100 border-zinc-200'} border rounded-lg px-2 py-1`}>
                      <button
                        id={`qty-minus-${item.id}`}
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className={`p-1 text-zinc-500 ${isDarkMode ? 'hover:text-white' : 'hover:text-zinc-900'} transition-colors cursor-pointer`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`font-mono text-xs ${themeStyles.textPrimary} font-bold w-4 text-center`}>
                        {item.quantity}
                      </span>
                      <button
                        id={`qty-plus-${item.id}`}
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className={`p-1 text-zinc-500 ${isDarkMode ? 'hover:text-white' : 'hover:text-zinc-900'} transition-colors cursor-pointer`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Delete item */}
                    <button
                      id={`remove-item-${item.id}`}
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-500 hover:text-rose-500 transition-colors p-1.5 cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-5">
            <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-2xl p-6 md:p-8 space-y-6 shadow-xl`}>
              <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-4`}>
                <CreditCard className={`w-4 h-4 ${themeStyles.accentText}`} />
                <h3 className={`font-mono text-xs tracking-widest font-semibold ${themeStyles.textPrimary} uppercase`}>
                  Order Summary
                </h3>
              </div>

              {/* Cost Breakdown */}
              <div className={`space-y-3 font-mono text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <div className="flex justify-between">
                  <span>SUBTOTAL</span>
                  <span className={themeStyles.textPrimary}>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>TRANSACTION PROCESSING FEE</span>
                  <span className={themeStyles.textPrimary}>${processingFee.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-xs font-extrabold ${themeStyles.textPrimary} border-t ${themeStyles.borderMuted} pt-3.5`}>
                  <span>TOTAL BILL</span>
                  <span className={themeStyles.accentText}>${total.toFixed(2)}</span>
                </div>
              </div>

              {checkoutStep > 0 && (
                <div className={`rounded-xl border p-4 space-y-2 font-mono text-[9px] ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                  <div className="flex items-center space-x-2 text-emerald-500 animate-pulse font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>SECURE TRANSACTION IN PROGRESS</span>
                  </div>
                  <div className={`space-y-1 pl-3.5 border-l ${themeStyles.borderMuted}`}>
                    <div className={checkoutStep >= 1 ? `${isDarkMode ? 'text-white' : 'text-zinc-950'} font-semibold` : ''}>[1] Initiating encrypted TLS bank handshake...</div>
                    <div className={checkoutStep >= 2 ? `${isDarkMode ? 'text-white' : 'text-zinc-950'} font-semibold` : ''}>[2] Forwarding request packets to Stripe server...</div>
                    <div className={checkoutStep >= 3 ? `${isDarkMode ? 'text-white' : 'text-zinc-950'} font-semibold` : ''}>[3] Verifying and linking Discord snowflake ID: "{discordUsername.toLowerCase()}"...</div>
                    <div className={checkoutStep >= 4 ? `${isDarkMode ? 'text-white' : 'text-zinc-950'} font-semibold` : ''}>[4] Provisioning digital nodes & server roles...</div>
                  </div>
                </div>
              )}

              {/* Checkout Form */}
              {checkoutStep === 0 && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className={`font-mono text-[9px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} tracking-widest block uppercase`}>
                      Target Discord Username (For Rank Sync)
                    </label>
                    <input
                      id="checkout-discord-username"
                      type="text"
                      required
                      value={discordUsername}
                      onChange={(e) => setDiscordUsername(e.target.value)}
                      placeholder="e.g. kavyanshshakya"
                      className={`w-full ${isDarkMode ? 'bg-zinc-900/40 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-800'} border px-4 py-3.5 rounded-lg font-mono text-xs focus:outline-none ${themeStyles.focusBorder} transition-colors`}
                    />
                    <span className={`font-sans text-[10px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'} font-light block leading-normal`}>
                      We require your accurate Discord username to automatically assign your purchased roles and badges.
                    </span>
                  </div>

                  <button
                    id="submit-checkout-btn"
                    type="submit"
                    className={`w-full py-4 mt-2 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-850 text-white'} font-mono text-xs tracking-widest font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg`}
                  >
                    <span>SECURE SECURE CHECKOUT</span>
                    <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-zinc-950' : 'text-white'}`} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
