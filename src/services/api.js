// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.41:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Lista de rutas que NO deben redirigir al login
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/verify',
  '/auth/resend-verification',
  '/products',
  '/categories'
];

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;
    
    // No redirigir si es una ruta pública
    const isPublicRoute = publicRoutes.some(route => 
      originalRequest.url.includes(route)
    );
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (!isPublicRoute && !originalRequest.url.includes('/auth/refresh')) {
            console.log('🚫 No autorizado, redirigiendo a login...');
            // Limpiar antes de redirigir
            localStorage.removeItem('userInfo');
            localStorage.removeItem('wasAuthenticated');
            window.location.href = '/login';
          }
          break;
        case 403:
          if (!isPublicRoute) {
            window.location.href = '/forbidden';
          }
          break;
        default:
          console.error('Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;