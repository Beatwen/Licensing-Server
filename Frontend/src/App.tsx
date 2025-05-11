import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Architecture from './components/Architecture';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import MobileCTA from './components/MobileCTA';
import Dashboard from './components/Dashboard';
import PricingPlans from './components/PricingPlans';
import VerifyEmail from './pages/VerifyEmail';
import LoginPage from './pages/LoginPage';
import ConfirmEmail from './pages/ConfirmEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useAuthStore } from './store/authStore';
import { logger } from './utils/logger';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const { user, initialize } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    
    const initApp = async () => {
      try {
        await initialize();
      } catch (error) {
        logger.error("Failed to initialize app:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initApp();
  }, [initialize]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <Architecture />
              <PricingPlans />
              <Testimonials />
              <FAQ />
            </>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/confirm-email" element={<ConfirmEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
        <Footer />
        <MobileCTA />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;