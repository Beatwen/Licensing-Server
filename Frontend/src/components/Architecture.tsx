import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Shield, TrendingUp, Users, Zap, Award } from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Gain de temps",
      stat: "50%",
      description: "de temps économisé sur la coordination fréquences"
    },
    {
      icon: Shield,
      title: "Fiabilité",
      stat: "100%",
      description: "de disponibilité même sans connexion internet"
    },
    {
      icon: Award,
      title: "Confiance",
      stat: "500+",
      description: "événements réussis avec RF.Go"
    }
  ];

  return (
    <section id="why-choose" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Pourquoi choisir RF.Go ?</h2>
          <p className="text-gray-600 dark:text-gray-300">Les chiffres parlent d'eux-mêmes</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <benefit.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {benefit.stat}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">
                {benefit.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full">
            <Award className="w-5 h-5 mr-2" />
            <span className="font-semibold">Adopté par les plus grands événements français</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;