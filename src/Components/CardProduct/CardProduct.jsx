import { Link } from 'react-router'
import { useCart } from '../../Hooks/useCart.js'
import { FaShoppingCart, FaEye, FaStar } from 'react-icons/fa'
import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { BsLightningCharge } from 'react-icons/bs'

const CardProduct = ({
    product: { _id, name, imageUrl, description, price, stock },
}) => {
    const { addToCart, loading, openModal } = useCart()
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const handleAddToCart = async () => {
        await addToCart({ _id, name, price, imageUrl, description, stock })
        openModal()
    }

    // Función para optimizar imágenes de Cloudinary
    const getOptimizedImage = (url) => {
        if (!url) return ''
        if (url.includes('cloudinary')) {
            return url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/')
        }
        return url
    }

    const optimizedImage = getOptimizedImage(imageUrl)

    return (
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-purple-100 hover:border-purple-300">
            {/* Badge de stock bajo */}
            {stock <= 5 && stock > 0 && (
                <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <BsLightningCharge className="w-3 h-3" />
                    ¡Últimas {stock}!
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
                        }`}
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
                        <span className="text-2xl font-bold text-purple-600">
                            ${price}
                        </span>
                    </div>
                    <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stock > 10 ? 'bg-green-100 text-green-700' :
                        stock > 0 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        {stock > 0 ? `${stock} disp.` : 'Agotado'}
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="grid grid-cols-1 gap-3">
                    <Link
                        to={`/detailProduct/${_id}`}
                        className="btn btn-outline btn-info btn-sm md:btn-md border-2 hover:bg-info hover:text-white hover:border-info transition-all flex items-center justify-center gap-1"
                    >
                        <FaEye className="w-4 h-4" />
                        <span>Ver</span>
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={loading || stock === 0}
                        className="btn btn-success btn-sm md:btn-md bg-gradient-to-r from-green-500 to-green-600 border-0 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 transition-all flex items-center justify-center gap-1"
                    >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>{stock === 0 ? 'Sin stock' : 'Agregar'}</span>
                    </button>
                </div>
                
                {/* Indicador de stock adicional */}
                {stock <= 5 && stock > 0 && (
                    <p className="text-xs text-orange-500 mt-3 text-center font-medium">
                        ¡Últimas {stock} unidades!
                    </p>
                )}
                {stock === 0 && (
                    <p className="text-xs text-red-500 mt-3 text-center font-medium">
                        Producto agotado
                    </p>
                )}
            </div>
        </div>
    )
}

export default CardProduct