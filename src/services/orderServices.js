// frontend/src/services/orderServices.js
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
        console.error('❌ Error en createOrder:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al crear la orden');
    }
}

// Obtener detalles de una orden por Session ID de Stripe
export const getOrderBySession = async (sessionId) => {
    try {
        const response = await axios.get(`${API_URL}/session/${sessionId}`, config)
        return response.data
    } catch (error) {
        console.error('❌ Error en getOrderBySession:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener los detalles de la sesión');
    }
}

// 🔴 MODIFICADO: Ya no necesita userId como parámetro
export const getUserOrders = async () => {
    try {
        console.log('🔍 Solicitando órdenes del usuario autenticado...');
        console.log('   URL:', `${API_URL}/user/orders`);
        
        const response = await axios.get(`${API_URL}/user/orders`, config)
        
        console.log('✅ Respuesta recibida:', response.data);
        return response.data
    } catch (error) {
        console.error('❌ Error en getUserOrders:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el historial de órdenes');
    }
}

// Opcional: Para admins que necesiten ver órdenes de otros usuarios
export const getUserOrdersByAdmin = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`, config)
        return response.data
    } catch (error) {
        console.error('❌ Error en getUserOrdersByAdmin:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener las órdenes del usuario');
    }
}