// src/Pages/AdminDashboard/Subcategories.jsx
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useCategory } from '../../Hooks/useCategory.js'
import { useProduct } from '../../Hooks/useProduct.js'
import CreateSubcategoryForm from '../../Components/AdminDashboard/CreateSubcategoryForm/CreateSubcategoryForm.jsx'
import TableSubcategories from '../../Components/AdminDashboard/TableSubcategories/TableSubcategories'
import UpdateSubcategoryForm from '../../Components/AdminDashboard/UpdateSubcategoryForm/UpdateSubcategoryForm'
import {
    FiGrid,
    FiLayers,
    FiPlus,
    FiArrowLeft,
    FiFilter,
    FiX,
    FiFolder
} from 'react-icons/fi'
import { motion } from 'framer-motion'

const Subcategories = () => {
    const [searchParams] = useSearchParams()
    const categoryId = searchParams.get('category')
    const categoryName = searchParams.get('name')

    const { subcategories, loading, getSubcategories } = useCategory()
    const { categories, getCategories } = useProduct()
    const [view, setView] = useState('list')
    const [selectedSubcategory, setSelectedSubcategory] = useState(null)
    const [filterCategory, setFilterCategory] = useState(categoryId || '')

    useEffect(() => {
        getCategories()
    }, [getCategories])

    useEffect(() => {
        getSubcategories(null)
    }, [getSubcategories])

    const handleEdit = (subcategory) => {
        setSelectedSubcategory(subcategory)
        setView('edit')
    }

    const handleSuccess = () => {
        setView('list')
        setSelectedSubcategory(null)
        getSubcategories(null)
    }

    const filteredSubcategories = filterCategory
        ? subcategories.filter((sub) => {
              const subCategoryId = sub.category?._id || sub.category
              return subCategoryId === filterCategory
          })
        : subcategories

    const selectedCategoryName = filterCategory
        ? categories.find((c) => c._id === filterCategory)?.name
        : categoryName

    if (loading && subcategories.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">Cargando subcategorías...</p>
                    </div>
                </div>
            </div>
        )
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header con gradiente */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 mb-8 text-white shadow-lg"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <FiGrid className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">
                        {selectedCategoryName
                            ? `Subcategorías de ${selectedCategoryName}`
                            : 'Gestión de Subcategorías'}
                    </h1>
                </div>
                <p className="text-purple-100 max-w-2xl">
                    Administra las subcategorías de tus productos, organiza mejor tu catálogo
                </p>
            </motion.div>

            {/* Barra de acciones */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-colors duration-300"
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <FiLayers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            {view === 'list' && 'Lista de subcategorías'}
                            {view === 'create' && 'Crear nueva subcategoría'}
                            {view === 'edit' && 'Editar subcategoría'}
                        </h2>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            to="/admin/dashboard/categories"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-purple-400 dark:hover:border-purple-600 transition-all flex-1 sm:flex-none"
                        >
                            <FiLayers className="w-4 h-4" />
                            <span>Ver Categorías</span>
                        </Link>

                        {view === 'list' && (
                            <button
                                onClick={() => setView('create')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 flex-1 sm:flex-none"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Nueva Subcategoría</span>
                            </button>
                        )}

                        {view !== 'list' && (
                            <button
                                onClick={() => setView('list')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex-1 sm:flex-none"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                <span>Volver</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filtro por categoría */}
                {view === 'list' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FiFilter className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Filtrar por categoría:
                                </span>
                            </div>

                            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="w-full sm:w-64 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 focus:border-purple-500 dark:focus:border-purple-500 text-gray-900 dark:text-white transition-all"
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                {filterCategory && (
                                    <button
                                        onClick={() => setFilterCategory('')}
                                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-colors"
                                        title="Limpiar filtro"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Contenido principal */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
            >
                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                
                {view === 'create' && (
                    <div className="p-6">
                        <CreateSubcategoryForm
                            onSuccess={handleSuccess}
                            onCancel={() => setView('list')}
                        />
                    </div>
                )}

                {view === 'edit' && selectedSubcategory && (
                    <div className="p-6">
                        <UpdateSubcategoryForm
                            subcategory={selectedSubcategory}
                            onSuccess={handleSuccess}
                            onCancel={() => setView('list')}
                        />
                    </div>
                )}

                {view === 'list' && (
                    <>
                        <TableSubcategories
                            subcategories={filteredSubcategories}
                            categoryId={filterCategory}
                            categoryName={selectedCategoryName}
                            onEdit={handleEdit}
                        />

                        {filteredSubcategories.length === 0 && filterCategory && (
                            <div className="text-center py-12 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-5xl mb-4">📂</div>
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                                    No hay subcategorías para {selectedCategoryName}
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                                    Crea la primera subcategoría para esta categoría
                                </p>
                                <button
                                    onClick={() => setView('create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Crear subcategoría
                                </button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Resumen rápido */}
            {view === 'list' && filteredSubcategories.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FiGrid className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Total subcategorías</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {filteredSubcategories.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiFolder className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Categoría actual</p>
                                <p className="text-xl font-bold text-gray-800 dark:text-white truncate max-w-[200px]">
                                    {selectedCategoryName || 'Todas las categorías'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

export default Subcategories