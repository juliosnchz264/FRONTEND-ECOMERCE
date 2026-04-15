// src/Pages/OrdersPage.jsx
import { useEffect, useState } from 'react'
import { getUserOrders } from '../services/orderServices'
import { useUser } from '../Hooks/useUser.js'
import { 
    FaBox, 
    FaCalendarAlt, 
    FaReceipt, 
    FaShippingFast, 
    FaCheckCircle, 
    FaExclamationCircle, 
    FaShoppingBag,
    FaClock,
    FaRedoAlt,
    FaMapMarkerAlt,
    FaMoneyBillWave
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { formatPrice } from '../utils/formatPrice.js'
import { Link } from 'react-router'

const OrdersPage = () => {
    const { userInfo, loading: authLoading } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)

    const renderStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'completed':
            case 'delivered':
                return (
                    <div className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 gap-2 py-3 px-4 font-bold border-green-200 dark:border-green-800">
                        <FaCheckCircle /> Completado
                    </div>
                )
            case 'pending':
                return (
                    <div className="badge bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 gap-2 py-3 px-4 font-bold border-yellow-200 dark:border-yellow-800">
                        <FaClock /> Pendiente
                    </div>
                )
            case 'processing':
                return (
                    <div className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 gap-2 py-3 px-4 font-bold border-blue-200 dark:border-blue-800">
                        <FaClock /> Procesando
                    </div>
                )
            case 'shipped':
                return (
                    <div className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 gap-2 py-3 px-4 font-bold border-purple-200 dark:border-purple-800">
                        <FaShippingFast /> Enviado
                    </div>
                )
            case 'cancelled':
                return (
                    <div className="badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 gap-2 py-3 px-4 font-bold border-red-200 dark:border-red-800">
                        <FaExclamationCircle /> Cancelado
                    </div>
                )
            default:
                return (
                    <div className="badge bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 gap-2 py-3 px-4 font-bold border-gray-200 dark:border-gray-600">
                        <FaExclamationCircle /> {status || 'Desconocido'}
                    </div>
                )
        }
    }

    const fetchOrders = async () => {
        const userId = userInfo?.id || userInfo?._id
        
        if (!userId) {
            if (!authLoading) {
                setLoading(false)
                setError("No se pudo identificar al usuario")
            }
            return
        }

        try {
            setLoading(true)
            setError(null)
            
            const data = await getUserOrders(userId)
            
            if (data.success) {
                setOrders(data.orders || [])
            } else {
                setError(data.message || 'Error al cargar las órdenes')
            }
        } catch (error) {
            console.error("❌ Error al cargar órdenes:", error)
            setError(error.message || "No se pudieron cargar tus pedidos")
            toast.error("No se pudieron cargar tus pedidos")
        } finally {
            setLoading(false)
        }
    }

    const handleRetry = () => {
        setRetryCount(prev => prev + 1)
        fetchOrders()
    }

    useEffect(() => {
        if (!authLoading) {
            fetchOrders()
        }
    }, [userInfo, authLoading, retryCount])

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Cargando tus pedidos...</p>
                </div>
            </div>
        )
    }

    if (!userInfo?.id && !userInfo?._id) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationCircle className="text-5xl text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No has iniciado sesión</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Inicia sesión para ver tus pedidos</p>
                    <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25">
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationCircle className="text-5xl text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error al cargar pedidos</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                        >
                            <FaRedoAlt className="w-4 h-4" /> Reintentar
                        </button>
                        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                            Ir a tienda
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                            <FaBox className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h1 className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Mis Pedidos
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-14">
                        {userInfo?.username || userInfo?.email ? `Hola, ${userInfo.username || userInfo.email}` : 'Gestiona tus compras y revisa el estado de tus envíos.'}
                    </p>
                </motion.div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-20 text-center"
                    >
                        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaShoppingBag className="text-6xl text-gray-400 dark:text-gray-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Parece que aún no has comprado nada</h2>
                        <p className="text-gray-500 dark:text-gray-500 mt-2 mb-6">Explora nuestros productos y realiza tu primera compra</p>
                        <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25">
                            Ir a la tienda
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid gap-6">
                        <AnimatePresence>
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="collapse collapse-arrow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-2xl"
                                >
                                    <input type="checkbox" /> 
                                    
                                    <div className="collapse-title p-6 flex flex-wrap justify-between items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600 dark:text-purple-400 hidden sm:block">
                                                <FaReceipt size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                    Orden #{order._id?.slice(-8).toUpperCase()}
                                                </p>
                                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    <FaCalendarAlt className="opacity-40" />
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES', { 
                                                        day: '2-digit', 
                                                        month: 'long', 
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'Fecha no disponible'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase opacity-50 font-bold text-gray-500 dark:text-gray-400">Total</p>
                                                <p className="text-xl font-black text-purple-600 dark:text-purple-400">
                                                    ${order.totalAmount?.toLocaleString() || order.total?.toLocaleString() || '0'}
                                                </p>
                                            </div>
                                            {renderStatus(order.status)}
                                        </div>
                                    </div>

                                    <div className="collapse-content px-6 pb-6">
                                        <div className="divider opacity-50 dark:border-gray-700"></div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                            {/* Productos */}
                                            <div>
                                                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                                                    <FaBox className="text-xs" /> Productos ({order.products?.length || order.items?.length || 0})
                                                </h4>
                                                <ul className="space-y-3">
                                                    {(order.products || order.items || []).map((item, idx) => (
                                                        <li key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                <span className="badge badge-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 mr-2 border-none">
                                                                    {item.quantity || item.cantidad || 1}
                                                                </span>
                                                                {item.name || item.productId?.name || 'Producto'}
                                                            </span>
                                                            <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                                                {formatPrice((item.price || item.precio || 0) * (item.quantity || item.cantidad || 1))}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Información de envío */}
                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                                                <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-white">
                                                    <FaShippingFast className="text-xs" /> Información de Envío
                                                </h4>
                                                {order.shippingInfo || order.shippingAddress ? (
                                                    <div className="text-sm space-y-2">
                                                        {order.shippingInfo?.firstName && order.shippingInfo?.lastName && (
                                                            <p className="font-bold text-gray-800 dark:text-white">
                                                                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                                            </p>
                                                        )}
                                                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                                            <FaMapMarkerAlt className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                {order.shippingInfo?.address?.street || order.shippingAddress?.street}
                                                                {order.shippingInfo?.address?.number || order.shippingAddress?.number ? ` ${order.shippingInfo?.address?.number || order.shippingAddress?.number}` : ''}
                                                                <br />
                                                                {order.shippingInfo?.address?.city || order.shippingAddress?.city}, 
                                                                {order.shippingInfo?.address?.state || order.shippingAddress?.state}
                                                                <br />
                                                                <span className="text-[10px] font-mono">
                                                                    CP: {order.shippingInfo?.address?.zipCode || order.shippingAddress?.zipCode}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <FaMoneyBillWave className="w-3 h-3" />
                                                            <span>Método de pago: {order.paymentMethod || 'No especificado'}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm italic text-gray-500 dark:text-gray-400">Información de envío no disponible</p>
                                                )}
                                                
                                                {order.stripeData?.receiptUrl && (
                                                    <a 
                                                        href={order.stripeData.receiptUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer" 
                                                        className="btn btn-sm btn-outline btn-block mt-6 normal-case border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white"
                                                    >
                                                        Ver Comprobante
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrdersPage