import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languageNames } from '../locales';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <div className="language-switcher">
      {availableLanguages.map((lang) => (
        <button
          key={lang}
          className={`lang-btn ${currentLanguage === lang ? 'active' : ''}`}
          onClick={() => changeLanguage(lang)}
          title={languageNames[lang]}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;