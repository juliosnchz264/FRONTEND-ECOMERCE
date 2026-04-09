// src/Components/SearchBar/SearchBar.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'

const SearchBar = ({ value = '', onSearch, onQueryChange, className = '' }) => {
    // Si el padre pasa value, usamos eso; si no, estado local
    const isControlled = value !== undefined && onQueryChange
    const [localQuery, setLocalQuery] = useState('')
    const query = isControlled ? value : localQuery

    const [suggestions, setSuggestions] = useState([])
    const [loadingSuggestions, setLoadingSuggestions] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
    const inputRef = useRef(null)
    const dropdownRef = useRef(null)
    const suggestAbortRef = useRef(null)
    const suggestTimerRef = useRef(null)
    const navigate = useNavigate()

    const updateQuery = useCallback((newValue) => {
        if (isControlled) {
            onQueryChange(newValue)
        } else {
            setLocalQuery(newValue)
        }
    }, [isControlled, onQueryChange])

    // Calcular posición del dropdown relativa al viewport (para el Portal)
    const updateDropdownPosition = useCallback(() => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect()
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            })
        }
    }, [])

    // Fetch sugerencias con AbortController y manejo de 429
    const fetchSuggestions = useCallback(async (searchQuery) => {
        if (searchQuery.length < 2) {
            setSuggestions([])
            return
        }

        if (suggestAbortRef.current) suggestAbortRef.current.abort()
        const controller = new AbortController()
        suggestAbortRef.current = controller

        setLoadingSuggestions(true)
        try {
            const response = await fetch(
                `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=6`,
                { signal: controller.signal }
            )
            // Si hay rate limit, silenciar y no reintentar sugerencias
            if (response.status === 429) {
                setLoadingSuggestions(false)
                return
            }
            const data = await response.json()
            if (data.success) {
                setSuggestions(data.suggestions)
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sugerencias:', error)
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoadingSuggestions(false)
            }
        }
    }, [])

    // Debounce sugerencias (350ms para reducir peticiones)
    useEffect(() => {
        if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)

        if (query.trim().length >= 2) {
            suggestTimerRef.current = setTimeout(() => {
                fetchSuggestions(query)
            }, 350)
        } else {
            setSuggestions([])
        }

        return () => {
            if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
        }
    }, [query, fetchSuggestions])

    // Actualizar posición del dropdown cuando se abre o al hacer scroll/resize
    useEffect(() => {
        if (!isOpen) return
        updateDropdownPosition()

        const handleUpdate = () => updateDropdownPosition()
        window.addEventListener('scroll', handleUpdate, true)
        window.addEventListener('resize', handleUpdate)
        return () => {
            window.removeEventListener('scroll', handleUpdate, true)
            window.removeEventListener('resize', handleUpdate)
        }
    }, [isOpen, updateDropdownPosition])

    // Click outside para cerrar
    useEffect(() => {
        if (!isOpen) return
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (suggestAbortRef.current) suggestAbortRef.current.abort()
            if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current)
        }
    }, [])

    const executeSearch = useCallback((searchText) => {
        const trimmed = searchText.trim()
        if (!trimmed) return

        setIsOpen(false)
        setSuggestions([])
        setSelectedIndex(-1)

        if (onSearch) {
            onSearch(trimmed)
        } else {
            navigate(`/search?q=${encodeURIComponent(trimmed)}`)
        }
    }, [onSearch, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            const text = suggestions[selectedIndex].text || suggestions[selectedIndex]
            updateQuery(text)
            executeSearch(text)
        } else {
            executeSearch(query)
        }
    }

    const handleSuggestionClick = (suggestion) => {
        const text = suggestion.text || suggestion
        updateQuery(text)
        executeSearch(text)
    }

    const handleClear = () => {
        updateQuery('')
        setSuggestions([])
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.focus()
        if (onSearch) onSearch('')
    }

    // Navegación con teclado en sugerencias
    const handleKeyDown = (e) => {
        if (!isOpen || suggestions.length === 0) return

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                )
                break
            case 'ArrowUp':
                e.preventDefault()
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                )
                break
            case 'Escape':
                setIsOpen(false)
                setSelectedIndex(-1)
                break
        }
    }

    const showDropdown = isOpen && query.length >= 2

    return (
        <div className={`relative w-full ${className}`}>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        updateQuery(e.target.value)
                        setIsOpen(true)
                        setSelectedIndex(-1)
                    }}
                    onFocus={() => {
                        if (query.length >= 2) setIsOpen(true)
                        updateDropdownPosition()
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-3 pl-12 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-shadow"
                    autoComplete="off"
                />
                <FiSearch className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />

                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-4 top-3 p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        aria-label="Limpiar búsqueda"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                )}
            </form>

            {/* Dropdown renderizado via Portal para escapar overflow-hidden y z-index del padre */}
            {showDropdown && createPortal(
                <div
                    ref={dropdownRef}
                    role="listbox"
                    className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
                    style={{
                        top: dropdownPos.top,
                        left: dropdownPos.left,
                        width: dropdownPos.width,
                        zIndex: 9999,
                    }}
                >
                    {loadingSuggestions ? (
                        <div className="px-4 py-3 flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Buscando...</span>
                        </div>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((suggestion, idx) => (
                            <div
                                key={idx}
                                role="option"
                                aria-selected={idx === selectedIndex}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                                    idx === selectedIndex
                                        ? 'bg-purple-50 dark:bg-purple-900/30'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <FiSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-700 dark:text-gray-300 truncate">
                                        {suggestion.text || suggestion}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
                            No se encontraron sugerencias
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    )
}

export default SearchBar
