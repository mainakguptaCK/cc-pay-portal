import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextInstance';
import { User } from '../types';
import { users } from '../utils/mockData';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Check for ADB2C authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/.auth/me');
        
        // Check if response is JSON before trying to parse it
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const authData = await response.json();
          
          if (authData.clientPrincipal) {
            const { userDetails, userRoles } = authData.clientPrincipal;

            console.log('response : ',response);
            console.log('authData : ',authData);
            console.log('userRoles : ',userRoles);
            console.log('userDetails : ',userDetails);
            
            // Create user object from ADB2C data
            const user: User = {
              id: authData.clientPrincipal.userId,
              name: userDetails,
              email: userDetails,
              role: userRoles.includes('admin') ? 'admin' : 'customer',
              isLocked: false
            };
            
            setCurrentUser(user);
          }
        } else {
          // If we're not getting JSON, we're probably in local development
          // Just leave the user as null and let them log in through the mock system
          console.log('Auth endpoint not available, falling back to mock auth');
        }
      } catch (error) {
        // Log the error but don't throw - this allows the app to fall back to mock auth
        console.log('Auth check failed, falling back to mock auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<User> => {
    // For demo/local development only
    return new Promise((resolve, reject) => {
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
  
  const logout = async () => {
    try {
      // Try ADB2C logout endpoint first
      const response = await fetch('/.auth/logout');
      if (!response.ok) {
        // If ADB2C logout fails, just clear the local state
        console.log('ADB2C logout failed, clearing local state only');
      }
      setCurrentUser(null);
    } catch (error) {
      // If there's an error (e.g., in local dev), just clear the local state
      console.log('Logout error, clearing local state:', error);
      setCurrentUser(null);
    }
  };
  
  const isAdmin = currentUser?.role === 'admin';
  
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        logout,
        isAdmin,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}