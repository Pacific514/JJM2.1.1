
import React from 'react';
import { motion } from 'framer-motion';
import { Car, Clock, Shield, Users, Calendar, Calculator } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useServices } from '../hooks/useServices';
import HeroSlider from '../components/HeroSlider';

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const { services } = useServices();

  // Prendre les 4 premiers services
  const featuredServices = services.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-red-900/20">
      {/* Hero Section avec Slider */}
      <section className="relative overflow-hidden">
        <HeroSlider />
      </section>

      {/* Section Pourquoi nous choisir - SANS ICÔNES */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              {t('home.advantages.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('home.advantages.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t('home.advantage.mobile.title'),
                description: t('home.advantage.mobile.desc'),
                color: 'blue'
              },
              {
                title: t('home.advantage.fast.title'),
                description: t('home.advantage.fast.desc'),
                color: 'green'
              },
              {
                title: t('home.advantage.quality.title'),
                description: t('home.advantage.quality.desc'),
                color: 'red'
              },
              {
                title: t('home.advantage.certified.title'),
                description: t('home.advantage.certified.desc'),
                color: 'purple'
              }
            ].map((advantage, index) => {
              const colorClasses = {
                blue: 'from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800',
                green: 'from-green-100 to-green-200 dark:from-green-900 dark:to-green-800',
                red: 'from-red-100 to-red-200 dark:from-red-900 dark:to-red-800',
                purple: 'from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800'
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative overflow-hidden"
                >
                  <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 group-hover:shadow-2xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                    
                    <div className="relative text-center">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                        {advantage.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300">
                        {advantage.description}
                      </p>
                    </div>

                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-${advantage.color}-600 to-${advantage.color}-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section Nos Services - 4 services SANS OPTIONS avec 2 boutons */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredServices.map((service: any, index: number) => (
              <motion.div
                key={service.serviceId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative overflow-hidden"
              >
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 group-hover:shadow-2xl">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
                  
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {language === 'fr' ? service.nameFr : service.nameEn}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {language === 'fr' ? service.descriptionFr : service.descriptionEn}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold text-blue-600">
                        {(service.basePrice || 0).toFixed(2)}$ CAD
                      </span>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{service.estimatedDuration} min</span>
                      </div>
                    </div>

                    {/* Boutons Réservation et Estimation */}
                    <div className="space-y-3">
                      <a
                        href="/service-booking"
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        {language === 'fr' ? 'Réservation' : 'Book Now'}
                      </a>
                      <a
                        href="/calculator"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        {language === 'fr' ? 'Estimation' : 'Get Quote'}
                      </a>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA - Prêt à réserver (INCHANGÉ) */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-blue-600"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-blue-500/20"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative px-8 py-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {t('home.cta.title')}
                </h2>
                <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                  {t('home.cta.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <a
                    href="/services"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    <Car className="h-5 w-5 mr-2" />
                    {t('home.cta.view.all')}
                  </a>
                  <a
                    href="/service-booking"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    {t('home.cta.book.now')}
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
