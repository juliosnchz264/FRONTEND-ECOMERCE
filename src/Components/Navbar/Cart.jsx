// src/Components/Navbar/Cart.jsx
import { useState, useRef, useEffect } from 'react'
import ModalCart from './ModalCart'
import { useCart } from '../../Hooks/useCart.js'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiChevronRight, FiShoppingBag } from 'react-icons/fi'
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
                        <FiShoppingCart className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                        <AnimatePresence>
                            {itemsQuantity > 0 && (
                                <motion.span
                                    key="cart-badge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute -top-2 -right-2 flex h-5 min-w-[1.25rem]"
                                >
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-60" />
                                    <span className="relative inline-flex rounded-full h-5 min-w-[1.25rem] bg-gradient-to-r from-purple-600 to-violet-600 text-white text-[10px] font-bold items-center justify-center px-1">
                                        {itemsQuantity > 99 ? '99+' : itemsQuantity}
                                    </span>
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                </button>

                {/* Dropdown del carrito */}
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -8 }}
                            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                            style={{ transformOrigin: 'top right' }}
                            className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/60 border border-gray-100 dark:border-gray-700 overflow-hidden z-[1000]"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-4 py-3 flex items-center gap-2">
                                <BsCartCheck className="w-4.5 h-4.5" />
                                <span className="font-semibold text-sm">Tu Carrito</span>
                                {itemsQuantity > 0 && (
                                    <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {itemsQuantity} {itemsQuantity === 1 ? 'artículo' : 'artículos'}
                                    </span>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="p-4">
                                {itemsQuantity === 0 ? (
                                    <div className="text-center py-6">
                                        <FiShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Tu carrito está vacío</p>
                                        <p className="text-gray-400 dark:text-gray-600 text-xs mt-1">¡Añade productos para empezar!</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Subtotal</span>
                                                <span className="font-bold text-lg text-purple-700 dark:text-purple-400">
                                                    ${total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleViewCartClick}
                                            className="mt-4 w-full py-2.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 active:scale-[0.98] transition-all duration-200 group flex items-center justify-center gap-2 font-medium text-sm shadow-sm shadow-purple-200 dark:shadow-purple-900/30"
                                        >
                                            <span>Ver carrito completo</span>
                                            <FiChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Footer decorativo */}
                            <div className="h-0.5 bg-gradient-to-r from-purple-300 via-violet-400 to-purple-300 dark:from-purple-700 dark:via-violet-600 dark:to-purple-700" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {isModalOpen && <ModalCart />}
        </>
    )
}

export default Cart