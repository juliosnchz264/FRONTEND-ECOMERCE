// src/Pages/PaymentFailure.jsx
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaTimesCircle, FaCreditCard, FaClock, FaArrowLeft, FaHome } from 'react-icons/fa'
import { FiAlertTriangle, FiRefreshCw, FiHelpCircle } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

const PaymentFailure = () => {
    const [searchParams] = useSearchParams()
    // Strip non-alphanumeric chars to prevent reflected text injection via URL params
    const sanitizeParam = (val) => val ? val.replace(/[^a-zA-Z0-9_\-. ]/g, '').slice(0, 100) : null
    const paymentId = sanitizeParam(searchParams.get('payment_id'))
    const status = sanitizeParam(searchParams.get('status'))
    const merchantOrder = sanitizeParam(searchParams.get('merchant_order_id'))

    useEffect(() => {
        toast.error('El pago no pudo ser procesado')
    }, [])

    const possibleCauses = [
        { icon: FiAlertTriangle, text: 'Fondos insuficientes' },
        { icon: FiAlertTriangle, text: 'Datos de tarjeta incorrectos' },
        { icon: FiAlertTriangle, text: 'Tarjeta vencida o bloqueada' },
        { icon: FiAlertTriangle, text: 'Límite de compra excedido' },
        { icon: FiAlertTriangle, text: 'Problemas de conexión con el banco' }
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
                    <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
                    
                    <div className="p-8 text-center">
                        {/* Icono de error animado */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                            className="mb-6"
                        >
                            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                <FaTimesCircle className="text-6xl text-red-500 dark:text-red-400" />
                            </div>
                        </motion.div>

                        {/* Título y mensaje */}
                        <motion.h1 
                            variants={itemVariants}
                            className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2"
                        >
                            Pago Rechazado
                        </motion.h1>
                        <motion.p 
                            variants={itemVariants}
                            className="text-gray-600 dark:text-gray-400 mb-6"
                        >
                            No se pudo procesar tu pago. Por favor, verifica los datos e intenta nuevamente.
                        </motion.p>

                        {/* Posibles causas */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 mb-6 text-left border border-gray-100 dark:border-gray-700"
                        >
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                <FiHelpCircle className="w-5 h-5 text-orange-500" />
                                Posibles causas:
                            </h3>
                            <ul className="space-y-2">
                                {possibleCauses.map((cause, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <cause.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                        <span>{cause.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Detalles del intento */}
                        {(paymentId || status || merchantOrder) && (
                            <motion.div 
                                variants={itemVariants}
                                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 mb-6 text-left border border-gray-100 dark:border-gray-700"
                            >
                                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                    <FaCreditCard className="w-5 h-5 text-purple-500" />
                                    Detalles del Intento:
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
                                            <span className="font-medium text-red-600 dark:text-red-400">{status}</span>
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

                        {/* Consejos adicionales */}
                        <motion.div 
                            variants={itemVariants}
                            className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 text-left border border-blue-100 dark:border-blue-800"
                        >
                            <div className="flex items-start gap-3">
                                <FaClock className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                                        ¿Necesitas ayuda?
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">
                                        Si el problema persiste, contacta a tu banco o intenta con otro método de pago.
                                        También puedes comunicarte con nuestro soporte al cliente.
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
                                to="/checkout" 
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 group"
                            >
                                <FiRefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                                <span>Intentar Nuevamente</span>
                            </Link>
                            <Link 
                                to="/" 
                                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600 group"
                            >
                                <FaHome className="w-4 h-4" />
                                <span>Volver al Inicio</span>
                            </Link>
                        </motion.div>

                        {/* Enlace de soporte */}
                        <motion.div 
                            variants={itemVariants}
                            className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700"
                        >
                            <Link 
                                to="/contact" 
                                className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                            >
                                <FiHelpCircle className="w-4 h-4" />
                                <span>Contactar soporte técnico</span>
                                <FaArrowLeft className="w-3 h-3 rotate-180" />
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Footer informativo */}
                <motion.p 
                    variants={itemVariants}
                    className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6"
                >
                    ¿Tienes dudas sobre tu transacción? Revisa tu correo electrónico o contacta a nuestro equipo de soporte.
                </motion.p>
            </motion.div>
        </div>
    )
}

export default PaymentFailure