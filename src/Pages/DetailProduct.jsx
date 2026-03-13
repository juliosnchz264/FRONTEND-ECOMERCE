import { useEffect, useState } from 'react'
import { useProduct } from '../Hooks/useProduct.js'
import { useParams } from 'react-router'
import { useCart } from '../Hooks/useCart.js'
import { 
    FiImage, 
    FiZoomIn, 
    FiX, 
    FiChevronLeft, 
    FiChevronRight,
    FiShoppingBag,
    FiCheckCircle 
} from 'react-icons/fi'
import { BsLightningCharge, BsTruck } from 'react-icons/bs'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import Zoom from 'react-zoom-image-hover'
import Modal from 'react-modal'

// Configurar react-modal
Modal.setAppElement('#root')

const DetailProduct = () => {
    const { id } = useParams()
    const { getProductById, product, productLoading } = useProduct()
    const { addToCart, openModal: openCartModal } = useCart()
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)

    useEffect(() => {
        getProductById(id)
    }, [id, getProductById])

    useEffect(() => {
        setImageLoaded(false)
        setImageError(false)
    }, [selectedImageIndex])

    const handleAddToCart = async () => {
        await addToCart(product)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
        openCartModal()
    }

    const getOptimizedImage = (url, size = 800) => {
        if (!url) return ''
        if (url.includes('cloudinary')) {
            return url.replace('/upload/', `/upload/w_${size},h_${size},c_limit,q_auto,f_auto/`)
        }
        return url
    }

    const getHighResImage = (url) => {
        if (!url) return ''
        if (url.includes('cloudinary')) {
            return url.replace('/upload/', '/upload/w_1200,h_1200,c_limit,q_auto,f_auto/')
        }
        return url
    }

    // Navegación entre imágenes
    const nextImage = () => {
        setSelectedImageIndex((prev) => 
            prev === productImages.length - 1 ? 0 : prev + 1
        )
    }

    const prevImage = () => {
        setSelectedImageIndex((prev) => 
            prev === 0 ? productImages.length - 1 : prev - 1
        )
    }

    // Obtener array de imágenes
    const getProductImages = () => {
        if (!product) return []
        
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            return product.images.map(img => ({
                url: img.url,
                isMain: img.isMain || false,
                alt: img.alt || product.name
            }))
        }
        
        if (product.imageUrl) {
            return [{
                url: product.imageUrl,
                isMain: true,
                alt: product.name
            }]
        }
        
        return []
    }

    const productImages = getProductImages()
    const hasMultipleImages = productImages.length > 1
    const currentImage = productImages[selectedImageIndex] || productImages[0] || {}
    const optimizedImage = getOptimizedImage(currentImage.url, 800)
    const highResImage = getHighResImage(currentImage.url)

    // Precargar imagen
    useEffect(() => {
        if (!product || productImages.length === 0) {
            setImageError(true)
            return
        }

        const imageUrl = currentImage.url
        if (!imageUrl) {
            console.log('❌ URL de imagen no disponible')
            setImageError(true)
            return
        }

        const optimizedUrl = getOptimizedImage(imageUrl, 800)
        console.log('🖼️ Cargando imagen:', optimizedUrl)
        
        const img = new Image()
        img.src = optimizedUrl
        img.onload = () => {
            console.log('✅ Imagen cargada exitosamente')
            setImageLoaded(true)
            setImageError(false)
        }
        img.onerror = (e) => {
            console.log('❌ Error cargando imagen:', optimizedUrl, e)
            setImageError(true)
            setImageLoaded(false)
        }
    }, [product, selectedImageIndex, currentImage.url])

    if (productLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="loading loading-spinner text-purple-600 loading-lg"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-center py-10">
                <div className="text-gray-300 text-7xl mb-4">😕</div>
                <p className="text-gray-500 text-lg">Producto no encontrado</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>Inicio</span>
                    <span>›</span>
                    <span>{product.category?.name || 'Categoría'}</span>
                    {product.subcategory && (
                        <>
                            <span>›</span>
                            <span>{product.subcategory.name}</span>
                        </>
                    )}
                    <span>›</span>
                    <span className="text-purple-600 font-medium">{product.name}</span>
                </div>

                <div className="lg:flex lg:gap-8">
                    {/* Sección de imágenes */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-24">
                            <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden border border-gray-200">
                                {/* Placeholder mientras carga */}
                                {!imageLoaded && !imageError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                                        <FiImage className="w-12 h-12 text-gray-400 mb-2 animate-pulse" />
                                        <span className="text-sm text-gray-400">Cargando imagen...</span>
                                    </div>
                                )}
                                
                                {/* Error de imagen */}
                                {imageError && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200 z-10">
                                        <FiImage className="w-12 h-12 text-gray-500 mb-2" />
                                        <span className="text-sm text-gray-500">Error al cargar la imagen</span>
                                    </div>
                                )}

                                {/* Imagen principal con zoom y botones de navegación */}
                                {imageLoaded && !imageError && (
                                    <>
                                        {/* Botones de navegación en la imagen principal */}
                                        {hasMultipleImages && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all hover:scale-110"
                                                    aria-label="Imagen anterior"
                                                >
                                                    <FiChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all hover:scale-110"
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
                                            
                                            {/* Overlay con indicador */}
                                            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                                <FiZoomIn className="w-3.5 h-3.5" />
                                                <span>Click para zoom</span>
                                            </div>

                                            {/* Contador de imágenes */}
                                            {hasMultipleImages && (
                                                <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                                                    {selectedImageIndex + 1} / {productImages.length}
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
                                                onClick={() => setSelectedImageIndex(index)}
                                                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                                    selectedImageIndex === index 
                                                        ? 'border-purple-600 scale-105 shadow-lg' 
                                                        : 'border-transparent hover:border-purple-300'
                                                }`}
                                            >
                                                <img
                                                    src={getOptimizedImage(img.url, 100)}
                                                    alt={img.alt || `${product.name} - vista ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null
                                                        e.target.src = 'https://via.placeholder.com/100?text=Error'
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
                            {/* Título y rating */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar 
                                                key={i} 
                                                className={`w-5 h-5 ${
                                                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                                }`} 
                                            />
                                        ))}
                                        <span className="text-sm text-gray-500 ml-2">(45 reseñas)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Precio y stock */}
                            <div className="flex items-center gap-4">
                                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-2xl">
                                    <span className="text-3xl font-bold">${product.price?.toFixed(2)}</span>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                                    product.stock > 10 ? 'bg-green-100 text-green-700' :
                                    product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    <BsLightningCharge className="w-5 h-5" />
                                    <span className="font-medium">
                                        {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-semibold mb-3">Descripción del producto</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>

                            {/* Características */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <BsTruck className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="font-semibold text-gray-800">Envío gratis</span>
                                    </div>
                                    <p className="text-sm text-gray-600">En compras mayores a $50</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FaShieldAlt className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <span className="font-semibold text-gray-800">Garantía</span>
                                    </div>
                                    <p className="text-sm text-gray-600">1 año de garantía</p>
                                </div>
                            </div>

                            {/* Botón de compra */}
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`w-full btn btn-success btn-lg text-lg relative overflow-hidden group ${
                                    product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {addedToCart ? (
                                        <>
                                            <FiCheckCircle className="w-5 h-5 animate-bounce" />
                                            ¡Agregado!
                                        </>
                                    ) : (
                                        <>
                                            <FiShoppingBag className="w-5 h-5" />
                                            {product.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
                                        </>
                                    )}
                                </span>
                                {!addedToCart && product.stock > 0 && (
                                    <span className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                                )}
                            </button>

                            {/* Stock bajo warning */}
                            {product.stock <= 5 && product.stock > 0 && (
                                <div className="flex items-center gap-2 text-orange-500 bg-orange-50 p-3 rounded-xl">
                                    <BsLightningCharge className="w-5 h-5 animate-pulse" />
                                    <p className="text-sm font-medium">
                                        ⚡ ¡Solo quedan {product.stock} unidades! Compra antes de que se agoten.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Modal con zoom y navegación */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                overlayClassName="fixed inset-0 bg-black/95 z-40"
                closeTimeoutMS={300}
            >
                <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto">
                    {/* Botón cerrar */}
                    <button
                        onClick={() => setModalIsOpen(false)}
                        className="absolute top-4 right-4 z-30 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm border border-white/20"
                        aria-label="Cerrar"
                    >
                        <FiX className="w-6 h-6" />
                    </button>

                    {/* Navegación */}
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

                    {/* Contenedor del zoom */}
                    <div className="h-full flex flex-col">
                        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden bg-black/40">
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
                        </div>

                        {/* Miniaturas en el modal */}
                        {hasMultipleImages && (
                            <div className="mt-4 flex justify-center gap-2 overflow-x-auto py-2">
                                {productImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                            selectedImageIndex === index 
                                                ? 'border-white scale-105 shadow-xl' 
                                                : 'border-transparent hover:border-white/50'
                                        }`}
                                    >
                                        <img
                                            src={getOptimizedImage(img.url, 100)}
                                            alt={`${product.name} - miniatura ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Título en el modal */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm border border-white/20">
                        {product.name}
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default DetailProduct