import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader, Save } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AccountSettings = () => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        if (!formData.currentPassword) {
          throw new Error('Mot de passe actuel requis');
        }
      }

      const response = await api.put(`/users/${user?.id}`, {
        userName: formData.userName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setUser(response.data.user);
      toast.success('Profil mis à jour avec succès');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-6">Paramètres du compte</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Nom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            disabled={true}
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium mb-4">Changer le mot de passe</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe actuel</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nouveau mot de passe</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Sauvegarder</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AccountSettings;