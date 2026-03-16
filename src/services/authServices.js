// frontend/src/services/authServices.js
import api from './api';

// 🟢 Evento personalizado para cambios en el token
const TOKEN_EVENT = 'token-changed';

// 🟢 Variable para almacenar el access token en memoria (NUNCA en localStorage)
let accessToken = null;

// 🟢 Flag para evitar múltiples refrescos simultáneos
let isRefreshing = false;
let refreshSubscribers = [];

// 🟢 Función para notificar a las peticiones en espera
const onRefreshed = (newToken) => {
    refreshSubscribers.forEach(callback => callback(newToken));
    refreshSubscribers = [];
};

// 🟢 Función para agregar peticiones a la cola de espera
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// 🟢 Helper para logging de respuestas
const logResponse = (method, url, response, isError = false) => {
    const icon = isError ? '❌' : '✅';
    console.log(`${icon} ${method} ${url}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, response.data);
};

// 🟢 Helper para logging de errores
const logError = (method, url, error) => {
    console.error(`🔴 Error en ${method} ${url}`);
    console.error(`   Mensaje:`, error.response?.data?.message || error.message);
    if (error.response?.data?.details) {
        console.error(`   Detalles:`, error.response.data.details);
    }
};

// ============================================
// 🟢 FUNCIONES PARA GESTIÓN DE TOKEN Y EVENTOS
// ============================================

/**
 * Disparar evento de cambio de token
 */
const dispatchTokenEvent = (token) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(TOKEN_EVENT, { 
            detail: { token, timestamp: Date.now() } 
        }));
    }
};

/**
 * Establecer token manualmente y notificar cambios
 */
export const setAccessToken = (token) => {
    const oldToken = accessToken;
    
    // Si el token es el mismo, no notificar
    if (oldToken === token) {
        console.log('⏭️ Mismo token, no se notifica');
        return;
    }
    
    accessToken = token;
    console.log('🔄 Token actualizado, notificando a los listeners');
    dispatchTokenEvent(token);
};

/**
 * Obtener access token actual (para WebSocket)
 */
export const getAccessToken = () => {
    return accessToken;
};

/**
 * Limpiar token (útil para logout)
 */
export const clearAccessToken = () => {
    if (accessToken) {
        accessToken = null;
        dispatchTokenEvent(null);
    }
};

// ============================================
// 🟢 SERVICIOS DE AUTENTICACIÓN
// ============================================

/**
 * Servicio de Login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 */
// En authServices.js, loginService
export const loginService = async (email, password) => {
    try {
        console.log('🔐 Intentando login...');
        const response = await api.post('/auth/login', { email, password });

        if (response.status >= 200 && response.status < 300) {
            console.log('✅ Login exitoso para:', response.data.email);
            
            // 🟢 ESTO ES CRÍTICO - ¿ESTÁ PRESENTE?
            if (response.data.accessToken) {
                setAccessToken(response.data.accessToken);
                console.log('🔑 Token guardado en memoria:', !!response.data.accessToken);
            } else {
                console.log('⚠️ No se recibió accessToken en la respuesta');
            }
            
            localStorage.setItem('userInfo', JSON.stringify(response.data));
            localStorage.setItem('wasAuthenticated', 'true');

            return {
                success: true,
                user: response.data,
                accessToken: response.data.accessToken,
                message: 'Inicio de sesión exitoso',
            };
        }
    } catch (error) {
        // ...
    }
};
/**
 * Servicio de Registro
 * @param {Object} userData - Datos del usuario a registrar
 */
export const registerService = async (userData) => {
    try {
        console.log('📝 Registrando usuario...');
        const response = await api.post('/auth/register', userData);
        
        if (response.status === 201) {
            console.log('✅ Registro exitoso para:', userData.email);
            return {
                success: true,
                message: 'Registro exitoso. Por favor verifica tu email.',
                data: response.data,
                requiresVerification: response.data.requiresVerification || false
            };
        }
        
        return { 
            success: false, 
            message: 'Error en el registro' 
        };
        
    } catch (error) {
        console.error('❌ Error en registro:', error.response?.data || error.message);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al registrarse' 
        };
    }
};

/**
 * Servicio para obtener perfil del usuario
 */
export const getProfileService = async () => {
    try {
        console.log('🔍 Solicitando perfil al backend...');
        const response = await api.get('/auth/profile');
        
        console.log('✅ Perfil obtenido:', response.data);
        
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        console.error('❌ Error obteniendo perfil:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'No autorizado',
                status: 401
            };
        }
        
        if (!error.response) {
            return {
                success: false,
                error: 'Error de red',
                status: 0
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error desconocido',
            status: error.response?.status || 500
        };
    }
};

/**
 * Servicio para verificar sesión actual
 */
export const checkSessionService = async () => {
    // No verificar sesión si estamos en la página de login
    if (window.location.pathname === '/login') {
        console.log('⏭️ En página de login, omitiendo verificación de sesión');
        return {
            success: false,
            authenticated: false,
            status: 0
        };
    }

    try {
        console.log('🔍 Verificando sesión...');
        const response = await api.get('/auth/check-session');
        
        console.log('✅ Sesión válida para:', response.data.user?.email);
        
        return {
            success: true,
            authenticated: true,
            user: response.data.user,
            accessToken: response.data.accessToken,
            status: response.status
        };
    } catch (error) {
        console.log('🚫 Sesión no válida:', error.response?.status);
        
        if (error.response?.status === 401) {
            clearAccessToken();
            return {
                success: false,
                authenticated: false,
                status: 401
            };
        }
        
        return {
            success: false,
            authenticated: false,
            status: error.response?.status || 0
        };
    }
};

/**
 * Servicio de Logout
 */
export const logoutService = async () => {
    try {
        console.log('🚪 Cerrando sesión...');
        const response = await api.post('/auth/logout');
        
        // Limpiar token en memoria (esto dispara el evento automáticamente)
        clearAccessToken();
        
        // Limpiar localStorage
        localStorage.removeItem('userInfo');
        localStorage.removeItem('wasAuthenticated');
        
        console.log('✅ Sesión cerrada');
        return response.data;
    } catch (error) {
        console.error('❌ Error en logout:', error.response?.data || error.message);
        
        // Aún así, limpiar todo localmente
        clearAccessToken();
        localStorage.removeItem('userInfo');
        localStorage.removeItem('wasAuthenticated');
        
        throw new Error(error.response?.data?.message || 'Error al cerrar la sesión');
    }
};

/**
 * Servicio para refrescar token manualmente
 */
export const refreshTokenService = async () => {
    try {
        console.log('🔄 Refrescando token manualmente...');
        const response = await api.post('/auth/refresh');
        
        if (response.data.accessToken) {
            setAccessToken(response.data.accessToken);
        }
        
        console.log('✅ Token refrescado manualmente');
        return {
            success: true,
            accessToken: response.data.accessToken
        };
    } catch (error) {
        console.error('❌ Error refrescando token:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Error al refrescar token'
        };
    }
};

// ============================================
// 🟢 FUNCIONES DE UTILIDAD
// ============================================

/**
 * Forzar logout y limpiar todo
 */
export const forceLogout = () => {
    console.log('🚨 Forzando logout...');
    clearAccessToken();
    localStorage.removeItem('userInfo');
    localStorage.removeItem('wasAuthenticated');
    window.location.href = '/login';
};

/**
 * Verificar estado de autenticación actual
 */
export const checkAuthStatus = async () => {
    try {
        const response = await api.get('/auth/check-session');
        return {
            authenticated: true,
            user: response.data.user
        };
    } catch (error) {
        return {
            authenticated: false,
            error: error.response?.status === 401 ? 'No autenticado' : 'Error de conexión'
        };
    }
};

// ============================================
// 🟢 HERRAMIENTA DE DIAGNÓSTICO
// ============================================

/**
 * Diagnosticar estado de autenticación
 */
export const diagnoseAuth = async () => {
    console.log('\n========== 🏥 DIAGNÓSTICO DE AUTENTICACIÓN ==========');
    
    // 1. Verificar localStorage
    console.log('📦 localStorage:');
    const userInfo = localStorage.getItem('userInfo');
    console.log(`   userInfo: ${userInfo ? '✅' : '❌'}`);
    if (userInfo) {
        console.log(`   Contenido:`, JSON.parse(userInfo));
    }
    console.log(`   wasAuthenticated: ${localStorage.getItem('wasAuthenticated')}`);
    
    // 2. Verificar token en memoria
    console.log(`\n🔐 Access Token en memoria: ${accessToken ? '✅ Presente' : '❌ No hay token'}`);
    if (accessToken) {
        console.log(`   Longitud: ${accessToken.length} caracteres`);
        console.log(`   Preview: ${accessToken.substring(0, 20)}...`);
    }
    
    // 3. Verificar cookies (solo las no HttpOnly)
    console.log('\n🍪 Cookies visibles:', document.cookie || 'vacío');
    
    // 4. Verificar flags
    console.log('\n🚩 Flags:');
    console.log(`   isRefreshing: ${isRefreshing}`);
    console.log(`   refreshSubscribers: ${refreshSubscribers.length}`);
    
    // 5. Verificar sesión en backend
    console.log('\n🌐 Verificando sesión en backend...');
    try {
        const sessionResult = await checkSessionService();
        console.log(`   Resultado: ${sessionResult.authenticated ? '✅ Activa' : '❌ Inactiva'}`);
        if (sessionResult.authenticated) {
            console.log(`   Usuario: ${sessionResult.user?.email}`);
        } else {
            console.log(`   Status: ${sessionResult.status}`);
        }
    } catch (error) {
        console.log('   ❌ Error verificando sesión:', error.message);
    }
    
    console.log('\n📋 RECOMENDACIONES:');
    if (userInfo && !accessToken) {
        console.log('   ⚠️ Hay userInfo pero no token en memoria - posible inconsistencia');
        console.log('   ➡️ Ejecuta: forceLogout() y luego login nuevamente');
    }
    if (!userInfo && accessToken) {
        console.log('   ⚠️ Hay token pero no userInfo - posible inconsistencia');
        console.log('   ➡️ Ejecuta: clearAccessToken()');
    }
    if (window.location.pathname === '/login' && accessToken) {
        console.log('   ⚠️ Estás en login pero hay token - redirigiendo...');
        console.log('   ➡️ Navega a / para usar el token existente');
    }
    
    console.log('==================================================\n');
};

// ============================================
// 🟢 EXPORTACIONES
// ============================================

export {
    TOKEN_EVENT,
    accessToken, // Exportamos para debugging (solo lectura)
    isRefreshing,
    refreshSubscribers
};