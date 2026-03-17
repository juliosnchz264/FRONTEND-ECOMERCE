// /src/components/Cart/ModalCart.jsx - VERSIÓN DEFINITIVA
import { CgTrash } from 'react-icons/cg'
import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa'
import { useCart } from '../../Hooks/useCart.js'
import { useUser } from '../../Hooks/useUser.js'
import { Link } from 'react-router'
import { FiX, FiAlertTriangle, FiImage } from 'react-icons/fi'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

// Componente de Confirmación interno (sin cambios)
const ConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-xl">
                            <FiAlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">
                            Vaciar carrito
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-gray-600 text-center text-lg">
                        ¿Estás seguro de que quieres eliminar todos los
                        productos del carrito?
                    </p>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        Esta acción no se puede deshacer
                    </p>
                </div>

                <div className="flex gap-3 p-5 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-100 transition-all font-medium border border-gray-200 disabled:opacity-50"
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
    
    // 🟢 ESTADOS PARA CONTROL DE CARGA DEL MODAL
    const [modalState, setModalState] = useState({
        isInitialized: false,
        isLoading: false,
        hasError: false
    })
    
    // 🟢 REFERENCIAS PARA COMPARACIONES
    const cartRef = useRef(cart)
    const openCountRef = useRef(0)
    const abortControllerRef = useRef(null)

    // 🟢 MEMOIZAR EL ESTADO DE CARGA COMBINADO
    const isLoading = useMemo(() => {
        return globalLoading || modalState.isLoading
    }, [globalLoading, modalState.isLoading])

    // 🟢 EFECTO 1: INICIALIZACIÓN DEL MODAL
    useEffect(() => {
        if (!isModalOpen) {
            // Resetear estado al cerrar
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

        // Prevenir múltiples inicializaciones
        if (modalState.isInitialized) return

        const initializeModal = async () => {
            // Cancelar operación anterior si existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            
            abortControllerRef.current = new AbortController()
            openCountRef.current += 1
            const currentOpenCount = openCountRef.current

            setModalState(prev => ({ ...prev, isLoading: true }))

            try {
                if (isAuthenticated()) {
                    console.log(`🔄 [Modal] Inicializando carga #${currentOpenCount}`)
                    await loadCart()
                }

                // Solo actualizar si es la apertura más reciente
                if (currentOpenCount === openCountRef.current) {
                    setModalState({
                        isInitialized: true,
                        isLoading: false,
                        hasError: false
                    })
                }
            } catch (error) {
                console.error('❌ [Modal] Error en inicialización:', error)
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

    // 🟢 EFECTO 2: ACTUALIZACIÓN CUANDO CAMBIA EL CARRITO
    useEffect(() => {
        if (!isModalOpen) return

        // Detectar cambios reales en el carrito
        if (JSON.stringify(cartRef.current) !== JSON.stringify(cart)) {
            console.log('📦 [Modal] Carrito actualizado:', {
                anterior: cartRef.current.length,
                nuevo: cart.length
            })
            cartRef.current = cart
        }
    }, [cart, isModalOpen])

    // 🟢 FUNCIÓN SEGURA PARA ACTUALIZAR CANTIDAD
    const handleUpdateQuantity = useCallback(async (item, newQuantity) => {
        // Validaciones rápidas
        if (isLoading || localLoading[item._id]) return
        if (newQuantity < 1 || newQuantity > item.stock) return

        // Optimistic update local
        setLocalLoading(prev => ({ ...prev, [item._id]: true }))
        
        const previousQuantity = item.quantity
        
        try {
            await updateQuantity(item._id, newQuantity)
        } catch (error) {
            console.error('Error en update:', error)
            // Revertir optimistic update en caso de error
            setLocalLoading(prev => ({ ...prev, [item._id]: false }))
        } finally {
            setLocalLoading(prev => ({ ...prev, [item._id]: false }))
        }
    }, [isLoading, localLoading, updateQuantity])

    // 🟢 FUNCIÓN SEGURA PARA ELIMINAR
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

    // 🟢 FUNCIÓN SEGURA PARA VACIAR CARRITO
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

    // 🟢 DETERMINAR ESTADO DEL MODAL
    const modalContentState = useMemo(() => {
        // Prioridades claras de visualización
        if (!modalState.isInitialized && isLoading) {
            return 'LOADING_INITIAL'
        }
        if (modalState.hasError) {
            return 'ERROR'
        }
        if (cart.length === 0 && modalState.isInitialized) {
            return 'EMPTY'
        }
        if (cart.length > 0) {
            return 'CART'
        }
        return 'LOADING' // Fallback
    }, [cart.length, modalState.isInitialized, modalState.hasError, isLoading])

    // No renderizar nada si el modal está cerrado
    if (!isModalOpen) return null

    return (
        <>
            <div className="modal modal-open inset-0 overflow-hidden z-50">
                <section className="modal-box max-w-3xl bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-2xl border border-purple-100 overflow-y-auto max-h-[90vh]">
                    {/* Header - Siempre visible */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <FaShoppingBag className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-xl text-gray-800">
                                Carrito de compras
                                {isAuthenticated() && cart.length > 0 && (
                                    <span className="ml-2 text-sm font-normal text-purple-600">
                                        (Sincronizado)
                                    </span>
                                )}
                            </h3>
                        </div>
                        <button
                            onClick={closeModal}
                            className="btn btn-sm btn-circle btn-ghost hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {/* 🟢 RENDERIZADO BASADO EN EL ESTADO */}
                    {modalContentState === 'LOADING_INITIAL' && (
                        <div className="text-center py-12">
                            <span className="loading loading-spinner text-purple-600 loading-lg"></span>
                            <p className="text-gray-500 mt-3">
                                Cargando tu carrito...
                            </p>
                        </div>
                    )}

                    {modalContentState === 'ERROR' && (
                        <div className="text-center py-12">
                            <div className="text-red-500 text-7xl mb-4">⚠️</div>
                            <p className="text-gray-600 text-lg mb-2">
                                Error al cargar el carrito
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                Por favor, intenta de nuevo
                            </p>
                            <button
                                onClick={() => {
                                    setModalState(prev => ({ ...prev, isInitialized: false }))
                                }}
                                className="btn btn-primary bg-gradient-to-r from-purple-600 to-purple-700 border-0"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {modalContentState === 'EMPTY' && (
                        <div className="text-center py-12">
                            <div className="text-gray-300 text-7xl mb-4">
                                🛒
                            </div>
                            <p className="text-gray-500 text-lg">
                                Tu carrito está vacío
                            </p>
                            <button
                                onClick={closeModal}
                                className="btn btn-primary mt-4 bg-gradient-to-r from-purple-600 to-purple-700 border-0"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    )}

                    {modalContentState === 'CART' && (
                        <>
                            <div className="space-y-4 pr-2 custom-scrollbar">
                                {cart.map((item) => {
                                    const isItemLoading = localLoading[item._id]
                                    
                                    return (
                                        <div
                                            key={item._id}
                                            className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-purple-50 hover:shadow-md transition-shadow"
                                        >
                                            {/* Imagen */}
                                            <div className="w-20 h-20 flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <img
                                                        className="w-full h-full object-cover rounded-xl"
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            e.target.onerror = null
                                                            e.target.style.display = 'none'
                                                            e.target.parentElement.innerHTML = `
                                                                <div class="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                                                                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            `
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                                                        <FiImage className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Información del producto */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-sm text-purple-600 font-medium">
                                                            ${item.price} c/u
                                                            {item.stock <= 5 && (
                                                                <span className="ml-2 text-xs text-orange-500">
                                                                    ¡Solo {item.stock} disponibles!
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-lg text-purple-700">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>

                                                {/* Controles de cantidad */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center rounded-lg border border-gray-200">
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                                                disabled={isLoading || isItemLoading || item.quantity <= 1}
                                                                className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                                aria-label="Disminuir cantidad"
                                                            >
                                                                {isItemLoading ? (
                                                                    <span className="loading loading-spinner loading-xs"></span>
                                                                ) : (
                                                                    <FaMinus size={12} />
                                                                )}
                                                            </button>
                                                            <span className="w-10 text-center font-medium">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                                                disabled={isLoading || isItemLoading || item.quantity >= item.stock}
                                                                className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                                aria-label="Aumentar cantidad"
                                                            >
                                                                {isItemLoading ? (
                                                                    <span className="loading loading-spinner loading-xs"></span>
                                                                ) : (
                                                                    <FaPlus size={12} />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Botón eliminar */}
                                                    <button
                                                        onClick={() => handleRemoveItem(item._id)}
                                                        disabled={isLoading || isItemLoading}
                                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                                                        title="Eliminar producto"
                                                        aria-label="Eliminar producto"
                                                    >
                                                        {isItemLoading ? (
                                                            <span className="loading loading-spinner loading-xs"></span>
                                                        ) : (
                                                            <CgTrash size={19} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Resumen del carrito */}
                            <div className="border-t border-purple-100 pt-4 mt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">
                                        Total de artículos:
                                    </span>
                                    <span className="font-semibold bg-purple-100 px-3 py-1 rounded-full text-purple-700">
                                        {itemsQuantity}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span className="text-gray-800">
                                        Total:
                                    </span>
                                    <span className="text-purple-700">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="modal-action mt-6 gap-3 flex flex-col lg:flex-row">
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    disabled={isLoading}
                                    className="btn btn-outline btn-error flex-1 disabled:opacity-50"
                                >
                                    Vaciar carrito
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-ghost flex-1 border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Seguir comprando
                                </button>
                                <Link
                                    className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 flex-1 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50"
                                    to="/checkout"
                                    onClick={closeModal}
                                    aria-disabled={isLoading}
                                >
                                    Proceder al pago
                                </Link>
                            </div>
                        </>
                    )}
                </section>
                <div className="modal-backdrop" onClick={closeModal}></div>
            </div>

            {/* Modal de confirmación para vaciar carrito */}
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