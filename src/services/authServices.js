import axios from 'axios'

// Configuración base de axios para autenticación
const API_URL = import.meta.env.VITE_BACKEND_URL + '/auth'

const axiosConfig = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
}

// frontend/src/services/authServices.js
export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`, axiosConfig)        
        // 🚨 Asegurar que devuelve la estructura correcta
        return {
            success: true,
            data: response.data
        }
    } catch (error) {
        console.error('❌ Error obteniendo perfil:', {
            status: error.response?.status,
            message: error.message,
            data: error.response?.data
        });
        
        if (error.response?.status === 401) {
            return {
                success: false,
                error: 'No autorizado'
            }
        }
        
        throw error;
    }
}

export const loginService = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data)

        if (response.status >= 200 && response.status < 300) {
            // Guardamos el objeto usuario completo (incluyendo el avatar)
            localStorage.setItem('userInfo', JSON.stringify(response.data))
            localStorage.setItem('wasAuthenticated', 'true')

            return {
                success: true,
                user: response.data,
                message: 'Inicio de sesión exitoso',
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error al loguearse',
        }
    }
}

// Versión simplificada (solo responsabilidad del servicio)
export const registerService = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData, axiosConfig)
        
        if (response.status === 201) {
            return {
                success: true,
                message: 'Registro exitoso. Por favor verifica tu email.',
                data: response.data,
                requiresVerification: response.data.requiresVerification || false
            }
        }
        
        return { 
            success: false, 
            message: 'Error en el registro' 
        }
        
    } catch (error) {
        console.error('Error en registro:', error)
        return { 
            success: false, 
            message: error.response?.data?.message || 'Error al registrarse' 
        }
    }
}

export const logoutService = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`)
        
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wasAuthenticated')
        
        return response.data
    } catch (error) {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wasAuthenticated')
        throw new Error(error.response?.data?.message || 'Error al cerrar la sesión')
    }
}