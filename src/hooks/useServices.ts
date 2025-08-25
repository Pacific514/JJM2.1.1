
import { useState, useEffect } from 'react';
import { lumi } from '../lib/lumi';

interface Service {
  _id: string;
  serviceId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  duration: number;
  category: string;
  options?: Array<{
    name: string;
    nameEn: string;
    price: number;
  }>;
  creator: string;
  createdAt: string;
  updatedAt: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await lumi.entities.services.list();
      
      if (response && Array.isArray(response.list)) {
        setServices(response.list);
      } else {
        console.warn('Format de réponse inattendu:', response);
        setServices([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
      setError('Erreur lors du chargement des services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices
  };
};
