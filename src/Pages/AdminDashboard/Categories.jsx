import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useCategory } from '../../Hooks/useCategory.js'
import CreateCategoryForm from '../../Components/AdminDashboard/CreateCategoryForm/CreateCategoryForm'
import TableCategories from '../../Components/AdminDashboard/TableCategories/TableCategories'
import UpdateCategoryForm from '../../Components/AdminDashboard/UpdateCategoryForm/UpdateCategoryForm'
import { FiFolder, FiPlus, FiArrowLeft, FiLayers } from 'react-icons/fi'

const Categories = () => {
    const { categories, loading, getCategories } = useCategory()
    const [view, setView] = useState('list') // 'list', 'create', 'edit'
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <span className="loading loading-spinner loading-lg text-purple-600 mb-4"></span>
                        <p className="text-gray-500">Cargando categorías...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4">
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 mb-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl">
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
            </div>

            {/* Barra de acciones */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                            <FiLayers className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {view === 'list' && 'Lista de categorías'}
                            {view === 'create' && 'Crear nueva categoría'}
                            {view === 'edit' && 'Editar categoría'}
                        </h2>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            to="/admin/dashboard/subcategories"
                            className="btn btn-outline border-gray-300 hover:border-purple-400 hover:bg-purple-50 gap-2 flex-1 sm:flex-none"
                        >
                            <FiLayers className="w-4 h-4" />
                            Ver Subcategorías
                        </Link>

                        {view === 'list' && (
                            <button
                                onClick={() => setView('create')}
                                className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 gap-2 flex-1 sm:flex-none"
                            >
                                <FiPlus className="w-4 h-4" />
                                Nueva Categoría
                            </button>
                        )}

                        {view !== 'list' && (
                            <button
                                onClick={() => setView('list')}
                                className="btn btn-ghost border border-gray-200 hover:bg-gray-50 gap-2 flex-1 sm:flex-none"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                Volver
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {view === 'create' && (
                    <div className="p-6">
                        <CreateCategoryForm
                            onSuccess={handleSuccess}
                            onCancel={() => setView('list')}
                        />
                    </div>
                )}

                {view === 'edit' && selectedCategory && (
                    <div className="p-6">
                        <UpdateCategoryForm
                            category={selectedCategory}
                            onSuccess={handleSuccess}
                            onCancel={() => setView('list')}
                        />
                    </div>
                )}

                {view === 'list' && (
                    <TableCategories
                        categories={categories}
                        onEdit={handleEdit}
                    />
                )}
            </div>

            {/* Resumen rápido (solo en vista lista) */}
            {view === 'list' && categories.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FiFolder className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total categorías
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {categories.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FiLayers className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Categorías activas
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {
                                        categories.filter(
                                            (c) => c.status === 'activo',
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiFolder className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Con subcategorías
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {
                                        categories.filter(
                                            (c) => c.subcategoryCount > 0,
                                        ).length
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Categories
