// src/Pages/ResetPassword.jsx
import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'
import api from '../services/api'
import toast from 'react-hot-toast'

const ResetPassword = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isValidToken, setIsValidToken] = useState(true)
    const [tokenError, setTokenError] = useState('')

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        mode: 'onChange',
    })

    const password = watch('password')

    useEffect(() => {
        if (!token) {
            setIsValidToken(false)
            setTokenError('Token de restablecimiento no proporcionado')
        }
    }, [token])

    const onSubmit = async (data) => {
        if (!token) {
            toast.error('Token inválido')
            return
        }

        setIsSubmitting(true)
        try {
            const response = await api.post('/auth/reset-password', {
                token,
                newPassword: data.password
            })
            
            if (response.data.success) {
                setIsSuccess(true)
                toast.success(response.data.message || 'Contraseña actualizada correctamente')
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } else {
                toast.error(response.data.message || 'Error al restablecer la contraseña')
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al restablecer la contraseña'
            toast.error(errorMsg)
            if (error.response?.status === 400) {
                setIsValidToken(false)
                setTokenError(errorMsg)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaLock className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Enlace inválido
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {tokenError || 'El enlace de restablecimiento es inválido o ha expirado.'}
                    </p>
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all"
                    >
                        Solicitar nuevo enlace
                    </Link>
                </motion.div>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        ¡Contraseña actualizada!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Tu contraseña ha sido cambiada exitosamente. Serás redirigido al login...
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Ir al login
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-md w-full"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                    
                    <div className="p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaLock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Nueva contraseña
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                Ingresa tu nueva contraseña
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Nueva contraseña */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nueva contraseña
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
                                        <FaLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        {...register('password', {
                                            required: 'La contraseña es requerida',
                                            minLength: {
                                                value: 6,
                                                message: 'Mínimo 6 caracteres',
                                            },
                                        })}
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 dark:text-red-400 text-sm">{errors.password.message}</p>
                                )}
                            </div>

                            {/* Confirmar contraseña */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirmar contraseña
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
                                        <FaLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        {...register('confirmPassword', {
                                            required: 'Debes confirmar tu contraseña',
                                            validate: value => value === password || 'Las contraseñas no coinciden'
                                        })}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 dark:text-red-400 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                                type="submit"
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="w-5 h-5 animate-spin" />
                                        <span>Actualizando...</span>
                                    </>
                                ) : (
                                    <span>Restablecer contraseña</span>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default ResetPassword