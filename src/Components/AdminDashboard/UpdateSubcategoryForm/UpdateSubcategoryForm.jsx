// src/Components/AdminDashboard/UpdateSubcategoryForm/UpdateSubcategoryForm.jsx
import { useForm } from 'react-hook-form'
import { useCategory } from '../../../Hooks/useCategory.js'
import { useProduct } from '../../../Hooks/useProduct.js'
import toast from 'react-hot-toast'
import { FiX, FiGrid, FiFolder, FiFileText, FiImage, FiCheck, FiSave, FiInfo } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PLACEHOLDER_IMAGE } from '../../../utils/imageUtils'

const UpdateSubcategoryForm = ({ subcategory, onSuccess, onCancel }) => {
    const { updateSubcategory } = useCategory()
    const { categories } = useProduct()
    const [previewImage, setPreviewImage] = useState(subcategory?.imageUrl || '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: subcategory?.name || '',
            category: subcategory?.category || '',
            description: subcategory?.description || '',
            imageUrl: subcategory?.imageUrl || ''
        }
    })

    const watchImageUrl = watch('imageUrl')
    const selectedCategory = watch('category')

    useEffect(() => {
        if (subcategory) {
            reset({
                name: subcategory.name,
                category: subcategory.category,
                description: subcategory.description || '',
                imageUrl: subcategory.imageUrl || ''
            })
            setPreviewImage(subcategory.imageUrl || '')
        }
    }, [subcategory, reset])

    useEffect(() => {
        if (watchImageUrl && (watchImageUrl.startsWith('http://') || watchImageUrl.startsWith('https://'))) {
            setPreviewImage(watchImageUrl)
        } else {
            setPreviewImage('')
        }
    }, [watchImageUrl])

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const result = await updateSubcategory(subcategory._id, data)
        setIsSubmitting(false)

        if (result.success) {
            toast.success('Subcategoría actualizada exitosamente')
            if (onSuccess) onSuccess()
        } else {
            toast.error(result.message || 'Error al actualizar la subcategoría')
        }
    }

    const selectedCategoryData = categories.find(c => c._id === selectedCategory)

    if (!subcategory) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FiGrid className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Actualizar Subcategoría</h2>
                        </div>
                        {onCancel && (
                            <button 
                                onClick={onCancel} 
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                                title="Cerrar"
                            >
                                <FiX className="h-5 w-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Formulario */}
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Categoría padre */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    <FiFolder className="w-5 h-5" />
                                </div>
                                <select
                                    {...register('category', {
                                        required: 'Debes seleccionar una categoría'
                                    })}
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

                        {/* Nombre de la subcategoría */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre de la subcategoría <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    <FiGrid className="w-5 h-5" />
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
                                    placeholder="Ej: Móviles, Camperas, Novelas..."
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
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <textarea
                                    {...register('description', {
                                        maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                                    })}
                                    rows="4"
                                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                        errors.description
                                            ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                                    }`}
                                    placeholder="Descripción de la subcategoría (opcional)"
                                />
                            </div>
                            {errors.description && (
                                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                    {errors.description.message}
                                </p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <FiInfo className="w-3 h-3" />
                                Una buena descripción ayuda a organizar mejor los productos
                            </p>
                        </div>

                        {/* URL de imagen */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                URL de imagen
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    <FiImage className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('imageUrl', {
                                        pattern: {
                                            value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))?$/i,
                                            message: 'Debe ser una URL válida de imagen'
                                        }
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                                        errors.imageUrl
                                            ? 'border-red-300 dark:border-red-500 focus:ring-red-200 dark:focus:ring-red-500/20'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500'
                                    }`}
                                    placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                                />
                            </div>
                            {errors.imageUrl && (
                                <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 dark:bg-red-400 rounded-full"></span>
                                    {errors.imageUrl.message}
                                </p>
                            )}
                            
                            {/* Vista previa de la imagen */}
                            {previewImage && !errors.imageUrl && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 flex items-center gap-3"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                        <img 
                                            src={previewImage} 
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = PLACEHOLDER_IMAGE
                                            }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">Vista previa</span>
                                </motion.div>
                            )}
                        </div>

                        {/* Vista previa de la categoría seleccionada */}
                        {selectedCategory && selectedCategoryData && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl"
                            >
                                <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                    <FiCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Actualizando subcategoría para:</p>
                                    <p className="font-semibold text-purple-700 dark:text-purple-400">
                                        {selectedCategoryData.name}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Información de la subcategoría */}
                        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-400">
                                <FiGrid className="w-4 h-4" />
                                <span>Editando subcategoría: <strong>{subcategory.name}</strong></span>
                            </div>
                            <p className="text-xs text-purple-500 dark:text-purple-500 mt-1 font-mono">
                                ID: {subcategory._id}
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Actualizando...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-5 h-5" />
                                        <span>Actualizar Subcategoría</span>
                                    </>
                                )}
                            </button>
                            {onCancel && (
                                <button 
                                    type="button" 
                                    onClick={onCancel} 
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 py-3 rounded-xl font-semibold transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                    <span>Cancelar</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

export default UpdateSubcategoryForm