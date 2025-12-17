import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔑 Enable cookies for cross-origin requests
});

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored admin data
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Admin API
export const adminAPI = {
  register: (data) => api.post('/admin/register', data),
  login: (data) => api.post('/admin/login', data),
  logout: () => api.post('/admin/logout'),
  getMe: () => api.get('/admin/me'),
  forgotPassword: (data) => api.post('/admin/forgot-password', data),
  resetPassword: (data) => api.post('/admin/reset-password', data),
  verifyResetToken: (token) => api.get(`/admin/verify-reset-token/${token}`),
};

// User API
export const userAPI = {
  getAll: () => api.get('/users'),
  getDeleted: () => api.get('/users/deleted'),
  search: (params) => api.get('/users/search', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users/add', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  restore: (id) => api.post(`/users/${id}/restore`),
  uploadProfilePicture: (id, file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);
    return api.post(`/users/${id}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getProfilePicture: (id) => {
    return axios.get(`${API_BASE_URL}/users/${id}/profile-picture`, {
      withCredentials: true,
      responseType: 'blob',
    });
  },
};

export default api;