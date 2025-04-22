import axios from 'axios';
import qs from 'qs';
import { logger } from './logger';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_API_KEY,
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  // Log token status for debugging
  logger.debug("Request interceptor - Token status:", token ? "Present" : "Missing");
  
  // Log detailed information for the /users/me request
  if (config.url?.includes('/users/me')) {
    logger.info("Sending /users/me request", {
      url: config.url,
      hasToken: !!token,
      tokenFirstChars: token ? token.substring(0, 15) + '...' : 'none',
      headers: {
        ...config.headers,
        Authorization: token ? 'Bearer [REDACTED]' : 'none'
      }
    });
  }
  
  if (token) {
    // Standard format for Bearer authentication
    config.headers.Authorization = `Bearer ${token}`;
    // Also send in other possible formats that OAuth2Server might check
    config.headers.authorization = `Bearer ${token}`;
    config.headers.access_token = token;
  }
  
  config.headers['X-USER-KEY'] = localStorage.getItem('userKey') || '';
  
  // Convert request body to application/x-www-form-urlencoded for OAuth2 endpoints
  if (config.url?.includes('/auth/login') || 
      config.url?.includes('/auth/refresh') || 
      config.url?.includes('/auth/logout')) {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (config.data) {
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
  (response) => {
    // Log successful responses for /users/me
    if (response.config.url?.includes('/users/me')) {
      logger.info("Successful /users/me response", {
        status: response.status,
        hasData: !!response.data,
        hasUser: !!response.data?.user
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log the error details
    logger.error("API request failed", {
      url: originalRequest?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorData: error.response?.data,
      hasToken: !!localStorage.getItem('token')
    });

    // Only attempt to refresh token if it's a 401 error and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      logger.info("401 Unauthorized error - Attempting token refresh flow");
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const clientId = localStorage.getItem('clientId');
        const clientSecret = localStorage.getItem('clientSecret');
        
        logger.info("Token refresh check", {
          hasRefreshToken: !!refreshToken,
          hasClientId: !!clientId,
          hasClientSecret: !!clientSecret
        });
        
        // Only attempt refresh if we have all required tokens
        if (refreshToken && clientId && clientSecret) {
          logger.info("Attempting to refresh token with credentials");
          
          // Create a new axios instance for the refresh request that doesn't depend on existing auth
          const refreshAxios = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-API-KEY': import.meta.env.VITE_API_KEY
            }
          });
          
          const formData = qs.stringify({
            refreshToken,
            client_id: clientId,
            client_secret: clientSecret
          });
          
          logger.info(`Sending refresh request to ${import.meta.env.VITE_API_URL}/auth/refresh`);
          const response = await refreshAxios.post('/auth/refresh', formData);
          
          logger.info("Refresh response received", {
            status: response.status,
            hasData: !!response.data,
            hasToken: !!response.data?.token
          });
          
          const { token } = response.data;
          if (token) {
            logger.info("Token refreshed successfully");
            localStorage.setItem('token', token);
            
            // Update the failed request with the new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            // Also set lowercase version for consistency
            originalRequest.headers.authorization = `Bearer ${token}`;
            originalRequest.headers.access_token = token;
            
            // Use axios directly rather than the api instance
            logger.info("Retrying original request with new token");
            return axios(originalRequest);
          } else {
            logger.error("No token in refresh response");
            throw new Error("No token in refresh response");
          }
        } else {
          logger.error("Missing tokens for refresh", { 
            hasRefreshToken: !!refreshToken, 
            hasClientId: !!clientId, 
            hasClientSecret: !!clientSecret 
          });
          throw new Error("Missing tokens for refresh");
        }
      } catch (refreshError) {
        logger.error("Token refresh failed:", refreshError);
        // Clear auth state and redirect to home
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('clientId');
        localStorage.removeItem('clientSecret');
        
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          logger.info("Redirecting to login page after refresh failure");
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;