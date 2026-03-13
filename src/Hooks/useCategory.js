import { useContext } from 'react'
import { CategoryContext } from '../Context/CategoryContext'

export const useCategory = () => {
    const context = useContext(CategoryContext)
    if (!context) {
        throw new Error('useCategory debe ser usado dentro de un CategoryContextProvider')
    }
    return context
}