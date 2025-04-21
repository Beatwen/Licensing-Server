import React from 'react';
import { motion } from 'framer-motion';
import { Radio, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center">
              <Radio className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold">RF_Go</span>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              La solution professionnelle pour la gestion des fréquences sans fil.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Fonctionnalités</a></li>
              <li><a href="#demo" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Démo</a></li>
              <li><a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Tarifs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Contact</a></li>
              <li><a href="#faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">FAQ</a></li>
              <li><a href="#support" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Support technique</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li><a href="#privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Confidentialité</a></li>
              <li><a href="#terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Conditions</a></li>
              <li><a href="#mentions" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Mentions légales</a></li>
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