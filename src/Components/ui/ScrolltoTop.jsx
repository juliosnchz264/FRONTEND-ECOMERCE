// src/Components/ui/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll suave al inicio de la página
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;