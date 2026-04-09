// src/Components/ui/Pagination.jsx
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
    // Generar array de números de página a mostrar
    const getPageNumbers = () => {
        const pages = []
        const maxVisible = 5 // Máximo de páginas visibles
        
        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Mostrar páginas con elipses
            if (currentPage <= 3) {
                // Primeras páginas
                for (let i = 1; i <= 4; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            } else if (currentPage >= totalPages - 2) {
                // Últimas páginas
                pages.push(1)
                pages.push('...')
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
            } else {
                // Páginas intermedias
                pages.push(1)
                pages.push('...')
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
                pages.push('...')
                pages.push(totalPages)
            }
        }
        
        return pages
    }

    // No mostrar paginación si solo hay una página
    if (totalPages <= 1) return null

    // Calcular rango de productos mostrados
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Información de resultados */}
            <div className="text-sm text-gray-500">
                Mostrando <span className="font-medium text-gray-700">{startItem}</span> -{' '}
                <span className="font-medium text-gray-700">{endItem}</span> de{' '}
                <span className="font-medium text-gray-700">{totalItems}</span> productos
            </div>
            
            {/* Botones de paginación */}
            <div className="flex items-center gap-1 flex-wrap justify-center">
                {/* Primera página */}
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
                    aria-label="Primera página"
                    title="Primera página"
                >
                    <FiChevronsLeft className="w-4 h-4" />
                </button>
                
                {/* Página anterior */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
                    aria-label="Página anterior"
                    title="Página anterior"
                >
                    <FiChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Números de página */}
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span 
                            key={`ellipsis-${index}`} 
                            className="px-3 py-2 text-gray-400 select-none"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 ${
                                currentPage === page
                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md cursor-default'
                                    : 'border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 text-gray-700'
                            }`}
                            aria-label={`Página ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                ))}
                
                {/* Página siguiente */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
                    aria-label="Página siguiente"
                    title="Página siguiente"
                >
                    <FiChevronRight className="w-4 h-4" />
                </button>
                
                {/* Última página */}
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-200"
                    aria-label="Última página"
                    title="Última página"
                >
                    <FiChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default Pagination