// src/Components/Navbar/AuthButtons.jsx
import { Link } from 'react-router'
import { FiUserPlus, FiLogIn, FiUser } from 'react-icons/fi'

const AuthButtons = ({ variant = 'navbar' }) => {
    // Variante para el navbar (botones pequeños)
    if (variant === 'navbar') {
        return (
            <div className="flex items-center gap-2">
                <Link
                    to="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200"
                >
                    <FiLogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Ingresar</span>
                </Link>
                
                <Link
                    to="/register"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <FiUserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Registrarse</span>
                </Link>
            </div>
        )
    }

    // Variante para el header separado
    return (
        <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-800/50 border-b border-purple-100 dark:border-gray-700 transition-colors duration-300">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
                <div className="flex justify-end items-center gap-3">
                    <span className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
                        ¿Nuevo por aquí?
                    </span>
                    
                    <Link
                        className="group flex items-center gap-2 px-4 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                        to="/register"
                    >
                        <FiUserPlus className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Crear Cuenta</span>
                    </Link>

                    <div className="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

                    <Link
                        className="group flex items-center gap-2 px-4 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
                        to="/login"
                    >
                        <FiLogIn className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Iniciar sesión</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default AuthButtons