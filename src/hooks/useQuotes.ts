
import { useState } from 'react';
import { lumi } from '../lib/lumi';
import toast from 'react-hot-toast';

interface QuoteService {
  serviceId: string;
  serviceName: string;
  basePrice: number;
  baseSelected: boolean;
  options: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  totalPrice: number;
}

interface QuoteData {
  quoteId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  vehicleInfo: string;
  vehicleVin?: string;
  services: QuoteService[];
  subtotal: number;
  travelCost: number;
  taxes: number;
  total: number;
  preferredDate: string;
  timeSlot: string;
  distance: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// 🛡️ PROTECTION ULTRA-SÉCURISÉE CONTRE ERREURS .toFixed()
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && isFinite(parsed)) return parsed;
  }
  return 0;
};

const safeToFixed = (value: any, decimals: number = 2): string => {
  try {
    const num = safeNumber(value);
    return num.toFixed(decimals);
  } catch (error) {
    console.error('Erreur safeToFixed:', error);
    return '0.00';
  }
};

export const useQuotes = () => {
  const [loading, setLoading] = useState(false);

  const calculateQuote = (services: QuoteService[], distance: number) => {
    try {
      const subtotal = services.reduce((sum, service) => {
        const basePrice = safeNumber(service.basePrice);
        const optionsTotal = service.options.reduce((optSum, option) => {
          return optSum + (safeNumber(option.price) * safeNumber(option.quantity));
        }, 0);
        return sum + basePrice + optionsTotal;
      }, 0);
      
      const safeDistance = safeNumber(distance);
      const travelCost = Math.min(safeDistance * 0.61, 55); // Maximum 55$
      const servicesTotal = subtotal + travelCost;
      const taxes = servicesTotal * 0.14975; // TPS 5% + TVQ 9.975%
      const total = servicesTotal + taxes;

      return {
        subtotal: safeNumber(subtotal),
        travelCost: safeNumber(travelCost),
        taxes: safeNumber(taxes),
        total: safeNumber(total)
      };
    } catch (error) {
      console.error('Erreur calcul devis:', error);
      return {
        subtotal: 0,
        travelCost: 0,
        taxes: 0,
        total: 0
      };
    }
  };

  const createQuote = async (quoteData: QuoteData) => {
    try {
      setLoading(true);
      
      // Sécuriser tous les montants avant sauvegarde
      const safeQuoteData = {
        ...quoteData,
        subtotal: safeNumber(quoteData.subtotal),
        travelCost: safeNumber(quoteData.travelCost),
        taxes: safeNumber(quoteData.taxes),
        total: safeNumber(quoteData.total),
        distance: safeNumber(quoteData.distance),
        services: quoteData.services.map(service => ({
          ...service,
          basePrice: safeNumber(service.basePrice),
          totalPrice: safeNumber(service.totalPrice),
          options: service.options.map(option => ({
            ...option,
            price: safeNumber(option.price),
            quantity: safeNumber(option.quantity),
            total: safeNumber(option.total)
          }))
        }))
      };

      await lumi.entities.quotes.create(safeQuoteData);
      
      toast.success('Devis créé avec succès!');
      return safeQuoteData;
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
      toast.error('Erreur lors de la création du devis');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour formater les prix de manière sécurisée
  const formatPrice = (price: any): string => {
    return safeToFixed(price);
  };

  return {
    loading,
    calculateQuote,
    createQuote,
    formatPrice,
    safeNumber,
    safeToFixed
  };
};
