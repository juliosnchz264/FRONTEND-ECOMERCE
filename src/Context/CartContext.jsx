import { createContext, useState, useEffect } from 'react'
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
    const [total, setTotal] = useState(0)
    const [itemsQuantity, setItemsQuantity] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const {
        getUserId,
        isAuthenticated,
        loading: userLoading,
        userInfo,
    } = useUser()

    // Función para cargar el carrito desde localStorage
    const loadLocalCart = () => {
        try {
            const localCart = localStorage.getItem('cart')
            return localCart ? JSON.parse(localCart) : []
        } catch (error) {
            console.error('Error al cargar carrito local:', error)
            return []
        }
    }

    // Función para guardar el carrito en localStorage
    const saveLocalCart = (cartItems) => {
        try {
            localStorage.setItem('cart', JSON.stringify(cartItems))
        } catch (error) {
            console.error('Error al guardar carrito local:', error)
        }
    }

    // Función para cargar el carrito (backend o localStorage)
    const loadCart = async () => {
        if (isAuthenticated()) {
            const userId = getUserId()
            if (!userId) return

            try {
                setLoading(true);
                const response = await getCartService(userId);

                // Si el backend responde con éxito pero sin productos (carrito recién vaciado)
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
    };

    // Función para sincronizar carrito local con el backend
    const syncCartWithBackend = async () => {
        const localCart = loadLocalCart()
        const userId = getUserId()

       // Escudo: Solo sincroniza si hay items Y hay un userId real
        if (localCart.length > 0 && isAuthenticated() && userId) {
            try {
                setLoading(true)
                for (const item of localCart) {
                    await addToCartService(userId, item._id, item.quantity)
                }
                localStorage.removeItem('cart')
                await loadCart()
                toast.success('Carrito sincronizado')
            } catch (error) {
                console.error('Error al sincronizar:', error)
            } finally {
                setLoading(false)
            }
        }
    }

// Manejo de Auth Changes
    useEffect(() => {
        if (userLoading) return

        if (userInfo?.id) {
            const localCart = loadLocalCart()
            if (localCart.length > 0) {
                syncCartWithBackend()
            } else {
                loadCart()
            }
        } else {
            // Logout o Invitado: Resetear a local sin peticiones al servidor
            setCart(loadLocalCart())
            setLoading(false)
        }
    }, [userInfo?.id, userLoading])

    // Cálculo de totales
    useEffect(() => {
        const newTotal = cart.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0)
        setTotal(newTotal)
        const newQty = cart.reduce((acc, item) => acc + (item.quantity || 1), 0)
        setItemsQuantity(newQty)
    }, [cart])

    const addToCart = async (product, quantity = 1) => {
        const userId = getUserId()
        if (isAuthenticated() && userId) { // Escudo para el 400
            try {
                setLoading(true)
                await addToCartService(userId, product._id, quantity)
                await loadCart()
                toast.success('Producto agregado')
            } catch (error) {
                toast.error('Error al agregar al carrito')
            } finally {
                setLoading(false)
            }
        } else {
            const currentCart = [...cart]
            const existingIndex = currentCart.findIndex(item => item._id === product._id)
            if (existingIndex > -1) {
                currentCart[existingIndex].quantity += quantity
            } else {
                currentCart.push({ ...product, quantity })
            }
            setCart(currentCart)
            saveLocalCart(currentCart)
            toast.success('Producto agregado al carrito')
        }
    }

    const removeFromCart = async (productId) => {
        const userId = getUserId()
        if (isAuthenticated() && userId) {
            try {
                setLoading(true)
                await removeFromCartService(userId, productId)
                await loadCart()
                toast.success('Eliminado del carrito')
            } catch (error) {
                toast.error('Error al eliminar')
            } finally {
                setLoading(false)
            }
        } else {
            const currentCart = cart.filter(item => item._id !== productId)
            setCart(currentCart)
            saveLocalCart(currentCart)
        }
    }

    const updateQuantity = async (productId, newQuantity) => {
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
            const currentCart = cart.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            )
            setCart(currentCart)
            saveLocalCart(currentCart)
        }
    }

    const clearCart = async () => {
        const userId = getUserId()
        if (isAuthenticated() && userId) {
            try {
                setLoading(true)
                await clearCartService(userId)
                setCart([])
            } catch (error) {
                toast.error('Error al limpiar carrito')
            } finally {
                setLoading(false)
            }
        } else {
            setCart([])
            saveLocalCart([])
        }
    }

    return (
        <CartContext.Provider
            value={{
                cart, setCart, total, itemsQuantity, isModalOpen, loading,
                addToCart, removeFromCart, clearCart, updateQuantity,
                openModal: () => setIsModalOpen(true),
                closeModal: () => setIsModalOpen(false),
                loadCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
