import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { License } from '../types/license';
import { Loader, CreditCard, User, Key  } from 'lucide-react';
import AccountSettings from './AccountSettings';
import PricingPlans from './PricingPlans';
import { logger } from '../utils/logger';
import toast from 'react-hot-toast';
import LicensesTab from './LicensesTab';




const Dashboard = () => {
  const { user } = useAuthStore();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'licenses' | 'billing' | 'account'>('licenses');

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        logger.info("Fetching licenses...");
        const response = await api.get(`/licenses/${user?.id}`);
        logger.info("Licenses fetched successfully:", response.data);
        setLicenses(response.data);
      } catch (error) {
        logger.error('Error fetching licenses:', error);
        toast.error('Failed to fetch licenses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLicenses();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'licenses':
        return <LicensesTab licenses={licenses} setLicenses={setLicenses} />;
      case 'billing':
        return <PricingPlans />;
      case 'account':
        return <AccountSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenue, {user?.email}
        </p>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('licenses')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'licenses'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Key className="w-5 h-5" />
          <span>Licences</span>
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'billing'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          <span>Acheter</span>
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
            activeTab === 'account'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Compte</span>
        </button>
      </div>

      {renderTab()}
    </div>
  );
};

export default Dashboard;