import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router'
import { loginService } from '../../services/authServices'
import { useUser } from '../../Hooks/useUser.js'
import toast from 'react-hot-toast'

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: 'onChange',
    })

    const { setUserInfo } = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const from = location.state?.from?.pathname

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true)
            const result = await loginService(data)

            if (result && result.success) {
                await setUserInfo(result.user) 
                
                toast.success(result.message || '¡Bienvenido!')
                reset()

                const destination = from || (result.user.isAdmin ? '/admin/dashboard/products' : '/')
                
                navigate(destination, { replace: true })
            } else {
                toast.error(result?.message || 'Credenciales incorrectas')
            }
        } catch (error) {
            console.error("Error en login form:", error)
            toast.error('Error de conexión con el servidor')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* EMAIL INPUT */}
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
                            }
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

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <button 
                        type="button"
                        className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </div>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaLock className="w-5 h-5" />
                    </div>
                    <input
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: { value: 6, message: 'Mínimo 6 caracteres' }
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

            {/* Botón de submit */}
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
                        Iniciando sesión...
                    </>
                ) : (
                    'Iniciar sesión'
                )}
            </button>
        </form>
    )
}

export default LoginForm