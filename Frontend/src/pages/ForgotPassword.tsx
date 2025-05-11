import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';
import api from '../utils/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Use the configured API URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      await api.post(`${apiUrl}/auth/forgot-password`, { email });
      
      setIsSubmitted(true);
      logger.info("Password reset request submitted for:", email);
    } catch (error) {
      logger.error("Error requesting password reset:", error);
      toast.error('Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {isSubmitted ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Vérifiez votre boîte de réception
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Si un compte existe avec l'adresse {email}, un email contenant les instructions pour réinitialiser votre mot de passe vous a été envoyé.
            </p>
            <div className="mt-6 flex justify-center items-center">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à la connexion
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                Mot de passe oublié
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="sr-only">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                  placeholder="Adresse email"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer les instructions'}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Retour à la connexion
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 