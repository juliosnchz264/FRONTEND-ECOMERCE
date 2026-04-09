// src/Pages/VerifyEmailPending.jsx
import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { 
    FiMail, 
    FiArrowLeft, 
    FiLoader, 
    FiCheckCircle, 
    FiAlertTriangle,
    FiRefreshCw,
    FiInbox,
    FiSend,
    FiHome
} from 'react-icons/fi'
import { motion } from 'framer-motion'

const VerifyEmailPending = () => {
    const location = useLocation()
    const { email, message } = location.state || { 
        email: '', 
        message: 'Hemos enviado un enlace de confirmación a tu correo electrónico.'
    }
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)
    const [resendError, setResendError] = useState(false)

    const handleResend = async () => {
        setResendLoading(true)
        setResendError(false)
        
        try {
            // Aquí iría la llamada a la API para reenviar el email
            await new Promise(resolve => setTimeout(resolve, 1500))
            setResendSuccess(true)
            setTimeout(() => setResendSuccess(false), 5000)
        } catch (error) {
            setResendError(true)
            setTimeout(() => setResendError(false), 5000)
        } finally {
            setResendLoading(false)
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
                        Verifica tu email
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        ¡Ya casi estamos! Solo falta un paso
                    </p>
                </motion.div>

                {/* Card principal */}
                <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Header decorativo */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                    
                    <div className="p-8">
                        {/* Contenido principal */}
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                >
                                    <FiMail className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </motion.div>
                            </div>
                            
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                ¡Registro exitoso! 🎉
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {message}
                            </p>
                            
                            {email && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Hemos enviado el email a:
                                    </p>
                                    <p className="font-semibold text-purple-700 dark:text-purple-400 break-all">
                                        {email}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Tips y ayuda */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 mb-6">
                            <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-3 flex items-center gap-2">
                                <FiCheckCircle className="w-5 h-5" />
                                ¿No recibiste el email?
                            </h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-500 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                                    <span>Revisa tu carpeta de <strong>SPAM</strong> o correo no deseado</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                                    <span>Asegúrate de haber escrito correctamente tu email</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5"></span>
                                    <span>Espera unos minutos (el correo puede demorar)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Botón para reenviar */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mb-4 shadow-lg hover:shadow-purple-500/25"
                        >
                            {resendLoading ? (
                                <>
                                    <FiLoader className="w-5 h-5 animate-spin" />
                                    <span>Enviando...</span>
                                </>
                            ) : resendSuccess ? (
                                <>
                                    <FiCheckCircle className="w-5 h-5" />
                                    <span>¡Email reenviado!</span>
                                </>
                            ) : (
                                <>
                                    <FiSend className="w-5 h-5" />
                                    <span>Reenviar email de confirmación</span>
                                </>
                            )}
                        </motion.button>

                        {/* Mensajes de feedback */}
                        {resendSuccess && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-3 rounded-xl mb-4 text-center flex items-center justify-center gap-2"
                            >
                                <FiCheckCircle className="w-4 h-4" />
                                <span className="text-sm">Email reenviado correctamente. Revisa tu bandeja de entrada.</span>
                            </motion.div>
                        )}

                        {resendError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-3 rounded-xl mb-4 text-center flex items-center justify-center gap-2"
                            >
                                <FiAlertTriangle className="w-4 h-4" />
                                <span className="text-sm">Error al reenviar el email. Por favor intenta más tarde.</span>
                            </motion.div>
                        )}

                        {/* Consejos adicionales */}
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start gap-2">
                                <FiInbox className="w-4 h-4 text-purple-500 dark:text-purple-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        <strong className="font-medium">¿Problemas con el email?</strong> Si después de 10 minutos no recibes el correo, verifica que tu dirección sea correcta o contacta a nuestro soporte.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Links de navegación */}
                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-3">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors group"
                            >
                                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Volver al inicio de sesión
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                            >
                                <FiHome className="w-4 h-4" />
                                Ir al inicio
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer informativo */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-6 text-center"
                >
                    <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2">
                        <FiRefreshCw className="w-3 h-3" />
                        ¿No recibiste el email? Puedes solicitar que te lo reenviemos.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default VerifyEmailPending