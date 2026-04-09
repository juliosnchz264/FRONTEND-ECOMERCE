// src/Pages/ServerError.jsx
import { Link, useNavigate, useLocation } from 'react-router' // 👈 Cambiar a react-router
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    FiAlertTriangle, 
    FiRefreshCw, 
    FiHome, 
    FiMail, 
    FiClock, 
    FiServer,
    FiActivity,
    FiZap,
    FiArrowLeft // 👈 Agregar icono
} from 'react-icons/fi'

const ServerError = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [countdown, setCountdown] = useState(10)
    const [isRetrying, setIsRetrying] = useState(false)
    const [errorDetails, setErrorDetails] = useState(null)

    // 👈 Extraer información del error de la ubicación (si se pasó)
    useEffect(() => {
        if (location.state?.error) {
            setErrorDetails(location.state.error)
        }
    }, [location])

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleAutoRetry()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const handleAutoRetry = () => {
        setIsRetrying(true)
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    const handleManualRetry = () => {
        setIsRetrying(true)
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    const handleGoBack = () => {
        navigate(-1)
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
                className="max-w-lg w-full"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header decorativo animado */}
                    <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse"></div>
                    
                    <div className="p-8 text-center">
                        {/* Icono de error animado */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="relative w-28 h-28 mx-auto">
                                <div className="absolute inset-0 bg-red-100 dark:bg-red-900/30 rounded-full animate-ping opacity-75"></div>
                                <div className="relative w-28 h-28 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 rounded-full flex items-center justify-center shadow-lg">
                                    <FiServer className="w-12 h-12 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Código de error */}
                        <motion.h1 
                            variants={itemVariants}
                            className="text-7xl md:text-8xl font-black bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 bg-clip-text text-transparent mb-4"
                        >
                            500
                        </motion.h1>

                        {/* Mensaje principal */}
                        <motion.h2 
                            variants={itemVariants}
                            className="text-2xl font-bold text-gray-800 dark:text-white mb-3"
                        >
                            Error Interno del Servidor
                        </motion.h2>
                        <motion.p 
                            variants={itemVariants}
                            className="text-gray-600 dark:text-gray-400 mb-6"
                        >
                            Algo salió mal en nuestros servidores. 
                            Nuestro equipo ha sido notificado y estamos trabajando en ello.
                        </motion.p>

                        {/* 👈 Mostrar detalles del error si existen (solo en desarrollo) */}
                        {errorDetails && process.env.NODE_ENV === 'development' && (
                            <motion.div 
                                variants={itemVariants}
                                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-left"
                            >
                                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                                    {errorDetails}
                                </p>
                            </motion.div>
                        )}

                        {/* Barra de progreso y contador */}
                        <motion.div 
                            variants={itemVariants}
                            className="mb-6"
                        >
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <FiClock className="w-4 h-4" />
                                    Reintentando automáticamente
                                </span>
                                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                    {countdown}s
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                    initial={{ width: '100%' }}
                                    animate={{ width: '0%' }}
                                    transition={{ duration: 10, ease: "linear" }}
                                />
                            </div>
                        </motion.div>

                        {/* Botones de acción */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-3 mb-6"
                        >
                            <button
                                onClick={handleManualRetry}
                                disabled={isRetrying}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {isRetrying ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Reintentando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiRefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                        <span>Reintentar ahora</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleGoBack}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all group"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                                <span>Volver atrás</span>
                            </button>
                            <Link
                                to="/"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600 group"
                            >
                                <FiHome className="w-5 h-5" />
                                <span>Ir al inicio</span>
                            </Link>
                        </motion.div>

                        {/* Información adicional */}
                        <motion.div 
                            variants={itemVariants}
                            className="space-y-3"
                        >
                            {/* Status de los servidores */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <FiActivity className="w-4 h-4 text-purple-500" />
                                        Estado de los servidores
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                                        <span className="text-xs text-yellow-600 dark:text-yellow-400">Recuperando...</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Nuestros técnicos están trabajando para restaurar el servicio a la mayor brevedad posible.
                                </p>
                            </div>

                            {/* Soporte */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                                <div className="flex items-start gap-3">
                                    <FiMail className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">
                                            ¿El problema persiste?
                                        </p>
                                        <a 
                                            href="mailto:soporte@ecommerce.com" 
                                            className="text-sm text-purple-600 dark:text-purple-400 hover:underline inline-flex items-center gap-1"
                                        >
                                            Reporta este error
                                            <FiZap className="w-3 h-3" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* 👈 Consejo adicional */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 border border-blue-100 dark:border-blue-800">
                                <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
                                    💡 Tip: Puedes intentar limpiar la caché del navegador o usar el modo incógnito
                                </p>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div 
                            variants={itemVariants}
                            className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700"
                        >
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                Error 500 - Error interno del servidor • E-Commerce
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ServerError