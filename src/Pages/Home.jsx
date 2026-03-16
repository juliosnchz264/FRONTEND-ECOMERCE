import { useEffect, useState } from 'react';
import CardProduct from '../Components/CardProduct/CardProduct';
import { useProduct } from '../Hooks/useProduct.js';
import SidebarFilters from '../Components/SidebarFilters/SidebarFilters';
import { FiShoppingBag } from 'react-icons/fi';

const Home = () => {
    const { products, productsLoading, error, filterByCategory } = useProduct();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Función para resetear filtros
    const resetFilters = () => {
        filterByCategory('Todos', null);
    };

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isSidebarOpen]);

    // Exponemos la función globalmente para que el Navbar pueda acceder a ella
    useEffect(() => {
        window.resetHomeFilters = resetFilters;
        
        // Limpieza cuando el componente se desmonte
        return () => {
            delete window.resetHomeFilters;
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white py-16 mb-8">
                {/* ... hero content igual ... */}
                <div className="container mx-auto px-4 relative">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-4 mb-4">
                            <FiShoppingBag className="w-12 h-12 text-purple-200" />
                            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                                Mi Ecomerce
                            </h1>
                        </div>
                        <p className="text-xl text-purple-100 max-w-2xl">
                            Descubre los mejores productos seleccionados especialmente para vos
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Contenedor principal */}
            <div className="container mx-auto px-4 pb-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar de filtros - con z-index controlado */}
                    <div className="lg:w-80 flex-shrink-0">
                        <SidebarFilters onOpenChange={setIsSidebarOpen} />
                    </div>
                    
                    {/* Grid de productos - con ajuste para móvil */}
                    <main className={`flex-1 transition-all duration-300 ${
                        isSidebarOpen ? 'lg:ml-0 overflow-hidden' : ''
                    }`}>
                        {/* Overlay para móvil cuando el sidebar está abierto */}
                        {isSidebarOpen && (
                            <div 
                                className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('closeSidebar'));
                                }}
                            />
                        )}

                        {/* Header con resultados */}
                        <div className={`flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-md border border-purple-100 transition-all duration-300 ${
                            isSidebarOpen ? 'lg:opacity-100 opacity-30 pointer-events-none lg:pointer-events-auto' : ''
                        }`}>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Productos disponibles
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {products?.length || 0} productos encontrados
                                </p>
                            </div>
                            
                            <button 
                                onClick={resetFilters}
                                className="px-4 py-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors font-medium border border-purple-200"
                            >
                                Limpiar filtros
                            </button>
                        </div>

                        {/* Grid de productos - con altura y scroll controlado */}
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-300 ${
                            isSidebarOpen ? 'lg:opacity-100 opacity-30 pointer-events-none lg:pointer-events-auto max-h-screen overflow-hidden' : ''
                        }`}>
                            {productsLoading ? (
                                <div className="col-span-full flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl shadow-md border border-purple-100 p-12">
                                    <span className="loading loading-spinner text-purple-600 loading-lg mb-4"></span>
                                    <p className="text-gray-500">Cargando productos...</p>
                                </div>
                            ) : error ? (
                                <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-md border border-purple-100">
                                    <div className="text-red-500 text-6xl mb-4">😕</div>
                                    <p className="text-red-500 text-lg font-medium">Error al cargar los productos</p>
                                    <p className="text-gray-400 text-sm mt-2">Por favor, intentá de nuevo más tarde</p>
                                </div>
                            ) : products?.length === 0 ? (
                                <div className="col-span-full text-center py-16 bg-white rounded-2xl shadow-md border border-purple-100">
                                    <div className="text-gray-300 text-6xl mb-4">📦</div>
                                    <p className="text-gray-700 text-lg font-medium">No hay productos disponibles</p>
                                    <p className="text-gray-400 text-sm mt-2">Probá con otros filtros o volvé más tarde</p>
                                    <button 
                                        onClick={resetFilters}
                                        className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors shadow-lg"
                                    >
                                        Ver todos los productos
                                    </button>
                                </div>
                            ) : (
                                products.map((product) => (
                                    <CardProduct key={product._id} product={product} />
                                ))
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Home;