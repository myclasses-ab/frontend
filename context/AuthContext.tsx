'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/api/auth';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  sendOtp: (phone: string) => Promise<{ isRegistered: boolean }>;
  verifyOtp: (phone: string, otp: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('studentAuthToken') : null;
    if (storedToken) {
      setToken(storedToken);
      authApi
        .me()
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('studentAuthToken');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    const response = await authApi.sendOtp(phone);
    return { isRegistered: response.isRegistered };
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string, fullName?: string) => {
    const response = await authApi.verifyOtp(phone, otp, fullName);
    localStorage.setItem('studentAuthToken', response.token);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('studentAuthToken');
    setToken(null);
    setUser(null);
    window.location.reload();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        sendOtp,
        verifyOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
