import axios, { AxiosInstance, AxiosError } from 'axios';

// Get the API base URL from environment or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Create axios instance with safe defaults
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests for auth
  timeout: 30000, // 30 second timeout
});

// Request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => {
    // If we have a token in localStorage, use it for Authorization header
    // Some routers prefer header over cookies
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and trigger re-login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        // Optional: window.location.reload() or event bus to show modal
      }
    }
    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    }
    if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found');
    }
    if (error.response?.status === 500) {
      // Server error
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
