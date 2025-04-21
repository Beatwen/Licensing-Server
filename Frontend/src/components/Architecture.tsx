import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Smartphone } from 'lucide-react';

const Architecture = () => {
  return (
    <section id="architecture" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Architecture technique</h2>
          <p className="text-gray-600 dark:text-gray-300">Une solution robuste pensée pour le terrain</p>
        </motion.div>

        <div className="relative">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
            >
              <Smartphone className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Frontend React</h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">Interface utilisateur moderne et réactive</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-20 h-0.5 md:w-0.5 md:h-20 bg-blue-600"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
            >
              <Server className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">API Express</h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">Backend performant et sécurisé</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="w-20 h-0.5 md:w-0.5 md:h-20 bg-blue-600"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"
            >
              <Database className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">MongoDB</h3>
              <p className="text-sm text-center text-gray-600 dark:text-gray-300">Stockage local fiable et rapide</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Architecture;