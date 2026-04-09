// frontend/src/Hooks/useBroadcastAuth.js
import { useEffect, useRef, useCallback } from 'react';

const BROADCAST_CHANNEL = 'ecommerce_auth_channel';

export const useBroadcastAuth = () => {
    const channelRef = useRef(null);

    useEffect(() => {
        const channel = new BroadcastChannel(BROADCAST_CHANNEL);
        channelRef.current = channel;

        return () => {
            channel.close();
            channelRef.current = null;
        };
    }, []);

    const notifyLogin = useCallback((userData, token) => {
        if (channelRef.current) {
            const message = {
                type: 'LOGIN',
                user: userData,
                token: token,
                timestamp: Date.now()
            };
            channelRef.current.postMessage(message);
        }
    }, []);

    const notifyLogout = useCallback(() => {
        if (channelRef.current) {
            const message = {
                type: 'LOGOUT',
                timestamp: Date.now()
            };
            channelRef.current.postMessage(message);
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