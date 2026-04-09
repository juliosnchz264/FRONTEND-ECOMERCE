// src/main.jsx
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router'

// Marcar cuando la página está cargada para mostrar el contenido
const markAsLoaded = () => {
    // Pequeño delay para asegurar que React ya renderizó
    setTimeout(() => {
        document.body.classList.add('loaded')
    }, 100)
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markAsLoaded)
} else {
    markAsLoaded()
}

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)