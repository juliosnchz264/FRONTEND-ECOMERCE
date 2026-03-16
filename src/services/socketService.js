// frontend/src/services/socketService.js
import { io } from 'socket.io-client';

let socket = null;
let reconnectTimer = null;

export const initializeSocket = (userId, token) => {
    // Si ya hay un socket conectado, devolverlo
     if (socket && socket.connected && socket.auth?.userId === userId) {
        console.log('🔄 Reutilizando socket existente para usuario:', userId)
        return socket
    }
    
    // Si hay un socket pero para otro usuario o está desconectado, limpiarlo
    if (socket) {
        console.log('🧹 Limpiando socket anterior')
        socket.removeAllListeners()
        socket.disconnect()
        socket = null
    }

    const baseURL = import.meta.env.VITE_BACKEND_URL.replace('/api', '');
    console.log('🔌 Inicializando Socket.IO en:', baseURL);

    // Limpiar timer existente
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }

    socket = io(baseURL, {
        auth: {
            userId,
            token
        },
        transports: ['websocket', 'polling'],
        withCredentials: true,
        path: '/socket.io/',
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 10000,
        autoConnect: true,
        forceNew: true // Forzar nueva conexión
    });

    // Configurar manejadores de eventos globales
    socket.on('connect', () => {
        console.log('✅ Socket.IO conectado exitosamente con ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
        console.error('❌ Error de conexión Socket.IO:', error.message);
    });

    socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO desconectado. Razón:', reason);
        
        // Si la desconexión fue por error del servidor, intentar reconectar manualmente
        if (reason === 'io server disconnect' || reason === 'transport close') {
            console.log('🔄 Intentando reconectar manualmente en 2 segundos...');
            reconnectTimer = setTimeout(() => {
                if (socket && !socket.connected) {
                    socket.connect();
                }
            }, 2000);
        }
    });

    socket.on('reconnect_attempt', (attempt) => {
        console.log(`🔄 Intento de reconexión #${attempt}`);
    });

    socket.on('reconnect', (attempt) => {
        console.log(`✅ Reconectado exitosamente después de ${attempt} intentos`);
    });

    socket.on('reconnect_error', (error) => {
        console.error('❌ Error en reconexión:', error.message);
    });

    socket.on('reconnect_failed', () => {
        console.error('❌ Fallaron todos los intentos de reconexión');
    });

    return socket;
};

export const disconnectSocket = () => {
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    
    if (socket) {
        console.log('🔌 Desconectando Socket.IO manualmente');
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
};

export const emitCartUpdate = (cartData) => {
    if (socket && socket.connected) {
        console.log('📤 Enviando actualización de carrito');
        socket.emit('cart:update', cartData);
    } else {
        console.log('⚠️ Socket no conectado, no se puede emitir');
    }
};

export const isConnected = () => {
    return socket?.connected || false;
};

export const getSocketId = () => {
    return socket?.id || null;
};

// Función para verificar el estado de la conexión
export const checkConnection = () => {
    if (!socket) return { connected: false, message: 'Socket no inicializado' };
    return {
        connected: socket.connected,
        id: socket.id,
        disconnected: socket.disconnected,
        active: !!socket.connected
    };
};