import { createContext } from 'react';

export const loadUserFromStorage = () => {
  try {
    const stored = localStorage.getItem('auth');
    if (!stored) return { token: null, user: null };
    return JSON.parse(stored);
  } catch (error) {
    return { token: null, user: null };
  }
};

export const AuthContext = createContext({
  auth: { token: null, user: null },
  setAuth: () => {},
  logout: () => {},
});
