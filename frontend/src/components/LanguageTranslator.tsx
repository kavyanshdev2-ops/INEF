/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { ThemeStyles } from '../lib/theme';

interface LanguageTranslatorProps {
  themeStyles: ThemeStyles;
  isDarkMode: boolean;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bho', name: 'भोजपुरी' },
  { code: 'ja', name: '日本語' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' }
];

export const LanguageTranslator: React.FC<LanguageTranslatorProps> = ({ themeStyles }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const handleSelect = (lang: typeof languages[0]) => {
    setSelectedLang(lang.name);
    setIsOpen(false);
    // Trigger google translate if element exists
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = lang.code;
      select.dispatchEvent(new Event('change'));
    }
  };

  return (
    <div className="relative">
      <button
        id="language-translator-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-3 rounded-full ${themeStyles.bgCard} border ${themeStyles.borderMuted} hover:${themeStyles.borderMain} ${themeStyles.textPrimary} transition-all cursor-pointer flex items-center space-x-1.5 text-xs font-mono`}
      >
        <Globe className="w-3.5 h-3.5 text-rose-500" />
        <span className="hidden sm:inline font-medium">{selectedLang}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-36 rounded-2xl ${themeStyles.bgCard} border ${themeStyles.borderMuted} backdrop-blur-xl shadow-xl z-50 p-1.5 space-y-1`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer ${
                selectedLang === lang.name
                  ? `${themeStyles.accentBg} text-zinc-950 font-bold`
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-white/10`
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
