
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-3 py-2 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-105 backdrop-blur-sm text-sm"
      aria-label={`Switch to ${language === 'fr' ? 'English' : 'Français'}`}
    >
      <span className="uppercase font-bold">
        {language === 'fr' ? 'FR' : 'EN'}
      </span>
      <span className="mx-1">|</span>
      <span className="uppercase font-bold opacity-60">
        {language === 'fr' ? 'EN' : 'FR'}
      </span>
    </button>
  );
};

export default LanguageToggle;
