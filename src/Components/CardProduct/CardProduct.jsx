// src/Components/CardProduct/CardProduct.jsx
import { Link, useNavigate } from 'react-router'
import { useCart } from '../../Hooks/useCart.js'
import {
    FaShoppingCart,
    FaEye,
    FaStar,
    FaHeart,
    FaRegHeart,
} from 'react-icons/fa'
import { useState, useCallback, useRef, useEffect, memo } from 'react'
import { FiImage } from 'react-icons/fi'
import { BsLightningCharge, BsExclamationCircle, BsTruck } from 'react-icons/bs'
import { useInView } from 'react-intersection-observer'
import { useSanitize } from '../../Hooks/useSanitize.js'
import { useWishlist } from '../../Hooks/useWishlist'
import { useUser } from '../../Hooks/useUser' // 👈 Agregar useUser
import { getOptimizedImage } from '../../utils/imageUtils.js'
import toast from 'react-hot-toast'

// Usar memo para evitar re-renderizados innecesarios
const CardProduct = memo(({ product }) => {
    // 👈 1. TODOS LOS HOOKS PRIMERO - SIN CONDICIONES
    const navigate = useNavigate()
    const { sanitizeText } = useSanitize()
    const { addToCart, openModal, cart } = useCart()
    const { toggleWishlist, wishlist } = useWishlist()
    const { isAuthenticated } = useUser() // 👈 Hook para autenticación

    // 👈 2. DESESTRUCTURACIÓN DEL PRODUCTO DESPUÉS DE LOS HOOKS
    const { _id, name, imageUrl, description, price, stock } = product || {}

    // 👈 3. ESTADOS Y REFS
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const clickTimeoutRef = useRef(null)
    const [isFavorite, setIsFavorite] = useState(false)

    const { ref: imageRef, inView } = useInView({
        threshold: 0.1,
        triggerOnce: true,
        rootMargin: '50px',
    })

    // 👈 4. VALORES DERIVADOS
    const safeName = sanitizeText(name)
    const safeDescription = sanitizeText(description)
    const currentStock = stock || 0
    const itemInCart = cart.find((item) => item._id === _id)
    const quantityInCart = itemInCart?.quantity || 0
    const availableStock = currentStock - quantityInCart
    const isOutOfStock = currentStock === 0 || availableStock <= 0

    // 👈 5. EFECTOS
    useEffect(() => {
        const favorite = wishlist.some(item => item._id === _id)
        setIsFavorite(favorite)
    }, [_id, wishlist])

    useEffect(() => {
        return () => {
            if (clickTimeoutRef.current) {
                clearTimeout(clickTimeoutRef.current)
            }
        }
    }, [])

    // 👈 6. HANDLERS
    const handleCardClick = useCallback((e) => {
        if (e.target.closest('button') || e.target.closest('a')) {
            e.stopPropagation()
            return
        }
        navigate(`/detailProduct/${_id}`)
    }, [_id, navigate])

    const handleAddToCart = useCallback(async (e) => {
        e.stopPropagation()
        if (isAdding || isOutOfStock) return

        setIsAdding(true)

        try {
            await addToCart({
                _id,
                name,
                price,
                imageUrl,
                description,
                stock: currentStock,
            })
            openModal()

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
    }, [
        _id,
        name,
        price,
        imageUrl,
        description,
        currentStock,
        addToCart,
        openModal,
        isAdding,
        isOutOfStock,
    ])

    const handleToggleWishlist = useCallback(async (e) => {
        e.stopPropagation()
        if (isUpdating) return

        setIsUpdating(true)

        const productData = { _id, name, price, imageUrl, description, stock }

        try {
            await toggleWishlist(productData)
        } catch (error) {
            console.error('Error al actualizar favoritos:', error)
            toast.error('Error al actualizar favoritos')
        } finally {
            setIsUpdating(false)
        }
    }, [toggleWishlist, _id, name, price, imageUrl, description, stock, isUpdating])

    // 👈 7. FUNCIONES DE UTILIDAD
    const getStockMessage = useCallback(() => {
        if (currentStock === 0) return 'Agotado'
        if (availableStock <= 0) return 'Sin stock'
        if (availableStock <= 5) return `Últimas ${availableStock}`
        return `${availableStock} disp.`
    }, [currentStock, availableStock])

    const getStockBadgeClasses = useCallback(() => {
        if (currentStock === 0 || availableStock <= 0) {
            return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
        }
        if (availableStock <= 5) {
            return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800'
        }
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
    }, [currentStock, availableStock])

    const optimizedImage = imageUrl && typeof imageUrl === 'string' 
    ? getOptimizedImage(imageUrl, 400, 'fill')
    : null

    const rating = 4.5
    const reviewCount = 12

    const StockBadge = useCallback(
        () => (
            <div
                className={`badge ${getStockBadgeClasses()} badge-sm sm:badge-md lg:badge-lg gap-0.5 sm:gap-1 py-1 sm:py-2 px-2 sm:px-3 flex-shrink-0 text-[10px] sm:text-xs whitespace-nowrap border`}
            >
                {getStockMessage()}
            </div>
        ),
        [getStockBadgeClasses, getStockMessage],
    )

    // 👈 8. RENDER
    return (
        <article
            onClick={handleCardClick}
            className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl dark:shadow-gray-950/50 transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 w-full max-w-full h-full flex flex-col cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges flotantes */}
            <div className="absolute top-2 left-2 z-20 flex flex-col gap-1.5 max-w-[calc(100%-3rem)]">
                {availableStock > 0 && availableStock <= 5 && (
                    <div className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 gap-1 py-2 px-2 sm:py-3 sm:px-3 font-bold shadow-lg animate-pulse text-[10px] sm:text-xs whitespace-normal text-center border border-orange-200 dark:border-orange-800">
                        <BsLightningCharge className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span className="truncate">
                            ¡Últimas {availableStock}!
                        </span>
                    </div>
                )}

                {isOutOfStock && (
                    <div className="badge bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 gap-1 py-2 px-2 sm:py-3 sm:px-3 font-bold shadow-lg text-[10px] sm:text-xs whitespace-normal text-center border border-red-200 dark:border-red-800">
                        <BsExclamationCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span className="truncate">Agotado</span>
                    </div>
                )}
            </div>

            {/* Wishlist button */}
            <button
                onClick={handleToggleWishlist}
                disabled={isUpdating}
                className={`absolute top-2 right-2 z-20 btn btn-circle btn-xs sm:btn-sm bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg transition-all duration-300 ${isUpdating ? 'opacity-50 cursor-wait' : ''}`}
                aria-label={
                    isFavorite
                        ? 'Quitar de favoritos'
                        : 'Añadir a favoritos'
                }
            >
                {isFavorite ? (
                    <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                ) : (
                    <FaRegHeart className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 dark:text-gray-400" />
                )}
            </button>

            {/* Imagen */}
            <div
                ref={imageRef}
                className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 overflow-hidden flex-shrink-0"
            >
                {/* Skeleton loader */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse p-4">
                        <FiImage className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mb-2" />
                        <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-medium text-center">
                            Cargando...
                        </span>
                    </div>
                )}

                {/* Imagen principal */}
                {inView && !imageError ? (
                    <img
                        className={`w-full h-full object-cover transition-all duration-700 ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        } ${isOutOfStock ? 'opacity-50 grayscale' : ''}
                        ${isHovered && !isOutOfStock ? 'scale-110' : 'scale-100'}`}
                        src={optimizedImage}
                        alt={name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    !imageError && (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                                Cargando...
                            </span>
                        </div>
                    )
                )}

                {/* Error de imagen */}
                {imageError && (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 p-4">
                        <div className="text-center">
                            <FiImage className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                                Sin imagen
                            </span>
                        </div>
                    </div>
                )}

                {/* Overlay de agotado */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
                        <span className="bg-black/80 dark:bg-black/90 text-white px-3 py-1.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider transform -rotate-12 shadow-xl border border-white/20 text-center">
                            AGOTADO
                        </span>
                    </div>
                )}

                {/* Badge de envío gratis */}
                {price > 50 && !isOutOfStock && (
                    <div className="absolute bottom-2 left-2 z-10 badge bg-info/90 dark:bg-info/80 text-white gap-1 py-2 sm:py-3 shadow-lg text-[10px] sm:text-xs border-none">
                        <BsTruck className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        <span className="hidden xs:inline">
                            Envío gratis
                        </span>
                        <span className="xs:hidden">Gratis</span>
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-3 sm:p-4 md:p-5 bg-white dark:bg-gray-800 transition-colors duration-300 flex-1 flex flex-col">
                {/* Header con título y rating */}
                <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base md:text-lg leading-tight line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 break-words transition-colors">
                        {safeName}
                    </h3>

                    {/* Rating compacto */}
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                        <FaStar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-yellow-400" />
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {rating}
                        </span>
                        <span className="text-[8px] sm:text-xs text-gray-400 dark:text-gray-500 hidden xs:inline">
                            ({reviewCount})
                        </span>
                    </div>
                </div>

                {/* Descripción */}
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 sm:mb-3">
                    {safeDescription}
                </p>

                {/* Precio y stock */}
                <div className="mb-3 sm:mb-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex-1 min-w-[120px]">
                            <span
                                className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold whitespace-nowrap ${
                                    isOutOfStock
                                        ? 'text-gray-300 dark:text-gray-600'
                                        : 'text-gray-900 dark:text-white'
                                } leading-tight`}
                            >
                                ${price?.toLocaleString()}
                            </span>
                            {!isOutOfStock && (
                                <span className="text-[8px] sm:text-xs text-gray-400 dark:text-gray-500 block">
                                    IVA incl.
                                </span>
                            )}
                        </div>

                        <div className="flex-shrink-0">
                            <StockBadge />
                        </div>
                    </div>
                </div>

                {/* Barra de progreso */}
                {!isOutOfStock && availableStock > 0 && (
                    <div className="mb-3 sm:mb-4 hidden xs:block">
                        <div className="flex justify-between text-[8px] sm:text-xs mb-0.5 sm:mb-1">
                            <span className="text-gray-500 dark:text-gray-400">
                                Stock
                            </span>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {availableStock}/{currentStock}
                            </span>
                        </div>
                        <progress
                            className="progress progress-primary w-full h-1 sm:h-2 [&::-webkit-progress-value]:bg-purple-600 dark:[&::-webkit-progress-value]:bg-purple-500 [&::-moz-progress-bar]:bg-purple-600 dark:[&::-moz-progress-bar]:bg-purple-500"
                            value={availableStock}
                            max={currentStock}
                        ></progress>
                    </div>
                )}

                {/* Cantidad en carrito */}
                {quantityInCart > 0 && (
                    <div className="mb-3 sm:mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg">
                            <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-400 font-medium truncate">
                                    En carrito:
                                </span>
                                <span className="badge badge-info badge-xs sm:badge-sm bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700">
                                    {quantityInCart}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mt-auto">
                    <span className="btn btn-outline btn-info btn-xs sm:btn-sm md:btn-md border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 cursor-default flex items-center justify-center gap-1 px-1 sm:px-2 md:px-3">
                        <FaEye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-[10px] sm:text-xs md:text-sm truncate">
                            Ver
                        </span>
                    </span>

                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || isOutOfStock}
                        className={`
                            btn btn-xs sm:btn-sm md:btn-md transition-all duration-300 gap-1 px-1 sm:px-2 md:px-3
                            ${
                                isAdding || isOutOfStock
                                    ? 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-purple-500/25 border-0'
                            }
                            ${isAdding ? 'animate-pulse' : ''}
                            ${isOutOfStock ? 'grayscale' : ''}
                        `}
                        title={
                            isOutOfStock
                                ? 'Producto sin stock'
                                : 'Agregar al carrito'
                        }
                    >
                        <FaShoppingCart
                            className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${isAdding ? 'animate-bounce' : ''}`}
                        />
                        <span className="text-[10px] sm:text-xs md:text-sm truncate">
                            {isAdding
                                ? '...'
                                : isOutOfStock
                                  ? 'Stock'
                                  : 'Add'}
                        </span>
                    </button>
                </div>

                {/* Mensajes promocionales */}
                {!isOutOfStock && availableStock > 0 && availableStock <= 5 && (
                    <div className="mt-2 sm:mt-3 text-center hidden xs:block">
                        <span className="text-[8px] sm:text-xs font-medium text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full animate-pulse inline-block border border-orange-200 dark:border-orange-800">
                            ⚡ {availableStock} viendo
                        </span>
                    </div>
                )}

                {isOutOfStock && quantityInCart > 0 && (
                    <div className="mt-2 sm:mt-3 text-center hidden xs:block">
                        <span className="text-[8px] sm:text-xs font-medium text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full inline-block border border-purple-200 dark:border-purple-800">
                            Ya en carrito
                        </span>
                    </div>
                )}
            </div>
        </article>
    )
})

CardProduct.displayName = 'CardProduct'

export default CardProduct