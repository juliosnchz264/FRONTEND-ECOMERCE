// frontend/src/Hooks/useRealTimeCart.js
import { useEffect, useState, useCallback, useRef } from 'react'
import { useUser } from './useUser'
import {
    initializeSocket,
    disconnectSocket,
    emitCartUpdate,
    isConnected,
} from '../services/socketService'
import { toast } from 'react-hot-toast'
import { getAccessToken } from '../services/authServices'

// 🟢 Evento personalizado para cambios en el token
const TOKEN_EVENT = 'token-changed';

export const useRealtimeCart = (setCartFromContext) => {
    const { userInfo, isAuthenticated } = useUser()
    const [connected, setConnected] = useState(false)
    const [connectionAttempts, setConnectionAttempts] = useState(0)
    const [token, setToken] = useState(getAccessToken())

    const setCartRef = useRef(setCartFromContext)
    const lastUserIdRef = useRef(null)
    const lastTokenRef = useRef(null)
    const reconnectTimeoutRef = useRef(null)
    const socketRef = useRef(null)
    const isCleaningUpRef = useRef(false)

    // Map para trackear actualizaciones únicas
    const processedUpdatesRef = useRef(new Map())
    const isEmittingRef = useRef(false)
    const updateTimeoutRef = useRef(null)
    const lastCartStateRef = useRef(null)
    const pendingUpdatesRef = useRef([])
    const lastProcessedTimestampRef = useRef(0)
    const lastClearCartTimestampRef = useRef(0)

    // ============================================
    // 🟢 ESCUCHAR CAMBIOS EN EL TOKEN
    // ============================================
    useEffect(() => {
        const handleTokenChange = (event) => {
            console.log('🔥🔥🔥 EVENTO TOKEN-CHANGED RECIBIDO', event.detail);
            
            const newToken = event.detail.token;
            const currentToken = getAccessToken();
            const currentUserId = userInfo?.id;
            
            // Solo reconectar si el token es diferente Y hay usuario
            if (newToken !== currentToken && currentUserId) {
                console.log('   Token diferente, marcando para reconexión');
                lastTokenRef.current = null; // Forzar reconexión
                if (socketRef.current) {
                    // No desconectar inmediatamente, dejar que el efecto principal lo maneje
                    setConnected(false);
                }
            } else {
                console.log('   Mismo token, manteniendo conexión');
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener(TOKEN_EVENT, handleTokenChange);
            return () => window.removeEventListener(TOKEN_EVENT, handleTokenChange);
        }
    }, [userInfo?.id]);

    useEffect(() => {
        console.log(
            '📝 Actualizando setCartRef en useRealtimeCart:',
            !!setCartFromContext,
        )
        setCartRef.current = setCartFromContext
    }, [setCartFromContext])

    // ============================================
    // 🟢 MANEJADOR DE ACTUALIZACIONES DEL CARRITO (OPTIMIZADO REDIS)
    // ============================================
    const handleCartUpdate = useCallback((cartData) => {
        // Verificar si la actualización viene de esta misma pestaña
        if (cartData.source === window.location.href) {
            console.log('🔄 Ignorando actualización de la misma pestaña')
            return
        }

        console.log(
            '📦 Actualización recibida (Redis):',
            cartData,
        )

        // Timestamp duplicado ignorado (10ms para Redis)
        const now = Date.now()
        if (cartData.timestamp && cartData.timestamp === lastProcessedTimestampRef.current) {
            console.log('⏱️ Timestamp duplicado ignorado (10ms)')
            return
        }
        lastProcessedTimestampRef.current = cartData.timestamp

        // Crear ID único más simple (Redis es rápido)
        const updateId = `${cartData.timestamp}-${cartData.products?.length || 0}`

        // Limpiar IDs antiguos cada 1 segundo (Redis)
        for (const [id, time] of processedUpdatesRef.current.entries()) {
            if (now - time > 1000) { // 1 segundo para Redis
                processedUpdatesRef.current.delete(id)
            }
        }

        // Verificar duplicados
        if (processedUpdatesRef.current.has(updateId)) {
            console.log('⏭️ Actualización duplicada ignorada (Redis)')
            return
        }
        processedUpdatesRef.current.set(updateId, now)

        // Obtener la función setCart
        const setCart = setCartRef.current

        if (!setCart) {
            console.error('❌ setCart no disponible en handleCartUpdate')
            return
        }

        try {
            // Transformar productos
            let cartItems = []
            if (cartData.products && Array.isArray(cartData.products)) {
                cartItems = cartData.products
                    .map((item) => {
                        const product = item.productId || {}
                        return {
                            _id: product._id || item._id || 'temp-id',
                            name: product.name || 'Producto',
                            price: product.price || 0,
                            imageUrl: product.imageUrl || null,
                            quantity: item.quantity || 1,
                            stock: product.stock || 0,
                            description: product.description || '',
                        }
                    })
                    .filter((item) => item._id && item.name !== 'Producto')
            }

            // Verificar si es un vaciado de carrito
            const isClearCart =
                cartData.products?.length === 0 && cartItems.length === 0

            // Mostrar estado anterior
            console.log(
                '📊 Estado anterior:',
                lastCartStateRef.current
                    ? JSON.parse(lastCartStateRef.current)
                    : 'vacío',
            )

            // Para vaciados, siempre procesar
            if (isClearCart) {
                console.log('🧹 Procesando vaciado de carrito')
                console.log('📦 Nuevos productos (vacíos):', cartItems)

                lastCartStateRef.current = JSON.stringify(cartItems)
                setCart(cartItems)

                // Actualizar localStorage en segundo plano
                setTimeout(() => {
                    try {
                        localStorage.setItem('cart', JSON.stringify(cartItems))
                    } catch (e) {
                        console.error('Error guardando en localStorage:', e)
                    }
                }, 0)

                toast.success('Carrito vaciado en otro dispositivo')
                return
            }

            // Verificar cambios
            const newCartJSON = JSON.stringify(cartItems)
            const hasChanges = lastCartStateRef.current !== newCartJSON

            if (!hasChanges) {
                console.log('⏭️ Carrito sin cambios, ignorando')
                return
            }

            // ACTUALIZAR INMEDIATAMENTE
            console.log(
                '🔄 ACTUALIZANDO CARRITO (Redis):',
                cartItems.length,
                'productos',
            )
            console.log('📦 Nuevos productos:', cartItems)

            lastCartStateRef.current = newCartJSON
            setCart(cartItems)

            // Actualizar localStorage en segundo plano
            setTimeout(() => {
                try {
                    localStorage.setItem('cart', JSON.stringify(cartItems))
                } catch (e) {
                    console.error('Error guardando en localStorage:', e)
                }
            }, 0)

            toast.success('🔄 Carrito actualizado', { duration: 1000 })

        } catch (error) {
            console.error('Error procesando actualización:', error)
        }
    }, [])

    // ============================================
    // 🟢 EFECTO PRINCIPAL PARA CONEXIÓN SOCKET
    // ============================================
    useEffect(() => {
        const currentUserId = userInfo?.id || null
        const currentToken = getAccessToken()

        console.log('🔍 Verificando conexión socket:', {
            userId: currentUserId,
            hasToken: !!currentToken,
            isAuthenticated: isAuthenticated(),
            connected,
            lastUserId: lastUserIdRef.current,
            lastToken: lastTokenRef.current ? '✅' : '❌'
        })

        // Si no hay usuario autenticado o token, limpiar
        if (!currentUserId || !isAuthenticated() || !currentToken) {
            if (lastUserIdRef.current || socketRef.current) {
                console.log('🚫 Usuario desautenticado o sin token, limpiando socket')
                disconnectSocket()
                setConnected(false)
                lastUserIdRef.current = null
                lastTokenRef.current = null
                socketRef.current = null
            }
            return
        }

        // 🟢 VERIFICACIÓN MEJORADA: Mismo usuario Y mismo token Y socket conectado
        if (lastUserIdRef.current === currentUserId && 
            lastTokenRef.current === currentToken && 
            connected && 
            socketRef.current) {
            console.log('⏭️ Mismo usuario y token, manteniendo conexión')
            return
        }

        // Si el usuario es el mismo pero el token cambió o el socket no está conectado
        if (lastUserIdRef.current === currentUserId) {
            if (lastTokenRef.current !== currentToken) {
                console.log('🔄 Token diferente, reconectando...')
            } else if (!connected) {
                console.log('🔄 Socket desconectado, reconectando...')
            }
        }

        // Actualizar los refs
        lastUserIdRef.current = currentUserId
        lastTokenRef.current = currentToken

        console.log('🟢 Configurando Socket.IO para usuario:', currentUserId)
        console.log('🔑 Token presente:', !!currentToken)

        const socket = initializeSocket(
            currentUserId,
            currentToken,
        )
        
        socketRef.current = socket

        // Guardar socket en window para debugging
        window.socket = socket

        // Configurar listeners
        socket.on('cart:initial', handleCartUpdate)
        socket.on('cart:synced', (data) => {
            console.log('✅ Carrito sincronizado en servidor:', data)
        })
        socket.on('cart:updated', handleCartUpdate)
        socket.on('cart:error', (error) => {
            console.error('❌ Error en carrito - DETALLES:', {
                message: error.message,
                timestamp: error.timestamp,
                fullError: error
            })
            toast.error(error.message || 'Error en sincronización')
        })

        socket.on('connect', () => {
            console.log('✅✅✅ Socket.IO conectado con ID:', socket.id)
            setConnected(true)
            setConnectionAttempts(0)
            toast.success('🟢 Conectado en tiempo real', { duration: 2000 })
        })

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket.IO desconectado. Razón:', reason)
            setConnected(false)

            // Intentar reconectar si no fue intencional
            if (reason === 'io server disconnect' || reason === 'transport close') {
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current)
                }
                
                const delay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000)
                console.log(`🔄 Reintentando conexión en ${delay}ms...`)
                
                reconnectTimeoutRef.current = setTimeout(() => {
                    setConnectionAttempts(prev => prev + 1)
                    socket.connect()
                }, delay)
            }
        })

        socket.on('connect_error', (error) => {
            console.error('❌ Error de conexión:', error.message)
            
            if (error.message.includes('token') || error.message.includes('autenticación')) {
                toast.error('🔐 Token inválido, por favor inicia sesión nuevamente')
            }
        })

        setConnected(isConnected())

        // Cleanup
        return () => {
            // 🟢 EVITAR LIMPIEZA INNECESARIA
            const shouldCleanup = lastUserIdRef.current !== currentUserId || 
                                  lastTokenRef.current !== getAccessToken();
            
            if (!shouldCleanup) {
                console.log('⏭️ Mismo usuario y token, NO limpiando conexión')
                return
            }

            console.log('🧹 Usuario o token cambiaron, limpiando conexión Socket.IO')
            
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
            
            if (socket) {
                socket.off('cart:initial', handleCartUpdate)
                socket.off('cart:synced')
                socket.off('cart:updated', handleCartUpdate)
                socket.off('cart:error')
                socket.off('connect')
                socket.off('disconnect')
                socket.off('connect_error')
            }
            
            disconnectSocket()

            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current)
            }

            // Limpiar referencias solo si cambió el usuario
            if (lastUserIdRef.current !== currentUserId) {
                processedUpdatesRef.current.clear()
                lastCartStateRef.current = null
                pendingUpdatesRef.current = []
            }
        }
    }, [userInfo?.id, isAuthenticated, getAccessToken(), handleCartUpdate, connectionAttempts])

    // ============================================
    // 🟢 FUNCIÓN PARA EMITIR ACTUALIZACIONES (OPTIMIZADA REDIS)
    // ============================================
    const emitUpdate = useCallback(
        (cartData) => {
            const isClearCart = cartData.products?.length === 0
            
            // Control de vaciados recientes (500ms para Redis)
            if (isClearCart) {
                if (Date.now() - lastClearCartTimestampRef.current < 500) {
                    console.log('⏱️ Vaciado reciente ignorado (500ms)')
                    return
                }
                lastClearCartTimestampRef.current = Date.now()
            }
            
            // Agregar timestamp a la actualización
            const updateWithTimestamp = {
                ...cartData,
                timestamp: Date.now(),
                lastModified: Date.now(),
                source: window.location.href
            }

            pendingUpdatesRef.current.push(updateWithTimestamp)

            // Si ya hay un timeout programado, no hacer nada
            if (updateTimeoutRef.current) {
                console.log(
                    `⏳ Actualizaciones en cola (Redis): ${pendingUpdatesRef.current.length}`,
                )
                return
            }

            // Procesar la cola con debounce ULTRA RÁPIDO
            const processQueue = () => {
                if (pendingUpdatesRef.current.length === 0) return

                // Tomar SOLO la última actualización
                const latestUpdate =
                    pendingUpdatesRef.current[
                        pendingUpdatesRef.current.length - 1
                    ]
                const previousCount = pendingUpdatesRef.current.length - 1

                if (previousCount > 0) {
                    console.log(`📊 Resumen de actualizaciones (Redis):`)
                    console.log(
                        `   - Descartadas: ${previousCount} intermedias`,
                    )
                    console.log(
                        `   - Enviando final: ${latestUpdate.products?.length || 0} productos`,
                    )
                }

                // Vaciar la cola
                pendingUpdatesRef.current = []

                if (connected && !isEmittingRef.current) {
                    isEmittingRef.current = true

                    try {
                        const updateWithSource = {
                            ...latestUpdate,
                            source: window.location.href,
                            isBroadcast: true,
                        }

                        console.log(
                            '📤 Enviando actualización (Redis ultra-rápido):',
                            updateWithSource.products?.length || 0,
                            'productos',
                        )

                        emitCartUpdate(updateWithSource)
                    } finally {
                        // Liberar lock después de 150ms
                        setTimeout(() => {
                            isEmittingRef.current = false
                            updateTimeoutRef.current = null

                            // Si llegaron más actualizaciones mientras emitíamos, procesar
                            if (pendingUpdatesRef.current.length > 0) {
                                console.log(
                                    `🔄 Procesando nuevas actualizaciones (${pendingUpdatesRef.current.length})`,
                                )
                                updateTimeoutRef.current = setTimeout(
                                    processQueue,
                                    25, // 25ms para Redis
                                )
                            }
                        }, 150)
                    }
                }
            }

            // Programar procesamiento con debounce ULTRA RÁPIDO (50ms)
            updateTimeoutRef.current = setTimeout(processQueue, 50)
        },
        [connected],
    )

    return {
        connected,
        emitUpdate,
        addToCart: () => {},
        updateQuantity: () => {},
        removeFromCart: () => {},
        clearCart: () => {},
    }
}