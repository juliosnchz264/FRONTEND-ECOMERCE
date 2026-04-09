// src/Components/ui/AuthToast.jsx
import { Link } from 'react-router'
import { FiHeart, FiLogIn, FiX } from 'react-icons/fi'

const AuthToast = ({ onClose }) => {
    return (
        <div className="relative flex items-center gap-3 p-4">
            {/* Botón cerrar */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <FiX className="w-4 h-4" />
            </button>
            
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <FiHeart className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-gray-800 dark:text-white">
                    ¡Inicia sesión para guardar favoritos!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Crea una cuenta para no perder tus productos favoritos
                </p>
            </div>
            <Link
                to="/login"
                onClick={onClose}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
            >
                <FiLogIn className="w-3 h-3" />
                Iniciar sesión
            </Link>
        </div>
    )
}

export default AuthToast