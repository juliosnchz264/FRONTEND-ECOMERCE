// src/Components/Auth/ForgotPasswordForm.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEnvelope, FaArrowRight, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import { motion } from 'framer-motion'
import api from '../../services/api'
import toast from 'react-hot-toast'

const ForgotPasswordForm = ({ onBack }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submittedEmail, setSubmittedEmail] = useState('')

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        try {
            const response = await api.post('/auth/forgot-password', { email: data.email })
            
            if (response.data.success) {
                setIsSuccess(true)
                setSubmittedEmail(data.email)
                toast.success(response.data.message || 'Revisa tu correo para restablecer tu contraseña')
            } else {
                toast.error(response.data.message || 'Error al procesar la solicitud')
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al enviar el correo'
            toast.error(errorMsg)
            console.error('Error en forgot password:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Estado de éxito
    if (isSuccess) {
        return (
            <div className="space-y-6 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    ¡Revisa tu correo!
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400">
                    Hemos enviado un enlace para restablecer tu contraseña a:
                </p>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-xl border border-purple-100 dark:border-purple-800">
                    <p className="font-semibold text-purple-700 dark:text-purple-400 break-all">
                        {submittedEmail}
                    </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 text-left">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">¿No recibiste el email?</h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-500 space-y-1">
                        <li>• Revisa tu carpeta de SPAM</li>
                        <li>• Espera unos minutos</li>
                        <li>• El enlace expira en 1 hora</li>
                    </ul>
                </div>
                
                <div className="space-y-3 pt-4">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all shadow-lg hover:shadow-purple-500/25"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Volver al inicio de sesión
                    </button>
                    
                    <button
                        onClick={() => {
                            setIsSuccess(false)
                            setSubmittedEmail('')
                        }}
                        className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                        Intentar con otro correo
                    </button>
                </div>
            </div>
        )
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
                        autoComplete="email"
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

            {/* Mensaje informativo */}
            <p className="text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                Te enviaremos un enlace para restablecer tu contraseña. El enlace expirará en 1 hora.
            </p>

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
                        <FaSpinner className="w-5 h-5 animate-spin" />
                        <span>Enviando...</span>
                    </>
                ) : (
                    <>
                        <span>Enviar enlace</span>
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </motion.button>

            {/* Botón para volver */}
            <div className="text-center">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                >
                    <FaArrowLeft className="w-3 h-3" />
                    Volver al inicio de sesión
                </button>
            </div>
        </form>
    )
}

export default ForgotPasswordForm