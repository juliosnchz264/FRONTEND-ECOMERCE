import { Link } from 'react-router-dom'
import { 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiFacebook, 
    FiTwitter, 
    FiInstagram, 
    FiGithub,
    FiYoutube,
    FiHeart
} from 'react-icons/fi'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-auto">
            {/* Curva decorativa superior */}
            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
            
            <div className="container mx-auto px-4 py-12">
                {/* Grid principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    
                    {/* Columna 1: Logo y descripción */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">E</span>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                E-Commerce
                            </h2>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Tu tienda online de confianza. Encuentra los mejores productos 
                            con los precios más competitivos y la mejor calidad.
                        </p>
                        
                        {/* Redes sociales */}
                        <div className="flex gap-3 pt-4">
                            <a 
                                href="https://facebook.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-all hover:scale-110"
                                aria-label="Facebook"
                            >
                                <FiFacebook className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://twitter.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all hover:scale-110"
                                aria-label="Twitter"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://instagram.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all hover:scale-110"
                                aria-label="Instagram"
                            >
                                <FiInstagram className="w-5 h-5" />
                            </a>
                            <a 
                                href="https://github.com" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-all hover:scale-110"
                                aria-label="GitHub"
                            >
                                <FiGithub className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Columna 2: Enlaces rápidos */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Enlaces rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/categories" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Categorías
                                </Link>
                            </li>
                            <li>
                                <Link to="/offers" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Ofertas
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Preguntas frecuentes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Páginas legales */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Información legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Contacto
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Política de privacidad
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Términos y condiciones
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-gray-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                                    Política de cookies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 4: Contacto y newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white mb-4">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-300">
                                <FiMail className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                                <span>soporte@ecommerce.com</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <FiPhone className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                                <span>+34 123 456 789</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-300">
                                <FiMapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                                <span>Madrid, España</span>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div className="pt-4">
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Newsletter</h4>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Tu email"
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-r-lg hover:from-purple-700 hover:to-purple-800 transition-colors">
                                    Suscribir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Barra inferior con copyright */}
                <div className="border-t border-gray-700 pt-8 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            © {currentYear} E-Commerce. Todos los derechos reservados.
                        </p>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                            Hecho con <FiHeart className="text-red-500 animate-pulse" /> para nuestros clientes
                        </p>
                        <div className="flex gap-4 text-sm">
                            <Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
                                Privacidad
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
                                Términos
                            </Link>
                            <Link to="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
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