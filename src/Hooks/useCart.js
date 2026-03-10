import { useContext } from 'react'
import { CartContext } from '../Context/CartContext'

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart debe ser usado dentro de un CartContextProvider')
    }
    return context
}