import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'Admin' | 'Branislav' | 'Dusan' | null;

interface AuthContextType {
  currentUser: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserRole>(null);

  const login = (role: UserRole) => setCurrentUser(role);
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
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
