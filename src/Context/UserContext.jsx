import { useState, useEffect, createContext, useCallback, useRef } from 'react'
import { getProfileService, logoutService } from '../services/authServices'
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

    const logout = useCallback(async (shouldNotify = true) => {
        // 🚨 Llamar al servicio de logout del backend
        if (shouldNotify) {
            try {
                await logoutService();
                console.log('✅ LogoutService ejecutado correctamente');
            } catch (error) {
                console.error('❌ Error en logoutService:', error);
            }
        }
        
        setUserInfo(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('wasAuthenticated');
        
        if (shouldNotify) {
            notifyLogout();
        }
    }, [notifyLogout]);

    useEffect(() => {
        logoutRef.current = logout;
    }, [logout]);

    const checkSession = useCallback(async () => {
        if (!localStorage.getItem('wasAuthenticated')) {
            setUserInfo(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const userData = await getProfileService();
            // ✅ Condición CORREGIDA
            if (userData && userData.success === true && userData.data) {
                setUserInfo(userData.data);
                localStorage.setItem('userInfo', JSON.stringify(userData.data));
            } else {
                setUserInfo(null);
                localStorage.removeItem('userInfo');
                localStorage.removeItem('wasAuthenticated');
            }
        } catch (error) {
            console.error("❌ Error en checkSession:", error);
            
            if (error.response?.status === 401) {
                setUserInfo(null);
                localStorage.removeItem('userInfo');
                localStorage.removeItem('wasAuthenticated');
            } else {
                const localUserInfo = localStorage.getItem('userInfo');
                if (localUserInfo) {
                    setUserInfo(JSON.parse(localUserInfo));
                }
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback(async (userData) => {
        localStorage.setItem('wasAuthenticated', 'true');
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
        notifyLogin(userData.id);
    }, [notifyLogin]);

    // Escuchar mensajes de otras pestañas
    useEffect(() => {
        onMessage((data) => {
            console.log('📨 Mensaje broadcast:', data);
            
            if (data.type === 'LOGOUT') {
                console.log('🔔 Logout detectado en otra pestaña');
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
                console.log('🔔 Login detectado en otra pestaña');
                toast.success('Has iniciado sesión en otra ventana', {
                    duration: 3000,
                    position: 'top-center',
                    icon: '🔓'
                });
                checkSession();
            }
        });
    }, [onMessage, checkSession]);

    // Verificación inicial al cargar la pestaña
    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const getUserId = useCallback(() => userInfo?.id || null, [userInfo]);
    const isAuthenticated = useCallback(() => !!userInfo?.id, [userInfo]);

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                getUserId,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};