import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ConfirmEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isConfirming, setIsConfirming] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const confirmEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      
      if (!token) {
        toast.error('Invalid confirmation link');
        navigate('/');
        return;
      }

      try {
        setIsConfirming(true);
        // Use the configured API URL from environment variable
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/auth/confirm-email?token=${token}`);
        
        if (response.status === 200) {
          setIsSuccess(true);
          
          // Start countdown for redirect
          let count = 5;
          setCountdown(count);
          
          const timer = setInterval(() => {
            count -= 1;
            setCountdown(count);
            
            if (count <= 0) {
              clearInterval(timer);
              navigate('/');
            }
          }, 1000);
          
          return () => clearInterval(timer);
        }
      } catch (error) {
        console.error('Error confirming email:', error);
        toast.error('Failed to confirm email. Please try again.');
      } finally {
        setIsConfirming(false);
      }
    };

    confirmEmail();
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          {isConfirming ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          ) : isSuccess ? (
            <>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Email Confirmed!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your email has been successfully confirmed. You can now log in to your account.
              </p>
              <p className="mt-4 text-blue-600 dark:text-blue-400">
                Redirecting to home page in {countdown} seconds...
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Confirmation Failed
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                There was a problem confirming your email. Please try again or contact support.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmail; 