// src/Components/Navbar/UserDropDown.jsx
import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../Hooks/useUser.js'
import { useNavigate, Link } from 'react-router'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiPackage, FiSettings, FiLogOut, FiUserCheck, FiChevronRight } from 'react-icons/fi'

const baseServerUrl = import.meta.env.VITE_BACKEND_URL?.replace('/api', '') || '';

const UserDropDown = ({ isOpen: externalIsOpen, onToggle, onClose }) => {
    const { userInfo, logout } = useUser()
    const navigate = useNavigate()
    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    
    // Usar estado externo si se proporciona, sino el interno
    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen
    
    const toggleDropdown = () => {
        if (onToggle) {
            onToggle()
        } else {
            setInternalIsOpen(!internalIsOpen)
        }
    }
    
    const closeDropdown = () => {
        if (onClose) {
            onClose()
        } else {
            setInternalIsOpen(false)
        }
    }
    
    // Cerrar al hacer click fuera
    useEffect(() => {
        if (!isOpen) return
        
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                closeDropdown()
            }
        }
        
        // Pequeño delay para evitar que se cierre inmediatamente al abrir
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside)
        }, 100)
        
        return () => {
            clearTimeout(timer)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])
    
    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Sesión cerrada correctamente');
            closeDropdown();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Error al cerrar sesión', error);
            toast.error('Error al cerrar sesión');
        }
    }

    if (!userInfo) return null

    const getAvatarSrc = () => {
        if (userInfo?.avatar) {
            return userInfo.avatar.startsWith('http') 
                ? userInfo.avatar 
                : `${baseServerUrl}${userInfo.avatar}`;
        }
        return `https://ui-avatars.com/api/?name=${userInfo?.username || userInfo?.email || 'U'}&background=6366f1&color=fff&bold=true`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="btn btn-ghost btn-circle avatar border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                aria-label="Menú de usuario"
            >
                <div className="w-10 rounded-full ring-2 ring-transparent hover:ring-purple-400 dark:hover:ring-purple-500 transition-all duration-300">
                    <img
                        src={getAvatarSrc()}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                        className="rounded-full"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username || userInfo?.email || 'U'}&background=6366f1&color=fff`;
                        }}
                    />
                </div>
            </button>
            
            <AnimatePresence>
            {isOpen && (
                <motion.ul
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformOrigin: 'top right' }}
                    className="absolute right-0 mt-3 w-64 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/60 border border-gray-100 dark:border-gray-700 z-[100]"
                >
                    {/* Header con info del usuario */}
                    <li className="px-4 py-3 mb-1">
                        <div className="flex items-center gap-3">
                            <img
                                src={getAvatarSrc()}
                                alt="avatar"
                                className="w-9 h-9 rounded-full ring-2 ring-purple-200 dark:ring-purple-800 object-cover flex-shrink-0"
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username || 'U'}&background=7c3aed&color=fff`
                                }}
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {userInfo?.username || userInfo?.email?.split('@')[0]}
                                </p>
                                {userInfo?.email && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {userInfo.email}
                                    </p>
                                )}
                            </div>
                        </div>
                        {userInfo?.isAdmin && (
                            <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                                <FiUserCheck className="w-3 h-3" />
                                Administrador
                            </span>
                        )}
                    </li>

                    <li className="border-t border-gray-100 dark:border-gray-700/60 mb-1" />

                    {/* Mi Perfil */}
                    <li>
                        <Link
                            to="/profile"
                            onClick={closeDropdown}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                        >
                            <FiUser className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            <span className="flex-1 font-medium text-sm">Mi Perfil</span>
                            <FiChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-purple-400" />
                        </Link>
                    </li>

                    {/* Mis Pedidos */}
                    <li>
                        <Link
                            to="/orders"
                            onClick={closeDropdown}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                        >
                            <FiPackage className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            <span className="flex-1 font-medium text-sm">Mis Pedidos</span>
                            <FiChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-purple-400" />
                        </Link>
                    </li>

                    {/* Configuración */}
                    <li>
                        <Link
                            to="/profile/settings"
                            onClick={closeDropdown}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-all group"
                        >
                            <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            <span className="flex-1 font-medium text-sm">Configuración</span>
                            <FiChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-purple-400" />
                        </Link>
                    </li>

                    <li className="border-t border-gray-100 dark:border-gray-700/60 my-1" />

                    {/* Cerrar sesión */}
                    <li>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group w-full"
                        >
                            <FiLogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="font-medium text-sm">Cerrar sesión</span>
                        </button>
                    </li>
                </motion.ul>
            )}
        </AnimatePresence>
        </div>
    )
}

export default UserDropDown