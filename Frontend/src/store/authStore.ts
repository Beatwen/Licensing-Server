import { create } from 'zustand';
import { User } from '../types/types';
import api from '../utils/api';
import { logger } from '../utils/logger';

interface AuthState {
  user: User | null;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: { userName?: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userName: null,
  firstName: null,
  lastName: null,
  email: null,
  isLoading: false,
  error: null,
  
  setUser: (user) => set((state) => ({ ...state, user })),
  
  initialize: async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    const clientId = localStorage.getItem('clientId');
    const clientSecret = localStorage.getItem('clientSecret');
    
    // Log all available tokens
    logger.info("Initialize auth store with tokens:", {
      hasToken: !!token,
      hasRefreshToken: !!refreshToken,
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      tokenFirstChars: token ? token.substring(0, 15) + '...' : 'none'
    });
    
    // If we don't have all required tokens, clear the user state
    if (!token || !refreshToken || !clientId || !clientSecret) {
      logger.info("Missing tokens during initialization - clearing user state");
      set((state) => ({ ...state, user: null }));
      return;
    }

    try {
      logger.info("Validating user session - sending request to /users/me");
      const response = await api.get('/users/me');
      logger.info("User session validated", {
        status: response.status,
        hasData: !!response.data,
        hasUser: !!response.data?.user,
        userData: response.data?.user ? {
          id: response.data.user.id,
          email: response.data.user.email
        } : null
      });
      set((state) => ({ ...state, user: response.data.user }));
    } catch (error: unknown) {
      logger.error("Failed to validate user session:", error);
      
      // Log more detailed error information
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error.response as { status?: number; data?: unknown };
        logger.error("Error details:", {
          status: responseError?.status,
          data: responseError?.data,
        });
      }
      
      logger.info("Clearing user state and tokens due to validation failure");
      set((state) => ({ ...state, user: null }));
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('clientId');
      localStorage.removeItem('clientSecret');
    }
  },
  
  login: async (email, password) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await api.post('/auth/login', { email, password });
      logger.info("Login response", response.data);
      const { user, token, client } = response.data;
      
      // Store client credentials
      if (client) {
        logger.info("client", client);
        logger.info("Storing client credentials");
        localStorage.setItem('clientId', client.clientId);
        localStorage.setItem('clientSecret', client.clientSecret);
      }
      
      // Store tokens
      logger.info("Storing tokens");
      localStorage.setItem('token', token.accessToken);
      localStorage.setItem('refreshToken', token.refreshToken);
      
      set((state) => ({ ...state, user, isLoading: false }));
    } catch (error: unknown) {
      logger.error("Login error:", error);
      let errorMessage = "Une erreur est survenue";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const response = error.response as { data?: { error?: string; message?: string } };
        if (response?.data) {
          errorMessage = response.data.error || response.data.message || errorMessage;
        }
      }
      
      set((state) => ({ 
        ...state,
        error: errorMessage,
        isLoading: false 
      }));
      throw error;
    }
  },
  
  register: async (email, password, userData) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password,
        ...userData
      });
      logger.info("Register response", response.data);
      set((state) => ({ ...state, isLoading: false }));
    } catch (error: unknown) {
      logger.error("Register error:", error);
      set((state) => ({
        ...state,
        error: error instanceof Error ? error.message : 'An error occurred during registration',
        isLoading: false
      }));
      throw error;
    }
  },
  
  logout: async () => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }
      
      await api.post('/auth/logout', { token: refreshToken });
      logger.info("Logged out successfully");
      
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('clientId');
      localStorage.removeItem('clientSecret');
      set((state) => ({ ...state, user: null, isLoading: false }));
    } catch (error: unknown) {
      logger.error("Logout error:", error);
      set((state) => ({
        ...state,
        error: error instanceof Error ? error.message : 'An error occurred during logout',
        isLoading: false
      }));
    }
  },
}));