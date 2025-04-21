import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { License } from '../types/auth';
import { Loader, CreditCard, User, Key } from 'lucide-react';
import AccountSettings from './AccountSettings';
import PricingPlans from './PricingPlans';
import { logger } from '../utils/logger';

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
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Vos licences</h2>
            {licenses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Vous n'avez pas encore de licence active.
                </p>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Voir les offres
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {licenses.map((license) => (
                  <div
                    key={license.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Licence </span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        license.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : license.status === 'expired'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {license.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clé: {license.licenseKey}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Type: {license.type}
                    </p>
                    {license.activatedAt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Activée le: {new Date(license.activatedAt).toLocaleDateString()}
                      </p>
                    )}
                    {license.expiresAt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Expire le: {new Date(license.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
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
          Bienvenue, {user?.name || user?.email}
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