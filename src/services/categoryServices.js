// src/services/categoryServices.js
import api from './api'

const API_URL = '/categories'

/**
 * Servicio para la gestión de categorías
 */
const categoryServices = {
    /**
     * Obtener todas las categorías
     * @returns {Promise<Object>} - Lista de categorías
     */
    getCategories: async () => {
        try {
            const response = await api.get(API_URL)
            return {
                success: true,
                categories: response.data,
            }
        } catch (error) {
            console.error('Error en getCategories:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener categorías',
                categories: [],
            }
        }
    },

    /**
     * Obtener una categoría por ID
     * @param {string} id - ID de la categoría
     * @returns {Promise<Object>} - Categoría
     */
    getCategoryById: async (id) => {
        try {
            const response = await api.get(`${API_URL}/${id}`)
            return {
                success: true,
                category: response.data,
            }
        } catch (error) {
            console.error('Error en getCategoryById:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Categoría no encontrada',
                category: null,
            }
        }
    },

    /**
     * Crear una nueva categoría (solo admin)
     * @param {Object} categoryData - Datos de la categoría
     * @returns {Promise<Object>} - Resultado de la operación
     */
    createCategory: async (categoryData) => {
        try {
            const response = await api.post(API_URL, categoryData)
            return {
                success: true,
                message: response.data.message || 'Categoría creada exitosamente',
                category: response.data.category || response.data,
            }
        } catch (error) {
            console.error('Error en createCategory:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear categoría',
            }
        }
    },

    /**
     * Actualizar una categoría (solo admin)
     * @param {string} id - ID de la categoría
     * @param {Object} categoryData - Datos actualizados
     * @returns {Promise<Object>} - Resultado de la operación
     */
    updateCategory: async (id, categoryData) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, categoryData)
            return {
                success: true,
                message: response.data.message || 'Categoría actualizada',
                category: response.data.category || response.data,
            }
        } catch (error) {
            console.error('Error en updateCategory:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar categoría',
            }
        }
    },

    /**
     * Eliminar una categoría (solo admin)
     * @param {string} id - ID de la categoría
     * @returns {Promise<Object>} - Resultado de la operación
     */
    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`)
            return {
                success: true,
                message: response.data.message || 'Categoría eliminada',
            }
        } catch (error) {
            console.error('Error en deleteCategory:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al eliminar categoría',
            }
        }
    },
}

export default categoryServices