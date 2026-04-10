// src/Context/SearchContext.jsx
import { createContext, useState, useCallback, useEffect, useContext } from 'react'
import { useSearch } from '../Hooks/useSearch'

export const SearchContext = createContext({})

// 👈 AGREGAR ESTE HOOK
export const useSearchContext = () => {
    const context = useContext(SearchContext)
    if (!context) {
        throw new Error('useSearchContext must be used within SearchProvider')
    }
    return context
}

export const SearchProvider = ({ children }) => {
    const {
        results,
        loading,
        rateLimited,
        pagination,
        debouncedSearch,
        searchImmediate,
        goToSearchPage,
        clearSearch,
    } = useSearch()

    const [searchQuery, setSearchQuery] = useState('')
    const [isSearchActive, setIsSearchActive] = useState(false)

    // Búsqueda al dar Enter o click en sugerencia
    const handleSearch = useCallback(
        (query) => {
            if (!query) {
                clearSearch()
                setSearchQuery('')
                setIsSearchActive(false)
                return
            }
            setSearchQuery(query)
            setIsSearchActive(true)
            searchImmediate(query, 1)
        },
        [searchImmediate, clearSearch],
    )

    // Cambio de texto en el input
    const handleQueryChange = useCallback(
        (query) => {
            setSearchQuery(query)

            if (!query || query.trim().length < 2) {
                clearSearch()
                setIsSearchActive(false)
                return
            }

            debouncedSearch(query, 1)
        },
        [debouncedSearch, clearSearch],
    )

    // Activar modo búsqueda cuando llegan resultados del debounce
    useEffect(() => {
        if (results.length > 0 && searchQuery.trim().length >= 2) {
            setIsSearchActive(true)
        }
    }, [results, searchQuery])

    // Volver a todos los productos
    const handleBackToProducts = useCallback(() => {
        clearSearch()
        setSearchQuery('')
        setIsSearchActive(false)
    }, [clearSearch])

    return (
        <SearchContext.Provider
            value={{
                searchQuery,
                isSearchActive,
                searchResults: results,
                searchLoading: loading,
                rateLimited,
                searchPagination: pagination,
                handleSearch,
                handleQueryChange,
                handleBackToProducts,
                goToSearchPage,
                clearSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    )
}