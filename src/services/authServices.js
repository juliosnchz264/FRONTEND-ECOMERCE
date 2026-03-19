// frontend/src/services/authServices.js
import api from './api'

// 🟢 Evento personalizado para cambios en el token
const TOKEN_EVENT = 'token-changed'

// 🟢 Variable para almacenar el access token en memoria (NUNCA en localStorage)
let accessToken = null

// 🟢 Flag para evitar múltiples refrescos simultáneos
let isRefreshing = false
let refreshSubscribers = []

// 🟢 Función para notificar a las peticiones en espera
const onRefreshed = (newToken) => {
    refreshSubscribers.forEach((callback) => callback(newToken))
    refreshSubscribers = []
}

// 🟢 Función para agregar peticiones a la cola de espera
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback)
}

// 🟢 Helper para logging de respuestas (SOLO en desarrollo y no para check-session)
const logResponse = (method, url, response, isError = false) => {
    // NO loguear check-session
    if (url.includes('check-session')) return

    const icon = isError ? '❌' : '✅'
    console.log(`${icon} ${method} ${url}`)
    console.log(`   Status: ${response.status}`)
    console.log(`   Data:`, response.data)
}

// 🟢 Helper para logging de errores (SILENCIAR 401 de check-session)
const logError = (method, url, error) => {
    // NO loguear errores 401 de check-session
    if (url.includes('check-session') && error.response?.status === 401) return

    console.error(`🔴 Error en ${method} ${url}`)
    console.error(`   Mensaje:`, error.response?.data?.message || error.message)
    if (error.response?.data?.details) {
        console.error(`   Detalles:`, error.response.data.details)
    }
}

// ============================================
// 🟢 FUNCIONES PARA GESTIÓN DE TOKEN Y EVENTOS
// ============================================

/**
 * Disparar evento de cambio de token
 */
const dispatchTokenEvent = (token) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent(TOKEN_EVENT, {
                detail: { token, timestamp: Date.now() },
            }),
        )
    }
}

/**
 * Establecer token manualmente y notificar cambios
 */
export const setAccessToken = (token) => {
    const oldToken = accessToken

    // Si el token es el mismo, no notificar
    if (oldToken === token) {
        return // 👈 Eliminado console.log
    }

    accessToken = token
    dispatchTokenEvent(token)
}

/**
 * Obtener access token actual (para WebSocket)
 */
export const getAccessToken = () => {
    return accessToken
}

/**
 * Limpiar token (útil para logout)
 */
export const clearAccessToken = () => {
    if (accessToken) {
        accessToken = null
        dispatchTokenEvent(null)
    }
}

// ============================================
// 🟢 SERVICIOS DE AUTENTICACIÓN
// ============================================

/**
 * Servicio de Login
 */
export const loginService = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password })

        if (response.status >= 200 && response.status < 300) {
            if (response.data.accessToken) {
                setAccessToken(response.data.accessToken)
            }

            localStorage.setItem('userInfo', JSON.stringify(response.data))
            localStorage.setItem('wasAuthenticated', 'true')

            return {
                success: true,
                user: response.data,
                accessToken: response.data.accessToken,
                message: 'Inicio de sesión exitoso',
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al iniciar sesión',
        }
    }
}

/**
 * Servicio de Registro
 */
export const registerService = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData)

        if (response.status === 201) {
            return {
                success: true,
                message: 'Registro exitoso. Por favor verifica tu email.',
                data: response.data,
                requiresVerification:
                    response.data.requiresVerification || false,
            }
        }

        return {
            success: false,
            message: 'Error en el registro',
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al registrarse',
        }
    }
}

/**
 * Servicio para obtener perfil del usuario
 */
export const getProfileService = async () => {
    try {
        const response = await api.get('/auth/profile')

        return {
            success: true,
            data: response.data,
            status: response.status,
        }
    } catch (error) {
        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'No autorizado',
                status: 401,
            }
        }

        if (!error.response) {
            return {
                success: false,
                error: 'Error de red',
                status: 0,
            }
        }

        return {
            success: false,
            error: error.response?.data?.message || 'Error desconocido',
            status: error.response?.status || 500,
        }
    }
}

/**
 * Servicio para verificar sesión actual - VERSIÓN SILENCIOSA
 */
export const checkSessionService = async () => {
    // No verificar sesión si estamos en la página de login
    if (window.location.pathname === '/login') {
        return {
            success: false,
            authenticated: false,
            status: 0,
        }
    }

    try {
        // 🚨 USAR VALIDATE STATUS para evitar errores en consola
        const response = await api.get('/auth/check-session', {
            validateStatus: function (status) {
                return status < 500 // 401 es "válido" para nosotros
            },
        })

        // Si llegamos aquí, la sesión es válida (status 200)
        return {
            success: true,
            authenticated: true,
            user: response.data.user,
            accessToken: response.data.accessToken,
            status: response.status,
        }
    } catch (error) {
        // 🚨 SILENCIOSAMENTE devolver no autenticado
        return {
            success: false,
            authenticated: false,
            status: 401,
        }
    }
}

/**
 * Servicio de Logout
 */
export const logoutService = async () => {
    try {
        const response = await api.post('/auth/logout')

        // Limpiar token en memoria (esto dispara el evento automáticamente)
        clearAccessToken()

        // Limpiar localStorage
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wasAuthenticated')

        return response.data
    } catch (error) {
        // 🔥 SI ES 401 → LO TRATAMOS COMO LOGOUT EXITOSO
        if (error.response?.status === 401) {
            clearAccessToken()
            localStorage.removeItem('userInfo')
            localStorage.removeItem('wasAuthenticated')

            return { success: true } // 👈 AQUÍ VA
        }

        // Otros errores reales
        clearAccessToken()
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wasAuthenticated')

        throw new Error(
            error.response?.data?.message || 'Error al cerrar la sesión',
        )
    }
}

/**
 * Servicio para refrescar token manualmente
 */
export const refreshTokenService = async () => {
    try {
        const response = await api.post('/auth/refresh')

        if (response.data.accessToken) {
            setAccessToken(response.data.accessToken)
        }

        return {
            success: true,
            accessToken: response.data.accessToken,
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Error al refrescar token',
        }
    }
}

// ============================================
// 🟢 FUNCIONES DE UTILIDAD
// ============================================

/**
 * Forzar logout y limpiar todo
 */
export const forceLogout = () => {
    clearAccessToken()
    localStorage.removeItem('userInfo')
    localStorage.removeItem('wasAuthenticated')
    window.location.href = '/login'
}

/**
 * Verificar estado de autenticación actual
 */
export const checkAuthStatus = async () => {
    try {
        const response = await api.get('/auth/check-session')
        return {
            authenticated: true,
            user: response.data.user,
        }
    } catch (error) {
        return {
            authenticated: false,
            error:
                error.response?.status === 401
                    ? 'No autenticado'
                    : 'Error de conexión',
        }
    }
}

// ============================================
// 🟢 HERRAMIENTA DE DIAGNÓSTICO
// ============================================

/**
 * Diagnosticar estado de autenticación
 */
export const diagnoseAuth = async () => {
    console.log('\n========== 🏥 DIAGNÓSTICO DE AUTENTICACIÓN ==========')

    // 1. Verificar localStorage
    console.log('📦 localStorage:')
    const userInfo = localStorage.getItem('userInfo')
    console.log(`   userInfo: ${userInfo ? '✅' : '❌'}`)
    if (userInfo) {
        console.log(`   Contenido:`, JSON.parse(userInfo))
    }
    console.log(
        `   wasAuthenticated: ${localStorage.getItem('wasAuthenticated')}`,
    )

    // 2. Verificar token en memoria
    console.log(
        `\n🔐 Access Token en memoria: ${accessToken ? '✅ Presente' : '❌ No hay token'}`,
    )
    if (accessToken) {
        console.log(`   Longitud: ${accessToken.length} caracteres`)
        console.log(`   Preview: ${accessToken.substring(0, 20)}...`)
    }

    // 3. Verificar cookies (solo las no HttpOnly)
    console.log('\n🍪 Cookies visibles:', document.cookie || 'vacío')

    // 4. Verificar flags
    console.log('\n🚩 Flags:')
    console.log(`   isRefreshing: ${isRefreshing}`)
    console.log(`   refreshSubscribers: ${refreshSubscribers.length}`)

    // 5. Verificar sesión en backend
    console.log('\n🌐 Verificando sesión en backend...')
    try {
        const sessionResult = await checkSessionService()
        console.log(
            `   Resultado: ${sessionResult.authenticated ? '✅ Activa' : '❌ Inactiva'}`,
        )
        if (sessionResult.authenticated) {
            console.log(`   Usuario: ${sessionResult.user?.email}`)
        } else {
            console.log(`   Status: ${sessionResult.status}`)
        }
    } catch (error) {
        console.log('   ❌ Error verificando sesión:', error.message)
    }

    console.log('\n📋 RECOMENDACIONES:')
    if (userInfo && !accessToken) {
        console.log(
            '   ⚠️ Hay userInfo pero no token en memoria - posible inconsistencia',
        )
        console.log('   ➡️ Ejecuta: forceLogout() y luego login nuevamente')
    }
    if (!userInfo && accessToken) {
        console.log('   ⚠️ Hay token pero no userInfo - posible inconsistencia')
        console.log('   ➡️ Ejecuta: clearAccessToken()')
    }
    if (window.location.pathname === '/login' && accessToken) {
        console.log('   ⚠️ Estás en login pero hay token - redirigiendo...')
        console.log('   ➡️ Navega a / para usar el token existente')
    }

    console.log('==================================================\n')
}

// ============================================
// 🟢 EXPORTACIONES
// ============================================

export {
    TOKEN_EVENT,
    accessToken, // Exportamos para debugging (solo lectura)
    isRefreshing,
    refreshSubscribers,
}
