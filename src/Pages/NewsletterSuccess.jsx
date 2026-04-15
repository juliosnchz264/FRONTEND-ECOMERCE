// src/Pages/NewsletterSuccess.jsx
import { Link, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi'

const NewsletterSuccess = () => {
    const [searchParams] = useSearchParams()
    const rawEmail = searchParams.get('email')
    // Validate email format before displaying — prevents arbitrary text injection via URL
    const email = rawEmail && /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(rawEmail.trim())
        ? rawEmail.trim()
        : null
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    ¡Suscripción confirmada!
                </h1>
                
                {email && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        El email <strong>{email}</strong> ha sido verificado exitosamente.
                    </p>
                )}
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    A partir de ahora recibirás nuestras novedades, ofertas exclusivas y promociones especiales.
                </p>
                
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                    <span>Volver a la tienda</span>
                    <FiArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    )
}

export default NewsletterSuccess