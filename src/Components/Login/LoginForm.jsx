// src/Components/Auth/LoginForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaLock,
    FaArrowRight,
} from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router'
import { loginService } from '../../services/authServices'
import { useUser } from '../../Hooks/useUser.js'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange',
    })

    const { login } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)

    const from = location.state?.from?.pathname

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true)
            const result = await loginService(data.email, data.password, rememberMe)

            if (result && result.success) {
                login(result.user, result.accessToken)
                toast.success(result.message || '¡Bienvenido!')
                reset()

                const destination =
                    from ||
                    (result.user.isAdmin ? '/admin/dashboard/products' : '/')
                navigate(destination, { replace: true })
            } else {
                toast.error(result?.message || 'Credenciales incorrectas')
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                'Error de conexión con el servidor'
            toast.error(errorMsg)
            console.error('Error en login form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL INPUT */}
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
                        className={`w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.email
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20 focus:border-red-500'
                                : 'border-gray-300 dark:border-gray-700 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                        placeholder="tu@email.com"
                        type="email"
                    />
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

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Contraseña
                    </label>
                    <button
                        type="button"
                        onClick={() => navigate('/forgot-password')}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
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
                        {showPassword ? (
                            <FaEyeSlash size={20} />
                        ) : (
                            <FaEye size={20} />
                        )}
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

            {/* Recordarme */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer-checked:bg-purple-600 transition-colors duration-200"></div>
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-5"></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                        Recordarme por 30 días
                    </span>
                </label>
            </div>

            {/* Botón de submit */}
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
                        <span>Iniciando sesión...</span>
                    </>
                ) : (
                    <>
                        <span>Iniciar sesión</span>
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </motion.button>
        </form>
    )
}

export default LoginForm
