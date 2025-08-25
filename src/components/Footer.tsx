
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Send, CreditCard, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import toast from 'react-hot-toast';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    // Simulation d'inscription à l'infolettre
    setTimeout(() => {
      toast.success(t('footer.newsletter.success'));
      setEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  // Icône TikTok personnalisée
  const TikTokIcon = ({ className }: { className: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <footer className="relative text-white overflow-hidden">
      {/* Arrière-plan avec gradients et effets */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-900/50 to-black"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et Suivez-nous */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl">
              <img
                src="https://static.lumi.new/40/40780457fce846725bf6a6ff21f73154.webp"
                alt="JJ Mécanique"
                className="h-16 mb-4 object-contain"
              />
              <p className="text-gray-300 mb-6">
                {t('footer.description')}
              </p>

              {/* Réseaux sociaux */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-red-400">{t('footer.follow')}</h4>
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="text-gray-300 hover:text-red-400 transition-all duration-300 p-2 rounded-lg hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-red-400 transition-all duration-300 p-2 rounded-lg hover:bg-red-500/10 hover:shadow-lg hover:shadow-red-500/20"
                    aria-label="TikTok"
                  >
                    <TikTokIcon className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Services et Navigation */}
          <div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl h-full">
              <h3 className="text-lg font-semibold mb-4 text-red-400">{t('footer.services.title')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group">
                    <span className="text-red-400 mr-2 group-hover:scale-110 transition-transform">•</span>
                    {t('footer.services.seasonal')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group">
                    <span className="text-red-400 mr-2 group-hover:scale-110 transition-transform">•</span>
                    {t('footer.services.repair')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group">
                    <span className="text-red-400 mr-2 group-hover:scale-110 transition-transform">•</span>
                    {t('footer.services.oil')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group">
                    <span className="text-red-400 mr-2 group-hover:scale-110 transition-transform">•</span>
                    {t('footer.services.battery')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group">
                    <span className="text-red-400 mr-2 group-hover:scale-110 transition-transform">•</span>
                    {t('footer.services.brakes')}
                  </Link>
                </li>
                <li>
                  <Link to="/calculator" className="text-gray-300 hover:text-red-400 transition-all duration-300 flex items-center group">
                    <span className="text-red-400 mr-2 group-hover:scale-110 transition-transform">•</span>
                    {t('footer.services.calculator')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Informations */}
          <div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl h-full">
              <h3 className="text-lg font-semibold mb-4 text-red-400">{t('footer.contact.info')}</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-center group">
                  <Phone className="h-5 w-5 mr-3 text-red-400 group-hover:scale-110 transition-transform" />
                  <a href="tel:+15145550123" className="text-gray-300 hover:text-red-400 transition-colors">
                    (514) 430-0262
                  </a>
                </div>
                <div className="flex items-center group">
                  <Mail className="h-5 w-5 mr-3 text-red-400 group-hover:scale-110 transition-transform" />
                  <a href="mailto:info@jjmecanique.ca" className="text-gray-300 hover:text-red-400 transition-colors">
                    info@jjmecanique.ca
                  </a>
                </div>
                <div className="flex items-start group">
                  <MapPin className="h-5 w-5 mr-3 text-red-400 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="text-gray-300">
                    <div>{t('footer.service.area')}</div>
                    <div className="text-sm text-gray-400">{t('footer.service.radius')}</div>
                    <div className="text-sm text-gray-400">Frais déplacement: 0,76$ /km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Infolettre */}
          <div>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30 shadow-xl h-full">
              <h3 className="text-lg font-semibold mb-4 text-red-400">{t('footer.newsletter.title')}</h3>
              <p className="text-gray-300 text-sm mb-4">
                {t('footer.newsletter.description')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.newsletter.email')}
                  className="w-full px-3 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-gray-400 mb-3 backdrop-blur-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105"
                >
                  {isSubscribing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {t('footer.newsletter.subscribe')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Logo Entreprise Québécoise */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/30 shadow-xl">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Quebec_flag.png/960px-Quebec_flag.png" 
              alt="Entreprise Québécoise" 
              className="h-12"
            />
          </div>
        </div>

        {/* Logos moyens de paiement - TAILLE RÉDUITE */}
        <div className="mt-8">
          <div className="text-center mb-4">
            <h4 className="text-lg font-semibold text-red-400 mb-4">Moyens de paiement acceptés</h4>
            <div className="flex justify-center items-center space-x-3">
              {/* Visa - Plus petit */}
              <div className="w-10 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">VISA</span>
              </div>
              
              {/* Mastercard - Plus petit */}
              <div className="w-10 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">MC</span>
              </div>
              
              {/* Interac Débit - Plus petit */}
              <div className="w-10 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-bold">INT</span>
              </div>
              
              {/* Argent comptant - Seulement icône dollar plus petite */}
              <div className="w-10 h-6 bg-gradient-to-r from-amber-400 to-amber-500 rounded flex items-center justify-center shadow-md">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Liens légaux et copyright avec cœur animé */}
        <div className="border-t border-gray-700/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright avec cœur animé Font Awesome */}
            <p className="text-gray-300 text-sm mb-4 md:mb-0 flex items-center">
              Fait avec{' '}
              <i className="fas fa-heart text-red-500 mx-1 animate-pulse" style={{
                animation: 'heartbeat 1.5s ease-in-out infinite'
              }}></i>
              {' '}par Lumi & Jimmy © 2025 JJ Mécanique. Tous droits réservés.
            </p>
            
            {/* Liens légaux */}
            <div className="flex flex-wrap gap-6">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-red-400 transition-all duration-300 text-sm hover:shadow-lg"
              >
                {t('footer.login')}
              </Link>
              <Link 
                to="/terms-conditions" 
                className="text-gray-300 hover:text-red-400 transition-all duration-300 text-sm hover:shadow-lg"
              >
                {t('footer.terms.conditions')}
              </Link>
              <Link 
                to="/privacy-policy" 
                className="text-gray-300 hover:text-red-400 transition-all duration-300 text-sm hover:shadow-lg"
              >
                {t('footer.privacy.policy')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Styles CSS pour l'animation du cœur */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
