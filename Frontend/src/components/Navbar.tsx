import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import RegisterModal from './RegisterModal';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import logoLight from '../assets/images/RFGo-Logo.svg';
import logoDark from '../assets/images/RFGo-Logo-dark.svg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!isDark).toString());
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
      toast.success('Déconnexion réussie');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src={isDark ? logoDark : logoLight} 
                alt="RF_Go Logo" 
                className="h-12"
              />
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => navigate('/#features')}
                  className="hover:text-blue-600 px-3 py-2"
                >
                  Fonctionnalités
                </button>
                <button
                  onClick={() => navigate('/#demo')}
                  className="hover:text-blue-600 px-3 py-2"
                >
                  Démo
                </button>
                <button
                  onClick={() => navigate('/#pricing')}
                  className="hover:text-blue-600 px-3 py-2"
                >
                  Tarifs
                </button>
                <button
                  onClick={() => navigate('/#contact')}
                  className="hover:text-blue-600 px-3 py-2"
                >
                  Contact
                </button>
                
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span>{user.userName || user.email}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0"
                            onClick={() => setShowUserMenu(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1"
                          >
                            <button
                              onClick={() => {
                                navigate('/dashboard');
                                setShowUserMenu(false);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <User className="h-4 w-4 mr-2" />
                              Tableau de bord
                            </button>
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Déconnexion
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      S'inscrire
                    </button>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Se connecter
                    </button>
                  </div>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center my-auto"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => navigate('/#features')}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => navigate('/#demo')}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Démo
              </button>
              <button
                onClick={() => navigate('/#pricing')}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Tarifs
              </button>
              <button
                onClick={() => navigate('/#contact')}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Contact
              </button>
              
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Tableau de bord
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowLoginModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setShowRegisterModal(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Inscription
                  </button>
                </>
              )}
              
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? (
                  <>
                    <Sun className="h-5 w-5 mr-2" /> Mode clair
                  </>
                ) : (
                  <>
                    <Moon className="h-5 w-5 mr-2" /> Mode sombre
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </>
  );
};

export default Navbar;