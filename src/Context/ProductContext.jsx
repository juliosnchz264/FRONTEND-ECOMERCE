import {
    useState,
    useEffect,
    useCallback,
    createContext,
} from 'react'
import axios from 'axios'

axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_BACKEND_URL + '/products'

export const ProductContext = createContext({})

export const ProductContextProvider = ({ children }) => {
// 1. Estados para el filtrado
    const [allProducts, setAllProducts] = useState([]) // "Copia maestra" del backend
    const [filteredProducts, setFilteredProducts] = useState([]) // Lo que se muestra en UI
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    
    const [productsLoading, setProductsLoading] = useState(true)
    const [product, setProduct] = useState({})
    const [productLoading, setProductLoading] = useState(true)
    const [error, setError] = useState(null)

    // Función para obtener productos
    const getProducts = useCallback(async () => {
        try {
            setProductsLoading(true)
            const response = await axios.get(API_URL)
            setAllProducts(response.data)
            setFilteredProducts(response.data) // Al inicio, mostrar todos
        } catch (error) {
            setError(error.message || 'Error al obtener los productos')
        } finally {
            setProductsLoading(false)
        }
    }, [])

// 2. Función de filtrado por categoría
    const filterByCategory = useCallback((category) => {
        setSelectedCategory(category)
        
        if (category === 'Todos') {
            setFilteredProducts(allProducts)
        } else {
            const filtered = allProducts.filter(p => p.category === category)
            setFilteredProducts(filtered)
        }
    }, [allProducts])

    const getProductById = useCallback(async (id) => {
        setProductLoading(true)
        setProduct({})
        try {
            const response = await axios.get(`${API_URL}/${id}`)
            setProduct(response.data)
        } catch (error) {
            setError(error.message || 'Error al obtener el producto')
        } finally {
            setProductLoading(false)
        }
    }, [])

    const updateProduct = useCallback(async (id, data) => {
        const cleanData = {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            stock: Number(data.stock),
            imageUrl: data.imageUrl,
            category: data.category, // No olvides incluir la categoría aquí
        }

        try {
            const response = await axios.put(`${API_URL}/${id}`, cleanData)

            if (response.status === 200) {
                setProduct(response.data)
                // Actualizamos la lista maestra
                setAllProducts((prev) =>
                    prev.map((p) => (p._id === id ? response.data : p))
                )
                return { success: true, message: 'Producto actualizado' }
            }
        } catch (error) {
            return { success: false, message: 'Error al actualizar' }
        }
    }, [])

    const createProduct = useCallback(async (data) => {
        const cleanData = {
            name: data.name,
            description: data.description,
            price: Number(data.price),
            stock: Number(data.stock),
            imageUrl: data.imageUrl,
            category: data.category, // Incluimos categoría al crear
        }

        try {
            const response = await axios.post(API_URL, cleanData)
            if (response.status === 201) {
                setAllProducts((prev) => [...prev, response.data.product])
                return { success: true, message: 'Producto creado' }
            }
        } catch (error) {
            return { success: false, message: 'Error al crear' }
        }
    }, [])

    const deleteProduct = useCallback(async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`)
            if (response.status === 200) {
                setAllProducts((prev) => prev.filter((p) => p._id !== id))
                return { success: true, message: 'Producto eliminado' }
            }
        } catch (error) {
            return { success: false, message: 'Error al eliminar' }
        }
    }, [])

    // Sincronizar filteredProducts cuando la lista maestra cambie (ej: al borrar/crear)
    useEffect(() => {
        filterByCategory(selectedCategory)
    }, [allProducts, selectedCategory, filterByCategory])

    useEffect(() => {
        getProducts()
    }, [getProducts])

    const value = {
        product,
        products: filteredProducts, // <-- IMPORTANTE: Ahora exportamos los filtrados como "products"
        allProducts,
        productsLoading,
        productLoading,
        selectedCategory,
        error,
        getProducts,
        getProductById,
        updateProduct,
        createProduct,
        deleteProduct,
        filterByCategory, // Exportamos la función de filtrado
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}