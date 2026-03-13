import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useCategory } from '../../Hooks/useCategory.js'
import { useProduct } from '../../Hooks/useProduct.js'
import CreateSubcategoryForm from '../../Components/AdminDashboard/CreateSubcategoryForm/CreateSubcategoryForm'
import TableSubcategories from '../../Components/AdminDashboard/TableSubcategories/TableSubcategories'
import UpdateSubcategoryForm from '../../Components/AdminDashboard/UpdateSubcategoryForm/UpdateSubcategoryForm'
import {
    FiGrid,
    FiLayers,
    FiPlus,
    FiArrowLeft,
    FiFilter,
    FiX,
} from 'react-icons/fi'

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

    // Cargar TODAS las subcategorías (sin filtro)
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

    // Filtrar subcategorías en el frontend
    const filteredSubcategories = filterCategory
        ? subcategories.filter((sub) => {
              const subCategoryId = sub.category?._id || sub.category
              return subCategoryId === filterCategory
          })
        : subcategories

    const selectedCategoryName = filterCategory
        ? categories.find((c) => c._id === filterCategory)?.name
        : categoryName

    console.log('📊 Estado:', {
        filterCategory,
        totalSubcategories: subcategories.length,
        filteredCount: filteredSubcategories.length,
        selectedCategoryName,
    })

    if (loading && subcategories.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <span className="loading loading-spinner loading-lg text-purple-600 mb-4"></span>
                        <p className="text-gray-500">
                            Cargando subcategorías...
                        </p>
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
                        <FiGrid className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold">
                        {selectedCategoryName
                            ? `Subcategorías de ${selectedCategoryName}`
                            : 'Gestión de Subcategorías'}
                    </h1>
                </div>
                <p className="text-purple-100 max-w-2xl">
                    Administra las subcategorías de tus productos, organiza
                    mejor tu catálogo
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
                            {view === 'list' && 'Lista de subcategorías'}
                            {view === 'create' && 'Crear nueva subcategoría'}
                            {view === 'edit' && 'Editar subcategoría'}
                        </h2>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            to="/admin/dashboard/categories"
                            className="btn btn-outline border-gray-300 hover:border-purple-400 hover:bg-purple-50 gap-2 flex-1 sm:flex-none"
                        >
                            <FiLayers className="w-4 h-4" />
                            Ver Categorías
                        </Link>

                        {view === 'list' && (
                            <button
                                onClick={() => setView('create')}
                                className="btn bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 hover:from-purple-700 hover:to-purple-800 gap-2 flex-1 sm:flex-none"
                            >
                                <FiPlus className="w-4 h-4" />
                                Nueva Subcategoría
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

                {/* Filtro por categoría (solo en vista lista) */}
                {view === 'list' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FiFilter className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">
                                    Filtrar por categoría:
                                </span>
                            </div>

                            <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                                <select
                                    value={filterCategory}
                                    onChange={(e) =>
                                        setFilterCategory(e.target.value)
                                    }
                                    className="select select-bordered w-full sm:w-64 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-200"
                                >
                                    <option value="">
                                        Todas las categorías
                                    </option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                {filterCategory && (
                                    <button
                                        onClick={() => setFilterCategory('')}
                                        className="btn btn-sm btn-ghost text-gray-500 hover:text-red-500"
                                        title="Limpiar filtro"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenido principal */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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

                        {filteredSubcategories.length === 0 &&
                            filterCategory && (
                                <div className="text-center py-12 border-t border-gray-200">
                                    <div className="text-gray-300 text-5xl mb-4">
                                        📂
                                    </div>
                                    <p className="text-gray-500 text-lg mb-2">
                                        No hay subcategorías para{' '}
                                        {selectedCategoryName}
                                    </p>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Crea la primera subcategoría para esta
                                        categoría
                                    </p>
                                    <button
                                        onClick={() => setView('create')}
                                        className="btn btn-primary bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800"
                                    >
                                        <FiPlus className="w-4 h-4 mr-2" />
                                        Crear subcategoría
                                    </button>
                                </div>
                            )}
                    </>
                )}
            </div>

            {/* Resumen rápido (solo en vista lista) */}
            {view === 'list' && filteredSubcategories.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FiGrid className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Total subcategorías
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {filteredSubcategories.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FiLayers className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Categoría actual
                                </p>
                                <p className="text-xl font-bold text-gray-800 truncate max-w-[200px]">
                                    {selectedCategoryName ||
                                        'Todas las categorías'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Subcategories
