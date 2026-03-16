import { Link } from 'react-router'
import AuthButtons from './AuthButtons'
import Cart from './Cart'
import UserDropDown from './UserDropDown'
import { useUser } from '../../Hooks/useUser.js'
import { FiShoppingBag, FiHome, FiGrid, FiMenu } from 'react-icons/fi'
import { useState } from 'react'

const Navbar = () => {
    const { loading, userInfo, isAuthenticated } = useUser()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)


    const handleHomeClick = (e) => {
        e.preventDefault()
        
        // Llamamos a la función global de reseteo si existe
        if (window.resetHomeFilters) {
            window.resetHomeFilters()
        }
        
        // Navegamos a home
        window.location.href = '/'
    }

    return (
        <header>
            {!loading && !isAuthenticated() && <AuthButtons />}

            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo / Home con animación */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleHomeClick}
                                className="flex items-center gap-3 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-purple-100 rounded-full blur-md group-hover:blur-lg transition-all opacity-0 group-hover:opacity-100"></div>
                                    <FiShoppingBag className="w-8 h-8 text-purple-600 relative group-hover:scale-110 transition-transform" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent hidden sm:inline">
                                    E-comerce
                                </span>
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent sm:hidden">
                                    EC
                                </span>
                            </button>
                        </div>

                        {/* Navegación central - visible en desktop */}
                        <div className="hidden md:flex items-center gap-2">
                            <button
                                onClick={handleHomeClick}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium"
                            >
                                <FiHome className="w-5 h-5" />
                                <span>Inicio</span>
                            </button>
                            
                            {userInfo?.isAdmin && (
                                <Link
                                    to="/admin/dashboard/products"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all font-medium"
                                >
                                    <FiGrid className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>
                            )}
                        </div>

                        {/* Acciones de usuario */}
                        <div className="flex items-center gap-2">
                            <Cart />
                            
                            {!loading && isAuthenticated() && <UserDropDown />}
                            
                            {/* Botón menú móvil */}
                            <div className="dropdown dropdown-end md:hidden">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="btn btn-ghost btn-circle hover:bg-purple-50"
                                >
                                    <FiMenu className="w-6 h-6 text-gray-600" />
                                </button>
                                
                                {isMobileMenuOpen && (
                                    <ul className="absolute right-0 mt-3 w-56 p-2 bg-white rounded-2xl shadow-2xl border border-purple-100 z-50">
                                        <li>
                                            <button
                                                onClick={() => {
                                                    handleHomeClick({ preventDefault: () => {} })
                                                    setIsMobileMenuOpen(false)
                                                }}
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 w-full text-left transition-colors"
                                            >
                                                <FiHome className="w-5 h-5 text-purple-600" />
                                                <span className="font-medium">Inicio</span>
                                            </button>
                                        </li>
                                        {userInfo?.isAdmin && (
                                            <li>
                                                <Link
                                                    to="/admin/dashboard/products"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-purple-50 w-full text-left transition-colors"
                                                >
                                                    <FiGrid className="w-5 h-5 text-purple-600" />
                                                    <span className="font-medium">Dashboard</span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar