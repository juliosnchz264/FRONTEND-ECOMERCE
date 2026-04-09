// src/Components/Navbar/Navbar.jsx
import { Link } from 'react-router'
import ThemeToggle from '../ui/ThemeToggle'
import AuthButtons from './AuthButtons'
import Cart from './Cart'
import UserDropDown from './UserDropDown'
import ModalWishlist from './ModalWishlist'
import { useUser } from '../../Hooks/useUser.js'
import { useWishlist } from '../../Hooks/useWishlist.js'
import {
    FiUserPlus,
    FiLogIn,
    FiUser,
    FiShoppingBag,
    FiHome,
    FiGrid,
    FiMenu,
    FiX,
    FiHeart,
    FiPackage,
    FiSettings,
    FiLogOut,
} from 'react-icons/fi'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const Navbar = () => {
    const { loading, userInfo, isAuthenticated, logout } = useUser()
    const { totalWishlistItems, openModal: openWishlistModal } = useWishlist()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleHomeClick = (e) => {
        e.preventDefault()
        if (window.resetHomeFilters) {
            window.resetHomeFilters()
        }
        window.location.href = '/'
    }

    const handleLogout = async () => {
        try {
            await logout()
            toast.success('Sesión cerrada correctamente')
            setIsMobileMenuOpen(false)
            window.location.href = '/'
        } catch (error) {
            console.error('Error al cerrar sesión', error)
            toast.error('Error al cerrar sesión')
        }
    }

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md dark:shadow-gray-900/30'
                        : 'bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/30'
                }`}
            >
                <nav className="navbar w-full">
                    <div className="w-full px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between w-full h-16">
                            {/* Logo - Siempre a la izquierda */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={handleHomeClick}
                                    className="flex items-center gap-2 sm:gap-3 group"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/50 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"></div>
                                        <FiShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 relative group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent hidden xs:inline">
                                        E-comerce
                                    </span>
                                    <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent xs:hidden">
                                        EC
                                    </span>
                                </button>
                            </div>

                            {/* Navegación central - Desktop */}
                            <div className="hidden md:flex items-center gap-1 lg:gap-2">
                                <button
                                    onClick={handleHomeClick}
                                    className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all font-medium text-sm lg:text-base"
                                >
                                    <FiHome className="w-4 h-4 lg:w-5 lg:h-5" />
                                    <span>Inicio</span>
                                </button>

                                {userInfo?.isAdmin && (
                                    <Link
                                        to="/admin/dashboard/products"
                                        className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all font-medium text-sm lg:text-base"
                                    >
                                        <FiGrid className="w-4 h-4 lg:w-5 lg:h-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                )}
                            </div>

                            {/* Acciones de usuario */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                {/* Wishlist Button */}
                                <button
                                    onClick={openWishlistModal}
                                    className="relative p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all group"
                                    aria-label="Favoritos"
                                >
                                    <FiHeart className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                    {totalWishlistItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {totalWishlistItems > 9 ? '9+' : totalWishlistItems}
                                        </span>
                                    )}
                                </button>

                                <Cart />

                                {/* ThemeToggle - SOLO EN DESKTOP */}
                                <div className="hidden md:block">
                                    <ThemeToggle />
                                </div>

                                {!loading && isAuthenticated() ? (
                                    <UserDropDown />
                                ) : (
                                    <div className="hidden md:flex">
                                        <AuthButtons variant="navbar" />
                                    </div>
                                )}

                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                    aria-label="Menú"
                                >
                                    {isMobileMenuOpen ? (
                                        <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu - Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div
                        className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl mx-4 overflow-hidden border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 space-y-2">
                            {/* Navegación principal */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        handleHomeClick({ preventDefault: () => {} })
                                        setIsMobileMenuOpen(false)
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                >
                                    <FiHome className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Inicio</span>
                                </button>

                                {userInfo?.isAdmin && (
                                    <Link
                                        to="/admin/dashboard/products"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                    >
                                        <FiGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Dashboard</span>
                                    </Link>
                                )}
                            </div>

                            {/* Separador */}
                            <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                            {/* Sección de usuario (solo si está autenticado) */}
                            {!loading && isAuthenticated() && (
                                <>
                                    <div className="space-y-1">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <FiUser className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Mi Perfil</span>
                                        </Link>
                                        
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <FiPackage className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Mis Pedidos</span>
                                        </Link>
                                        
                                        <Link
                                            to="/profile/settings"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <FiSettings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Configuración</span>
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                        >
                                            <FiLogOut className="w-5 h-5" />
                                            <span className="font-medium">Cerrar sesión</span>
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>
                                </>
                            )}

                            {/* Sección de autenticación (si no está autenticado) */}
                            {!loading && !isAuthenticated() && (
                                <div className="space-y-1">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                    >
                                        <FiLogIn className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Iniciar sesión</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                    >
                                        <FiUserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Registrarse</span>
                                    </Link>
                                </div>
                            )}

                            {/* Modo oscuro - SOLO EN EL DROPDOWN MÓVIL */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-2 md:hidden">
                                <div className="flex items-center justify-between px-4 py-3">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">Modo oscuro</span>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Wishlist */}
            <ModalWishlist />
        </>
    )
}

export default Navbar