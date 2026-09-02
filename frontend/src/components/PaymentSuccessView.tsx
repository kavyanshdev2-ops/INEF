/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AtmosphereConfig, PageId } from '../types';
import { getThemeStyles } from '../lib/theme';
import { CheckCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';

interface PaymentSuccessViewProps {
  activeAtmosphere: AtmosphereConfig;
  isDarkMode: boolean;
  setCurrentPage: (page: PageId) => void;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({
  activeAtmosphere,
  isDarkMode,
  setCurrentPage
}) => {
  const themeStyles = getThemeStyles(activeAtmosphere.colorTheme, isDarkMode);

  return (
    <div className="max-w-2xl mx-auto px-6 py-28 text-center space-y-8">
      <div className={`p-12 rounded-3xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-2xl shadow-2xl space-y-6`}>
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs tracking-[0.3em] text-emerald-400 font-bold uppercase block">
            TRANSACTION VERIFIED
          </span>
          <h1 className="text-3xl font-display font-bold text-zinc-950 dark:text-white uppercase">
            PAYMENT SUCCESSFUL
          </h1>
        </div>

        <p className="text-xs text-zinc-400 font-mono leading-relaxed max-w-md mx-auto">
          Your order transmission has been processed by the network. An acquisition receipt and rank activation key have been sent to your email.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="w-full sm:w-auto px-8 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-mono text-xs tracking-widest font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30"
          >
            <span>RETURN TO SANCTUARY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
