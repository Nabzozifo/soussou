import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  const isAdmin = !!(user && ((user.role && String(user.role).toLowerCase() === 'admin') || user.is_admin === true));
  return isAdmin ? children : <Navigate to="/" replace />;
};

export default RequireAdmin;