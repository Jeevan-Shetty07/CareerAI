import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Profile } from '../types';
import { api, getAuthToken, setAuthToken, clearAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginDemoUser: () => Promise<void>;
  register: (data: { email: string; password: string; fullName: string; targetRole?: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch {
      clearAuthToken();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        setAuthToken(res.data.token);
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemoUser = async () => {
    return login('demo@careerai.local', 'DemoPassword123!');
  };

  const register = async (data: { email: string; password: string; fullName: string; targetRole?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      if (res.success) {
        setAuthToken(res.data.token);
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.getMe();
      if (res.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
      }
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginDemoUser,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
