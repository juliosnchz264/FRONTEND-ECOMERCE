// frontend/src/services/cartServices.js
import api from './api'; // 👈 IMPORTAR LA INSTANCIA CENTRALIZADA

const API_URL = '/cart'; // 👈 Ruta relativa (api ya tiene la base URL)

// 🟢 Helper para logging de respuestas
const logResponse = (method, url, response, isError = false) => {
    const icon = isError ? '❌' : '✅';
    console.log(`${icon} ${method} ${url}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Data:`, response.data);
    if (response.data.cart) {
        console.log(`   Productos en carrito: ${response.data.cart.products?.length || 0}`);
    }
    // Mostrar si es invitado o autenticado
    if (response.data.isGuest !== undefined) {
        console.log(`   👤 ${response.data.isGuest ? 'Invitado' : 'Autenticado'}`);
    }
};

// 🟢 Helper para logging de errores
const logError = (method, url, error) => {
    console.error(`🔴 Error en ${method} ${url}`);
    console.error(`   Mensaje:`, error.response?.data?.message || error.message);
    if (error.response?.data?.details) {
        console.error(`   Detalles:`, error.response.data.details);
    }
    if (error.response?.status === 401) {
        console.error('   🔐 Token no válido o expirado');
    }
};

// ============================================
// 🟢 SERVICIOS DEL CARRITO
// ============================================

/**
 * Agregar producto al carrito
 */
export const addToCartService = async (productId, quantity = 1) => {
    try {
        console.log('📤 Enviando a:', API_URL);
        console.log('📦 Datos:', { productId, quantity: Number(quantity) });

        const response = await api.post(API_URL, {
            productId,
            quantity: Number(quantity),
        });
        
        logResponse('POST', API_URL, response);
        return response.data;
    } catch (error) {
        logError('POST', API_URL, error);
        throw new Error(
            error.response?.data?.message ||
                'Error al agregar producto al carrito'
        );
    }
};

/**
 * Obtener el carrito actual
 */
export const getCartService = async () => {
    try {
        console.log('🔍 Verificando carrito en backend...');
        const response = await api.get(API_URL);
        
        logResponse('GET', API_URL, response);
        
        // Verificación adicional
        const productCount = response.data.cart?.products?.length || 0;
        console.log(`   📊 Total productos: ${productCount}`);
        
        if (productCount > 0) {
            console.log('   Productos:');
            response.data.cart.products.forEach((item, index) => {
                console.log(`     ${index + 1}. ${item.productId.name} x${item.quantity}`);
            });
        }
        
        return response.data;
    } catch (error) {
        logError('GET', API_URL, error);
        throw new Error(
            error.response?.data?.message || 'Error al obtener el carrito'
        );
    }
};

/**
 * Actualizar cantidad de un producto
 */
export const updateCartService = async (productId, quantity) => {
    try {
        console.log('📝 Actualizando cantidad:', { productId, quantity });
        const response = await api.put(API_URL, {
            productId,
            quantity: Number(quantity),
        });
        
        logResponse('PUT', API_URL, response);
        return response.data;
    } catch (error) {
        logError('PUT', API_URL, error);
        throw new Error(
            error.response?.data?.message || 'Error al actualizar el carrito'
        );
    }
};

/**
 * Eliminar un producto del carrito
 */
export const removeFromCartService = async (productId) => {
    try {
        console.log('🗑️ Eliminando producto:', productId);
        const response = await api.delete(`${API_URL}/product`, {
            data: { productId }
        });
        
        logResponse('DELETE', `${API_URL}/product`, response);
        return response.data;
    } catch (error) {
        logError('DELETE', `${API_URL}/product`, error);
        throw new Error(
            error.response?.data?.message ||
                'Error al eliminar producto del carrito'
        );
    }
};

/**
 * Vaciar todo el carrito
 */
export const clearCartService = async () => {
    try {
        console.log('🗑️ VACIANDO CARRITO COMPLETO');
        const response = await api.delete(API_URL);
        
        logResponse('DELETE', API_URL, response);
        
        // Verificar que realmente quedó vacío
        if (response.data.cart?.products?.length === 0) {
            console.log('   ✅ Carrito vaciado correctamente');
        } else {
            console.log('   ⚠️ El carrito aún tiene productos:', 
                response.data.cart?.products?.length);
        }
        
        return response.data;
    } catch (error) {
        logError('DELETE', API_URL, error);
        throw new Error(
            error.response?.data?.message || 'Error al limpiar el carrito'
        );
    }
};

/**
 * Obtener total del carrito
 */
export const getCartTotalService = async () => {
    try {
        const response = await api.get(`${API_URL}/total`);
        
        console.log('💰 Total del carrito:', response.data.total);
        return response.data;
    } catch (error) {
        logError('GET', `${API_URL}/total`, error);
        throw new Error(
            error.response?.data?.message ||
                'Error al obtener el total del carrito'
        );
    }
};

/**
 * Fusionar carritos (invitado -> usuario)
 */
export const mergeCartsService = async () => {
    try {
        console.log('🔄 Fusionando carritos...');
        const response = await api.post(`${API_URL}/merge`);
        
        logResponse('POST', `${API_URL}/merge`, response);
        return response.data;
    } catch (error) {
        logError('POST', `${API_URL}/merge`, error);
        throw new Error(
            error.response?.data?.message || 'Error al fusionar carritos'
        );
    }
};

// ============================================
// 🟢 UTILIDADES Y DIAGNÓSTICO
// ============================================

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

/**
 * Herramienta de diagnóstico del carrito
 */
export const diagnoseCart = async () => {
    console.log('\n========== 🏥 DIAGNÓSTICO DEL CARRITO ==========');
    
    try {
        // 1. Verificar autenticación desde localStorage
        const userInfo = localStorage.getItem('userInfo');
        console.log('👤 userInfo:', userInfo ? JSON.parse(userInfo) : '❌ No hay userInfo');
        
        // 2. Verificar cookies (solo las no HttpOnly)
        console.log('🍪 Cookies visibles:', document.cookie || '❌ No hay cookies visibles');
        
        // 3. Verificar estado de autenticación con backend
        console.log('\n🔍 Verificando autenticación con backend...');
        const authStatus = await checkAuthStatus();
        console.log(`   ${authStatus.authenticated ? '✅ Autenticado' : '❌ No autenticado'}`);
        if (authStatus.authenticated) {
            console.log(`   Usuario: ${authStatus.user?.email}`);
        }
        
        // 4. Verificar localStorage del carrito
        const localCart = localStorage.getItem('cart');
        console.log('\n📦 localStorage cart:', localCart ? JSON.parse(localCart) : 'vacío');
        
        // 5. Consultar backend del carrito
        console.log('\n🌐 Consultando carrito en backend...');
        const response = await api.get(API_URL);
        
        console.log(`✅ Backend respondió:`);
        console.log(`   Status: ${response.status}`);
        console.log(`   👤 ${response.data.isGuest ? 'Invitado' : 'Autenticado'}`);
        console.log(`   Productos: ${response.data.cart?.products?.length || 0}`);
        
        if (response.data.cart?.products?.length > 0) {
            console.log('   Detalle:');
            response.data.cart.products.forEach((item, i) => {
                console.log(`     ${i+1}. ${item.productId.name} - ${item.quantity} unidades`);
            });
        }
        
        // 6. Comparar con localStorage
        if (localCart) {
            const localProducts = JSON.parse(localCart);
            const backendProducts = response.data.cart?.products || [];
            
            console.log('\n🔍 Comparación:');
            console.log(`   LocalStorage: ${localProducts.length} productos`);
            console.log(`   Backend: ${backendProducts.length} productos`);
            
            if (localProducts.length !== backendProducts.length) {
                console.log('   ⚠️ ¡INCONSISTENCIA DETECTADA!');
            } else {
                console.log('   ✅ Sincronizado correctamente');
            }
        }
        
        // 7. Recomendaciones
        console.log('\n📋 RECOMENDACIONES:');
        if (!authStatus.authenticated && userInfo) {
            console.log('   ⚠️ Inconsistencia: Hay userInfo pero no estás autenticado en backend');
            console.log('   ➡️ Solución: Haz logout y login nuevamente');
        }
        if (response.data.isGuest && userInfo) {
            console.log('   ⚠️ Estás como invitado pero hay userInfo en localStorage');
            console.log('   ➡️ Solución: La cookie de sesión se perdió, haz login nuevamente');
        }
        if (authStatus.authenticated && response.data.isGuest) {
            console.log('   ⚠️ El backend dice que estás autenticado pero el carrito dice invitado');
            console.log('   ➡️ Solución: Las rutas del carrito no están usando verifyToken');
        }
        
    } catch (error) {
        console.error('❌ Error en diagnóstico:', error.message);
        if (error.response?.status === 401) {
            console.log('   ⚠️ No autorizado - token inválido o expirado');
        }
    }
    
    console.log('===============================================\n');
};

// Exportamos todo
export {
    API_URL
};