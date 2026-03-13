import { createContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useUser } from '../Hooks/useUser.js'
import {
    addToCartService,
    getCartService,
    updateCartService,
    removeFromCartService,
    clearCartService,
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

    // Cálculo de totales con useMemo para optimizar rendimiento
    const total = useMemo(() => {
        return cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
    }, [cart])

    const itemsQuantity = useMemo(() => {
        return cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
    }, [cart])

    // Funciones de localStorage memoizadas
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
            const userId = getUserId()
            if (!userId) return

            try {
                setLoading(true);
                const response = await getCartService(userId);

                const cartItems = response.cart?.products?.map((item) => ({
                    _id: item.productId._id,
                    name: item.productId.name,
                    price: item.productId.price,
                    imageUrl: item.productId.imageUrl,
                    description: item.productId.description,
                    stock: item.productId.stock,
                    quantity: item.quantity,
                })) || [];

                setCart(cartItems);
            } catch (error) {
                console.log('El carrito está vacío o fue procesado tras la compra.');
                setCart([]); 
            } finally {
                setLoading(false);
            }
        } else {
            const localCart = loadLocalCart();
            setCart(localCart);
        }
    }, [isAuthenticated, getUserId, loadLocalCart]);

    // Función para sincronizar carrito local con el backend
    const syncCartWithBackend = useCallback(async () => {
        const localCart = loadLocalCart()
        const userId = getUserId()

        if (localCart.length > 0 && isAuthenticated() && userId && !syncInProgress) {
            setSyncInProgress(true)
            try {
                setLoading(true)
                for (const item of localCart) {
                    await addToCartService(userId, item._id, item.quantity)
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
    }, [isAuthenticated, getUserId, loadLocalCart, loadCart, syncInProgress]);

    // Manejo de cambios de autenticación
    useEffect(() => {
        if (userLoading) return

        if (userInfo?.id) {
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
    }, [userInfo?.id, userLoading, loadLocalCart, loadCart, syncCartWithBackend, syncInProgress]);

    const addToCart = useCallback(async (product, quantity = 1) => {
        const userId = getUserId()
        if (isAuthenticated() && userId) {
            try {
                setLoading(true)
                await addToCartService(userId, product._id, quantity)
                await loadCart()
                toast.success('Producto agregado al carrito')
            } catch (error) {
                toast.error('Error al agregar al carrito')
            } finally {
                setLoading(false)
            }
        } else {
            setCart(prevCart => {
                const existingIndex = prevCart.findIndex(item => item._id === product._id)
                let newCart;
                
                if (existingIndex > -1) {
                    newCart = prevCart.map((item, index) => 
                        index === existingIndex 
                            ? { ...item, quantity: (item.quantity || 1) + quantity }
                            : item
                    );
                } else {
                    newCart = [...prevCart, { ...product, quantity }];
                }
                
                saveLocalCart(newCart);
                return newCart;
            });
            toast.success('Producto agregado al carrito');
        }
    }, [isAuthenticated, getUserId, loadCart, saveLocalCart]);

    const removeFromCart = useCallback(async (productId) => {
        const userId = getUserId()
        if (isAuthenticated() && userId) {
            try {
                setLoading(true)
                await removeFromCartService(userId, productId)
                await loadCart()
                toast.success('Producto eliminado del carrito')
            } catch (error) {
                toast.error('Error al eliminar producto')
            } finally {
                setLoading(false)
            }
        } else {
            setCart(prevCart => {
                const newCart = prevCart.filter(item => item._id !== productId)
                saveLocalCart(newCart)
                return newCart
            })
        }
    }, [isAuthenticated, getUserId, loadCart, saveLocalCart]);

    const updateQuantity = useCallback(async (productId, newQuantity) => {
        if (newQuantity < 1) return
        
        const userId = getUserId()
        if (isAuthenticated() && userId) {
            try {
                setLoading(true)
                await updateCartService(userId, productId, newQuantity)
                await loadCart()
            } catch (error) {
                toast.error('Error al actualizar cantidad')
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
    }, [isAuthenticated, getUserId, loadCart, saveLocalCart]);

    const clearCart = useCallback(async () => {
        const userId = getUserId()
        if (isAuthenticated() && userId) {
            try {
                setLoading(true)
                await clearCartService(userId)
                setCart([])
                toast.success('Carrito vaciado')
            } catch (error) {
                toast.error('Error al limpiar carrito')
            } finally {
                setLoading(false)
            }
        } else {
            setCart([])
            saveLocalCart([])
        }
    }, [isAuthenticated, getUserId, saveLocalCart]);

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

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
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}