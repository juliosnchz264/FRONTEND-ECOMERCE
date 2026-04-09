import React, { createContext, useState, useCallback } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'

export const CategoryContext = createContext()

export const CategoryContextProvider = ({ children }) => {
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)

    // ========== CATEGORÍAS ==========
    const getCategories = useCallback(async () => {
        try {
            setLoading(true)
            const response = await api.get('/categories')
            setCategories(response.data)
            return response.data
        } catch (error) {
            console.error('Error al obtener categorías:', error)
            toast.error('Error al cargar categorías')
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const getCategoryById = async (id) => {
        try {
            const response = await api.get(`/categories/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener categoría:', error)
            toast.error('Error al cargar la categoría')
            return null
        }
    }

    const createCategory = async (data) => {
        try {
            const response = await api.post('/categories', data)
            toast.success('Categoría creada exitosamente')
            await getCategories()
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Error al crear categoría:', error)
            toast.error(error.response?.data?.message || 'Error al crear categoría')
            return { success: false, error: error.response?.data }
        }
    }

    const updateCategory = async (id, data) => {
        try {
            const response = await api.put(`/categories/${id}`, data)
            toast.success('Categoría actualizada')
            await getCategories()
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Error al actualizar categoría:', error)
            toast.error(error.response?.data?.message || 'Error al actualizar')
            return { success: false }
        }
    }

    const deleteCategory = async (id) => {
        console.log('🗑️ Eliminando categoría con ID:', id) // 👈 Debug
        
        if (!id) {
            console.error('❌ ID de categoría no válido:', id)
            toast.error('ID de categoría no válido')
            return { success: false, message: 'ID no válido' }
        }
        
        try {
            const response = await api.delete(`/categories/${id}`)
            console.log('📥 Respuesta del servidor:', response.data) // 👈 Debug
            
            if (response.status === 200 || response.status === 204) {
                toast.success(response.data?.message || 'Categoría eliminada correctamente')
                
                // Actualizar la lista de categorías después de eliminar
                await getCategories()
                
                return { success: true, message: response.data?.message }
            } else {
                throw new Error('Respuesta inesperada del servidor')
            }
        } catch (error) {
            console.error('❌ Error al eliminar categoría:', error)
            console.error('Detalles del error:', error.response?.data)
            
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.error || 
                                'Error al eliminar la categoría'
            
            toast.error(errorMessage)
            return { success: false, message: errorMessage }
        }
    }

    // ========== SUBCATEGORÍAS ==========
    const getSubcategories = useCallback(async (categoryId = null) => {
        try {
            setLoading(true)
            const url = categoryId
                ? `/subcategories/category/${categoryId}`
                : `/subcategories`
            const response = await api.get(url)
            setSubcategories(response.data)
            return response.data
        } catch (error) {
            console.error('Error al obtener subcategorías:', error)
            toast.error('Error al cargar subcategorías')
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const getSubcategoryById = async (id) => {
        try {
            const response = await api.get(`/subcategories/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener subcategoría:', error)
            return null
        }
    }

    const createSubcategory = async (data) => {
        try {
            const response = await api.post('/subcategories', data)
            toast.success('Subcategoría creada exitosamente')
            await getSubcategories(data.category)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Error al crear subcategoría:', error)
            toast.error(error.response?.data?.message || 'Error al crear subcategoría')
            return { success: false }
        }
    }

    const updateSubcategory = async (id, data) => {
        try {
            const response = await api.put(`/subcategories/${id}`, data)
            toast.success('Subcategoría actualizada')
            await getSubcategories(data.category)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Error al actualizar subcategoría:', error)
            toast.error(error.response?.data?.message || 'Error al actualizar')
            return { success: false }
        }
    }

    const deleteSubcategory = async (id, categoryId) => {
        try {
            await api.delete(`/subcategories/${id}`)
            toast.success('Subcategoría eliminada')
            await getSubcategories(categoryId)
            return { success: true }
        } catch (error) {
            console.error('Error al eliminar subcategoría:', error)
            toast.error(error.response?.data?.message || 'Error al eliminar')
            return { success: false }
        }
    }

    return (
        <CategoryContext.Provider value={{
            // Categorías
            categories,
            loading,
            selectedCategory,
            setSelectedCategory,
            getCategories,
            getCategoryById,
            createCategory,
            updateCategory,
            deleteCategory,
            
            // Subcategorías
            subcategories,
            getSubcategories,
            getSubcategoryById,
            createSubcategory,
            updateSubcategory,
            deleteSubcategory,
        }}>
            {children}
        </CategoryContext.Provider>
    )
}