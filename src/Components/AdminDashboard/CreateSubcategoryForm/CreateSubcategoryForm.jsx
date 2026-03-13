import { useForm } from 'react-hook-form'
import { useCategory } from '../../../Hooks/useCategory.js'
import { useProduct } from '../../../Hooks/useProduct.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { FiX, FiGrid, FiFolder, FiFileText, FiImage, FiCheck } from 'react-icons/fi'
import { useEffect } from 'react'

const CreateSubcategoryForm = ({ onSuccess, onCancel }) => {
    const { createSubcategory } = useCategory()
    const { categories, getCategories } = useProduct()
    const navigate = useNavigate()

    useEffect(() => {
        if (categories.length === 0) {
            getCategories()
        }
    }, [categories, getCategories])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: '',
            category: '',
            description: '',
            imageUrl: ''
        }
    })

    const selectedCategory = watch('category')
    const selectedCategoryData = categories.find(c => c._id === selectedCategory)

    const onSubmit = async (data) => {
        const result = await createSubcategory(data)

        if (result.success) {
            toast.success('Subcategoría creada exitosamente')
            reset()
            if (onSuccess) onSuccess()
            else navigate('/admin/dashboard/subcategories')
        } else {
            toast.error(result.message || 'Error al crear la subcategoría')
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <FiGrid className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Crear Nueva Subcategoría</h2>
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
                            <label className="block text-sm font-medium text-gray-700">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FiFolder className="w-5 h-5" />
                                </div>
                                <select
                                    {...register('category', {
                                        required: 'Debes seleccionar una categoría'
                                    })}
                                    className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all appearance-none bg-white ${
                                        errors.category
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
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
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            {errors.category && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        {/* Nombre de la subcategoría */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Nombre de la subcategoría <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FiGrid className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('name', {
                                        required: 'El nombre es requerido',
                                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                                        maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.name
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                                    }`}
                                    placeholder="Ej: Móviles, Camperas, Novelas..."
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3 text-gray-400">
                                    <FiFileText className="w-5 h-5" />
                                </div>
                                <textarea
                                    {...register('description', {
                                        maxLength: { value: 200, message: 'Máximo 200 caracteres' }
                                    })}
                                    rows="4"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                                        errors.description
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                                    }`}
                                    placeholder="Descripción de la subcategoría (opcional)"
                                />
                            </div>
                            {errors.description && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* URL de imagen */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                URL de imagen
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FiImage className="w-5 h-5" />
                                </div>
                                <input
                                    {...register('imageUrl', {
                                        pattern: {
                                            value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))?$/i,
                                            message: 'Debe ser una URL válida de imagen'
                                        }
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.imageUrl
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-gray-300 focus:ring-purple-200 focus:border-purple-500'
                                    }`}
                                    placeholder="https://ejemplo.com/imagen.jpg (opcional)"
                                />
                            </div>
                            {errors.imageUrl && (
                                <p className="text-red-500 text-sm flex items-center gap-1">
                                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                                    {errors.imageUrl.message}
                                </p>
                            )}
                        </div>

                        {/* Vista previa de la categoría seleccionada */}
                        {selectedCategory && selectedCategoryData && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FiCheck className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Creando subcategoría para:</p>
                                    <p className="font-semibold text-purple-700">
                                        {selectedCategoryData.name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                className="flex-1 btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                            >
                                Crear Subcategoría
                            </button>
                            {onCancel && (
                                <button 
                                    type="button" 
                                    onClick={onCancel} 
                                    className="flex-1 btn btn-ghost border border-gray-200 hover:bg-gray-50 py-3 rounded-xl font-semibold transition-all"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateSubcategoryForm