import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/users'

// Configuración base para axios
const axiosConfig = {
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
}

// ============================================
// SERVICIOS PARA EL PROPIO USUARIO
// ============================================

/**
 * Obtener perfil del usuario autenticado
 * @returns {Promise<Object>} Datos del usuario
 */
export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getProfileService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al obtener perfil'
        )
    }
}

/**
 * Actualiza el perfil del usuario (incluyendo imagen de avatar)
 * @param {Object} data - Datos de texto (username, password, etc.)
 * @param {File} file - Archivo de imagen seleccionado
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateProfileService = async (data, file) => {
    try {
        const formData = new FormData()
        
        if (data.username) formData.append('username', data.username)
        if (data.password) formData.append('password', data.password)
        if (file) formData.append('avatar', file)

        const response = await axios.put(`${API_URL}/profile`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })

        return response.data
    } catch (error) {
        console.error('Error en updateProfileService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al actualizar perfil'
        )
    }
}

// ============================================
// SERVICIOS DE ADMINISTRACIÓN (solo admin)
// ============================================

/**
 * Obtener todos los usuarios con paginación y filtros
 * @param {Object} params - { page, limit, search, role }
 * @returns {Promise<Object>} Lista paginada de usuarios
 */
export const getAllUsersService = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams()
        
        if (params.page) queryParams.append('page', params.page)
        if (params.limit) queryParams.append('limit', params.limit)
        if (params.search) queryParams.append('search', params.search)
        if (params.role) queryParams.append('role', params.role)
        
        const url = queryParams.toString() 
            ? `${API_URL}?${queryParams.toString()}`
            : API_URL
        
        const response = await axios.get(url, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getAllUsersService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al obtener usuarios'
        )
    }
}

/**
 * Obtener usuario por ID
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserByIdService = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}`, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getUserByIdService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al obtener usuario'
        )
    }
}

/**
 * Obtener usuario por nombre de usuario
 * @param {string} username - Nombre de usuario
 * @returns {Promise<Object>} Datos del usuario
 */
export const getUserByUsernameService = async (username) => {
    try {
        const response = await axios.get(`${API_URL}/username/${username}`, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getUserByUsernameService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al obtener usuario'
        )
    }
}

/**
 * Actualizar rol de usuario (dar/quitar admin)
 * @param {string} userId - ID del usuario
 * @param {boolean} isAdmin - Nuevo estado de admin
 * @returns {Promise<Object>} Usuario actualizado
 */
export const updateUserRoleService = async (userId, isAdmin) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${userId}/role`, 
            { isAdmin }, 
            axiosConfig
        )
        return response.data
    } catch (error) {
        console.error('Error en updateUserRoleService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al actualizar rol de usuario'
        )
    }
}

/**
 * Eliminar usuario (solo admin)
 * @param {string} userId - ID del usuario a eliminar
 * @returns {Promise<Object>} Confirmación de eliminación
 */
export const deleteUserService = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/${userId}`, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en deleteUserService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al eliminar usuario'
        )
    }
}

/**
 * Obtener estadísticas de usuarios (solo admin)
 * @returns {Promise<Object>} Estadísticas: total, admins, registros recientes
 */
export const getUserStatsService = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats`, axiosConfig)
        return response.data
    } catch (error) {
        console.error('Error en getUserStatsService:', error.response?.data || error.message)
        throw new Error(
            error.response?.data?.message || 'Error al obtener estadísticas'
        )
    }
}