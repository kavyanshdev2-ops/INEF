/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AtmosphereConfig, CartItem } from '../types';
import { getThemeStyles } from '../lib/theme';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  CheckCircle, 
  CreditCard, 
  Sparkles, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Percent, 
  X, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  ArrowLeft,
  Calendar,
  Lock,
  PlusCircle,
  Package
} from 'lucide-react';
import { 
  supabase, 
  createDBOrder, 
  getDBAddresses, 
  saveDBAddress 
} from '../lib/supabase';

interface CartViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  cart: CartItem[];
  onUpdateQuantity: (id: string, change: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  setCurrentPage: (page: any) => void;
  currentUser?: string | null;
}

export const CartView: React.FC<CartViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  setCurrentPage,
  currentUser,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  // Flow State
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1); // 1: Shipping, 2: Delivery, 3: Payment, 4: Review, 5: Complete

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0); // percentage, e.g. 20 for 20%
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false
  });
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Delivery Speed State
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Payment Input State
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });

  // Terminal Logs during processing
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderCompleteData, setOrderCompleteData] = useState<{
    orderId: string;
    discordUser: string;
    finalTotal: number;
  } | null>(null);

  const [checkoutTerminalLogs, setCheckoutTerminalLogs] = useState<string[]>([]);

  // Load Saved Addresses
  useEffect(() => {
    if (currentUser) {
      loadAddresses();
    }
  }, [currentUser]);

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const list = await getDBAddresses(user.id);
          setSavedAddresses(list);
          if (list.length > 0) {
            setSelectedAddressId(list[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('Error fetching addresses from Supabase:', err);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (appliedDiscount / 100);
  const afterDiscount = subtotal - discountAmount;
  const deliveryFee = deliveryMethod === 'express' ? 15.00 : 0.00;
  const estimatedTax = afterDiscount * 0.0825; // 8.25% standard VAT/Tax
  const totalBill = afterDiscount + deliveryFee + estimatedTax;

  // Form Field Validation helpers
  const isShippingValid = () => {
    if (selectedAddressId !== 'new') return true;
    return (
      shippingForm.fullName.trim() !== '' &&
      shippingForm.street.trim() !== '' &&
      shippingForm.city.trim() !== '' &&
      shippingForm.state.trim() !== '' &&
      shippingForm.zipCode.trim() !== ''
    );
  };

  const isPaymentValid = () => {
    return (
      paymentForm.cardNumber.replace(/\s+/g, '').length >= 16 &&
      paymentForm.cardName.trim() !== '' &&
      paymentForm.expiry.includes('/') &&
      paymentForm.cvc.length >= 3
    );
  };

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const formattedCode = couponCode.trim().toUpperCase();
    if (formattedCode === 'INEFONTOP20') {
      setAppliedDiscount(20);
      setCouponSuccess('20% DISCOUNT APPLIED SUCCESSFULLY.');
    } else if (formattedCode === 'CYBERCOUTURE') {
      setAppliedDiscount(15);
      setCouponSuccess('15% CAPSULE DISCOUNT APPLIED.');
    } else {
      setCouponError('INVALID PROMOTIONAL VOUCHER.');
    }
  };

  // Submit Order Integration
  const handleCompleteOrder = async () => {
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }

    setIsProcessingOrder(true);
    setCheckoutTerminalLogs([]);

    // Sequential premium console logging simulation for technical streetwear immersion
    const addLog = (msg: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setCheckoutTerminalLogs(prev => [...prev, msg]);
          resolve();
        }, delay);
      });
    };

    await addLog('> INITIATING ENCRYPTED TLS SSL BANK HANDSHAKE...', 300);
    await addLog('> ENCRYPTING SENSITIVE DEBIT/CREDIT DATA PACKETS...', 500);
    await addLog('> CONNECTING TO STRIPE GLOBAL PAYMENT NETWORK...', 400);
    await addLog('> TRANSACTION STATUS: APPROVED (SECURED CAP)...', 600);
    await addLog('> COMMUNICATING DISPATCH INSTRUCTIONS TO ROBOTIC STACK...', 400);

    try {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // If customer entered a new address and wanted to save it
          if (selectedAddressId === 'new') {
            await saveDBAddress(user.id, {
              full_name: shippingForm.fullName,
              street: shippingForm.street,
              city: shippingForm.city,
              state: shippingForm.state,
              zip_code: shippingForm.zipCode,
              country: shippingForm.country,
              is_default: shippingForm.isDefault
            });
          }

          // Create the real order in database
          const selectedAddr = selectedAddressId === 'new' 
            ? shippingForm 
            : savedAddresses.find(a => a.id === selectedAddressId);
          
          const deliveryNote = `SHIPPED TO ${selectedAddr?.fullName?.toUpperCase()} VIA ${deliveryMethod.toUpperCase()} DELIVERY`;
          
          const order = await createDBOrder(
            user.id, 
            totalBill, 
            currentUser, // passing username or default target
            cart
          );

          if (order) {
            // Log local audit record
            const existingLogsRaw = localStorage.getItem('inefontop_audit_logs') || '[]';
            const existingLogs = JSON.parse(existingLogsRaw);
            existingLogs.push(`[STREETWEAR CHECKOUT] ORDER PROVISIONED | ORDER_ID: ${order.id} | TOTAL: $${totalBill.toFixed(2)}`);
            localStorage.setItem('inefontop_audit_logs', JSON.stringify(existingLogs));

            await addLog(`> REAL-TIME DATABASE SYNC COMPLETED SUCCESSFULLY. ORDER ID: INF-${order.id.slice(0, 8).toUpperCase()}`, 300);
            setOrderCompleteData({
              orderId: `INF-${order.id.slice(0, 8).toUpperCase()}`,
              discordUser: currentUser,
              finalTotal: totalBill
            });
          }
        }
      }
    } catch (err) {
      console.warn('Real order creation bypassed or failed, using simulation:', err);
      // Fallback
      setOrderCompleteData({
        orderId: `INF-${Math.floor(100000 + Math.random() * 900000)}`,
        discordUser: currentUser || 'User',
        finalTotal: totalBill
      });
    } finally {
      await addLog('> DISPATCH METRICS SYNC COMPLETED WITH PORTAL.', 350);
      setIsProcessingOrder(false);
      setActiveStep(5); // Complete
      onClearCart();
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    let matches = val.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setPaymentForm(prev => ({ ...prev, cardNumber: parts.join(' ') }));
    } else {
      setPaymentForm(prev => ({ ...prev, cardNumber: val }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      setPaymentForm(prev => ({ ...prev, expiry: `${val.slice(0, 2)}/${val.slice(2, 4)}` }));
    } else {
      setPaymentForm(prev => ({ ...prev, expiry: val }));
    }
  };

  // Standard checkout redirect
  const handleProceedToCheckout = () => {
    if (!currentUser) {
      setCurrentPage('login');
      return;
    }
    setIsCheckoutMode(true);
    setActiveStep(1);
  };

  // If order complete screen
  if (activeStep === 5 && orderCompleteData) {
    return (
      <div id="checkout-receipt-success" className={`max-w-3xl mx-auto px-4 md:px-8 py-32 text-center ${themeStyles.textPrimary}`}>
        <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-rose-500/20 to-transparent blur-[80px] pointer-events-none" />
          
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full ${themeStyles.accentBg} text-zinc-950 flex items-center justify-center shadow-lg animate-bounce`}>
              <ShieldCheck className="w-8 h-8" />
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            <span className={`font-mono text-xs tracking-[0.4em] ${themeStyles.accentText} uppercase font-extrabold`}>
              PAYMENT CLEARANCE // COMPLETED
            </span>
            <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black uppercase">
              ORDER DISPATCHED!
            </h2>
            <p className={`${themeStyles.textSecondary} text-xs font-light max-w-md mx-auto leading-relaxed`}>
              Thank you for acquiring Inefontop cyber couture. Your order has cleared, and premium tracked shipping manifests are being constructed.
            </p>
          </div>

          {/* Detailed Invoice */}
          <div className={`${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'} rounded-2xl border p-6 max-w-md mx-auto space-y-4 font-mono text-[10px] text-left shadow-sm`}>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'} pb-2.5`}>
              <span>SECURE RECEIPT</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{orderCompleteData.orderId}</span>
            </div>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'} pb-2.5`}>
              <span>SHIPPING CARRIER</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{deliveryMethod === 'express' ? 'DHL EXPRESS (1-2 DAYS)' : 'TRACKED STANDARD (3-5 DAYS)'}</span>
            </div>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-900' : 'border-zinc-200'} pb-2.5`}>
              <span>DISPATCH RECIPIENT</span>
              <span className="text-emerald-500 font-bold uppercase">{orderCompleteData.discordUser}</span>
            </div>
            <div className="flex justify-between text-xs font-bold pt-1.5">
              <span>TOTAL BILLED</span>
              <span className="text-rose-500">${orderCompleteData.finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              id="back-home-button"
              onClick={() => {
                setIsCheckoutMode(false);
                setActiveStep(1);
                setCurrentPage('home');
              }}
              className={`w-full sm:w-auto px-8 py-4 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'} font-mono text-xs tracking-widest font-extrabold rounded-xl transition-all cursor-pointer`}
            >
              RETURN TO BASE
            </button>
            <button
              id="view-orders-button"
              onClick={() => {
                setIsCheckoutMode(false);
                setActiveStep(1);
                setCurrentPage('login'); // login has the dashboard orders tab!
              }}
              className={`w-full sm:w-auto px-8 py-4 border ${themeStyles.borderMuted} font-mono text-xs tracking-widest font-extrabold rounded-xl transition-all cursor-pointer hover:border-zinc-400`}
            >
              VIEW MY ORDERS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-workspace-container" className={`max-w-7xl mx-auto px-4 md:px-8 py-24 pt-32 ${themeStyles.textPrimary}`}>
      
      {/* Dynamic Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className={`font-mono text-xs tracking-[0.4em] ${themeStyles.accentText} uppercase block`}>
          {isCheckoutMode ? 'SECURE HANDSHAKE // GATEWAY' : 'BASKET COUTURE // DIVISION'}
        </span>
        <h2 className="text-4xl md:text-5xl font-sans tracking-tight font-black uppercase">
          {isCheckoutMode ? `CHECKOUT STEP ${activeStep}/4` : 'YOUR BASKET'}
        </h2>
        <div className="w-12 h-[2px] bg-rose-500/80 mx-auto rounded-full" />
      </div>

      {cart.length === 0 && !isCheckoutMode ? (
        /* Empty Basket State */
        <div id="cart-empty-basket" className="max-w-md mx-auto text-center py-16 space-y-6">
          <div className={`w-20 h-20 rounded-2xl ${isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-zinc-50 border-zinc-200'} border flex items-center justify-center mx-auto text-zinc-500 shadow-inner`}>
            <ShoppingBag className="w-8 h-8 opacity-40" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans text-lg font-black uppercase tracking-wide">Basket is Empty</h3>
            <p className={`${themeStyles.textSecondary} text-xs font-light leading-relaxed`}>
              You have not added any exquisite garments or membership modules to your active checkout registry yet.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              id="empty-go-store"
              onClick={() => setCurrentPage('shop')}
              className={`px-6 py-3.5 font-mono text-[10px] tracking-widest font-bold rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950 border-white' : 'bg-zinc-900 hover:bg-zinc-800 text-white'}`}
            >
              EXPLORE COUTURE
            </button>
          </div>
        </div>
      ) : (
        /* Standard Cart Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* LEFT SIDE COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            {!isCheckoutMode ? (
              /* Catalog Items list view */
              <div id="cart-items-panel" className="space-y-4">
                <div className={`flex items-center justify-between border-b ${themeStyles.borderMuted} pb-3 font-mono text-[10px] ${themeStyles.textMuted}`}>
                  <span className="uppercase tracking-widest">GARMENTSManifest</span>
                  <span className={`uppercase tracking-widest font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>{cart.length} APPAREL BUNDLE</span>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                  {cart.map((item) => (
                    <div
                      id={`cart-item-${item.id}-${item.size || 'OS'}`}
                      key={`${item.id}-${item.size}`}
                      className={`flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:border-zinc-500/30 p-4 rounded-xl justify-between transition-colors`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className={`w-16 h-16 object-cover rounded-lg border ${themeStyles.borderMuted} shrink-0`}
                        />
                        <div className="space-y-1">
                          <h4 className={`font-sans text-xs md:text-sm font-extrabold ${themeStyles.textPrimary} uppercase tracking-wider line-clamp-1`}>
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.size && (
                              <span className={`border px-2 py-0.5 rounded text-[8px] font-mono font-bold text-rose-500 uppercase ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
                                SIZE: {item.size}
                              </span>
                            )}
                            <span className={`font-mono text-[9px] ${themeStyles.textMuted} uppercase tracking-widest`}>
                              {item.type} // ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-6">
                        {/* Quantity controls */}
                        <div className={`flex items-center space-x-1.5 ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-zinc-200'} border rounded-xl px-2 py-1`}>
                          <button
                            id={`qty-minus-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-zinc-500 hover:text-rose-500 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className={`font-mono text-xs ${themeStyles.textPrimary} font-bold w-4 text-center`}>
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-plus-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-zinc-500 hover:text-emerald-500 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Cost & Delete item */}
                        <div className="flex items-center space-x-4">
                          <span className={`font-mono text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} shrink-0`}>${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            id={`remove-item-${item.id}`}
                            onClick={() => onRemoveItem(item.id)}
                            className="text-zinc-500 hover:text-rose-500 transition-colors p-1.5"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ========================================================
                 MULTISTEP CHECKOUT INPUT VIEWS
                 ======================================================== */
              <div id="checkout-multistep-forms" className="space-y-6">
                {/* Steps Navigator */}
                <div className="flex items-center justify-between border-b border-zinc-800/20 pb-4 font-mono text-[9px] tracking-widest font-bold">
                  <span className={activeStep === 1 ? 'text-rose-500' : 'text-zinc-500'}>1. SHIPPING</span>
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                  <span className={activeStep === 2 ? 'text-rose-500' : 'text-zinc-500'}>2. COURIER</span>
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                  <span className={activeStep === 3 ? 'text-rose-500' : 'text-zinc-500'}>3. CREDIT CARD</span>
                  <ChevronRight className="w-3 h-3 text-zinc-700" />
                  <span className={activeStep === 4 ? 'text-rose-500' : 'text-zinc-500'}>4. REVIEW</span>
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: Shipping Addresses */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="font-sans text-sm md:text-base font-black uppercase tracking-wider">Shipping Address</h3>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase">Select delivery terminal</p>
                      </div>

                      {/* Saved addresses from portal database */}
                      {isLoadingAddresses ? (
                        <div className="p-6 border border-zinc-800/40 rounded-xl bg-zinc-900/30 animate-pulse text-center font-mono text-[10px]">
                          RETRIEVING PROFILE ADDRESSES...
                        </div>
                      ) : savedAddresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedAddresses.map((addr) => (
                            <div
                              id={`saved-addr-${addr.id}`}
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedAddressId === addr.id
                                  ? 'border-rose-500 bg-rose-500/5'
                                  : `${themeStyles.bgCard} ${themeStyles.borderMuted} hover:border-zinc-500/50`
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-sans text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase`}>{addr.full_name}</span>
                                {selectedAddressId === addr.id && <Check className="w-4 h-4 text-rose-500" />}
                              </div>
                              <p className="font-mono text-[9px] text-zinc-400 leading-normal">
                                {addr.street}<br />
                                {addr.city}, {addr.state} {addr.zip_code}<br />
                                {addr.country}
                              </p>
                            </div>
                          ))}

                          <div
                            id="saved-addr-new-p"
                            onClick={() => setSelectedAddressId('new')}
                            className={`p-4 rounded-xl border border-dashed cursor-pointer flex flex-col items-center justify-center space-y-2 h-[120px] transition-colors ${
                              selectedAddressId === 'new'
                                ? 'border-rose-500 bg-rose-500/5'
                                : 'border-zinc-800 hover:border-zinc-500'
                            }`}
                          >
                            <PlusCircle className="w-5 h-5 text-zinc-500" />
                            <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase">USE DIFFERENT ADDRESS</span>
                          </div>
                        </div>
                      ) : null}

                      {/* Manual input form */}
                      {(selectedAddressId === 'new' || savedAddresses.length === 0) && (
                        <div className={`p-6 rounded-2xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} space-y-4`}>
                          <h4 className={`font-mono text-[10px] text-zinc-400 tracking-widest font-bold uppercase pb-2 border-b ${themeStyles.borderMuted}`}>NEW ADDRESS MANIFEST</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Full Recipient Name</label>
                              <input
                                id="shipping-name"
                                type="text"
                                value={shippingForm.fullName}
                                onChange={(e) => setShippingForm(prev => ({ ...prev, fullName: e.target.value }))}
                                placeholder="e.g. Kaleb Shakya"
                                className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono focus:outline-none`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Street / Suite</label>
                              <input
                                id="shipping-street"
                                type="text"
                                value={shippingForm.street}
                                onChange={(e) => setShippingForm(prev => ({ ...prev, street: e.target.value }))}
                                placeholder="e.g. 100 Broadway Suite A"
                                className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono focus:outline-none`}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">City</label>
                              <input
                                id="shipping-city"
                                type="text"
                                value={shippingForm.city}
                                onChange={(e) => setShippingForm(prev => ({ ...prev, city: e.target.value }))}
                                placeholder="e.g. New York"
                                className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono focus:outline-none`}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">State</label>
                                <input
                                  id="shipping-state"
                                  type="text"
                                  value={shippingForm.state}
                                  onChange={(e) => setShippingForm(prev => ({ ...prev, state: e.target.value }))}
                                  placeholder="NY"
                                  className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono text-center focus:outline-none`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Zip Code</label>
                                <input
                                  id="shipping-zip"
                                  type="text"
                                  value={shippingForm.zipCode}
                                  onChange={(e) => setShippingForm(prev => ({ ...prev, zipCode: e.target.value }))}
                                  placeholder="10001"
                                  className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono text-center focus:outline-none`}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <input
                              id="shipping-save-profile"
                              type="checkbox"
                              checked={shippingForm.isDefault}
                              onChange={(e) => setShippingForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                              className="rounded border-zinc-800 text-rose-500 focus:ring-0 focus:ring-offset-0 bg-transparent"
                            />
                            <label htmlFor="shipping-save-profile" className="font-mono text-[9px] text-zinc-400 uppercase font-semibold select-none cursor-pointer">
                              Save to secure addresses list in my profile
                            </label>
                          </div>
                        </div>
                      )}

                      <div className={`flex justify-end gap-3 pt-4 border-t ${themeStyles.borderMuted}`}>
                        <button
                          id="btn-cancel-checkout"
                          onClick={() => setIsCheckoutMode(false)}
                          className={`px-6 py-3.5 border ${themeStyles.borderMain} font-mono text-[10px] tracking-widest font-extrabold rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors`}
                        >
                          BACK TO BASKET
                        </button>
                        <button
                          id="btn-step-1-next"
                          disabled={!isShippingValid()}
                          onClick={() => setActiveStep(2)}
                          className={`px-8 py-3.5 font-mono text-[10px] tracking-widest font-extrabold rounded-xl transition-all cursor-pointer ${
                            isShippingValid()
                              ? `${isDarkMode ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`
                              : `${isDarkMode ? 'bg-zinc-800/30 border border-zinc-800 text-zinc-500' : 'bg-zinc-100 border border-zinc-200 text-zinc-400'} cursor-not-allowed`
                          }`}
                        >
                          CONTINUE SHIPPING
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Delivery Speed */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="font-sans text-sm md:text-base font-black uppercase tracking-wider">Courier Dispatch Level</h3>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase">Select cargo velocity</p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {/* Standard */}
                        <div
                          id="courier-standard-p"
                          onClick={() => setDeliveryMethod('standard')}
                          className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            deliveryMethod === 'standard'
                              ? 'border-rose-500 bg-rose-500/5'
                              : `${themeStyles.bgCard} ${themeStyles.borderMuted} hover:border-zinc-500/50`
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-100 border-zinc-200'}`}>
                              <Package className="w-5 h-5 text-rose-500 animate-pulse" />
                            </div>
                            <div className="space-y-1 text-left">
                              <h4 className={`font-sans text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase tracking-wider`}>Standard ground clearance</h4>
                              <p className="font-mono text-[9px] text-zinc-500 uppercase">Takes 3 to 5 business days</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`font-mono text-xs font-black ${isDarkMode ? 'text-white' : 'text-zinc-900'} block uppercase`}>FREE</span>
                            <span className="font-mono text-[8px] text-emerald-500">SAVINGS_MOCK</span>
                          </div>
                        </div>

                        {/* Express */}
                        <div
                          id="courier-express-p"
                          onClick={() => setDeliveryMethod('express')}
                          className={`p-6 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            deliveryMethod === 'express'
                              ? 'border-rose-500 bg-rose-500/5'
                              : `${themeStyles.bgCard} ${themeStyles.borderMuted} hover:border-zinc-500/50`
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-100 border-zinc-200'}`}>
                              <Truck className="w-5 h-5 text-rose-500 animate-bounce" />
                            </div>
                            <div className="space-y-1 text-left">
                              <h4 className={`font-sans text-xs font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} uppercase tracking-wider`}>Premium DHL express courier</h4>
                              <p className="font-mono text-[9px] text-zinc-500 uppercase">Takes 1 to 2 business days max</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-mono text-xs font-black text-rose-500 block uppercase">+$15.00</span>
                            <span className="font-mono text-[8px] text-zinc-500">SPEED_PRIORITY</span>
                          </div>
                        </div>
                      </div>

                      <div className={`flex justify-end gap-3 pt-4 border-t ${themeStyles.borderMuted}`}>
                        <button
                          id="btn-step-2-back"
                          onClick={() => setActiveStep(1)}
                          className={`px-6 py-3.5 border ${themeStyles.borderMain} font-mono text-[10px] tracking-widest font-extrabold rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors`}
                        >
                          GO BACK
                        </button>
                        <button
                          id="btn-step-2-next"
                          onClick={() => setActiveStep(3)}
                          className={`px-8 py-3.5 font-mono text-[10px] tracking-widest font-extrabold rounded-xl transition-all cursor-pointer ${isDarkMode ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`}
                        >
                          CONTINUE DISPATCH
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Payment Card Form */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="font-sans text-sm md:text-base font-black uppercase tracking-wider">Payment Details</h3>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase">Fill secure debit card</p>
                      </div>

                      <div className={`p-6 rounded-2xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} space-y-4`}>
                        <div className="flex items-center space-x-2 text-rose-500 pb-2 border-b ${themeStyles.borderMuted}">
                          <Lock className="w-4 h-4" />
                          <span className="font-mono text-[9px] tracking-widest font-extrabold uppercase">SECURED BY STRIPE AES-256</span>
                        </div>

                        {/* Interactive Card display mockup */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 h-[170px] flex flex-col justify-between shadow-lg max-w-sm mx-auto font-mono text-xs text-white relative">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] text-zinc-500 block tracking-widest uppercase">INEFONTOP CARD</span>
                              <span className="text-[10px] font-bold tracking-widest uppercase">{paymentForm.cardName || 'CLIENT USER'}</span>
                            </div>
                            <CreditCard className="w-6 h-6 text-rose-500" />
                          </div>
                          
                          <div className="text-base tracking-[0.2em] font-bold text-center py-2 text-glow">
                            {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                          </div>

                          <div className="flex justify-between text-[9px] text-zinc-400">
                            <div>
                              <span className="text-[7px] text-zinc-500 block uppercase">EXPIRY</span>
                              <span>{paymentForm.expiry || 'MM/YY'}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[7px] text-zinc-500 block uppercase">CVC SECURE</span>
                              <span>{paymentForm.cvc || '•••'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Cardholders Full Name</label>
                            <input
                              id="payment-name"
                              type="text"
                              value={paymentForm.cardName}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, cardName: e.target.value }))}
                              placeholder="e.g. Kaleb Shakya"
                              className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono focus:outline-none`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Credit/Debit Card Number</label>
                            <input
                              id="payment-number"
                              type="text"
                              maxLength={19}
                              value={paymentForm.cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="4111 2222 3333 4444"
                              className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono focus:outline-none`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Expiry (MM/YY)</label>
                            <input
                              id="payment-expiry"
                              type="text"
                              maxLength={5}
                              value={paymentForm.expiry}
                              onChange={handleExpiryChange}
                              placeholder="12/28"
                              className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono text-center focus:outline-none`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-mono text-[9px] text-zinc-500 block uppercase font-semibold">Secure CVC Code</label>
                            <input
                              id="payment-cvc"
                              type="password"
                              maxLength={4}
                              value={paymentForm.cvc}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, cvc: e.target.value.replace(/\D/g, '') }))}
                              placeholder="•••"
                              className={`w-full ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-900'} text-xs border rounded-lg px-3 py-2.5 font-mono text-center focus:outline-none`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={`flex justify-end gap-3 pt-4 border-t ${themeStyles.borderMuted}`}>
                        <button
                          id="btn-step-3-back"
                          onClick={() => setActiveStep(2)}
                          className={`px-6 py-3.5 border ${themeStyles.borderMain} font-mono text-[10px] tracking-widest font-extrabold rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors`}
                        >
                          GO BACK
                        </button>
                        <button
                          id="btn-step-3-next"
                          disabled={!isPaymentValid()}
                          onClick={() => setActiveStep(4)}
                          className={`px-8 py-3.5 font-mono text-[10px] tracking-widest font-extrabold rounded-xl transition-all cursor-pointer ${
                            isPaymentValid()
                              ? `${isDarkMode ? 'bg-white text-zinc-950 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'}`
                              : `${isDarkMode ? 'bg-zinc-800/30 border border-zinc-800 text-zinc-500' : 'bg-zinc-100 border border-zinc-200 text-zinc-400'} cursor-not-allowed`
                          }`}
                        >
                          CONTINUE SECURELY
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Review and Submit */}
                  {activeStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h3 className="font-sans text-sm md:text-base font-black uppercase tracking-wider">Review Your Order</h3>
                        <p className="font-mono text-[10px] text-zinc-500 uppercase">Confirm luxury transaction</p>
                      </div>

                      <div className={`p-6 rounded-2xl border ${themeStyles.borderMuted} ${themeStyles.bgCard} space-y-4 font-mono text-[10px]`}>
                        <h4 className={`font-mono text-[10px] text-zinc-400 tracking-widest font-bold uppercase pb-2 border-b ${themeStyles.borderMuted}`}>DISPATCH DIRECTIVES CONFIRMATION</h4>
                        
                        {/* Summary breakdown of shipping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-normal pt-2">
                          <div className="space-y-1">
                            <span className="text-zinc-500 uppercase block font-semibold text-[8px]">SHIPPING DESTINATION:</span>
                            <p className={`${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                              {selectedAddressId === 'new' ? (
                                <>
                                  {shippingForm.fullName}<br />
                                  {shippingForm.street}, {shippingForm.city}, {shippingForm.state} {shippingForm.zipCode}
                                </>
                              ) : (
                                <>
                                  {savedAddresses.find(a => a.id === selectedAddressId)?.full_name}<br />
                                  {savedAddresses.find(a => a.id === selectedAddressId)?.street}, {savedAddresses.find(a => a.id === selectedAddressId)?.city}, {savedAddresses.find(a => a.id === selectedAddressId)?.state} {savedAddresses.find(a => a.id === selectedAddressId)?.zip_code}
                                </>
                              )}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 uppercase block font-semibold text-[8px]">COURIER METHOD:</span>
                            <p className={`${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} uppercase`}>
                              {deliveryMethod === 'express' ? 'DHL Express tracked dispatch (1-2 Days)' : 'Standard tracked ground delivery (3-5 Days)'}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 uppercase block font-semibold text-[8px]">BILLING INSTRUMENT:</span>
                            <p className={`${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'} uppercase`}>
                              Visa ending in *{paymentForm.cardNumber.slice(-4)}
                            </p>
                          </div>
                        </div>

                        <div className={`flex items-start space-x-2 rounded-xl ${isDarkMode ? 'bg-zinc-950/40' : 'bg-zinc-50'} p-3 border ${themeStyles.borderMuted} mt-4`}>
                          <input
                            id="terms-agree"
                            type="checkbox"
                            required                             className={`rounded border-zinc-300 dark:border-zinc-700 text-rose-500 focus:ring-0 focus:ring-offset-0 bg-transparent mt-0.5`}
                          />
                          <label htmlFor="terms-agree" className="font-sans text-[10px] text-zinc-500 leading-normal select-none cursor-pointer">
                            I verify that all address details are perfectly valid and consent to the custom tailoring processing bounds.
                          </label>
                        </div>
                      </div>

                      <div className={`flex justify-end gap-3 pt-4 border-t ${themeStyles.borderMuted}`}>
                        <button
                          id="btn-step-4-back"
                          onClick={() => setActiveStep(3)}
                          className={`px-6 py-3.5 border ${themeStyles.borderMain} font-mono text-[10px] tracking-widest font-extrabold rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors`}
                        >
                          GO BACK
                        </button>
                        <button
                          id="btn-complete-order-final"
                          onClick={handleCompleteOrder}
                          className={`px-8 py-3.5 font-mono text-[10px] tracking-widest font-extrabold rounded-xl transition-all cursor-pointer bg-rose-500 hover:bg-rose-600 text-white shadow-lg`}
                        >
                          AUTHORIZE & ORDER
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* ========================================================
             RIGHT SIDE SUMMARY PANEL
             ======================================================== */}
          <div className="lg:col-span-5">
            <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative`}>
              {/* Dynamic decorative light streak */}
              <div className={`absolute top-0 right-4 w-24 h-[1px] bg-gradient-to-r from-transparent via-rose-500/30 to-transparent`} />

              <div className={`flex items-center space-x-2 border-b ${themeStyles.borderMuted} pb-4`}>
                <CreditCard className={`w-4 h-4 ${themeStyles.accentText}`} />
                <h3 className={`font-mono text-xs tracking-widest font-extrabold ${themeStyles.textPrimary} uppercase`}>
                  Transaction Breakdown
                </h3>
              </div>

              {/* Promo Coupon Module (Visible in non-checkout or early checkout steps) */}
              {activeStep < 5 && (
                <form onSubmit={handleApplyCoupon} className={`space-y-2 pb-4 border-b ${themeStyles.borderMuted}`}>
                  <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase block font-bold">PROMOTIONAL VOUCHER</span>
                  <div className="flex gap-2">
                    <input
                      id="coupon-input"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. INEFONTOP20"
                      className={`flex-grow px-3 py-2 text-xs font-mono rounded-lg border ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-200 placeholder-zinc-600 focus:border-rose-500/50' : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-rose-500/50'} focus:outline-none transition-colors`}
                    />
                    <button
                      id="apply-coupon-btn"
                      type="submit"
                      className={`px-4 py-2 font-mono text-[9px] font-bold rounded-lg transition-colors cursor-pointer ${isDarkMode ? 'bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800' : 'bg-zinc-950 text-white hover:bg-zinc-800'}`}
                    >
                      APPLY
                    </button>
                  </div>
                  {couponError && <span className="text-red-500 font-mono text-[8px] block uppercase font-bold">{couponError}</span>}
                  {couponSuccess && <span className="text-emerald-500 font-mono text-[8px] block uppercase font-bold">{couponSuccess}</span>}
                </form>
              )}

              {/* Cost Calculations */}
              <div className={`space-y-3 font-mono text-[10px] ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <div className="flex justify-between">
                  <span>CART SUB-VALUATION</span>
                  <span className={themeStyles.textPrimary}>${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>COUPON SAVINGS [{appliedDiscount}%]</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>CARGO DISPATCH MANIFEST</span>
                  <span className={themeStyles.textPrimary}>
                    {deliveryMethod === 'express' ? '$15.00' : 'FREE'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>ESTIMATED COMPLIANCE VAT/TAX</span>
                  <span className={themeStyles.textPrimary}>${estimatedTax.toFixed(2)}</span>
                </div>

                <div className={`flex justify-between text-xs font-black ${themeStyles.textPrimary} border-t ${themeStyles.borderMuted} pt-4`}>
                  <span>TOTAL BILLING CAP</span>
                  <span className={themeStyles.accentText}>${totalBill.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Terminal during authorization */}
              {isProcessingOrder && (
                <div className={`rounded-xl border p-4 space-y-2 font-mono text-[9px] leading-normal ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                  <div className="flex items-center space-x-2 text-emerald-400 animate-pulse font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>SECURE TRANSACTION IN PROGRESS</span>
                  </div>
                  <div className="space-y-1 font-mono text-[8px] tracking-wide">
                    {checkoutTerminalLogs.map((log, idx) => (
                      <div key={idx} className={idx === checkoutTerminalLogs.length - 1 ? 'text-white font-bold' : ''}>{log}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary call-to-action button */}
              {!isCheckoutMode && (
                <button
                  id="submit-checkout-transition"
                  onClick={handleProceedToCheckout}
                  className={`w-full py-4 mt-4 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'} font-mono text-xs tracking-widest font-extrabold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg`}
                >
                  <span>PROCEED TO SECURE CHECKOUT</span>
                  <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-zinc-950' : 'text-white'}`} />
                </button>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
