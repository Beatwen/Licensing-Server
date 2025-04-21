import axios from 'axios';
import { generateDeviceId } from './device';
import { mockUser, mockLicenses, mockPricingPlans } from './mockData';
import qs from 'qs';
import { logger } from './logger';

// Set this to false to use the real API instead of mocks
const isDevelopment = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
});

// Mock API responses in development
const mockApi = {
  post: async (url: string, data: Record<string, unknown>) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    switch (url) {
      case '/auth/login':
      case '/auth/register':
        return {
          data: {
            user: mockUser,
            token: 'mock-token',
            refreshToken: 'mock-refresh-token'
          }
        };
      case '/auth/logout':
        return { data: { success: true } };
      case '/user/update':
        return {
          data: {
            user: {
              ...mockUser,
              name: data.name,
              email: data.email,
            }
          }
        };
      case '/licenses/buy':
        return {
          data: {
            success: true,
            licenseKey: `RF-GO-${(data.plan as string).toUpperCase()}-${Date.now()}`,
            message: 'License purchased successfully'
          }
        };
      case '/licenses/activate':
        return {
          data: {
            success: true,
            message: 'License activated successfully',
            license: {
              ...mockLicenses[0],
              key: data.licenseKey,
              status: 'active',
              activatedAt: new Date().toISOString()
            }
          }
        };
      default:
        throw new Error('Not implemented');
    }
  },
  get: async (url: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    switch (url) {
      case '/licenses':
        return { data: mockLicenses };
      case '/pricing':
        return { data: mockPricingPlans };
      default:
        throw new Error('Not implemented');
    }
  }
};

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const deviceId = generateDeviceId();
  
  // Log token status for debugging
  logger.debug("Request interceptor - Token status:", token ? "Present" : "Missing");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  config.headers['X-DEVICE-ID'] = deviceId;
  config.headers['X-USER-KEY'] = localStorage.getItem('userKey') || '';
  
  // Convert request body to application/x-www-form-urlencoded for OAuth2 endpoints
  if (config.url?.includes('/auth/login') || 
      config.url?.includes('/auth/refresh') || 
      config.url?.includes('/auth/logout')) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (config.data) {
      // Add required OAuth2 parameters
      const clientId = localStorage.getItem('clientId');
      const clientSecret = localStorage.getItem('clientSecret');
      
      logger.debug("OAuth request - Client credentials:", { 
        clientId: clientId ? "Present" : "Missing", 
        clientSecret: clientSecret ? "Present" : "Missing" 
      });
      
      const data = {
        ...config.data,
        grant_type: config.url.includes('/auth/login') ? 'password' : 
                   config.url.includes('/auth/refresh') ? 'refresh_token' : 'token',
        client_id: clientId || config.data.client_id || 'default_client',
        client_secret: clientSecret || config.data.client_secret || 'default_secret',
        username: config.data.email,
        scope: 'all'
      };
      config.data = qs.stringify(data);
    }
  }
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt to refresh token if it's a 401 error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const clientId = localStorage.getItem('clientId');
        const clientSecret = localStorage.getItem('clientSecret');
        
        // Only attempt refresh if we have all required tokens
        if (refreshToken && clientId && clientSecret) {
          logger.debug("Attempting to refresh token");
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
            refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          logger.debug("Missing tokens for refresh", { refreshToken, clientId, clientSecret });
          throw new Error("Missing tokens for refresh");
        }
      } catch (refreshError) {
        logger.error("Token refresh failed:", refreshError);
        // Clear auth state and redirect to home
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('clientId');
        localStorage.removeItem('clientSecret');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default isDevelopment ? mockApi : api;