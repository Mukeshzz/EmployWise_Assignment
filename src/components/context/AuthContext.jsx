import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Or sessionStorage

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token); // Or sessionStorage
    } else {
      localStorage.removeItem('token'); // Or sessionStorage
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};