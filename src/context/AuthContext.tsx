import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextInstance';
import { User } from '../types';

const validRoles = ['borrower', 'investor'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/.auth/me');
        const data = await response.json();
        const userAttributeRole = 'extension_user_role_type';

        if (data.clientPrincipal) {
          const roleClaim = data.clientPrincipal.claims?.find(
            (claim: any) => claim.typ === userAttributeRole
          );
          const roleFromClaim = roleClaim?.val || 'borrower';
          const role = checkRole(roleFromClaim);

          const nameClaim = data.clientPrincipal.claims?.find(
            (claim: any) => claim.typ === 'name' || claim.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
          );
          const name = nameClaim?.val || data.clientPrincipal.userDetails;

          setUser({
            id: data.clientPrincipal.userId,
            name: name,
            email: data.clientPrincipal.userDetails,
            role: role as 'borrower' | 'investor' | 'admin',
            profileComplete: true
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  function checkRole(role: string | undefined): 'borrower' | 'investor' {
    return role && validRoles.includes(role) ? (role as 'borrower' | 'investor') : 'borrower';
  }

  const login = useCallback(async (email: string, password: string) => {
    console.log('Login is handled by ADB2C');
  }, []);

  const logout = useCallback(() => {
    window.location.href = '/.auth/logout';
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
