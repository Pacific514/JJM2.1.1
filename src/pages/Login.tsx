
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  EyeOff,
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
  Plus,
  LogIn,
  UserPlus
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
  type: 'card';
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
  cardType: 'visa' | 'mastercard';
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

const Login: React.FC = () => {
  const { t, language } = useLanguage();
  const { searchInvoices } = useInvoices();
  
  // États de connexion
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // États espace client
  const [activeTab, setActiveTab] = useState('dashboard');
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

  // États pour ajouter un moyen de paiement
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    cardType: 'visa' as 'visa' | 'mastercard'
  });

  // 🔐 Vérification authentification au chargement
  React.useEffect(() => {
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

      // Charger rendez-vous simulés avec possibilité d'annulation
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

      // Charger moyens de paiement réels
      setPaymentMethods([
        {
          id: 'pm-001',
          type: 'card',
          cardNumber: '**** **** **** 4242',
          expiryDate: '12/26',
          cardholderName: 'Jean Dupont',
          cardType: 'visa',
          isDefault: true
        }
      ]);

    } catch (error) {
      console.error('Erreur chargement données:', error);
    }
  };

  // 🔑 Connexion email/mot de passe
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
      
      toast.success(language === 'fr' ? 'Connexion réussie !' : 'Login successful!');
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur de connexion' : 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔑 Connexion Google
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Simulation connexion Google
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const googleEmail = 'client@gmail.com';
      
      localStorage.setItem('jj_client_auth', 'true');
      localStorage.setItem('jj_client_email', googleEmail);
      
      setIsAuthenticated(true);
      setUserEmail(googleEmail);
      await loadUserData(googleEmail);
      
      toast.success(language === 'fr' ? 'Connexion Google réussie !' : 'Google login successful!');
      
    } catch (error) {
      console.error('Erreur Google:', error);
      toast.error(language === 'fr' ? 'Erreur connexion Google' : 'Google login error');
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
    toast.success(language === 'fr' ? 'Déconnexion réussie' : 'Logout successful');
  };

  // ✏️ Modification profil
  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditProfile({ ...userProfile });
  };

  const handleSaveProfile = () => {
    setUserProfile({ ...editProfile });
    setIsEditingProfile(false);
    toast.success(language === 'fr' ? 'Profil mis à jour' : 'Profile updated');
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
      
      toast.success(language === 'fr' ? 'Photo de profil mise à jour' : 'Profile photo updated');
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de l\'upload' : 'Upload error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // 💳 Gestion moyens de paiement
  const addPaymentMethod = async () => {
    if (!newPayment.cardNumber || !newPayment.expiryDate || !newPayment.cvv || !newPayment.cardholderName) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const maskedCardNumber = `**** **** **** ${newPayment.cardNumber.slice(-4)}`;
    
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: 'card',
      cardNumber: maskedCardNumber,
      expiryDate: newPayment.expiryDate,
      cardholderName: newPayment.cardholderName,
      cardType: newPayment.cardType,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods(prev => [...prev, newMethod]);
    setNewPayment({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      cardType: 'visa'
    });
    setShowAddPayment(false);
    toast.success(language === 'fr' ? 'Moyen de paiement ajouté' : 'Payment method added');
  };

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    toast.success(language === 'fr' ? 'Moyen de paiement supprimé' : 'Payment method removed');
  };

  // 📅 Gestion rendez-vous avec délai d'annulation
  const canCancelAppointment = (appointmentDate: string, appointmentTime: string) => {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    const timeDifference = appointmentDateTime.getTime() - now.getTime();
    const hoursUntilAppointment = timeDifference / (1000 * 60 * 60);
    
    // Peut annuler si plus de 23h59 avant le rendez-vous
    return hoursUntilAppointment > 23.98; // 23h59 = 23.98 heures
  };

  const cancelAppointment = (id: string) => {
    const appointment = appointments.find(apt => apt.id === id);
    if (!appointment) return;

    if (!canCancelAppointment(appointment.date, appointment.time)) {
      toast.error(language === 'fr' 
        ? 'Impossible d\'annuler : moins de 24h avant le rendez-vous'
        : 'Cannot cancel: less than 24h before appointment'
      );
      return;
    }

    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
      )
    );
    toast.success(language === 'fr' ? 'Rendez-vous annulé' : 'Appointment cancelled');
  };

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

  // 🎨 Interface de connexion - AFFICHÉE SEULEMENT SI NON CONNECTÉ
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-red-50/30 dark:from-gray-900 dark:via-blue-900/20 dark:to-red-900/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* En-tête avec gradients */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-4 rounded-full shadow-xl shadow-blue-500/20">
                <LogIn className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {language === 'fr' ? 'Espace Client' : 'Client Portal'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {language === 'fr' ? 'Connectez-vous pour accéder à votre espace' : 'Sign in to access your account'}
            </p>
          </motion.div>

          {/* Formulaire avec style gradients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Arrière-plan avec gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-red-50/50 dark:from-blue-900/20 dark:to-red-900/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
            
            <div className="relative p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'fr' ? 'Adresse courriel' : 'Email address'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 bg-gradient-to-r from-gray-400 to-gray-500 p-1 rounded">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'fr' ? 'Mot de passe' : 'Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 bg-gradient-to-r from-gray-400 to-gray-500 p-1 rounded">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300/70 dark:border-gray-600/70 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700/50 dark:text-white backdrop-blur-sm shadow-lg transition-all duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Lien mot de passe oublié */}
                <div className="text-right">
                  <Link
                    to="/reset-password"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {language === 'fr' ? 'Mot de passe oublié ?' : 'Forgot password?'}
                  </Link>
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/40 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      {language === 'fr' ? 'Se connecter' : 'Sign in'}
                    </>
                  )}
                </button>

                {/* Séparateur */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {language === 'fr' ? 'ou' : 'or'}
                    </span>
                  </div>
                </div>

                {/* Connexion Google */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {language === 'fr' ? 'Continuer avec Google' : 'Continue with Google'}
                </button>
              </form>

              {/* Lien inscription */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'fr' ? 'Pas encore de compte ?' : 'Don\'t have an account?'}{' '}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {language === 'fr' ? 'Créer un compte' : 'Sign up'}
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lien retour */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              to="/"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← {language === 'fr' ? 'Retour à l\'accueil' : 'Back to home'}
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // 🏠 Interface espace client - AFFICHÉE SEULEMENT SI CONNECTÉ
  const tabs = [
    { id: 'dashboard', label: language === 'fr' ? 'Tableau de bord' : 'Dashboard', icon: User },
    { id: 'purchases', label: language === 'fr' ? 'Mes achats' : 'My purchases', icon: ShoppingBag },
    { id: 'appointments', label: language === 'fr' ? 'Mes rendez-vous' : 'My appointments', icon: Calendar },
    { id: 'payments', label: language === 'fr' ? 'Paiements' : 'Payments', icon: CreditCard },
    { id: 'profile', label: language === 'fr' ? 'Mon profil' : 'My profile', icon: Settings }
  ];

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
                  {language === 'fr' ? 'Espace Client' : 'Client Portal'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {language === 'fr' ? 'Bienvenue' : 'Welcome'}, {userProfile.name || userEmail}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 transform hover:scale-105"
            >
              {language === 'fr' ? 'Déconnexion' : 'Logout'}
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
                      {language === 'fr' ? 'Tableau de bord' : 'Dashboard'}
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl shadow-lg backdrop-blur-sm">
                        <div className="flex items-center">
                          <ShoppingBag className="h-8 w-8 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {language === 'fr' ? 'Total achats' : 'Total purchases'}
                            </p>
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {language === 'fr' ? 'Factures payées' : 'Paid invoices'}
                            </p>
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {language === 'fr' ? 'Rendez-vous' : 'Appointments'}
                            </p>
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
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {language === 'fr' ? 'Paiements' : 'Payments'}
                            </p>
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
                      {language === 'fr' ? 'Mes achats' : 'My purchases'}
                    </h2>
                    {purchases.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">
                          {language === 'fr' ? 'Aucun achat trouvé' : 'No purchases found'}
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
                                  {language === 'fr' ? 'Facture #' : 'Invoice #'}{purchase.invoiceNumber}
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
                                  {purchase.status === 'paid' ? (language === 'fr' ? 'Payé' : 'Paid') : 
                                   purchase.status === 'pending' ? (language === 'fr' ? 'En attente' : 'Pending') : 
                                   (language === 'fr' ? 'Annulé' : 'Cancelled')}
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
                      {language === 'fr' ? 'Mes rendez-vous' : 'My appointments'}
                    </h2>
                    <div className="space-y-4">
                      {appointments.map((appointment) => {
                        const canCancel = canCancelAppointment(appointment.date, appointment.time);
                        
                        return (
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
                                    {new Date(appointment.date).toLocaleDateString()} {language === 'fr' ? 'à' : 'at'} {appointment.time}
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
                                  {appointment.status === 'confirmed' ? (language === 'fr' ? 'Confirmé' : 'Confirmed') : 
                                   appointment.status === 'pending' ? (language === 'fr' ? 'En attente' : 'Pending') : 
                                   (language === 'fr' ? 'Annulé' : 'Cancelled')}
                                </span>
                                {appointment.status !== 'cancelled' && (
                                  <div className="space-y-2">
                                    <button className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300">
                                      {language === 'fr' ? 'Modifier' : 'Edit'}
                                    </button>
                                    <button 
                                      onClick={() => cancelAppointment(appointment.id)}
                                      disabled={!canCancel}
                                      className={`block w-full px-3 py-1 rounded-lg text-xs transition-all duration-300 ${
                                        canCancel 
                                          ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                      }`}
                                      title={!canCancel ? 'Annulation impossible : moins de 24h avant le rendez-vous' : ''}
                                    >
                                      {language === 'fr' ? 'Annuler' : 'Cancel'}
                                    </button>
                                    {!canCancel && (
                                      <p className="text-xs text-red-500 mt-1">
                                        {language === 'fr' ? '< 24h' : '< 24h'}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Moyens de paiement - BOÎTE ENCORE PLUS AGRANDIE */}
                {activeTab === 'payments' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {language === 'fr' ? 'Moyens de paiement' : 'Payment methods'}
                      </h2>
                      <button
                        onClick={() => setShowAddPayment(true)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-blue-500/30"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {language === 'fr' ? 'Ajouter' : 'Add'}
                      </button>
                    </div>

                    {/* Logos Visa/Mastercard et sécurité */}
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
                            alt="Visa" 
                            className="h-6"
                          />
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                            alt="Mastercard" 
                            className="h-6"
                          />
                        </div>
                        <div className="flex items-center text-green-700 dark:text-green-400">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium">Paiement sécurisé par SSL via Square</span>
                        </div>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        American Express n'est pas accepté
                      </p>
                    </div>

                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="border border-gray-200/70 dark:border-gray-700/70 rounded-xl p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-lg"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="mr-3">
                                {method.cardType === 'visa' ? (
                                  <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
                                    alt="Visa" 
                                    className="h-6"
                                  />
                                ) : (
                                  <img 
                                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                                    alt="Mastercard" 
                                    className="h-6"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {method.cardNumber}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {method.cardholderName} • Exp: {method.expiryDate}
                                </p>
                                {method.isDefault && (
                                  <span className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-800 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400 px-2 py-1 rounded-full">
                                    {language === 'fr' ? 'Par défaut' : 'Default'}
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

                    {/* Modal d'ajout de moyen de paiement - BOÎTE ENCORE PLUS AGRANDIE */}
                    {showAddPayment && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
                          <div className="p-12">
                            <div className="flex justify-between items-center mb-10">
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Ajouter un moyen de paiement
                              </h3>
                              <button
                                onClick={() => setShowAddPayment(false)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                              >
                                <X className="h-8 w-8" />
                              </button>
                            </div>

                            <div className="space-y-10">
                              {/* Type de carte */}
                              <div>
                                <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-6">
                                  Type de carte
                                </label>
                                <div className="grid grid-cols-2 gap-8">
                                  <div
                                    className={`border rounded-xl p-8 cursor-pointer transition-all flex items-center justify-center ${
                                      newPayment.cardType === 'visa'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                    onClick={() => setNewPayment(prev => ({ ...prev, cardType: 'visa' }))}
                                  >
                                    <img 
                                      src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" 
                                      alt="Visa" 
                                      className="h-12"
                                    />
                                  </div>
                                  <div
                                    className={`border rounded-xl p-8 cursor-pointer transition-all flex items-center justify-center ${
                                      newPayment.cardType === 'mastercard'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                    onClick={() => setNewPayment(prev => ({ ...prev, cardType: 'mastercard' }))}
                                  >
                                    <img 
                                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
                                      alt="Mastercard" 
                                      className="h-12"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Numéro de carte */}
                              <div>
                                <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                                  Numéro de carte
                                </label>
                                <input
                                  type="text"
                                  value={newPayment.cardNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                                    if (value.replace(/\s/g, '').length <= 16) {
                                      setNewPayment(prev => ({ ...prev, cardNumber: value }));
                                    }
                                  }}
                                  className="w-full px-8 py-6 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-2xl"
                                  placeholder="1234 5678 9012 3456"
                                  maxLength={19}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-8">
                                {/* Date d'expiration */}
                                <div>
                                  <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Expiration
                                  </label>
                                  <input
                                    type="text"
                                    value={newPayment.expiryDate}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                                      if (value.length <= 5) {
                                        setNewPayment(prev => ({ ...prev, expiryDate: value }));
                                      }
                                    }}
                                    className="w-full px-8 py-6 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-2xl"
                                    placeholder="MM/AA"
                                    maxLength={5}
                                  />
                                </div>

                                {/* CVV */}
                                <div>
                                  <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    CVV
                                  </label>
                                  <input
                                    type="text"
                                    value={newPayment.cvv}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '');
                                      if (value.length <= 3) {
                                        setNewPayment(prev => ({ ...prev, cvv: value }));
                                      }
                                    }}
                                    className="w-full px-8 py-6 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-2xl"
                                    placeholder="123"
                                    maxLength={3}
                                  />
                                </div>
                              </div>

                              {/* Nom du titulaire */}
                              <div>
                                <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
                                  Nom du titulaire
                                </label>
                                <input
                                  type="text"
                                  value={newPayment.cardholderName}
                                  onChange={(e) => setNewPayment(prev => ({ ...prev, cardholderName: e.target.value }))}
                                  className="w-full px-8 py-6 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-2xl"
                                  placeholder="Nom complet"
                                />
                              </div>
                            </div>

                            <div className="flex gap-6 mt-12">
                              <button
                                onClick={addPaymentMethod}
                                className="flex-1 bg-blue-600 text-white py-6 px-8 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-xl"
                              >
                                Ajouter
                              </button>
                              <button
                                onClick={() => setShowAddPayment(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-6 px-8 rounded-xl hover:bg-gray-400 transition-colors font-semibold text-xl"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mon profil */}
                {activeTab === 'profile' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {language === 'fr' ? 'Mon profil' : 'My profile'}
                      </h2>
                      {!isEditingProfile && (
                        <button
                          onClick={handleEditProfile}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-blue-500/30"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {language === 'fr' ? 'Modifier' : 'Edit'}
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
                              {language === 'fr' ? 'Nom complet' : 'Full name'}
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
                              {language === 'fr' ? 'Téléphone' : 'Phone'}
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
                              {language === 'fr' ? 'Ville' : 'City'}
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
                            {language === 'fr' ? 'Adresse' : 'Address'}
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
                            {language === 'fr' ? 'Sauvegarder' : 'Save'}
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center shadow-lg shadow-gray-500/30"
                          >
                            <X className="h-4 w-4 mr-2" />
                            {language === 'fr' ? 'Annuler' : 'Cancel'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              {language === 'fr' ? 'Nom complet' : 'Full name'}
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.name || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
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
                              {language === 'fr' ? 'Téléphone' : 'Phone'}
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.phone || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                              {language === 'fr' ? 'Ville' : 'City'}
                            </label>
                            <p className="text-lg text-gray-900 dark:text-white">
                              {userProfile.city || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            {language === 'fr' ? 'Adresse' : 'Address'}
                          </label>
                          <p className="text-lg text-gray-900 dark:text-white">
                            {userProfile.address || (language === 'fr' ? 'Non renseigné' : 'Not provided')}
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

export default Login;
