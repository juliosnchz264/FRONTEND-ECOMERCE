import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaCheckCircle, FaShoppingBag, FaTruck, FaFileDownload } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { useCart } from '../Hooks/useCart.js'
import { getOrderBySession } from '../services/orderServices' // Importa el nuevo servicio
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const { setCart } = useCart()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const sessionId = searchParams.get('session_id')

    const downloadInvoice = () => {
        try {
            if (!order) return;

            const doc = new jsPDF();
            const date = new Date().toLocaleDateString();

            // Configuración estética
            doc.setFontSize(20);
            doc.text('FACTURA DE COMPRA', 105, 20, { align: 'center' });
            
            doc.setFontSize(10);
            doc.text(`Fecha: ${date}`, 20, 30);
            doc.text(`ID Orden: ${order._id || 'N/A'}`, 20, 35);
            doc.text(`Cliente: ${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`, 20, 40);

            // Tabla de productos
            const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Subtotal"];
            const tableRows = order.products.map(item => [
                item.name,
                item.quantity,
                `$${item.price.toLocaleString()}`,
                `$${(item.price * item.quantity).toLocaleString()}`
            ]);

            // 🚩 CORRECCIÓN: Llamada directa a autoTable pasando el 'doc'
            autoTable(doc, {
                startY: 50,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { fillColor: [46, 204, 113] } // Color verde éxito
            });

            // 🚩 CORRECCIÓN: Obtener la posición final correctamente
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(12);
            doc.text(`TOTAL PAGADO: $${order.totalAmount.toLocaleString()}`, 140, finalY);

            // Descargar
            doc.save(`Factura_${order._id || 'compra'}.pdf`);
            toast.success('Factura descargada');
        } catch (error) {
            console.error("Error al generar PDF:", error);
            toast.error("No se pudo generar el PDF");
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Usamos el servicio de axios en lugar de fetch manual
                const data = await getOrderBySession(sessionId)

                if (data.success) {
                    setOrder(data.order)
                    setCart([])
                    localStorage.removeItem('cart')
                    sessionStorage.removeItem('checkoutCart')
                    toast.success('¡Pago verificado!')
                }
            } catch (error) {
                console.error(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (sessionId) fetchDetails()
    }, [sessionId, setCart])
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="mt-4 animate-pulse">Verificando tu pago...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
            <div className="max-w-lg w-full bg-base-100 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-success to-emerald-500 p-8 text-white text-center">
                    <FaCheckCircle className="text-6xl mx-auto mb-4 drop-shadow-lg" />
                    <h1 className="text-3xl font-black">¡Compra Exitosa!</h1>
                    <p className="opacity-90">Gracias por confiar en nosotros</p>
                </div>

                <div className="p-8">
                    {order ? (
                        <div className="space-y-6">
                            {/* Resumen de Productos */}
                            <div>
                                <h3 className="flex items-center gap-2 font-bold mb-3 text-base-content/70">
                                    <FaShoppingBag /> Resumen del pedido
                                </h3>
                                <div className="bg-base-200 rounded-xl p-4 space-y-3">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="font-medium text-base-content/80">
                                                {item.quantity}x {item.name}
                                            </span>
                                            <span className="font-mono font-bold">${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                    <div className="divider my-1"></div>
                                    <div className="flex justify-between items-center text-lg font-black text-primary">
                                        <span>Total Pagado</span>
                                        <span>${order.totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info de Envío */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-base-200 rounded-xl p-4">
                                    <h4 className="text-[10px] font-bold uppercase opacity-50 mb-2 flex items-center gap-1">
                                        <FaTruck /> Envío a
                                    </h4>
                                    <p className="text-sm font-bold">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</p>
                                    <p className="text-xs opacity-70">
                                        {order.shippingInfo.address.street} {order.shippingInfo.address.number}<br />
                                        {order.shippingInfo.address.city}, {order.shippingInfo.address.state}
                                    </p>
                                </div>
                                <div className="bg-base-200 rounded-xl p-4 flex flex-col justify-center">
                                    <h4 className="text-[10px] font-bold uppercase opacity-50 mb-1">ID de Transacción</h4>
                                    <code className="text-[10px] break-all bg-base-300 p-1 rounded">{sessionId.substring(0, 20)}...</code>
                                    <div className="mt-2">
                                        <span className="badge badge-success badge-xs font-bold">PAGADO</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-error">No se pudieron cargar los detalles, pero tu pago fue procesado.</p>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col gap-3">
                        <Link to="/" className="btn btn-primary w-full shadow-lg">
                            Continuar Comprando
                        </Link>
                        <Link to="/orders" className="btn btn-ghost btn-sm w-full">
                            Ver todas mis órdenes
                        </Link>
                        <button onClick={downloadInvoice} className="btn btn-outline btn-sm w-full mt-2">
                            <FaFileDownload /> Descargar Factura
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess