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
    FaRedoAlt
} from 'react-icons/fa'
import toast from 'react-hot-toast'
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
                    <div className="badge badge-success gap-2 py-3 px-4 text-white font-bold">
                        <FaCheckCircle /> Completado
                    </div>
                )
            case 'pending':
                return (
                    <div className="badge badge-warning gap-2 py-3 px-4 font-bold">
                        <FaClock /> Pendiente
                    </div>
                )
            case 'processing':
                return (
                    <div className="badge badge-info gap-2 py-3 px-4 font-bold">
                        <FaClock /> Procesando
                    </div>
                )
            case 'shipped':
                return (
                    <div className="badge badge-primary gap-2 py-3 px-4 font-bold">
                        <FaShippingFast /> Enviado
                    </div>
                )
            case 'cancelled':
                return (
                    <div className="badge badge-error gap-2 py-3 px-4 font-bold">
                        <FaExclamationCircle /> Cancelado
                    </div>
                )
            default:
                return (
                    <div className="badge badge-ghost gap-2 py-3 px-4 font-bold">
                        <FaExclamationCircle /> {status || 'Desconocido'}
                    </div>
                )
        }
    }

    const fetchOrders = async () => {
        // Obtener el ID del usuario (puede estar en id o _id)
        const userId = userInfo?.id || userInfo?._id
        
        console.log("--- DEBUG ORDERS PAGE ---")
        console.log("Auth Loading:", authLoading)
        console.log("User Info:", userInfo)
        console.log("User ID:", userId)

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
            
            console.log('🔍 Solicitando órdenes para usuario:', userId)
            
            // 🔴 PASAR EL USERID COMO PARÁMETRO
            const data = await getUserOrders(userId)
            
            console.log('✅ Órdenes recibidas:', data)
            
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

    // Resto del componente igual...
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        )
    }

    if (!userInfo?.id && !userInfo?._id) {
        return (
            <div className="container mx-auto px-4 py-10 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <FaExclamationCircle className="text-6xl mx-auto mb-4 text-warning" />
                    <h2 className="text-2xl font-bold mb-2">No has iniciado sesión</h2>
                    <p className="text-base-content/60 mb-6">Inicia sesión para ver tus pedidos</p>
                    <Link to="/login" className="btn btn-primary">
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-10 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <FaExclamationCircle className="text-6xl mx-auto mb-4 text-error" />
                    <h2 className="text-2xl font-bold mb-2">Error al cargar pedidos</h2>
                    <p className="text-base-content/60 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={handleRetry}
                            className="btn btn-primary"
                        >
                            <FaRedoAlt className="mr-2" /> Reintentar
                        </button>
                        <Link to="/" className="btn btn-ghost">
                            Ir a tienda
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-black flex items-center gap-3">
                    <FaBox className="text-primary" /> Mis Pedidos
                </h1>
                <p className="text-base-content/60 mt-2">
                    {userInfo?.username || userInfo?.email ? `Hola, ${userInfo.username || userInfo.email}` : 'Gestiona tus compras y revisa el estado de tus envíos.'}
                </p>
            </header>

            {orders.length === 0 ? (
                <div className="bg-base-200 border-2 border-dashed border-base-300 rounded-3xl p-20 text-center">
                    <FaShoppingBag className="text-6xl mx-auto mb-4 opacity-20" />
                    <h2 className="text-2xl font-bold opacity-50">Parece que aún no has comprado nada</h2>
                    <p className="text-base-content/40 mt-2 mb-6">Explora nuestros productos y realiza tu primera compra</p>
                    <Link to="/" className="btn btn-primary">
                        Ir a la tienda
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="collapse collapse-arrow bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                            <input type="checkbox" /> 
                            
                            <div className="collapse-title p-6 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-3 rounded-xl text-primary hidden sm:block">
                                        <FaReceipt size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">
                                            Orden #{order._id?.slice(-8).toUpperCase()}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-semibold">
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
                                        <p className="text-[10px] uppercase opacity-50 font-bold">Total</p>
                                        <p className="text-xl font-black text-primary">
                                            ${order.totalAmount?.toLocaleString() || order.total?.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    {renderStatus(order.status)}
                                </div>
                            </div>

                            <div className="collapse-content px-6 pb-6">
                                <div className="divider opacity-50"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                    <div>
                                        <h4 className="font-bold mb-4 flex items-center gap-2">
                                            <FaBox className="text-xs" /> Productos ({order.products?.length || order.items?.length || 0})
                                        </h4>
                                        <ul className="space-y-3">
                                            {(order.products || order.items || []).map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-base-200/50 p-3 rounded-lg border border-base-300/50">
                                                    <span className="text-sm font-medium">
                                                        <span className="badge badge-sm badge-outline mr-2">
                                                            {item.quantity || item.cantidad || 1}
                                                        </span>
                                                        {item.name || item.productId?.name || 'Producto'}
                                                    </span>
                                                    <span className="font-mono font-bold">
                                                        ${((item.price || item.precio || 0) * (item.quantity || item.cantidad || 1)).toLocaleString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-base-200/50 rounded-2xl p-6">
                                        <h4 className="font-bold mb-3 flex items-center gap-2">
                                            <FaShippingFast className="text-xs" /> Información de Envío
                                        </h4>
                                        {order.shippingInfo || order.shippingAddress ? (
                                            <div className="text-sm space-y-1 opacity-80">
                                                {order.shippingInfo?.firstName && order.shippingInfo?.lastName && (
                                                    <p className="font-bold text-base-content">
                                                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                                    </p>
                                                )}
                                                {order.shippingInfo?.address || order.shippingAddress ? (
                                                    <>
                                                        <p>
                                                            {order.shippingInfo?.address?.street || order.shippingAddress?.street} 
                                                            {order.shippingInfo?.address?.number || order.shippingAddress?.number ? ` ${order.shippingInfo?.address?.number || order.shippingAddress?.number}` : ''}
                                                        </p>
                                                        <p>
                                                            {order.shippingInfo?.address?.city || order.shippingAddress?.city}, 
                                                            {order.shippingInfo?.address?.state || order.shippingAddress?.state}
                                                        </p>
                                                        <p className="text-[10px] mt-2 font-mono">
                                                            CP: {order.shippingInfo?.address?.zipCode || order.shippingAddress?.zipCode}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm italic">Dirección no disponible</p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm italic">Información de envío no disponible</p>
                                        )}
                                        
                                        {order.stripeData?.receiptUrl && (
                                            <a 
                                                href={order.stripeData.receiptUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="btn btn-sm btn-outline btn-block mt-6 normal-case"
                                            >
                                                Ver Comprobante
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default OrdersPage