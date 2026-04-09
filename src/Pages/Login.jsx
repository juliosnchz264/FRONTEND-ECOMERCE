// src/Pages/Login.jsx
import LoginForm from '../Components/Login/LoginForm'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiShield, FiZap, FiStar } from 'react-icons/fi'

const Login = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-5xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Columna Izquierda - Branding */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="hidden md:flex flex-col justify-center space-y-8"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl">
                                    <FiShoppingBag className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                                    E-Commerce
                                </h1>
                            </div>
                            <h2 className="text-4xl font-bold text-gray-800 dark:text-white leading-tight">
                                Bienvenido de<br />
                                <span className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                                    vuelta
                                </span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Accede a tu cuenta y descubre las mejores ofertas
                            </p>
                        </div>

                        {/* Features */}
                        <div className="space-y-4 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                                    <FiZap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Acceso rápido y seguro</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                                    <FiShield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Protección de datos</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                                    <FiStar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">Ofertas exclusivas para miembros</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Columna Derecha - Formulario */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full"
                    >
                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-100 dark:border-gray-700 shadow-2xl overflow-hidden transition-colors duration-300">
                            {/* Header decorativo */}
                            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                            
                            <div className="p-8">
                                {/* Título móvil */}
                                <div className="md:hidden text-center mb-8">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl">
                                            <FiShoppingBag className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                        ¡Bienvenido de vuelta!
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Inicia sesión para continuar
                                    </p>
                                </div>

                                {/* Formulario */}
                                <LoginForm />

                                {/* Link a registro */}
                                <div className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-gray-600 dark:text-gray-400">
                                        ¿No tienes una cuenta?{' '}
                                        <Link 
                                            to="/register" 
                                            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold hover:underline transition-colors"
                                        >
                                            Regístrate aquí
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mensaje de seguridad */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2">
                                <FiShield className="w-4 h-4" />
                                Tus datos están seguros y encriptados
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Login