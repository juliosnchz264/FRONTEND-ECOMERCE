// src/Pages/Contact/Contact.jsx
import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock, FiMap } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        
        // Simular envío (conectar con backend después)
        setTimeout(() => {
            toast.success('Mensaje enviado correctamente. Te responderemos pronto.')
            setFormData({ name: '', email: '', subject: '', message: '' })
            setSubmitting(false)
        }, 1500)
    }

    const contactInfo = [
        {
            icon: FiMail,
            title: 'Email',
            details: ['soporte@ecommerce.com', 'ventas@ecommerce.com'],
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            icon: FiPhone,
            title: 'Teléfono',
            details: ['+34 123 456 789', 'Lun-Vie: 9:00 - 18:00'],
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            icon: FiMapPin,
            title: 'Dirección',
            details: ['Calle Principal 123', '28001 Madrid, España'],
            color: 'from-red-500 to-red-600',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        }
    ]

    const socialLinks = [
        { icon: FaWhatsapp, href: 'https://wa.me/34123456789', label: 'WhatsApp', color: 'hover:bg-green-500' },
        { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook', color: 'hover:bg-blue-600' },
        { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:bg-blue-400' },
        { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:bg-pink-600' }
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
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Contacto
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        ¿Tienes alguna pregunta? Estamos aquí para ayudarte. 
                        Envíanos un mensaje y te responderemos a la mayor brevedad posible.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                >
                    {/* Información de contacto */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Información de contacto
                        </h2>
                        
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="flex items-start gap-4 group">
                                    <div className={`w-12 h-12 ${info.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110`}>
                                        <info.icon className={`w-6 h-6 text-${info.color.split('-')[1]}-600 dark:text-${info.color.split('-')[1]}-400`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">{info.title}</h3>
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-gray-600 dark:text-gray-400">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mapa simplificado */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-3">
                                <FiMap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-white">Ubicación</h3>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl h-32 flex items-center justify-center">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Mapa interactivo próximamente</p>
                            </div>
                        </div>

                        {/* Redes sociales */}
                        <div className="mt-6">
                            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Síguenos</h3>
                            <div className="flex gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white ${social.color} transition-all duration-300 hover:scale-110`}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Horario */}
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <FiClock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Atención al cliente: Lunes a Viernes, 9:00 - 18:00
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Formulario de contacto */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 p-8 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                            Envíanos un mensaje
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Asunto
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                    placeholder="Asunto del mensaje"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mensaje
                                </label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors duration-200"
                                    placeholder="Escribe tu mensaje..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSend className="w-5 h-5" />
                                        <span>Enviar mensaje</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Mensaje de respuesta */}
                        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                            <p className="text-sm text-purple-600 dark:text-purple-400 text-center">
                                📬 Te responderemos en menos de 24 horas hábiles
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* FAQ Sugerencia */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-500 dark:text-gray-400">
                        ¿Preguntas frecuentes? Visita nuestra sección de{' '}
                        <a href="/faq" className="text-purple-600 dark:text-purple-400 hover:underline">
                            preguntas frecuentes
                        </a>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default Contact