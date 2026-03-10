import { useContext } from 'react'
import { UserContext } from '../Context/UserContext' // Importamos el contexto

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser debe ser usado dentro de un UserContextProvider')
    }
    return context
}