import { CgTrash } from 'react-icons/cg'
import { FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa'
import { useCart } from '../../Hooks/useCart.js'
import { Link } from 'react-router'
import { FiX, FiAlertTriangle } from 'react-icons/fi'
import { useState } from 'react'

// Componente de Confirmación interno
const ConfirmModal = ({ isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Overlay con blur */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
                {/* Header */}
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

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 text-center text-lg">
                        ¿Estás seguro de que quieres eliminar todos los productos del carrito?
                    </p>
                    <p className="text-gray-400 text-sm text-center mt-2">
                        Esta acción no se puede deshacer
                    </p>
                </div>

                {/* Footer */}
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
        loading,
    } = useCart()
    
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    if (!isModalOpen) return null

    const handleClearCart = async () => {
        await clearCart()
        setShowConfirmModal(false)
    }

    return (
        <>
            <div className="modal modal-open inset-0 overflow-hidden z-50">
                <section className="modal-box max-w-3xl bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-2xl border border-purple-100">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <FaShoppingBag className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-xl text-gray-800">
                                Carrito de compras
                            </h3>
                        </div>
                        <button
                            onClick={closeModal}
                            className="btn btn-sm btn-circle btn-ghost hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <span className="loading loading-spinner text-purple-600 loading-lg"></span>
                            <p className="text-gray-500 mt-3">Actualizando carrito...</p>
                        </div>
                    ) : cart.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-300 text-7xl mb-4">🛒</div>
                            <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                            <button
                                onClick={closeModal}
                                className="btn btn-primary mt-4 bg-gradient-to-r from-purple-600 to-purple-700 border-0"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm border border-purple-50 hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            className="w-20 h-20 object-cover rounded-xl"
                                            src={item.imageUrl}
                                            alt={item.name}
                                        />
                                        
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-sm text-purple-600 font-medium">
                                                        ${item.price} c/u
                                                    </p>
                                                </div>
                                                <span className="font-bold text-lg text-purple-700">
                                                    ${item.price * item.quantity}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center rounded-lg border border-gray-200">
                                                        <button
                                                            onClick={async () => {
                                                                if (item.quantity > 1) {
                                                                    await updateQuantity(
                                                                        item._id,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                            }}
                                                            disabled={loading || item.quantity <= 1}
                                                            className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                        >
                                                            <FaMinus size={12} />
                                                        </button>
                                                        <span className="w-10 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={async () => {
                                                                await updateQuantity(
                                                                    item._id,
                                                                    item.quantity + 1
                                                                )
                                                            }}
                                                            disabled={loading || item.quantity >= (item.stock || 999)}
                                                            className="p-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                        >
                                                            <FaPlus size={12} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={async () => {
                                                        await removeFromCart(item._id)
                                                    }}
                                                    disabled={loading}
                                                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar"
                                                >
                                                    <CgTrash size={19} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Resumen */}
                            <div className="border-t border-purple-100 pt-4 mt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Total de artículos:</span>
                                    <span className="font-semibold bg-purple-100 px-3 py-1 rounded-full text-purple-700">
                                        {itemsQuantity}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-2xl font-bold">
                                    <span className="text-gray-800">Total:</span>
                                    <span className="text-purple-700">${total}</span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="modal-action mt-6 gap-3 flex flex-col lg:flex-row">
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    disabled={loading}
                                    className="btn btn-outline btn-error flex-1"
                                >
                                    Vaciar carrito
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="btn btn-ghost flex-1 border border-gray-200 hover:bg-gray-50"
                                >
                                    Seguir comprando
                                </button>
                                <Link
                                    className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 flex-1 hover:from-purple-700 hover:to-purple-800"
                                    to="/checkout"
                                    onClick={closeModal}
                                >
                                    Proceder al pago
                                </Link>
                            </div>
                        </>
                    )}
                </section>

                <div className="modal-backdrop" onClick={closeModal}></div>
            </div>

            {/* Modal de confirmación */}
            <ConfirmModal 
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleClearCart}
                loading={loading}
            />
        </>
    )
}

export default ModalCart