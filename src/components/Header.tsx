
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import ResponsiveLogo from './ResponsiveLogo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();

  const isActivePage = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/calculator', label: language === 'fr' ? 'Estimation' : 'Estimate' },
    { path: '/contact', label: t('nav.contact') }
  ];

  return (
    <header className="relative sticky top-0 z-50 overflow-hidden">
      {/* Arrière-plan avec gradients sophistiqués */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/30 via-black to-blue-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/70 to-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-10">
            <div className="transform scale-110 sm:scale-125 md:scale-100 origin-left">
              <ResponsiveLogo />
            </div>
          </Link>

          {/* Navigation desktop - CENTRÉ ET ESPACEMENT RÉDUIT */}
          <nav className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-2 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    isActivePage(item.path)
                      ? 'text-red-400 bg-gradient-to-r from-red-900/40 to-red-800/40 shadow-lg shadow-red-500/20 border border-red-500/30'
                      : 'text-white hover:text-red-400 hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30 hover:shadow-lg hover:shadow-red-500/10 border border-transparent hover:border-red-500/20'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Actions desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Bouton rouge - Réservation */}
            <Link
              to="/service-booking"
              className="flex items-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-2 py-2 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105 backdrop-blur-sm text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              {language === 'fr' ? 'Réservation' : 'Booking'}
            </Link>
            
            {/* Bouton bleu - Estimation avec icône calculator */}
            <Link
              to="/calculator"
              className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-2 py-2 rounded-xl transition-all duration-300 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105 backdrop-blur-sm text-xs"
            >
              <Calculator className="h-3 w-3 mr-1" />
              {language === 'fr' ? 'Estimation' : 'Estimate'}
            </Link>
            
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Menu mobile button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-white hover:text-red-400 hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30 transition-all duration-300 shadow-lg backdrop-blur-sm border border-transparent hover:border-red-500/20"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-red-900/20 to-blue-900/20 backdrop-blur-lg rounded-xl"></div>
            <div className="relative border-t border-gray-700/50 p-4">
              <div className="space-y-3">
                {/* Navigation links */}
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 backdrop-blur-sm ${
                      isActivePage(item.path)
                        ? 'text-red-400 bg-gradient-to-r from-red-900/40 to-red-800/40 shadow-lg shadow-red-500/20 border border-red-500/30'
                        : 'text-white hover:text-red-400 hover:bg-gradient-to-r hover:from-red-900/30 hover:to-red-800/30 border border-transparent hover:border-red-500/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Boutons d'action mobile */}
                <div className="pt-4 space-y-3 border-t border-gray-700/50">
                  <Link
                    to="/service-booking"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold w-full shadow-lg shadow-red-500/30 backdrop-blur-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Réservation' : 'Booking'}
                  </Link>
                  <Link
                    to="/calculator"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-xl transition-all duration-300 font-semibold w-full shadow-lg shadow-blue-500/30 backdrop-blur-sm"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Estimation' : 'Estimate'}
                  </Link>
                  
                  {/* Boutons de langue et thème dans le menu mobile */}
                  <div className="flex justify-center space-x-4 pt-2">
                    <LanguageToggle />
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
