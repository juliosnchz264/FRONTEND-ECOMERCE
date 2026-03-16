import { Outlet, NavLink } from 'react-router'
import { useEffect, useState } from 'react'
import { useProduct } from '../Hooks/useProduct.js'
import Navbar from '../Components/Navbar/Navbar' // 👈 IMPORTAR EL NAVBAR
import {
    FiGrid,
    FiFolder,
    FiLayers,
    FiMenu,
    FiX,
    FiHome,
    FiUsers,
} from 'react-icons/fi'

const DashboardLayout = () => {
    const { filterByCategory } = useProduct()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        filterByCategory('Todos', null)
    }, [filterByCategory])

    const getNavLinkClass = ({ isActive }) => {
        return `flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            isActive
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
        }`
    }

    const getMobileNavLinkClass = ({ isActive }) => {
        return `flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-colors ${
            isActive
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                : 'text-gray-600 hover:bg-purple-50'
        }`
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* 🚨 NAVBAR SUPERIOR (mismo que en Layout) */}
            <Navbar />

            {/* Header con gradiente para el dashboard */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white mt-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Espacio izquierdo para balance */}
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
                            {/* Botón menú móvil */}
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

                            {/* Espacio para balance en desktop */}
                            <div className="hidden md:block w-32"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navegación desktop */}
            <div className="hidden md:block bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-center gap-2 py-3">
                        <NavLink
                            to="/admin/dashboard/products"
                            onClick={() => filterByCategory('Todos', null)}
                            className={getNavLinkClass}
                        >
                            <FiFolder className="w-5 h-5" />
                            Productos
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/categories"
                            className={getNavLinkClass}
                        >
                            <FiLayers className="w-5 h-5" />
                            Categorías
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/subcategories"
                            className={getNavLinkClass}
                        >
                            <FiGrid className="w-5 h-5" />
                            Subcategorías
                        </NavLink>

                        <NavLink
                            to="/admin/dashboard/users"
                            className={getNavLinkClass}
                        >
                            <FiUsers className="w-5 h-5" />
                            Usuarios
                        </NavLink>
                    </nav>
                </div>
            </div>

            {/* Enlace a tienda flotante */}
            <NavLink
                to="/"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all hover:scale-105"
            >
                <FiHome className="w-5 h-5" />
                <span className="hidden sm:inline">Volver a la tienda</span>
            </NavLink>

            {/* Menú móvil (dropdown) */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                    <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold text-gray-800">
                                    Menú
                                </h2>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <FiX className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        <nav className="p-2">
                            <NavLink
                                to="/admin/dashboard/products"
                                onClick={() => {
                                    filterByCategory('Todos', null)
                                    setIsMobileMenuOpen(false)
                                }}
                                className={getMobileNavLinkClass}
                            >
                                <FiFolder className="w-5 h-5" />
                                Productos
                            </NavLink>

                            <NavLink
                                to="/admin/dashboard/categories"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={getMobileNavLinkClass}
                            >
                                <FiLayers className="w-5 h-5" />
                                Categorías
                            </NavLink>

                            <NavLink
                                to="/admin/dashboard/subcategories"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={getMobileNavLinkClass}
                            >
                                <FiGrid className="w-5 h-5" />
                                Subcategorías
                            </NavLink>

                            <NavLink
                                to="/admin/dashboard/users"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={getMobileNavLinkClass}
                            >
                                <FiUsers className="w-5 h-5" />
                                Usuarios
                            </NavLink>

                            <div className="border-t border-gray-200 my-2 pt-2">
                                <NavLink
                                    to="/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-purple-50 w-full text-left transition-colors"
                                >
                                    <FiHome className="w-5 h-5" />
                                    <span>Volver a la tienda</span>
                                </NavLink>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="container mx-auto p-6">
                <Outlet />
            </div>
        </div>
    )
}

export default DashboardLayout