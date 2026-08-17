import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== allowedRole) {
    // Redirect to the appropriate login page based on role expected
    return <Navigate to={allowedRole === 'admin' ? '/admin/login' : '/student/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
