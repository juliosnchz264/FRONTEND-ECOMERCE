import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { FiMail, FiArrowLeft, FiLoader, FiCheckCircle } from 'react-icons/fi'

const VerifyEmailPending = () => {
    const location = useLocation()
    const { email, message } = location.state || { 
        email: '', 
        message: 'Hemos enviado un enlace de confirmación a tu correo electrónico.'
    }
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)

    const handleResend = async () => {
        setResendLoading(true)
        // Aquí iría la lógica para reenviar el email
        setTimeout(() => {
            setResendLoading(false)
            setResendSuccess(true)
            setTimeout(() => setResendSuccess(false), 5000)
        }, 1500)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Verifica tu email</h1>
                    <p className="text-gray-600">¡Ya casi estamos! Solo falta un paso</p>
                </div>

                {/* Card principal */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiMail className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            ¡Registro exitoso! 🎉
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {message}
                        </p>
                        {email && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Hemos enviado el email a: <br />
                                    <span className="font-semibold text-purple-700">{email}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                            <FiCheckCircle className="w-5 h-5" />
                            ¿No recibiste el email?
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>• Revisa tu carpeta de <strong>SPAM</strong> o correo no deseado</li>
                            <li>• Asegúrate de haber escrito correctamente tu email</li>
                            <li>• Espera unos minutos (puede demorar)</li>
                        </ul>
                    </div>

                    {/* Botón para reenviar */}
                    <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-4"
                    >
                        {resendLoading ? (
                            <>
                                <FiLoader className="w-5 h-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            'Reenviar email de confirmación'
                        )}
                    </button>

                    {resendSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-4 text-center">
                            ✅ Email reenviado correctamente. Revisa tu bandeja de entrada.
                        </div>
                    )}

                    {/* Link a login */}
                    <div className="text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailPending