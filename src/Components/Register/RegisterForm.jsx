import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router' // 👈 AÑADIDO
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from 'react-icons/fa'
import { registerService } from '../../services/authServices'
import { useUser } from '../../Hooks/useUser.js'
import { Navigate } from 'react-router'
import toast from 'react-hot-toast'

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

    // ============================================
    // HANDLE SUBMIT CORREGIDO
    // ============================================
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
                    // Auto-login solo si no requiere verificación
                    await checkSession?.()
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

    // Si ya está autenticado, redirigir
    if (redirect && userInfo?.isAdmin) {
        return <Navigate to="/admin/dashboard/products" replace />
    }

    if (redirect && userInfo && !userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre de usuario */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Nombre de usuario
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.username
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                        }`}
                        placeholder="usuario123"
                        type="text"
                    />
                </div>
                {errors.username && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaEnvelope className="w-5 h-5" />
                    </div>
                    <input
                        {...register('email', {
                            required: 'El email es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Correo electrónico inválido',
                            },
                            minLength: {
                                value: 6,
                                message: 'Mínimo 6 caracteres',
                            },
                            maxLength: {
                                value: 254,
                                message: 'Máximo 254 caracteres',
                            },
                        })}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.email
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                        }`}
                        placeholder="tu@email.com"
                        type="email"
                    />
                </div>
                {errors.email && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Contraseña
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock className="w-5 h-5" />
                    </div>
                    <input
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: {
                                value: 6,
                                message: 'Mínimo 6 caracteres',
                            },
                            maxLength: {
                                value: 254,
                                message: 'Máximo 254 caracteres',
                            },
                        })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.password
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                        }`}
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Confirmar contraseña
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock className="w-5 h-5" />
                    </div>
                    <input
                        {...register('confirmPassword', {
                            required: 'Debes confirmar tu contraseña',
                            validate: value => value === password || 'Las contraseñas no coinciden'
                        })}
                        className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.confirmPassword
                                ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                        }`}
                        placeholder="••••••••"
                        type={showConfirmPassword ? 'text' : 'password'}
                    />
                    <button
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                        {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Botón de registro */}
            <button
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                type="submit"
            >
                {isSubmitting ? (
                    <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creando cuenta...
                    </>
                ) : (
                    'Crear cuenta'
                )}
            </button>

            {/* Términos y condiciones */}
            <p className="text-xs text-gray-500 text-center mt-4">
                Al registrarte, aceptas nuestros{' '}
                <a href="#" className="text-purple-600 hover:underline">Términos y condiciones</a>{' '}
                y{' '}
                <a href="#" className="text-purple-600 hover:underline">Política de privacidad</a>
            </p>
        </form>
    )
}

export default RegisterForm