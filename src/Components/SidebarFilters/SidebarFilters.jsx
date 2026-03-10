import { useState } from 'react';
import { useProduct } from '../../Hooks/useProduct.js';
import { FiFilter } from 'react-icons/fi'; // Icono de filtro
import { IoClose } from 'react-icons/io5'; // Icono de cerrar

const categories = ['Todos', 'Electronica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];

const SidebarFilters = () => {
    const { filterByCategory, selectedCategory } = useProduct();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleCategoryClick = (cat) => {
        filterByCategory(cat);
        setIsOpen(false);
    };

    return (
        <>
            {/* Botón flotante para móvil - usando FiFilter de react-icons */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 hover:scale-110"
                aria-label="Abrir filtros"
            >
                <FiFilter className="h-6 w-6" />
            </button>

            {/* Overlay oscuro para móvil */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    w-64 flex-shrink-0 bg-white p-6 border-r border-gray-100
                    transition-all duration-300 ease-in-out
                    fixed lg:relative
                    top-0 left-0
                    h-full lg:h-auto
                    z-50 lg:z-auto
                    overflow-y-auto
                    ${isOpen 
                        ? 'translate-x-0 shadow-2xl' 
                        : '-translate-x-full lg:translate-x-0'
                    }
                    lg:shadow-none
                    lg:min-h-screen
                `}
            >
                {/* Header del sidebar - SOLO visible en móvil */}
                <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                        Categorías
                    </h2>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Cerrar filtros"
                    >
                        <IoClose className="h-5 w-5 text-gray-600" />
                    </button>
                </div>

                {/* Categorías - mantiene tu diseño original */}
                <div>
                    <h2 className="text-lg font-bold mb-6 text-gray-800 uppercase tracking-wider hidden lg:block">
                        Categorías
                    </h2>
                    <div className="flex flex-col gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                                    selectedCategory === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold translate-x-2'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-primary hover:translate-x-1'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Filtros avanzados */}
                <div className="mt-10 pt-10 border-t border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-4">
                        Filtros Avanzados
                    </h3>
                    <p className="text-xs text-gray-400 italic">
                        Próximamente: Rango de precios
                    </p>
                </div>

                {/* Indicador de categoría seleccionada */}
                {selectedCategory && selectedCategory !== 'Todos' && (
                    <div className="mt-6 lg:hidden p-4 bg-primary/10 rounded-xl">
                        <p className="text-sm text-gray-600">
                            Categoría seleccionada:{' '}
                            <span className="font-semibold text-primary">{selectedCategory}</span>
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
};

export default SidebarFilters;