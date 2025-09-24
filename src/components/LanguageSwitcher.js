import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languageNames } from '../locales';

const LanguageSwitcher = ({ className = '' }) => {
  const { currentLanguage, changeLanguage, availableLanguages, t } = useLanguage();

  return (
    <div className={`language-switcher ${className}`}>
      <div className="dropdown">
        <button 
          className="dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {languageNames[currentLanguage]} <i className="fas fa-chevron-down"></i>
        </button>
        <ul className="dropdown-menu">
          {availableLanguages.map((lang) => (
            <li key={lang}>
              <button
                className={`dropdown-item ${currentLanguage === lang ? 'active' : ''}`}
                onClick={() => changeLanguage(lang)}
              >
                {languageNames[lang]}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageSwitcher;