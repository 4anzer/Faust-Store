import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { StorePage } from './pages/StorePage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminRouteGuard } from './components/AdminRouteGuard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CatalogProvider>
          <Routes>
            {/* Public Customer Store Page (Guest - No Account/Register required) */}
            <Route path="/" element={<StorePage />} />

            {/* Public Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes (Guard redirects unauthenticated visitors to /admin/login) */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRouteGuard>
                  <AdminDashboardPage />
                </AdminRouteGuard>
              }
            />

            {/* Admin root alias */}
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CatalogProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
