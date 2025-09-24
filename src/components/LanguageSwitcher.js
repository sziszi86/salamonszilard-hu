import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languageNames } from '../locales';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  const getLanguageIcon = (lang) => {
    switch (lang) {
      case 'hu':
        return (
          <span className="flag-icon">
            🇭🇺
          </span>
        );
      case 'de':
        return (
          <span className="flag-icon">
            🇩🇪
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="language-switcher">
      {availableLanguages.map((lang) => (
        <button
          key={lang}
          className={`lang-btn ${currentLanguage === lang ? 'active' : ''}`}
          onClick={() => changeLanguage(lang)}
          title={languageNames[lang]}
        >
          {getLanguageIcon(lang)}
          <span className="lang-text">{lang.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;