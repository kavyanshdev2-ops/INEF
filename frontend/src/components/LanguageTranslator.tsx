/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, MoreHorizontal } from 'lucide-react';
import { ThemeStyles } from '../lib/theme';

interface LanguageTranslatorProps {
  themeStyles: ThemeStyles;
  isDarkMode?: boolean;
}

const LANGUAGES = [
  { code: 'en', name: 'English', localName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', localName: 'Español', flag: '🇪🇸' },
  { code: 'bho', name: 'Bhojpuri', localName: 'भोजपुरी', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', localName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl', name: 'Dutch', localName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ar', name: 'Arabic', localName: 'العربية', flag: '🇸🇦' },
  { code: 'zh-CN', name: 'Chinese Simplified', localName: '汉语', flag: '🇨🇳' },
  { code: 'de', name: 'German', localName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', localName: 'Русский', flag: '🇷🇺' },
  { code: 'fil', name: 'Filipino', localName: 'Filipino', flag: '🇵🇭' },
  { code: 'fr', name: 'French', localName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', localName: 'Italiano', flag: '🇮🇹' }
];

export const LanguageTranslator: React.FC<LanguageTranslatorProps> = ({ themeStyles, isDarkMode = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLangCode, setActiveLangCode] = useState('en');
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Read current active language from google translation cookie googtrans and sync with Google's select element
  useEffect(() => {
    const getActiveLanguage = () => {
      const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
      if (match && match[1]) {
        return match[1];
      }
      return 'en';
    };

    setActiveLangCode(getActiveLanguage());

    // Continuously look for Google's select element in the DOM and keep it synchronized
    const interval = setInterval(() => {
      const select = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
      if (select) {
        const currentCookieLang = getActiveLanguage();
        let targetValue = currentCookieLang;
        const optionExists = Array.from(select.options).some(opt => opt.value === currentCookieLang);
        if (!optionExists && currentCookieLang === 'en') {
          targetValue = ''; // default fallback for original page language (English)
        }
        
        if (select.value !== targetValue) {
          select.value = targetValue;
          select.dispatchEvent(new Event('change'));
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200); // Small delay to allow cursor movement to the dropdown
  };

  const handleLanguageSelect = (langCode: string) => {
    setIsOpen(false);

    // Delete existing cookies on all paths/domains first to ensure a clean slate
    const domains = [
      window.location.hostname,
      `.${window.location.hostname}`,
      'localhost',
      '.localhost',
      '.pages.dev',
      '.inef-52b.pages.dev'
    ];

    domains.forEach(domain => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    });
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';

    // Set google translation cookies
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}; SameSite=Lax`;

    // Try setting it on the primary apex domain if we are on a subdomain
    const hostParts = window.location.hostname.split('.');
    if (hostParts.length > 2) {
      const parentDomain = '.' + hostParts.slice(-2).join('.');
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${parentDomain}; SameSite=Lax`;
    }

    setActiveLangCode(langCode);

    // Try to trigger programmatic select change instantly
    const select = document.querySelector('select.goog-te-combo') as HTMLSelectElement;
    if (select) {
      let targetValue = langCode;
      const optionExists = Array.from(select.options).some(opt => opt.value === langCode);
      if (!optionExists && langCode === 'en') {
        targetValue = '';
      }
      select.value = targetValue;
      select.dispatchEvent(new Event('change'));
    }
  };

  const activeLang = LANGUAGES.find(l => l.code === activeLangCode) || LANGUAGES[0];

  return (
    <div
      ref={containerRef}
      id="custom-language-translator"
      className="relative shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-[38px] h-[38px] rounded-xl border flex items-center justify-center shadow-sm transition-all duration-300 cursor-pointer ${themeStyles.borderMuted} ${themeStyles.bgCard} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:border-zinc-500/50`}
        title="Select Language"
      >
        <Globe className="w-4.5 h-4.5 opacity-80 shrink-0" />
      </button>

      {isOpen && (
        <div
          id="translator-dropdown"
          className={`absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto rounded-xl border shadow-2xl z-50 ${themeStyles.bgCard} ${themeStyles.borderMain} scrollbar-thin ${themeStyles.scrollbarThumb}`}
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="p-1.5 space-y-0.5">
            {LANGUAGES.map((lang) => {
              const isActive = lang.code === activeLangCode;
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? `${themeStyles.accentBg} text-zinc-950 font-bold`
                      : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-zinc-500/10`
                  }`}
                >
                  <span className="flex items-center space-x-3.5 font-sans text-xs">
                    <span className="text-lg leading-none shrink-0 group-hover:scale-110 transition-transform duration-200">{lang.flag}</span>
                    <span className="flex flex-col">
                      <span className="font-medium">{lang.name}</span>
                      <span className={`text-[10px] leading-none ${isActive ? 'text-zinc-950/70' : themeStyles.textMuted}`}>
                        {lang.localName}
                      </span>
                    </span>
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
