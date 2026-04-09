// src/Context/DashboardProductContext.jsx
import { useState, useEffect, useCallback, createContext, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import productService from '../services/productServices.js'
import categoryService from '../services/categoryServices.js'
import subcategoryService from '../services/subcategoryServices.js'

export const DashboardProductContext = createContext({})

export const DashboardProductProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    // Estados
    const [products, setProducts] = useState([])
    const [productsLoading, setProductsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [itemsPerPage, setItemsPerPage] = useState(15)

    // Categorías y subcategorías
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const [subcategories, setSubcategories] = useState([])

    // 👉 ESTADOS DE UI separados (para los selects)
    const [uiCategoryId, setUiCategoryId] = useState('todos')
    const [uiSubcategoryId, setUiSubcategoryId] = useState('todos')

    // Refs para control
    const isFetchingRef = useRef(false)
    const lastFetchKeyRef = useRef('')
    const isUpdatingFromUrlRef = useRef(false)
    const categoriesLoadedRef = useRef(false)

    // 👉 LEER DE LA URL - ÚNICA FUENTE DE VERDAD para datos
    const selectedCategoryName = searchParams.get('categoria') || null
    const selectedSubcategoryName = searchParams.get('subcategoria') || null
    const rawPage = parseInt(searchParams.get('page'))
    const currentPage = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1

    // 👉 ESTADOS DERIVADOS - Para la UI (selectores)
    const selectedCategoryId = useMemo(() => {
        if (!selectedCategoryName) return null
        const category = categories.find(c => c.name === selectedCategoryName)
        return category?._id || null
    }, [selectedCategoryName, categories])

    const selectedSubcategoryId = useMemo(() => {
        if (!selectedSubcategoryName) return null
        const subcategory = subcategories.find(s => s.name === selectedSubcategoryName)
        return subcategory?._id || null
    }, [selectedSubcategoryName, subcategories])

    // 👉 MAPAS de nombres a IDs para la API
    const categoryNameToId = useMemo(() => {
        const map = new Map()
        categories.forEach(cat => {
            map.set(cat.name, cat._id)
        })
        return map
    }, [categories])

    const subcategoryNameToId = useMemo(() => {
        const map = new Map()
        subcategories.forEach(sub => {
            map.set(sub.name, sub._id)
        })
        return map
    }, [subcategories])

    // 👉 Subcategorías filtradas por categoría (para UI)
    const filteredSubcategories = useMemo(() => {
        if (!selectedCategoryId) return []
        return subcategories.filter(s => s.categoryId === selectedCategoryId)
    }, [subcategories, selectedCategoryId])

    // 👉 Sincronizar UI con URL
    useEffect(() => {
        if (isUpdatingFromUrlRef.current) return
        if (categories.length === 0) return
        
        const targetId = selectedCategoryId || 'todos'
        if (uiCategoryId !== targetId) {
            setUiCategoryId(targetId)
        }
    }, [selectedCategoryId, categories.length])

    useEffect(() => {
        if (isUpdatingFromUrlRef.current) return
        
        const targetId = selectedSubcategoryId || 'todos'
        if (uiSubcategoryId !== targetId) {
            setUiSubcategoryId(targetId)
        }
    }, [selectedSubcategoryId])

    // Cargar categorías
    const getCategories = useCallback(async () => {
        if (categories.length > 0) return categories
        
        setCategoriesLoading(true)
        const result = await categoryService.getCategories()
        if (result.success) {
            setCategories(result.categories)
            categoriesLoadedRef.current = true
        }
        setCategoriesLoading(false)
        return result.categories || []
    }, [categories.length])

    // Cargar subcategorías
    const getSubcategories = useCallback(async () => {
        if (subcategories.length > 0) return subcategories
        
        const result = await subcategoryService.getSubcategories()
        if (result.success) {
            setSubcategories(result.subcategories)
        }
        return result.subcategories || []
    }, [subcategories.length])

    // 👉 Función para obtener productos - MODIFICADA para enviar IDs
    const fetchProducts = useCallback(async () => {
        if (!categoriesLoadedRef.current && categories.length === 0) {
            return
        }

        // 👉 Convertir nombres a IDs para la API
        const categoryId = selectedCategoryName 
            ? categoryNameToId.get(selectedCategoryName) 
            : undefined
        const subcategoryId = selectedSubcategoryName 
            ? subcategoryNameToId.get(selectedSubcategoryName) 
            : undefined

        const fetchKey = `${currentPage}-${itemsPerPage}-${categoryId || 'none'}-${subcategoryId || 'none'}`

        if (isFetchingRef.current && lastFetchKeyRef.current === fetchKey) return

        isFetchingRef.current = true
        lastFetchKeyRef.current = fetchKey

        const result = await productService.getProducts({
            page: currentPage,
            limit: itemsPerPage,
            category: categoryId,
            subcategory: subcategoryId,
        })

        if (result.success) {
            setProducts(result.products)
            setTotalPages(result.totalPages)
            setTotalProducts(result.totalProducts)
        } else {
            setError(result.error)
        }

        setProductsLoading(false)
        setTimeout(() => {
            isFetchingRef.current = false
        }, 200)
    }, [currentPage, itemsPerPage, selectedCategoryName, selectedSubcategoryName, categoryNameToId, subcategoryNameToId, categories.length])

    // 👉 EFECTO para fetch cuando cambian parámetros
    useEffect(() => {
        if (categoriesLoadedRef.current || categories.length > 0) {
            fetchProducts()
        }
    }, [fetchProducts, categories.length])

    // Inicialización
    useEffect(() => {
        const initialize = async () => {
            await getCategories()
            await getSubcategories()
            fetchProducts()
        }
        initialize()
    }, [])

    // 👉 FUNCIONES PARA ACTUALIZAR URL
    const updateFilters = useCallback((updates) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev)
            let hasChanges = false
            
            Object.entries(updates).forEach(([key, value]) => {
                const currentValue = prev.get(key)
                const newValue = (value === null || value === undefined) ? null : String(value)
                
                if ((currentValue || null) !== newValue) {
                    hasChanges = true
                    if (newValue === null) {
                        newParams.delete(key)
                    } else {
                        newParams.set(key, newValue)
                    }
                }
            })
            
            if (!hasChanges) return prev
            return newParams
        })
        
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [setSearchParams])

    // 👉 FUNCIONES PARA UI
    const handleCategoryChange = useCallback((categoryId) => {
        isUpdatingFromUrlRef.current = true
        setUiCategoryId(categoryId)
        
        if (categoryId === 'todos') {
            updateFilters({
                categoria: null,
                subcategoria: null,
                page: '1'
            })
            setUiSubcategoryId('todos')
        } else {
            const category = categories.find(c => c._id === categoryId)
            if (category) {
                updateFilters({
                    categoria: category.name,
                    subcategoria: null,
                    page: '1'
                })
                setUiSubcategoryId('todos')
            }
        }
        
        setTimeout(() => {
            isUpdatingFromUrlRef.current = false
        }, 100)
    }, [categories, updateFilters])

    const handleSubcategoryChange = useCallback((subcategoryId) => {
        if (!selectedCategoryId) return
        
        isUpdatingFromUrlRef.current = true
        setUiSubcategoryId(subcategoryId)
        
        const category = categories.find(c => c._id === selectedCategoryId)
        if (!category) {
            isUpdatingFromUrlRef.current = false
            return
        }
        
        if (subcategoryId === 'todos') {
            updateFilters({
                subcategoria: null,
                page: '1'
            })
        } else {
            const subcategory = subcategories.find(s => s._id === subcategoryId)
            if (subcategory) {
                updateFilters({
                    subcategoria: subcategory.name,
                    page: '1'
                })
            }
        }
        
        setTimeout(() => {
            isUpdatingFromUrlRef.current = false
        }, 100)
    }, [selectedCategoryId, categories, subcategories, updateFilters])

    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            updateFilters({ page: page.toString() })
        }
    }, [currentPage, totalPages, updateFilters])

    const resetFilters = useCallback(() => {
        handleCategoryChange('todos')
    }, [handleCategoryChange])

    const changeItemsPerPage = useCallback((newLimit) => {
        setItemsPerPage(newLimit)
        updateFilters({ page: '1' })
    }, [updateFilters])

    // CRUD para admin
    const createProduct = useCallback(async (data) => {
        const result = await productService.createProduct(data)
        if (result.success) {
            await getCategories()
            await getSubcategories()
            fetchProducts()
        }
        return result
    }, [fetchProducts, getCategories, getSubcategories])

    const updateProduct = useCallback(async (id, data) => {
        const result = await productService.updateProduct(id, data)
        if (result.success) {
            fetchProducts()
        }
        return result
    }, [fetchProducts])

    const deleteProduct = useCallback(async (id) => {
        const result = await productService.deleteProduct(id)
        if (result.success) {
            fetchProducts()
        }
        return result
    }, [fetchProducts])

    const getProductById = useCallback(async (id) => {
        const result = await productService.getProductById(id)
        return result.product
    }, [])

    const value = {
        products,
        productsLoading,
        error,
        categories,
        categoriesLoading,
        subcategories: filteredSubcategories,
        uiCategoryId,
        uiSubcategoryId,
        selectedCategoryName,
        selectedSubcategoryName,
        selectedCategoryId,
        selectedSubcategoryId,
        currentPage,
        totalPages,
        totalProducts,
        itemsPerPage,
        handleCategoryChange,
        handleSubcategoryChange,
        resetFilters,
        goToPage,
        setItemsPerPage: changeItemsPerPage,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getCategories,
        getSubcategories,
    }

    return (
        <DashboardProductContext.Provider value={value}>
            {children}
        </DashboardProductContext.Provider>
    )
}