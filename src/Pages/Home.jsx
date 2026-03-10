import CardProduct from '../Components/CardProduct/CardProduct';
import { useProduct } from '../Hooks/useProduct.js';
import SidebarFilters from '../Components/SidebarFilters/SidebarFilters';

const Home = () => {
    const { products, productsLoading, error } = useProduct();

    return (
        <div className="min-h-screen bg-gray-50">
            <h1 className='text-4xl font-bold text-center pt-7 mb-2 text-purple-700 uppercase'>
                Mi Ecomerce
            </h1>
            <p className="text-center mt-4">Elegí tu producto ⬇</p>
            
            {/* Contenedor principal con flex para sidebar y productos */}
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar de filtros */}
                <SidebarFilters />
                
                {/* Grid de productos - Se ajusta automáticamente */}
                <main className="flex-1 p-4 lg:p-6">
                    <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                        {productsLoading ? (
                            <div className="flex justify-center items-center w-full min-h-[200px]">
                                <span className="loading loading-spinner text-primary loading-lg"></span>
                            </div>
                        ) : error ? (
                            <div className="text-center w-full py-10">
                                <p className="text-red-500">Error al cargar los productos</p>
                            </div>
                        ) : products?.length === 0 ? (
                            <div className="text-center w-full py-10">
                                <p className="text-gray-500">No hay productos disponibles</p>
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
    );
};

export default Home;