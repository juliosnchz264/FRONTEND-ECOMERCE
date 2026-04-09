// frontend/src/services/cartServices.js
import api from './api';

const API_URL = '/cart';

// ============================================
// 🟢 SERVICIOS DEL CARRITO
// ============================================

/**
 * Agregar producto al carrito
 */
export const addToCartService = async (productId, quantity = 1) => {
    try {
        const response = await api.post(API_URL, {
            productId,
            quantity: Number(quantity),
        });
        return response.data;
    } catch (error) {
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
        const response = await api.get(API_URL);
        return response.data;
    } catch (error) {
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
        const response = await api.put(API_URL, {
            productId,
            quantity: Number(quantity),
        });
        return response.data;
    } catch (error) {
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
        const response = await api.delete(`${API_URL}/product`, {
            data: { productId }
        });
        return response.data;
    } catch (error) {
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
        const response = await api.delete(API_URL);
        return response.data;
    } catch (error) {
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
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
                'Error al obtener el total del carrito'
        );
    }
};

/**
 * Fusionar carritos (invitado -> usuario)
 */
export const mergeCartsService = async (localProducts) => {
    try {
        const response = await api.post('/cart/merge', { products: localProducts });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Exportamos
export {
    API_URL
};