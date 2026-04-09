// src/Components/AdminDashboard/TableProducts/TableProducts.jsx
import { Link } from 'react-router'
import { FiEdit, FiTrash2, FiEye, FiPackage, FiTag, FiAlertCircle } from 'react-icons/fi'
import { useDashboardProduct } from '../../../Hooks/useDashboardProduct.js'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { PLACEHOLDER_IMAGE } from '../../../utils/imageUtils'

const TableProducts = ({ products }) => {
    const { deleteProduct, categories } = useDashboardProduct()

    const getCategoryName = (product) => {
        if (!product.category) return 'Sin categoría'
        
        if (typeof product.category === 'object' && product.category.name) {
            return product.category.name
        }
        
        if (typeof product.category === 'string') {
            const found = categories.find(c => c._id === product.category)
            return found ? found.name : 'Categoría no encontrada'
        }
        
        return String(product.category)
    }

    const getSubcategoryName = (product) => {
        if (!product.subcategory) return null
        
        if (typeof product.subcategory === 'object' && product.subcategory.name) {
            return product.subcategory.name
        }
        
        return product.subcategory?.name || 'Subcategoría'
    }

    const getMainImage = (product) => {
        if (product.images && product.images.length > 0) {
            const mainImage = product.images.find(img => img.isMain) || product.images[0]
            return mainImage.url
        }
        return product.imageUrl || PLACEHOLDER_IMAGE
    }

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            const result = await deleteProduct(id)
            if (result.success) {
                toast.success(result.message)
            } else {
                toast.error(result.message)
            }
        }
    }

    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="text-7xl mb-4">📦</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">No hay productos para mostrar</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Cambia los filtros o crea un nuevo producto</p>
                <Link 
                    to="/admin/dashboard/products/createProduct" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25"
                >
                    <FiPackage className="w-5 h-5" />
                    Crear producto
                </Link>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
                <thead>
                    <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                        <th className="px-4 py-4 text-left text-sm font-semibold">Producto</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">Categoría</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">Subcategoría</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">Precio</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">Stock</th>
                        <th className="px-4 py-4 text-left text-sm font-semibold">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {products.map((product, index) => {
                        const subcategoryName = getSubcategoryName(product);
                        const mainImage = getMainImage(product);
                        
                        return (
                            <motion.tr 
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors ${
                                    index % 2 === 0 
                                        ? 'bg-white dark:bg-gray-800' 
                                        : 'bg-gray-50/50 dark:bg-gray-700/30'
                                }`}
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 shadow-sm flex-shrink-0">
                                            <img
                                                src={mainImage}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = PLACEHOLDER_IMAGE
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 dark:text-white text-sm">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                                                {product.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                                        <FiTag className="w-3 h-3" />
                                        {getCategoryName(product)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {subcategoryName ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full text-xs font-medium">
                                            <FiTag className="w-3 h-3" />
                                            {subcategoryName}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                                        ${product.price?.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        product.stock > 10 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                            : product.stock > 0 
                                                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    }`}>
                                        {product.stock > 0 ? `${product.stock} disp.` : (
                                            <>
                                                <FiAlertCircle className="w-3 h-3" />
                                                Sin stock
                                            </>
                                        )}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/detailProduct/${product._id}`}
                                            className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all group relative"
                                            title="Ver detalles"
                                        >
                                            <FiEye className="w-4 h-4" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Ver detalles
                                            </span>
                                        </Link>
                                        <Link
                                            to={`/admin/dashboard/products/updateProduct/${product._id}`}
                                            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all group relative"
                                            title="Editar"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Editar
                                            </span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-all group relative"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Eliminar
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableProducts