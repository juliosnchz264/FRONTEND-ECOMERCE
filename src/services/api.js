// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 🚨 Interceptor para SILENCIAR COMPLETAMENTE los 401 de check-session
api.interceptors.response.use(
  response => response,
  error => {
    const isAuthCheck = error.config?.url?.includes('/auth/check-session');
    
    // Si es check-session con 401, DEVOLVER RESPUESTA FALSA
    if (isAuthCheck && error.response?.status === 401) {
      // Esto evita que Axios muestre el error en consola
      return Promise.resolve({ 
        data: { user: null },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;