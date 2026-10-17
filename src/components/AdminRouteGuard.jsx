import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * Route Guard to protect all /admin/* routes except /admin/login
 * Automatically redirects unauthenticated users back to /admin/login
 */
export function AdminRouteGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-main)',
        gap: '12px'
      }}>
        <ShieldAlert size={36} color="var(--accent-primary)" className="glitch-hover" />
        <div className="mono" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          MEMVERIFIKASI AKSES ADMINISTRATOR...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember the intended location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
