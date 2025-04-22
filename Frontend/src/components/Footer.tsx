import { Github, Twitter, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logoLight from '../assets/images/RFGo-Logo.svg';
import logoDark from '../assets/images/RFGo-Logo-dark.svg';

const Footer = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <img 
                src={isDark ? logoDark : logoLight}
                alt="RF_Go Logo"
                className="h-12"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              La solution professionnelle pour la gestion des fréquences sans fil.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/#features')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Fonctionnalités
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#demo')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Démo
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#pricing')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Tarifs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/#contact')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#faq')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#support')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Support technique
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/#privacy')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#terms')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/#mentions')}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600"
                >
                  Mentions légales
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} RF_Go. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;