// frontend/src/Hooks/useBroadcastAuth.js
import { useEffect, useRef, useCallback } from 'react';

const BROADCAST_CHANNEL = 'ecommerce_auth_channel';

export const useBroadcastAuth = () => {
    const channelRef = useRef(null);

    useEffect(() => {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channelRef.current = channel;
        console.log('📡 Canal de broadcast creado:', BROADCAST_CHANNEL);

        return () => {
            console.log('📡 Cerrando canal de broadcast');
            channel.close();
            channelRef.current = null;
        };
    }, []);

    const notifyLogin = useCallback((userId) => {
        if (channelRef.current) {
            channelRef.current.postMessage({
                type: 'LOGIN',
                userId,
                timestamp: Date.now()
            });
        }
    }, []);

    const notifyLogout = useCallback(() => {
        if (channelRef.current) {
            channelRef.current.postMessage({
                type: 'LOGOUT',
                timestamp: Date.now()
            });
        }
    }, []);

    const onMessage = useCallback((callback) => {
        if (channelRef.current) {
            channelRef.current.onmessage = (event) => {
                callback(event.data);
            };
        }
    }, []);

    return { notifyLogin, notifyLogout, onMessage };
};