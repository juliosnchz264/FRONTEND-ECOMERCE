import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from 'react'
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
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { isAuthenticated, userLoading } = useUser()

    const broadcastChannelRef = useRef(null)
    const isMountedRef = useRef(true)
    const initialLoadDoneRef = useRef(false)
    const previousAuthState = useRef(null)
    const cartRef = useRef([])

    const windowIdRef = useRef(Math.random().toString(36).substring(7))

    useEffect(() => {
        cartRef.current = cart
    }, [cart])

    // ============================================
    // 💾 HELPERS
    // ============================================
    const loadLocalCart = useCallback(
        () => JSON.parse(localStorage.getItem('cart') || '[]'),
        [],
    )

    const saveLocalCart = useCallback((items) => {
        localStorage.setItem('cart', JSON.stringify(items))
        setCart(items)
    }, [])

    const openModal = useCallback(() => setIsModalOpen(true), [])
    const closeModal = useCallback(() => setIsModalOpen(false), [])

    const mapRemoteCart = useCallback((products) => {
        return (
            products
                ?.filter((p) => p.productId)
                .map((p) => ({
                    _id: p.productId._id || p.productId,
                    name: p.productId.name,
                    price: p.productId.price,
                    imageUrl: p.productId.imageUrl,
                    quantity: p.quantity,
                    stock: p.productId.stock,
                })) || []
        )
    }, [])

    // ============================================
    //  CARGA DEL CARRITO
    // ============================================
    const loadCart = useCallback(
        async (skipLoading = false) => {
            if (!isMountedRef.current) return
            if (!skipLoading) setLoading(true)

            try {
                if (isAuthenticated()) {
                    const response = await getCartService()
                    const remoteItems = mapRemoteCart(response.cart?.products)
                    setCart(remoteItems)
                    return remoteItems
                } else {
                    const local = loadLocalCart()
                    setCart(local)
                    return local
                }
            } catch (error) {
                console.error('Error cargando carrito:', error)
                return []
            } finally {
                if (!skipLoading) setLoading(false)
            }
        },
        [isAuthenticated, loadLocalCart, mapRemoteCart],
    )

    // ============================================
    //  FUNCIÓN DE BROADCAST 
    // ============================================
    const notifyOtherTabs = useCallback((type, additionalData = {}) => {
        if (broadcastChannelRef.current) {
            broadcastChannelRef.current.postMessage({
                type,
                payload: {
                    sourceId: windowIdRef.current,
                    timestamp: Date.now(),
                    ...additionalData,
                },
            })
        }
    }, [])

    // ============================================
    //  FUSIÓN POST-LOGIN 
    // ============================================
    const syncCartAfterLogin = useCallback(async () => {
        const guestItems = loadLocalCart()
        setLoading(true)

        try {
            // Verificar si Web Locks está disponible
            const webLocksAvailable =
                navigator &&
                navigator.locks &&
                typeof navigator.locks.request === 'function'

            if (webLocksAvailable) {
                await navigator.locks.request(
                    'cart-merge-lock',
                    async (lock) => {
                        // SIEMPRE hacer merge si hay items de invitado
                        if (guestItems.length > 0) {
                            const response = await mergeCartsService(guestItems)
                            localStorage.removeItem('cart')

                            if (response.cart?.products) {
                                const mergedItems = mapRemoteCart(
                                    response.cart.products,
                                )
                                setCart(mergedItems)
                                toast.success('¡Carrito sincronizado!')
                            }
                        } else {
                            // Si no hay items de invitado, solo cargar
                            const currentCart = await getCartService()
                            setCart(mapRemoteCart(currentCart.cart?.products))
                        }
                    },
                )
            } else {
                // Notificar que vamos a hacer merge
                notifyOtherTabs('MERGE_STARTED', {
                    windowId: windowIdRef.current,
                })

                // Esperar para ver si alguien más ya empezó
                await new Promise((r) => setTimeout(r, 300))

                // 🚨 SIEMPRE hacer merge si hay items de invitado
                if (guestItems.length > 0) {
                    // Verificar si ya hay un merge en progreso de otra ventana
                    if (!window.mergeInProgress) {
                        window.mergeInProgress = true

                        const response = await mergeCartsService(guestItems)
                        localStorage.removeItem('cart')

                        if (response.cart?.products) {
                            const mergedItems = mapRemoteCart(
                                response.cart.products,
                            )
                            setCart(mergedItems)
                            toast.success('¡Carrito sincronizado!')
                        }

                        setTimeout(() => {
                            window.mergeInProgress = false
                        }, 5000)
                    } else {
                        // Esperar y recargar
                        await new Promise((r) => setTimeout(r, 1000))
                        const currentCart = await getCartService()
                        setCart(mapRemoteCart(currentCart.cart?.products))
                    }
                } else {
                    // Si no hay items de invitado, solo cargar
                    const currentCart = await getCartService()
                    setCart(mapRemoteCart(currentCart.cart?.products))
                }
            }

            // Notificar a otras pestañas que recarguen
            notifyOtherTabs('RELOAD_CART')
        } catch (error) {
            console.error(`❌ [${windowIdRef.current}] Error:`, error)
            toast.error('Error al sincronizar')
            await loadCart(true)
        } finally {
            setLoading(false)
        }
    }, [loadLocalCart, loadCart, mapRemoteCart, notifyOtherTabs])

    // ============================================
    //  BROADCAST CHANNEL
    // ============================================
    useEffect(() => {
        const channel = new BroadcastChannel('ecommerce_cart_sync')
        broadcastChannelRef.current = channel
        channel.onmessage = (event) => {
            const { type, payload } = event.data

            // Ignorar mensajes propios
            if (payload?.sourceId === windowIdRef.current) return

            if (type === 'RELOAD_CART') {
                loadCart(true)
            } else if (type === 'LOGOUT') {
                setCart([])
            } else if (type === 'MERGE_STARTED') {
                // Guardar referencia para no hacer merge duplicado
                window.mergeInProgress = true
                setTimeout(() => {
                    window.mergeInProgress = false
                }, 5000)
            }
        }

        return () => {
            isMountedRef.current = false
            channel.close()
        }
    }, [loadCart])
    
    // ============================================
    //  EFECTO DE LOGIN
    // ============================================
    useEffect(() => {
        if (userLoading) return

        const currentAuth = isAuthenticated()
        const previousAuth = previousAuthState.current

        const handleAuthChange = async () => {
            try {
                if (currentAuth && previousAuth === false) {
                    // LOGIN - Web Locks maneja la concurrencia
                    await syncCartAfterLogin()
                } else if (!currentAuth && previousAuth === true) {
                    // LOGOUT
                    localStorage.removeItem('cart')
                    setCart([])
                    notifyOtherTabs('LOGOUT')
                    toast.success('Sesión cerrada')
                } else if (!initialLoadDoneRef.current) {
                    // CARGA INICIAL
                    if (currentAuth) {
                        await loadCart()
                    } else {
                        setCart(loadLocalCart())
                        setLoading(false)
                    }
                    initialLoadDoneRef.current = true
                }
            } catch (error) {
                console.error(`❌ [${windowIdRef.current}] Error:`, error)
                setLoading(false)
            } finally {
                previousAuthState.current = currentAuth
            }
        }

        handleAuthChange()
    }, [
        isAuthenticated,
        userLoading,
        syncCartAfterLogin,
        loadCart,
        loadLocalCart,
        notifyOtherTabs,
    ])

    // ============================================
    //  OPERACIONES
    // ============================================
    const addToCart = async (product, quantity = 1) => {
        try {
            if (isAuthenticated()) {
                setLoading(true)
                const response = await addToCartService(product._id, quantity)
                if (response.cart?.products) {
                    setCart(mapRemoteCart(response.cart.products))
                }
                toast.success('Producto añadido')
                notifyOtherTabs('RELOAD_CART')
            } else {
                const currentCart = loadLocalCart()
                const existingItem = currentCart.find(
                    (i) => i._id === product._id,
                )
                const newQuantity = (existingItem?.quantity || 0) + quantity
                if (newQuantity > product.stock) {
                    return toast.error(`Stock insuficiente`)
                }
                const newCart = existingItem
                    ? currentCart.map((i) =>
                          i._id === product._id
                              ? { ...i, quantity: i.quantity + quantity }
                              : i,
                      )
                    : [...currentCart, { ...product, quantity }]
                saveLocalCart(newCart)
                notifyOtherTabs('RELOAD_CART')
                toast.success('Añadido al carrito local')
            }
        } catch (error) {
            toast.error('Error al añadir')
        } finally {
            setLoading(false)
        }
    }

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return removeFromCart(productId)
        try {
            if (isAuthenticated()) {
                setLoading(true)
                const response = await updateCartService(productId, newQuantity)
                if (response.cart?.products) {
                    setCart(mapRemoteCart(response.cart.products))
                }
                notifyOtherTabs('RELOAD_CART')
            } else {
                const newCart = loadLocalCart().map((i) =>
                    i._id === productId ? { ...i, quantity: newQuantity } : i,
                )
                saveLocalCart(newCart)
                notifyOtherTabs('RELOAD_CART')
            }
        } catch (error) {
            toast.error('Error al actualizar')
        } finally {
            setLoading(false)
        }
    }

    const removeFromCart = async (productId) => {
        try {
            if (isAuthenticated()) {
                setLoading(true)
                const response = await removeFromCartService(productId)
                if (response.cart?.products) {
                    setCart(mapRemoteCart(response.cart.products))
                }
                notifyOtherTabs('RELOAD_CART')
            } else {
                saveLocalCart(
                    loadLocalCart().filter((i) => i._id !== productId),
                )
                notifyOtherTabs('RELOAD_CART')
            }
            toast.success('Producto eliminado')
        } catch (error) {
            toast.error('Error al eliminar')
        } finally {
            setLoading(false)
        }
    }

    const clearCart = async () => {
        try {
            if (isAuthenticated()) {
                setLoading(true)
                await clearCartService()
                setCart([])
                notifyOtherTabs('RELOAD_CART')
            } else {
                saveLocalCart([])
                notifyOtherTabs('RELOAD_CART')
            }
            toast.success('Carrito vaciado')
        } catch (error) {
            toast.error('Error al vaciar')
        } finally {
            setLoading(false)
        }
    }

    // ============================================
    // 📊 TOTALES
    // ============================================
    const total = useMemo(
        () =>
            Number(
                cart
                    .reduce((acc, i) => acc + i.price * i.quantity, 0)
                    .toFixed(2),
            ),
        [cart],
    )

    const itemsQuantity = useMemo(
        () => cart.reduce((acc, i) => acc + (i.quantity || 0), 0),
        [cart],
    )

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

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
