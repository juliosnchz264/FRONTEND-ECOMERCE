// src/services/subcategoryServices.js
import api from './api'

const API_URL = '/subcategories'

/**
 * Servicio para la gestión de subcategorías
 */
const subcategoryServices = {
    /**
     * Obtener todas las subcategorías
     * @returns {Promise<Object>} - Lista de subcategorías
     */
    getSubcategories: async () => {
        try {
            const response = await api.get(API_URL)
            return {
                success: true,
                subcategories: response.data,
            }
        } catch (error) {
            console.error('Error en getSubcategories:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener subcategorías',
                subcategories: [],
            }
        }
    },

    /**
     * Obtener subcategorías por categoría
     * @param {string} categoryId - ID de la categoría
     * @returns {Promise<Object>} - Lista de subcategorías
     */
    getSubcategoriesByCategory: async (categoryId) => {
        try {
            const response = await api.get(`${API_URL}/category/${categoryId}`)
            return {
                success: true,
                subcategories: response.data,
            }
        } catch (error) {
            console.error('Error en getSubcategoriesByCategory:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener subcategorías',
                subcategories: [],
            }
        }
    },

    /**
     * Crear una nueva subcategoría (solo admin)
     * @param {Object} subcategoryData - Datos de la subcategoría
     * @returns {Promise<Object>} - Resultado de la operación
     */
    createSubcategory: async (subcategoryData) => {
        try {
            const response = await api.post(API_URL, subcategoryData)
            return {
                success: true,
                message: response.data.message || 'Subcategoría creada exitosamente',
                subcategory: response.data.subcategory || response.data,
            }
        } catch (error) {
            console.error('Error en createSubcategory:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear subcategoría',
            }
        }
    },

    /**
     * Actualizar una subcategoría (solo admin)
     * @param {string} id - ID de la subcategoría
     * @param {Object} subcategoryData - Datos actualizados
     * @returns {Promise<Object>} - Resultado de la operación
     */
    updateSubcategory: async (id, subcategoryData) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, subcategoryData)
            return {
                success: true,
                message: response.data.message || 'Subcategoría actualizada',
                subcategory: response.data.subcategory || response.data,
            }
        } catch (error) {
            console.error('Error en updateSubcategory:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar subcategoría',
            }
        }
    },

    /**
     * Eliminar una subcategoría (solo admin)
     * @param {string} id - ID de la subcategoría
     * @returns {Promise<Object>} - Resultado de la operación
     */
    deleteSubcategory: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`)
            return {
                success: true,
                message: response.data.message || 'Subcategoría eliminada',
            }
        } catch (error) {
            console.error('Error en deleteSubcategory:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al eliminar subcategoría',
            }
        }
    },
}

export default subcategoryServices