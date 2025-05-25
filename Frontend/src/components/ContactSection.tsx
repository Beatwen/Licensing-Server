import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactSection = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-20 bg-blue-600 dark:bg-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à optimiser votre gestion RF ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Contactez notre équipe pour découvrir comment RF.Go peut transformer votre workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contact')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-gray-50 transition"
            >
              <Mail className="h-5 w-5" />
              Nous contacter
              <ArrowRight className="h-5 w-5" />
            </motion.button>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:christophe@korolab.com"
              className="px-8 py-4 border-2 border-white text-white rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              christophe@korolab.com
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection; 