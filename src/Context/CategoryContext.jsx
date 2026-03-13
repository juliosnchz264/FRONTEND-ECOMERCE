import React, { createContext, useState, useCallback } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_BACKEND_URL

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
            const response = await axios.get(`${API_URL}/categories`)
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
            const response = await axios.get(`${API_URL}/categories/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener categoría:', error)
            toast.error('Error al cargar la categoría')
            return null
        }
    }

    const createCategory = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/categories`, data)
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
            const response = await axios.put(`${API_URL}/categories/${id}`, data)
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
        try {
            await axios.delete(`${API_URL}/categories/${id}`)
            toast.success('Categoría eliminada')
            await getCategories()
            return { success: true }
        } catch (error) {
            console.error('Error al eliminar categoría:', error)
            toast.error(error.response?.data?.message || 'Error al eliminar')
            return { success: false }
        }
    }

    // ========== SUBCATEGORÍAS ==========
    const getSubcategories = useCallback(async (categoryId = null) => {
        try {
            setLoading(true)
            const url = categoryId 
                ? `${API_URL}/subcategories/category/${categoryId}`
                : `${API_URL}/subcategories`
            const response = await axios.get(url)
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
            const response = await axios.get(`${API_URL}/subcategories/${id}`)
            return response.data
        } catch (error) {
            console.error('Error al obtener subcategoría:', error)
            return null
        }
    }

    const createSubcategory = async (data) => {
        try {
            const response = await axios.post(`${API_URL}/subcategories`, data)
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
            const response = await axios.put(`${API_URL}/subcategories/${id}`, data)
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
            await axios.delete(`${API_URL}/subcategories/${id}`)
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