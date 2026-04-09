// src/Components/SidebarFilters/SidebarFilters.jsx
import { useState } from 'react'
import { useProduct } from '../../Hooks/useProduct'
import { FiFilter, FiX } from 'react-icons/fi'
import {
    FaChevronDown,
    FaChevronRight,
    FaTag,
    FaLayerGroup,
} from 'react-icons/fa'
import { BsStars } from 'react-icons/bs'
import api from '../../services/api'

const SidebarFilters = ({ onOpenChange, isOpen: externalIsOpen, onFilter }) => {
    const {
        selectedCategory,
        selectedSubcategory,
        categories: dbCategories,
    } = useProduct()
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState(null)
    const [subcategories, setSubcategories] = useState({})
    const [loadingSubcategories, setLoadingSubcategories] = useState({})

    const isOpen =
        externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

    const toggleSidebar = () => {
        if (onOpenChange) {
            onOpenChange(!isOpen)
        } else {
            setInternalIsOpen(!internalIsOpen)
        }
    }

    const loadSubcategories = async (categoryId) => {
        if (!categoryId) return
        if (subcategories[categoryId]) return

        try {
            setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: true }))
            const response = await api.get(
                `/subcategories/category/${categoryId}`,
            )
            setSubcategories((prev) => ({
                ...prev,
                [categoryId]: response.data,
            }))
        } catch (error) {
            console.error('Error cargando subcategorías:', error)
        } finally {
            setLoadingSubcategories((prev) => ({
                ...prev,
                [categoryId]: false,
            }))
        }
    }

    const handleCategoryClick = (cat) => {
        if (cat === 'todos' || cat === 'Todos') {
            if (onFilter) {
                onFilter('Todos', null)
            }
            setExpandedCategory(null)
            toggleSidebar()
            return
        }

        if (expandedCategory === cat._id) {
            setExpandedCategory(null)
        } else {
            setExpandedCategory(cat._id)
            loadSubcategories(cat._id)
        }
    }

    const handleMainCategoryClick = (cat) => {
        if (onFilter) {
            onFilter(cat.name, null)
        }
        toggleSidebar()
    }

    const handleSubcategoryClick = (subcat) => {
        let categoryName = null

        if (subcat.category && subcat.category.name) {
            categoryName = subcat.category.name
        } else {
            const parentCategory = dbCategories.find(
                (c) => c._id === subcat.category,
            )
            if (parentCategory) {
                categoryName = parentCategory.name
            }
        }

        if (categoryName && onFilter) {
            onFilter(categoryName, subcat.name)
        }

        toggleSidebar()
    }

    return (
        <>
            {/* Botón flotante para móvil */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                aria-label="Abrir filtros"
            >
                <FiFilter className="h-6 w-6" />
                {selectedCategory !== 'Todos' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-40 animate-fadeIn"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:sticky top-0 left-0
          w-80 h-screen
          bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-950/50
          transition-transform duration-300 ease-in-out
          z-[100] lg:z-auto
          overflow-y-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-purple-100 dark:border-gray-700 p-4 flex justify-between items-center z-10 transition-colors duration-300">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                            <FaLayerGroup className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                            Categorías
                        </h2>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <FiX className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-4">
                    {/* Todos los productos */}
                    <button
                        onClick={() => handleCategoryClick('todos')}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 mb-2 ${
                            selectedCategory === 'Todos' && !selectedSubcategory
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-1.5 rounded-lg ${
                                    selectedCategory === 'Todos' &&
                                    !selectedSubcategory
                                        ? 'bg-white/20'
                                        : 'bg-gray-100 dark:bg-gray-700'
                                }`}
                            >
                                <FaTag
                                    className={`w-3 h-3 ${
                                        selectedCategory === 'Todos' &&
                                        !selectedSubcategory
                                            ? 'text-white'
                                            : 'text-gray-400 dark:text-gray-500'
                                    }`}
                                />
                            </div>
                            <span className="font-medium">
                                Todos los productos
                            </span>
                        </div>
                    </button>

                    {/* Categorías */}
                    {dbCategories?.map((cat) => (
                        <div key={cat._id} className="mb-2">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleMainCategoryClick(cat)}
                                    className={`flex-1 text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                        selectedCategory === cat.name &&
                                        !selectedSubcategory
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`p-1.5 rounded-lg ${
                                                selectedCategory === cat.name &&
                                                !selectedSubcategory
                                                    ? 'bg-white/20'
                                                    : 'bg-gray-100 dark:bg-gray-700'
                                            }`}
                                        >
                                            <span className="text-xs font-bold">
                                                📁
                                            </span>
                                        </div>
                                        <span className="font-medium truncate">
                                            {cat.name}
                                        </span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`p-3 rounded-xl transition-all duration-200 ${
                                        expandedCategory === cat._id
                                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400'
                                    }`}
                                >
                                    {expandedCategory === cat._id ? (
                                        <FaChevronDown className="h-3 w-3" />
                                    ) : (
                                        <FaChevronRight className="h-3 w-3" />
                                    )}
                                </button>
                            </div>

                            {/* Subcategorías */}
                            {expandedCategory === cat._id && (
                                <div className="ml-8 pl-3 border-l-2 border-purple-200 dark:border-purple-800 mt-1">
                                    {loadingSubcategories[cat._id] && (
                                        <div className="py-2 px-4 text-sm text-purple-500 dark:text-purple-400">
                                            <span className="loading loading-spinner loading-xs mr-2"></span>
                                            Cargando...
                                        </div>
                                    )}

                                    {subcategories[cat._id]?.map((subcat) => (
                                        <button
                                            key={subcat._id}
                                            onClick={() =>
                                                handleSubcategoryClick(subcat)
                                            }
                                            className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
                                                selectedSubcategory ===
                                                subcat._id
                                                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium border-l-4 border-purple-600 dark:border-purple-500'
                                                    : 'text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'
                                            }`}
                                        >
                                            <span className="truncate">
                                                {subcat.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Filtros adicionales */}
                    <div className="mt-6 pt-6 border-t border-purple-100 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-4">
                            <BsStars className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300">
                                Filtros Avanzados
                            </h3>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                🚀 Próximamente: Rango de precios
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default SidebarFilters
