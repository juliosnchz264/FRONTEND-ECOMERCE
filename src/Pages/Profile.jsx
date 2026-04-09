// src/Pages/Profile.jsx
import { useUser } from '../Hooks/useUser.js'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiCalendar, FiShield, FiEdit2, FiAward, FiCheckCircle } from 'react-icons/fi'

const Profile = () => {
    const { userInfo } = useUser()
    const baseServerUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');

    const avatarSrc = userInfo?.avatar 
        ? (userInfo.avatar.startsWith('http') ? userInfo.avatar : `${baseServerUrl}${userInfo.avatar}`)
        : `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}&background=6366f1&color=fff&bold=true&size=128`;

    // Fecha de registro simulada (puedes agregarla desde el backend)
    const joinDate = userInfo?.createdAt 
        ? new Date(userInfo.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
        : '2024';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                            Mi Perfil
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Gestiona tu información personal
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tarjeta de Usuario - Columna izquierda */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="md:col-span-1"
                        >
                            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                                {/* Header decorativo */}
                                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                                
                                <div className="p-6 text-center">
                                    {/* Avatar */}
                                    <div className="avatar mb-4">
                                        <div className="w-28 h-28 rounded-full ring-4 ring-purple-100 dark:ring-purple-900/50 overflow-hidden mx-auto transition-all duration-300 hover:ring-purple-300 dark:hover:ring-purple-700">
                                            <img 
                                                src={avatarSrc} 
                                                alt="Avatar" 
                                                className="object-cover w-full h-full"
                                                onError={(e) => { 
                                                    e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}&background=6366f1&color=fff`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Información del usuario */}
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                        {userInfo?.username}
                                    </h2>
                                    
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-3">
                                        <FiAward className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                        <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                                            {userInfo?.isAdmin ? 'Administrador' : 'Cliente'}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
                                        {userInfo?.email}
                                    </p>

                                    {/* Fecha de registro */}
                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                            <FiCalendar className="w-3 h-3" />
                                            <span>Miembro desde {joinDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Información de la cuenta - Columna derecha */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="md:col-span-2"
                        >
                            <div className="bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                                {/* Header decorativo */}
                                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                                
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                            <FiUser className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                            Detalles de la Cuenta
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Nombre de usuario */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <FiUser className="w-4 h-4" />
                                                Nombre de usuario:
                                            </span>
                                            <span className="text-gray-800 dark:text-white font-medium">
                                                {userInfo?.username}
                                            </span>
                                        </div>

                                        {/* Correo electrónico */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <FiMail className="w-4 h-4" />
                                                Correo electrónico:
                                            </span>
                                            <span className="text-gray-800 dark:text-white break-all">
                                                {userInfo?.email}
                                            </span>
                                        </div>

                                        {/* Estado de cuenta */}
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                            <span className="font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                <FiShield className="w-4 h-4" />
                                                Estado de cuenta:
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                                                <FiCheckCircle className="w-3 h-3" />
                                                Activa
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botón de acción */}
                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                        <Link 
                                            to="/profile/settings" 
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 group"
                                        >
                                            <FiEdit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                            <span>Editar Datos</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Profile