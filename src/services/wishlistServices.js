// src/services/wishlistServices.js
import api from './api'

const API_URL = '/wishlist'

const wishlistServices = {
    getWishlist: async () => {
        try {
            const response = await api.get(API_URL)
            const wishlistData = Array.isArray(response.data) ? response.data : (response.data.wishlist || [])
            
            return {
                success: true,
                wishlist: wishlistData,
                totalItems: wishlistData.length,
            }
        } catch (error) {
            console.error('Error en getWishlist:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener wishlist',
                wishlist: [],
                totalItems: 0,
            }
        }
    },

    addToWishlist: async (productId) => {
        try {
            const response = await api.post(API_URL, { productId })
            const wishlistData = Array.isArray(response.data) ? response.data : (response.data.wishlist || [])
            return {
                success: true,
                message: response.data.message || 'Producto agregado a favoritos',
                wishlist: wishlistData,
            }
        } catch (error) {
            console.error('Error en addToWishlist:', error)
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Error al agregar a favoritos'
            return {
                success: false,
                message: errorMessage,
            }
        }
    },

    removeFromWishlist: async (productId) => {
        try {
            const response = await api.delete(`${API_URL}/${productId}`)
            const wishlistData = Array.isArray(response.data) ? response.data : (response.data.wishlist || [])
            return {
                success: true,
                message: response.data.message || 'Producto eliminado de favoritos',
                wishlist: wishlistData,
            }
        } catch (error) {
            console.error('Error en removeFromWishlist:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al eliminar de favoritos',
            }
        }
    },

    isInWishlist: async (productId) => {
        try {
            const response = await api.get(`${API_URL}/check/${productId}`)
            return {
                success: true,
                isInWishlist: response.data.isInWishlist || false,
            }
        } catch (error) {
            console.error('Error en isInWishlist:', error)
            return {
                success: false,
                isInWishlist: false,
            }
        }
    },

    clearWishlist: async () => {
        try {
            const response = await api.delete(API_URL)
            return {
                success: true,
                message: response.data.message || 'Wishlist limpiada',
            }
        } catch (error) {
            console.error('Error en clearWishlist:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al limpiar wishlist',
            }
        }
    },
}

export default wishlistServices