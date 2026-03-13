import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token from localStorage on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('hi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getProfile = () => api.get('/api/auth/profile');

// Locations
export const getLocations = (params) => api.get('/api/locations', { params });
export const getLocation = (id) => api.get(`/api/locations/${id}`);
export const getStates = () => api.get('/api/locations/states');
export const addReview = (id, data) => api.post(`/api/locations/${id}/reviews`, data);

// Messages
export const getMessages = (locationId) => api.get(`/api/messages/${locationId}`);
export const postMessage = (data) => api.post('/api/messages', data);

// AI
export const chatWithAI = (data) => api.post('/api/ai/chat', data);

export default api;
