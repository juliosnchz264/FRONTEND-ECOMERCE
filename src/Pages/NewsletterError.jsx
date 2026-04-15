// src/Pages/NewsletterError.jsx
import { Link, useSearchParams } from 'react-router-dom'
import { FiXCircle, FiArrowRight } from 'react-icons/fi'

const NewsletterError = () => {
    const [searchParams] = useSearchParams()
    const reason = searchParams.get('reason')
    
    const getMessage = () => {
        switch(reason) {
            case 'missing-email':
                return 'No se proporcionó una dirección de email válida.'
            case 'confirmation-error':
                return 'Hubo un problema al confirmar tu suscripción.'
            default:
                return 'Hubo un error al procesar tu solicitud.'
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiXCircle className="w-10 h-10 text-red-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    Error de confirmación
                </h1>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {getMessage()}
                </p>
                
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Por favor, intenta suscribirte nuevamente desde nuestro sitio web.
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

export default NewsletterError