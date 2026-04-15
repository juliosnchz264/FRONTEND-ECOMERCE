// src/Pages/Terms/Terms.jsx
import { motion } from 'framer-motion'
import { 
    FaFileContract, 
    FaShoppingCart, 
    FaCreditCard, 
    FaTruck, 
    FaShieldAlt, 
    FaGavel,
    FaUserCheck,
    FaExchangeAlt,
    FaHandshake
} from 'react-icons/fa'

const Terms = () => {
    const sections = [
        {
            icon: FaFileContract,
            title: "1. Aceptación de los términos",
            content: "Al acceder y utilizar los servicios de E-Commerce, aceptas cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder a nuestros servicios. Estos términos constituyen un acuerdo legal vinculante entre tú y E-Commerce.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: FaUserCheck,
            title: "2. Uso del servicio",
            content: "Nuestro servicio te permite comprar productos online. Debes ser mayor de 18 años para utilizar nuestros servicios o contar con autorización parental. Te comprometes a proporcionar información veraz y completa durante el proceso de registro y compra. Eres responsable de mantener la confidencialidad de tu cuenta y contraseña.",
            list: [
                "Ser mayor de 18 años o tener autorización parental",
                "Proporcionar información veraz y completa",
                "Mantener la confidencialidad de tu cuenta",
                "Notificar inmediatamente cualquier uso no autorizado",
                "No utilizar el servicio para fines ilegales"
            ],
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: FaCreditCard,
            title: "3. Precios y pagos",
            content: "Todos los precios se muestran en la moneda local (USD) e incluyen impuestos aplicables. Nos reservamos el derecho de modificar los precios en cualquier momento, pero los cambios no afectarán a pedidos ya confirmados. Aceptamos los siguientes métodos de pago:",
            list: [
                "Tarjetas de crédito y débito (Visa, Mastercard, American Express)",
                "Transferencia bancaria",
                "Mercado Pago / PayPal",
                "Pago en efectivo (sucursales habilitadas)"
            ],
            color: "from-green-500 to-green-600"
        },
        {
            icon: FaTruck,
            title: "4. Envíos y entregas",
            content: "Los plazos de envío son estimados y pueden variar según la ubicación y disponibilidad del producto. Realizamos envíos a todo el país con las siguientes características:",
            list: [
                "Envío estándar: 3-7 días hábiles",
                "Envío express: 1-2 días hábiles (disponible en zonas seleccionadas)",
                "Envío gratis en compras mayores a 40€",
                "Seguimiento en tiempo real de tu pedido",
                "Notificaciones por email y SMS del estado de tu envío"
            ],
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: FaExchangeAlt,
            title: "5. Devoluciones y reembolsos",
            content: "Aceptamos devoluciones dentro de los 14 días posteriores a la recepción del pedido, siempre que los productos estén en su estado original, sin uso y con su empaque original. Las condiciones para devoluciones son:",
            list: [
                "Producto sin uso y en perfectas condiciones",
                "Conservar el embalaje original",
                "Presentar el comprobante de compra",
                "Los productos personalizados no aceptan devoluciones",
                "Los gastos de envío por devolución corren por cuenta del cliente, excepto por productos defectuosos"
            ],
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: FaShieldAlt,
            title: "6. Garantía de productos",
            content: "Todos nuestros productos cuentan con garantía legal de 1 año contra defectos de fabricación. La garantía cubre:",
            list: [
                "Defectos de fabricación y materiales",
                "Fallas eléctricas o mecánicas (productos electrónicos)",
                "Reparación o reemplazo sin costo",
                "Soporte técnico post-venta"
            ],
            color: "from-teal-500 to-teal-600"
        },
        {
            icon: FaGavel,
            title: "7. Limitación de responsabilidad",
            content: "E-Commerce no será responsable por daños indirectos, incidentales o consecuentes que resulten del uso o la imposibilidad de usar nuestros servicios. Nuestra responsabilidad máxima se limita al monto total pagado por el producto en cuestión.",
            color: "from-red-500 to-red-600"
        },
        {
            icon: FaHandshake,
            title: "8. Modificaciones de los términos",
            content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en esta página. Te recomendamos revisar periódicamente los términos para estar informado de cualquier actualización.",
            color: "from-indigo-500 to-indigo-600"
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
                            <FaFileContract className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Términos y Condiciones
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

                    {/* Sección de aceptación */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 md:p-8 border border-purple-100 dark:border-purple-800"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex-shrink-0">
                                <FaShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    Al realizar una compra, aceptas estos términos
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    Al completar tu compra, confirmas que has leído, entendido y aceptado estos 
                                    términos y condiciones en su totalidad.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <a 
                                        href="/contact" 
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                    >
                                        Contactar soporte
                                    </a>
                                    <a 
                                        href="/privacy" 
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-purple-200 dark:border-purple-700 text-sm"
                                    >
                                        Política de privacidad
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Aviso legal */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center pt-4"
                    >
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            © {new Date().getFullYear()} E-Commerce. Todos los derechos reservados. 
                            Estos términos y condiciones constituyen el acuerdo completo entre tú y E-Commerce 
                            respecto al uso de nuestros servicios.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Terms