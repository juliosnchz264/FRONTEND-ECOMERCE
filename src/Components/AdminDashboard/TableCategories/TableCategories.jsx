// src/Components/AdminDashboard/TableCategories/TableCategories.jsx
import { useState } from 'react'
import { FiEdit, FiTrash2, FiEye, FiFolder, FiPackage, FiCheckCircle, FiXCircle, FiPlus } from 'react-icons/fi'
import { useCategory } from '../../../Hooks/useCategory.js'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const TableCategories = ({ categories, onEdit }) => {
    const { deleteCategory } = useCategory()
    const navigate = useNavigate()
    const [deleting, setDeleting] = useState(null)

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta categoría? Esto afectará a los productos asociados.')) {
            setDeleting(id)
            const result = await deleteCategory(id)
            setDeleting(null)
            if (!result.success) {
                toast.error('No se pudo eliminar la categoría')
            } else {
                toast.success('Categoría eliminada correctamente')
            }
        }
    }

    const handleViewSubcategories = (categoryId, categoryName) => {
        navigate(`/admin/dashboard/subcategories?category=${categoryId}&name=${encodeURIComponent(categoryName)}`)
    }

    if (!categories || categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="text-7xl mb-4">📁</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">No hay categorías para mostrar</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Crea tu primera categoría para comenzar</p>
                <button
                    onClick={() => onEdit({})}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                    <FiPlus className="w-5 h-5" />
                    Crear categoría
                </button>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                            <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Descripción</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Estado</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Productos</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Subcategorías</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <AnimatePresence>
                            {categories.map((cat, index) => (
                                <motion.tr 
                                    key={cat._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ${
                                        index % 2 === 0 
                                            ? 'bg-white dark:bg-gray-800' 
                                            : 'bg-gray-50/50 dark:bg-gray-700/30'
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                <FiFolder className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-800 dark:text-white">
                                                    {cat.name}
                                                </div>
                                                {cat.slug && (
                                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                                        slug: {cat.slug}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                            {cat.description || '—'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                            cat.status === 'activo' 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}>
                                            {cat.status === 'activo' ? (
                                                <FiCheckCircle className="w-3 h-3" />
                                            ) : (
                                                <FiXCircle className="w-3 h-3" />
                                            )}
                                            {cat.status || 'inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                                            <FiPackage className="w-3 h-3" />
                                            {cat.productCount || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleViewSubcategories(cat._id, cat.name)}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all text-sm font-medium"
                                            title="Ver subcategorías"
                                        >
                                            <FiEye className="w-4 h-4" />
                                            Ver ({cat.subcategoryCount || 0})
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onEdit(cat)}
                                                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all"
                                                title="Editar"
                                            >
                                                <FiEdit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                disabled={deleting === cat._id}
                                                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Eliminar"
                                            >
                                                {deleting === cat._id ? (
                                                    <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <FiTrash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>

            {/* Footer con resumen */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiFolder className="w-4 h-4" />
                        <span>Total de categorías: <span className="font-semibold text-purple-600 dark:text-purple-400">{categories.length}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FiPackage className="w-4 h-4" />
                        <span>Productos totales: <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {categories.reduce((acc, cat) => acc + (cat.productCount || 0), 0)}
                        </span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableCategories