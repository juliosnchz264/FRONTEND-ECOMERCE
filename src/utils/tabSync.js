// frontend/src/utils/tabSync.js
export const setupTabSync = (setCart) => {
    if (typeof window === 'undefined') return null;
    
    // Usar BroadcastChannel para comunicación entre pestañas
    const channel = new BroadcastChannel('cart_sync');
    
    channel.onmessage = (event) => {
        const { type, cart, timestamp, source } = event.data;
        
        // Ignorar mensajes de la misma pestaña
        if (source === window.location.href) return;
        
        if (type === 'CART_UPDATED') {
            console.log('🔄 Sincronizando carrito desde otra pestaña:', cart);
            setCart(cart);
        }
    };
    
    // Función para emitir cambios a otras pestañas
    const emitChange = (cart) => {
        channel.postMessage({
            type: 'CART_UPDATED',
            cart,
            source: window.location.href,
            timestamp: Date.now()
        });
    };
    
    return { channel, emitChange };
};