import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContextInstance';
import { User } from '../types';
import { users } from '../utils/mockData';
import { Client } from '@microsoft/microsoft-graph-client';

interface Claim {
  typ: string;
  val: string;
}

// Common role claim types
const ROLE_CLAIM_TYPES = [
  'roles',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
];
const EMAIL_CLAIM_TYPES = [
  'emails',
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/email'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Initialize Microsoft Graph Client
  const getGraphClient = (accessToken: string) => {
    return Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
  };

  // Fetch user details from Microsoft Graph
  const fetchUserDetails = async (userId: string, accessToken: string) => {
    try {
      const graphClient = getGraphClient(accessToken);
      const user = await graphClient
        .api(`/users/${userId}`)
        .select('id,displayName,mail,accountEnabled')
        .get();

      console.log('user details from microsoft graph : ',user);

      return {
        id: user.id,
        name: user.displayName,
        email: user.mail,
        isEnabled: user.accountEnabled
      };
    } catch (error) {
      console.error('Error fetching user details from Graph API:', error);
      return null;
    }
  };

  // Check for ADB2C authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/.auth/me');
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const authData = await response.json();
          console.log('authData : ',authData);
          
          if (authData.clientPrincipal) {
            const { userDetails, userRoles, claims, accessToken } = authData.clientPrincipal;

            console.log('access token : ',accessToken);
            console.log('clientPrincipal : ',authData.clientPrincipal);

            // Extract roles from claims array
            const extractedRoles: string[] = [];
            const extractedEmails: string[] = [];
            claims.forEach((claim: Claim) => {
              if (ROLE_CLAIM_TYPES.includes(claim.typ)) {
                extractedRoles.push(claim.val);
              }
              if (EMAIL_CLAIM_TYPES.includes(claim.typ)) {
                extractedEmails.push(claim.val);
              }
            });

            const uniqueExtractedRoles = Array.from(new Set(extractedRoles));
            const userEmail = extractedEmails[0];
            console.log('userEmail : ',userEmail);
            const hasAdminRole = uniqueExtractedRoles.includes('admin');

            // Fetch additional user details from Graph API
            const userId = authData.clientPrincipal.userId;
            const graphUserDetails = await fetchUserDetails(userId, accessToken);

            // Create user object combining ADB2C and Graph API data
            const user: User = {
              id: userId,
              name: graphUserDetails?.name || userDetails,
              email: userEmail || userDetails,
              role: hasAdminRole ? 'admin' : 'customer',
              isLocked: graphUserDetails ? !graphUserDetails.isEnabled : false
            };

            setCurrentUser(user);

            // Register Account in the backend
            await fetch('https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/createAccount', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                UserID: userId,
                AccountType: "Active",
                CurrentBalance: 0.00,
                AvailableCredit: 0.00,
              }),
            });
          }
        } else {
          console.log('Auth endpoint not available, falling back to mock auth');
        }
      } catch (error) {
        console.log('Auth check failed, falling back to mock auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string): Promise<User> => {
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
      const response = await fetch('/.auth/logout');
      if (!response.ok) {
        console.log('ADB2C logout failed, clearing local state only');
      }
      setCurrentUser(null);
    } catch (error) {
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