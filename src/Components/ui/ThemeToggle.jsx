// src/Components/ui/ThemeToggle.jsx
import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'
import { useTheme } from '../../Context/ThemeContext'

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme()

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 overflow-hidden"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Cambiar tema"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDarkMode ? 0 : 180,
                    scale: 1
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                className="relative z-10"
            >
                {isDarkMode ? (
                    <FiMoon className="w-5 h-5" />
                ) : (
                    <FiSun className="w-5 h-5" />
                )}
            </motion.div>
            
            {/* Efecto de onda al cambiar */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                    scale: isDarkMode ? [0, 1.5, 0] : 0,
                    opacity: isDarkMode ? [0.5, 0.3, 0] : 0
                }}
                transition={{ duration: 0.6 }}
                style={{ borderRadius: '50%' }}
            />
        </motion.button>
    )
}

export default ThemeToggle