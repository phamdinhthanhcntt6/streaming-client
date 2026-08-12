import axios from 'axios';

// Get base URL from environment variable, or use default
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Add token to headers if present
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (runs on Client only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle expired token, remove token from storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // window.location.href = '/login'; // Can be enabled if you want auto redirect
      }
    }
    return Promise.reject(error);
  }
);
