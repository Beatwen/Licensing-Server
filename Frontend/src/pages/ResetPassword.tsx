import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '../utils/logger';
import api from '../utils/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlToken = new URLSearchParams(location.search).get('token');
    
    if (!urlToken) {
      setIsTokenValid(false);
      toast.error('Lien de réinitialisation invalide ou expiré');
      return;
    }
    
    setToken(urlToken);
    logger.info("Reset token from URL:", urlToken);
    
    // Verify token validity on component mount
    const verifyToken = async () => {
      try {
        logger.info("Verifying token validity...");
        const response = await api.get(`/auth/verify-reset-token?token=${urlToken}`);
        logger.info("Token verification response:", response.data);
        
        // Si nous arrivons ici, le token est valide
        toast.success('Token valide, vous pouvez réinitialiser votre mot de passe');
      } catch (error: any) {
        logger.error("Invalid reset token:", error);
        logger.error("Error response:", error.response?.data);
        setIsTokenValid(false);
        toast.error(error.response?.data?.error || 'Lien de réinitialisation invalide ou expiré');
      }
    };
    
    verifyToken();
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    try {
      setIsSubmitting(true);
          await api.post(`/auth/reset-password`, {
        token,
        password
      });
      
      setIsSuccess(true);
      logger.info("Password reset successful");
      toast.success('Mot de passe réinitialisé avec succès');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      logger.error("Error resetting password:", error);
      logger.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
            <Lock className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">Lien invalide</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Ce lien de réinitialisation est invalide ou a expiré.
          </p>
          <div className="mt-6 flex justify-center items-center">
            <button
              onClick={() => navigate('/forgot-password')}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Demander un nouveau lien
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Mot de passe réinitialisé !
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Réinitialiser votre mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Veuillez choisir un nouveau mot de passe
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Nouveau mot de passe
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder="Nouveau mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirmer le mot de passe
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isSubmitting ? 'Traitement en cours...' : 'Réinitialiser le mot de passe'}
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
      </div>
    </div>
  );
};

export default ResetPassword; 