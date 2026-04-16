// src/Components/Footer/Footer.jsx
import { Link } from 'react-router-dom'
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiFacebook,
    FiTwitter,
    FiInstagram,
    FiGithub,
    FiHeart,
    FiSend,
    FiTag,
    FiPackage,
    FiHome,
    FiStar,
    FiCheckCircle,
    FiAlertCircle,
} from 'react-icons/fi'
import { useState } from 'react'
import { useProduct } from '../../Hooks/useProduct'
import toast from 'react-hot-toast'
import api from '../../services/api'

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const [email, setEmail] = useState('')
    const [newsletterStatus, setNewsletterStatus] = useState(null)
    const { categories } = useProduct()
    const quickCategories = categories?.slice(0, 4) || []

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault()
        if (!email) return

        setNewsletterStatus('loading')
        
        try {
            const { data } = await api.post('/newsletter/subscribe', { email })

            if (data.success) {
                setNewsletterStatus('success')
                toast.success(data.message || '¡Gracias por suscribirte!')
                setEmail('')
                setTimeout(() => setNewsletterStatus(null), 3000)
            } else {
                setNewsletterStatus('error')
                toast.error(data.message || 'Error al suscribirte')
                setTimeout(() => setNewsletterStatus(null), 3000)
            }
        } catch (error) {
            console.error('Error en suscripción:', error)
            setNewsletterStatus('error')
            toast.error('Error de conexión. Intenta nuevamente.')
            setTimeout(() => setNewsletterStatus(null), 3000)
        }
    }

    return (
        <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white mt-auto transition-colors duration-300">
            {/* Línea decorativa superior */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
                    {/* Columna 1: Logo y descripción */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">
                                    E
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                                E-Commerce
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            Tu tienda online de confianza. Encuentra los mejores
                            productos con los precios más competitivos y la
                            mejor calidad.
                        </p>

                        <div className="flex gap-2 pt-2">
                            <a
                                href="https://www.facebook.com/chris.joslin.5832/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#1877f2] hover:text-white transition-all hover:scale-110"
                            >
                                <FiFacebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://x.com/julio264eduu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#1da1f2] hover:text-white transition-all hover:scale-110"
                            >
                                <FiTwitter className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.instagram.com/juliooosnchzzz/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#d62976] hover:to-[#962fbf] hover:text-white transition-all hover:scale-110"
                            >
                                <FiInstagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://github.com/juliosnchz264"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 bg-gray-200 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#333] hover:text-white transition-all hover:scale-110"
                            >
                                <FiGithub className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Categorías */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 relative inline-block">
                            <FiTag className="inline-block mr-2 w-4 h-4 text-purple-500 dark:text-purple-400" />
                            Categorías
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2 group"
                                >
                                    <FiPackage className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                    <span>Todos los productos</span>
                                </Link>
                            </li>
                            {quickCategories.map((cat) => (
                                <li key={cat._id}>
                                    <Link
                                        to={`/?categoria=${encodeURIComponent(cat.name)}`}
                                        onClick={() => {
                                            if (window.filterByCategory) {
                                                window.filterByCategory(
                                                    cat.name,
                                                    null,
                                                )
                                            }
                                        }}
                                        className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2 group"
                                    >
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full group-hover:w-2 group-hover:bg-purple-300 transition-all"></span>
                                        <span className="text-sm">
                                            {cat.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Información útil */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 relative inline-block">
                            <FiStar className="inline-block mr-2 w-4 h-4 text-purple-500 dark:text-purple-400" />
                            Información útil
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2"
                                >
                                    <FiHome className="w-3 h-3" />
                                    <span>Inicio</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"></span>
                                    <span>Contacto</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/faq"
                                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"></span>
                                    <span>Preguntas frecuentes</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"></span>
                                    <span>Política de privacidad</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/terms"
                                    className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all flex items-center gap-2"
                                >
                                    <span className="w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full"></span>
                                    <span>Términos y condiciones</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto y newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 relative inline-block">
                            Contacto
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300 group">
                                <FiMail className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                <a 
                                    href="mailto:julio264edu@gmail.com"
                                    className="text-sm break-all hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                >
                                    julio264edu@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <FiPhone className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                <span>+34 123 456 789</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                <FiMapPin className="w-5 h-5 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                                <span>Mallorca, España</span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="pt-2">
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                                Newsletter
                            </h4>
                            <form
                                onSubmit={handleNewsletterSubmit}
                                className="flex"
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Tu email"
                                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-l-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm transition-colors"
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={newsletterStatus === 'loading'}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-r-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 flex items-center justify-center min-w-[42px]"
                                >
                                    {newsletterStatus === 'loading' ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : newsletterStatus === 'success' ? (
                                        <FiCheckCircle className="w-4 h-4" />
                                    ) : newsletterStatus === 'error' ? (
                                        <FiAlertCircle className="w-4 h-4" />
                                    ) : (
                                        <FiSend className="w-4 h-4" />
                                    )}
                                </button>
                            </form>
                            {newsletterStatus === 'success' && (
                                <p className="text-xs text-green-500 dark:text-green-400 mt-2 animate-fadeIn">
                                    ¡Gracias por suscribirte!
                                </p>
                            )}
                            {newsletterStatus === 'error' && (
                                <p className="text-xs text-red-500 dark:text-red-400 mt-2 animate-fadeIn">
                                    Error al suscribirte. Intenta nuevamente.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Barra inferior */}
                <div className="border-t border-gray-200 dark:border-gray-700/50 pt-6 mt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            © {currentYear} E-Commerce. Todos los derechos
                            reservados.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm flex items-center gap-1">
                            Hecho con{' '}
                            <FiHeart className="text-red-500 animate-pulse w-3 h-3 sm:w-4 sm:h-4" />{' '}
                            por Julio
                        </p>
                        <div className="flex gap-4 text-xs sm:text-sm">
                            <Link
                                to="/privacy"
                                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                Privacidad
                            </Link>
                            <Link
                                to="/terms"
                                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                Términos
                            </Link>
                            <Link
                                to="/contact"
                                className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                Contacto
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer