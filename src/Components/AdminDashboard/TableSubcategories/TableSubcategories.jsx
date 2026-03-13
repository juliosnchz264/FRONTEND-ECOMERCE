import { useState } from 'react'
import { FiEdit, FiTrash2, FiFolder, FiGrid } from 'react-icons/fi'
import { useCategory } from '../../../Hooks/useCategory.js'
import { useProduct } from '../../../Hooks/useProduct.js'
import toast from 'react-hot-toast'

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

    // Función mejorada para obtener el nombre de la categoría
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
            <div className="flex flex-col items-center justify-center py-16">
                <div className="text-gray-300 text-6xl mb-4">📂</div>
                <p className="text-gray-500 text-lg font-medium mb-2">
                    {categoryName 
                        ? `No hay subcategorías para ${categoryName}` 
                        : 'No hay subcategorías para mostrar'}
                </p>
                <p className="text-gray-400 text-sm">
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
                <tbody className="divide-y divide-gray-200">
                    {subcategories.map((subcat, index) => (
                        <tr 
                            key={subcat._id} 
                            className={`hover:bg-purple-50/50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                            }`}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FiGrid className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800">
                                            {subcat.name}
                                        </div>
                                        {subcat.slug && (
                                            <div className="text-xs text-gray-400">
                                                slug: {subcat.slug}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 rounded-lg">
                                        <FiFolder className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        {getCategoryName(subcat.category)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 max-w-xs truncate">
                                    {subcat.description || '—'}
                                </p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(subcat)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                                        title="Editar"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(subcat._id)}
                                        disabled={deleting === subcat._id}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Eliminar"
                                    >
                                        {deleting === subcat._id ? (
                                            <span className="loading loading-spinner loading-xs"></span>
                                        ) : (
                                            <FiTrash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default TableSubcategories