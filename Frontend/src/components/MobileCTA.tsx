import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const MobileCTA = () => {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-40"
    >
      <button className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 flex items-center justify-center space-x-2 shadow-lg">
        <Download className="h-5 w-5" />
        <span>Télécharger RF_Go</span>
      </button>
    </motion.div>
  );
};

export default MobileCTA;