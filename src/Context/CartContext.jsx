// frontend/src/Context/CartContext.jsx
import {
    createContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from 'react'
import { useUser } from '../Hooks/useUser.js'
import { useRealtimeCart } from '../Hooks/useRealTimeCart.js'
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

    // 🟢 REFERENCIAS PARA CONTROLAR OPERACIONES
    const isMountedRef = useRef(true)
    const initialLoadDoneRef = useRef(false)
    const lastUpdateRef = useRef(null)
    const broadcastChannelRef = useRef(null)
    const retryCountRef = useRef(0)
    const maxRetries = 3

    // 🟢 NUEVAS REFERENCIAS PARA CONTROLAR EMISIONES
    const addToCartInProgressRef = useRef(false)
    const emitTimeoutRef = useRef(null)
    const lastEmittedCartRef = useRef(null)

    // Pasar setCart al hook de tiempo real
    const {
        connected,
        emitUpdate,
        addToCart: realtimeAddToCart,
        updateQuantity: realtimeUpdateQuantity,
        removeFromCart: realtimeRemoveFromCart,
        clearCart: realtimeClearCart,
    } = useRealtimeCart(setCart)

    const {
        getUserId,
        isAuthenticated,
        loading: userLoading,
        userInfo,
    } = useUser()

    // LOG PARA VERIFICAR QUE setCart ESTÁ DISPONIBLE
    console.log('🎯 CartContext - setCart disponible:', !!setCart)

    // ===== CONFIGURAR BROADCAST CHANNEL PARA SINCRONIZACIÓN ENTRE PESTAÑAS =====
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const channel = new BroadcastChannel('ecommerce_cart_broadcast')
            broadcastChannelRef.current = channel

            channel.onmessage = (event) => {
                const { type, cart: remoteCart, timestamp, source } = event.data

                if (source === window.location.href) return

                // 🚩 MEJORA: Si el socket está conectado, ignoramos el Broadcast
                // porque el servidor ya nos enviará la verdad absoluta.
                if (connected) {
                    console.log(
                        '⏭️ Ignorando Broadcast porque Socket.IO está activo',
                    )
                    return
                }

                if (lastUpdateRef.current === timestamp) return

                if (type === 'CART_UPDATED') {
                    console.log(
                        '📻 Sincronizando vía Broadcast (Modo Invitado/Offline)',
                    )
                    setCart(remoteCart)
                    saveLocalCart(remoteCart)
                    lastUpdateRef.current = timestamp
                }
            }

            console.log(
                '📻 BroadcastChannel configurado para sincronización entre pestañas',
            )

            return () => {
                console.log('📻 Cerrando BroadcastChannel')
                channel.close()
            }
        }
    }, [])

    // Función para emitir cambios a través de BroadcastChannel
    const broadcastUpdate = useCallback((cartData) => {
        if (broadcastChannelRef.current && typeof window !== 'undefined') {
            const timestamp = Date.now()
            lastUpdateRef.current = timestamp

            broadcastChannelRef.current.postMessage({
                type: 'CART_UPDATED',
                cart: cartData,
                source: window.location.href,
                timestamp: timestamp,
            })

            console.log(
                '📻 Emitiendo actualización vía BroadcastChannel:',
                cartData,
            )
        }
    }, [])

    // Mostrar estado de conexión
    useEffect(() => {
        if (connected) {
            console.log('🟢 Carrito sincronizado en tiempo real (Socket.IO)')
        } else {
            console.log(
                '🟡 Modo sincronización entre pestañas (BroadcastChannel)',
            )
        }
    }, [connected])

    // ===== CÁLCULO DE TOTALES =====
    const total = useMemo(() => {
        const rawTotal = cart.reduce(
            (acc, item) => acc + item.price * (item.quantity || 1),
            0,
        )
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

    // Función para cargar el carrito (backend o localStorage) - VERSIÓN CORREGIDA
    const loadCart = useCallback(
        async (skipCache = false) => {
            // 🟢 ELIMINADO: if (loading && !skipCache) return;

            if (isAuthenticated()) {
                try {
                    setLoading(true)
                    const response = await getCartService()

                    const cartItems =
                        response.cart?.products?.map((item) => ({
                            _id: item.productId._id,
                            name: item.productId.name,
                            price: item.productId.price,
                            imageUrl: item.productId.imageUrl || null,
                            description: item.productId.description,
                            stock: item.productId.stock,
                            quantity: item.quantity,
                        })) || []

                    if (isMountedRef.current) {
                        setCart(cartItems)

                        // Sincronizar localStorage
                        if (cartItems.length > 0) {
                            localStorage.setItem(
                                'cart',
                                JSON.stringify(cartItems),
                            )
                        } else {
                            localStorage.removeItem('cart')
                        }
                    }

                    return cartItems
                } catch (error) {
                    console.log('Error al cargar carrito:', error)
                    if (isMountedRef.current) {
                        setCart([])
                    }
                    return []
                } finally {
                    // 🟢 SIEMPRE liberar loading
                    if (isMountedRef.current) {
                        setLoading(false)
                    }
                }
            } else {
                const localCart = loadLocalCart()
                if (isMountedRef.current) {
                    setCart(localCart)
                    setLoading(false)
                }
                return localCart
            }
        },
        [isAuthenticated, loadLocalCart], // 🟢 Eliminado 'loading' de dependencias
    )

    // Función para sincronizar carrito local con el backend (VERSIÓN FINAL)
    const syncCartWithBackend = useCallback(async () => {
        const localCart = loadLocalCart()

        // Solo sincronizar si hay algo local y el usuario está autenticado
        if (localCart.length > 0 && isAuthenticated() && !syncInProgress) {
            setSyncInProgress(true)
            try {
                setLoading(true)
                console.log(
                    '🔄 Iniciando fusión de carrito local con servidor...',
                )

                // En lugar de elegir CASO 1 o CASO 2, FUSIONAMOS siempre
                for (const item of localCart) {
                    await addToCartService(item._id, item.quantity)
                }

                // Una vez subido todo, limpiamos local
                localStorage.removeItem('cart')

                // Recargamos el carrito final del backend
                const finalCart = await loadCart(true)

                // 🚀 ESTO ES LO QUE ARREGLA EL CONFLICTO MULTI-DISPOSITIVO:
                // Si el socket ya conectó, avisamos a todos los demás dispositivos
                if (connected && finalCart) {
                    const response = await getCartService()
                    emitUpdate(response.cart)
                    console.log(
                        '📤 Cambio global emitido tras fusión post-login',
                    )
                }

                toast.success('Carrito sincronizado y recuperado')
            } catch (error) {
                console.error('❌ Error en la sincronización:', error)
            } finally {
                setSyncInProgress(false)
                setLoading(false)
            }
        }
    }, [
        isAuthenticated,
        loadLocalCart,
        loadCart,
        connected,
        emitUpdate,
        syncInProgress,
    ])

    // 2. CORRECCIÓN DEL LOG DE ESTADO (Para que no sea molesto)
    useEffect(() => {
        if (connected) {
            console.log(
                '🟢 Conectado: Sincronización Real-time activa (Socket.IO)',
            )
        } else {
            // Solo mostrar si no estamos cargando el usuario, para evitar ruido innecesario
            if (!userLoading) {
                console.log(
                    '🟡 Pendiente: Usando respaldo entre pestañas (BroadcastChannel)',
                )
            }
        }
    }, [connected, userLoading])

    // 3. ACTUALIZAR EL useEffect de inicialización para que la lógica de fusión sea sólida
    useEffect(() => {
        isMountedRef.current = true
        if (userLoading) return

        const initCart = async () => {
            if (initialLoadDoneRef.current) return

            if (isAuthenticated()) {
                // 1. Cargamos primero lo que dice el servidor
                const backendCart = await loadCart(true)
                const localCart = loadLocalCart()

                // 2. ¿Hay conflicto? (Hay cosas en local Y en el backend)
                if (localCart.length > 0) {
                    if (backendCart && backendCart.length > 0) {
                        // ESTRATEGIA: Si el backend ya tiene datos, asumimos que
                        // lo local es "basura" o ya fue sincronizado por otra pestaña.
                        console.log(
                            '🧹 Limpiando localCart redundante (el servidor ya tiene datos)',
                        )
                        localStorage.removeItem('cart')
                    } else {
                        // Si el backend está vacío pero hay local, sincronizamos
                        console.log('🔄 Sincronizando carrito local único...')
                        await syncCartWithBackend()
                    }
                }
            } else {
                setCart(loadLocalCart())
                setLoading(false)
            }
            initialLoadDoneRef.current = true
        }

        initCart()
        return () => {
            isMountedRef.current = false
        }
    }, [
        isAuthenticated,
        userLoading,
        loadCart,
        loadLocalCart,
        syncCartWithBackend,
    ])
    // Manejo de cambios de autenticación - VERSIÓN CORREGIDA
    useEffect(() => {
        isMountedRef.current = true

        if (userLoading) return

        const initCart = async () => {
            if (initialLoadDoneRef.current) return

            if (isAuthenticated()) {
                // 🟢 PRIMERO: Cargar del backend
                const backendCart = await loadCart()

                // 🟢 SOLO si el backend está vacío, verificar localStorage
                if (backendCart && backendCart.length === 0) {
                    const localCart = loadLocalCart()

                    // Si hay productos locales Y no hay sync en progreso
                    if (localCart.length > 0 && !syncInProgress) {
                        console.log(
                            '⚠️ Backend vacío con productos locales detectado:',
                            localCart.length,
                        )

                        // 🟢 AHORA SÍ USAMOS syncCartWithBackend
                        await syncCartWithBackend()
                    }
                }

                // 🟢 Si el backend ya tiene productos, todo bien
                else if (backendCart && backendCart.length > 0) {
                    console.log(
                        '✅ Carrito del backend cargado:',
                        backendCart.length,
                        'productos',
                    )
                }
            } else {
                // Usuario no autenticado
                setCart(loadLocalCart())
                setLoading(false)
            }

            initialLoadDoneRef.current = true
        }

        initCart()

        return () => {
            isMountedRef.current = false
        }
    }, [
        isAuthenticated,
        userLoading,
        loadLocalCart,
        loadCart,
        syncCartWithBackend,
        syncInProgress,
    ])

    // ===== FUNCIONES DEL MODAL =====
    // 🟢 MOVERLAS AQUÍ, ANTES DE LAS FUNCIONES QUE LAS USAN
    const openModal = useCallback(() => setIsModalOpen(true), [])
    const closeModal = useCallback(() => setIsModalOpen(false), [])

    // ===== FUNCIONES DEL CARRITO CON CONTROL DE ERRORES =====
    const addToCart = useCallback(
        async (product, quantity = 1) => {
            if (addToCartInProgressRef.current) {
                console.log('⏳ Operación de agregar en curso, ignorando')
                return
            }

            if (quantity <= 0) {
                toast.error('La cantidad debe ser mayor a 0')
                return
            }

            // 🟢 VERIFICAR STOCK LOCALMENTE PRIMERO
            const currentCartItem = cart.find(
                (item) => item._id === product._id,
            )
            const currentQty = currentCartItem?.quantity || 0
            const totalAfterAdd = currentQty + quantity

            if (totalAfterAdd > product.stock) {
                const availableToAdd = product.stock - currentQty
                toast.error(
                    availableToAdd === 0
                        ? `Ya tienes el máximo disponible (${product.stock}) en tu carrito`
                        : `Solo puedes agregar ${availableToAdd} más (límite: ${product.stock})`,
                )
                return
            }

            if (isAuthenticated()) {
                try {
                    addToCartInProgressRef.current = true
                    setLoading(true)

                    await addToCartService(product._id, quantity)
                    const updatedCart = await loadCart(true)

                    if (emitTimeoutRef.current) {
                        clearTimeout(emitTimeoutRef.current)
                    }

                    if (connected && updatedCart) {
                        emitTimeoutRef.current = setTimeout(async () => {
                            try {
                                const response = await getCartService()
                                emitUpdate(response.cart)
                                console.log(
                                    '📤 Emisión única después de agregar',
                                )
                            } finally {
                                emitTimeoutRef.current = null
                            }
                        }, 500)
                    }

                    toast.success('Producto agregado al carrito')
                } catch (error) {
                    console.error('Error al agregar al carrito:', error)

                    // Mensajes más amigables
                    if (error.message.includes('máximo disponible')) {
                        toast.error(
                            'Ya tienes la cantidad máxima permitida en tu carrito',
                        )
                    } else {
                        toast.error(
                            error.message || 'Error al agregar al carrito',
                        )
                    }
                } finally {
                    setLoading(false)
                    setTimeout(() => {
                        addToCartInProgressRef.current = false
                    }, 1000)
                }
            } else {
                // Modo offline - implementar cuando sea necesario
                setCart((prevCart) => {
                    const existingIndex = prevCart.findIndex(
                        (item) => item._id === product._id,
                    )
                    let newCart

                    if (existingIndex > -1) {
                        newCart = prevCart.map((item, index) =>
                            index === existingIndex
                                ? {
                                      ...item,
                                      quantity: (item.quantity || 1) + quantity,
                                  }
                                : item,
                        )
                    } else {
                        newCart = [...prevCart, { ...product, quantity }]
                    }

                    saveLocalCart(newCart)
                    broadcastUpdate(newCart)
                    toast.success('Producto agregado al carrito')
                    return newCart
                })
            }
        },
        [
            isAuthenticated,
            loadCart,
            connected,
            emitUpdate,
            cart,
            saveLocalCart,
            broadcastUpdate,
        ],
    )

    const removeFromCart = useCallback(
        async (productId) => {
            if (isAuthenticated()) {
                try {
                    setLoading(true)
                    await removeFromCartService(productId)
                    const updatedCart = await loadCart(true)

                    if (connected && updatedCart) {
                        const response = await getCartService()
                        emitUpdate(response.cart)
                    }

                    // 🟢 Cerrar modal después de eliminar
                    closeModal()

                    toast.success('Producto eliminado del carrito')
                } catch (error) {
                    console.error('Error al eliminar producto:', error)
                    toast.error(error.message || 'Error al eliminar producto')
                } finally {
                    setLoading(false)
                }
            } else {
                setCart((prevCart) => {
                    const newCart = prevCart.filter(
                        (item) => item._id !== productId,
                    )
                    saveLocalCart(newCart)
                    broadcastUpdate(newCart)

                    // 🟢 Cerrar modal para usuarios no autenticados también
                    closeModal()

                    return newCart
                })
                toast.success('Producto eliminado del carrito')
            }
        },
        [
            isAuthenticated,
            loadCart,
            saveLocalCart,
            connected,
            emitUpdate,
            broadcastUpdate,
            closeModal, // ✅ AHORA closeModal ESTÁ DEFINIDA
        ],
    )

    const updateQuantity = useCallback(
        async (productId, newQuantity) => {
            if (newQuantity < 1) {
                removeFromCart(productId)
                return
            }

            if (isAuthenticated()) {
                try {
                    setLoading(true)
                    await updateCartService(productId, newQuantity)
                    const updatedCart = await loadCart(true)

                    if (connected && updatedCart) {
                        const response = await getCartService()
                        emitUpdate(response.cart)
                    }
                } catch (error) {
                    console.error('Error al actualizar cantidad:', error)
                    toast.error(error.message || 'Error al actualizar cantidad')
                } finally {
                    setLoading(false)
                }
            } else {
                setCart((prevCart) => {
                    const item = prevCart.find((i) => i._id === productId)

                    if (item?.stock && newQuantity > item.stock) {
                        toast.error(`Stock insuficiente. Máximo: ${item.stock}`)
                        return prevCart
                    }

                    const newCart = prevCart.map((item) =>
                        item._id === productId
                            ? { ...item, quantity: newQuantity }
                            : item,
                    )
                    saveLocalCart(newCart)
                    broadcastUpdate(newCart)
                    return newCart
                })
            }
        },
        [
            isAuthenticated,
            loadCart,
            saveLocalCart,
            connected,
            emitUpdate,
            broadcastUpdate,
            removeFromCart,
        ],
    )

    const clearCart = useCallback(async () => {
        if (isAuthenticated()) {
            try {
                setLoading(true)
                await clearCartService()
                setCart([])
                localStorage.removeItem('cart')

                if (connected) {
                    emitUpdate({ products: [] })
                }

                toast.success('Carrito vaciado')
            } catch (error) {
                console.error('Error al limpiar carrito:', error)
                toast.error(error.message || 'Error al limpiar carrito')
            } finally {
                // 🟢 SIEMPRE liberar loading
                setLoading(false)
            }
        } else {
            setCart([])
            saveLocalCart([])
            broadcastUpdate([])
            toast.success('Carrito vaciado')
        }
    }, [isAuthenticated, saveLocalCart, connected, emitUpdate, broadcastUpdate])

    const value = {
        cart,
        setCart,
        total,
        itemsQuantity,
        isModalOpen,
        loading,
        connected,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        openModal,
        closeModal,
        loadCart,
    }

    console.log('📦 CartContext value:', {
        hasSetCart: !!value.setCart,
        hasCart: !!value.cart,
        keys: Object.keys(value),
    })

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
