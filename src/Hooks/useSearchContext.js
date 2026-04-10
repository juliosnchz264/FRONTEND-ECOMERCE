// src/Hooks/useSearchContext.js
import { useContext } from 'react'
import { SearchContext } from '../Context/SearchContext'

export const useSearchContext = () => {
    const context = useContext(SearchContext)
    if (!context || Object.keys(context).length === 0) {
        throw new Error('useSearchContext must be used within a SearchProvider')
    }
    return context
}
