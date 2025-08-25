
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ResponsiveLogoProps {
  className?: string;
}

const ResponsiveLogo: React.FC<ResponsiveLogoProps> = ({ className = '' }) => {
  const { theme } = useTheme();

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="https://i.ibb.co/21M7d2BR/LOGO-JJ-MECANIQUE.png"
        alt="JJ Mécanique - Pneus et mécanique mobile"
        className="h-8 sm:h-10 md:h-12 w-auto object-contain"
        style={{
          filter: theme === 'dark' ? 'brightness(1.1) contrast(1.1)' : 'none'
        }}
      />
    </div>
  );
};

export default ResponsiveLogo;
