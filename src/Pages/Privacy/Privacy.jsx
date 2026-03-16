const Privacy = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Política de Privacidad</h1>
                
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    <p className="text-gray-600 leading-relaxed">
                        Última actualización: {new Date().toLocaleDateString()}
                    </p>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">1. Información que recopilamos</h2>
                        <p className="text-gray-600 leading-relaxed">
                            En E-Commerce, recopilamos información personal que nos proporcionas directamente, 
                            como tu nombre, dirección de correo electrónico, dirección de envío y detalles de pago 
                            cuando realizas una compra o te registras en nuestra plataforma.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">2. Cómo usamos tu información</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Utilizamos la información recopilada para:
                        </p>
                        <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                            <li>Procesar tus pedidos y gestionar tu cuenta</li>
                            <li>Enviarte confirmaciones de pedidos y actualizaciones</li>
                            <li>Mejorar nuestra plataforma y personalizar tu experiencia</li>
                            <li>Enviarte ofertas y promociones (si has dado tu consentimiento)</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">3. Protección de datos</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos 
                            personales contra acceso no autorizado, pérdida o alteración. Toda la información 
                            sensible se transmite mediante encriptación SSL.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">4. Compartir información</h2>
                        <p className="text-gray-600 leading-relaxed">
                            No vendemos, comerciamos ni transferimos tu información personal a terceros sin tu 
                            consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios 
                            (por ejemplo, procesadores de pagos, empresas de envío).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-800">5. Tus derechos</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier 
                            momento. Puedes ejercer estos derechos contactándonos a través de nuestra página de 
                            contacto o enviando un email a privacidad@ecommerce.com.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Privacy