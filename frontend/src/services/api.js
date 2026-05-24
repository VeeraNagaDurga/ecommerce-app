import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://ecommerce-app-9bg2.onrender.com';

const api = axios.create({
  baseURL: baseURL + '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { token } = JSON.parse(auth);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API response error:', error);
    return Promise.reject(error);
  }
);

export default api;
