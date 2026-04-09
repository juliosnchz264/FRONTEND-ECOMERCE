import { Link } from 'react-router'
import { useDashboardProduct } from '../../../Hooks/useDashboardProduct.js'
import TableProducts from './TableProducts'
import Pagination from '../../ui/Pagination'
import { useState, useEffect, useMemo } from 'react'
import api from '../../../services/api'
import {
    FiFilter,
    FiPackage,
    FiGrid,
    FiAlertCircle,
    FiPlus,
    FiFolder,
    FiLayers,
    FiX,
    FiRefreshCw,
    FiChevronDown,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const TableProductDashboard = () => {
    const {
        products = [],
        productsLoading = false,
        categories = [],
        categoriesLoading = false,
        getCategories = () => {},
        currentPage,
        totalPages,
        totalProducts,
        itemsPerPage,
        goToPage,
        resetFilters,
        // 👉 PROPS DEL DASHBOARD CONTEXT
        uiCategoryId,
        uiSubcategoryId,
        handleCategoryChange,
        handleSubcategoryChange,
        selectedCategoryName,
        selectedSubcategoryName,
    } = useDashboardProduct()

    // 👉 Estado para subcategorías locales
    const [localSubcategories, setLocalSubcategories] = useState([])
    const [loadingSubcategories, setLoadingSubcategories] = useState(false)

    // Cargar categorías SOLO UNA VEZ
    useEffect(() => {
        if (categories.length === 0 && getCategories) {
            getCategories()
        }
    }, [])

    // 👉 CARGAR SUBCATEGORÍAS cuando cambia la categoría seleccionada
    useEffect(() => {
        const loadSubcategories = async () => {
            // Si no hay categoría seleccionada o es "todos", limpiar
            if (!uiCategoryId || uiCategoryId === 'todos') {
                setLocalSubcategories([])
                return
            }

            // Validar que sea un ID válido de MongoDB
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(uiCategoryId)
            if (!isValidObjectId) {
                setLocalSubcategories([])
                return
            }

            setLoadingSubcategories(true)
            try {
                const response = await api.get(
                    `/subcategories/category/${uiCategoryId}`,
                )
                setLocalSubcategories(response.data)
            } catch (error) {
                console.error('Error cargando subcategorías:', error)
                setLocalSubcategories([])
            } finally {
                setLoadingSubcategories(false)
            }
        }

        loadSubcategories()
    }, [uiCategoryId])

    // 👉 Verificar si hay filtros activos
    const hasActiveFilters = useMemo(() => {
        return selectedCategoryName !== null || selectedSubcategoryName !== null
    }, [selectedCategoryName, selectedSubcategoryName])

    // 👉 Obtener nombre de la categoría seleccionada para mostrar
    const selectedCategoryDisplay = useMemo(() => {
        if (!selectedCategoryName) return null
        const category = categories.find(c => c.name === selectedCategoryName)
        return category?.name || selectedCategoryName
    }, [selectedCategoryName, categories])

    // 👉 Obtener nombre de la subcategoría seleccionada para mostrar
    const selectedSubcategoryDisplay = useMemo(() => {
        if (!selectedSubcategoryName) return null
        const subcategory = localSubcategories.find(s => s.name === selectedSubcategoryName)
        return subcategory?.name || selectedSubcategoryName
    }, [selectedSubcategoryName, localSubcategories])

    // Métricas
    const lowStockCount = useMemo(
        () => products.filter((p) => p.stock > 0 && p.stock <= 5).length,
        [products]
    )
    const outOfStockCount = useMemo(
        () => products.filter((p) => p.stock === 0).length,
        [products]
    )

    if (productsLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Cargando productos...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header con gradiente mejorado */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-2xl p-8 mb-8 text-white shadow-xl"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <FiPackage className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Panel de Productos</h1>
                        <p className="text-purple-100 mt-1">
                            Gestiona todos tus productos, categorías y stock
                        </p>
                    </div>
                </div>
                
                {/* Stats rápidas en header */}
                <div className="flex gap-6 mt-4 pt-4 border-t border-white/20">
                    <div>
                        <p className="text-purple-200 text-sm">Total productos</p>
                        <p className="text-2xl font-bold">{totalProducts}</p>
                    </div>
                    <div>
                        <p className="text-purple-200 text-sm">Categorías</p>
                        <p className="text-2xl font-bold">{categories.length}</p>
                    </div>
                    <div>
                        <p className="text-purple-200 text-sm">Stock bajo</p>
                        <p className="text-2xl font-bold text-orange-300">{lowStockCount}</p>
                    </div>
                </div>
            </motion.div>

            {/* Filtros modernos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden"
            >
                {/* Header de filtros */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                <FiFilter className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Filtrar productos
                            </h2>
                        </div>
                        
                        {/* Botón limpiar filtros */}
                        <AnimatePresence>
                            {hasActiveFilters && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    onClick={resetFilters}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-xl transition-all text-gray-700 dark:text-gray-200"
                                >
                                    <FiRefreshCw className="w-4 h-4" />
                                    <span className="text-sm font-medium">Limpiar filtros</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Contenido de filtros */}
                <div className="p-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                        {/* Selector de categorías */}
                        <div className="w-full lg:w-auto flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoría
                            </label>
                            <select
                                value={uiCategoryId}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                disabled={categoriesLoading}
                            >
                                <option value="todos">📁 Todas las categorías</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        📂 {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selector de subcategorías */}
                        {uiCategoryId !== 'todos' && (
                            <div className="w-full lg:w-auto flex-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subcategoría
                                </label>
                                <div className="relative">
                                    <select
                                        value={uiSubcategoryId}
                                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white appearance-none transition-all"
                                        disabled={loadingSubcategories}
                                    >
                                        <option value="todos">📁 Todas las subcategorías</option>
                                        {localSubcategories.map((subcat) => (
                                            <option key={subcat._id} value={subcat._id}>
                                                📄 {subcat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                                {loadingSubcategories && (
                                    <div className="mt-1 text-xs text-gray-500 animate-pulse">
                                        Cargando subcategorías...
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Botón crear producto */}
                        <div className="w-full lg:w-auto">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 invisible">
                                Acción
                            </label>
                            <Link
                                to="/admin/dashboard/products/createProduct"
                                className="inline-flex items-center justify-center gap-2 w-full lg:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Crear Producto</span>
                            </Link>
                        </div>
                    </div>

                    {/* Filtros activos */}
                    <AnimatePresence>
                        {hasActiveFilters && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        Filtros activos:
                                    </span>
                                    {selectedCategoryDisplay && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                                            <FiFolder className="w-3 h-3" />
                                            {selectedCategoryDisplay}
                                            <button
                                                onClick={() => handleCategoryChange('todos')}
                                                className="ml-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedSubcategoryDisplay && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                            <FiGrid className="w-3 h-3" />
                                            {selectedSubcategoryDisplay}
                                            <button
                                                onClick={() => handleSubcategoryChange('todos')}
                                                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Tabla de productos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>

                <TableProducts products={products} />

                {/* Footer con paginación */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <FiPackage className="w-4 h-4" />
                                <span>
                                    Mostrando <span className="font-semibold text-purple-600 dark:text-purple-400">{products.length}</span> de{' '}
                                    <span className="font-semibold text-purple-600 dark:text-purple-400">{totalProducts}</span> productos
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FiGrid className="w-4 h-4" />
                                <span>
                                    Stock bajo: <span className="font-semibold text-orange-500">{lowStockCount}</span>
                                </span>
                            </div>
                            {outOfStockCount > 0 && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FiAlertCircle className="w-4 h-4" />
                                    <span>
                                        Agotados: <span className="font-semibold text-red-500">{outOfStockCount}</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Paginación */}
                        {!productsLoading && products?.length > 0 && totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                                totalItems={totalProducts}
                                itemsPerPage={itemsPerPage}
                            />
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Alerta sin categorías */}
            {categories.length === 0 && !categoriesLoading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex flex-col sm:flex-row items-center gap-3"
                >
                    <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <p className="text-amber-700 dark:text-amber-400 flex-1 text-center sm:text-left">
                        ⚠️ No hay categorías disponibles. Para crear productos, primero necesitas crear categorías.
                    </p>
                    <Link
                        to="/admin/dashboard/categories"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-colors whitespace-nowrap"
                    >
                        <FiFolder className="w-4 h-4 inline mr-2" />
                        Crear categorías
                    </Link>
                </motion.div>
            )}
        </div>
    )
}

export default TableProductDashboard