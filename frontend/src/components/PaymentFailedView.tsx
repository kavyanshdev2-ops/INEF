import React from 'react';
import { AtmosphereConfig } from '../types';
import { getThemeStyles } from '../lib/theme';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

interface PaymentFailedViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  setCurrentPage: (page: any) => void;
}

export const PaymentFailedView: React.FC<PaymentFailedViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  setCurrentPage,
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-32 text-center">
      <div className={`${themeStyles.bgCard} border ${themeStyles.borderMain} rounded-3xl p-8 md:p-12 space-y-8 shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-rose-500/20 to-transparent blur-[80px] pointer-events-none" />
        
        <div className="flex justify-center">
          <div className={`w-16 h-16 rounded-full ${isDarkMode ? 'bg-rose-500 text-zinc-900' : 'bg-rose-100 text-rose-700'} flex items-center justify-center shadow-lg`}>
            <XCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <span className={`font-mono text-xs tracking-[0.4em] ${themeStyles.accentText} uppercase font-extrabold`}>
            PAYMENT FAILED
          </span>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black uppercase">
            OOPS, SOMETHING WENT WRONG
          </h2>
          <p className={`${themeStyles.textSecondary} text-xs font-light max-w-sm mx-auto leading-relaxed`}>
            We're sorry, but your payment could not be processed. Please try again or contact support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage('cart')}
            className={`w-full sm:w-auto px-8 py-4 ${isDarkMode ? 'bg-zinc-100 hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-zinc-800 text-white'} font-mono text-xs tracking-widest font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2`}
          >
            <RefreshCcw className="w-3 h-3" />
            RETRY PAYMENT
          </button>
          <button
            onClick={() => setCurrentPage('home')}
            className={`w-full sm:w-auto px-8 py-4 border ${themeStyles.borderMuted} font-mono text-xs tracking-widest font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 hover:border-zinc-400`}
          >
            <ArrowLeft className="w-3 h-3" />
            GO BACK
          </button>
        </div>
      </div>
    </div>
  );
};
