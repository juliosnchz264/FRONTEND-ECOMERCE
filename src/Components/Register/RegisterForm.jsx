// src/Components/Auth/RegisterForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router'  // 👈 Agregar Link
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaArrowRight, FaCheckCircle } from 'react-icons/fa'
import { registerService } from '../../services/authServices'
import { useUser } from '../../Hooks/useUser.js'
import { Navigate } from 'react-router'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const RegisterForm = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        mode: 'onChange',
    })

    const { userInfo } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const password = watch('password')
    const username = watch('username')
    const email = watch('email')

    const isUsernameValid = username?.length >= 3 && username?.length <= 20
    const isEmailValid = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email || '')
    const isPasswordValid = password?.length >= 6
    const isConfirmPasswordValid = password === watch('confirmPassword') && watch('confirmPassword')?.length > 0

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await registerService(data)
            
            if (response.success) {
                toast.success(response.message)
                
                if (response.requiresVerification) {
                    navigate('/verify-email-pending', { 
                        state: { email: data.email } 
                    })
                } else {
                    reset()
                    setRedirect(true)
                }
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            toast.error('Error en el registro')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (redirect && userInfo?.isAdmin) {
        return <Navigate to="/admin/dashboard/products" replace />
    }

    if (redirect && userInfo && !userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nombre de usuario */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre de usuario
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
                        <FaUser className="w-5 h-5" />
                    </div>
                    <input
                        {...register('username', {
                            required: 'El nombre de usuario es requerido',
                            minLength: {
                                value: 3,
                                message: 'Mínimo 3 caracteres',
                            },
                            maxLength: {
                                value: 20,
                                message: 'Máximo 20 caracteres',
                            },
                        })}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.username
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                                : username && isUsernameValid
                                ? 'border-green-500 dark:border-green-500 focus:ring-green-200 dark:focus:ring-green-500/20'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                        placeholder="usuario123"
                        type="text"
                    />
                    {username && isUsernameValid && !errors.username && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400">
                            <FaCheckCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
                {errors.username && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1 mt-1"
                    >
                        <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {errors.username.message}
                    </motion.p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-purple-500 dark:group-focus-within:text-purple-400 transition-colors">
                        <FaEnvelope className="w-5 h-5" />
                    </div>
                    <input
                        {...register('email', {
                            required: 'El email es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Correo electrónico inválido',
                            },
                        })}
                        className={`w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.email
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                                : email && isEmailValid
                                ? 'border-green-500 dark:border-green-500 focus:ring-green-200 dark:focus:ring-green-500/20'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                        placeholder="tu@email.com"
                        type="email"
                    />
                    {email && isEmailValid && !errors.email && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400">
                            <FaCheckCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
                {errors.email && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1 mt-1"
                    >
                        <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {errors.email.message}
                    </motion.p>
                )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Contraseña
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
                        className={`w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.password
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                                : password && isPasswordValid
                                ? 'border-green-500 dark:border-green-500 focus:ring-green-200 dark:focus:ring-green-500/20'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1 mt-1"
                    >
                        <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {errors.password.message}
                    </motion.p>
                )}
            </div>

            {/* Confirmar Contraseña */}
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
                        className={`w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.confirmPassword
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                                : watch('confirmPassword') && isConfirmPasswordValid
                                ? 'border-green-500 dark:border-green-500 focus:ring-green-200 dark:focus:ring-green-500/20'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                        placeholder="••••••••"
                        type={showConfirmPassword ? 'text' : 'password'}
                    />
                    <button
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                    {watch('confirmPassword') && isConfirmPasswordValid && !errors.confirmPassword && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500 dark:text-green-400">
                            <FaCheckCircle className="w-5 h-5" />
                        </div>
                    )}
                </div>
                {errors.confirmPassword && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1 mt-1"
                    >
                        <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {errors.confirmPassword.message}
                    </motion.p>
                )}
            </div>

            {/* Botón de registro */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className={`w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 group ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                type="submit"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creando cuenta...</span>
                    </>
                ) : (
                    <>
                        <span>Crear cuenta</span>
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </motion.button>

            {/* Términos y condiciones - ACTUALIZADO con Links */}
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
                Al registrarte, aceptas nuestros{' '}
                <Link 
                    to="/terms" 
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors"
                >
                    Términos y condiciones
                </Link>{' '}
                y{' '}
                <Link 
                    to="/privacy" 
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors"
                >
                    Política de privacidad
                </Link>
            </p>
        </form>
    )
}

export default RegisterForm