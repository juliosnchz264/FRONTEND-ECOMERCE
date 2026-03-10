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
    FaClock
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import { Link } from 'react-router'

const OrdersPage = () => {
    // 1. ExtraemosuserInfo.id para vigilarlo específicamente
    const { userInfo, loading: authLoading } = useUser() 
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    const renderStatus = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return (
                    <div className="badge badge-success gap-2 py-3 px-4 text-white font-bold">
                        <FaCheckCircle /> Pagado
                    </div>
                )
            case 'pending':
                return (
                    <div className="badge badge-warning gap-2 py-3 px-4 font-bold">
                        <FaClock /> Pendiente
                    </div>
                )
            default:
                return (
                    <div className="badge badge-error gap-2 py-3 px-4 font-bold">
                        <FaExclamationCircle /> {status || 'Desconocido'}
                    </div>
                )
        }
    }

    useEffect(() => {
        const fetchOrders = async () => {
            // Buscamos el ID en ambas propiedades posibles
            const id = userInfo?.id || userInfo?._id;
            
            // 🔍 DEBUG PARA TI: Mira esto en la consola del navegador
            console.log("--- DEBUG ORDERS PAGE ---");
            console.log("Auth Loading:", authLoading);
            console.log("User Info ID:", id);

            if (!id) {
                // Si ya no está cargando el usuario y no hay ID, dejamos de cargar
                if (!authLoading) setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getUserOrders(id)
                if (data.success) {
                    setOrders(data.orders || [])
                }
            } catch (error) {
                console.error("Error al cargar órdenes:", error)
                toast.error("No se pudieron cargar tus pedidos")
            } finally {
                setLoading(false)
            }
        }

        // Ejecutar solo cuando el usuario ya no esté en proceso de autenticación
        if (!authLoading) {
            fetchOrders()
        }
        
    }, [userInfo, authLoading]) // 👈 Reacciona a cambios en userInfo e ID

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-bars loading-lg text-primary"></span>
            </div>
        )
    }

    // El resto del return se mantiene igual...
    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-black flex items-center gap-3">
                    <FaBox className="text-primary" /> Mis Pedidos
                </h1>
                <p className="text-base-content/60 mt-2">Gestiona tus compras y revisa el estado de tus envíos.</p>
            </header>

            {orders.length === 0 ? (
                <div className="bg-base-200 border-2 border-dashed border-base-300 rounded-3xl p-20 text-center">
                    <FaShoppingBag className="text-6xl mx-auto mb-4 opacity-20" />
                    <h2 className="text-2xl font-bold opacity-50">Parece que aún no has comprado nada</h2>
                    <Link to="/" className="btn btn-primary mt-6">Ir a la tienda</Link>
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
                                            Orden #{order._id?.slice(-6)}
                                        </p>
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <FaCalendarAlt className="opacity-40" />
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Fecha no disponible'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase opacity-50 font-bold">Total</p>
                                        <p className="text-xl font-black text-primary">
                                            ${order.totalAmount?.toLocaleString() || '0'}
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
                                            <FaBox className="text-xs" /> Productos
                                        </h4>
                                        <ul className="space-y-3">
                                            {order.products?.map((item, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-base-200/50 p-3 rounded-lg border border-base-300/50">
                                                    <span className="text-sm font-medium">
                                                        <span className="badge badge-sm badge-outline mr-2">{item.quantity}</span>
                                                        {item.name}
                                                    </span>
                                                    <span className="font-mono font-bold">
                                                        ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-base-200/50 rounded-2xl p-6">
                                        <h4 className="font-bold mb-3 flex items-center gap-2">
                                            <FaShippingFast className="text-xs" /> Información de Envío
                                        </h4>
                                        {order.shippingInfo ? (
                                            <div className="text-sm space-y-1 opacity-80">
                                                <p className="font-bold text-base-content">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                                                <p>{order.shippingInfo.address?.street} {order.shippingInfo.address?.number}</p>
                                                <p>{order.shippingInfo.address?.city}, {order.shippingInfo.address?.state}</p>
                                                <p className="text-[10px] mt-2 font-mono">CP: {order.shippingInfo.address?.zipCode}</p>
                                            </div>
                                        ) : <p className="text-sm italic">Información de envío no disponible</p>}
                                        
                                        {order.stripeData?.receiptUrl && (
                                            <a 
                                                href={order.stripeData.receiptUrl} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className="btn btn-sm btn-outline btn-block mt-6 normal-case"
                                            >
                                                Descargar Comprobante
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