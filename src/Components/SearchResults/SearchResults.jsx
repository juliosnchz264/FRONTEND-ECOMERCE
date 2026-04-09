// src/Components/SearchResults/SearchResults.jsx
import CardProduct from '../CardProduct/CardProduct'
import Pagination from '../ui/Pagination'
import { FiSearch } from 'react-icons/fi'

const SearchResults = ({ results, loading, pagination, onPageChange }) => {
    if (loading && results.length === 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse"
                    >
                        <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (!loading && results.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                <FiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    No se encontraron productos
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                    Probá con otras palabras o revisá los filtros
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Indicador de carga durante cambio de página */}
            <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {results.map((product) => (
                    <CardProduct
                        key={product._id}
                        product={product}
                    />
                ))}
            </div>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                    totalItems={pagination.total}
                    itemsPerPage={20}
                />
            )}
        </div>
    )
}

export default SearchResults
