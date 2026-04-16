// src/Pages/ConfirmNewsletter.jsx
import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FiCheckCircle,
    FiXCircle,
    FiLoader,
    FiMail,
    FiAlertTriangle,
    FiArrowRight,
    FiRefreshCw,
} from 'react-icons/fi'
import api from '../services/api'

const ConfirmNewsletter = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState('loading') // 'loading' | 'success' | 'error'
    const [email, setEmail] = useState('')
    const [errorReason, setErrorReason] = useState('')
    const calledRef = useRef(false)

    useEffect(() => {
        // Strict-mode double-invoke guard — only run once
        if (calledRef.current) return
        calledRef.current = true

        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setErrorReason('missing-token')
            return
        }

        // Token never leaves the browser address bar exposed as a backend URL.
        // We POST it so it doesn't appear in backend access logs as a query param.
        api.post('/newsletter/confirm', { token })
            .then(({ data }) => {
                setEmail(data.email || '')
                setStatus('success')
            })
            .catch((err) => {
                const reason = err.response?.data?.reason || 'confirmation-error'
                setErrorReason(reason)
                setStatus('error')
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const errorMessage = {
        'missing-token': 'No se encontró un token de verificación en el enlace.',
        'token-expired': 'El enlace ha expirado. Los enlaces de confirmación son válidos por 24 horas.',
        'token-used': 'Este enlace ya fue utilizado anteriormente.',
        'not-found': 'No encontramos una suscripción pendiente para este enlace.',
        'confirmation-error': 'Hubo un problema al confirmar tu suscripción.',
    }[errorReason] || 'Hubo un error al procesar tu solicitud.'

    const card = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
    }
    const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
            <motion.div
                variants={card}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full"
            >
                {/* Header */}
                <motion.div variants={item} className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                            <FiMail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        Confirmación de Newsletter
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {status === 'loading' && 'Verificando tu suscripción…'}
                        {status === 'success' && '¡Ya estás suscrito!'}
                        {status === 'error' && 'No se pudo confirmar'}
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    variants={item}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Color bar */}
                    <div
                        className={`h-1 bg-gradient-to-r ${
                            status === 'loading'
                                ? 'from-purple-500 via-pink-500 to-purple-500'
                                : status === 'success'
                                ? 'from-green-500 to-emerald-500'
                                : 'from-red-500 to-orange-500'
                        }`}
                    />

                    <div className="p-8">
                        {/* ── Loading ── */}
                        {status === 'loading' && (
                            <div className="text-center py-8">
                                <div className="relative w-20 h-20 mx-auto mb-4">
                                    <div className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full" />
                                    <FiLoader className="w-10 h-10 text-purple-600 dark:text-purple-400 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    Verificando…
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Por favor espera un momento
                                </p>
                            </div>
                        )}

                        {/* ── Success ── */}
                        {status === 'success' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                                </div>

                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    ¡Suscripción confirmada!
                                </h2>

                                {email && (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mb-4 border border-purple-100 dark:border-purple-800">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Suscrito con:
                                        </p>
                                        <p className="font-semibold text-purple-700 dark:text-purple-400 break-all">
                                            {email}
                                        </p>
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    A partir de ahora recibirás nuestras novedades, ofertas exclusivas y promociones especiales.
                                </p>

                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-lg hover:shadow-purple-500/25 group"
                                >
                                    <span>Volver a la tienda</span>
                                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        )}

                        {/* ── Error ── */}
                        {status === 'error' && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                                </div>

                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    Error de confirmación
                                </h2>

                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    {errorMessage}
                                </p>

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 text-left">
                                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-400 mb-3 flex items-center gap-2">
                                        <FiAlertTriangle className="w-5 h-5" />
                                        ¿Problemas con el enlace?
                                    </h3>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-500 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
                                            El enlace es válido por 24 horas tras la suscripción
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
                                            Cada enlace solo puede usarse una vez
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full flex-shrink-0" />
                                            Verifica que copiaste el enlace completo del email
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        to="/"
                                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-lg hover:shadow-purple-500/25"
                                    >
                                        <FiArrowRight className="w-4 h-4" />
                                        Volver a la tienda
                                    </Link>
                                    <Link
                                        to="/"
                                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                                    >
                                        <FiRefreshCw className="w-4 h-4" />
                                        Suscribirme de nuevo
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                <motion.div variants={item} className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        ¿Necesitas ayuda? Contacta a{' '}
                        <a
                            href="mailto:julio264edu@gmail.com"
                            className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                            julio264edu@gmail.com
                        </a>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default ConfirmNewsletter
