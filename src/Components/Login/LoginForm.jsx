import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router' // 👈 Hooks recomendados
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

    // 💡 Capturamos la ruta de origen si existe (por ejemplo, desde ProtectedRoute)
    const from = location.state?.from?.pathname

    const onSubmit = async (data) => {
    try {
        setIsSubmitting(true)
        const result = await loginService(data)

        if (result && result.success) {
            // 1. Actualizamos el contexto
            // Es vital que result.user contenga los datos correctos
            await setUserInfo(result.user) 
            
            toast.success(result.message || '¡Bienvenido!')
            reset()

            // 2. Pequeño respiro para que el estado de React se asiente
            // y las cookies/localStorage se sincronicen
            const destination = from || (result.user.isAdmin ? '/admin/dashboard/products' : '/')
            
            navigate(destination, { replace: true })
        } else {
            // Si el servicio responde pero success es false (ej. 401 Unauthorized)
            toast.error(result?.message || 'Credenciales incorrectas')
        }
    } catch (error) {
        // Este catch captura errores de red o errores de código dentro del try
        console.error("Error en login form:", error)
        toast.error('Error de conexión con el servidor')
    } finally {
        setIsSubmitting(false)
    }
}

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
        >
            {/* EMAIL INPUT */}
            <div className="flex flex-col gap-1">
                <input
                    {...register('email', {
                        required: 'El email es requerido',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Correo electrónico inválido',
                        }
                    })}
                    className={`p-2 outline-2 rounded border focus:outline-primary w-full transition-all ${
                        errors.email ? 'border-red-500 focus:outline-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Correo electrónico"
                    type="email"
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
            </div>

            {/* PASSWORD INPUT */}
            <div className="flex flex-col gap-1 relative">
                <div className="relative">
                    <input
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                        })}
                        className={`p-2 outline-2 rounded border focus:outline-primary w-full transition-all ${
                            errors.password ? 'border-red-500 focus:outline-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Contraseña"
                        type={showPassword ? 'text' : 'password'}
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                    >
                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
            </div>

            <button 
                disabled={isSubmitting}
                className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`} 
                type="submit"
            >
                {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
            </button>
        </form>
    )
}

export default LoginForm