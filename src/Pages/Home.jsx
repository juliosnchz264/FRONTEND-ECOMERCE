// src/Pages/Home.jsx
import { useState, useEffect, useCallback } from 'react'
import CardProduct from '../Components/CardProduct/CardProduct'
import { useProduct } from '../Hooks/useProduct.js'
import { useSearch } from '../Hooks/useSearch.js'
import SidebarFilters from '../Components/SidebarFilters/SidebarFilters'
import Pagination from '../Components/ui/Pagination'
import SearchBar from '../Components/SearchBar/SearchBar'
import SearchResults from '../Components/SearchResults/SearchResults'
import { FiShoppingBag, FiFilter, FiArrowLeft } from 'react-icons/fi'

const Home = () => {
  const {
    products,
    productsLoading,
    error,
    filterByCategory,
    resetFilters,
    currentPage,
    totalPages,
    totalProducts,
    itemsPerPage,
    goToPage,
    selectedCategory,
    selectedSubcategory,
  } = useProduct()

  const {
    results: searchResults,
    loading: searchLoading,
    rateLimited,
    pagination: searchPagination,
    searchImmediate,
    debouncedSearch,
    goToSearchPage,
    clearSearch,
  } = useSearch()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleFilterByCategory = useCallback((category, subcategoryId = null) => {
    filterByCategory(category, subcategoryId)
    setIsSidebarOpen(false)
  }, [filterByCategory])

  const handleResetAll = useCallback(() => {
    resetFilters()
    clearSearch()
    setSearchQuery('')
    setIsSearchActive(false)
  }, [resetFilters, clearSearch])

  // Búsqueda al dar Enter o click en sugerencia — inmediata, sin debounce extra
  const handleSearch = useCallback((query) => {
    if (!query) {
      clearSearch()
      setSearchQuery('')
      setIsSearchActive(false)
      return
    }
    setSearchQuery(query)
    setIsSearchActive(true)
    searchImmediate(query, 1)
  }, [searchImmediate, clearSearch])

  // Cambio de texto en el input — búsqueda completa solo tras 800ms de pausa
  // Las sugerencias se manejan dentro de SearchBar con su propio debounce (350ms)
  const handleQueryChange = useCallback((query) => {
    setSearchQuery(query)

    if (!query || query.trim().length < 2) {
      clearSearch()
      setIsSearchActive(false)
      return
    }

    // No activar modo búsqueda hasta que el debounce complete
    // Esto evita mostrar "Resultados" vacío mientras el usuario escribe
    debouncedSearch(query, 1)
  }, [debouncedSearch, clearSearch])

  // Activar modo búsqueda cuando llegan resultados del debounce
  useEffect(() => {
    if (searchResults.length > 0 && searchQuery.trim().length >= 2) {
      setIsSearchActive(true)
    }
  }, [searchResults, searchQuery])

  // Volver a todos los productos
  const handleBackToProducts = useCallback(() => {
    clearSearch()
    setSearchQuery('')
    setIsSearchActive(false)
  }, [clearSearch])

  // Cerrar sidebar en scroll (mobile)
  useEffect(() => {
    let scrollTimeout
    const handleScroll = () => {
      if (isSidebarOpen && window.innerWidth < 1024) {
        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          setIsSidebarOpen(false)
        }, 150)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section con SearchBar */}
      <div className="relative bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 text-white">
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="flex flex-col items-center text-center max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <FiShoppingBag className="w-12 h-12 text-purple-200" />
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                Mi Ecomerce
              </h1>
            </div>
            <p className="text-xl text-purple-100 max-w-2xl mb-8">
              Descubre los mejores productos seleccionados especialmente para vos
            </p>

            {/* SearchBar controlado */}
            <div className="w-full max-w-2xl mx-auto">
              <SearchBar
                value={searchQuery}
                onSearch={handleSearch}
                onQueryChange={handleQueryChange}
                className="shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contenedor principal */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Modo búsqueda */}
        {isSearchActive ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Resultados para: &ldquo;{searchQuery}&rdquo;
                </h2>
                {searchPagination.total > 0 && (
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {searchPagination.total} producto{searchPagination.total !== 1 ? 's' : ''} encontrado{searchPagination.total !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <button
                onClick={handleBackToProducts}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Volver a todos los productos
              </button>
            </div>

            {rateLimited && (
              <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Demasiadas búsquedas. Reintentando automáticamente...</span>
              </div>
            )}

            <SearchResults
              results={searchResults}
              loading={searchLoading}
              pagination={searchPagination}
              onPageChange={goToSearchPage}
            />
          </div>
        ) : (
          /* Layout normal con filtros y productos */
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 xl:gap-8">
            {/* Sidebar de filtros */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <SidebarFilters
                onOpenChange={setIsSidebarOpen}
                isOpen={isSidebarOpen}
                onFilter={handleFilterByCategory}
              />
            </div>

            {/* Contenido principal */}
            <main className="flex-1 min-w-0">
              {/* Botón filtros móvil */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-purple-100 dark:border-gray-700 flex items-center justify-between transition-colors duration-300"
                >
                  <div className="flex items-center gap-2">
                    <FiFilter className="text-purple-600 dark:text-purple-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Filtrar productos
                    </span>
                  </div>
                  {selectedCategory !== 'Todos' && (
                    <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full">
                      Activo
                    </span>
                  )}
                </button>
              </div>

              {/* Header con resultados */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-purple-100 dark:border-gray-700 transition-colors duration-300">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Productos disponibles
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {totalProducts} productos encontrados
                  </p>
                  {selectedCategory !== 'Todos' && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      Filtro activo: {selectedCategory}
                      {selectedSubcategory && ` › ${selectedSubcategory}`}
                    </p>
                  )}
                </div>

                <button
                  onClick={handleResetAll}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50 transition-colors font-medium border border-purple-200 dark:border-purple-800"
                >
                  Limpiar filtros
                </button>
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {productsLoading ? (
                  [...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse transition-colors duration-300"
                    >
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-purple-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="text-red-500 text-6xl mb-4">😕</div>
                    <p className="text-red-500 text-lg font-medium">
                      Error al cargar los productos
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Por favor, intentá de nuevo más tarde
                    </p>
                  </div>
                ) : products?.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-purple-100 dark:border-gray-700 transition-colors duration-300">
                    <div className="text-gray-300 dark:text-gray-600 text-6xl mb-4">📦</div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                      No hay productos disponibles
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                      Probá con otros filtros o volvé más tarde
                    </p>
                    <button
                      onClick={handleResetAll}
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

              {/* Paginación */}
              {!productsLoading && products?.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  totalItems={totalProducts}
                  itemsPerPage={itemsPerPage}
                />
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
