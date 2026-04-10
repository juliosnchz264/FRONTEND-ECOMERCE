// src/Components/Navbar/Navbar.jsx
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle'
import AuthButtons from './AuthButtons'
import Cart from './Cart'
import UserDropDown from './UserDropDown'
import ModalWishlist from './ModalWishlist'
import { useUser } from '../../Hooks/useUser.js'
import { useWishlist } from '../../Hooks/useWishlist.js'
import { useSearchContext } from '../../Context/SearchContext'
import SearchBar from '../SearchBar/SearchBar'
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
    FiSearch,
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const Navbar = () => {
    const { loading, userInfo, isAuthenticated, logout } = useUser()
    const { totalWishlistItems, openModal: openWishlistModal } = useWishlist()
    const { searchQuery, handleSearch, handleQueryChange } = useSearchContext()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchExpanded, setIsSearchExpanded] = useState(false)
    const searchSectionRef = useRef(null)
    const mobileSearchRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Cerrar búsqueda al hacer click fuera del área de búsqueda (solo desktop)
    useEffect(() => {
        if (!isSearchExpanded) return
        // Solo aplicar en desktop (pantallas md y superiores)
        const handleClickOutside = (e) => {
            if (window.innerWidth >= 768) {
                // md breakpoint
                if (
                    searchSectionRef.current &&
                    !searchSectionRef.current.contains(e.target)
                ) {
                    setIsSearchExpanded(false)
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [isSearchExpanded])

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen)
    }

    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false)
    }

    const handleHomeClick = (e) => {
        e.preventDefault()
        if (window.resetHomeFilters) window.resetHomeFilters()
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

    const handleSearchToggle = () => setIsSearchExpanded((prev) => !prev)

    const handleCloseSearch = () => setIsSearchExpanded(false)

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
                        <div className="flex items-center w-full h-16">
                            {/* Logo — siempre en el extremo izquierdo */}
                            <div className="flex-shrink-0">
                                <button
                                    onClick={handleHomeClick}
                                    className="flex items-center gap-2 sm:gap-3 group"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/50 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100" />
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

                            {/* Todo lo demás alineado a la derecha */}
                            <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
                                {/* Inicio + Dashboard (desktop) — se desplazan a la izquierda cuando el buscador se expande */}
                                <div className="hidden md:flex items-center gap-1">
                                    <motion.button
                                        layout
                                        onClick={handleHomeClick}
                                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all font-medium whitespace-nowrap"
                                    >
                                        <FiHome className="w-4 h-4" />
                                        <span>Inicio</span>
                                    </motion.button>

                                    {userInfo?.isAdmin && (
                                        <motion.div layout>
                                            <Link
                                                to="/admin/dashboard/products"
                                                className="flex items-center gap-1 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all font-medium whitespace-nowrap"
                                            >
                                                <FiGrid className="w-4 h-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Buscador desktop — el input se expande hacia la izquierda; la lupa NO se mueve */}
                                <div
                                    ref={searchSectionRef}
                                    className="hidden md:flex items-center"
                                >
                                    <AnimatePresence>
                                        {isSearchExpanded && (
                                            <motion.div
                                                key="search-input"
                                                initial={{
                                                    width: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    width: 500,
                                                    opacity: 1,
                                                }}
                                                exit={{ width: 0, opacity: 0 }}
                                                transition={{
                                                    duration: 0.25,
                                                    ease: [0.4, 0, 0.2, 1],
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <SearchBar
                                                    value={searchQuery}
                                                    onSearch={(q) => {
                                                        handleSearch(q)
                                                        handleCloseSearch()
                                                    }}
                                                    onQueryChange={
                                                        handleQueryChange
                                                    }
                                                    showSearchIcon={false}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Lupa — único botón toggle, posición fija */}
                                    <button
                                        onClick={handleSearchToggle}
                                        className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                                            isSearchExpanded
                                                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                                        }`}
                                        aria-label={
                                            isSearchExpanded
                                                ? 'Cerrar búsqueda'
                                                : 'Buscar'
                                        }
                                    >
                                        <FiSearch className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Lupa mobile — abre el overlay fullscreen */}
                                <button
                                    onClick={handleSearchToggle}
                                    className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                    aria-label="Buscar"
                                >
                                    <FiSearch className="w-5 h-5" />
                                </button>

                                {/* Wishlist */}
                                <button
                                    onClick={openWishlistModal}
                                    className="relative p-2 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all group"
                                    aria-label="Favoritos"
                                >
                                    <FiHeart className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                    {totalWishlistItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                                            {totalWishlistItems > 9
                                                ? '9+'
                                                : totalWishlistItems}
                                        </span>
                                    )}
                                </button>

                                {/* Carrito */}
                                <Cart />

                                {/* Theme toggle — oculto en mobile */}
                                <div className="hidden md:block">
                                    <ThemeToggle />
                                </div>

                                {/* Auth / Usuario */}
                                {!loading && isAuthenticated() ? (
                                    <UserDropDown
                                        isOpen={isUserDropdownOpen}
                                        onToggle={toggleUserDropdown}
                                        onClose={closeUserDropdown}
                                    />
                                ) : (
                                    <div className="hidden md:flex">
                                        <AuthButtons variant="navbar" />
                                    </div>
                                )}

                                {/* Hamburguesa mobile */}
                                <button
                                    onClick={() =>
                                        setIsMobileMenuOpen(!isMobileMenuOpen)
                                    }
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

            {/* Mobile Search Overlay - Prevenir cierre al hacer click dentro */}
            <AnimatePresence>
                {isSearchExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 30,
                        }}
                        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 md:hidden"
                        onClick={(e) => e.stopPropagation()} // 👈 Prevenir que el click cierre el overlay
                    >
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleSearchToggle}
                                className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Cerrar búsqueda"
                            >
                                <FiSearch className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                            </button>
                            <div
                                className="flex-1 min-w-0"
                                onClick={(e) => e.stopPropagation()} // 👈 Prevenir cierre al hacer click en el input
                            >
                                <SearchBar
                                    value={searchQuery}
                                    onSearch={(q) => {
                                        handleSearch(q)
                                        handleCloseSearch()
                                    }}
                                    onQueryChange={handleQueryChange}
                                    showSearchIcon={false}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu — Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && !isSearchExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                            className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl mx-4 overflow-hidden border border-gray-200 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-4 space-y-2">
                                {/* Navegación principal */}
                                <div className="space-y-1">
                                    <button
                                        onClick={() => {
                                            handleHomeClick({
                                                preventDefault: () => {},
                                            })
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                    >
                                        <FiHome className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Inicio
                                        </span>
                                    </button>

                                    {userInfo?.isAdmin && (
                                        <Link
                                            to="/admin/dashboard/products"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <FiGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                Dashboard
                                            </span>
                                        </Link>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-700 my-2" />

                                {/* Sección de usuario autenticado */}
                                {!loading && isAuthenticated() && (
                                    <>
                                        <div className="space-y-1">
                                            <Link
                                                to="/profile"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                            >
                                                <FiUser className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Mi Perfil
                                                </span>
                                            </Link>

                                            <Link
                                                to="/orders"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                            >
                                                <FiPackage className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Mis Pedidos
                                                </span>
                                            </Link>

                                            <Link
                                                to="/profile/settings"
                                                onClick={() =>
                                                    setIsMobileMenuOpen(false)
                                                }
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                            >
                                                <FiSettings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    Configuración
                                                </span>
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                            >
                                                <FiLogOut className="w-5 h-5" />
                                                <span className="font-medium">
                                                    Cerrar sesión
                                                </span>
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-700 my-2" />
                                    </>
                                )}

                                {/* Sección de autenticación */}
                                {!loading && !isAuthenticated() && (
                                    <div className="space-y-1">
                                        <Link
                                            to="/login"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <FiLogIn className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                Iniciar sesión
                                            </span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors"
                                        >
                                            <FiUserPlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                Registrarse
                                            </span>
                                        </Link>
                                    </div>
                                )}

                                {/* Modo oscuro */}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                                    <div className="flex items-center justify-between px-4 py-3">
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            Modo oscuro
                                        </span>
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ModalWishlist />
        </>
    )
}

export default Navbar
