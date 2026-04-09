// hooks/useSearch.js
import { useState, useCallback, useRef, useEffect } from 'react'

export const useSearch = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [rateLimited, setRateLimited] = useState(false)
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })

    const searchAbortRef = useRef(null)
    const searchTimerRef = useRef(null)
    const retryTimerRef = useRef(null)
    const lastSearchRef = useRef({ query: '', page: 1 })

    // Normalizar producto: asegurar que imageUrl sea un string válido
    const normalizeProduct = useCallback((product) => {
        let url = null

        if (typeof product.imageUrl === 'string' && product.imageUrl) {
            url = product.imageUrl
        } else if (product.image) {
            if (typeof product.image === 'string' && product.image) {
                url = product.image
            } else if (product.image.url && typeof product.image.url === 'string') {
                url = product.image.url
            }
        } else if (Array.isArray(product.images) && product.images.length > 0) {
            const first = product.images[0]
            url = typeof first === 'string' ? first : first?.url || null
        }

        return { ...product, imageUrl: url }
    }, [])

    // Búsqueda principal con manejo de 429
    const search = useCallback(async (searchQuery, page = 1) => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setResults([])
            setPagination({ page: 1, total: 0, totalPages: 1 })
            return
        }

        // Si estamos rate-limited, guardar para retry automático
        if (rateLimited) {
            lastSearchRef.current = { query: searchQuery, page }
            return
        }

        if (searchAbortRef.current) {
            searchAbortRef.current.abort()
        }

        const controller = new AbortController()
        searchAbortRef.current = controller
        lastSearchRef.current = { query: searchQuery, page }

        setLoading(true)

        try {
            const params = new URLSearchParams({
                q: searchQuery.trim(),
                page: page.toString(),
                limit: '20',
            })

            const response = await fetch(`/api/search?${params}`, {
                signal: controller.signal,
            })

            // Manejar rate limit (429)
            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10)
                setRateLimited(true)
                setLoading(false)

                // Auto-retry después del período de espera
                if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
                retryTimerRef.current = setTimeout(() => {
                    setRateLimited(false)
                    // Reintentar la última búsqueda
                    const { query: lastQ, page: lastP } = lastSearchRef.current
                    if (lastQ) search(lastQ, lastP)
                }, retryAfter * 1000)
                return
            }

            const data = await response.json()

            if (data.success) {
                setResults(data.products.map(normalizeProduct))
                setPagination({
                    page: data.page || page,
                    total: data.total || data.products.length,
                    totalPages: data.totalPages || 1,
                })
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error en búsqueda:', error)
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false)
            }
        }
    }, [normalizeProduct, rateLimited])

    // Búsqueda debounced (800ms) — solo para búsqueda en tiempo real mientras escribe
    const debouncedSearch = useCallback((searchQuery, page = 1) => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }
        searchTimerRef.current = setTimeout(() => {
            search(searchQuery, page)
        }, 800)
    }, [search])

    // Búsqueda inmediata (para Enter/click) — cancela debounce pendiente
    const searchImmediate = useCallback((searchQuery, page = 1) => {
        if (searchTimerRef.current) {
            clearTimeout(searchTimerRef.current)
        }
        search(searchQuery, page)
    }, [search])

    // Cambiar página
    const goToSearchPage = useCallback((page) => {
        setPagination(prev => ({ ...prev, page }))
        const { query } = lastSearchRef.current
        if (query) search(query, page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [search])

    // Limpiar búsqueda
    const clearSearch = useCallback(() => {
        if (searchAbortRef.current) searchAbortRef.current.abort()
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current)

        lastSearchRef.current = { query: '', page: 1 }
        setResults([])
        setLoading(false)
        setRateLimited(false)
        setPagination({ page: 1, total: 0, totalPages: 1 })
    }, [])

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (searchAbortRef.current) searchAbortRef.current.abort()
            if (searchTimerRef.current) clearTimeout(searchTimerRef.current)
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
        }
    }, [])

    return {
        results,
        loading,
        rateLimited,
        pagination,
        search,
        debouncedSearch,
        searchImmediate,
        goToSearchPage,
        clearSearch,
    }
}
