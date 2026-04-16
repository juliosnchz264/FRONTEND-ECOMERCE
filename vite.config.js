// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    const backendOrigin = (env.VITE_BACKEND_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')

    return {
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        proxy: {
            '/api': {
                target: backendOrigin,
                changeOrigin: true,
            },
            '/socket.io': {
                target: backendOrigin,
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
    }
})
