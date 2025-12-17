import { createContext, useContext, useState, useEffect } from "react";
import { adminAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔑 Check if user is authenticated by calling /api/admin/me
    const checkAuth = async () => {
      try {
        const response = await adminAPI.getMe();
        setAdmin(response.data.admin);
      } catch (error) {
        // Not authenticated or token expired
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminAPI.login({ email, password });
      const { admin: adminData } = response.data;
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await adminAPI.register({ name, email, password });
      const { admin: adminData } = response.data;
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await adminAPI.logout();
      
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAdmin(null);
    }
  };

  const value = {
    admin,
    login,
    register,
    logout,
    isAuthenticated: !!admin,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
