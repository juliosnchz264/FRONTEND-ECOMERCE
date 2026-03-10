import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCart } from '../Hooks/useCart.js'
import { useUser } from '../Hooks/useUser.js'
import { createOrder } from '../services/orderServices'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

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
            state: '', // Este es el campo que faltaba
            zipCode: '',
        },
        mode: 'onChange',
    })

    if (cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-4 text-lg">Cargando carrito....</p>
                </div>
            </div>
        )
    }

    const onSubmit = async (data) => {
        setLoading(true)

        try {
                const currentUserId = userInfo?.id || userInfo?._id;

                if (!currentUserId) {
                toast.error("Debes estar logueado para realizar la compra");
                setLoading(false);
                return;
            }

                const orderData = {
                userId: currentUserId, // 👈 Ahora sí enviará el ID real
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
                        state: data.state, // Ahora sí enviamos el estado capturado
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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Finalizar Compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-base-100 p-6 rounded-lg shadow-lg border border-base-300">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                         Información de Entrega
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        {/* Fila: Nombre y Apellido */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Nombre</label>
                                <input
                                    {...register('firstName', { required: 'Requerido' })}
                                    className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Apellido</label>
                                <input
                                    {...register('lastName', { required: 'Requerido' })}
                                    className={`input input-bordered w-full ${errors.lastName ? 'input-error' : ''}`}
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Email y Teléfono */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Email</label>
                                <input
                                    {...register('email', { required: 'Email requerido' })}
                                    className="input input-bordered w-full"
                                    type="email"
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Teléfono</label>
                                <input
                                    {...register('phone', { required: 'Teléfono requerido' })}
                                    className="input input-bordered w-full"
                                    type="tel"
                                />
                            </div>
                        </div>

                        {/* Calle y Número */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="label text-xs font-bold uppercase opacity-70">Calle</label>
                                <input
                                    {...register('street', { required: 'Requerido' })}
                                    className="input input-bordered w-full"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Nº</label>
                                <input
                                    {...register('number', { required: 'Requerido' })}
                                    className="input input-bordered w-full"
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Ciudad, Provincia y CP */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Ciudad</label>
                                <input
                                    {...register('city', { required: 'Requerido' })}
                                    className="input input-bordered w-full"
                                    type="text"
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">Provincia</label>
                                <input
                                    {...register('state', { required: 'Requerido' })}
                                    className={`input input-bordered w-full ${errors.state ? 'input-error' : ''}`}
                                    type="text"
                                    placeholder="Estado/Prov."
                                />
                            </div>
                            <div>
                                <label className="label text-xs font-bold uppercase opacity-70">C.P.</label>
                                <input
                                    {...register('zipCode', { required: 'Requerido' })}
                                    className="input input-bordered w-full"
                                    type="text"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || cart.length === 0}
                            className={`btn btn-primary w-full mt-6 ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Validando Orden...' : `Proceder al Pago Seguro`}
                        </button>
                    </form>
                </div>

                {/* Resumen de la orden lateral */}
                <div className="bg-base-200 p-6 rounded-lg shadow-inner h-fit lg:sticky lg:top-4">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Resumen</h2>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <div key={item._id} className="flex justify-between items-center bg-base-100 p-3 rounded-md shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg border" />
                                    <div>
                                        <h3 className="font-bold text-sm">{item.name}</h3>
                                        <p className="text-xs opacity-60">x {item.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold">${item.price * item.quantity}</span>
                            </div>
                        ))}
                        <div className="divider"></div>
                        <div className="flex justify-between items-center text-2xl font-black px-2">
                            <span>Total</span>
                            <span className="text-primary">${total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout