// frontend/src/Hooks/useRealtimeCart.js
import { useEffect, useState, useCallback, useRef } from 'react'
import { useUser } from './useUser'
import {
    initializeSocket,
    disconnectSocket,
    emitCartUpdate,
} from '../services/socketService'
import { toast } from 'react-hot-toast'
import { getAccessToken } from '../services/authServices'

const TOKEN_EVENT = 'token-changed'

export const useRealtimeCart = (setCartFromContext) => {
    const { userInfo, isAuthenticated } = useUser()
    const [connected, setConnected] = useState(false)
    // Inicializamos con el token actual, pero el useEffect de abajo lo mantendrá fresco
    const [token, setToken] = useState(getAccessToken())

    const tabId = useRef(Math.random().toString(36).substring(2, 11)).current
    const setCartRef = useRef(setCartFromContext)
    const lastUserIdRef = useRef(null)
    const lastTokenRef = useRef(null)
    const socketRef = useRef(null)

    const processedUpdatesRef = useRef(new Map())
    const isEmittingRef = useRef(false)
    const updateTimeoutRef = useRef(null)
    const lastCartStateRef = useRef(null)
    const pendingUpdatesRef = useRef([])
    const lastProcessedTimestampRef = useRef(0)

    // ============================================
    // 🟢 1. MANTENER TOKEN SINCRONIZADO CON AUTH
    // ============================================
    useEffect(() => {
        if (isAuthenticated()) {
            const currentToken = getAccessToken()
            if (currentToken && currentToken !== token) {
                setToken(currentToken)
            }
        } else if (token) {
            setToken(null)
        }
    }, [isAuthenticated, token])

    // Escuchar cambios de token desde otras pestañas (Broadcast)
    useEffect(() => {
        const handleTokenChange = (event) => {
            const newToken = event.detail.token
            if (newToken && newToken !== token) {
                console.log(
                    '🔐 Token actualizado vía Broadcast, actualizando estado...',
                )
                setToken(newToken)
                lastTokenRef.current = null
                setConnected(false)
            }
        }
        window.addEventListener(TOKEN_EVENT, handleTokenChange)
        return () => window.removeEventListener(TOKEN_EVENT, handleTokenChange)
    }, [token])

    useEffect(() => {
        setCartRef.current = setCartFromContext
    }, [setCartFromContext])

    const isSyncingRef = useRef(false)

    // ============================================
    // 🟢 2. MANEJADOR DE ACTUALIZACIONES (ACTUALIZADO)
    // ============================================
    const handleCartUpdate = useCallback(
        (cartData) => {
            // 🛡️ 1. Si el mensaje lo originó esta misma pestaña, ignorar
            if (cartData.sourceTab === tabId) return

            const now = Date.now()
            // 🛡️ 2. Evitar procesar el mismo timestamp exacto
            if (
                cartData.timestamp &&
                cartData.timestamp === lastProcessedTimestampRef.current
            )
                return
            lastProcessedTimestampRef.current = cartData.timestamp

            const updateId = `${cartData.timestamp}-${cartData.products?.length || 0}`
            if (processedUpdatesRef.current.has(updateId)) return
            processedUpdatesRef.current.set(updateId, now)

            if (processedUpdatesRef.current.size > 50)
                processedUpdatesRef.current.clear()

            const setCart = setCartRef.current
            if (!setCart) return

            try {
                // 🔒 ACTIVAR BLOQUEO: Estamos recibiendo, no queremos que esta pestaña emita nada
                isSyncingRef.current = true

                const isClearCart =
                    cartData.products?.length === 0 &&
                    (cartData.source === 'clear' || cartData.intentionalClear)
                if (cartData.products?.length === 0 && !isClearCart) {
                    isSyncingRef.current = false
                    return
                }

                const cartItems = (cartData.products || [])
                    .map((item) => ({
                        _id: item.productId?._id || item.productId || item._id,
                        name: item.productId?.name || item.name || 'Producto',
                        price: item.productId?.price || item.price || 0,
                        imageUrl:
                            item.productId?.imageUrl || item.imageUrl || null,
                        quantity: item.quantity || 1,
                        stock: item.productId?.stock || item.stock || 0,
                    }))
                    .filter((item) => item._id)

                const newCartJSON = JSON.stringify(cartItems)
                if (lastCartStateRef.current === newCartJSON) {
                    isSyncingRef.current = false
                    return
                }

                lastCartStateRef.current = newCartJSON

                // Actualizar estado y persistencia
                setCart(cartItems)
                localStorage.setItem('cart', newCartJSON)

                toast.success(
                    isClearCart ? 'Carrito vaciado' : '🛒 Carrito sincronizado',
                    { id: 'sync-toast' },
                )

                // 🔓 LIBERAR BLOQUEO: Damos un margen pequeño para que los efectos de React terminen
                setTimeout(() => {
                    isSyncingRef.current = false
                }, 150)
            } catch (error) {
                console.error(' Error en sync realtime:', error)
                isSyncingRef.current = false
            }
        },
        [tabId],
    )

    // ============================================
    // 🟢 3. EFECTO DE CONEXIÓN (Socket.IO)
    // ============================================
    useEffect(() => {
        const currentUserId = userInfo?.id || null
        const currentToken = token

        // Guardias de conexión
        if (!currentUserId || !isAuthenticated() || !currentToken) {
            if (socketRef.current) {
                console.log(
                    '🔌 Cerrando socket (Cierre de sesión o falta de token)',
                )
                disconnectSocket()
                setConnected(false)
                socketRef.current = null
            }
            return
        }

        // Si ya está conectado con los mismos datos, no re-inicializar
        if (
            lastUserIdRef.current === currentUserId &&
            lastTokenRef.current === currentToken &&
            connected
        ) {
            return
        }

        lastUserIdRef.current = currentUserId
        lastTokenRef.current = currentToken

        console.log('🚀 Iniciando conexión Socket para:', currentUserId)
        const socket = initializeSocket(currentUserId, currentToken)
        socketRef.current = socket

        socket.on('connect', () => {
            console.log('🟢 Socket Conectado')
            setConnected(true)
        })

        socket.on('cart:initial', handleCartUpdate)
        socket.on('cart:updated', handleCartUpdate)

        socket.on('disconnect', (reason) => {
            console.log('🟡 Socket Desconectado:', reason)
            setConnected(false)
            if (reason === 'io server disconnect') socket.connect()
        })

        return () => {
            // Limpieza solo si cambian los datos base
            if (
                lastUserIdRef.current !== userInfo?.id ||
                lastTokenRef.current !== token
            ) {
                socket.off('cart:initial')
                socket.off('cart:updated')
                disconnectSocket()
            }
        }
    }, [userInfo?.id, token, isAuthenticated, handleCartUpdate]) // Quitamos 'connected' de dependencias

    // ============================================
    // 🟢 4. EMITIR CAMBIOS
    // ============================================
    const emitUpdate = useCallback(
        (cartData) => {
            if (!connected) return

            const updateWithMetadata = {
                ...cartData,
                timestamp: Date.now(),
                sourceTab: tabId,
                intentionalClear: cartData.products?.length === 0,
            }

            pendingUpdatesRef.current.push(updateWithMetadata)

            if (updateTimeoutRef.current) return

            updateTimeoutRef.current = setTimeout(() => {
                const latest =
                    pendingUpdatesRef.current[
                        pendingUpdatesRef.current.length - 1
                    ]
                pendingUpdatesRef.current = []

                if (isEmittingRef.current) return
                isEmittingRef.current = true

                emitCartUpdate(latest)

                setTimeout(() => {
                    isEmittingRef.current = false
                    updateTimeoutRef.current = null
                }, 150)
            }, 50)
        },
        [connected, tabId],
    )

    return { connected, emitUpdate }
}
