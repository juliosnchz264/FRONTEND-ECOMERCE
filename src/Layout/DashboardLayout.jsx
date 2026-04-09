// src/Pages/AdminDashboard/DashboardLayout.jsx
import { Outlet, NavLink } from 'react-router'
import { useEffect, useState } from 'react'
import { useDashboardProduct } from '../Hooks/useDashboardProduct.js' // 👈 Cambiar import
import Navbar from '../Components/Navbar/Navbar'
import {
    FiGrid,
    FiFolder,
    FiLayers,
    FiMenu,
    FiX,
    FiHome,
    FiUsers,
    FiBarChart2,
    FiSettings,
    FiLogOut,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardLayout = () => {
    const { resetFilters } = useDashboardProduct() // 👈 Usar el hook correcto
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const getNavLinkClass = ({ isActive }) => {
        return `flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            isActive
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200 dark:shadow-purple-900/50'
                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
        }`
    }

    const getMobileNavLinkClass = ({ isActive }) => {
        return `flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${
            isActive
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30'
        }`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* NAVBAR SUPERIOR */}
            <Navbar />

            {/* Header con gradiente para el dashboard */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white mt-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        <div className="w-10 md:w-32"></div>

                        {/* Logo / Título centrado */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <FiGrid className="w-6 h-6" />
                            </div>
                            <h1 className="text-xl font-bold">
                                Panel de Administración
                            </h1>
                        </div>

                        {/* Botón menú móvil y espacio derecho */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                {isMobileMenuOpen ? (
                                    <FiX className="w-6 h-6" />
                                ) : (
                                    <FiMenu className="w-6 h-6" />
                                )}
                            </button>
                            <div className="hidden md:block w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navegación desktop */}
            <div className="hidden md:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-center gap-2 py-3">
                        <NavLink
                            to="/admin/dashboard/products"
                            className={getNavLinkClass}
                        >
                            <FiFolder className="w-5 h-5" />
                            <span>Productos</span>
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/categories"
                            className={getNavLinkClass}
                        >
                            <FiLayers className="w-5 h-5" />
                            <span>Categorías</span>
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/subcategories"
                            className={getNavLinkClass}
                        >
                            <FiGrid className="w-5 h-5" />
                            <span>Subcategorías</span>
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/users"
                            className={getNavLinkClass}
                        >
                            <FiUsers className="w-5 h-5" />
                            <span>Usuarios</span>
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/analytics"
                            className={getNavLinkClass}
                        >
                            <FiBarChart2 className="w-5 h-5" />
                            <span>Analíticas</span>
                        </NavLink>
                    </nav>
                </div>
            </div>

            {/* Enlace a tienda flotante */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="fixed bottom-6 right-6 z-50"
            >
                <NavLink
                    to="/"
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:shadow-purple-500/25 transition-all hover:scale-105 group"
                >
                    <FiHome className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Volver a la tienda</span>
                </NavLink>
            </motion.div>

            {/* Menú móvil (dropdown) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 200,
                            }}
                            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header del menú móvil */}
                            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                            <FiGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h2 className="font-semibold text-gray-800 dark:text-white">
                                            Menú Administrador
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Gestiona tu tienda desde aquí
                                </p>
                            </div>

                            {/* Navegación móvil */}
                            <nav className="p-3">
                                <NavLink
                                    to="/admin/dashboard/products"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={getMobileNavLinkClass}
                                >
                                    <FiFolder className="w-5 h-5" />
                                    <span>Productos</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/dashboard/categories"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={getMobileNavLinkClass}
                                >
                                    <FiLayers className="w-5 h-5" />
                                    <span>Categorías</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/dashboard/subcategories"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={getMobileNavLinkClass}
                                >
                                    <FiGrid className="w-5 h-5" />
                                    <span>Subcategorías</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/dashboard/users"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={getMobileNavLinkClass}
                                >
                                    <FiUsers className="w-5 h-5" />
                                    <span>Usuarios</span>
                                </NavLink>

                                <NavLink
                                    to="/admin/dashboard/analytics"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={getMobileNavLinkClass}
                                >
                                    <FiBarChart2 className="w-5 h-5" />
                                    <span>Analíticas</span>
                                </NavLink>

                                <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
                                    <NavLink
                                        to="/admin/dashboard/settings"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className={getMobileNavLinkClass}
                                    >
                                        <FiSettings className="w-5 h-5" />
                                        <span>Configuración</span>
                                    </NavLink>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 my-3 pt-3">
                                    <NavLink
                                        to="/"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 w-full text-left transition-colors"
                                    >
                                        <FiHome className="w-5 h-5" />
                                        <span>Volver a la tienda</span>
                                    </NavLink>
                                </div>
                            </nav>

                            {/* Footer del menú móvil */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Versión 1.0.0
                                    </span>
                                    <button className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1">
                                        <FiLogOut className="w-3 h-3" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contenido principal */}
            <div className="container mx-auto p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout