import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.41:3001/api',
  withCredentials: true
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expirado o no autenticado
          window.location.href = '/login';
          break;
        case 403:
          // Acceso prohibido
          window.location.href = '/forbidden';
          break;
        case 404:
          // Recurso no encontrado en API
          console.error('Recurso no encontrado:', error.config.url);
          break;
        case 500:
          // Error del servidor
          console.error('Error del servidor');
          // Podrías redirigir a una página de error 500
          break;
        default:
          console.error('Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api;