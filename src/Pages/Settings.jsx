// src/Pages/Settings.jsx
import SettingsForm from '../Components/Settings/SettingsForm'
import { motion } from 'framer-motion'
import { FiSettings, FiUser, FiShield } from 'react-icons/fi'

const Settings = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                                <FiSettings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Configuración de cuenta
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-center md:text-left">
                            Gestiona tu información personal y seguridad
                        </p>
                    </div>

                    {/* Tarjeta de configuración */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
                    >
                        {/* Header decorativo */}
                        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                        
                        {/* Contenido */}
                        <div className="p-6 md:p-8">
                            <SettingsForm />
                        </div>
                    </motion.div>

                    {/* Footer informativo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <FiShield className="w-4 h-4 text-green-500 dark:text-green-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                Tus datos están seguros y encriptados
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default Settings