// src/Hooks/useRateLimit.js
import { useRef, useCallback } from 'react'

/**
 * Hook para limitar la frecuencia de llamadas a funciones
 * @param {number} limit - Número máximo de llamadas permitidas
 * @param {number} windowMs - Ventana de tiempo en milisegundos
 * @returns {Object} Métodos para verificar y resetear el límite
 */
export const useRateLimit = (limit = 10, windowMs = 1000) => {
    const calls = useRef([])
    const timeoutRef = useRef(null)
    
    const checkLimit = useCallback(() => {
        const now = Date.now()
        
        // Limpiar llamadas antiguas
        calls.current = calls.current.filter(time => now - time < windowMs)
        
        if (calls.current.length >= limit) {
            return false
        }
        
        calls.current.push(now)
        return true
    }, [limit, windowMs])
    
    const resetLimit = useCallback(() => {
        calls.current = []
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])
    
    const getRemainingCalls = useCallback(() => {
        const now = Date.now()
        const validCalls = calls.current.filter(time => now - time < windowMs)
        return Math.max(0, limit - validCalls.length)
    }, [limit, windowMs])
    
    const getTimeUntilReset = useCallback(() => {
        const now = Date.now()
        if (calls.current.length === 0) return 0
        
        const oldestCall = Math.min(...calls.current)
        const timeUntilExpiry = windowMs - (now - oldestCall)
        return Math.max(0, timeUntilExpiry)
    }, [windowMs])
    
    return { 
        checkLimit, 
        resetLimit, 
        getRemainingCalls,
        getTimeUntilReset
    }
}

export default useRateLimit