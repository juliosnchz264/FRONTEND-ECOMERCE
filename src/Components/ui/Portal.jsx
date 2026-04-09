// src/Components/ui/Portal.jsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    const [container, setContainer] = useState(null);

    useEffect(() => {
        // Crear o obtener el contenedor del modal
        let modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'modal-root';
            document.body.appendChild(modalRoot);
        }
        setContainer(modalRoot);
        setMounted(true);

        return () => {
            // Limpiar solo si está vacío
            if (modalRoot && modalRoot.children.length === 0) {
                document.body.removeChild(modalRoot);
            }
        };
    }, []);

    if (!mounted || !container) return null;
    return createPortal(children, container);
};

export default Portal;