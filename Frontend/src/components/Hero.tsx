import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';

const Hero = () => {
  return (
    <div className="min-h-[80vh] flex items-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Prenez le contrôle de vos fréquences.
              <span className="text-blue-600"> Partout. Sans compromis.</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              L'outil ultime pour gérer vos fréquences sans fil en tournée, événementiel ou installation.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:bg-blue-700 transition"
              >
                Découvrir l'app <ChevronRight className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg flex items-center gap-2 hover:bg-blue-50 transition"
              >
                Voir la démo <Play className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative mx-auto w-[280px] h-[580px] bg-black rounded-[3rem] p-4 shadow-2xl">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl"></div>
              <div className="h-full w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600">
                <img 
                  src="https://images.unsplash.com/photo-1615648178124-01f7162ceac4?auto=format&fit=crop&w=600"
                  alt="RF_Go App Interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;