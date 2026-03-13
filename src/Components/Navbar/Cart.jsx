import ModalCart from './ModalCart'
import { useCart } from '../../Hooks/useCart.js'
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi'
import { BsCartCheck } from 'react-icons/bs'

const Cart = () => {
    const { total, itemsQuantity, openModal, isModalOpen } = useCart()

    const handleViewCartClick = () => {
        // Cerrar el dropdown quitando el focus
        document.activeElement.blur()
        // Abrir el modal
        openModal()
    }

    return (
        <>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    {/* Botón del carrito */}
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle hover:bg-purple-50 transition-all group relative"
                    >
                        <div className="indicator">
                            {/* Icono del carrito con animación */}
                            <div className="relative">
                                <FiShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-purple-600 transition-colors" />
                                {itemsQuantity > 0 && (
                                    <div className="absolute -top-2 -right-2 flex items-center justify-center">
                                        <span className="absolute inset-0 animate-ping bg-purple-400 rounded-full opacity-75"></span>
                                        <span className="relative bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center shadow-lg">
                                            {itemsQuantity > 99 ? '99+' : itemsQuantity}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dropdown del carrito */}
                    <div
                        tabIndex={0}
                        className="card card-compact dropdown-content bg-white/95 backdrop-blur-sm z-[1000] mt-3 w-72 shadow-2xl border border-purple-100 rounded-2xl overflow-hidden"
                    >
                        {/* Header del dropdown */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3">
                            <div className="flex items-center gap-2">
                                <BsCartCheck className="w-5 h-5" />
                                <span className="font-semibold">Tu Carrito</span>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="card-body p-4">
                            {itemsQuantity === 0 ? (
                                <div className="text-center py-6">
                                    <div className="text-gray-300 text-5xl mb-3">🛒</div>
                                    <p className="text-gray-500 text-sm">Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Artículos:</span>
                                            <span className="font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                                {itemsQuantity}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-base">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-bold text-lg text-purple-700">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="divider my-2"></div>
                                    
                                    <div className="card-actions">
                                        <button
                                            onClick={handleViewCartClick}
                                            className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 w-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 group"
                                        >
                                            <span>Ver carrito completo</span>
                                            <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer decorativo */}
                        <div className="h-1 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200"></div>
                    </div>
                </div>
            </div>

            {isModalOpen && <ModalCart />}
        </>
    )
}

export default Cart