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
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  'email'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Initialize Microsoft Graph Client
  const getGraphClient = (token: string) => {
    return Client.init({
      authProvider: (done) => {
        done(null, token);
      }
    });
  };

  // Fetch user details from Microsoft Graph
  const fetchUserDetails = async (userId: string, token: string) => {
    try {
      const graphClient = getGraphClient(token);
      const user = await graphClient
        .api('/me')
        .select('id,displayName,mail,accountEnabled,userPrincipalName')
        .get();

      console.log('Graph API user details:', user);

      return {
        id: user.id,
        name: user.displayName,
        email: user.mail || user.userPrincipalName,
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
          console.log('Auth data:', authData);
          
          if (authData.clientPrincipal) {
            const { userDetails, userRoles, claims, accessToken } = authData.clientPrincipal;
            console.log('Client principal:', authData.clientPrincipal);
            console.log('Access token:', accessToken);

            setAccessToken(accessToken);

            // Extract roles and email from claims
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
            const hasAdminRole = uniqueExtractedRoles.includes('admin');
            const userEmail = extractedEmails[0];

            // Fetch additional user details from Graph API if we have a token
            let graphUserDetails = null;
            if (accessToken) {
              graphUserDetails = await fetchUserDetails(authData.clientPrincipal.userId, accessToken);
            }

            // Create user object combining ADB2C and Graph API data
            const user: User = {
              id: authData.clientPrincipal.userId,
              name: graphUserDetails?.name || userDetails,
              email: graphUserDetails?.email || userEmail || userDetails,
              role: hasAdminRole ? 'admin' : 'customer',
              isLocked: graphUserDetails ? !graphUserDetails.isEnabled : false
            };

            setCurrentUser(user);

            // Register Account in the backend
            try {
              await fetch('https://cc-pay-app-service-dev-cecxemfggbf0dzas.eastus-01.azurewebsites.net/api/admin/createAccount', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  UserID: user.id,
                  AccountType: "Active",
                  CurrentBalance: 0.00,
                  AvailableCredit: 0.00,
                }),
              });
            } catch (error) {
              console.error('Error registering account:', error);
            }
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
      setAccessToken(null);
    } catch (error) {
      console.log('Logout error, clearing local state:', error);
      setCurrentUser(null);
      setAccessToken(null);
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