// AuthContext.js

import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginF = () => {
    // Lógica para iniciar sesión
    setIsAuthenticated(true);
  };

  const logoutF = () => {
    // Lógica para cerrar sesión
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginF, logoutF }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
