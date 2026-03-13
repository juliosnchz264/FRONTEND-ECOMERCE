import RegisterForm from '../Components/Register/RegisterForm'
import { Link } from 'react-router'
import { FiShoppingBag } from 'react-icons/fi'

const Register = () => {
    return (
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    {/* Card de registro */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
                        {/* Header con gradiente */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
                            <h1 className="text-3xl font-bold text-white text-center">
                                Crear cuenta
                            </h1>
                            <p className="text-purple-100 text-center mt-2">
                                Únete a nuestra comunidad
                            </p>
                        </div>

                        {/* Formulario */}
                        <div className="p-8">
                            <RegisterForm />

                            {/* Link a login */}
                            <div className="text-center mt-6 pt-6 border-t border-gray-200">
                                <p className="text-gray-600">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link 
                                        to="/login" 
                                        className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                    >
                                        Inicia sesión
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mensaje de beneficios */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            ✨ Al registrarte obtienes acceso a ofertas exclusivas
                        </p>
                    </div>
                </div>
            </div>
    )
}

export default Register