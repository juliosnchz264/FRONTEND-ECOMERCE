import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/cart'

// Configuración base para axios
const axiosConfig = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
}

// Servicio para agregar producto al carrito
export const addToCartService = async (productId, quantity = 1) => {
    try {
        console.log('📤 Enviando a:', API_URL)
        console.log('📦 Datos:', { productId, quantity: Number(quantity) })

        const response = await axios.post(
            API_URL,
            {
                productId,
                quantity: Number(quantity),
            },
            axiosConfig
        )
        return response.data
    } catch (error) {
        console.error('🔴 Error:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message ||
                'Error al agregar producto al carrito'
        )
    }
}

// Servicio para obtener el carrito
export const getCartService = async () => {
    try {
        const response = await axios.get(API_URL, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getCartService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al obtener el carrito'
        )
    }
}

// Servicio para actualizar la cantidad de un producto
export const updateCartService = async (productId, quantity) => {
    try {
        const response = await axios.put(
            API_URL,
            {
                productId,
                quantity: Number(quantity),
            },
            axiosConfig
        )
        return response.data
    } catch (error) {
        console.error('Error en updateCartService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al actualizar el carrito'
        )
    }
}

// Servicio para eliminar un producto del carrito
export const removeFromCartService = async (productId) => {
    try {
        const response = await axios.delete(`${API_URL}/product`, {
            ...axiosConfig,
            data: { productId }
        })
        return response.data
    } catch (error) {
        console.error('Error en removeFromCartService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message ||
                'Error al eliminar producto del carrito'
        )
    }
}

// Servicio para limpiar todo el carrito
export const clearCartService = async () => {
    try {
        const response = await axios.delete(API_URL, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en clearCartService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al limpiar el carrito'
        )
    }
}

// Servicio para obtener el total del carrito
export const getCartTotalService = async () => {
    try {
        const response = await axios.get(`${API_URL}/total`, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getCartTotalService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message ||
                'Error al obtener el total del carrito'
        )
    }
}

// Servicio para fusionar carritos
export const mergeCartsService = async () => {
    try {
        const response = await axios.post(`${API_URL}/merge`, {}, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en mergeCartsService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al fusionar carritos'
        )
    }
}