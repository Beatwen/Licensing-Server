import { motion } from 'framer-motion';
import { Radio, Wifi, Lock, Globe } from 'lucide-react';

const features = [
  {
    icon: <Radio className="w-8 h-8 text-blue-600" />,
    title: "Auto-détection multi-marques",
    description: "Compatible avec tous les émetteurs majeurs du marché, détection instantanée."
  },
  {
    icon: <Wifi className="w-8 h-8 text-blue-600" />,
    title: "Mode hors-ligne",
    description: "Fonctionnement garanti sans connexion, synchronisation automatique."
  },
  {
    icon: <Lock className="w-8 h-8 text-blue-600" />,
    title: "Backend sécurisé local",
    description: "Vos données restent sur votre machine, sécurité maximale garantie."
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-600" />,
    title: "Gestion TV par pays",
    description: "Base de données complète des bandes TV mondiales, mise à jour régulière."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Fonctionnalités clés</h2>
          <p className="text-gray-600 dark:text-gray-300">Des outils puissants pour une gestion RF professionnelle</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-4 text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;