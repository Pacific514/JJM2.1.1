
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  Settings, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  FileText,
  Download,
  Eye,
  X,
  Edit,
  Save,
  Cancel,
  CreditCard,
  Camera,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
  Plus
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useInvoices } from '../hooks/useInvoices';
import { lumi } from '../lib/lumi';
import toast from 'react-hot-toast';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  avatar?: string;
}

interface Purchase {
  _id: string;
  invoiceNumber: string;
  serviceName: string;
  totalAmount: number;
  status: 'paid' | 'pending' | 'cancelled';
  date: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  last4?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  address: string;
  total: number;
}

const ClientPortal: React.FC = () => {
  const { t, language } = useLanguage();
  const { searchInvoices } = useInvoices();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    avatar: ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfile, setEditProfile] = useState<UserProfile>({ ...userProfile });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // 🔐 Vérification authentification au chargement
  useEffect(() => {
    const savedAuth = localStorage.getItem('jj_client_auth');
    const savedEmail = localStorage.getItem('jj_client_email');
    
    if (savedAuth === 'true' && savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
      loadUserData(savedEmail);
    }
  }, []);

  // 📊 Chargement des données utilisateur
  const loadUserData = async (email: string) => {
    try {
      const invoices = await searchInvoices(email);
      if (invoices && invoices.length > 0) {
        const purchaseData = invoices.map(invoice => ({
          _id: invoice._id,
          invoiceNumber: invoice.invoiceNumber,
          serviceName: invoice.serviceName,
          totalAmount: invoice.totalAmount,
          status: invoice.status,
          date: invoice.createdAt
        }));
        setPurchases(purchaseData);
        
        // Charger profil depuis première facture
        const firstInvoice = invoices[0];
        setUserProfile({
          name: firstInvoice.customerName || '',
          email: firstInvoice.customerEmail || email,
          phone: firstInvoice.customerPhone || '',
          address: '',
          city: '',
          postalCode: '',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150'
        });
        setEditProfile({
          name: firstInvoice.customerName || '',
          email: firstInvoice.customerEmail || email,
          phone: firstInvoice.customerPhone || '',
          address: '',
          city: '',
          postalCode: '',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150'
        });
      }

      // Charger rendez-vous simulés
      setAppointments([
        {
          id: 'apt-001',
          date: '2025-01-20',
          time: '14:00',
          service: 'Changement de pneus d\'hiver',
          status: 'confirmed',
          address: '123 Rue Test, Montréal',
          total: 320.50
        },
        {
          id: 'apt-002',
          date: '2025-01-25',
          time: '10:00',
          service: 'Changement d\'huile',
          status: 'pending',
          address: '456 Rue Example, Laval',
          total: 89.99
        }
      ]);

      // Charger moyens de paiement simulés
      setPaymentMethods([
        {
          id: 'pm-001',
          type: 'card',
          last4: '4242',
          brand: 'Visa',
          isDefault: true
        },
        {
          id: 'pm-002',
          type: 'paypal',
          email: email,
          isDefault: false
        }
      ]);

    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  // 🔑 Connexion corrigée
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    setIsLoading(true);
    try {
      // Simulation authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('jj_client_auth', 'true');
      localStorage.setItem('jj_client_email', loginEmail);
      
      setIsAuthenticated(true);
      setUserEmail(loginEmail);
      await loadUserData(loginEmail);
      
      toast.success('Connexion réussie !');
    } catch (error) {
      toast.error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('jj_client_auth');
    localStorage.removeItem('jj_client_email');
    setIsAuthenticated(false);
    setUserEmail('');
    setPurchases([]);
    setAppointments([]);
    setPaymentMethods([]);
    setUserProfile({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      avatar: ''
    });
    toast.success('Déconnexion réussie');
  };

  // ✏️ Modification profil
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditProfile({ ...userProfile });
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editProfile });
    setIsEditingProfile(false);
    toast.success('Profil mis à jour');
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...userProfile });
    setIsEditingProfile(false);
  };

  // 📷 Upload avatar
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      // Simulation upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAvatarUrl = 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=150';
      setUserProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
      setEditProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
      
      toast.success('Photo de profil mise à jour');
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 💳 Gestion moyens de paiement
  const addPaymentMethod = () => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: 'card',
      last4: '1234',
      brand: 'Mastercard',
      isDefault: false
    };
    setPaymentMethods(prev => [...prev, newMethod]);
    toast.success('Moyen de paiement ajouté');
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast.success('Moyen de paiement supprimé');
  };

  // 📅 Gestion rendez-vous
  const cancelAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
      )
    );
    toast.success('Rendez-vous annulé');
  };

  // 🎨 Interface de connexion avec gradients - UNE SEULE PAGE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-red-900/20 flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        >
          {/* Arrière-plan avec gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-red-50/50 dark:from-blue-900/20 dark:to-red-900/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>

          <div className="relative p-8">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-xl shadow-blue-500/20">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                Espace Client
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Connectez-vous pour accéder à vos factures et informations
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 flex items-center justify-center shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  // 🏠 Interface principale espace client avec gradients
  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: User },
    { id: 'purchases', label: 'Mes achats', icon: ShoppingBag },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar },
    { id: 'payments', label: 'Paiements', icon: CreditCard },
    { id: 'profile', label: 'Mon profil', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'confirmed':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400';
      case 'pending':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900/20 dark:to-yellow-800/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/20 dark:to-red-800/20 dark:text-red-400';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 dark:from-gray-900/20 dark:to-gray-800/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-red-900/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec gradients */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-red-50/50 dark:from-blue-900/20 dark:to-red-900/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center">
              {userProfile.avatar && (
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full mr-4 border-2 border-blue-200 dark:border-blue-700 shadow-lg"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Espace Client
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Bienvenue, {userProfile.name || userEmail}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105"
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation avec gradients */}
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-red-50/30 dark:from-blue-900/10 dark:to-red-900/10"></div>
              <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
              
              <nav className="relative space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-400 shadow-lg shadow-blue-500/20'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu avec gradients */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-blue-50/30 dark:from-red-900/10 dark:to-blue-900/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative">
                {/* Tableau de bord */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                      Tableau de bord
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total achats</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {purchases.length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <FileText className="h-8 w-8 text-green-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Factures payées</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {purchases.filter(p => p.status === 'paid').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <Calendar className="h-8 w-8 text-yellow-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Rendez-vous</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {appointments.filter(a => a.status === 'confirmed').length}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <CreditCard className="h-8 w-8 text-purple-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Paiements</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {paymentMethods.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mes achats */}
                {activeTab === 'purchases' && (
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                      Mes achats
                    </h2>
                    {purchases.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Aucun achat trouvé
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {purchases.map((purchase) => (
                          <div
                            key={purchase._id}
                            className="border border-gray-200/70 dark:border-gray-700/70 rounded-xl p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {purchase.serviceName}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Facture #{purchase.invoiceNumber}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(purchase.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                  {purchase.totalAmount.toFixed(2)} $ CAD
                                </p>
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.status)}`}>
                                  {purchase.status === 'paid' ? 'Payé' : 
                                   purchase.status === 'pending' ? 'En attente' : 'Annulé'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mes rendez-vous */}
                {activeTab === 'appointments' && (
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
                      Mes rendez-vous
                    </h2>
                    <div className="space-y-4">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="border border-gray-200/70 dark:border-gray-700/70 rounded-xl p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {appointment.service}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {new Date(appointment.date).toLocaleDateString()} à {appointment.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {appointment.address}
                                </div>
                                <div className="flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Total: {appointment.total.toFixed(2)} $ CAD
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full mb-2 ${getStatusColor(appointment.status)}`}>
                                {appointment.status === 'confirmed' ? 'Confirmé' : 
                                 appointment.status === 'pending' ? 'En attente' : 'Annulé'}
                              </span>
                              {appointment.status !== 'cancelled' && (
                                <div className="space-y-2">
                                  <button className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300">
                                    Modifier
                                  </button>
                                  <button 
                                    onClick={() => cancelAppointment(appointment.id)}
                                    className="block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300"
                                  >
                                    Annuler
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Moyens de paiement */}
                {activeTab === 'payments' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Moyens de paiement
                      </h2>
                      <button
                        onClick={addPaymentMethod}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-blue-500/30"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </button>
                    </div>
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="border border-gray-200/70 dark:border-gray-700/70 rounded-xl p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
                              <div>
                                {method.type === 'card' ? (
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {method.brand} •••• {method.last4}
                                  </p>
                                ) : (
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    PayPal - {method.email}
                                  </p>
                                )}
                                {method.isDefault && (
                                  <span className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400 px-2 py-1 rounded-full">
                                    Par défaut
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removePaymentMethod(method.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mon profil */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Mon profil
                      </h2>
                      {!isEditingProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-blue-500/30"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </button>
                      )}
                    </div>

                    {/* Photo de profil */}
                    <div className="mb-6 text-center">
                      <div className="relative inline-block">
                        <img
                          src={userProfile.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150'}
                          alt="Avatar"
                          className="w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-700 shadow-lg"
                        />
                        <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-full cursor-pointer hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
                          <Camera className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={uploadingAvatar}
                          />
                        </label>
                        {uploadingAvatar && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditingProfile ? (
                      <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Nom complet
                            </label>
                            <input
                              type="text"
                              value={editProfile.name}
                              onChange={(e) => setEditProfile({...editProfile, name: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              value={editProfile.email}
                              onChange={(e) => setEditProfile({...editProfile, email: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              value={editProfile.phone}
                              onChange={(e) => setEditProfile({...editProfile, phone: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Ville
                            </label>
                            <input
                              type="text"
                              value={editProfile.city}
                              onChange={(e) => setEditProfile({...editProfile, city: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Adresse
                          </label>
                          <input
                            type="text"
                            value={editProfile.address}
                            onChange={(e) => setEditProfile({...editProfile, address: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white/70 dark:bg-gray-700/70 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                          />
                        </div>

                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={handleSaveProfile}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-green-500/30"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Sauvegarder
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-gray-500/30"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              Nom complet
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.name || 'Non renseigné'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              Email
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.email}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              Téléphone
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.phone || 'Non renseigné'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              Ville
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.city || 'Non renseigné'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Adresse
                          </label>
                          <p className="text-lg text-gray-900 dark:text-white">
                            {userProfile.address || 'Non renseigné'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
