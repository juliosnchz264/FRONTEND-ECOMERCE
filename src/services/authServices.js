import axios from 'axios'

// Configuración base de axios para autenticación
const API_URL = import.meta.env.VITE_BACKEND_URL + '/auth'

// Para incluir la cookies en las peticiones globalmente
axios.defaults.withCredentials = true

export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`)
        return response.data
    } catch (error) {
        return null 
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

export const registerService = async (data, reset, setRedirect, checkSession) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data)

        if (response.status === 201) {
            // Persistencia inmediata tras registro
            localStorage.setItem('userInfo', JSON.stringify(response.data))
            localStorage.setItem('wasAuthenticated', 'true')

            await checkSession()
            reset()
            setRedirect(true)

            return { success: true, data: response.data }
        }
    } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Error al registrarse' }
    }
}

export const logoutService = async () => {
    try {
        // 🚩 CORRECCIÓN: Añadido await
        const response = await axios.post(`${API_URL}/logout`)
        
        // 🚩 CORRECCIÓN: Limpieza del storage para evitar fugas de datos
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wasAuthenticated')
        
        return response.data
    } catch (error) {
        // Limpiamos de todos modos por seguridad si falla la red
        localStorage.removeItem('userInfo')
        localStorage.removeItem('wasAuthenticated')
        throw new Error(error.response?.data?.message || 'Error al cerrar la sesión')
    }
}