import React, { useEffect, useState } from 'react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { getPaymentStatus } from '../lib/payment';

interface PaymentSuccessViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  setCurrentPage: (page: any) => void;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkOrderStatus = async () => {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get('order_id');

      if (orderId) {
        try {
          const data = await getPaymentStatus(orderId);
          setOrderData(data);
        } catch (err) {
          setError('Failed to verify payment status');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkOrderStatus();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-32 text-center">
      <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-emerald-500/20 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-emerald-500 text-zinc-900' : 'bg-emerald-100 text-emerald-700'} flex items-center justify-center shadow-lg animate-bounce`}>
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <span className={`font-mono text-xs tracking-[0.4em] ${themeStyles.accentText} uppercase font-extrabold`}>
            PAYMENT SUCCESSFUL
          </span>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black uppercase">
            ORDER CONFIRMED
          </h2>
          <p className={`${themeStyles.textSecondary} text-xs font-light max-w-sm mx-auto leading-relaxed`}>
            Thank you for your purchase! Your order is now being processed and will be shipped soon.
          </p>
        </div>

        {loading ? (
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} rounded-2xl border p-6 max-w-md mx-auto space-y-4 font-mono text-[10px]`}>
            <div className="animate-pulse">Verifying payment status...</div>
          </div>
        ) : error ? (
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'} rounded-2xl border p-6 max-w-md mx-auto space-y-4 font-mono text-[10px]`}>
            <div className="text-rose-500">{error}</div>
          </div>
        ) : orderData ? (
          <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-600'} rounded-2xl border p-6 max-w-md mx-auto space-y-4 font-mono text-[10px] text-left shadow-sm`}>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-1.5`}>
              <span>ORDER ID</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                {orderData.order_id}
              </span>
            </div>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-1.5`}>
              <span>AMOUNT PAID</span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
                ₹{orderData.order_amount}
              </span>
            </div>
            <div className={`flex justify-between border-b ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} pb-1.5`}>
              <span>PAYMENT STATUS</span>
              <span className="text-emerald-500 font-bold uppercase">{orderData.order_status}</span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className={`w-full sm:w-auto px-8 py-4 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'} font-mono text-xs tracking-widest font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2`}
          >
            <ArrowLeft className="w-3 h-3" />
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    </div>
  );
};
