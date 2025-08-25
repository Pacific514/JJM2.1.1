
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Slide {
  id: number;
  titleFr: string;
  titleEn: string;
  subtitleFr: string;
  subtitleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  image: string;
  ctaFr: string;
  ctaEn: string;
  ctaLink: string;
  gradient: string;
}

const HeroSlider: React.FC = () => {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // ORDRE MODIFIÉ: 1. Mécanique Mobile, 2. Changement de pneus, 3. Service 7 jours
  const slides: Slide[] = [
    {
      id: 1,
      titleFr: "Mécanique Mobile",
      titleEn: "Mobile Mechanics",
      subtitleFr: "Service professionnel à domicile",
      subtitleEn: "Professional service at your location",
      descriptionFr: "Nos mécaniciens mobile se déplacent avec tout l'équipement nécessaire pour diagnostiquer et réparer votre véhicule.",
      descriptionEn: "Our mobile mechanics come with all the necessary equipment to diagnose and repair your vehicle.",
      image: "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=1920",
      ctaFr: "Prendre rendez-vous",
      ctaEn: "Book appointment",
      ctaLink: "/service-booking",
      gradient: "from-blue-900/80 via-blue-800/60 to-blue-700/40"
    },
    {
      id: 2,
      titleFr: "Changement de Pneus",
      titleEn: "Tire Change Service",
      subtitleFr: "Installation rapide et sécurisée",
      subtitleEn: "Fast and secure installation",
      descriptionFr: "Service mobile de changement de pneus saisonniers. Installation, balancement et vérification de la pression.",
      descriptionEn: "Mobile seasonal tire change service. Installation, balancing and pressure check.",
      image: "https://images.pexels.com/photos/6870331/pexels-photo-6870331.jpeg?auto=compress&cs=tinysrgb&w=1920",
      ctaFr: "Réserver maintenant",
      ctaEn: "Book now",
      ctaLink: "/service-booking",
      gradient: "from-red-900/80 via-red-800/60 to-red-700/40"
    },
    {
      id: 3,
      titleFr: "Service 7 Jours",
      titleEn: "7 Days Service",
      subtitleFr: "Disponible tous les jours",
      subtitleEn: "Available every day",
      descriptionFr: "Rendez-vous flexibles selon votre horaire. Mécaniciens disponibles 7 jours pour tous vos besoins mécaniques.",
      descriptionEn: "Flexible appointments according to your schedule. Mechanics available 7 days a week for all your mechanical needs.",
      image: "https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=1920",
      ctaFr: "Nous contacter",
      ctaEn: "Contact us",
      ctaLink: "/contact",
      gradient: "from-green-900/80 via-green-800/60 to-green-700/40"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Image de fond avec gradients sophistiqués */}
          <div className="absolute inset-0">
            <img
              src={currentSlideData.image}
              alt={language === 'fr' ? currentSlideData.titleFr : currentSlideData.titleEn}
              className="w-full h-full object-cover"
            />
            {/* Overlay avec gradients multiples */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.gradient}`}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>
          </div>

          {/* Contenu avec animations */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mb-4"
                >
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-600/90 to-red-700/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full shadow-lg">
                    {language === 'fr' ? currentSlideData.subtitleFr : currentSlideData.subtitleEn}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                    {language === 'fr' ? currentSlideData.titleFr : currentSlideData.titleEn}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-2xl"
                >
                  {language === 'fr' ? currentSlideData.descriptionFr : currentSlideData.descriptionEn}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <a
                    href={currentSlideData.ctaLink}
                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transform hover:scale-105 backdrop-blur-sm"
                  >
                    {language === 'fr' ? currentSlideData.ctaFr : currentSlideData.ctaEn}
                  </a>
                  <a
                    href="/calculator"
                    className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/80 text-white font-semibold rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {language === 'fr' ? 'Estimation gratuite' : 'Free estimate'}
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Contrôles de navigation avec gradients */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
          {/* Bouton précédent */}
          <button
            onClick={prevSlide}
            className="p-2 text-white hover:text-red-400 transition-colors rounded-full hover:bg-white/10"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Indicateurs de slides */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={nextSlide}
            className="p-2 text-white hover:text-red-400 transition-colors rounded-full hover:bg-white/10"
            aria-label="Slide suivant"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bouton play/pause */}
          <button
            onClick={togglePlayPause}
            className="p-2 text-white hover:text-red-400 transition-colors rounded-full hover:bg-white/10 ml-2"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            <Play className={`h-4 w-4 ${isPlaying ? 'opacity-50' : 'opacity-100'}`} />
          </button>
        </div>
      </div>

      {/* Informations du slide avec gradients */}
      <div className="absolute top-8 right-8 z-20">
        <div className="bg-black/30 backdrop-blur-md rounded-xl px-4 py-2 border border-white/20">
          <span className="text-white text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
