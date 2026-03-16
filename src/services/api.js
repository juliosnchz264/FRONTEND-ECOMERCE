// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.117:3001/api',
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
    
    // No redirigir si es una petición que esperamos que falle (como check-session)
    const isAuthCheck = originalRequest.url.includes('/auth/check-session');
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Solo redirigir si NO es ruta pública y NO es check de autenticación
          if (!isPublicRoute && !isAuthCheck && !originalRequest.url.includes('/auth/refresh')) {
            console.log('🚫 No autorizado, redirigiendo a login...');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('wasAuthenticated');
            window.location.href = '/login';
          } else {
            console.log('ℹ️ 401 ignorado (ruta pública o check de auth):', originalRequest.url);
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