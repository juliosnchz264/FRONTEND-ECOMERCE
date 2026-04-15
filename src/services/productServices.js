// src/services/productServices.js
import api from './api'

const API_URL = '/products'

/**
 * Servicio para la gestión de productos
 */
const productServices = {
    /**
     * Obtener productos con paginación y filtros
     * @param {Object} params - Parámetros de consulta
     * @param {number} params.page - Número de página
     * @param {number} params.limit - Productos por página
     * @param {string} params.category - Categoría (nombre o ID)
     * @param {string} params.subcategory - Subcategoría (nombre o ID)
     * @returns {Promise<Object>} - Productos y metadata de paginación
     */
    getProducts: async ({ page = 1, limit = 15, category, subcategory, sort, minPrice, maxPrice, inStock }) => {
        try {
            let url = `${API_URL}?page=${page}&limit=${limit}`

            if (category && category !== 'Todos') {
                url += `&category=${encodeURIComponent(category)}`
            }

            if (subcategory) {
                url += `&subcategory=${encodeURIComponent(subcategory)}`
            }

            if (sort && sort !== 'newest') {
                url += `&sort=${encodeURIComponent(sort)}`
            }

            if (minPrice !== undefined && minPrice !== '') {
                url += `&minPrice=${Number(minPrice)}`
            }

            if (maxPrice !== undefined && maxPrice !== '') {
                url += `&maxPrice=${Number(maxPrice)}`
            }

            if (inStock) {
                url += `&inStock=true`
            }

            const response = await api.get(url)
            
            return {
                success: true,
                products: response.data.products || [],
                totalPages: response.data.totalPages || 1,
                totalProducts: response.data.total || 0,
                currentPage: response.data.currentPage || page,
            }
        } catch (error) {
            console.error('Error en getProducts:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener productos',
                products: [],
                totalPages: 0,
                totalProducts: 0,
            }
        }
    },

    /**
     * Obtener un producto por ID
     * @param {string} id - ID del producto
     * @returns {Promise<Object>} - Producto
     */
    getProductById: async (id) => {
        try {
            const response = await api.get(`${API_URL}/${id}`)
            return {
                success: true,
                product: response.data,
            }
        } catch (error) {
            console.error('Error en getProductById:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Producto no encontrado',
                product: null,
            }
        }
    },

    /**
     * Crear un nuevo producto (solo admin)
     * @param {Object} productData - Datos del producto
     * @returns {Promise<Object>} - Resultado de la operación
     */
    createProduct: async (productData) => {
        try {
            const response = await api.post(API_URL, productData)
            return {
                success: true,
                message: response.data.message || 'Producto creado exitosamente',
                product: response.data.product || response.data,
            }
        } catch (error) {
            console.error('Error en createProduct:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear producto',
                error: error.response?.data,
            }
        }
    },

    /**
     * Actualizar un producto existente (solo admin)
     * @param {string} id - ID del producto
     * @param {Object} productData - Datos actualizados
     * @returns {Promise<Object>} - Resultado de la operación
     */
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`${API_URL}/${id}`, productData)
            return {
                success: true,
                message: response.data.message || 'Producto actualizado',
                product: response.data.product || response.data,
            }
        } catch (error) {
            console.error('Error en updateProduct:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar producto',
            }
        }
    },

    /**
     * Eliminar un producto (solo admin)
     * @param {string} id - ID del producto
     * @returns {Promise<Object>} - Resultado de la operación
     */
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`${API_URL}/${id}`)
            return {
                success: true,
                message: response.data.message || 'Producto eliminado',
            }
        } catch (error) {
            console.error('Error en deleteProduct:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Error al eliminar producto',
            }
        }
    },
}

export default productServices