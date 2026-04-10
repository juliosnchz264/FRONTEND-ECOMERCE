// src/Context/ProductContext.jsx
import { useState, useEffect, useCallback, createContext, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import productService from '../services/productServices.js'
import categoryService from '../services/categoryServices.js'
import subcategoryService from '../services/subcategoryServices.js'

export const ProductContext = createContext({})

export const ProductContextProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams()

    // Estados - leer directamente de searchParams
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get('categoria') || 'Todos',
    )
    const [selectedSubcategory, setSelectedSubcategory] = useState(
        searchParams.get('subcategoria') || null,
    )
    const [currentPage, setCurrentPage] = useState(() => {
        const page = parseInt(searchParams.get('page'))
        return Number.isFinite(page) && page >= 1 ? page : 1
    })

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

    // Refs para evitar fetch duplicado y ciclos
    const isFetchingRef = useRef(false)
    const lastFetchKeyRef = useRef('')
    const isUpdatingFromUrlRef = useRef(false)

    // Cargar categorías usando categoryService
    const getCategories = useCallback(async () => {
        setCategoriesLoading(true)
        const result = await categoryService.getCategories()
        if (result.success) {
            setCategories(result.categories)
        } else {
            console.error('Error cargando categorías:', result.error)
        }
        setCategoriesLoading(false)
        return result.categories
    }, [])

    // Cargar subcategorías usando subcategoryService
    const getSubcategories = useCallback(async () => {
        const result = await subcategoryService.getSubcategories()
        if (result.success) {
            setSubcategories(result.subcategories)
        } else {
            console.error('Error cargando subcategorías:', result.error)
        }
        return result.subcategories
    }, [])

    // Obtener ID de subcategoría por nombre
    const getSubcategoryIdFromName = useCallback(
        (name) => {
            if (!name) return null
            const subcat = subcategories.find((s) => s.name === name)
            return subcat ? subcat._id : null
        },
        [subcategories],
    )

    // Obtener nombre de subcategoría por ID
    const getSubcategoryNameFromId = useCallback(
        (id) => {
            if (!id) return null
            const subcat = subcategories.find((s) => s._id === id)
            return subcat ? subcat.name : null
        },
        [subcategories],
    )

    // Función para obtener productos usando productService
    const fetchProducts = useCallback(async () => {
        // Convertir subcategoría de nombre a ID si es necesario
        const subcategoryId =
            selectedSubcategory && !/^[0-9a-fA-F]{24}$/.test(selectedSubcategory)
                ? getSubcategoryIdFromName(selectedSubcategory)
                : selectedSubcategory

        const fetchKey = `${currentPage}-${itemsPerPage}-${selectedCategory}-${subcategoryId || 'none'}`

        // Evitar fetch duplicado
        if (isFetchingRef.current && lastFetchKeyRef.current === fetchKey) {
            return
        }

        isFetchingRef.current = true
        lastFetchKeyRef.current = fetchKey

        try {
            setProductsLoading(true)
            setError(null)

            const result = await productService.getProducts({
                page: currentPage,
                limit: itemsPerPage,
                category: selectedCategory !== 'Todos' ? selectedCategory : undefined,
                subcategory: subcategoryId,
            })

            if (result.success) {
                setProducts(result.products)
                setTotalPages(result.totalPages)
                setTotalProducts(result.totalProducts)
            } else {
                setError(result.error)
            }
        } catch (error) {
            console.error('Error fetching products:', error)
            setError(error.message || 'Error al obtener productos')
        } finally {
            setProductsLoading(false)
            setTimeout(() => {
                isFetchingRef.current = false
            }, 100)
        }
    }, [
        currentPage,
        itemsPerPage,
        selectedCategory,
        selectedSubcategory,
        getSubcategoryIdFromName,
    ])

    // 👉 EFECTO: Sincronizar URL con estado (con validación de params)
    useEffect(() => {
        if (isUpdatingFromUrlRef.current) return

        const rawCategory = searchParams.get('categoria') || 'Todos'
        let rawSubcategory = searchParams.get('subcategoria') || null
        const parsedPage = parseInt(searchParams.get('page'))
        const urlPage = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1

        // Convertir ID de subcategoría a nombre si es necesario
        if (rawSubcategory && /^[0-9a-fA-F]{24}$/.test(rawSubcategory)) {
            const name = getSubcategoryNameFromId(rawSubcategory)
            if (name) rawSubcategory = name
        }

        // Validar categoria contra la whitelist de categorías cargadas.
        // Si aún no cargaron (categories vacío), dejar pasar para no bloquear el fetch inicial.
        const urlCategory =
            categories.length === 0 || rawCategory === 'Todos'
                ? rawCategory
                : categories.some((c) => c.name === rawCategory)
                    ? rawCategory
                    : 'Todos'

        // Validar subcategoría contra la whitelist de subcategorías cargadas.
        const urlSubcategory =
            rawSubcategory === null ||
            subcategories.length === 0 ||
            subcategories.some((s) => s.name === rawSubcategory)
                ? rawSubcategory
                : null

        // Si algún param era inválido, limpiar la URL para no dejar basura
        const categoryWasInvalid = urlCategory !== rawCategory
        const subcategoryWasInvalid = urlSubcategory !== rawSubcategory

        isUpdatingFromUrlRef.current = true

        if (categoryWasInvalid || subcategoryWasInvalid) {
            const cleanParams = new URLSearchParams()
            if (urlCategory !== 'Todos') cleanParams.set('categoria', urlCategory)
            if (urlSubcategory) cleanParams.set('subcategoria', urlSubcategory)
            if (urlPage > 1) cleanParams.set('page', urlPage.toString())
            setSearchParams(cleanParams, { replace: true })
        }

        let needsUpdate = false

        if (selectedCategory !== urlCategory) {
            setSelectedCategory(urlCategory)
            needsUpdate = true
        }

        if (selectedSubcategory !== urlSubcategory) {
            setSelectedSubcategory(urlSubcategory)
            needsUpdate = true
        }

        if (currentPage !== urlPage) {
            setCurrentPage(urlPage)
            needsUpdate = true
        }

        if (needsUpdate) {
            // URL synced with state
        }

        setTimeout(() => {
            isUpdatingFromUrlRef.current = false
        }, 100)
    }, [searchParams, selectedCategory, selectedSubcategory, currentPage, categories, subcategories, getSubcategoryNameFromId, setSearchParams])

    // 👉 EFECTO: Cargar productos cuando cambian los parámetros
    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Cargar categorías y subcategorías al inicio
    useEffect(() => {
        getCategories()
        getSubcategories()
    }, [getCategories, getSubcategories])

    // Funciones de navegación - SOLO actualizan la URL
    const goToPage = useCallback(
        (page) => {
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                isUpdatingFromUrlRef.current = true

                const newParams = new URLSearchParams(searchParams)
                if (page !== 1) {
                    newParams.set('page', page.toString())
                } else {
                    newParams.delete('page')
                }

                setSearchParams(newParams, { replace: true })
                setCurrentPage(page)

                window.scrollTo({ top: 0, behavior: 'smooth' })

                setTimeout(() => {
                    isUpdatingFromUrlRef.current = false
                }, 100)
            }
        },
        [currentPage, totalPages, searchParams, setSearchParams],
    )

    const filterByCategory = useCallback(
        (categoryName, subcategoryParam = null) => {
            isUpdatingFromUrlRef.current = true

            const newParams = new URLSearchParams()

            if (categoryName && categoryName !== 'Todos') {
                newParams.set('categoria', categoryName)
            }

            let subcategoryValue = subcategoryParam
            if (
                subcategoryParam &&
                /^[0-9a-fA-F]{24}$/.test(subcategoryParam)
            ) {
                const name = getSubcategoryNameFromId(subcategoryParam)
                if (name) {
                    subcategoryValue = name
                }
            }

            if (subcategoryValue) {
                newParams.set('subcategoria', subcategoryValue)
            }

            newParams.set('page', '1')

            setSearchParams(newParams, { replace: true })

            setSelectedCategory(categoryName)
            setSelectedSubcategory(subcategoryValue)
            setCurrentPage(1)

            window.scrollTo({ top: 0, behavior: 'smooth' })

            setTimeout(() => {
                isUpdatingFromUrlRef.current = false
            }, 100)
        },
        [setSearchParams, getSubcategoryNameFromId],
    )

    const resetFilters = useCallback(() => {
        setSearchParams({ page: '1' }, { replace: true })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [setSearchParams])

    const changeItemsPerPage = useCallback(
        (newLimit) => {
            setItemsPerPage(newLimit)
            const newParams = new URLSearchParams(searchParams)
            newParams.set('page', '1')
            setSearchParams(newParams, { replace: true })
        },
        [searchParams, setSearchParams],
    )

    // Producto individual (solo lectura)
    const [product, setProduct] = useState({})
    const [productLoading, setProductLoading] = useState(false)

    const getProductById = useCallback(async (id) => {
        setProductLoading(true)
        setProduct({})
        try {
            const result = await productService.getProductById(id)
            if (result.success) {
                setProduct(result.product)
                return result.product
            } else {
                setError(result.error)
                return null
            }
        } catch (error) {
            setError(error.message || 'Error al obtener el producto')
            return null
        } finally {
            setProductLoading(false)
        }
    }, [])

    // ⚠️ NOTA: createProduct, updateProduct, deleteProduct NO están aquí
    // Estas funciones están en DashboardProductContext para el admin

    const value = {
        // Productos (solo lectura)
        products,
        product,
        productsLoading,
        productLoading,
        error,
        
        // Categorías y subcategorías
        categories,
        categoriesLoading,
        getCategories,
        subcategories,
        getSubcategories,
        
        // Filtros
        selectedCategory,
        selectedSubcategory,
        filterByCategory,
        resetFilters,
        
        // Paginación
        currentPage,
        totalPages,
        totalProducts,
        itemsPerPage,
        goToPage,
        setItemsPerPage: changeItemsPerPage,
        
        // Acciones de lectura
        getProductById,
        getProducts: fetchProducts,
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}