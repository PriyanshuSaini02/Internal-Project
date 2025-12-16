import { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminData = localStorage.getItem('admin');
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminAPI.login({ email, password });
      const { token, admin: adminData } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await adminAPI.register({ name, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      // After registration, login to get admin data
      const loginResponse = await adminAPI.login({ email, password });
      const { admin: adminData } = loginResponse.data;
      localStorage.setItem('admin', JSON.stringify(adminData));
      setAdmin(adminData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.msg || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
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

