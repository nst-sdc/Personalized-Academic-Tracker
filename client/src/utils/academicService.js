// services/academicService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const academicService = {
  // Get academic information
  getAcademicInfo: async () => {
    try {
      const response = await api.get('/academic');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return { success: false, message: 'Academic information not found' };
      }
      throw error;
    }
  },

  // Create academic information
  createAcademicInfo: async (academicData) => {
    try {
      const response = await api.post('/academic', academicData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Update academic information
  updateAcademicInfo: async (academicData) => {
    try {
      const response = await api.put('/academic', academicData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Delete academic information
  deleteAcademicInfo: async () => {
    try {
      const response = await api.delete('/academic');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Create or update academic information (upsert)
  upsertAcademicInfo: async (academicData) => {
    try {
      const response = await api.post('/academic/upsert', academicData);
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  },

  // Get academic statistics (admin only)
  getAcademicStats: async () => {
    try {
      const response = await api.get('/academic/stats');
      return response.data;
    } catch (error) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
};

export default academicService;