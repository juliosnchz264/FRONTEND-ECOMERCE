// frontend/src/services/orderServices.js
import api from './api'

const API_URL = '/orders'

// Crear una nueva orden e iniciar sesión de Stripe
export const createOrder = async (orderData) => {
    try {
        const response = await api.post(`${API_URL}/create`, orderData)
        return response.data
    } catch (error) {
        console.error('Error en createOrder:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Error al crear la orden')
    }
}

// Obtener detalles de una orden por Session ID de Stripe
export const getOrderBySession = async (sessionId) => {
    try {
        const response = await api.get(`${API_URL}/session/${sessionId}`)
        return response.data
    } catch (error) {
        console.error('Error en getOrderBySession:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Error al obtener los detalles de la sesión')
    }
}

export const getUserOrders = async () => {
    try {
        const response = await api.get(`${API_URL}/user/orders`)
        return response.data
    } catch (error) {
        console.error('Error en getUserOrders:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Error al obtener el historial de órdenes')
    }
}

// Para admins que necesiten ver órdenes de otros usuarios
export const getUserOrdersByAdmin = async (userId) => {
    try {
        const response = await api.get(`${API_URL}/user/${userId}`)
        return response.data
    } catch (error) {
        console.error('Error en getUserOrdersByAdmin:', error.response?.data || error.message)
        throw new Error(error.response?.data?.message || 'Error al obtener las órdenes del usuario')
    }
}