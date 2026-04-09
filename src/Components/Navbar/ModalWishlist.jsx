// src/Components/Navbar/ModalWishlist.jsx
import { Link } from 'react-router'
import { useWishlist } from '../../Hooks/useWishlist'
import { useUser } from '../../Hooks/useUser' // 👈 Importar useUser
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiHeart, FiShoppingCart, FiTrash2, FiLogIn } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useCart } from '../../Hooks/useCart'
import toast from 'react-hot-toast'
import AuthToast from '../ui/AuthToast' // 👈 Importar AuthToast
import { PLACEHOLDER_IMAGE } from '../../utils/imageUtils'

const ModalWishlist = () => {
    const { wishlist, modalIsOpen, closeModal, removeFromWishlist, totalWishlistItems } = useWishlist()
    const { addToCart, openModal: openCartModal } = useCart()
    const { isAuthenticated } = useUser() // 👈 Obtener estado de autenticación

    // Función para mostrar el toast de autenticación
    const showAuthToast = () => {
        toast.custom(
            (t) => (
                <div
                    className={`${
                        t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white dark:bg-gray-800 shadow-xl rounded-xl pointer-events-auto ring-1 ring-black ring-opacity-5`}
                >
                    <AuthToast onClose={() => toast.dismiss(t.id)} />
                </div>
            ),
            {
                duration: 5000,
                position: 'top-center',
            },
        )
    }

    const handleAddToCart = async (product) => {
        if (!isAuthenticated()) {
            showAuthToast()
            return
        }
        await addToCart(product, 1)
        openCartModal()
        closeModal()
    }

    const handleExploreProducts = (e) => {
        if (!isAuthenticated()) {
            e.preventDefault()
            showAuthToast()
            closeModal()
        }
    }

    if (!modalIsOpen) return null

    return (
        <AnimatePresence>
            {modalIsOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={closeModal}
                    />
                    
                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                    <FaHeart className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Mis Favoritos
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {totalWishlistItems} {totalWishlistItems === 1 ? 'producto' : 'productos'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {!isAuthenticated() ? (
                                // 👉 Mensaje para usuarios no autenticados
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                        <FiHeart className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        ¡Inicia sesión para guardar favoritos!
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-xs">
                                        Crea una cuenta para no perder tus productos favoritos
                                    </p>
                                    <div className="flex gap-3">
                                        <Link
                                            to="/login"
                                            onClick={closeModal}
                                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2"
                                        >
                                            <FiLogIn className="w-4 h-4" />
                                            Iniciar sesión
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={closeModal}
                                            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                        >
                                            Registrarse
                                        </Link>
                                    </div>
                                </div>
                            ) : wishlist.length === 0 ? (
                                // 👉 Mensaje para usuarios autenticados sin favoritos
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                        <FaHeart className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                        Tu lista de favoritos está vacía
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        Explora nuestros productos y agrega tus favoritos
                                    </p>
                                    <Link
                                        to="/"
                                        onClick={closeModal}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                                    >
                                        Explorar productos
                                    </Link>
                                </div>
                            ) : (
                                // 👉 Lista de favoritos para usuarios autenticados
                                <div className="space-y-4">
                                    {wishlist.map((product) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-shadow"
                                        >
                                            {/* Imagen */}
                                            <Link
                                                to={`/detailProduct/${product._id}`}
                                                onClick={closeModal}
                                                className="w-20 h-20 rounded-lg overflow-hidden bg-white dark:bg-gray-800 flex-shrink-0"
                                            >
                                                <img
                                                    src={product.images?.[0]?.url || product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = PLACEHOLDER_IMAGE
                                                    }}
                                                />
                                            </Link>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/detailProduct/${product._id}`}
                                                    onClick={closeModal}
                                                    className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors line-clamp-2"
                                                >
                                                    {product.name}
                                                </Link>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                        ${product.price?.toFixed(2)}
                                                    </span>
                                                    {product.stock <= 5 && product.stock > 0 && (
                                                        <span className="text-xs text-orange-500 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">
                                                            {product.stock} restantes
                                                        </span>
                                                    )}
                                                    {product.stock === 0 && (
                                                        <span className="text-xs text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                                                            Agotado
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col gap-2">
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
                                                    onClick={() => removeFromWishlist(product._id)}
                                                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-800/50 transition-all"
                                                    title="Eliminar de favoritos"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer - Solo para usuarios autenticados con favoritos */}
                        {isAuthenticated() && wishlist.length > 0 && (
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    <span>Total de productos</span>
                                    <span className="font-semibold">{wishlist.length}</span>
                                </div>
                                <Link
                                    to="/wishlist"
                                    onClick={closeModal}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all text-center font-medium block"
                                >
                                    Ver todos los favoritos
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ModalWishlist