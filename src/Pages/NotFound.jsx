// src/Pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FiHome, 
    FiSearch, 
    FiArrowLeft, 
    FiAlertTriangle,
    FiShoppingBag,
    FiPackage,
    FiGrid,
    FiHelpCircle
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

const NotFound = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const suggestedLinks = [
        { to: "/", icon: FiHome, label: "Inicio", color: "from-purple-500 to-purple-600" },
        { to: "/products", icon: FiPackage, label: "Productos", color: "from-blue-500 to-blue-600" },
        { to: "/categories", icon: FiGrid, label: "Categorías", color: "from-green-500 to-green-600" },
        { to: "/contact", icon: FiHelpCircle, label: "Contacto", color: "from-orange-500 to-orange-600" }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden transition-colors duration-300">
            {/* Fondo con efecto de movimiento */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div 
                    className="absolute w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
                <div 
                    className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl"
                    style={{
                        transform: `translate(${-mousePosition.x * 0.02}px, ${-mousePosition.y * 0.02}px)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 max-w-2xl w-full text-center"
            >
                {/* Código 404 animado */}
                <motion.div
                    variants={itemVariants}
                    className="relative mb-8"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <motion.div
                        animate={{ 
                            scale: isHovering ? 1.05 : 1,
                            rotate: isHovering ? 5 : 0
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative inline-block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-30 animate-pulse"></div>
                        <h1 className="relative text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            404
                        </h1>
                    </motion.div>
                    
                    {/* Elementos decorativos */}
                    <motion.div
                        animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, -10, 0]
                        }}
                        transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-4 -right-4 text-4xl opacity-50"
                    >
                        <FiAlertTriangle className="w-8 h-8 text-yellow-500" />
                    </motion.div>
                </motion.div>

                {/* Mensaje principal */}
                <motion.div variants={itemVariants} className="space-y-4 mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                        ¡Ups! Página no encontrada
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        La página que buscas no existe o ha sido movida.
                    </p>
                    <div className="inline-block bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                        <code className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                            {window.location.pathname}
                        </code>
                    </div>
                </motion.div>

                {/* Botón de regreso */}
                <motion.div variants={itemVariants} className="mb-12">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 group"
                    >
                        <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver al inicio</span>
                    </Link>
                </motion.div>

                {/* Sugerencias de navegación */}
                <motion.div variants={itemVariants} className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center justify-center gap-2">
                        <FiSearch className="w-4 h-4" />
                        <span>Tal vez te interese:</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {suggestedLinks.map((link, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to={link.to}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all border border-gray-200 dark:border-gray-700 group"
                                >
                                    <link.icon className={`w-4 h-4 bg-gradient-to-r ${link.color} bg-clip-text text-transparent`} />
                                    <span className="text-sm font-medium">{link.label}</span>
                                    <FiArrowLeft className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all rotate-180" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Banner de búsqueda */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <FiShoppingBag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            ¿Buscas algo específico?{' '}
                            <Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                                Explora nuestra tienda
                            </Link>
                        </p>
                    </div>
                </motion.div>

                {/* Footer decorativo */}
                <motion.div
                    variants={itemVariants}
                    className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                >
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Error 404 - Página no encontrada • E-Commerce
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;