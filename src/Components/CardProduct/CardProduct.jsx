import { Link } from 'react-router'
import { useCart } from '../../Hooks/useCart.js'
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa'
import { useState, useCallback, useRef, useEffect } from 'react'
import { FiImage } from 'react-icons/fi'
import { BsLightningCharge, BsExclamationCircle } from 'react-icons/bs'

const CardProduct = ({
    product: { _id, name, imageUrl, description, price, stock },
}) => {
    const { addToCart, openModal, cart } = useCart() // 👈 Añadimos cart para verificar stock en tiempo real
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const clickTimeoutRef = useRef(null)

    // 🟢 Verificar stock en tiempo real (por si cambia en otra pestaña)
    const currentStock = stock
    
    // 🟢 Verificar cuántos ya tenemos en el carrito
    const itemInCart = cart.find(item => item._id === _id)
    const quantityInCart = itemInCart?.quantity || 0
    const availableStock = currentStock - quantityInCart
    
    const isOutOfStock = currentStock === 0 || availableStock <= 0

    const handleAddToCart = useCallback(async () => {
        // Prevenir si ya está agregando o no hay stock
        if (isAdding || isOutOfStock) {
            console.log('⏳ No se puede agregar:', { isAdding, isOutOfStock })
            return
        }

        setIsAdding(true)
        
        try {
            await addToCart({ _id, name, price, imageUrl, description, stock: currentStock })
            openModal()
            
            // Resetear después de 1.5 segundos
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
            
            clickTimeoutRef.current = setTimeout(() => {
                setIsAdding(false)
                clickTimeoutRef.current = null
            }, 1500)
            
        } catch (error) {
            console.error('Error al agregar:', error)
            setIsAdding(false)
        }
    }, [_id, name, price, imageUrl, description, currentStock, addToCart, openModal, isAdding, isOutOfStock])

    // Limpiar timeout al desmontar
    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
        }
    }, [])

    // Función para optimizar imágenes de Cloudinary
    const getOptimizedImage = (url) => {
        if (!url) return ''
        if (url.includes('cloudinary')) {
            return url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/')
        }
        return url
    }

    const optimizedImage = getOptimizedImage(imageUrl)

    // Determinar el mensaje de stock
    const getStockMessage = () => {
        if (currentStock === 0) return 'Agotado'
        if (availableStock <= 0) return 'Sin stock disponible'
        if (availableStock <= 5) return `Solo ${availableStock} disponibles`
        return `${availableStock} disponibles`
    }

    // Determinar el color del stock
    const getStockColor = () => {
        if (currentStock === 0 || availableStock <= 0) return 'bg-red-100 text-red-700'
        if (availableStock <= 5) return 'bg-orange-100 text-orange-700'
        return 'bg-green-100 text-green-700'
    }

    return (
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300">
            {/* Badge de stock bajo - SOLO si hay stock disponible */}
            {availableStock > 0 && availableStock <= 5 && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <BsLightningCharge className="w-3 h-3" />
                    ¡Últimas {availableStock}!
                </div>
            )}

            {/* Badge de agotado */}
            {isOutOfStock && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <BsExclamationCircle className="w-3 h-3" />
                    Agotado
                </div>
            )}

            {/* Imagen */}
            <div className="relative h-56 bg-gradient-to-br from-gray-50 to-purple-50 overflow-hidden">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 animate-pulse">
                        <FiImage className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-400">Cargando...</span>
                    </div>
                )}

                {!imageError ? (
                    <img
                        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        } ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                        src={optimizedImage}
                        alt={name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-500">Sin imagen</span>
                    </div>
                )}

                {/* Overlay si está agotado */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <span className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm font-bold transform -rotate-12">
                            AGOTADO
                        </span>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1 flex-1 text-lg">
                        {name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 ml-2">
                        <FaStar className="w-4 h-4 fill-current" />
                        <span className="text-xs text-gray-600">4.5</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {description}
                </p>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                        <span className={`text-2xl font-bold ${isOutOfStock ? 'text-gray-400' : 'text-purple-600'}`}>
                            ${price}
                        </span>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStockColor()}`}>
                        {getStockMessage()}
                    </div>
                </div>

                {/* Cantidad en carrito (si aplica) */}
                {quantityInCart > 0 && (
                    <div className="mb-3 text-xs text-center text-purple-600 bg-purple-50 py-1 rounded-full">
                        {quantityInCart} en tu carrito
                    </div>
                )}

                {/* Botones de acción */}
                <div className="grid grid-cols-1 gap-3">
                    <Link
                        to={`/detailProduct/${_id}`}
                        className="btn btn-outline btn-info btn-sm md:btn-md border-2 hover:bg-info hover:text-white hover:border-info transition-all flex items-center justify-center gap-1"
                    >
                        <FaEye className="w-4 h-4" />
                        <span>Ver detalles</span>
                    </Link>
                    
                    {/* Botón mejorado con estilos claros de disabled */}
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock}
                        className={`
                            btn btn-sm md:btn-md transition-all flex items-center justify-center gap-1
                            ${isAdding || isOutOfStock 
                                ? 'btn-disabled opacity-50 cursor-not-allowed bg-gray-400 border-gray-400 text-white'
                                : 'btn-success bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700 text-white'
                            }
                            ${isOutOfStock ? 'grayscale' : ''}
                        `}
                        title={isOutOfStock ? 'Producto sin stock' : 'Agregar al carrito'}
                    >
                        <FaShoppingCart className={`w-4 h-4 ${isAdding ? 'animate-bounce' : ''}`} />
                        <span>
                            {isAdding 
                                ? 'Agregando...' 
                                : isOutOfStock 
                                    ? 'Sin stock' 
                                    : 'Agregar'
                            }
                        </span>
                    </button>
                </div>
                
                {/* Mensajes adicionales de stock */}
                {availableStock > 0 && availableStock <= 5 && (
                    <p className="text-xs text-orange-500 mt-3 text-center font-medium">
                        ¡Corre, solo {availableStock} disponibles!
                    </p>
                )}
                {isOutOfStock && quantityInCart > 0 && (
                    <p className="text-xs text-purple-500 mt-3 text-center font-medium">
                        Ya tienes todas las unidades disponibles en tu carrito
                    </p>
                )}
            </div>
        </div>
    )
}

export default CardProduct