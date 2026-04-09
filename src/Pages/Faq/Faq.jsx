// src/Pages/FAQ/FAQ.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    FiChevronDown, 
    FiChevronUp, 
    FiShoppingBag, 
    FiTruck, 
    FiCreditCard, 
    FiRefreshCw,
    FiShield,
    FiPackage,
    FiHelpCircle,
    FiMessageCircle,
    FiMail,
    FiPhone,
    FiArrowRight
} from 'react-icons/fi'
import { Link } from 'react-router'

const Faq = () => {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            icon: FiShoppingBag,
            category: "Pedidos",
            question: "¿Cómo puedo realizar un pedido?",
            answer: "Para realizar un pedido, simplemente navega por nuestra tienda, selecciona los productos que deseas, añádelos al carrito y procede al checkout. Necesitarás crear una cuenta o iniciar sesión para completar la compra. Te guiaremos paso a paso durante todo el proceso.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: FiShoppingBag,
            category: "Pedidos",
            question: "¿Puedo modificar mi pedido después de realizarlo?",
            answer: "Si tu pedido aún no ha sido procesado, puedes contactarnos para modificarlo. Una vez que el pedido está en proceso de preparación, no podemos realizar cambios. Te recomendamos revisar todos los detalles antes de confirmar la compra.",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: FiTruck,
            category: "Envíos",
            question: "¿Cuánto tiempo tarda el envío?",
            answer: "Los tiempos de envío varían según tu ubicación. Para envíos nacionales, el plazo es de 3-7 días hábiles. Para envíos express, 1-2 días hábiles. Recibirás un número de seguimiento por email una vez que tu pedido sea enviado.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: FiTruck,
            category: "Envíos",
            question: "¿Hacen envíos internacionales?",
            answer: "Actualmente realizamos envíos solo dentro del territorio nacional. Estamos trabajando para expandirnos internacionalmente muy pronto. Suscríbete a nuestro newsletter para recibir actualizaciones sobre nuevos destinos de envío.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: FiTruck,
            category: "Envíos",
            question: "¿Cómo puedo rastrear mi pedido?",
            answer: "Una vez que tu pedido sea enviado, recibirás un correo electrónico con un número de seguimiento. Puedes usar este número en nuestra página de seguimiento o directamente en la web de la empresa de mensajería para ver el estado actual de tu envío.",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: FiCreditCard,
            category: "Pagos",
            question: "¿Qué métodos de pago aceptan?",
            answer: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria, Mercado Pago, PayPal y pago en efectivo en nuestras sucursales habilitadas. Todos los pagos son procesados de forma segura con encriptación SSL.",
            color: "from-green-500 to-green-600"
        },
        {
            icon: FiCreditCard,
            category: "Pagos",
            question: "¿Es seguro pagar con tarjeta en su sitio?",
            answer: "¡Absolutamente! Utilizamos tecnología de encriptación SSL de última generación para proteger tus datos. Además, todos los pagos se procesan a través de pasarelas de pago certificadas que cumplen con los más altos estándares de seguridad de la industria.",
            color: "from-green-500 to-green-600"
        },
        {
            icon: FiRefreshCw,
            category: "Devoluciones",
            question: "¿Cuál es la política de devoluciones?",
            answer: "Aceptamos devoluciones dentro de los 14 días posteriores a la recepción del pedido. Los productos deben estar en su estado original, sin usar y con el empaque intacto. Los productos personalizados o de higiene no aceptan devoluciones por razones de seguridad.",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: FiRefreshCw,
            category: "Devoluciones",
            question: "¿Cómo solicito una devolución?",
            answer: "Para solicitar una devolución, inicia sesión en tu cuenta, ve a la sección de pedidos, selecciona el producto que deseas devolver y sigue las instrucciones. También puedes contactarnos a través de nuestro formulario de contacto o por email a devoluciones@ecommerce.com.",
            color: "from-orange-500 to-orange-600"
        },
        {
            icon: FiShield,
            category: "Garantía",
            question: "¿Tienen garantía los productos?",
            answer: "Sí, todos nuestros productos cuentan con garantía legal de 1 año contra defectos de fabricación. Para productos electrónicos, la garantía cubre fallas eléctricas y mecánicas. Conserva tu comprobante de compra para hacer efectiva la garantía si es necesario.",
            color: "from-pink-500 to-pink-600"
        },
        {
            icon: FiPackage,
            category: "Productos",
            question: "¿Cómo saber si un producto está disponible?",
            answer: "En la página de cada producto podrás ver el stock disponible en tiempo real. Si un producto está agotado, puedes registrarte para recibir una notificación cuando vuelva a estar disponible. También puedes ver la disponibilidad en tiendas físicas si las hubiera.",
            color: "from-teal-500 to-teal-600"
        },
        {
            icon: FiPackage,
            category: "Productos",
            question: "¿Puedo reservar un producto que está agotado?",
            answer: "Actualmente no contamos con sistema de reservas para productos agotados. Sin embargo, puedes activar las notificaciones de disponibilidad para que te avisemos por email cuando el producto vuelva a estar en stock.",
            color: "from-teal-500 to-teal-600"
        }
    ]

    const categories = [...new Map(faqs.map(faq => [faq.category, faq])).values()]

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

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
                            <FiHelpCircle className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios
                    </p>
                </motion.div>

                {/* Categorías rápidas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const element = document.getElementById(`category-${category.category}`)
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                            }}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all border border-gray-200 dark:border-gray-700 text-sm font-medium"
                        >
                            {category.category}
                        </button>
                    ))}
                </motion.div>

                {/* FAQs agrupados por categoría */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {Object.entries(
                        faqs.reduce((acc, faq) => {
                            if (!acc[faq.category]) acc[faq.category] = []
                            acc[faq.category].push(faq)
                            return acc
                        }, {})
                    ).map(([category, categoryFaqs]) => (
                        <motion.div
                            key={category}
                            id={`category-${category}`}
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                {category}
                            </h2>
                            
                            {categoryFaqs.map((faq, idx) => {
                                const globalIndex = faqs.findIndex(f => f.question === faq.question)
                                const isOpen = openIndex === globalIndex
                                
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleAccordion(globalIndex)}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className={`p-2 bg-gradient-to-r ${faq.color} rounded-xl text-white flex-shrink-0`}>
                                                    <faq.icon className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-gray-800 dark:text-white text-base md:text-lg">
                                                    {faq.question}
                                                </span>
                                            </div>
                                            <div className="flex-shrink-0 ml-4">
                                                {isOpen ? (
                                                    <FiChevronUp className="w-5 h-5 text-purple-500" />
                                                ) : (
                                                    <FiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                                )}
                                            </div>
                                        </button>
                                        
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700">
                                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                                            {faq.answer}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Sección de contacto */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-100 dark:border-purple-800"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <FiMessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                    ¿No encuentras lo que buscas?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Nuestro equipo está aquí para ayudarte
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/contact"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25"
                            >
                                <FiMail className="w-4 h-4" />
                                <span>Contactar soporte</span>
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="tel:+34123456789"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-purple-200 dark:border-purple-700"
                            >
                                <FiPhone className="w-4 h-4" />
                                <span>Llamar ahora</span>
                            </a>
                        </div>
                    </div>
                    
                    {/* Horario de atención */}
                    <div className="mt-6 pt-6 border-t border-purple-200 dark:border-purple-800 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            📞 Atención al cliente: Lunes a Viernes de 9:00 a 18:00
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Faq