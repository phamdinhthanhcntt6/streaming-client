import axios from 'axios';

// Lấy base URL từ biến môi trường, hoặc dùng default
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Thêm token vào headers nếu có
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (chỉ chạy trên Client)
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

// Response Interceptor: Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý token hết hạn, xoá token khỏi storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        // window.location.href = '/login'; // Có thể bật lên nếu muốn auto redirect
      }
    }
    return Promise.reject(error);
  }
);
