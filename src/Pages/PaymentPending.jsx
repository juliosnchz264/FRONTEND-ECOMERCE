// src/Pages/PaymentPending.jsx
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaClock, FaEnvelope, FaArrowRight, FaHome, FaListAlt } from 'react-icons/fa'
import { FiLoader, FiInfo, FiAlertCircle, FiCheckCircle, FiMail } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const PaymentPending = () => {
    const [searchParams] = useSearchParams()
    const paymentId = searchParams.get('payment_id')
    const status = searchParams.get('status')
    const merchantOrder = searchParams.get('merchant_order_id')

    useEffect(() => {
        toast('Pago en proceso de verificación', {
            icon: '⏳',
            duration: 4000,
        })
    }, [])

    const pendingReasons = [
        { icon: FiInfo, text: 'Pagaste en efectivo (Rapipago, Pago Fácil, etc.)' },
        { icon: FiInfo, text: 'Usaste transferencia bancaria' },
        { icon: FiInfo, text: 'El banco está verificando la transacción' },
        { icon: FiInfo, text: 'Pago pendiente de aprobación manual' }
    ]

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
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header decorativo */}
                    <div className="h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 animate-pulse"></div>
                    
                    <div className="p-8 text-center">
                        {/* Icono animado */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto">
                                <div className="relative">
                                    <FaClock className="text-6xl text-yellow-500 dark:text-yellow-400" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute -top-1 -right-1"
                                    >
                                        <FiLoader className="w-4 h-4 text-yellow-500" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Título y mensaje */}
                        <motion.h1 
                            variants={itemVariants}
                            className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2"
                        >
                            Pago Pendiente
                        </motion.h1>
                        <motion.p 
                            variants={itemVariants}
                            className="text-gray-600 dark:text-gray-400 mb-6"
                        >
                            Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
                        </motion.p>

                        {/* ¿Qué significa esto? */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 mb-6 text-left border border-gray-100 dark:border-gray-700"
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                <FiInfo className="w-5 h-5 text-yellow-500" />
                                ¿Qué significa esto?
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                Tu pago está siendo verificado. Esto puede suceder cuando:
                            </p>
                            <ul className="space-y-2">
                                {pendingReasons.map((reason, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <reason.icon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                        <span>{reason.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Detalles del pago */}
                        {(paymentId || status || merchantOrder) && (
                            <motion.div 
                                variants={itemVariants}
                                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 mb-6 text-left border border-gray-100 dark:border-gray-700"
                            >
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <FiInfo className="w-5 h-5 text-blue-500" />
                                    Detalles del Pago:
                                </h3>
                                <div className="space-y-2 text-sm">
                                    {paymentId && (
                                        <p className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">ID de Pago:</span>
                                            <span className="font-mono text-gray-700 dark:text-gray-300">{paymentId}</span>
                                        </p>
                                    )}
                                    {status && (
                                        <p className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Estado:</span>
                                            <span className="font-medium text-yellow-600 dark:text-yellow-400">{status}</span>
                                        </p>
                                    )}
                                    {merchantOrder && (
                                        <p className="flex justify-between">
                                            <span className="text-gray-500 dark:text-gray-400">Orden:</span>
                                            <span className="font-mono text-gray-700 dark:text-gray-300">{merchantOrder}</span>
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Alerta de notificación */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left border border-blue-100 dark:border-blue-800"
                        >
                            <div className="flex items-start gap-3">
                                <FiMail className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                                        Te notificaremos por email
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                        Una vez que se confirme el pago, recibirás un email de confirmación con los detalles de tu pedido.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tiempo estimado */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6 text-left border border-purple-100 dark:border-purple-800"
                        >
                            <div className="flex items-start gap-3">
                                <FiAlertCircle className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">
                                        Tiempo estimado de verificación
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                        El proceso puede tomar entre 1 y 3 días hábiles dependiendo del método de pago seleccionado.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Botones de acción */}
                        <motion.div 
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-3"
                        >
                            <Link 
                                to="/" 
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 group"
                            >
                                <FaHome className="w-4 h-4" />
                                <span>Volver al Inicio</span>
                            </Link>
                            <Link 
                                to="/orders" 
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600 group"
                            >
                                <FaListAlt className="w-4 h-4" />
                                <span>Ver mis Órdenes</span>
                                <FaArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Consejos adicionales */}
                        <motion.div 
                            variants={itemVariants}
                            className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700"
                        >
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <FiCheckCircle className="w-3 h-3 text-green-500" />
                                <span>No es necesario que realices ninguna acción adicional</span>
                            </div>
                            <div className="mt-2">
                                <Link 
                                    to="/contact" 
                                    className="inline-flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                                >
                                    <FaEnvelope className="w-3 h-3" />
                                    <span>¿Problemas con tu pago? Contacta soporte</span>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Footer informativo */}
                <motion.p 
                    variants={itemVariants}
                    className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6"
                >
                    Mantén esta página abierta o revisa tu correo electrónico para actualizaciones sobre el estado de tu pago.
                </motion.p>
            </motion.div>
        </div>
    )
}

export default PaymentPending