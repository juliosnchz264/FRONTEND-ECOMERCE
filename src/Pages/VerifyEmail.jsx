import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FiCheckCircle, FiXCircle, FiLoader, FiMail } from 'react-icons/fi'

const VerifyEmail = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const token = searchParams.get('token')
    
    const [status, setStatus] = useState('loading') // loading, success, error
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [countdown, setCountdown] = useState(3)

    useEffect(() => {
        if (token) {
            verifyEmailToken()
        } else {
            setStatus('error')
            setMessage('Token de verificación no proporcionado')
        }
    }, [token])

    useEffect(() => {
        let timer
        if (status === 'success' && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        } else if (status === 'success' && countdown === 0) {
            navigate('/login')
        }
        return () => clearTimeout(timer)
    }, [status, countdown, navigate])

    const verifyEmailToken = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/auth/verify/${token}`
            )
            setStatus('success')
            setMessage(response.data.message || 'Email verificado correctamente')
            
            // Extraer email de la respuesta si el backend lo envía
            if (response.data.email) {
                setEmail(response.data.email)
            }
            
        } catch (error) {
            setStatus('error')
            setMessage(error.response?.data?.message || 'Error al verificar email')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Verificación de Email</h1>
                    <p className="text-gray-600">Confirmando tu cuenta</p>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {status === 'loading' && (
                        <div className="text-center py-8">
                            <FiLoader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando...</h2>
                            <p className="text-gray-600">Por favor espera mientras verificamos tu email</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                ¡Email Verificado!
                            </h2>
                            
                            <p className="text-gray-600 mb-4">
                                {message}
                            </p>

                            {email && (
                                <div className="bg-purple-50 p-3 rounded-lg mb-6">
                                    <p className="text-sm text-gray-600">
                                        Cuenta verificada para: <br />
                                        <span className="font-semibold text-purple-700">{email}</span>
                                    </p>
                                </div>
                            )}

                            <p className="text-gray-500 mb-2">
                                Serás redirigido al login en <span className="font-bold text-purple-600">{countdown}</span> segundos...
                            </p>
                            
                            <Link
                                to="/login"
                                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-semibold transition-all"
                            >
                                Ir al login ahora
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiXCircle className="w-10 h-10 text-red-600" />
                            </div>
                            
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Error de Verificación
                            </h2>
                            
                            <p className="text-gray-600 mb-6">{message}</p>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
                                <h3 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                                    <FiMail className="w-5 h-5" />
                                    ¿Problemas?
                                </h3>
                                <ul className="text-sm text-yellow-700 space-y-2">
                                    <li>• El enlace puede haber expirado (válido por 24 horas)</li>
                                    <li>• El token ya fue utilizado anteriormente</li>
                                    <li>• Hubo un problema con el enlace</li>
                                </ul>
                            </div>

                            <Link
                                to="/login"
                                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-semibold transition-all"
                            >
                                Ir al inicio de sesión
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail