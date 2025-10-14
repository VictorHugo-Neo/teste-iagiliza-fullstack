import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Add a request interceptor to include the token in headers if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);