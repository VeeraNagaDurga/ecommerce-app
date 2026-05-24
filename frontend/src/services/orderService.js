import api from './api.js';

export const createOrder = async (payload) => {
  const response = await api.post('/orders', payload);
  return response.data;
};

export const fetchUserOrders = async () => {
  const response = await api.get('/orders/mine');
  return response.data;
};

export const fetchAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};
