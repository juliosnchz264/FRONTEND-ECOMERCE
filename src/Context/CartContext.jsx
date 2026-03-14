import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useUser } from '../Hooks/useUser.js'
import {
    addToCartService,
    getCartService,
    updateCartService,
    removeFromCartService,
    clearCartService,
    mergeCartsService,
} from '../services/cartServices'
import { toast } from 'react-hot-toast'

export const CartContext = createContext({})

export const CartContextProvider = ({ children }) => {
    const [cart, setCart] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [syncInProgress, setSyncInProgress] = useState(false)

    const {
        getUserId,
        isAuthenticated,
        loading: userLoading,
        userInfo,
    } = useUser()

    // ===== CÁLCULO DE TOTALES CORREGIDO (sin decimales extraños) =====
    const total = useMemo(() => {
        const rawTotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
        // Redondear a 2 decimales y convertir a número
        return Number(rawTotal.toFixed(2))
    }, [cart])

    const itemsQuantity = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
    }, [cart])

    // Funciones de localStorage
    const loadLocalCart = useCallback(() => {
        try {
            const localCart = localStorage.getItem('cart')
            return localCart ? JSON.parse(localCart) : []
        } catch (error) {
            console.error('Error al cargar carrito local:', error)
            return []
        }
    }, [])

    const saveLocalCart = useCallback((cartItems) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error('Error al guardar carrito local:', error)
        }
    }, [])

    // Función para cargar el carrito (backend o localStorage)
    const loadCart = useCallback(async () => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                const response = await getCartService()
                
                // Transformar los datos del backend al formato que espera el frontend
                const cartItems = response.cart?.products?.map((item) => ({
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    imageUrl: item.productId.imageUrl || null,
                    description: item.productId.description,
                    stock: item.productId.stock,
                    quantity: item.quantity,
                })) || []
                
                setCart(cartItems)
            } catch (error) {
                console.log('El carrito está vacío o hubo un error:', error)
                setCart([]) 
            } finally {
                setLoading(false)
            }
        } else {
            const localCart = loadLocalCart()
            setCart(localCart)
            setLoading(false)
        }
    }, [isAuthenticated, loadLocalCart])

    // Función para sincronizar carrito local con el backend
    const syncCartWithBackend = useCallback(async () => {
        const localCart = loadLocalCart()
        
        if (localCart.length > 0 && isAuthenticated() && !syncInProgress) {
            setSyncInProgress(true)
            try {
                setLoading(true)
                for (const item of localCart) {
                    await addToCartService(item._id, item.quantity)
                }
                localStorage.removeItem('cart')
                await loadCart()
                toast.success('Carrito sincronizado correctamente')
            } catch (error) {
                console.error('Error al sincronizar:', error)
                toast.error('Error al sincronizar el carrito')
            } finally {
                setLoading(false)
                setSyncInProgress(false)
            }
        }
    }, [isAuthenticated, loadLocalCart, loadCart, syncInProgress])

    // Manejo de cambios de autenticación
    useEffect(() => {
        if (userLoading) return

        if (isAuthenticated()) {
            const localCart = loadLocalCart()
            if (localCart.length > 0 && !syncInProgress) {
                syncCartWithBackend()
            } else {
                loadCart()
            }
        } else {
            setCart(loadLocalCart())
            setLoading(false)
        }
    }, [isAuthenticated, userLoading, loadLocalCart, loadCart, syncCartWithBackend, syncInProgress])

    // addToCart
    const addToCart = useCallback(async (product, quantity = 1) => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                await addToCartService(product._id, quantity)
                await loadCart()
                toast.success('Producto agregado al carrito')
            } catch (error) {
                toast.error(error.message || 'Error al agregar al carrito')
            } finally {
                setLoading(false)
            }
        } else {
            setCart(prevCart => {
                const existingIndex = prevCart.findIndex(item => item._id === product._id)
                let newCart
                
                if (existingIndex > -1) {
                    newCart = prevCart.map((item, index) => 
                        index === existingIndex 
                            ? { ...item, quantity: (item.quantity || 1) + quantity }
                            : item
                    )
                } else {
                    newCart = [...prevCart, { ...product, quantity }]
                }
                
                saveLocalCart(newCart)
                return newCart
            })
            toast.success('Producto agregado al carrito')
        }
    }, [isAuthenticated, loadCart, saveLocalCart])

    // removeFromCart
    const removeFromCart = useCallback(async (productId) => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                await removeFromCartService(productId)
                await loadCart()
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                toast.error(error.message || 'Error al eliminar producto')
            } finally {
                setLoading(false)
            }
        } else {
            setCart(prevCart => {
                const newCart = prevCart.filter(item => item._id !== productId)
                saveLocalCart(newCart)
                return newCart
            })
            toast.success('Producto eliminado del carrito')
        }
    }, [isAuthenticated, loadCart, saveLocalCart])

    // updateQuantity
    const updateQuantity = useCallback(async (productId, newQuantity) => {
        if (newQuantity < 1) return
        
        if (isAuthenticated()) {
            try {
                setLoading(true)
                await updateCartService(productId, newQuantity)
                await loadCart()
            } catch (error) {
                toast.error(error.message || 'Error al actualizar cantidad')
            } finally {
                setLoading(false)
            }
        } else {
            setCart(prevCart => {
                const newCart = prevCart.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                )
                saveLocalCart(newCart)
                return newCart
            })
        }
    }, [isAuthenticated, loadCart, saveLocalCart])

    // clearCart
    const clearCart = useCallback(async () => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                await clearCartService()
                setCart([])
                toast.success('Carrito vaciado')
            } catch (error) {
                toast.error(error.message || 'Error al limpiar carrito')
            } finally {
                setLoading(false)
            }
        } else {
            setCart([])
            saveLocalCart([])
            toast.success('Carrito vaciado')
        }
    }, [isAuthenticated, saveLocalCart])

    // openModal y closeModal
    const openModal = useCallback(() => setIsModalOpen(true), [])
    const closeModal = useCallback(() => setIsModalOpen(false), [])

    const value = {
        cart,
        total,
        itemsQuantity,
        isModalOpen,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        openModal,
        closeModal,
        loadCart,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}