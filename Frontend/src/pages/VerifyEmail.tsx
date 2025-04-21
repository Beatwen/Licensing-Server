import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full mb-4">
            <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vérifiez votre email
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Nous avons envoyé un lien de vérification à votre adresse email.
            Veuillez cliquer sur ce lien pour activer votre compte.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Se connecter
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 