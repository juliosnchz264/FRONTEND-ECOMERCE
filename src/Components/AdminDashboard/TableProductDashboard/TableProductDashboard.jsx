import { Link } from 'react-router'
import { useProduct } from '../../../Hooks/useProduct.js'
import TableProducts from './TableProducts'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FiFilter, FiPackage, FiGrid } from 'react-icons/fi'

const TableProductDashboard = () => {
    const {
        products = [],
        productsLoading = false,
        categories = [],
        categoriesLoading = false,
        getCategories = () => {},
    } = useProduct()

    const [selectedCategory, setSelectedCategory] = useState('todos')
    const [selectedSubcategory, setSelectedSubcategory] = useState('todos')
    const [subcategories, setSubcategories] = useState([])

    useEffect(() => {
        if (categories.length === 0 && getCategories) {
            getCategories()
        }
    }, [categories, getCategories])

    // Cargar subcategorías cuando cambia la categoría seleccionada
    useEffect(() => {
        const loadSubcategories = async () => {
            if (selectedCategory === 'todos') {
                setSubcategories([])
                setSelectedSubcategory('todos')
                return
            }
            
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/subcategories/category/${selectedCategory}`
                )
                setSubcategories(response.data)
            } catch (error) {
                console.error('Error cargando subcategorías:', error)
            }
        }

        if (selectedCategory !== 'todos') {
            loadSubcategories()
        }
    }, [selectedCategory])

    // Filtrar productos
    const filteredProducts = products.filter((p) => {
        if (selectedCategory !== 'todos') {
            const productCategory = p.category?._id || p.category
            if (productCategory !== selectedCategory) return false
        }
        
        if (selectedSubcategory !== 'todos') {
            const productSubcategory = p.subcategory?._id || p.subcategory
            if (productSubcategory !== selectedSubcategory) return false
        }
        
        return true
    })

    if (productsLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200">
                <span className="loading loading-spinner loading-lg text-purple-600 mb-4"></span>
                <p className="text-gray-500">Cargando productos...</p>
            </div>
        )
    }

    return (
            <div className="container mx-auto px-4">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiPackage className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold">Panel de Productos</h1>
                    </div>
                    <p className="text-purple-100 max-w-2xl">
                        Gestiona todos tus productos, categorías y stock desde este panel
                    </p>
                </div>

                {/* Barra de filtros y acciones */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <FiFilter className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                            {/* Selector de categorías */}
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value)
                                    setSelectedSubcategory('todos')
                                }}
                                className="select select-bordered w-full sm:w-48 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                                disabled={categoriesLoading}
                            >
                                <option value="todos">Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* Selector de subcategorías */}
                            {selectedCategory !== 'todos' && (
                                <select
                                    value={selectedSubcategory}
                                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                                    className="select select-bordered w-full sm:w-48 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                                >
                                    <option value="todos">Todas las subcategorías</option>
                                    {subcategories.map((subcat) => (
                                        <option key={subcat._id} value={subcat._id}>
                                            {subcat.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                            <Link
                                to="/admin/dashboard/products/createProduct"
                                className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 w-full sm:w-auto"
                            >
                                + Crear Producto
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <TableProducts products={filteredProducts} />

                    {/* Footer con resumen */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FiPackage className="w-4 h-4" />
                            <span>Mostrando <span className="font-semibold text-purple-600">{filteredProducts.length}</span> de <span className="font-semibold">{products.length}</span> productos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiGrid className="w-4 h-4" />
                            <span>Stock bajo: <span className="font-semibold text-orange-500">
                                {products.filter(p => p.stock > 0 && p.stock <= 5).length}
                            </span></span>
                        </div>
                    </div>
                </div>

                {/* Alerta de categorías faltantes */}
                {categories.length === 0 && !categoriesLoading && (
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <FiAlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <p className="text-amber-700 flex-1">
                            ⚠️ No hay categorías disponibles. Para poder crear productos, primero necesitas crear categorías.
                        </p>
                        <Link
                            to="/admin/dashboard/categories"
                            className="btn btn-sm bg-amber-500 text-white border-0 hover:bg-amber-600"
                        >
                            Crear categorías
                        </Link>
                    </div>
                )}
            </div>
    )
}

export default TableProductDashboard