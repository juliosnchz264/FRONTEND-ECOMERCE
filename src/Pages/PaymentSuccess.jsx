// src/Pages/PaymentSuccess.jsx
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaCheckCircle, FaShoppingBag, FaTruck, FaFileDownload, FaArrowRight, FaHome, FaReceipt, FaRegClock } from 'react-icons/fa'
import { FiPackage, FiMapPin, FiCreditCard, FiMail, FiCheck, FiPrinter } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useCart } from '../Hooks/useCart.js'
import { getOrderBySession } from '../services/orderServices'
import { formatPrice } from '../utils/formatPrice.js'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { motion } from 'framer-motion'

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const { loadCart } = useCart()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    
    const rawSessionId = searchParams.get('session_id')
    // Validate Stripe session_id format (starts with cs_ followed by alphanumeric chars)
    const sessionId = rawSessionId && /^cs_[a-zA-Z0-9_]+$/.test(rawSessionId) ? rawSessionId : null

    const downloadInvoice = () => {
        try {
            if (!order) return;

            const doc = new jsPDF();
            const date = new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // Configuración estética para modo claro/oscuro (usamos colores fijos para PDF)
            doc.setFillColor(246, 246, 250);
            doc.rect(0, 0, 210, 297, 'F');
            
            // Logo y título
            doc.setFontSize(24);
            doc.setTextColor(139, 92, 246);
            doc.text('E-Commerce', 20, 25);
            
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text('FACTURA DE COMPRA', 20, 35);
            
            // Línea decorativa
            doc.setDrawColor(139, 92, 246);
            doc.setLineWidth(0.5);
            doc.line(20, 40, 190, 40);
            
            // Información de la empresa
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Calle Principal 123, Madrid, España', 20, 48);
            doc.text('soporte@ecommerce.com | +34 123 456 789', 20, 53);
            
            // Información del cliente
            doc.setFontSize(10);
            doc.setTextColor(51, 51, 51);
            doc.text(`Factura N°: ${order._id?.slice(-8).toUpperCase() || 'N/A'}`, 140, 48);
            doc.text(`Fecha: ${date}`, 140, 53);
            doc.text(`Cliente: ${order.shippingInfo?.firstName} ${order.shippingInfo?.lastName}`, 140, 58);
            doc.text(`Email: ${order.payer?.email || 'No especificado'}`, 140, 63);

            // Tabla de productos
            const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Subtotal"];
            const tableRows = order.products.map(item => [
                item.name,
                item.quantity.toString(),
                `${formatPrice(item.price)}`,
                `${formatPrice(item.price * item.quantity)}`
            ]);

            autoTable(doc, {
                startY: 70,
                head: [tableColumn],
                body: tableRows,
                theme: 'striped',
                headStyles: { 
                    fillColor: [139, 92, 246],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold'
                },
                alternateRowStyles: { fillColor: [245, 245, 250] },
                margin: { left: 20, right: 20 }
            });

            const finalY = doc.lastAutoTable.finalY + 10;
            
            // Totales
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('Subtotal:', 140, finalY);
            doc.text(`$${order.totalAmount.toLocaleString()}`, 180, finalY, { align: 'right' });
            doc.text('Envío:', 140, finalY + 7);
            doc.text('Gratis', 180, finalY + 7, { align: 'right' });
            
            doc.setDrawColor(200, 200, 200);
            doc.line(140, finalY + 12, 190, finalY + 12);
            
            doc.setFontSize(14);
            doc.setTextColor(139, 92, 246);
            doc.text('TOTAL:', 140, finalY + 20);
            doc.text(`$${order.totalAmount.toLocaleString()}`, 180, finalY + 20, { align: 'right' });
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Gracias por tu compra', 105, 280, { align: 'center' });
            doc.text('Esta factura es un comprobante válido de compra', 105, 285, { align: 'center' });

            doc.save(`Factura_${order._id?.slice(-8) || 'compra'}.pdf`);
            toast.success('Factura descargada');
        } catch (error) {
            console.error("Error al generar PDF:", error);
            toast.error("No se pudo generar el PDF");
        }
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getOrderBySession(sessionId)

                if (data.success) {
                    setOrder(data.order)
                    localStorage.removeItem('cart')
                    sessionStorage.removeItem('checkoutCart')
                    await loadCart()
                    toast.success('¡Pago verificado!')
                }
            } catch (error) {
                console.error(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (sessionId) fetchDetails()
    }, [sessionId, loadCart])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400 animate-pulse">Verificando tu pago...</p>
                </div>
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-lg w-full"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700">
                    {/* Header con gradiente */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                        >
                            <FaCheckCircle className="text-6xl mx-auto mb-4 drop-shadow-lg" />
                        </motion.div>
                        <h1 className="text-3xl font-black">¡Compra Exitosa!</h1>
                        <p className="opacity-90 mt-2">Gracias por confiar en nosotros</p>
                    </div>

                    <div className="p-8">
                        {order ? (
                            <motion.div variants={itemVariants} className="space-y-6">
                                {/* Mensaje de confirmación */}
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
                                    <div className="flex items-center gap-3">
                                        <FiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Tu pago ha sido confirmado exitosamente. Te enviaremos un email con los detalles.
                                        </p>
                                    </div>
                                </div>

                                {/* Resumen de Productos */}
                                <div>
                                    <h3 className="flex items-center gap-2 font-bold mb-3 text-gray-700 dark:text-gray-300">
                                        <FiPackage /> Resumen del pedido
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 space-y-3 border border-gray-100 dark:border-gray-700">
                                        {order.products.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                    {item.quantity}x {item.name}
                                                </span>
                                                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                                                    {formatPrice(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="divider my-1 dark:border-gray-700"></div>
                                        <div className="flex justify-between items-center text-lg font-black">
                                            <span className="text-gray-800 dark:text-white">Total Pagado</span>
                                            <span className="text-purple-600 dark:text-purple-400">
                                                ${order.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info de Envío y Pago */}
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                            <FiMapPin /> Dirección de envío
                                        </h4>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                            {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {order.shippingInfo.address.street} {order.shippingInfo.address.number}<br />
                                            {order.shippingInfo.address.city}, {order.shippingInfo.address.state}<br />
                                            CP: {order.shippingInfo.address.zipCode}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                            <FiCreditCard /> Información de pago
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">ID de Transacción:</span>
                                                <code className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                                    {sessionId?.substring(0, 20)}...
                                                </code>
                                            </p>
                                            <p className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Estado:</span>
                                                <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none">
                                                    PAGADO
                                                </span>
                                            </p>
                                            <p className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                                <span className="text-gray-700 dark:text-gray-300">{order.payer?.email || 'No especificado'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de seguimiento */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                                    <div className="flex items-start gap-3">
                                        <FaRegClock className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium mb-1">
                                                Próximos pasos
                                            </p>
                                            <p className="text-xs text-purple-600 dark:text-purple-400">
                                                Recibirás un email de confirmación con los detalles de tu pedido. 
                                                Tu orden será procesada y enviada en los próximos días hábiles.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCheckCircle className="text-4xl text-yellow-500 dark:text-yellow-400" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Tu pago fue procesado correctamente, pero no se pudieron cargar los detalles.
                                </p>
                            </div>
                        )}

                        {/* Botones de acción */}
                        <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3">
                            <Link 
                                to="/" 
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 group"
                            >
                                <FaHome className="w-4 h-4" />
                                <span>Continuar Comprando</span>
                                <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Link 
                                    to="/orders" 
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                                >
                                    <FaReceipt className="w-4 h-4" />
                                    <span>Mis órdenes</span>
                                </Link>
                                <button 
                                    onClick={downloadInvoice} 
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
                                >
                                    <FaFileDownload className="w-4 h-4" />
                                    <span>Factura</span>
                                </button>
                            </div>
                        </motion.div>

                        {/* Footer */}
                        <motion.div variants={itemVariants} className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2">
                                <FiMail className="w-3 h-3" />
                                ¿Dudas? Contacta a soporte@ecommerce.com
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default PaymentSuccess