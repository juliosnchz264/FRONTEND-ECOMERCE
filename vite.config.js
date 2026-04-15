// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://192.168.1.41:3001',
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://192.168.1.41:3001',
                ws: true,
                changeOrigin: true,
                rewriteWsOrigin: true,
            },
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'router': ['react-router'],
                    'motion': ['framer-motion'],
                    'icons': ['react-icons'],
                },
            },
        },
        // Warn if a chunk exceeds 800 kB
        chunkSizeWarningLimit: 800,
    },
})
