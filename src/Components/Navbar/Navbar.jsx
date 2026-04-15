// src/Components/Navbar/Navbar.jsx
import { Link, useLocation } from 'react-router'
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
    FiChevronRight,
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const baseServerUrl = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || ''

const Navbar = () => {
    const { loading, userInfo, isAuthenticated, logout } = useUser()
    const { totalWishlistItems, openModal: openWishlistModal } = useWishlist()
    const { searchQuery, handleSearch, handleQueryChange } = useSearchContext()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchExpanded, setIsSearchExpanded] = useState(false)
    const searchSectionRef = useRef(null)

    // Cerrar drawer al cambiar de ruta
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname])

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Bloquear scroll cuando el drawer está abierto
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isMobileMenuOpen])

    // Cerrar búsqueda desktop al click fuera
    useEffect(() => {
        if (!isSearchExpanded) return
        const handleClickOutside = (e) => {
            if (window.innerWidth >= 768 && searchSectionRef.current && !searchSectionRef.current.contains(e.target)) {
                setIsSearchExpanded(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isSearchExpanded])

    const isActivePath = (path) =>
        path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

    const toggleUserDropdown = () => setIsUserDropdownOpen((v) => !v)
    const closeUserDropdown = () => setIsUserDropdownOpen(false)

    const handleHomeClick = (e) => {
        e?.preventDefault()
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

    const getAvatarSrc = () => {
        if (userInfo?.avatar) {
            return userInfo.avatar.startsWith('http')
                ? userInfo.avatar
                : `${baseServerUrl}${userInfo.avatar}`
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.username || userInfo?.email || 'U')}&background=7c3aed&color=fff&bold=true`
    }

    const desktopNavClass = (path) =>
        `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
            isActivePath(path)
                ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30'
                : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
        }`

    const mobileNavClass = (path) =>
        `flex items-center gap-3 w-full px-3 py-3 rounded-xl font-medium transition-all ${
            isActivePath(path)
                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
        }`

    return (
        <>
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg dark:shadow-gray-900/50'
                        : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/60'
                }`}
            >
                <nav className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center w-full h-16 gap-2">

                        {/* ── Logo ── */}
                        <div className="flex-shrink-0">
                            <button onClick={handleHomeClick} className="flex items-center gap-2 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-purple-400/25 rounded-full blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <FiShoppingBag className="w-7 h-7 text-purple-600 dark:text-purple-400 relative group-hover:scale-110 transition-transform duration-200" />
                                </div>
                                <span className="hidden sm:inline text-xl font-extrabold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent tracking-tight">
                                    E-comerce
                                </span>
                            </button>
                        </div>

                        {/* ── Nav links desktop ── */}
                        <div className="hidden md:flex items-center gap-0.5 ml-4">
                            <button onClick={handleHomeClick} className={desktopNavClass('/')}>
                                <FiHome className="w-4 h-4" />
                                Inicio
                                {isActivePath('/') && (
                                    <motion.span
                                        layoutId="nav-underline"
                                        className="absolute bottom-1 left-3 right-3 h-0.5 bg-purple-500 rounded-full"
                                    />
                                )}
                            </button>

                            {userInfo?.isAdmin && (
                                <Link to="/admin/dashboard/products" className={desktopNavClass('/admin')}>
                                    <FiGrid className="w-4 h-4" />
                                    Dashboard
                                    {isActivePath('/admin') && (
                                        <motion.span
                                            layoutId="nav-underline"
                                            className="absolute bottom-1 left-3 right-3 h-0.5 bg-purple-500 rounded-full"
                                        />
                                    )}
                                </Link>
                            )}
                        </div>

                        {/* ── Sección derecha ── */}
                        <div className="flex flex-1 items-center justify-end gap-1">

                            {/* Búsqueda desktop */}
                            <div ref={searchSectionRef} className="hidden md:flex items-center">
                                <AnimatePresence>
                                    {isSearchExpanded && (
                                        <motion.div
                                            key="search-desktop"
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 480, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <SearchBar
                                                value={searchQuery}
                                                onSearch={(q) => { handleSearch(q); setIsSearchExpanded(false) }}
                                                onQueryChange={handleQueryChange}
                                                showSearchIcon={false}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={() => setIsSearchExpanded((v) => !v)}
                                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 ${
                                        isSearchExpanded
                                            ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                                    }`}
                                    aria-label={isSearchExpanded ? 'Cerrar búsqueda' : 'Buscar'}
                                >
                                    <FiSearch className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Búsqueda mobile */}
                            <button
                                onClick={() => setIsSearchExpanded((v) => !v)}
                                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                                aria-label="Buscar"
                            >
                                <FiSearch className="w-5 h-5" />
                            </button>

                            {/* Wishlist */}
                            <button
                                onClick={openWishlistModal}
                                className="relative flex items-center justify-center w-9 h-9 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all group"
                                aria-label="Favoritos"
                            >
                                <FiHeart className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                                <AnimatePresence>
                                    {totalWishlistItems > 0 && (
                                        <motion.span
                                            key="wishlist-badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] min-h-[18px] flex items-center justify-center px-1 leading-none"
                                        >
                                            {totalWishlistItems > 9 ? '9+' : totalWishlistItems}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            {/* Carrito */}
                            <Cart />

                            {/* Theme toggle desktop */}
                            <div className="hidden md:flex">
                                <ThemeToggle />
                            </div>

                            {/* Auth / Usuario desktop */}
                            {!loading && (
                                <div className="hidden md:flex">
                                    {isAuthenticated() ? (
                                        <UserDropDown
                                            isOpen={isUserDropdownOpen}
                                            onToggle={toggleUserDropdown}
                                            onClose={closeUserDropdown}
                                        />
                                    ) : (
                                        <AuthButtons variant="navbar" />
                                    )}
                                </div>
                            )}

                            {/* Hamburguesa mobile */}
                            <button
                                onClick={() => setIsMobileMenuOpen((v) => !v)}
                                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                                aria-label="Menú"
                            >
                                <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                    {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Línea de acento al hacer scroll */}
                <AnimatePresence>
                    {isScrolled && (
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            exit={{ scaleX: 0, opacity: 0 }}
                            className="h-px bg-gradient-to-r from-transparent via-purple-400/50 dark:via-purple-600/50 to-transparent"
                        />
                    )}
                </AnimatePresence>
            </header>

            {/* ── Overlay búsqueda mobile ── */}
            <AnimatePresence>
                {isSearchExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="fixed inset-0 z-50 bg-white dark:bg-gray-900 md:hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setIsSearchExpanded(false)}
                                className="flex-shrink-0 flex items-center justify-center w-9 h-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                aria-label="Cerrar búsqueda"
                            >
                                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                                <SearchBar
                                    value={searchQuery}
                                    onSearch={(q) => { handleSearch(q); setIsSearchExpanded(false) }}
                                    onQueryChange={handleQueryChange}
                                    showSearchIcon={false}
                                    autoFocus
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Drawer mobile ── */}
            <AnimatePresence>
                {isMobileMenuOpen && !isSearchExpanded && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                            className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl md:hidden flex flex-col"
                        >
                            {/* Header del drawer */}
                            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                    <FiShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    <span className="font-bold text-gray-900 dark:text-white">Menú</span>
                                </div>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center w-8 h-8 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <FiX className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Info del usuario (si está autenticado) */}
                            {!loading && isAuthenticated() && userInfo && (
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-purple-50/50 dark:bg-purple-900/10">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={getAvatarSrc()}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full ring-2 ring-purple-300 dark:ring-purple-700 object-cover flex-shrink-0"
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.username || 'U')}&background=7c3aed&color=fff`
                                            }}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                {userInfo?.username || userInfo?.email?.split('@')[0]}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {userInfo?.email}
                                            </p>
                                        </div>
                                    </div>
                                    {userInfo?.isAdmin && (
                                        <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
                                            Administrador
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Navegación */}
                            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                                {/* Sección principal */}
                                <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                                    Navegación
                                </p>
                                <button
                                    onClick={() => { handleHomeClick(); setIsMobileMenuOpen(false) }}
                                    className={mobileNavClass('/')}
                                >
                                    <FiHome className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                    <span>Inicio</span>
                                    {isActivePath('/') && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />
                                    )}
                                </button>

                                {userInfo?.isAdmin && (
                                    <Link
                                        to="/admin/dashboard/products"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={mobileNavClass('/admin')}
                                    >
                                        <FiGrid className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                        <span>Dashboard</span>
                                        {isActivePath('/admin') && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        )}
                                    </Link>
                                )}

                                {/* Sección de cuenta autenticada */}
                                {!loading && isAuthenticated() && (
                                    <>
                                        <p className="px-3 pt-3 pb-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                                            Mi cuenta
                                        </p>
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all font-medium"
                                        >
                                            <FiUser className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                            <span>Mi Perfil</span>
                                            <FiChevronRight className="ml-auto w-3.5 h-3.5 text-gray-400" />
                                        </Link>
                                        <Link
                                            to="/orders"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all font-medium"
                                        >
                                            <FiPackage className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                            <span>Mis Pedidos</span>
                                            <FiChevronRight className="ml-auto w-3.5 h-3.5 text-gray-400" />
                                        </Link>
                                        <Link
                                            to="/profile/settings"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all font-medium"
                                        >
                                            <FiSettings className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                            <span>Configuración</span>
                                            <FiChevronRight className="ml-auto w-3.5 h-3.5 text-gray-400" />
                                        </Link>
                                    </>
                                )}

                                {/* Sección de autenticación (no logueado) */}
                                {!loading && !isAuthenticated() && (
                                    <>
                                        <p className="px-3 pt-3 pb-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                                            Acceso
                                        </p>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all font-medium"
                                        >
                                            <FiLogIn className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                            <span>Iniciar sesión</span>
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all font-medium"
                                        >
                                            <FiUserPlus className="w-4 h-4 flex-shrink-0 text-purple-500" />
                                            <span>Registrarse</span>
                                        </Link>
                                    </>
                                )}
                            </nav>

                            {/* Footer del drawer */}
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Modo oscuro
                                    </span>
                                    <ThemeToggle />
                                </div>
                                {!loading && isAuthenticated() && (
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium"
                                    >
                                        <FiLogOut className="w-4 h-4" />
                                        Cerrar sesión
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ModalWishlist />
        </>
    )
}

export default Navbar
