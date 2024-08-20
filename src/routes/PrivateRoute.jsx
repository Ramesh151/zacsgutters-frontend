import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedAdminRoute = () => {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuthStatus();
    }
  }, [isAuthenticated, checkAuthStatus]);

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while checking auth status
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedAdminRoute;


// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedAdminRoute = () => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return <div>Loading...</div>; // You can replace this with a spinner or loader component
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
// };

// export default ProtectedAdminRoute;


