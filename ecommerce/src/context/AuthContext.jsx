
import { createContext, useContext, useState } from "react";

import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
} from "../api/auth";

// Create the context
const AuthContext = createContext(null);

// Provider that shares authentication information
export const AuthProvider = ({ children }) => {
  // Load the saved user when the application starts
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Login
  const login = async (credentials) => {
    const data = await loginRequest(credentials);

    if (data.success && data.user) {
      setUser(data.user);
    }

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerRequest(userData);

    if (data.success && data.user) {
      setUser(data.user);
    }

    return data;
  };

  // Logout
  const logout = () => {
    logoutRequest();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing authentication
export const useAuth = () => {
  return useContext(AuthContext);
};
