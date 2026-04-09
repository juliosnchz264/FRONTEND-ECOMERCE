// src/Pages/AdminDashboard/Categories.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useCategory } from '../../Hooks/useCategory.js'
import CreateCategoryForm from '../../Components/AdminDashboard/CreateCategoryForm/CreateCategoryForm'
import TableCategories from '../../Components/AdminDashboard/TableCategories/TableCategories'
import UpdateCategoryForm from '../../Components/AdminDashboard/UpdateCategoryForm/UpdateCategoryForm'
import { 
    FiFolder, 
    FiPlus, 
    FiArrowLeft, 
    FiLayers, 
    FiGrid, 
    FiTrendingUp,
    FiCheckCircle,
    FiAlertCircle
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'

const Categories = () => {
    const { categories, loading, getCategories } = useCategory()
    const [view, setView] = useState('list')
    const [selectedCategory, setSelectedCategory] = useState(null)

    useEffect(() => {
        getCategories()
    }, [getCategories])

    const handleEdit = (category) => {
        setSelectedCategory(category)
        setView('edit')
    }

    const handleSuccess = () => {
        setView('list')
        setSelectedCategory(null)
        getCategories()
    }

    if (loading && categories.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400">Cargando categorías...</p>
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

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
                        <FiFolder className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">
                        Gestión de Categorías
                    </h1>
                </div>
                <p className="text-purple-100 max-w-2xl">
                    Administra las categorías de tus productos, crea nuevas o
                    edita las existentes
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
                            {view === 'list' && 'Lista de categorías'}
                            {view === 'create' && 'Crear nueva categoría'}
                            {view === 'edit' && 'Editar categoría'}
                        </h2>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            to="/admin/dashboard/subcategories"
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-purple-400 dark:hover:border-purple-600 transition-all flex-1 sm:flex-none"
                        >
                            <FiLayers className="w-4 h-4" />
                            <span>Ver Subcategorías</span>
                        </Link>

                        {view === 'list' && (
                            <button
                                onClick={() => setView('create')}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/25 flex-1 sm:flex-none"
                            >
                                <FiPlus className="w-4 h-4" />
                                <span>Nueva Categoría</span>
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
            </motion.div>

            {/* Contenido principal */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
            >
                {/* Header decorativo */}
                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                
                <AnimatePresence mode="wait">
                    {view === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6"
                        >
                            <CreateCategoryForm
                                onSuccess={handleSuccess}
                                onCancel={() => setView('list')}
                            />
                        </motion.div>
                    )}

                    {view === 'edit' && selectedCategory && (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="p-6"
                        >
                            <UpdateCategoryForm
                                category={selectedCategory}
                                onSuccess={handleSuccess}
                                onCancel={() => setView('list')}
                            />
                        </motion.div>
                    )}

                    {view === 'list' && (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TableCategories
                                categories={categories}
                                onEdit={handleEdit}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Resumen rápido (solo en vista lista) */}
            {view === 'list' && categories.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    {/* Total categorías */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300 hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <FiFolder className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total categorías
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {categories.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Categorías activas */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300 hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Categorías activas
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {categories.filter(c => c.status === 'activo').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Con subcategorías */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300 hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <FiGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Con subcategorías
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {categories.filter(c => c.subcategoryCount > 0).length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Productos asociados */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300 hover:shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Total productos
                                </p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Mensaje cuando no hay categorías */}
            {view === 'list' && categories.length === 0 && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
                >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiFolder className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No hay categorías creadas aún
                    </p>
                    <button
                        onClick={() => setView('create')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all"
                    >
                        <FiPlus className="w-4 h-4" />
                        Crear primera categoría
                    </button>
                </motion.div>
            )}
        </div>
    )
}

export default Categories