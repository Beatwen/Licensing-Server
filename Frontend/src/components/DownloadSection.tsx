import { motion } from 'framer-motion';
import { Download, Smartphone, Monitor, Apple, PlayCircle } from 'lucide-react';

const DownloadSection = () => {
  const downloadLinks = [
    {
      platform: 'Windows',
      icon: <Monitor className="w-8 h-8" />,
      version: 'v2.1.0',
      size: '45 MB',
      downloadUrl: '#', // À remplacer par le vrai lien
      description: 'Compatible Windows 10/11'
    },
    {
      platform: 'macOS',
      icon: <Apple className="w-8 h-8" />,
      version: 'v2.1.0',
      size: '52 MB',
      downloadUrl: '#', // À remplacer par le vrai lien
      description: 'Compatible macOS 11+'
    },
    {
      platform: 'Android',
      icon: <Smartphone className="w-8 h-8" />,
      version: 'v2.1.0',
      size: '28 MB',
      downloadUrl: '#', // À remplacer par le vrai lien
      description: 'Android 8.0+'
    },
    {
      platform: 'iOS',
      icon: <Apple className="w-8 h-8" />,
      version: 'v2.1.0',
      size: '32 MB',
      downloadUrl: '#', // À remplacer par le vrai lien
      description: 'iOS 14+'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Download className="w-6 h-6 mr-2 text-blue-600" />
          Télécharger RF.Go
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Téléchargez RF.Go sur votre plateforme préférée et commencez à gérer vos fréquences sans fil.
        </p>
      </div>

      {/* Plateformes de téléchargement */}
      <div className="grid md:grid-cols-2 gap-6">
        {downloadLinks.map((platform, index) => (
          <motion.div
            key={platform.platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{platform.platform}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {platform.description}
                  </p>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                <div>{platform.version}</div>
                <div>{platform.size}</div>
              </div>
            </div>

            <button
              onClick={() => {
                // Ici vous pouvez ajouter la logique de téléchargement
                console.log(`Téléchargement ${platform.platform}`);
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Télécharger pour {platform.platform}</span>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Instructions d'installation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mt-8"
      >
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <PlayCircle className="w-5 h-5 mr-2 text-blue-600" />
          Instructions d'installation
        </h3>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
            <span>Téléchargez le fichier d'installation correspondant à votre système</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
            <span>Exécutez le fichier et suivez les instructions d'installation</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
            <span>Connectez-vous avec vos identifiants pour synchroniser vos données</span>
          </div>
        </div>
      </motion.div>

      {/* Notes de version */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6"
      >
        <h3 className="font-semibold text-lg mb-4">Notes de version v1.0.0</h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Première version de l'application</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Bêta version</span>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default DownloadSection; 