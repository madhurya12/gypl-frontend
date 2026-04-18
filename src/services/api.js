import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add JWT token to requests if available (support both admin and user tokens)
api.interceptors.request.use((config) => {
  // Check for user token first
  let token = localStorage.getItem('userToken')
  
  // If no user token, check for admin token
  if (!token) {
    token = localStorage.getItem('adminToken')
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const participantAPI = {
  register: (data) => api.post('/register', data),
  getAll: () => api.get('/participants'),
  getByCompetition: (competitionId) => api.get(`/participants?competition=${competitionId}`),
  getStats: () => api.get('/participants/stats'),
}

export const competitionAPI = {
  getAll: () => api.get('/competitions'),
  getById: (id) => api.get(`/competitions/${id}`),
  create: (data) => api.post('/competitions', data),
  update: (id, data) => api.put(`/competitions/${id}`, data),
  delete: (id) => api.delete(`/competitions/${id}`),
}

export const eventAPI = {
  get: () => api.get('/event'),
  update: (data) => api.put('/event', data),
}

export const adminAPI = {
  signup: (data) => api.post('/admin/signup', data),
  signin: (data) => api.post('/admin/signin', data),
  getProfile: () => api.get('/admin/profile'),
}

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
}

export const userEventAPI = {
  registerForCompetition: (competitionId) => api.post(`/user/register/${competitionId}`),
  getMyEvents: () => api.get('/user/my-events'),
  unregisterFromCompetition: (competitionId) => api.delete(`/user/unregister/${competitionId}`),
}

export default api
