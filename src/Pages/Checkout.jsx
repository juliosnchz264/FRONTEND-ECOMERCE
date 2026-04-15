// src/Pages/Checkout.jsx
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCart } from '../Hooks/useCart.js'
import { useUser } from '../Hooks/useUser.js'
import { createOrder } from '../services/orderServices'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/formatPrice.js'
import { 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiHome, 
    FiMap, 
    FiShoppingBag, 
    FiTruck,
    FiCreditCard,
    FiShield,
    FiCheckCircle,
    FiArrowRight,
    FiPackage
} from 'react-icons/fi'
import { motion } from 'framer-motion'
// Dominios permitidos para la pasarela de pago
const ALLOWED_PAYMENT_DOMAINS = [
    'mercadopago.com',
    'mercadolibre.com',
    'stripe.com',
    'checkout.stripe.com',
    'js.stripe.com',
    'paypal.com',
    'sandbox.paypal.com',
]

const isAllowedPaymentUrl = (url) => {
    try {
        const parsed = new URL(url)
        if (!['https:'].includes(parsed.protocol)) return false
        return ALLOWED_PAYMENT_DOMAINS.some(domain =>
            parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
        )
    } catch {
        return false
    }
}

const Checkout = () => {
    const { cart, total, clearCart, loading: cartLoading } = useCart()
    const { userInfo } = useUser() 
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: userInfo?.email || '',
            phone: '',
            street: '',
            number: '',
            city: '',
            state: '',
            zipCode: '',
        },
        mode: 'onChange',
    })

    if (cartLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Cargando carrito...</p>
                </div>
            </div>
        )
    }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
            if (!userInfo?.id && !userInfo?._id) {
                toast.error("Debes estar logueado para realizar la compra");
                setLoading(false);
                return;
            }

            // userId is derived from JWT on the backend — don't send it in the body
            const orderData = {
                items: cart.map((item) => ({
                    id: item._id,
                    name: item.name,
                    quantity: item.quantity || 1,
                    unit_price: item.price,
                    imageUrl: item.imageUrl,
                })),
                payer: {
                    email: data.email,
                },
                shippingInfo: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phone: data.phone,
                    address: {
                        street: data.street,
                        number: data.number,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zipCode,
                        country: 'ES' 
                    },
                },
            }

            const response = await createOrder(orderData)

            if (response.success && response.paymentUrl) {
                toast.success('Orden generada. Redirigiendo al pago seguro...')
                sessionStorage.setItem('checkoutCart', JSON.stringify(cart))
                
                const cleanUrl = response.paymentUrl.trim()
                if (!isAllowedPaymentUrl(cleanUrl)) {
                    throw new Error('URL de pago no permitida')
                }
                window.location.href = cleanUrl
            } else {
                throw new Error('No se pudo obtener la pasarela de pago')
            }
        } catch (error) {
            console.error("Error en Checkout:", error)
            toast.error('Hubo un error al procesar tu pago. Revisa los datos.')
        } finally {
            setLoading(false)
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                            <FiShoppingBag className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                        Finalizar Compra
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Completa tus datos para proceder con el pago seguro
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulario de información de envío */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
                    >
                        {/* Header decorativo */}
                        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                        
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                    <FiMapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                    Información de Entrega
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                {/* Nombre y Apellido */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                <FiUser className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...register('firstName', { required: 'Requerido' })}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                                                    errors.firstName
                                                        ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                                                }`}
                                                type="text"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Campo requerido</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Apellido
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                <FiUser className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...register('lastName', { required: 'Requerido' })}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                                                    errors.lastName
                                                        ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                                        : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                                                }`}
                                                type="text"
                                                placeholder="Tu apellido"
                                            />
                                        </div>
                                        {errors.lastName && (
                                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Campo requerido</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email y Teléfono */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                <FiMail className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...register('email', { required: 'Email requerido' })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                                type="email"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                <FiPhone className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...register('phone', { required: 'Teléfono requerido' })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                                type="tel"
                                                placeholder="+34 123 456 789"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Calle y Número */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Calle
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                <FiHome className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...register('street', { required: 'Requerido' })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                                type="text"
                                                placeholder="Calle Principal"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Número
                                        </label>
                                        <input
                                            {...register('number', { required: 'Requerido' })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                            type="text"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>

                                {/* Ciudad, Provincia y CP */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Ciudad
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                                <FiMap className="w-4 h-4" />
                                            </div>
                                            <input
                                                {...register('city', { required: 'Requerido' })}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                                type="text"
                                                placeholder="Madrid"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Provincia
                                        </label>
                                        <input
                                            {...register('state', { required: 'Requerido' })}
                                            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                                                errors.state
                                                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                                    : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                                            }`}
                                            type="text"
                                            placeholder="Madrid"
                                        />
                                        {errors.state && (
                                            <p className="text-red-500 dark:text-red-400 text-xs mt-1">Campo requerido</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Código Postal
                                        </label>
                                        <input
                                            {...register('zipCode', { required: 'Requerido' })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                            type="text"
                                            placeholder="28001"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || cart.length === 0}
                                    className={`w-full py-3 px-4 mt-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 ${
                                        (loading || cart.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Validando Orden...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiCreditCard className="w-5 h-5" />
                                            <span>Proceder al Pago Seguro</span>
                                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Resumen de la orden */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:sticky lg:top-8"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                            {/* Header decorativo */}
                            <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                            
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                        <FiPackage className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Resumen del Pedido
                                    </h2>
                                </div>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                    {cart.map((item) => (
                                        <div key={item._id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <img 
                                                src={item.imageUrl} 
                                                alt={item.name} 
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-800 dark:text-white text-sm line-clamp-2">
                                                    {item.name}
                                                </h3>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Cantidad: {item.quantity}
                                                    </span>
                                                    <span className="font-bold text-purple-600 dark:text-purple-400">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider my-4 dark:border-gray-700"></div>

                                {/* Totales */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="font-semibold text-gray-800 dark:text-white">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">Envío</span>
                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                            {total >= 40 ? 'Gratis' : 'Por calcular'}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-800 dark:text-white">Total</span>
                                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {formatPrice(total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Beneficios */}
                                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiShield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                                            Compra Segura
                                        </span>
                                    </div>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">
                                        Tus datos están protegidos con encriptación SSL. Pago 100% seguro.
                                    </p>
                                </div>

                                {total >= 50 && (
                                    <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
                                        <FiTruck className="w-4 h-4" />
                                        <span className="text-sm font-medium">¡Envío gratis incluido!</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Checkout