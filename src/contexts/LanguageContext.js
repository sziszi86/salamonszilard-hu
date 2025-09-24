import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('hu');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const langFromUrl = urlParams.get('lang');
    
    if (langFromUrl && translations[langFromUrl]) {
      setCurrentLanguage(langFromUrl);
      localStorage.setItem('language', langFromUrl);
      return;
    }

    // Fallback to localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language) => {
    if (translations[language]) {
      setCurrentLanguage(language);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
        
        // Update URL parameter and reload to ensure all components update
        const url = new URL(window.location);
        url.searchParams.set('lang', language);
        window.location.href = url.toString();
      }
    }
  };

  const t = (key, section) => {
    // Ensure we have a valid current language, fallback to 'hu'
    const lang = currentLanguage && translations[currentLanguage] ? currentLanguage : 'hu';
    
    if (section) {
      return translations[lang]?.[section]?.[key] || translations['hu']?.[section]?.[key] || key;
    }
    return translations[lang]?.[key] || translations['hu']?.[key] || key;
  };

  const value = {
    currentLanguage,
    language: currentLanguage, // Add language alias for convenience
    changeLanguage,
    t,
    isClient,
    availableLanguages: Object.keys(translations)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};