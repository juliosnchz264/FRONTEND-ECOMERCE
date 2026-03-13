import LoginForm from '../Components/Login/LoginForm'
import { Link } from 'react-router'
import { FiShoppingBag } from 'react-icons/fi'

const Login = () => {
    return (
        <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
                        {/* Card de login */}
                        <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
                            {/* Header con gradiente */}
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
                                <h1 className="text-3xl font-bold text-white text-center">
                                    ¡Bienvenido de nuevo!
                                </h1>
                                <p className="text-purple-100 text-center mt-2">
                                    Inicia sesión para continuar
                                </p>
                            </div>

                            {/* Formulario */}
                            <div className="p-8">
                                <LoginForm />

                                {/* Link a registro */}
                                <div className="text-center mt-6 pt-6 border-t border-gray-200">
                                    <p className="text-gray-600">
                                        ¿No tienes una cuenta?{' '}
                                        <Link 
                                            to="/register" 
                                            className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                        >
                                            Regístrate aquí
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mensaje de seguridad */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500">
                                🔒 Tus datos están seguros y encriptados
                            </p>
                        </div>
            </div>
        </div>

    )
}

export default Login