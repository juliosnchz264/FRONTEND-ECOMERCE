// src/Components/AdminDashboard/UpdateProductForm/UpdateProductForm.jsx
import { useForm } from 'react-hook-form'
import { useDashboardProduct } from '../../../Hooks/useDashboardProduct.js'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import api from '../../../services/api'
import { FiPlus, FiX, FiStar, FiPackage, FiDollarSign, FiTag, FiBox, FiSave, FiInfo, FiCheck } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { PLACEHOLDER_IMAGE } from '../../../utils/imageUtils'

const UpdateProductForm = ({ product }) => {
    const { updateProduct, categories, getCategories } = useDashboardProduct()
    const navigate = useNavigate()
    const [subcategories, setSubcategories] = useState([])
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false)
    const [images, setImages] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const getCategoryId = () => {
        if (!product) return ''
        if (product.category && typeof product.category === 'object' && product.category._id) {
            return product.category._id
        }
        return product.category || ''
    }

    const getSubcategoryId = () => {
        if (!product) return ''
        if (product.subcategory && typeof product.subcategory === 'object' && product.subcategory._id) {
            return product.subcategory._id
        }
        return product.subcategory || ''
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({ 
        mode: 'onChange',
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            price: product?.price || '',
            stock: product?.stock || '',
            category: getCategoryId(),
            subcategory: getSubcategoryId()
        }
    })

    const selectedCategoryId = watch('category')
    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId)

    useEffect(() => {
        if (product) {
            if (product.images && product.images.length > 0) {
                setImages(product.images.map(img => ({
                    url: img.url,
                    isMain: img.isMain || false,
                    _id: img._id,
                    publicId: img.publicId
                })))
            } 
            else if (product.imageUrl) {
                setImages([{
                    url: product.imageUrl,
                    isMain: true
                }])
            }
        }
    }, [product])

    useEffect(() => {
        if (categories.length === 0) {
            getCategories()
        }
    }, [categories, getCategories])

    useEffect(() => {
        const loadSubcategories = async () => {
            if (!selectedCategoryId) {
                setSubcategories([])
                return
            }
            
            try {
                setSubcategoriesLoading(true)
                const response = await api.get(
                    `/subcategories/category/${selectedCategoryId}`
                )
                setSubcategories(response.data)
            } catch (error) {
                console.error('Error cargando subcategorías:', error)
                toast.error('Error al cargar subcategorías')
            } finally {
                setSubcategoriesLoading(false)
            }
        }

        loadSubcategories()
    }, [selectedCategoryId])

    const addImageField = () => {
        setImages([...images, { url: '', isMain: false }])
    }

    const removeImage = (index) => {
        if (images.length > 1) {
            const newImages = images.filter((_, i) => i !== index)
            setImages(newImages)
        } else {
            toast.error('El producto debe tener al menos una imagen')
        }
    }

    const updateImageUrl = (index, url) => {
        const newImages = [...images]
        newImages[index].url = url
        setImages(newImages)
    }

    const setAsMain = (index) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isMain: i === index
        }))
        setImages(newImages)
    }

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true)
            
            if (!data.category || data.category.length < 5) {
                toast.error('Por favor selecciona una categoría válida')
                setIsSubmitting(false)
                return
            }

            const validImages = images
                .filter(img => img.url && img.url.trim() !== '')
                .map(img => ({
                    url: img.url.trim(),
                    isMain: img.isMain || false,
                    ...(img._id && { _id: img._id }),
                    ...(img.publicId && { publicId: img.publicId })
                }))

            if (validImages.length === 0) {
                toast.error('Debes tener al menos una imagen')
                setIsSubmitting(false)
                return
            }

            const productData = {
                name: data.name.trim(),
                description: data.description.trim(),
                price: parseFloat(data.price),
                stock: parseInt(data.stock),
                category: data.category,
                ...(data.subcategory && { subcategory: data.subcategory }),
                images: validImages
            }

            const result = await updateProduct(product._id, productData)

            if (result.success) {
                toast.success(result.message || 'Producto actualizado correctamente')
                navigate('/admin/dashboard/products')
            } else {
                toast.error(result.message || 'Error al actualizar producto')
            }
        } catch (error) {
            console.error('❌ Error en onSubmit:', error)
            toast.error('Error inesperado al actualizar el producto')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="text-7xl mb-4">😕</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">No se encontró el producto</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">El producto que buscas no existe o fue eliminado</p>
                <button 
                    onClick={() => navigate('/admin/dashboard/products')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                    Volver al panel
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre del producto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <FiTag className="w-5 h-5" />
                    </div>
                    <input
                        {...register('name', {
                            required: 'El nombre es requerido',
                            minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                            maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                        })}
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.name
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                        }`}
                        placeholder="Ej: ASUS TUF Gaming A15"
                    />
                </div>
                {errors.name && (
                    <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Descripción <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
                        <FiTag className="w-5 h-5" />
                    </div>
                    <textarea
                        {...register('description', {
                            required: 'La descripción es requerida',
                            minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                            maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                        })}
                        rows={4}
                        className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                            errors.description
                                ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                        }`}
                        placeholder="Describe las características del producto..."
                    />
                </div>
                {errors.description && (
                    <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                        <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Categoría y Subcategoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Categoría */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Categoría <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FiPackage className="w-5 h-5" />
                        </div>
                        <select
                            {...register('category', { required: 'La categoría es requerida' })}
                            className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none text-gray-900 dark:text-white ${
                                errors.category
                                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                            }`}
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {errors.category && (
                        <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                            {errors.category.message}
                        </p>
                    )}
                </div>

                {/* Subcategoría */}
                {selectedCategoryId && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subcategoría (opcional)
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <FiBox className="w-5 h-5" />
                            </div>
                            <select
                                {...register('subcategory')}
                                className={`w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none text-gray-900 dark:text-white ${
                                    subcategoriesLoading ? 'opacity-50 cursor-wait border-gray-300 dark:border-gray-600' : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                                }`}
                                disabled={subcategoriesLoading}
                            >
                                <option value="">Sin subcategoría</option>
                                {subcategories.map((subcat) => (
                                    <option key={subcat._id} value={subcat._id}>
                                        {subcat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {subcategoriesLoading && (
                            <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando subcategorías...</p>
                        )}
                    </div>
                )}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Precio ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FiDollarSign className="w-5 h-5" />
                        </div>
                        <input
                            {...register('price', { required: 'Requerido', min: { value: 0.01, message: 'Mínimo 0.01' } })}
                            className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                                errors.price
                                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                            }`}
                            type="number"
                            step="0.01"
                            placeholder="1299.99"
                        />
                    </div>
                    {errors.price && (
                        <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                            {errors.price.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stock <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FiBox className="w-5 h-5" />
                        </div>
                        <input
                            {...register('stock', { required: 'Requerido', min: { value: 0, message: 'Mínimo 0' } })}
                            className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                                errors.stock
                                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                            }`}
                            type="number"
                            step="1"
                            placeholder="15"
                        />
                    </div>
                    {errors.stock && (
                        <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                            {errors.stock.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Información de categoría seleccionada */}
            {selectedCategory && (
                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <div className="p-1 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                        <FiPackage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm text-purple-700 dark:text-purple-400">
                        Editando producto en categoría: <strong>"{selectedCategory.name}"</strong>
                    </span>
                </div>
            )}

            {/* Imágenes */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Imágenes del producto <span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-3">
                    <AnimatePresence>
                        {images.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex gap-4 items-start">
                                    {img.url && (
                                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
                                            <img 
                                                src={img.url} 
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = PLACEHOLDER_IMAGE
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="flex-1">
                                        <div className="flex gap-2">
                                            <input
                                                type="url"
                                                value={img.url}
                                                onChange={(e) => updateImageUrl(index, e.target.value)}
                                                className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                                placeholder={`URL de imagen ${index + 1}`}
                                            />
                                            {images.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Eliminar imagen"
                                                >
                                                    <FiX className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setAsMain(index)}
                                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                                    img.isMain 
                                                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' 
                                                        : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-500'
                                                }`}
                                            >
                                                <FiStar className={`w-4 h-4 ${img.isMain ? 'fill-yellow-500 dark:fill-yellow-400' : ''}`} />
                                                {img.isMain ? 'Imagen principal' : 'Marcar como principal'}
                                            </button>
                                            {img.isMain && (
                                                <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                                    <FiCheck className="w-3 h-3" /> Principal
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    onClick={addImageField}
                    className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-xl transition-colors font-medium"
                >
                    <FiPlus className="w-5 h-5" />
                    Agregar otra imagen
                </button>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] shadow-lg hover:shadow-purple-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:scale-100" 
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Actualizando producto...</span>
                        </>
                    ) : (
                        <>
                            <FiSave className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span>Actualizar producto</span>
                        </>
                    )}
                </button>
                
                <button 
                    type="button"
                    onClick={() => navigate('/admin/dashboard/products')}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-1 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    <FiX className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    <span>Cancelar</span>
                </button>
            </div>
        </form>
    )
}

export default UpdateProductForm