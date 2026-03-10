import { useState, useEffect, createContext } from 'react'
import { getProfileService } from '../services/authServices'

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => { 
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    const checkSession = async () => {
        if (!localStorage.getItem('wasAuthenticated')) {
            setLoading(false)
            return
        }
        try {
            setLoading(true)
            const userData = await getProfileService()

            if (userData) {
                setUserInfo(userData)
                localStorage.setItem('userInfo', JSON.stringify(userData))
            } else {
                // Si el servidor responde vacío, limpiamos
                setUserInfo(null)
                localStorage.removeItem('userInfo')
                localStorage.removeItem('wasAuthenticated')
            }
        } catch (error) {
            // Si hay un error (como token expirado), reseteamos el estado
            setUserInfo(null)
            localStorage.removeItem('wasAuthenticated')
            console.warn("Sesión expirada o inválida");
        } finally {
            setLoading(false)
        }
    }

    const getUserId = () => userInfo?.id || null
    const isAuthenticated = () => !!userInfo?.id

    useEffect(() => {
        checkSession()
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                checkSession,
                getUserId,
                isAuthenticated,
            }}
        >
            {children}

            {loading && (
                <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-[999]">
                    <div className="h-full bg-primary animate-pulse w-1/3"></div>
                </div>
            )}
        </UserContext.Provider>
    )
}
