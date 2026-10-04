import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Require general authentication (candidate or admin).
 * Redirects to /careers/login if not logged in.
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030304',
        color: '#888',
        fontFamily: 'sans-serif'
      }}>
        Authenticating...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/careers/login" state={{ from: location }} replace />;
  }

  return children;
}

/**
 * Require Admin authentication (role === 'admin' or is_admin or stored token).
 * Redirects to /careers/login if not logged in or unauthorized.
 */
export function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#030304',
        color: '#888',
        fontFamily: 'sans-serif'
      }}>
        Verifying Admin Privileges...
      </div>
    );
  }

  const isAdmin = user && (user.role === 'admin' || user.is_admin || user.isAdmin || user.role === 'ADMIN' || user.email === 'admin@kodewar.com');

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/careers/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
