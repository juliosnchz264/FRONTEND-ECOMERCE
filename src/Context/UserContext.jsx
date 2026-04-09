// src/Context/UserContext.jsx
import { useState, useEffect, createContext, useCallback, useRef } from 'react'
import {
    getProfileService,
    logoutService,
    checkSessionService,
    setAccessToken,
} from '../services/authServices'
import { useBroadcastAuth } from '../Hooks/useBroadcastAuth'
import toast from 'react-hot-toast'

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
    // ===== ESTADO INICIAL =====
    const [userInfo, setUserInfo] = useState(() => {
        try {
            const saved = localStorage.getItem('userInfo')
            if (!saved || saved === 'undefined' || saved === 'null') {
                return null
            }
            const parsed = JSON.parse(saved)
            return parsed && typeof parsed === 'object' ? parsed : null
        } catch (error) {
            console.error('Error parsing userInfo from localStorage:', error)
            localStorage.removeItem('userInfo')
            return null
        }
    })

    const [loading, setLoading] = useState(true)
    const { notifyLogin, notifyLogout, onMessage } = useBroadcastAuth()

    // ===== REFS =====
    const logoutRef = useRef(null)
    const checkSessionTimeoutRef = useRef(null)

    // ===== FUNCIONES =====
    const logout = useCallback(
        async (shouldNotify = true) => {
            if (shouldNotify) {
                try {
                    await logoutService()
                } catch (error) {
                    console.error('Error en logoutService:', error)
                }
            }

            setUserInfo(null)
            localStorage.removeItem('userInfo')
            localStorage.removeItem('wasAuthenticated')

            if (shouldNotify) {
                notifyLogout()
            }

            toast.success('Sesión cerrada correctamente')
        },
        [notifyLogout],
    )

    useEffect(() => {
        logoutRef.current = logout
    }, [logout])

    const checkSession = useCallback(async () => {
        const wasAuthenticated = localStorage.getItem('wasAuthenticated')
        if (!wasAuthenticated) {
            setLoading(false)
            return
        }

        if (checkSessionTimeoutRef.current) {
            clearTimeout(checkSessionTimeoutRef.current)
        }

        checkSessionTimeoutRef.current = setTimeout(async () => {
            try {
                const result = await checkSessionService()

                if (result.success && result.authenticated) {
                    const currentUserJSON = JSON.stringify(userInfo)
                    const newUserJSON = JSON.stringify(result.user)

                    if (currentUserJSON !== newUserJSON) {
                        setUserInfo(result.user)
                        localStorage.setItem('userInfo', newUserJSON)
                        localStorage.setItem('wasAuthenticated', 'true')
                    }
                } else {
                    setUserInfo(null)
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('wasAuthenticated')
                }
            } catch (error) {
                console.error('Error en checkSession:', error)
            } finally {
                setLoading(false)
                checkSessionTimeoutRef.current = null
            }
        }, 300)
    }, [userInfo])

    const login = useCallback(
        async (userData, token) => {
            localStorage.setItem('wasAuthenticated', 'true')
            localStorage.setItem('userInfo', JSON.stringify(userData))
            setUserInfo(userData)
            notifyLogin(userData, token)
            toast.success(`¡Bienvenido, ${userData.name || 'usuario'}!`)
        },
        [notifyLogin],
    )

    // ===== BROADCAST MESSAGES =====
    useEffect(() => {
        onMessage((data) => {
            if (data.type === 'LOGOUT') {
                toast('Has cerrado sesión en otra ventana', {
                    duration: 3000,
                    position: 'top-center',
                    icon: '🔒',
                })
                if (logoutRef.current) {
                    logoutRef.current(false)
                }
            }

            if (data.type === 'LOGIN') {
                if (data.user) {
                    setUserInfo(data.user)
                    localStorage.setItem('userInfo', JSON.stringify(data.user))
                    localStorage.setItem('wasAuthenticated', 'true')

                    if (data.token) {
                        setAccessToken(data.token)
                    }

                    toast.success(
                        `Has iniciado sesión en otra ventana como ${data.user.email}`,
                        {
                            duration: 3000,
                            position: 'top-center',
                            icon: '🔓',
                        },
                    )
                } else {
                    checkSession()
                }
            }
        })

        return () => {
            if (checkSessionTimeoutRef.current) {
                clearTimeout(checkSessionTimeoutRef.current)
            }
        }
    }, [onMessage, checkSession, logoutRef])

    // ===== VERIFICACIÓN INICIAL =====
    useEffect(() => {
        const wasAuthenticated = localStorage.getItem('wasAuthenticated')

        if (wasAuthenticated) {
            checkSession()

            const interval = setInterval(checkSession, 5 * 60 * 1000)

            return () => {
                clearInterval(interval)
                if (checkSessionTimeoutRef.current) {
                    clearTimeout(checkSessionTimeoutRef.current)
                }
            }
        } else {
            setLoading(false)
        }
    }, [checkSession])

    // ===== HELPERS =====
    const getUserId = useCallback(() => userInfo?.id || null, [userInfo])
    const isAuthenticated = useCallback(() => !!userInfo?.id, [userInfo])

    // ===== CONTEXT VALUE =====
    const value = {
        userInfo,
        setUserInfo,
        loading,
        getUserId,
        isAuthenticated,
        login,
        logout,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}