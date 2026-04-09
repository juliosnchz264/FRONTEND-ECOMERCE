// src/Pages/Privacy/Privacy.jsx
import { motion } from 'framer-motion'
import { FaShieldAlt, FaDatabase, FaLock, FaUserShield, FaChartLine, FaCookieBite } from 'react-icons/fa'

const Privacy = () => {
    const sections = [
        {
            icon: FaDatabase,
            title: "1. Información que recopilamos",
            content: "En E-Commerce, recopilamos información personal que nos proporcionas directamente, como tu nombre, dirección de correo electrónico, dirección de envío y detalles de pago cuando realizas una compra o te registras en nuestra plataforma. También podemos recopilar información automáticamente sobre tu navegación y dispositivo para mejorar nuestros servicios.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: FaChartLine,
            title: "2. Cómo usamos tu información",
            content: "Utilizamos la información recopilada para:",
            list: [
                "Procesar tus pedidos y gestionar tu cuenta",
                "Enviarte confirmaciones de pedidos y actualizaciones",
                "Mejorar nuestra plataforma y personalizar tu experiencia",
                "Enviarte ofertas y promociones (si has dado tu consentimiento)",
                "Prevenir fraudes y garantizar la seguridad de las transacciones"
            ],
            color: "from-green-500 to-green-600"
        },
        {
            icon: FaLock,
            title: "3. Protección de datos",
            content: "Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos personales contra acceso no autorizado, pérdida o alteración. Toda la información sensible se transmite mediante encriptación SSL (Secure Socket Layer). Nuestros sistemas son auditados regularmente para garantizar el cumplimiento de los más altos estándares de seguridad.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: FaUserShield,
            title: "4. Compartir información",
            content: "No vendemos, comerciamos ni transferimos tu información personal a terceros sin tu consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios (por ejemplo, procesadores de pagos, empresas de envío). Todos nuestros socios cumplen con estrictas políticas de confidencialidad.",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: FaCookieBite,
            title: "5. Cookies y tecnologías similares",
            content: "Utilizamos cookies para mejorar tu experiencia de navegación, recordar tus preferencias y analizar el tráfico. Puedes gestionar tus preferencias de cookies en la configuración de tu navegador. Las cookies esenciales son necesarias para el funcionamiento básico de la plataforma.",
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: FaShieldAlt,
            title: "6. Tus derechos",
            content: "Tienes derecho a acceder, corregir, actualizar o eliminar tu información personal en cualquier momento. También puedes oponerte al procesamiento de tus datos o solicitar la portabilidad de los mismos. Para ejercer estos derechos, contáctanos a través de privacidad@ecommerce.com o mediante nuestro formulario de contacto.",
            color: "from-red-500 to-red-600"
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                            <FaShieldAlt className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Política de Privacidad
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Última actualización: {new Date().toLocaleDateString('es-ES', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                        })}
                    </p>
                </motion.div>

                {/* Contenido */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
                        >
                            {/* Header decorativo */}
                            <div className={`h-1 bg-gradient-to-r ${section.color}`}></div>
                            
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 bg-gradient-to-r ${section.color} rounded-xl text-white`}>
                                        <section.icon className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white">
                                        {section.title}
                                    </h2>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {section.content}
                                </p>
                                
                                {section.list && (
                                    <ul className="mt-4 space-y-2">
                                        {section.list.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                                <span className="inline-block w-1.5 h-1.5 bg-purple-500 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Sección de contacto adicional */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 md:p-8 border border-purple-100 dark:border-purple-800"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                                <FaUserShield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    ¿Tienes preguntas sobre tu privacidad?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    Si tienes alguna duda sobre cómo manejamos tus datos personales, no dudes en contactarnos.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a 
                                        href="/contact" 
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                    >
                                        Contactar soporte
                                    </a>
                                    <a 
                                        href="mailto:privacidad@ecommerce.com" 
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-purple-200 dark:border-purple-700 text-sm"
                                    >
                                        privacidad@ecommerce.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aviso de cambios */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center pt-4"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
                            Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Privacy