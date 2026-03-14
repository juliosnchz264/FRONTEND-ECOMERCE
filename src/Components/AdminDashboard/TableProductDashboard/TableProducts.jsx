import { Link } from 'react-router'
import { FiEdit, FiTrash2, FiEye} from 'react-icons/fi'
import { useProduct } from '../../../Hooks/useProduct.js'
import toast from 'react-hot-toast'

const TableProducts = ({ products }) => {
    const { deleteProduct, categories } = useProduct()

    // Función para obtener el nombre de la categoría
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

    // Función para obtener el nombre de la subcategoría
    const getSubcategoryName = (product) => {
        if (!product.subcategory) return null
        
        if (typeof product.subcategory === 'object' && product.subcategory.name) {
            return product.subcategory.name
        }
        
        return product.subcategory?.name || 'Subcategoría'
    }

    // Función para obtener la imagen principal
    const getMainImage = (product) => {
        if (product.images && product.images.length > 0) {
            const mainImage = product.images.find(img => img.isMain) || product.images[0]
            return mainImage.url
        }
        return product.imageUrl || 'https://via.placeholder.com/48?text=No+Image'
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
            <div className="flex flex-col items-center justify-center py-16">
                <div className="text-gray-300 text-7xl mb-4">📦</div>
                <p className="text-gray-500 text-lg font-medium mb-2">No hay productos para mostrar</p>
                <p className="text-gray-400 text-sm mb-6">Cambia los filtros o crea un nuevo producto</p>
                <Link 
                    to="/admin/dashboard/products/createProduct" 
                    className="btn btn-primary bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800"
                >
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
                <tbody className="divide-y divide-gray-200">
                    {products.map((product, index) => {
                        const subcategoryName = getSubcategoryName(product);
                        const mainImage = getMainImage(product);
                        
                        return (
                            <tr 
                                key={product._id} 
                                className={`hover:bg-purple-50/50 transition-colors ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                }`}
                            >
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 shadow-sm flex-shrink-0">
                                            <img
                                                src={mainImage}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null
                                                    e.target.src = 'https://via.placeholder.com/40?text=Error'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm">
                                                {product.name}
                                            </div>
                                            <div className="text-xs text-gray-500 max-w-[200px] truncate">
                                                {product.description}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                        {getCategoryName(product)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    {subcategoryName ? (
                                        <span className="inline-flex items-center px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                            {subcategoryName}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-4">
                                    <span className="font-bold text-purple-600 text-sm">
                                        ${product.price?.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        product.stock > 10 
                                            ? 'bg-green-100 text-green-700' 
                                            : product.stock > 0 
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-red-100 text-red-700'
                                    }`}>
                                        {product.stock > 0 ? `${product.stock} disp.` : 'Sin stock'}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/detailProduct/${product._id}`}
                                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all group relative"
                                            title="Ver detalles"
                                        >
                                            <FiEye className="w-4 h-4" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Ver detalles
                                            </span>
                                        </Link>
                                        <Link
                                            to={`/admin/dashboard/products/updateProduct/${product._id}`}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all group relative"
                                            title="Editar"
                                        >
                                            <FiEdit className="w-4 h-4" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Editar
                                            </span>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all group relative"
                                            title="Eliminar"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Eliminar
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TableProducts