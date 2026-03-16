const Terms = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Términos y Condiciones</h1>
                
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                        Última actualización: {new Date().toLocaleDateString()}
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">1. Aceptación de los términos</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Al acceder y utilizar los servicios de E-Commerce, aceptas cumplir con estos términos 
                            y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás 
                            acceder a nuestros servicios.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">2. Uso del servicio</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Nuestro servicio te permite comprar productos online. Debes ser mayor de 18 años para 
                            utilizar nuestros servicios. Te comprometes a proporcionar información veraz y completa 
                            durante el proceso de registro y compra.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">3. Precios y pagos</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Todos los precios se muestran en la moneda local e incluyen impuestos aplicables. 
                            Nos reservamos el derecho de modificar los precios en cualquier momento, pero los cambios 
                            no afectarán a pedidos ya confirmados.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">4. Envíos y devoluciones</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Los plazos de envío son estimados y pueden variar según la ubicación. Aceptamos 
                            devoluciones dentro de los 14 días posteriores a la recepción del pedido, siempre que 
                            los productos estén en su estado original.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">5. Limitación de responsabilidad</h2>
                        <p className="text-gray-600 leading-relaxed">
                            E-Commerce no será responsable por daños indirectos, incidentales o consecuentes que 
                            resulten del uso o la imposibilidad de usar nuestros servicios.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Terms