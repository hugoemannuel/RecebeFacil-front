import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(c => c.trim().startsWith('recebefacil_token='));
    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
