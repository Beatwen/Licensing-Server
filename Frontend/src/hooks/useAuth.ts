import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, login, register, logout, setUser, initialize } = useAuthStore();
  
  return {
    user,
    login,
    register,
    logout,
    setUser,
    initialize,
    isAuthenticated: !!user
  };
}; 