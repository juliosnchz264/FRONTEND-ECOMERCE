// src/Hooks/useProduct.js
import { useContext } from 'react'
import { ProductContext } from '../Context/ProductContext'

export const useProduct = () => {
    const context = useContext(ProductContext)
    if (!context) {
        throw new Error('useProduct must be used within ProductContextProvider')
    }
    return context
}