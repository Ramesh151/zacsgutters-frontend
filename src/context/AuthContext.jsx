import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/protected', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return true;
      } else {
        console.error('Login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Login error:', error);
    }

    return false;
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:4000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, checkAuthStatus, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);






// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axiosInstance from '../utils/axiosInstance';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const checkUserLoggedIn = async () => {
//       try {
//         const response = await axiosInstance.get('/api/protected', { withCredentials: true });
//         setUser(response.data.user);
//       } catch (error) {
//         setUser(null);
//       }
//     };

//     checkUserLoggedIn();
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const isAuthenticated = () => {
//     return !!user;
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };




// // src/context/AuthContext.js
// import { createContext, useContext, useState } from 'react';
// import axiosInstance from '../utils/axiosInstance';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (email, password) => {
//     try {
//       const response = await axiosInstance.post('/api/users/login', { email, password });
//       console.log("responce",response);
      
//       setUser(response.data.user);
//     } catch (error) {
//       console.error('Login failed:', error);
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await axiosInstance.post('/api/users/logout');
//       setUser(null);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
