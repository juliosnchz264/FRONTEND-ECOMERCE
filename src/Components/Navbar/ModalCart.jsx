// src/Components/Cart/ModalCart.jsx
import { CgTrash } from 'react-icons/cg'
import { FaMinus, FaPlus, FaShoppingBag, FaTruck, FaShieldAlt, FaCreditCard } from 'react-icons/fa'
import { useCart } from '../../Hooks/useCart.js'
import { useUser } from '../../Hooks/useUser.js'
import { Link } from 'react-router'
import { FiX, FiAlertTriangle, FiImage, FiChevronRight, FiGift } from 'react-icons/fi'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Portal from '../ui/Portal'
import { PLACEHOLDER_IMAGE } from '../../utils/imageUtils'

// Componente de Confirmación Mejorado con modo oscuro
const ConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null

    return (
        <Portal>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <div
                    className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 max-w-md w-full transform transition-all animate-fadeIn z-[201] border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <FiAlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Vaciar carrito
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6">
                        <p className="text-gray-600 dark:text-gray-300 text-center text-lg">
                            ¿Estás seguro de que quieres eliminar todos los
                            productos del carrito?
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                            Esta acción no se puede deshacer
                        </p>
                    </div>

                    <div className="flex gap-3 p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 rounded-b-2xl">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all font-medium border border-gray-200 dark:border-gray-600 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Vaciando...
                                </>
                            ) : (
                                'Vaciar carrito'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Portal>
    )
}

// Componente de Item del Carrito Mejorado con modo oscuro
const CartItem = ({ item, isLoading, localLoading, onUpdateQuantity, onRemove }) => {
    const isItemLoading = localLoading[item._id]
    const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0

    return (
        <div className="group flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg dark:hover:shadow-gray-950/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-100 dark:hover:border-purple-800">
            {/* Imagen */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-700 dark:to-purple-900/30">
                {item.imageUrl ? (
                    <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        src={item.imageUrl}
                        alt={item.name}
                        loading="lazy"
                        onError={(e) => {
                            e.target.onerror = null
                            e.target.src = PLACEHOLDER_IMAGE
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiImage className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                    </div>
                )}
                
                {discount > 0 && (
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                        -{discount}%
                    </div>
                )}
            </div>

            {/* Información del producto */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-1">
                            {item.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                ${item.price}
                            </span>
                            {item.originalPrice && (
                                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                    ${item.originalPrice}
                                </span>
                            )}
                            <span className="text-xs text-gray-400 dark:text-gray-500">c/u</span>
                        </div>
                    </div>
                    <span className="font-bold text-xl text-purple-700 dark:text-purple-400 whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>
                </div>

                {/* Stock warning */}
                {item.stock <= 5 && (
                    <div className="mb-2">
                        <span className="text-xs text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                            ¡Solo {item.stock} disponibles!
                        </span>
                    </div>
                )}

                {/* Controles de cantidad */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                            <button
                                onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                                disabled={isLoading || isItemLoading || item.quantity <= 1}
                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors rounded-l-lg text-gray-700 dark:text-gray-300"
                                aria-label="Disminuir cantidad"
                            >
                                {isItemLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaMinus className="w-3 h-3" />
                                )}
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-700 dark:text-gray-300">
                                {item.quantity}
                            </span>
                            <button
                                onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                                disabled={isLoading || isItemLoading || item.quantity >= item.stock}
                                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors rounded-r-lg text-gray-700 dark:text-gray-300"
                                aria-label="Aumentar cantidad"
                            >
                                {isItemLoading ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <FaPlus className="w-3 h-3" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => onRemove(item._id)}
                        disabled={isLoading || isItemLoading}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all disabled:opacity-50 group"
                        title="Eliminar producto"
                    >
                        {isItemLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                            <CgTrash className="w-5 h-5 transition-transform group-hover:scale-110" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

const ModalCart = () => {
    const {
        cart,
        closeModal,
        isModalOpen,
        itemsQuantity,
        total,
        updateQuantity,
        removeFromCart,
        clearCart,
        loading: globalLoading,
        loadCart
    } = useCart()
    
    const { isAuthenticated } = useUser()
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [localLoading, setLocalLoading] = useState({})
    
    const [modalState, setModalState] = useState({
        isInitialized: false,
        isLoading: false,
        hasError: false
    })
    
    const cartRef = useRef(cart)
    const openCountRef = useRef(0)
    const abortControllerRef = useRef(null)

    const isLoading = useMemo(() => {
        return globalLoading || modalState.isLoading
    }, [globalLoading, modalState.isLoading])

    const freeShippingThreshold = 500
    const remainingForFreeShipping = freeShippingThreshold - total
    const isFreeShipping = total >= freeShippingThreshold

    useEffect(() => {
        if (!isModalOpen) {
            setModalState({
                isInitialized: false,
                isLoading: false,
                hasError: false
            })
            setLocalLoading({})
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            return
        }

        if (modalState.isInitialized) return

        const initializeModal = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            
            abortControllerRef.current = new AbortController()
            openCountRef.current += 1
            const currentOpenCount = openCountRef.current

            setModalState(prev => ({ ...prev, isLoading: true }))

            try {
                if (isAuthenticated()) {
                    await loadCart()
                }

                if (currentOpenCount === openCountRef.current) {
                    setModalState({
                        isInitialized: true,
                        isLoading: false,
                        hasError: false
                    })
                }
            } catch (error) {
                console.error('Error en inicialización:', error)
                if (currentOpenCount === openCountRef.current) {
                    setModalState({
                        isInitialized: true,
                        isLoading: false,
                        hasError: true
                    })
                }
            }
        }

        initializeModal()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [isModalOpen, isAuthenticated, loadCart, modalState.isInitialized])

    useEffect(() => {
        if (!isModalOpen) return
        if (JSON.stringify(cartRef.current) !== JSON.stringify(cart)) {
            cartRef.current = cart
        }
    }, [cart, isModalOpen])

    const handleUpdateQuantity = useCallback(async (item, newQuantity) => {
        if (isLoading || localLoading[item._id]) return
        if (newQuantity < 1 || newQuantity > item.stock) return

        setLocalLoading(prev => ({ ...prev, [item._id]: true }))
        
        try {
            await updateQuantity(item._id, newQuantity)
        } catch (error) {
            console.error('Error en update:', error)
        } finally {
            setLocalLoading(prev => ({ ...prev, [item._id]: false }))
        }
    }, [isLoading, localLoading, updateQuantity])

    const handleRemoveItem = useCallback(async (productId) => {
        if (isLoading || localLoading[productId]) return

        setLocalLoading(prev => ({ ...prev, [productId]: true }))
        
        try {
            await removeFromCart(productId)
        } catch (error) {
            console.error('Error en remove:', error)
        } finally {
            setLocalLoading(prev => ({ ...prev, [productId]: false }))
        }
    }, [isLoading, localLoading, removeFromCart])

    const handleClearCart = useCallback(async () => {
        setShowConfirmModal(false)
        if (isLoading) return
        
        try {
            await clearCart()
            closeModal()
        } catch (error) {
            console.error('Error en clear:', error)
        }
    }, [isLoading, clearCart, closeModal])

    const modalContentState = useMemo(() => {
        if (!modalState.isInitialized && isLoading) return 'LOADING_INITIAL'
        if (modalState.hasError) return 'ERROR'
        if (cart.length === 0 && modalState.isInitialized) return 'EMPTY'
        if (cart.length > 0) return 'CART'
        return 'LOADING'
    }, [cart.length, modalState.isInitialized, modalState.hasError, isLoading])

    if (!isModalOpen) return null

    return (
        <>
            <Portal>
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
                            onClick={closeModal}
                        ></div>

                        {/* Modal Content */}
                        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn border border-gray-200 dark:border-gray-700">
                            {/* Header */}
                            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                                        <FaShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-gray-800 dark:text-white">
                                            Tu Carrito
                                        </h3>
                                        {isAuthenticated() && cart.length > 0 && (
                                            <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                                ✓ Sincronizado con tu cuenta
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-sm btn-circle btn-ghost hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {modalContentState === 'LOADING_INITIAL' && (
                                    <div className="text-center py-16">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
                                            </div>
                                            <div className="opacity-0">
                                                <FaShoppingBag className="w-16 h-16 text-purple-200 dark:text-purple-800 mx-auto" />
                                            </div>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 mt-4 font-medium">
                                            Cargando tu carrito...
                                        </p>
                                    </div>
                                )}

                                {modalContentState === 'ERROR' && (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FiAlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 text-lg font-medium mb-2">
                                            Error al cargar el carrito
                                        </p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                                            Por favor, intenta de nuevo
                                        </p>
                                        <button
                                            onClick={() => {
                                                setModalState(prev => ({ ...prev, isInitialized: false }))
                                            }}
                                            className="btn btn-primary bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 px-6"
                                        >
                                            Reintentar
                                        </button>
                                    </div>
                                )}

                                {modalContentState === 'EMPTY' && (
                                    <div className="text-center py-16">
                                        <div className="relative mb-6">
                                            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-purple-50 dark:from-gray-700 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                                                <FaShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            </div>
                                        </div>
                                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                                            Tu carrito está vacío
                                        </p>
                                        <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                                            ¡Agrega productos para comenzar a comprar!
                                        </p>
                                        <button
                                            onClick={closeModal}
                                            className="btn btn-primary bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 px-6"
                                        >
                                            Seguir comprando
                                        </button>
                                    </div>
                                )}

                                {modalContentState === 'CART' && (
                                    <div className="space-y-4">
                                        {cart.map((item) => (
                                            <CartItem
                                                key={item._id}
                                                item={item}
                                                isLoading={isLoading}
                                                localLoading={localLoading}
                                                onUpdateQuantity={handleUpdateQuantity}
                                                onRemove={handleRemoveItem}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {modalContentState === 'CART' && (
                                <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-6">
                                    <div className="mb-4 space-y-2">
                                        {!isFreeShipping && remainingForFreeShipping > 0 && (
                                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-xl p-3 border border-orange-100 dark:border-orange-800">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaTruck className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                                                    <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                                                        ¡Agrega ${remainingForFreeShipping.toFixed(2)} más para envío gratis!
                                                    </span>
                                                </div>
                                                <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        {isFreeShipping && (
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                                                <div className="flex items-center gap-2">
                                                    <FaTruck className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                        ¡Envío gratis incluido! 🎉
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Subtotal ({itemsQuantity} artículos)</span>
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">${total.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500 dark:text-gray-400">Envío</span>
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    {isFreeShipping ? 'Gratis' : 'Por calcular'}
                                                </span>
                                            </div>
                                            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-bold text-gray-800 dark:text-white">Total</span>
                                                    <span className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                                        ${total.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setShowConfirmModal(true)}
                                            disabled={isLoading}
                                            className="btn btn-outline btn-error hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-400 dark:hover:border-red-600 disabled:opacity-50 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
                                        >
                                            Vaciar
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="btn btn-ghost border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300"
                                            disabled={isLoading}
                                        >
                                            Seguir comprando
                                        </button>
                                        <Link
                                            className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 group"
                                            to="/checkout"
                                            onClick={closeModal}
                                            aria-disabled={isLoading}
                                        >
                                            <span>Proceder al pago</span>
                                            <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>

                                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                            <FaShieldAlt className="w-3 h-3" />
                                            <span>Compra Segura</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                            <FaCreditCard className="w-3 h-3" />
                                            <span>Pago 100% Seguro</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                            <FiGift className="w-3 h-3" />
                                            <span>Ofertas Exclusivas</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Portal>

            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleClearCart}
                loading={isLoading}
            />
        </>
    )
}

export default ModalCart