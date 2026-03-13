import {
    useState,
    useEffect,
    useCallback,
    createContext,
} from 'react'
import axios from 'axios'

// Configuración global de axios para enviar cookies en todas las peticiones
axios.defaults.withCredentials = true

const API_URL = import.meta.env.VITE_BACKEND_URL + '/products'
const CATEGORIES_URL = import.meta.env.VITE_BACKEND_URL + '/categories'

export const ProductContext = createContext({})

export const ProductContextProvider = ({ children }) => {
    // Estados existentes
    const [allProducts, setAllProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    
    // Estados para categorías
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    
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
            setFilteredProducts(response.data)
            return response.data
        } catch (error) {
            console.error('❌ FETCH - Error:', error);
            setError(error.message || 'Error al obtener los productos')
            return []
        } finally {
            setProductsLoading(false)
        }
    }, [])

    // Función para obtener categorías
    const getCategories = useCallback(async () => {
        try {
            setCategoriesLoading(true)
            const response = await axios.get(CATEGORIES_URL)
            setCategories(response.data)
            return response.data
        } catch (error) {
            console.error('❌ FRONTEND: Error completo:', error)
            return []
        } finally {
            setCategoriesLoading(false)
        }
    }, [])

    // Función de filtrado por categoría
    const filterByCategory = useCallback((categoryName, subcategoryId = null) => {
        setSelectedCategory(categoryName);
        setSelectedSubcategory(subcategoryId);
    }, []);

    const getProductById = useCallback(async (id) => {
        setProductLoading(true)
        setProduct({})
        try {
            const response = await axios.get(`${API_URL}/${id}`)
            setProduct(response.data)
            return response.data
        } catch (error) {
            setError(error.message || 'Error al obtener el producto')
            return null
        } finally {
            setProductLoading(false)
        }
    }, [])

    // 🚀 VERSIÓN CORREGIDA - SOLO COOKIES, SIN LOCALSTORAGE
    const updateProduct = useCallback(async (id, data) => {
        console.log('📦 updateProduct recibió:', data);

        try {
            // ✅ ELIMINADO: const token = localStorage.getItem('token');
            // ✅ Las cookies se envían automáticamente gracias a withCredentials: true

            const response = await axios.put(`${API_URL}/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    // ✅ NO NECESITAMOS Authorization header
                }
            });

            if (response.status === 200) {
                const updatedProduct = response.data.product || response.data
                
                console.log('✅ Producto actualizado:', updatedProduct)
                
                // Actualizar el producto en el estado
                setProduct(updatedProduct)
                
                // Actualizar en allProducts
                setAllProducts((prev) => {
                    const newProducts = prev.map((p) => 
                        p._id === id ? updatedProduct : p
                    )
                    return newProducts
                })
                
                return { 
                    success: true, 
                    message: response.data.message || 'Producto actualizado',
                    data: updatedProduct 
                }
            }
        } catch (error) {
            console.error('❌ Error al actualizar:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            
            // Manejar error 401 específicamente
            if (error.response?.status === 401) {
                return { 
                    success: false, 
                    message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.' 
                };
            }
            
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al actualizar' 
            };
        }
    }, []);

    // 🚀 VERSIÓN CORREGIDA - SOLO COOKIES
    const createProduct = useCallback(async (data) => {
        console.log('📦 createProduct recibió:', data);

        try {
            // ✅ ELIMINADO: const token = localStorage.getItem('token');

            const response = await axios.post(API_URL, data, {
                headers: {
                    'Content-Type': 'application/json',
                    // ✅ SIN Authorization header
                }
            });
            
            if (response.status === 201) {
                const newProduct = response.data.product || response.data
                console.log('✅ Producto creado:', newProduct)
                
                setAllProducts((prev) => [...prev, newProduct])
                
                if (selectedCategory) {
                    filterByCategory(selectedCategory, selectedSubcategory);
                }
                
                return { 
                    success: true, 
                    message: response.data.message || 'Producto creado exitosamente',
                    data: newProduct
                }
            }
        } catch (error) {
            console.error('❌ Error en createProduct:', error.response?.data || error.message)
            
            if (error.response?.status === 401) {
                return { 
                    success: false, 
                    message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.' 
                };
            }
            
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al crear el producto',
                error: error.response?.data
            }
        }
    }, [selectedCategory, selectedSubcategory, filterByCategory]);

    // 🚀 VERSIÓN CORREGIDA - SOLO COOKIES
    const deleteProduct = useCallback(async (id) => {
        try {
            // ✅ ELIMINADO: const token = localStorage.getItem('token');

            const response = await axios.delete(`${API_URL}/${id}`, {
                headers: {
                    // ✅ SIN Authorization header
                }
            });
            
            if (response.status === 200) {
                console.log('🗑️ Producto eliminado:', id)
                setAllProducts((prev) => prev.filter((p) => p._id !== id))
                
                if (selectedCategory) {
                    filterByCategory(selectedCategory, selectedSubcategory);
                }
                
                return { 
                    success: true, 
                    message: response.data.message || 'Producto eliminado' 
                }
            }
        } catch (error) {
            console.error('Error al eliminar:', error.response?.data)
            
            if (error.response?.status === 401) {
                return { 
                    success: false, 
                    message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.' 
                };
            }
            
            return { 
                success: false, 
                message: error.response?.data?.message || 'Error al eliminar' 
            }
        }
    }, [selectedCategory, selectedSubcategory, filterByCategory]);

    // Efecto para filtrar cuando cambian las dependencias
    useEffect(() => {
        if (allProducts.length === 0) {
            setFilteredProducts([]);
            return;
        }

        if (selectedCategory === 'Todos') {
            setFilteredProducts(allProducts);
            return;
        }

        if (!categories || categories.length === 0) {
            setFilteredProducts(allProducts);
            return;
        }

        let selectedCategoryObj = categories.find(c => {
            const catName = c.name?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const selectedName = selectedCategory?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            return catName === selectedName;
        });

        if (!selectedCategoryObj) {
            selectedCategoryObj = categories.find(c => c._id === selectedCategory);
        }

        if (!selectedCategoryObj) {
            setFilteredProducts([]);
            return;
        }

        let filtered = allProducts.filter(p => {
            const productCategoryId = p.category?._id?.toString() || p.category?.toString();
            return productCategoryId === selectedCategoryObj._id.toString();
        });

        if (selectedSubcategory) {
            filtered = filtered.filter(p => {
                const productSubcategoryId = p.subcategory?._id?.toString() || p.subcategory?.toString();
                return productSubcategoryId === selectedSubcategory.toString();
            });
        }

        setFilteredProducts(filtered);

    }, [allProducts, selectedCategory, selectedSubcategory, categories]);

    // Cargar productos y categorías al montar
    useEffect(() => {
        getProducts()
        getCategories()
    }, [getProducts, getCategories])

    const value = {
        // Productos
        product,
        products: filteredProducts,
        allProducts,
        productsLoading,
        productLoading,
        error,
        
        // Categorías
        categories,
        categoriesLoading,
        getCategories,
        
        // Filtros
        selectedCategory,
        selectedSubcategory,
        setSelectedCategory,
        setSelectedSubcategory,
        filterByCategory,
        
        // Acciones
        getProducts,
        getProductById,
        updateProduct,
        createProduct,
        deleteProduct,
    }

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    )
}