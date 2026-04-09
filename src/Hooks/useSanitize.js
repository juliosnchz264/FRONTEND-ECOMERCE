// src/Hooks/useSanitize.js
import { useCallback } from 'react'
import DOMPurify from 'dompurify'

// Configuración por defecto de DOMPurify
const DEFAULT_PURIFY_CONFIG = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'li', 'ol'],
    ALLOWED_ATTR: [],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover']
}

// Constantes de validación
const CONSTANTS = {
    MAX_TEXT_LENGTH: 5000,
    MAX_URL_LENGTH: 2000,
    MAX_ID_LENGTH: 100,
    MAX_EMAIL_LENGTH: 255,
    MAX_USERNAME_LENGTH: 50,
    MAX_PRICE: 999999.99,
    MIN_PRICE: 0,
    MAX_STOCK: 999999,
    MIN_STOCK: 0,
    MAX_NUMBER: 1e12,
    MIN_NUMBER: -1e12
}

export const useSanitize = () => {
    // Sanitizar HTML con DOMPurify
    const sanitizeHtml = useCallback((html, config = {}) => {
        if (!html || typeof html !== 'string') return ''
        
        const mergedConfig = { ...DEFAULT_PURIFY_CONFIG, ...config }
        return DOMPurify.sanitize(html, mergedConfig)
    }, [])

    // Sanitizar texto plano
    const sanitizeText = useCallback((text) => {
        if (!text || typeof text !== 'string') return ''
        
        // Usar DOMPurify para eliminar HTML primero
        let cleanText = DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
        
        // Escapar caracteres especiales
        cleanText = cleanText
            .replace(/[&<>]/g, (match) => {
                const escapeMap = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;'
                }
                return escapeMap[match]
            })
            .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .slice(0, CONSTANTS.MAX_TEXT_LENGTH)
        
        return cleanText.trim()
    }, [])

    // Sanitizar para URL (prevenir path traversal y protocolos peligrosos)
    const sanitizeUrl = useCallback((url) => {
        if (!url || typeof url !== 'string') return ''
        
        // Decodificar URL primero (múltiples iteraciones)
        let decodedUrl = url
        let previousUrl = ''
        let maxIterations = 5
        
        // Decodificar recursivamente para detectar codificaciones anidadas
        while (decodedUrl !== previousUrl && maxIterations-- > 0) {
            previousUrl = decodedUrl
            try {
                decodedUrl = decodeURIComponent(decodedUrl)
            } catch {
                break
            }
        }
        
        // Lista de protocolos peligrosos (expandida)
        const dangerousProtocols = [
            /^javascript:/i,
            /^data:/i,
            /^vbscript:/i,
            /^file:/i,
            /^about:/i,
            /^chrome:/i,
            /^webkit:/i,
            /^view-source:/i,
            /^jar:/i,
            /^ws:/i,
            /^wss:/i,
            /^ftp:/i,
            /^gopher:/i
        ]
        
        // Verificar en la versión decodificada
        for (const protocol of dangerousProtocols) {
            if (protocol.test(decodedUrl)) {
                console.warn(`URL bloqueada por protocolo peligroso: ${url}`)
                return ''
            }
        }
        
        // Verificar caracteres peligrosos
        const dangerousChars = /[<>"'`]/g
        if (dangerousChars.test(decodedUrl)) {
            return ''
        }
        
        // Validar que sea URL HTTP/HTTPS válida
        try {
            const parsed = new URL(decodedUrl)
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                return ''
            }
            // Limitar longitud
            let cleanUrl = parsed.toString()
            if (cleanUrl.length > CONSTANTS.MAX_URL_LENGTH) {
                cleanUrl = cleanUrl.slice(0, CONSTANTS.MAX_URL_LENGTH)
            }
            return cleanUrl
        } catch {
            // Si no es URL absoluta, verificar si es path relativo seguro
            if (decodedUrl.startsWith('/') && !decodedUrl.includes('//')) {
                return decodedUrl.replace(/[^a-zA-Z0-9/._-]/g, '').slice(0, 500)
            }
            return ''
        }
    }, [])

    // Sanitizar ID (solo caracteres alfanuméricos)
    const sanitizeId = useCallback((id) => {
        if (!id || typeof id !== 'string') return ''
        
        // Solo permitir caracteres alfanuméricos y guiones
        const cleanId = id.replace(/[^a-zA-Z0-9-]/g, '')
        return cleanId.slice(0, CONSTANTS.MAX_ID_LENGTH)
    }, [])

    // Sanitizar email
    const sanitizeEmail = useCallback((email) => {
        if (!email || typeof email !== 'string') return ''
        
        // Eliminar espacios y caracteres peligrosos
        const cleanEmail = email.trim().toLowerCase()
        // Validar formato básico de email
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
        if (!emailRegex.test(cleanEmail)) {
            return ''
        }
        return cleanEmail.slice(0, CONSTANTS.MAX_EMAIL_LENGTH)
    }, [])

    // Sanitizar nombre de usuario
    const sanitizeUsername = useCallback((username) => {
        if (!username || typeof username !== 'string') return ''
        
        // Solo permitir letras, números, guiones bajos y puntos
        const cleanUsername = username.replace(/[^a-zA-Z0-9_.-]/g, '')
        return cleanUsername.slice(0, CONSTANTS.MAX_USERNAME_LENGTH)
    }, [])

    // Sanitizar número
    const sanitizeNumber = useCallback((value) => {
        if (value === null || value === undefined) return 0
        
        // Convertir a número y validar
        const num = Number(value)
        if (isNaN(num)) return 0
        
        // Limitar rango para prevenir overflow
        if (num > CONSTANTS.MAX_NUMBER) return CONSTANTS.MAX_NUMBER
        if (num < CONSTANTS.MIN_NUMBER) return CONSTANTS.MIN_NUMBER
        
        return num
    }, [])

    // Sanitizar precio (decimal con 2 dígitos)
    const sanitizePrice = useCallback((price) => {
        const num = sanitizeNumber(price)
        
        // Validar límites de precio
        if (num > CONSTANTS.MAX_PRICE) return CONSTANTS.MAX_PRICE
        if (num < CONSTANTS.MIN_PRICE) return CONSTANTS.MIN_PRICE
        
        return Number(num.toFixed(2))
    }, [sanitizeNumber])

    // Sanitizar stock (entero positivo)
    const sanitizeStock = useCallback((stock) => {
        const num = Math.floor(sanitizeNumber(stock))
        
        // Validar límites de stock
        if (num > CONSTANTS.MAX_STOCK) return CONSTANTS.MAX_STOCK
        if (num < CONSTANTS.MIN_STOCK) return CONSTANTS.MIN_STOCK
        
        return num
    }, [sanitizeNumber])

    // Sanitizar objeto completo
    const sanitizeObject = useCallback((obj, schema = {}) => {
        if (!obj || typeof obj !== 'object') return {}
        
        const sanitized = {}
        
        for (const [key, value] of Object.entries(obj)) {
            const type = schema[key] || 'text'
            
            switch (type) {
                case 'text':
                    sanitized[key] = sanitizeText(value)
                    break
                case 'email':
                    sanitized[key] = sanitizeEmail(value)
                    break
                case 'username':
                    sanitized[key] = sanitizeUsername(value)
                    break
                case 'url':
                    sanitized[key] = sanitizeUrl(value)
                    break
                case 'id':
                    sanitized[key] = sanitizeId(value)
                    break
                case 'number':
                    sanitized[key] = sanitizeNumber(value)
                    break
                case 'price':
                    sanitized[key] = sanitizePrice(value)
                    break
                case 'stock':
                    sanitized[key] = sanitizeStock(value)
                    break
                default:
                    sanitized[key] = value
            }
        }
        
        return sanitized
    }, [sanitizeText, sanitizeEmail, sanitizeUsername, sanitizeUrl, sanitizeId, sanitizeNumber, sanitizePrice, sanitizeStock])

    return {
        sanitizeHtml,
        sanitizeText,
        sanitizeEmail,
        sanitizeUsername,
        sanitizeUrl,
        sanitizeId,
        sanitizeNumber,
        sanitizePrice,
        sanitizeStock,
        sanitizeObject,
        CONSTANTS
    }
}

export default useSanitize