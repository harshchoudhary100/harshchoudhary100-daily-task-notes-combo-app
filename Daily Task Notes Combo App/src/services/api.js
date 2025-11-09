// client/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
}

// Auth helpers
export const AuthAPI = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data;
  },
  logout() {
    setAuthToken(null);
    localStorage.removeItem('user');
  }
};

// Tasks
export const TaskAPI = {
  list: async () => (await api.get('/tasks')).data,
  create: async (payload) => (await api.post('/tasks', payload)).data,
  update: async (id, payload) => (await api.put(`/tasks/${id}`, payload)).data,
  toggle: async (id) => (await api.patch(`/tasks/${id}/toggle`)).data,
  remove: async (id) => (await api.delete(`/tasks/${id}`)).data
};

// Notes
export const NoteAPI = {
  list: async (q) => (await api.get('/notes', { params: { q } })).data,
  create: async (payload) => (await api.post('/notes', payload)).data,
  update: async (id, payload) => (await api.put(`/notes/${id}`, payload)).data,
  remove: async (id) => (await api.delete(`/notes/${id}`)).data
};

export default api;
