// frontend/src/Hooks/useCartOperations.js
import { useCallback } from 'react';
import {
    addToCartService,
    updateCartService,
    removeFromCartService,
    clearCartService,
} from '../services/cartServices';
import { toast } from 'react-hot-toast';

export const useCartOperations = (
    isAuthenticated, 
    loadCart, 
    saveLocalCart, 
    setCart,
    connected,        // 🟢 NUEVO: Para saber si hay conexión
    emitUpdate,       // 🟢 NUEVO: Para emitir actualizaciones
    broadcastUpdate   // 🟢 NUEVO: Para BroadcastChannel
) => {
    
    const addToCart = useCallback(async (product, quantity = 1) => {
        // Validar cantidad
        if (quantity <= 0) {
            toast.error('La cantidad debe ser mayor a 0');
            return;
        }

        if (isAuthenticated()) {
            try {
                await addToCartService(product._id, quantity);
                const updatedCart = await loadCart(true);
                
                // Emitir actualización si hay conexión
                if (connected && updatedCart) {
                    emitUpdate(updatedCart);
                }
                
                toast.success('Producto agregado al carrito');
            } catch (error) {
                console.error('Error al agregar al carrito:', error);
                toast.error(error.message || 'Error al agregar al carrito');
            }
        } else {
            // Modo offline
            setCart(prevCart => {
                const existingIndex = prevCart.findIndex(item => item._id === product._id)
                let newCart
                
                if (existingIndex > -1) {
                    newCart = prevCart.map((item, index) => 
                        index === existingIndex 
                            ? { ...item, quantity: (item.quantity || 1) + quantity }
                            : item
                    )
                } else {
                    newCart = [...prevCart, { ...product, quantity }]
                }
                
                saveLocalCart(newCart)
                broadcastUpdate(newCart) // 🟢 Notificar a otras pestañas
                return newCart
            })
            toast.success('Producto agregado al carrito')
        }
    }, [isAuthenticated, loadCart, saveLocalCart, setCart, connected, emitUpdate, broadcastUpdate]);

    const updateQuantity = useCallback(async (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        if (isAuthenticated()) {
            try {
                await updateCartService(productId, newQuantity);
                const updatedCart = await loadCart(true);
                
                if (connected && updatedCart) {
                    emitUpdate(updatedCart);
                }
            } catch (error) {
                console.error('Error al actualizar cantidad:', error);
                toast.error(error.message || 'Error al actualizar cantidad');
            }
        } else {
            setCart(prevCart => {
                const item = prevCart.find(i => i._id === productId);
                
                if (item?.stock && newQuantity > item.stock) {
                    toast.error(`Stock insuficiente. Máximo: ${item.stock}`);
                    return prevCart;
                }
                
                const newCart = prevCart.map(item =>
                    item._id === productId ? { ...item, quantity: newQuantity } : item
                );
                saveLocalCart(newCart);
                broadcastUpdate(newCart);
                return newCart;
            });
        }
    }, [isAuthenticated, loadCart, saveLocalCart, setCart, connected, emitUpdate, broadcastUpdate]);

    const removeFromCart = useCallback(async (productId) => {
        if (isAuthenticated()) {
            try {
                await removeFromCartService(productId);
                const updatedCart = await loadCart(true);
                
                if (connected && updatedCart) {
                    emitUpdate(updatedCart);
                }
                
                toast.success('Producto eliminado del carrito');
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                toast.error(error.message || 'Error al eliminar producto');
            }
        } else {
            setCart(prevCart => {
                const newCart = prevCart.filter(item => item._id !== productId);
                saveLocalCart(newCart);
                broadcastUpdate(newCart);
                return newCart;
            });
            toast.success('Producto eliminado del carrito');
        }
    }, [isAuthenticated, loadCart, saveLocalCart, setCart, connected, emitUpdate, broadcastUpdate]);

    const clearCart = useCallback(async () => {
        if (isAuthenticated()) {
            try {
                await clearCartService();
                setCart([]);
                
                // 🟢 IMPORTANTE: Limpiar localStorage
                localStorage.removeItem('cart');
                
                if (connected) {
                    emitUpdate({ products: [] });
                }
                
                toast.success('Carrito vaciado');
            } catch (error) {
                console.error('Error al limpiar carrito:', error);
                toast.error(error.message || 'Error al limpiar carrito');
            }
        } else {
            setCart([]);
            saveLocalCart([]);
            broadcastUpdate([]);
            toast.success('Carrito vaciado');
        }
    }, [isAuthenticated, saveLocalCart, setCart, connected, emitUpdate, broadcastUpdate]);

    return { 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart 
    };
};