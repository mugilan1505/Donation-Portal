// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      console.log("Initial stored user:", storedUser ? "exists" : "none");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Setting user from localStorage:", parsedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error reading user from localStorage", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to update user
  const login = (userData) => {
    console.log("Setting user in context:", userData);
    setUser(userData);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user to localStorage", error);
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out, clearing user data");
    setUser(null);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error removing user from localStorage", error);
    }
  };

  const value = { 
    user, 
    setUser: login, 
    logout, 
    isAuthenticated: !!user,
    loading 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
