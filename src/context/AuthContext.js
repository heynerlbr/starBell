// AuthContext.js
import React, {createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const loginA = user => {
    setIsAuthenticated(true);
    setUserProfile(user);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{isAuthenticated, userProfile, loginA, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
