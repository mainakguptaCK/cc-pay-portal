import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextInstance';
import { User, UserRole } from '../types';
import { users } from '../utils/mockData';

// interface AuthContextType {
//   currentUser: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<User>;
//   logout: () => void;
//   isAdmin: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log('in AuthContext.tsx');

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  console.log('currentUser : ',currentUser);
  
  const login = async (email: string, password: string): Promise<User> => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll use mock data
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const user = users.find(u => u.email === email);
        
        if (user && !user.isLocked) {
          setCurrentUser(user);
          resolve(user);
        } else {
          reject(new Error('Invalid credentials or account locked'));
        }
      }, 500);
    });
  };
  
  const logout = () => {
    setCurrentUser(null);
  };
  
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}