// src/Pages/DetailProduct.jsx
import { useEffect, useState, useCallback } from 'react'
import { useProduct } from '../Hooks/useProduct.js'
import { useParams, useNavigate } from 'react-router' // 👈 Agregar useNavigate
import { useCart } from '../Hooks/useCart.js'
import {
    FiImage,
    FiZoomIn,
    FiX,
    FiChevronLeft,
    FiChevronRight,
    FiShoppingBag,
    FiCheckCircle,
    FiAlertCircle,
    FiStar,
    FiArrowLeft, // 👈 Agregar icono
} from 'react-icons/fi'
import { BsLightningCharge, BsTruck } from 'react-icons/bs'
import { FaShieldAlt, FaHeart, FaRegHeart } from 'react-icons/fa'
import Zoom from 'react-zoom-image-hover'
import Modal from 'react-modal'
import { motion } from 'framer-motion'
import { useSanitize } from '../Hooks/useSanitize.js'
import { getOptimizedImage, PLACEHOLDER_IMAGE } from '../utils/imageUtils.js'
import { formatPrice } from '../utils/formatPrice.js'
import { useWishlist } from '../Hooks/useWishlist'
import toast from 'react-hot-toast'

Modal.setAppElement('#root')

const DetailProduct = () => {
    const { sanitizeText } = useSanitize()
    const { id } = useParams()
    const navigate = useNavigate() // 👈 Hook para navegación
    const { getProductById, product, productLoading, error } = useProduct() // 👈 Agregar error
    const { addToCart, openModal: openCartModal, cart } = useCart()
    const { toggleWishlist, wishlist } = useWishlist()

    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)
    const [quantity, setQuantity] = useState(1)

    const [isFavorite, setIsFavorite] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    // 👈 Validar ID al inicio
    useEffect(() => {
        // Validar que el ID tenga formato de MongoDB ObjectId (24 caracteres hexadecimales)
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id)

        if (!isValidObjectId) {
            // Si el ID no es válido, redirigir a 404
            navigate('/404', { replace: true })
            return
        }

        getProductById(id)
    }, [id, getProductById, navigate])

    // 👈 Manejar cuando el producto no existe (error 404 del backend)
    useEffect(() => {
        if (!productLoading && !product && error) {
            // Redirigir a 404 si el producto no existe
            navigate('/404', { replace: true })
        }
    }, [productLoading, product, error, navigate])

    useEffect(() => {
        if (product?._id) {
            const favorite = wishlist.some((item) => item._id === product._id)
            setIsFavorite(favorite)
        }
    }, [product?._id, wishlist])

    const safeName = sanitizeText(product?.name)
    const safeDescription = sanitizeText(product?.description)
    const safeCategory = sanitizeText(product?.category?.name)
    const safeSubcategory = sanitizeText(product?.subcategory?.name)

    useEffect(() => {
        getProductById(id)
    }, [id, getProductById])

    useEffect(() => {
        setImageLoaded(false)
        setImageError(false)
    }, [selectedImageIndex])

    const calculateAvailableStock = () => {
        if (!product) return 0
        const itemInCart = cart.find((item) => item._id === product._id)
        const quantityInCart = itemInCart?.quantity || 0
        return Math.max(0, product.stock - quantityInCart)
    }

    const availableStock = calculateAvailableStock()
    const isOutOfStock = product?.stock === 0 || availableStock <= 0
    const isQuantityValid = quantity > 0 && quantity <= availableStock

    const increaseQuantity = () => {
        if (quantity < availableStock) {
            setQuantity((prev) => prev + 1)
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1)
        }
    }

    const handleAddToCart = async () => {
        if (!isQuantityValid || isOutOfStock) return

        await addToCart(product, quantity)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
        openCartModal()
    }

    const handleToggleWishlist = useCallback(async () => {
        if (!product || isUpdating) return

        setIsUpdating(true)

        try {
            await toggleWishlist(product)
        } catch (error) {
            console.error('Error al actualizar favoritos:', error)
            toast.error('Error al actualizar favoritos')
        } finally {
            setIsUpdating(false)
        }
    }, [product, toggleWishlist, isUpdating])

    const getHighResImage = (url) => {
        if (!url) return ''
        if (url.includes('cloudinary')) {
            return url.replace(
                '/upload/',
                '/upload/w_1200,h_1200,c_limit,q_auto,f_auto/',
            )
        }
        return url
    }

    const nextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === productImages.length - 1 ? 0 : prev + 1,
        )
    }

    const prevImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? productImages.length - 1 : prev - 1,
        )
    }

    const getProductImages = () => {
        if (!product) return []

        if (
            product.images &&
            Array.isArray(product.images) &&
            product.images.length > 0
        ) {
            return product.images.map((img) => ({
                url: img.url,
                isMain: img.isMain || false,
                alt: img.alt || product.name,
            }))
        }

        if (product.imageUrl) {
            return [
                {
                    url: product.imageUrl,
                    isMain: true,
                    alt: product.name,
                },
            ]
        }

        return []
    }

    const productImages = getProductImages()
    const hasMultipleImages = productImages.length > 1
    const currentImage =
        productImages[selectedImageIndex] || productImages[0] || {}
    const optimizedImage = getOptimizedImage(currentImage.url, 800)
    const highResImage = getHighResImage(currentImage.url)

    useEffect(() => {
        if (!product || productImages.length === 0) {
            setImageError(true)
            return
        }

        const imageUrl = currentImage.url
        if (!imageUrl) {
            setImageError(true)
            return
        }

        const optimizedUrl = getOptimizedImage(imageUrl, 800)
        const img = new Image()
        img.src = optimizedUrl
        img.onload = () => {
            setImageLoaded(true)
            setImageError(false)
        }
        img.onerror = () => {
            setImageError(true)
            setImageLoaded(false)
        }
    }, [product, selectedImageIndex, currentImage.url])

    // 👈 Mostrar loading
    if (productLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Cargando producto...
                    </p>
                </div>
            </div>
        )
    }

    // 👈 Si no hay producto después de cargar, mostrar página de error (fallback)
    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="text-8xl mb-6">🔍</div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                        Producto no encontrado
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        El producto que buscas no existe o ha sido eliminado.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Volver al inicio
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                        Inicio
                    </button>
                    <span>›</span>
                    <span>{safeCategory || 'Categoría'}</span>
                    {product.subcategory && (
                        <>
                            <span>›</span>
                            <span>{safeSubcategory}</span>
                        </>
                    )}
                    <span>›</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                        {safeName}
                    </span>
                </nav>

                <div className="lg:flex lg:gap-8">
                    {/* Sección de imágenes */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-24">
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
                                {/* Placeholder mientras carga */}
                                {!imageLoaded && !imageError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 z-10">
                                        <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2 animate-pulse" />
                                        <span className="text-sm text-gray-400 dark:text-gray-500">
                                            Cargando imagen...
                                        </span>
                                    </div>
                                )}

                                {/* Error de imagen */}
                                {imageError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 z-10">
                                        <FiImage className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Error al cargar la imagen
                                        </span>
                                    </div>
                                )}

                                {/* Imagen principal */}
                                {imageLoaded && !imageError && (
                                    <>
                                        {hasMultipleImages && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm"
                                                    aria-label="Imagen anterior"
                                                >
                                                    <FiChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm"
                                                    aria-label="Imagen siguiente"
                                                >
                                                    <FiChevronRight className="w-6 h-6" />
                                                </button>
                                            </>
                                        )}

                                        <div
                                            className="aspect-square w-full h-full cursor-zoom-in group"
                                            onClick={() => setModalIsOpen(true)}
                                        >
                                            <Zoom
                                                src={optimizedImage}
                                                width="100%"
                                                height="100%"
                                                zoomScale={2.5}
                                                alt={product.name}
                                                objectFit="contain"
                                                transitionTime={0.2}
                                                className="w-full h-full"
                                            />

                                            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                <FiZoomIn className="w-3.5 h-3.5" />
                                                <span>Click para zoom</span>
                                            </div>

                                            {hasMultipleImages && (
                                                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    {selectedImageIndex + 1} /{' '}
                                                    {productImages.length}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Miniaturas */}
                            {hasMultipleImages && (
                                <div className="mt-4">
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {productImages.map((img, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setSelectedImageIndex(index)
                                                }
                                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                                    selectedImageIndex === index
                                                        ? 'border-purple-600 dark:border-purple-500 scale-105 shadow-lg'
                                                        : 'border-transparent hover:border-purple-300 dark:hover:border-purple-700'
                                                }`}
                                            >
                                                <img
                                                    src={getOptimizedImage(
                                                        img.url,
                                                        100,
                                                    )}
                                                    alt={
                                                        img.alt ||
                                                        `${product.name} - vista ${index + 1}`
                                                    }
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null
                                                        e.target.src = PLACEHOLDER_IMAGE
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detalles del producto */}
                    <section className="lg:w-1/2 pt-6 lg:pt-0">
                        <div className="sticky top-24 space-y-6">
                            {/* Título y rating con botón de favoritos */}
                            <div>
                                <div className="flex items-start justify-between gap-4">
                                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-3 flex-1">
                                        {safeName}
                                    </h1>

                                    <button
                                        onClick={handleToggleWishlist}
                                        disabled={isUpdating}
                                        className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                                            isFavorite
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/50'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        } ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                                        aria-label={
                                            isFavorite
                                                ? 'Quitar de favoritos'
                                                : 'Añadir a favoritos'
                                        }
                                    >
                                        {isFavorite ? (
                                            <FaHeart className="w-6 h-6" />
                                        ) : (
                                            <FaRegHeart className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar
                                                key={i}
                                                className={`w-5 h-5 ${
                                                    i < 4
                                                        ? 'text-yellow-400 fill-current'
                                                        : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                            />
                                        ))}
                                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                            (45 reseñas)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Precio y stock */}
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-2xl">
                                    <span className="text-3xl font-bold">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                                        isOutOfStock
                                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                            : availableStock <= 5
                                              ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    }`}
                                >
                                    <BsLightningCharge className="w-5 h-5" />
                                    <span className="font-medium">
                                        {isOutOfStock
                                            ? 'Agotado'
                                            : `${availableStock} disponibles`}
                                    </span>
                                </div>
                            </div>

                            {/* Info carrito */}
                            {cart.find((item) => item._id === product._id) && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-full">
                                            <FiShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-purple-800 dark:text-purple-300">
                                                Tienes{' '}
                                                {
                                                    cart.find(
                                                        (item) =>
                                                            item._id ===
                                                            product._id,
                                                    )?.quantity
                                                }{' '}
                                                unidad(es) en tu carrito
                                            </p>
                                            <p className="text-sm text-purple-600 dark:text-purple-400">
                                                Stock disponible para agregar:{' '}
                                                {availableStock}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                                    Descripción del producto
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {safeDescription}
                                </p>
                            </div>

                            {/* Cantidad */}
                            {!isOutOfStock && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        Cantidad
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                            <button
                                                onClick={decreaseQuantity}
                                                disabled={quantity <= 1}
                                                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold transition-colors text-gray-800 dark:text-white"
                                            >
                                                -
                                            </button>
                                            <span className="px-6 py-2 text-lg font-semibold min-w-[60px] text-center text-gray-800 dark:text-white">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={increaseQuantity}
                                                disabled={
                                                    quantity >= availableStock
                                                }
                                                className="px-4 py-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold transition-colors text-gray-800 dark:text-white"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Máximo: {availableStock} unidades
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Características */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                            <BsTruck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-white">
                                            Envío gratis
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        En compras mayores a 40€
                                    </p>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                            <FaShieldAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-white">
                                            Garantía
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        1 año de garantía
                                    </p>
                                </div>
                            </div>

                            {/* Botón de compra */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || !isQuantityValid}
                                className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                                    isOutOfStock || !isQuantityValid
                                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25'
                                }`}
                            >
                                {addedToCart ? (
                                    <>
                                        <FiCheckCircle className="w-5 h-5 animate-bounce" />
                                        ¡Agregado al carrito!
                                    </>
                                ) : isOutOfStock ? (
                                    <>
                                        <FiAlertCircle className="w-5 h-5" />
                                        Producto agotado
                                    </>
                                ) : !isQuantityValid ? (
                                    <>
                                        <FiAlertCircle className="w-5 h-5" />
                                        Cantidad no válida
                                    </>
                                ) : (
                                    <>
                                        <FiShoppingBag className="w-5 h-5" />
                                        Agregar{' '}
                                        {quantity > 1
                                            ? `${quantity} unidades`
                                            : 'al carrito'}
                                    </>
                                )}
                            </motion.button>

                            {/* Stock bajo warning */}
                            {availableStock <= 5 && availableStock > 0 && (
                                <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800">
                                    <BsLightningCharge className="w-5 h-5 animate-pulse flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            ⚡ ¡Solo quedan {availableStock}{' '}
                                            unidades disponibles!
                                        </p>
                                        {cart.find(
                                            (item) => item._id === product._id,
                                        ) && (
                                            <p className="text-xs text-orange-400 dark:text-orange-500 mt-1">
                                                Ya tienes{' '}
                                                {
                                                    cart.find(
                                                        (item) =>
                                                            item._id ===
                                                            product._id,
                                                    )?.quantity
                                                }{' '}
                                                en tu carrito
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Mensaje agotado por carrito */}
                            {isOutOfStock && product.stock > 0 && (
                                <div className="flex items-center gap-2 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800">
                                    <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            Has alcanzado el stock máximo
                                            disponible
                                        </p>
                                        <p className="text-xs text-red-400 dark:text-red-500 mt-1">
                                            Ya tienes{' '}
                                            {
                                                cart.find(
                                                    (item) =>
                                                        item._id ===
                                                        product._id,
                                                )?.quantity
                                            }{' '}
                                            de {product.stock} unidades en tu
                                            carrito
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal con zoom */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black/95 dark:bg-black/98"
                closeTimeoutMS={300}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                style={{
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 9999,
                    },
                    content: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        overflow: 'visible',
                        zIndex: 10000,
                        width: '100%',
                        height: '100%',
                        maxWidth: '90vw',
                        maxHeight: '90vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                }}
            >
                <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto">
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="absolute top-4 right-4 z-30 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
                        aria-label="Cerrar"
                    >
                        <FiX className="w-6 h-6" />
                    </button>

                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
                                aria-label="Imagen anterior"
                            >
                                <FiChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all backdrop-blur-sm border border-white/20 hover:scale-110"
                                aria-label="Imagen siguiente"
                            >
                                <FiChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    <div className="h-full flex flex-col">
                        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden bg-black/40">
                            {highResImage && (
                                <Zoom
                                    src={highResImage}
                                    width="100%"
                                    height="100%"
                                    zoomScale={3}
                                    alt={product.name}
                                    objectFit="contain"
                                    transitionTime={0.2}
                                    className="w-full h-full"
                                />
                            )}
                        </div>

                        {hasMultipleImages && (
                            <div className="mt-4 flex justify-center gap-2 overflow-x-auto py-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedImageIndex(index)
                                        }
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImageIndex === index
                                                ? 'border-white scale-105 shadow-xl'
                                                : 'border-transparent hover:border-white/50'
                                        }`}
                                    >
                                        <img
                                            src={getOptimizedImage(
                                                img.url,
                                                100,
                                            )}
                                            alt={`${product.name} - miniatura ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default DetailProduct
