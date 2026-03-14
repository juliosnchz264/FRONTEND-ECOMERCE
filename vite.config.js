// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      // Cada vez que el frontend haga una petición a una ruta que empiece por '/api'
      '/api': {
        target: 'http://192.168.1.41:3001', // 👈 La IP de tu Windows y el puerto de tu BACKEND
        changeOrigin: true,
        // No necesitas 'rewrite' si tus rutas de backend también empiezan con '/api'
      },
    },
  },
})