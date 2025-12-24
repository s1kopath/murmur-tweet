import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, AuthResponse } from '../services/authService';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, name: string, email: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.getToken()) {
      setUser(currentUser);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response: AuthResponse = await authService.login({ username, password });
    setUser(response.user);
  };

  const register = async (username: string, password: string, name: string, email: string) => {
    await authService.register({ username, password, name, email });
    await login(username, password);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

