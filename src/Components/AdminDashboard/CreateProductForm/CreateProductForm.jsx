// src/Components/AdminDashboard/CreateProductForm/CreateProductForm.jsx
import { useForm } from 'react-hook-form'
import { useDashboardProduct } from '../../../Hooks/useDashboardProduct.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import api from '../../../services/api'
import {
    FiPlus,
    FiX,
    FiImage,
    FiPackage,
    FiDollarSign,
    FiTag,
    FiBox,
    FiInfo,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { PLACEHOLDER_IMAGE } from '../../../utils/imageUtils'

const CreateProductForm = () => {
    const { 
        createProduct, 
        categories, 
        categoriesLoading, 
        getCategories 
    } = useDashboardProduct()
    
    const navigate = useNavigate()
    const [subcategories, setSubcategories] = useState([])
    const [subcategoriesLoading, setSubcategoriesLoading] = useState(false)
    const [imageUrls, setImageUrls] = useState([''])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imagePreviews, setImagePreviews] = useState({})

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({ 
        mode: 'onChange',
        defaultValues: {
            category: '',
            subcategory: ''
        }
    })

    const selectedCategoryId = watch('category')
    const selectedCategory = categories.find(cat => cat._id === selectedCategoryId)

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
        setImageUrls([...imageUrls, ''])
    }

    const removeImageField = (index) => {
        if (imageUrls.length > 1) {
            const newUrls = imageUrls.filter((_, i) => i !== index)
            setImageUrls(newUrls)
            // Limpiar preview
            const newPreviews = { ...imagePreviews }
            delete newPreviews[index]
            setImagePreviews(newPreviews)
        }
    }

    const updateImageUrl = (index, value) => {
        const newUrls = [...imageUrls]
        newUrls[index] = value
        setImageUrls(newUrls)
        
        // Validar URL de imagen
        if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
            setImagePreviews(prev => ({ ...prev, [index]: value }))
        } else {
            const newPreviews = { ...imagePreviews }
            delete newPreviews[index]
            setImagePreviews(newPreviews)
        }
    }

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true)

            const validImages = imageUrls
                .filter(url => url && url.trim() !== '')
                .map(url => ({ url: url.trim() }))

            if (validImages.length === 0) {
                toast.error('Debes agregar al menos una imagen')
                setIsSubmitting(false)
                return
            }

            const selectedCat = categories.find(cat => cat._id === data.category)
            
            if (!selectedCat) {
                toast.error('Categoría no válida')
                setIsSubmitting(false)
                return
            }

            const productData = {
                name: data.name,
                description: data.description,
                price: parseFloat(data.price),
                stock: parseInt(data.stock),
                category: selectedCat._id,
                subcategory: data.subcategory || undefined,
                images: validImages
            }

            const result = await createProduct(productData)

            if (result.success) {
                toast.success(result.message)
                reset()
                setImageUrls([''])
                setImagePreviews({})
                navigate('/admin/dashboard/products')
            } else {
                toast.error(result.message || 'Error al crear producto')
            }
        } catch (error) {
            console.error('❌ Error en onSubmit:', error)
            toast.error('Error inesperado al crear el producto')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre del producto
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
                        type="text"
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
                    Descripción
                </label>
                <textarea
                    {...register('description', {
                        required: 'La descripción es requerida',
                        minLength: { value: 10, message: 'Mínimo 10 caracteres' },
                        maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                    })}
                    rows={4}
                    className={`w-full px-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                        errors.description
                            ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                    }`}
                    placeholder="Describe las características del producto..."
                />
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
                        Categoría
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FiPackage className="w-5 h-5" />
                        </div>
                        <select
                            {...register('category', {
                                required: 'La categoría es requerida',
                            })}
                            className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none text-gray-900 dark:text-white ${
                                errors.category
                                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                            } ${categoriesLoading ? 'opacity-50 cursor-wait' : ''}`}
                            disabled={categoriesLoading}
                        >
                            <option value="">
                                {categoriesLoading ? 'Cargando...' : 'Seleccionar categoría'}
                            </option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
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
                                className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none text-gray-900 dark:text-white ${
                                    subcategoriesLoading 
                                        ? 'opacity-50 cursor-wait border-gray-300 dark:border-gray-600' 
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
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
                        </div>
                        {subcategoriesLoading && (
                            <p className="text-gray-400 dark:text-gray-500 text-sm">Cargando subcategorías...</p>
                        )}
                    </div>
                )}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Precio */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Precio ($)
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FiDollarSign className="w-5 h-5" />
                        </div>
                        <input
                            {...register('price', {
                                required: 'El precio es requerido',
                                min: { value: 0.01, message: 'El precio debe ser mayor a 0' },
                            })}
                            className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white ${
                                errors.price
                                    ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                    : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                            }`}
                            type="number"
                            step="0.01"
                            placeholder="899.99"
                        />
                    </div>
                    {errors.price && (
                        <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                            {errors.price.message}
                        </p>
                    )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stock
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                            <FiBox className="w-5 h-5" />
                        </div>
                        <input
                            {...register('stock', {
                                required: 'El stock es requerido',
                                min: { value: 0, message: 'El stock mínimo debe ser mayor o igual a 0' },
                            })}
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

            {/* URLs de imágenes */}
            <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    URLs de imágenes
                </label>
                
                <div className="space-y-3">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                        <FiImage className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => updateImageUrl(index, e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder={`URL de imagen ${index + 1}`}
                                    />
                                </div>
                                {/* Vista previa */}
                                {imagePreviews[index] && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                            <img 
                                                src={imagePreviews[index]} 
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = PLACEHOLDER_IMAGE
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Vista previa</span>
                                    </div>
                                )}
                            </div>
                            {imageUrls.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                    title="Eliminar imagen"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
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

            {/* Info de categoría seleccionada */}
            {selectedCategory && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <div className="p-1 bg-green-100 dark:bg-green-800/50 rounded-lg">
                        <FiPackage className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-green-700 dark:text-green-400">
                        Categoría seleccionada: <strong>"{selectedCategory.name}"</strong>
                    </span>
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex gap-4 pt-4">
                <button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    type="submit"
                    disabled={isSubmitting || categoriesLoading}
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creando producto...</span>
                        </>
                    ) : (
                        <>
                            <FiCheckCircle className="w-5 h-5" />
                            <span>Crear Producto</span>
                        </>
                    )}
                </button>
                
                <button 
                    type="button"
                    onClick={() => navigate('/admin/dashboard/products')}
                    className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <FiX className="w-5 h-5" />
                    Cancelar
                </button>
            </div>
        </form>
    )
}

export default CreateProductForm