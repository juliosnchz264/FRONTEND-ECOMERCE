import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/orders'

axios.defaults.withCredentials = true

// Objeto de configuración reutilizable para mayor claridad
const config = { withCredentials: true };

// Crear una nueva orden e iniciar sesión de Stripe
export const createOrder = async (orderData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, orderData, config)
        return response.data
    } catch (error) {
        throw new Error('Error al crear la orden')
    }
}

// NUEVA: Obtener detalles de una orden por Session ID de Stripe
export const getOrderBySession = async (sessionId) => {
    try {
        const response = await axios.get(`${API_URL}/session/${sessionId}`, config)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener los detalles de la sesión')
    }
}

// NUEVA: Obtener todas las órdenes de un usuario
export const getUserOrders = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`, config)
        return response.data
    } catch (error) {
        throw new Error('Error al obtener el historial de órdenes')
    }
}
