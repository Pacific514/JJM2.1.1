
import { useState, useCallback } from 'react';
import { lumi } from '../lib/lumi';
import toast from 'react-hot-toast';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  serviceDate: string;
  totalAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

// 🛡️ PROTECTION CONTRE ERREURS .toFixed()
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

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer toutes les factures
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { list } = await lumi.entities.invoices.list();
      
      // Sécuriser tous les montants
      const safeInvoices = list.map((invoice: any) => ({
        ...invoice,
        totalAmount: safeNumber(invoice.totalAmount)
      }));
      
      setInvoices(safeInvoices);
    } catch (err) {
      console.error('Erreur lors du chargement des factures:', err);
      setError('Impossible de charger les factures');
      toast.error('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction de recherche de factures
  const searchInvoices = async (query: string): Promise<Invoice[]> => {
    try {
      setLoading(true);
      setError(null);
      
      // Rechercher par email, téléphone ou numéro de facture
      const { list } = await lumi.entities.invoices.list();
      
      const filteredInvoices = list.filter((invoice: any) => {
        const searchTerm = query.toLowerCase();
        return (
          invoice.customerEmail?.toLowerCase().includes(searchTerm) ||
          invoice.customerPhone?.includes(searchTerm) ||
          invoice.invoiceNumber?.toLowerCase().includes(searchTerm) ||
          invoice.customerName?.toLowerCase().includes(searchTerm)
        );
      });

      // Sécuriser tous les montants
      const safeInvoices = filteredInvoices.map((invoice: any) => ({
        ...invoice,
        totalAmount: safeNumber(invoice.totalAmount)
      }));

      return safeInvoices;
    } catch (err) {
      console.error('Erreur lors de la recherche des factures:', err);
      setError('Erreur lors de la recherche');
      toast.error('Erreur lors de la recherche des factures');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle facture
  const createInvoice = async (invoiceData: Omit<Invoice, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      
      // Sécuriser le montant avant création
      const safeInvoiceData = {
        ...invoiceData,
        totalAmount: safeNumber(invoiceData.totalAmount),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const newInvoice = await lumi.entities.invoices.create(safeInvoiceData);
      
      // Rafraîchir la liste
      await fetchInvoices();
      
      toast.success('Facture créée avec succès');
      return newInvoice;
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error('Erreur lors de la création de la facture');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une facture
  const updateInvoice = async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      setLoading(true);
      
      // Sécuriser le montant si présent
      const safeUpdates = {
        ...updates,
        ...(updates.totalAmount && { totalAmount: safeNumber(updates.totalAmount) }),
        updatedAt: new Date().toISOString()
      };

      const updatedInvoice = await lumi.entities.invoices.update(invoiceId, safeUpdates);
      
      // Rafraîchir la liste
      await fetchInvoices();
      
      toast.success('Facture mise à jour avec succès');
      return updatedInvoice;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la facture:', error);
      toast.error('Erreur lors de la mise à jour de la facture');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une facture
  const deleteInvoice = async (invoiceId: string) => {
    try {
      setLoading(true);
      
      await lumi.entities.invoices.delete(invoiceId);
      
      // Rafraîchir la liste
      await fetchInvoices();
      
      toast.success('Facture supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de la facture:', error);
      toast.error('Erreur lors de la suppression de la facture');
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
    invoices,
    loading,
    error,
    fetchInvoices,
    searchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    formatPrice,
    safeNumber,
    safeToFixed
  };
};
