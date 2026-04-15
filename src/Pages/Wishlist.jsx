// src/Pages/Wishlist.jsx
import { Link } from 'react-router'
import { useWishlist } from '../Hooks/useWishlist'
import { useCart } from '../Hooks/useCart'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { PLACEHOLDER_IMAGE } from '../utils/imageUtils'
import { formatPrice } from '../utils/formatPrice.js'

const Wishlist = () => {
    const { wishlist, removeFromWishlist, totalWishlistItems } = useWishlist()
    const { addToCart } = useCart()

    const handleAddToCart = async (product) => {
        await addToCart(product, 1)
        toast.success('Producto agregado al carrito', { icon: '🛒' })
    }

    const handleRemoveFromWishlist = async (productId, productName) => {
        await removeFromWishlist(productId)
        toast.success(`${productName} eliminado de favoritos`, { icon: '🗑️' })
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaHeart className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            Tu lista de favoritos está vacía
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                            Explora nuestros productos y agrega tus favoritos para verlos aquí
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Explorar productos
                        </Link>
                    </motion.div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <FaHeart className="w-8 h-8 text-red-500" />
                            Mis Favoritos
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {totalWishlistItems} {totalWishlistItems === 1 ? 'producto guardado' : 'productos guardados'}
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Seguir comprando
                    </Link>
                </div>

                {/* Grid de productos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((product, index) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
                        >
                            {/* Imagen */}
                            <Link to={`/detailProduct/${product._id}`} className="block relative overflow-hidden">
                                <img
                                    src={product.images?.[0]?.url || product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        e.target.src = PLACEHOLDER_IMAGE
                                    }}
                                />
                                {/* Badge de stock bajo */}
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                        ⚡ Solo {product.stock}
                                    </span>
                                )}
                                {product.stock === 0 && (
                                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        Agotado
                                    </span>
                                )}
                            </Link>

                            {/* Contenido */}
                            <div className="p-4">
                                <Link to={`/detailProduct/${product._id}`}>
                                    <h3 className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                    {product.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                            {formatPrice(product.price)}
                                        </span>
                                        {product.stock > 0 && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                                                {product.stock} disponibles
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock === 0}
                                            className={`p-2 rounded-lg transition-all ${
                                                product.stock === 0
                                                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800/50'
                                            }`}
                                            title="Agregar al carrito"
                                        >
                                            <FiShoppingCart className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id, product.name)}
                                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-800/50 transition-all"
                                            title="Eliminar de favoritos"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Wishlist