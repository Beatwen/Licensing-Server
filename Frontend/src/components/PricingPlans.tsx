import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Loader } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const PricingPlans = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/pricing');
        setPlans(response.data);
      } catch (error) {
        toast.error('Failed to load pricing plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePurchase = async (plan: PricingPlan) => {
    if (!user) {
      toast.error('Please log in to purchase a license');
      return;
    }

    setIsPurchasing(true);
    try {
      const response = await api.post('/licenses/buy', { plan: plan.id });
      toast.success(response.data.message);
      
      // Activate the license automatically after purchase
      await api.post('/licenses/activate', { licenseKey: response.data.licenseKey });
      toast.success('License activated successfully');
    } catch (error) {
      toast.error('Failed to purchase license');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
          <p className="text-gray-600 dark:text-gray-300">Choose the perfect plan for your needs</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8"
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{plan.description}</p>
              <div className="text-3xl font-bold mb-6">
                ${plan.price} <span className="text-lg font-normal text-gray-600 dark:text-gray-400">/year</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePurchase(plan)}
                disabled={isPurchasing}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
              >
                {isPurchasing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Purchase Now'
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;