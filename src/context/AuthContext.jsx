import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyAdminCredentials, generateSessionToken } from '../utils/cryptoAuth';

const AuthContext = createContext(null);

const SESSION_KEY = 'faust_store_admin_auth_v1';
const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 Hours

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on app initialization
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && session.token && session.expiresAt > Date.now()) {
          setAdminUser(session.username);
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch (e) {
      console.warn("Session check error", e);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login handler
  const login = async (username, password) => {
    try {
      const verification = await verifyAdminCredentials(username, password);
      if (!verification.success) {
        return { success: false, message: verification.message };
      }

      const token = generateSessionToken();
      const expiresAt = Date.now() + SESSION_DURATION_MS;
      const sessionData = {
        token,
        username: username.trim(),
        expiresAt
      };

      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setAdminUser(sessionData.username);
      setIsAuthenticated(true);

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Terjadi kesalahan sistem login.' };
    }
  };

  // Logout handler
  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAuthenticated,
        isLoading,
        login,
        logout
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
