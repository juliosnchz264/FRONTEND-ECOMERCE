// src/Context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

export const ThemeProvider = ({ children }) => {
    // 🔥 Usar la clase actual del DOM como estado inicial
    // Esto evita que se re-evalúe y cause un flash
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Leer directamente del DOM si la clase 'dark' está presente
        // El script en el HTML ya la aplicó antes de que React se monte
        return document.documentElement.classList.contains('dark')
    })

    // Sincronizar cambios de tema
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [isDarkMode])

    // Escuchar cambios en la preferencia del sistema
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        
        const handleChange = (e) => {
            // Solo cambiar si NO hay una preferencia guardada
            if (!localStorage.getItem('theme')) {
                setIsDarkMode(e.matches)
            }
        }
        
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev)
    }, [])

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}