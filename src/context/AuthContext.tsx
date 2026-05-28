import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export type UserRole = 'Admin' | 'Branislav' | 'Dusan' | null;

interface AuthContextType {
  currentUser: UserRole;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        const email = user.email.toLowerCase();
        if (email.includes('admin@')) {
          setCurrentUser('Admin');
        } else if (email.includes('branislav@')) {
          setCurrentUser('Branislav');
        } else if (email.includes('dusan@')) {
          setCurrentUser('Dusan');
        } else {
          setCurrentUser('Admin'); // Default fallback
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout }}>
      {!loading && children}
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
