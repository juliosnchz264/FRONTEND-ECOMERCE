// src/Pages/VerifyEmail.jsx
import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { 
    FiCheckCircle, 
    FiXCircle, 
    FiLoader, 
    FiMail, 
    FiAlertTriangle, 
    FiArrowRight,
    FiHome,
    FiRefreshCw
} from 'react-icons/fi'
import { motion } from 'framer-motion'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    
    const [status, setStatus] = useState('loading')
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        if (token) {
            verifyEmailToken()
        } else {
            setStatus('error')
            setMessage('Token de verificación no proporcionado')
        }
    }, [token])

    useEffect(() => {
        let timer
        if (status === 'success' && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        } else if (status === 'success' && countdown === 0) {
            navigate('/login')
        }
        return () => clearTimeout(timer)
    }, [status, countdown, navigate])

    const verifyEmailToken = async () => {
        try {
            const response = await api.get(`/auth/verify/${token}`)
            setStatus('success')
            setMessage(response.data.message || 'Email verificado correctamente')
            
            if (response.data.email) {
                setEmail(response.data.email)
            }
            
        } catch (error) {
            setStatus('error')
            setMessage(error.response?.data?.message || 'Error al verificar email')
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full"
            >
                {/* Header */}
                <motion.div 
                    variants={itemVariants}
                    className="text-center mb-8"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                            <FiMail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        Verificación de Email
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Confirmando tu cuenta
                    </p>
                </motion.div>

                {/* Card principal */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Header decorativo */}
                    <div className={`h-1 bg-gradient-to-r ${
                        status === 'loading' ? 'from-purple-500 via-pink-500 to-purple-500' :
                        status === 'success' ? 'from-green-500 to-emerald-500' :
                        'from-red-500 to-orange-500'
                    }`}></div>
                    
                    <div className="p-8">
                        {status === 'loading' && (
                            <motion.div 
                                variants={itemVariants}
                                className="text-center py-8"
                            >
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full"></div>
                                    <FiLoader className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    Verificando...
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Por favor espera mientras verificamos tu email
                                </p>
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div 
                                variants={itemVariants}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>
                                
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    ¡Email Verificado!
                                </h2>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {message}
                                </p>

                                {email && (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-6 border border-purple-100 dark:border-purple-800">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Cuenta verificada para:
                                        </p>
                                        <p className="font-semibold text-purple-700 dark:text-purple-400">
                                            {email}
                                        </p>
                                    </div>
                                )}

                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Serás redirigido al login en{' '}
                                        <span className="font-bold text-purple-600 dark:text-purple-400">{countdown}</span> segundos...
                                    </p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-2">
                                        <motion.div 
                                            className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                            initial={{ width: '100%' }}
                                            animate={{ width: '0%' }}
                                            transition={{ duration: 3, ease: "linear" }}
                                        />
                                    </div>
                                </div>
                                
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-lg hover:shadow-purple-500/25 group"
                                >
                                    <span>Ir al login ahora</span>
                                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div 
                                variants={itemVariants}
                                className="text-center py-8"
                            >
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                                </div>
                                
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    Error de Verificación
                                </h2>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
                                        <FiAlertTriangle className="w-5 h-5" />
                                        ¿Problemas con la verificación?
                                    </h3>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                            El enlace puede haber expirado (válido por 24 horas)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                            El token ya fue utilizado anteriormente
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                                            Hubo un problema con el enlace de verificación
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-lg hover:shadow-purple-500/25"
                                    >
                                        <FiHome className="w-4 h-4" />
                                        Ir al inicio de sesión
                                    </Link>
                                    
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                                    >
                                        <FiRefreshCw className="w-4 h-4" />
                                        Crear una nueva cuenta
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                {/* Footer informativo */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-6 text-center"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        ¿Necesitas ayuda? Contacta a{' '}
                        <a href="mailto:soporte@ecommerce.com" className="text-purple-600 dark:text-purple-400 hover:underline">
                            soporte@ecommerce.com
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default VerifyEmail