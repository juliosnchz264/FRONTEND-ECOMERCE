// src/Components/AdminDashboard/TableSubcategories/TableSubcategories.jsx
import { useState } from 'react'
import { FiEdit, FiTrash2, FiFolder, FiGrid, FiFileText, FiAlertCircle } from 'react-icons/fi'
import { useCategory } from '../../../Hooks/useCategory.js'
import { useProduct } from '../../../Hooks/useProduct.js'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const TableSubcategories = ({ subcategories, categoryId, categoryName, onEdit }) => {
    const { deleteSubcategory } = useCategory()
    const { categories } = useProduct()
    const [deleting, setDeleting] = useState(null)

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta subcategoría?')) {
            setDeleting(id)
            const result = await deleteSubcategory(id, categoryId)
            setDeleting(null)
            if (!result.success) {
                toast.error('No se pudo eliminar la subcategoría')
            } else {
                toast.success('Subcategoría eliminada correctamente')
            }
        }
    }

    const getCategoryName = (categoryField) => {
        if (!categoryField) return 'Sin categoría'
        
        if (typeof categoryField === 'object' && categoryField !== null) {
            return categoryField.name || 'Categoría sin nombre'
        }
        
        if (typeof categoryField === 'string') {
            const cat = categories.find(c => c._id === categoryField)
            return cat ? cat.name : 'Categoría no encontrada'
        }
        
        return 'Categoría no encontrada'
    }

    if (!subcategories || subcategories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">
                    {categoryName 
                        ? `No hay subcategorías para ${categoryName}` 
                        : 'No hay subcategorías para mostrar'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm">
                    {categoryName 
                        ? 'Crea la primera subcategoría para esta categoría'
                        : 'Selecciona una categoría o crea una nueva subcategoría'}
                </p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
                <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Categoría</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {subcategories.map((subcat, index) => (
                        <motion.tr 
                            key={subcat._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors ${
                                index % 2 === 0 
                                    ? 'bg-white dark:bg-gray-800' 
                                    : 'bg-gray-50/50 dark:bg-gray-700/30'
                            }`}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <FiGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-white">
                                            {subcat.name}
                                        </div>
                                        {subcat.slug && (
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                slug: {subcat.slug}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <FiFolder className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                                        {getCategoryName(subcat.category)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {subcat.description ? (
                                    <div className="flex items-center gap-2">
                                        <FiFileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                            {subcat.description}
                                        </p>
                                    </div>
                                ) : (
                                    <span className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                        <FiAlertCircle className="w-3 h-3" />
                                        Sin descripción
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(subcat)}
                                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all group relative"
                                        title="Editar"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            Editar
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subcat._id)}
                                        disabled={deleting === subcat._id}
                                        className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative"
                                        title="Eliminar"
                                    >
                                        {deleting === subcat._id ? (
                                            <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <FiTrash2 className="w-4 h-4" />
                                        )}
                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            Eliminar
                                        </span>
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableSubcategories