// src/Context/WishlistContext.jsx
import { createContext, useState, useEffect, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'
import wishlistServices from '../services/wishlistServices'
import { useUser } from '../Hooks/useUser'
import { useNavigate } from 'react-router'
import AuthToast from '../Components/ui/AuthToast'

export const WishlistContext = createContext({})

// ============================================
// 🎨 UI HELPERS
// ============================================
const showAuthToast = () => {
    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5`}
            >
                <AuthToast onClose={() => toast.dismiss(t.id)} />
            </div>
        ),
        {
            duration: 5000,
            position: 'top-center',
        },
    )
}

// ============================================
// 📦 WISHLIST PROVIDER
// ============================================
export const WishlistProvider = ({ children }) => {
    // ===== ESTADOS =====
    const [wishlist, setWishlist] = useState([])
    const [wishlistLoading, setWishlistLoading] = useState(false)
    const [wishlistError, setWishlistError] = useState(null)
    const [totalWishlistItems, setTotalWishlistItems] = useState(0)
    const [modalIsOpen, setModalIsOpen] = useState(false)

    // ===== HOOKS =====
    const { isAuthenticated, loading: userLoading } = useUser()
    const navigate = useNavigate()

    // ===== REFS =====
    const isMountedRef = useRef(true)
    const initialLoadDoneRef = useRef(false)
    const previousAuthState = useRef(null)
    const wishlistRef = useRef([])
    const isSyncingRef = useRef(false)

    // ===== Sincronizar ref con estado =====
    useEffect(() => {
        wishlistRef.current = wishlist
    }, [wishlist])

    // ===== BROADCAST CHANNEL =====
    const broadcastChannelRef = useRef(null)
    const windowIdRef = useRef(
        window.name ? parseInt(window.name) || Math.random() : Math.random(),
    )

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

    // ===== LOCALSTORAGE HELPERS =====
    const loadLocalWishlist = useCallback(() => {
        try {
            return JSON.parse(localStorage.getItem('wishlist') || '[]')
        } catch {
            return []
        }
    }, [])

    const saveLocalWishlist = useCallback((items) => {
        localStorage.setItem('wishlist', JSON.stringify(items))
        setWishlist(items)
        setTotalWishlistItems(items.length)
    }, [])

    const clearLocalWishlist = useCallback(() => {
        localStorage.removeItem('wishlist')
        setWishlist([])
        setTotalWishlistItems(0)
    }, [])

    // ===== CARGA DE WISHLIST =====
    const loadWishlist = useCallback(
        async (skipLoading = false) => {
            if (!isMountedRef.current) return
            if (!skipLoading) setWishlistLoading(true)

            try {
                if (isAuthenticated()) {
                    const result = await wishlistServices.getWishlist()
                    if (result.success) {
                        setWishlist([...result.wishlist])
                        setTotalWishlistItems(result.totalItems)
                        setWishlistError(null)
                        localStorage.removeItem('wishlist')
                        return result.wishlist
                    }
                    setWishlistError(result.error)
                    return []
                }

                const local = loadLocalWishlist()
                setWishlist(local)
                setTotalWishlistItems(local.length)
                return local
            } catch (error) {
                console.error('Error cargando wishlist:', error)
                return []
            } finally {
                if (!skipLoading) setWishlistLoading(false)
            }
        },
        [isAuthenticated, loadLocalWishlist],
    )

    // ===== SINCRO POST-LOGIN =====
    const syncWishlistAfterLogin = useCallback(async () => {
        if (isSyncingRef.current) return
        isSyncingRef.current = true
        const guestItems = loadLocalWishlist()
        setWishlistLoading(true)

        try {
            if (!guestItems.length) {
                const result = await wishlistServices.getWishlist()
                if (result.success) {
                    setWishlist([...result.wishlist])
                    setTotalWishlistItems(result.totalItems)
                }
                return
            }

            const backendResult = await wishlistServices.getWishlist()
            const backendWishlist = backendResult.success ? backendResult.wishlist : []

            const existingIds = new Set(backendWishlist.map((item) => item._id))

            for (const guestItem of guestItems) {
                if (!existingIds.has(guestItem._id)) {
                    await wishlistServices.addToWishlist(guestItem._id)
                }
            }

            const freshResult = await wishlistServices.getWishlist()
            if (freshResult.success) {
                setWishlist([...freshResult.wishlist])
                setTotalWishlistItems(freshResult.totalItems)
            } else {
                setWishlist([...backendWishlist])
                setTotalWishlistItems(backendWishlist.length)
            }

            localStorage.removeItem('wishlist')

            if (guestItems.length > 0) {
                toast.success('¡Lista de favoritos sincronizada!', { icon: '❤️' })
            }

            notifyOtherTabs('RELOAD_WISHLIST')
        } catch (error) {
            console.error('Error sincronizando wishlist:', error)
            toast.error('Error al sincronizar favoritos')
            await loadWishlist(true)
        } finally {
            setWishlistLoading(false)
            isSyncingRef.current = false
        }
    }, [loadLocalWishlist, loadWishlist, notifyOtherTabs])

    // ===== BROADCAST CHANNEL SETUP =====
    useEffect(() => {
        const channel = new BroadcastChannel('ecommerce_wishlist_sync')
        broadcastChannelRef.current = channel

        channel.onmessage = (event) => {
            const { type, payload } = event.data
            if (payload?.sourceId === windowIdRef.current) return

            if (type === 'RELOAD_WISHLIST') {
                loadWishlist(true)
            } else if (type === 'LOGOUT') {
                clearLocalWishlist()
            }
        }

        return () => {
            isMountedRef.current = false
            channel.close()
        }
    }, [loadWishlist, clearLocalWishlist])

    // ===== AUTH STATE MANAGEMENT =====
    useEffect(() => {
        if (userLoading) return

        const currentAuth = isAuthenticated()
        const previousAuth = previousAuthState.current

        const handleAuthChange = async () => {
            try {
                if (currentAuth && previousAuth === false) {
                    await syncWishlistAfterLogin()
                } else if (!currentAuth && previousAuth === true) {
                    localStorage.removeItem('wishlist')
                    setWishlist([])
                    setTotalWishlistItems(0)
                    initialLoadDoneRef.current = false
                    isSyncingRef.current = false
                    notifyOtherTabs('LOGOUT')
                } else if (!initialLoadDoneRef.current) {
                    if (currentAuth) {
                        await loadWishlist()
                    } else {
                        const local = loadLocalWishlist()
                        setWishlist(local)
                        setTotalWishlistItems(local.length)
                        setWishlistLoading(false)
                    }
                    initialLoadDoneRef.current = true
                }
            } catch (error) {
                console.error('Error en handleAuthChange:', error)
                setWishlistLoading(false)
            } finally {
                previousAuthState.current = currentAuth
            }
        }

        handleAuthChange()
    }, [
        isAuthenticated,
        userLoading,
        syncWishlistAfterLogin,
        loadWishlist,
        loadLocalWishlist,
        notifyOtherTabs,
    ])

    // ===== OPERACIONES DE WISHLIST =====
    const addToWishlist = useCallback(
        async (product) => {
            if (!isAuthenticated()) {
                showAuthToast()
                return { success: false, message: 'Debes iniciar sesión' }
            }

            try {
                const result = await wishlistServices.addToWishlist(product._id)

                if (result.success) {
                    setWishlist([...result.wishlist])
                    setTotalWishlistItems(result.wishlist.length)
                    openModal()
                    toast.success('✨ Producto agregado a favoritos', { icon: '❤️', duration: 2000 })
                    notifyOtherTabs('RELOAD_WISHLIST')
                    return { success: true }
                }

                if (result.message?.includes('ya está en favoritos')) {
                    toast('❤️ Este producto ya está en tus favoritos', { duration: 2000, icon: '❤️' })
                    await loadWishlist(true)
                } else {
                    toast.error(result.message || 'Error al agregar a favoritos')
                }
                return result
            } catch (error) {
                console.error('Error adding to wishlist:', error)
                toast.error('Error al agregar a favoritos')
                return { success: false, message: error.message }
            }
        },
        [isAuthenticated, loadWishlist, notifyOtherTabs],
    )

    const removeFromWishlist = useCallback(
        async (productId) => {
            if (!isAuthenticated()) {
                showAuthToast()
                return { success: false }
            }

            try {
                const result = await wishlistServices.removeFromWishlist(productId)

                if (result.success) {
                    setWishlist([...result.wishlist])
                    setTotalWishlistItems(result.wishlist.length)
                    toast.success('Producto eliminado de favoritos', { icon: '🗑️', duration: 2000 })
                    notifyOtherTabs('RELOAD_WISHLIST')
                    return { success: true }
                }

                toast.error(result.message || 'Error al eliminar de favoritos')
                return result
            } catch (error) {
                console.error('Error removing from wishlist:', error)
                toast.error('Error al eliminar de favoritos')
                return { success: false, message: error.message }
            }
        },
        [isAuthenticated, notifyOtherTabs],
    )

    const toggleWishlist = useCallback(
        async (product) => {
            const isInList = wishlistRef.current.some((item) => item._id === product._id)
            return isInList
                ? await removeFromWishlist(product._id)
                : await addToWishlist(product)
        },
        [addToWishlist, removeFromWishlist],
    )

    const isInWishlist = useCallback((productId) => {
        return wishlistRef.current.some((item) => item._id === productId)
    }, [])

    const clearWishlist = useCallback(async () => {
        if (!isAuthenticated()) {
            showAuthToast()
            return { success: false }
        }

        const result = await wishlistServices.clearWishlist()

        if (result.success) {
            setWishlist([])
            setTotalWishlistItems(0)
            toast.success('Lista de favoritos limpiada', { icon: '✨', duration: 2000 })
            notifyOtherTabs('RELOAD_WISHLIST')
        }

        return result
    }, [isAuthenticated, notifyOtherTabs])

    const openModal = () => setModalIsOpen(true)
    const closeModal = () => setModalIsOpen(false)

    // ===== CONTEXT VALUE =====
    const value = {
        wishlist,
        wishlistLoading,
        wishlistError,
        totalWishlistItems,
        modalIsOpen,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        loadWishlist,
        openModal,
        closeModal,
    }

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    )
}