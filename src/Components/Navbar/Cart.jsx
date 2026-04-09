// src/Components/Navbar/Cart.jsx
import { useState, useRef, useEffect } from 'react'
import ModalCart from './ModalCart'
import { useCart } from '../../Hooks/useCart.js'
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi'
import { BsCartCheck } from 'react-icons/bs'

const Cart = () => {
    const { total, itemsQuantity, openModal, isModalOpen } = useCart()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const handleViewCartClick = () => {
        setIsDropdownOpen(false)
        setTimeout(() => {
            openModal()
        }, 50)
    }

    // Cerrar dropdown cuando se abre el modal
    useEffect(() => {
        if (isModalOpen) {
            setIsDropdownOpen(false)
        }
    }, [isModalOpen])

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <>
            <div className="relative" ref={dropdownRef}> {/* 👈 AÑADIR relative aquí */}
                {/* Botón del carrito */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="relative p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all group"
                    aria-label="Carrito de compras"
                >
                    <div className="relative">
                        <FiShoppingCart className="h-6 w-6 text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                        {itemsQuantity > 0 && (
                            <>
                                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 min-w-[1.25rem] bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold items-center justify-center px-1">
                                        {itemsQuantity > 99 ? '99+' : itemsQuantity}
                                    </span>
                                </span>
                            </>
                        )}
                    </div>
                </button>

                {/* Dropdown del carrito */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl dark:shadow-gray-950/50 border border-purple-100 dark:border-gray-700 overflow-hidden z-[1000]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3">
                            <div className="flex items-center gap-2">
                                <BsCartCheck className="w-5 h-5" />
                                <span className="font-semibold">Tu Carrito</span>
                            </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-4">
                            {itemsQuantity === 0 ? (
                                <div className="text-center py-6">
                                    <div className="text-gray-300 dark:text-gray-600 text-5xl mb-3">🛒</div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">Tu carrito está vacío</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">Artículos:</span>
                                            <span className="font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full">
                                                {itemsQuantity}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-base">
                                            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                            <span className="font-bold text-lg text-purple-700 dark:text-purple-400">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="divider my-2 dark:border-gray-700"></div>
                                    
                                    <button
                                        onClick={handleViewCartClick}
                                        className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 group flex items-center justify-center gap-2 font-medium"
                                    >
                                        <span>Ver carrito completo</span>
                                        <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Footer decorativo */}
                        <div className="h-1 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 dark:from-purple-800 dark:via-purple-600 dark:to-purple-800"></div>
                    </div>
                )}
            </div>

            {isModalOpen && <ModalCart />}
        </>
    )
}

export default Cart