// frontend/src/Context/UserContext.jsx
import { useState, useEffect, createContext, useCallback, useRef } from 'react'
import { getProfileService, logoutService, checkSessionService } from '../services/authServices'
import { useBroadcastAuth } from '../Hooks/useBroadcastAuth';
import toast from 'react-hot-toast';

export const UserContext = createContext(null)

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(() => {
        const saved = localStorage.getItem('userInfo');
        return saved ? JSON.parse(saved) : null;
    });
    
    const [loading, setLoading] = useState(true)
    const { notifyLogin, notifyLogout, onMessage } = useBroadcastAuth();
    
    const logoutRef = useRef(null);
    const checkSessionTimeoutRef = useRef(null); // 🟢 Para evitar múltiples llamadas

    const logout = useCallback(async (shouldNotify = true) => {
        // 🚨 Llamar al servicio de logout del backend
        if (shouldNotify) {
            try {
                await logoutService();
            } catch (error) {
                console.error('Error en logoutService:', error);
            }
        }
        
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('wasAuthenticated');
        
        if (shouldNotify) {
            notifyLogout();
        }
        
        toast.success('Sesión cerrada correctamente');
    }, [notifyLogout]);

    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    const checkSession = useCallback(async () => {
        if (checkSessionTimeoutRef.current) {
            clearTimeout(checkSessionTimeoutRef.current);
        }

        checkSessionTimeoutRef.current = setTimeout(async () => {
            try {
                const result = await checkSessionService();
                
                if (result.success && result.authenticated) {
                    const currentUserJSON = JSON.stringify(userInfo);
                    const newUserJSON = JSON.stringify(result.user);
                    
                    if (currentUserJSON !== newUserJSON) {
                        console.log('🔄 Actualizando información de usuario');
                        setUserInfo(result.user);
                        localStorage.setItem('userInfo', newUserJSON);
                        localStorage.setItem('wasAuthenticated', 'true');
                    } else {
                        console.log('⏭️ Información de usuario idéntica, NO actualizando estado');
                    }
                } else {
                    console.log('🚫 Sesión no válida');
                    setUserInfo(null);
                    localStorage.removeItem('userInfo');
                    localStorage.removeItem('wasAuthenticated');
                }
            } catch (error) {
                console.error('❌ Error en checkSession:', error);
                // En caso de error, mantener la sesión actual
            } finally {
                setLoading(false);
                checkSessionTimeoutRef.current = null;
            }
        }, 300);
    }, [userInfo]);

    const login = useCallback(async (userData) => {
        localStorage.setItem('wasAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
        notifyLogin(userData.id);
        toast.success(`¡Bienvenido, ${userData.name || 'usuario'}!`);
    }, [notifyLogin]);

    // Escuchar mensajes de otras pestañas
    useEffect(() => {
        onMessage((data) => {            
            if (data.type === 'LOGOUT') {
                console.log('🔒 Logout detectado en otra pestaña');
                toast('Has cerrado sesión en otra ventana', {
                    duration: 3000,
                    position: 'top-center',
                    icon: '🔒'
                });
                if (logoutRef.current) {
                    logoutRef.current(false);
                }
            }
            
            if (data.type === 'LOGIN') {
                console.log('🔓 Login detectado en otra pestaña');
                toast.success('Has iniciado sesión en otra ventana', {
                    duration: 3000,
                    position: 'top-center',
                    icon: '🔓'
                });
                checkSession();
            }
        });
        
        return () => {
            if (checkSessionTimeoutRef.current) {
                clearTimeout(checkSessionTimeoutRef.current);
            }
        };
    }, [onMessage, checkSession]);

    // Verificación inicial al cargar la pestaña
    useEffect(() => {
        checkSession();
        
        // 🟢 Verificar periódicamente la sesión (cada 5 minutos)
        const interval = setInterval(checkSession, 5 * 60 * 1000);
        
        return () => {
            clearInterval(interval);
            if (checkSessionTimeoutRef.current) {
                clearTimeout(checkSessionTimeoutRef.current);
            }
        };
    }, [checkSession]);

    const getUserId = useCallback(() => userInfo?.id || null, [userInfo]);
    const isAuthenticated = useCallback(() => !!userInfo?.id, [userInfo]);

    const value = {
        userInfo,
        setUserInfo,
        loading,
        getUserId,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};