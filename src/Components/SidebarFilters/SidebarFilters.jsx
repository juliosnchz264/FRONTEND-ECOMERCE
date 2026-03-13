import { useState } from 'react';
import { useProduct } from '../../Hooks/useProduct.js';
import { FiFilter, FiX } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';
import { FaChevronDown, FaChevronRight, FaTag, FaLayerGroup } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const SidebarFilters = () => {
    const { filterByCategory, selectedCategory, selectedSubcategory, categories: dbCategories } = useProduct();
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [subcategories, setSubcategories] = useState({});
    const [loadingSubcategories, setLoadingSubcategories] = useState({});

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Cargar subcategorías cuando se expande una categoría
    const loadSubcategories = async (categoryId) => {
        if (!categoryId) return;
        
        if (subcategories[categoryId]) return;
        
        try {
            setLoadingSubcategories(prev => ({ ...prev, [categoryId]: true }));
            
            const response = await axios.get(
                `${API_URL}/subcategories/category/${categoryId}`
            );
            
            setSubcategories(prev => ({
                ...prev,
                [categoryId]: response.data
            }));
        } catch (error) {
            console.error('Error cargando subcategorías:', error);
        } finally {
            setLoadingSubcategories(prev => ({ ...prev, [categoryId]: false }));
        }
    };

    const handleCategoryClick = (cat) => {
        if (cat === 'todos' || cat === 'Todos') {
            filterByCategory('Todos', null);
            setExpandedCategory(null);
            setIsOpen(false);
            return;
        }

        if (expandedCategory === cat._id) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(cat._id);
            loadSubcategories(cat._id);
        }
    };

    const handleMainCategoryClick = (cat) => {
        filterByCategory(cat.name, null);
        setIsOpen(false);
    };

    const handleSubcategoryClick = (subcat) => {        
        if (subcat.category && subcat.category.name) {
            filterByCategory(subcat.category.name, subcat._id);
        } 
        else {
            const parentCategory = dbCategories.find(c => c._id === subcat.category);
            if (parentCategory) {
                filterByCategory(parentCategory.name, subcat._id);
            } else {
                console.error('❌ No se encontró la categoría padre');
            }
        }
        setIsOpen(false);
    };

    // FUNCIÓN CORREGIDA - Ahora compara correctamente
    const isCategorySelected = (catId) => {
        const category = dbCategories.find(c => c._id === catId);
        
        if (selectedSubcategory) {
            const subcat = Object.values(subcategories)
                .flat()
                .find(s => s._id === selectedSubcategory);
            
            if (subcat) {
                const parentCategoryId = subcat.category?._id || subcat.category;
                return parentCategoryId === catId;
            }
            return false;
        }
        
        if (selectedCategory && selectedCategory !== 'Todos') {
            return category?.name === selectedCategory;
        }
        
        return false;
    };

    return (
        <>
            {/* Botón flotante para móvil */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border border-purple-400/20 backdrop-blur-sm"
                aria-label="Abrir filtros"
            >
                <FiFilter className="h-6 w-6" />
                {selectedCategory !== 'Todos' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {/* Overlay para móvil */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fadeIn"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    w-72 flex-shrink-0 bg-white/90 backdrop-blur-sm p-6
                    transition-all duration-500 ease-out
                    fixed lg:relative
                    top-0 left-0
                    h-full lg:h-auto
                    z-50 lg:z-auto
                    overflow-y-auto
                    shadow-2xl lg:shadow-none
                    border-r border-purple-100
                    ${isOpen 
                        ? 'translate-x-0' 
                        : '-translate-x-full lg:translate-x-0'
                    }
                `}
            >
                {/* Header del sidebar */}
                <div className="flex justify-between items-center mb-8 lg:mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                            <FaLayerGroup className="w-5 h-5 text-purple-600" />
                        </div>
                        <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                            Categorías
                        </h2>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        aria-label="Cerrar filtros"
                    >
                        <FiX className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Lista de categorías */}
                <div className="space-y-1">
                    {/* Todos los productos */}
                    <button
                        onClick={() => handleCategoryClick('todos')}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                            selectedCategory === 'Todos' && !selectedSubcategory
                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200'
                                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${
                                selectedCategory === 'Todos' && !selectedSubcategory
                                    ? 'bg-white/20'
                                    : 'bg-gray-100 group-hover:bg-purple-100'
                            }`}>
                                <FaTag className={`w-3 h-3 ${
                                    selectedCategory === 'Todos' && !selectedSubcategory
                                        ? 'text-white'
                                        : 'text-gray-400 group-hover:text-purple-600'
                                }`} />
                            </div>
                            <span className="font-medium">Todos los productos</span>
                        </div>
                    </button>

                    {/* Categorías dinámicas */}
                    {dbCategories && dbCategories.map((cat) => (
                        <div key={cat._id} className="space-y-1">
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleMainCategoryClick(cat)}
                                    className={`flex-1 text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                                        isCategorySelected(cat._id)
                                            ? selectedSubcategory && isCategorySelected(cat._id)
                                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                                                : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-200'
                                            : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-lg ${
                                            isCategorySelected(cat._id)
                                                ? 'bg-white/20'
                                                : 'bg-gray-100 group-hover:bg-purple-100'
                                        }`}>
                                            <span className="text-xs font-bold">📁</span>
                                        </div>
                                        <span className="font-medium">{cat.name}</span>
                                        {selectedSubcategory && isCategorySelected(cat._id) && (
                                            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                                ▼
                                            </span>
                                        )}
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`p-3 rounded-xl transition-all duration-200 ${
                                        expandedCategory === cat._id
                                            ? 'bg-purple-100 text-purple-600'
                                            : 'text-gray-400 hover:bg-gray-100 hover:text-purple-600'
                                    }`}
                                    aria-label="Ver subcategorías"
                                >
                                    {expandedCategory === cat._id ? (
                                        <FaChevronDown className="h-3 w-3" />
                                    ) : (
                                        <FaChevronRight className="h-3 w-3" />
                                    )}
                                </button>
                            </div>

                            {/* Subcategorías expandidas */}
                            {expandedCategory === cat._id && (
                                <div className="ml-8 pl-3 border-l-2 border-purple-200 space-y-1">
                                    {loadingSubcategories[cat._id] && (
                                        <div className="py-3 px-4 text-sm text-purple-500 flex items-center gap-2">
                                            <span className="loading loading-spinner loading-xs"></span>
                                            Cargando...
                                        </div>
                                    )}

                                    {subcategories[cat._id]?.map((subcat) => (
                                        <button
                                            key={subcat._id}
                                            onClick={() => handleSubcategoryClick(subcat)}
                                            className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                                                selectedSubcategory === subcat._id
                                                    ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-medium border-l-4 border-purple-600'
                                                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 hover:border-l-4 hover:border-purple-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">▹</span>
                                                {subcat.name}
                                            </div>
                                        </button>
                                    ))}

                                    {subcategories[cat._id]?.length === 0 && (
                                        <div className="py-3 px-4 text-sm text-gray-400 italic">
                                            Sin subcategorías
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Filtros Avanzados */}
                <div className="mt-10 pt-8 border-t border-purple-100">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                            <BsStars className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent uppercase tracking-wider">
                            Filtros Avanzados
                        </h3>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 italic flex items-center gap-2">
                            <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                            Próximamente: Rango de precios
                        </p>
                    </div>
                </div>

                {/* Indicador de selección en móvil */}
                {(selectedCategory && selectedCategory !== 'Todos' || selectedSubcategory) && (
                    <div className="mt-6 lg:hidden p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                            {selectedSubcategory ? (
                                <>
                                    Subcategoría seleccionada:
                                    <span className="font-semibold text-purple-700">
                                        {Object.values(subcategories)
                                            .flat()
                                            .find(s => s._id === selectedSubcategory)?.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Categoría seleccionada:
                                    <span className="font-semibold text-purple-700">
                                        {selectedCategory}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default SidebarFilters;