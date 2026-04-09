// src/Components/AdminDashboard/CreateCategoryForm/CreateCategoryForm.jsx
import { useForm } from 'react-hook-form'
import { useCategory } from '../../../Hooks/useCategory.js'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { 
    FiX, 
    FiFolder, 
    FiFileText, 
    FiImage, 
    FiCheckCircle, 
    FiXCircle,
    FiPlus,
    FiInfo
} from 'react-icons/fi'
import { motion } from 'framer-motion'
import { PLACEHOLDER_IMAGE } from '../../../utils/imageUtils'

const CreateCategoryForm = ({ onSuccess, onCancel }) => {
    const { createCategory } = useCategory()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            imageUrl: '',
            status: 'activo'
        }
    })

    const imageUrl = watch('imageUrl')

    const onSubmit = async (data) => {
        const result = await createCategory(data)

        if (result.success) {
            toast.success('Categoría creada exitosamente')
            reset()
            if (onSuccess) onSuccess()
            else navigate('/admin/dashboard/categories')
        } else {
            toast.error(result.message || 'Error al crear la categoría')
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <FiFolder className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-white">Crear Nueva Categoría</h2>
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
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre de la categoría <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                    <FiFolder className="w-5 h-5" />
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
                                    placeholder="Ej: Electrónica, Ropa, Hogar..."
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
                                    placeholder="Descripción de la categoría (opcional)"
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
                                Una buena descripción ayuda a los clientes a entender mejor la categoría
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
                            {imageUrl && !errors.imageUrl && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-2 flex items-center gap-3"
                                >
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                                        <img 
                                            src={imageUrl} 
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

                        {/* Estado */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Estado
                            </label>
                            <div className="relative">
                                <select
                                    {...register('status')}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 transition-all appearance-none text-gray-900 dark:text-white cursor-pointer"
                                >
                                    <option value="activo" className="text-green-600 dark:text-green-400">✅ Activo</option>
                                    <option value="inactivo" className="text-gray-500 dark:text-gray-400">⭕ Inactivo</option>
                                </select>
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Activo: visible en la tienda</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Inactivo: oculto temporalmente</span>
                                </div>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button 
                                type="submit" 
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25"
                            >
                                <FiPlus className="w-5 h-5" />
                                Crear Categoría
                            </button>
                            {onCancel && (
                                <button 
                                    type="button" 
                                    onClick={onCancel} 
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 py-3 rounded-xl font-semibold transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    )
}

export default CreateCategoryForm