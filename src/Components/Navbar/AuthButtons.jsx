import { Link } from 'react-router'
import { FiUserPlus, FiLogIn } from 'react-icons/fi'

const AuthButtons = () => {
    return (
        <div className="flex justify-center items-center gap-3 md:gap-4 py-2 px-4">
            {/* Texto decorativo - solo visible en desktop */}
            <span className="hidden lg:block text-sm text-gray-500">
                ¿Nuevo por aquí?
            </span>
            
            <Link
                className="group relative flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-purple-300 transform hover:-translate-y-0.5"
                to="/register"
            >
                <FiUserPlus className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">Crear Cuenta</span>
            </Link>

            {/* Separador decorativo - solo visible en desktop */}
            <div className="hidden lg:block w-px h-6 bg-gray-300"></div>

            <Link
                className="group relative flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-purple-50 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 hover:border-purple-300 transform hover:-translate-y-0.5"
                to={'/login'}
            >
                <FiLogIn className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Iniciar sesión</span>
            </Link>
        </div>
    )
}

export default AuthButtons