import api from './api.js';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (payload) => {
  try {
    const response = await api.post('/auth/register', payload);
    return response.data;
  } catch (err) {
    console.error('registerUser error:', err.response?.data || err.message || err);
    throw err;
  }
};
