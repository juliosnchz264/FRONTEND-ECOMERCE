// src/Components/AdminDashboard/TableUsers/TableUsers.jsx
import { useState, useEffect } from 'react'
import { useUser } from '../../../Hooks/useUser'
import { 
    getAllUsersService, 
    updateUserRoleService, 
    deleteUserService,
    getUserStatsService 
} from '../../../services/userServices'
import { 
    FaUserCog, 
    FaTrash, 
    FaUserShield,
    FaUser,
    FaSearch,
    FaSort,
    FaSortUp,
    FaSortDown,
    FaChevronLeft,
    FaChevronRight,
    FaSync,
    FaChartBar,
    FaUserPlus,
    FaUserCheck,
    FaUserClock,
    FaEnvelope,
    FaCalendarAlt
} from 'react-icons/fa'
import { FiX, FiAlertTriangle } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// ============================================
// MODAL DE CONFIRMACIÓN PARA ELIMINAR
// ============================================
const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 max-w-md w-full border border-gray-200 dark:border-gray-700"
            >
                <div className="p-6 text-center">
                    <div className="mx-auto w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                        <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">¿Eliminar usuario?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        ¿Estás seguro de que quieres eliminar a <strong className="text-gray-800 dark:text-white">{user?.username}</strong>?
                        <br />
                        <span className="text-sm text-red-500 dark:text-red-400 mt-2 block">
                            Esta acción no se puede deshacer
                        </span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-all disabled:opacity-50 text-gray-700 dark:text-gray-300"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Eliminando...</span>
                                </>
                            ) : (
                                'Eliminar usuario'
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// ============================================
// MODAL PARA CAMBIAR ROL
// ============================================
const RoleModal = ({ user, isOpen, onClose, onConfirm, loading }) => {
    const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false)

    useEffect(() => {
        if (user) {
            setIsAdmin(user.isAdmin)
        }
    }, [user])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950/50 max-w-md w-full border border-gray-200 dark:border-gray-700"
            >
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
                        <FaUserShield className="text-purple-600 dark:text-purple-400" />
                        Cambiar rol de usuario
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl mb-6 border border-purple-100 dark:border-purple-800">
                        <p className="text-gray-700 dark:text-gray-300">
                            Usuario: <span className="font-semibold text-purple-700 dark:text-purple-400">{user?.username}</span>
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <FaEnvelope className="w-3 h-3" />
                            {user?.email}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <FaUser className={`w-5 h-5 ${!isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            <span className={`font-medium ${!isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                Usuario normal
                            </span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-7 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>

                        <div className="flex items-center gap-3">
                            <FaUserShield className={`w-5 h-5 ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            <span className={`font-medium ${isAdmin ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                Admin
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-all text-gray-700 dark:text-gray-300"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(isAdmin)}
                        disabled={loading || isAdmin === user?.isAdmin}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Guardando...</span>
                            </>
                        ) : (
                            'Guardar cambios'
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

// ============================================
// TARJETAS DE ESTADÍSTICAS
// ============================================
const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${bgColor} dark:bg-opacity-20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </motion.div>
)

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const TableUsers = () => {
    const [users, setUsers] = useState([])
    const [stats, setStats] = useState({
        total: 0,
        admins: 0,
        regularUsers: 0,
        recentRegistrations: 0
    })
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [roleUser, setRoleUser] = useState(null)
    const [deletingUser, setDeletingUser] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const usersPerPage = 10
    
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })
    
    const { user: currentUser } = useUser()

    useEffect(() => {
        loadUsers()
        loadStats()
    }, [currentPage, roleFilter])

    const loadUsers = async () => {
        try {
            setLoading(true)
            const data = await getAllUsersService({
                page: currentPage,
                limit: usersPerPage,
                search: searchTerm,
                role: roleFilter !== 'all' ? roleFilter : undefined
            })
            
            setUsers(data.data.users)
            setTotalPages(data.data.pagination.pages)
            setTotalUsers(data.data.pagination.total)
        } catch (error) {
            toast.error('Error al cargar usuarios')
        } finally {
            setLoading(false)
        }
    }

    const loadStats = async () => {
        try {
            const data = await getUserStatsService()
            setStats(data.data.totals)
        } catch (error) {
            console.error('Error al cargar estadísticas:', error)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await Promise.all([loadUsers(), loadStats()])
        setRefreshing(false)
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
        setTimeout(() => loadUsers(), 500)
    }

    const handleRoleChange = async (isAdmin) => {
        if (!roleUser) return
        setActionLoading(true)
        try {
            const data = await updateUserRoleService(roleUser._id, isAdmin)
            toast.success(data.message)
            await loadUsers()
            await loadStats()
            setRoleUser(null)
        } catch (error) {
            toast.error(error.message || 'Error al actualizar rol')
        } finally {
            setActionLoading(false)
        }
    }

    const handleDeleteUser = async () => {
        if (!deletingUser) return
        setActionLoading(true)
        try {
            const data = await deleteUserService(deletingUser._id)
            toast.success(data.message)
            await loadUsers()
            await loadStats()
            setDeletingUser(null)
        } catch (error) {
            toast.error(error.message || 'Error al eliminar usuario')
        } finally {
            setActionLoading(false)
        }
    }

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        setSortConfig({ key, direction })
        
        const sorted = [...users].sort((a, b) => {
            if (key === 'createdAt') {
                const dateA = new Date(a.createdAt).getTime()
                const dateB = new Date(b.createdAt).getTime()
                return direction === 'asc' ? dateA - dateB : dateB - dateA
            }
            
            const valueA = a[key]?.toLowerCase?.() || a[key]
            const valueB = b[key]?.toLowerCase?.() || b[key]
            
            if (valueA < valueB) return direction === 'asc' ? -1 : 1
            if (valueA > valueB) return direction === 'asc' ? 1 : -1
            return 0
        })
        
        setUsers(sorted)
    }

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return <FaSort className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        return sortConfig.direction === 'asc' 
            ? <FaSortUp className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            : <FaSortDown className="w-3 h-3 text-purple-600 dark:text-purple-400" />
    }

    if (loading && !refreshing) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={FaUser}
                    title="Total Usuarios"
                    value={stats.total}
                    color="bg-blue-600"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    icon={FaUserShield}
                    title="Administradores"
                    value={stats.admins}
                    color="bg-purple-600"
                    bgColor="bg-purple-50"
                />
                <StatCard
                    icon={FaUserCheck}
                    title="Usuarios"
                    value={stats.regularUsers}
                    color="bg-green-600"
                    bgColor="bg-green-50"
                />
                <StatCard
                    icon={FaUserClock}
                    title="Registros (7 días)"
                    value={stats.recentRegistrations}
                    color="bg-orange-600"
                    bgColor="bg-orange-50"
                />
            </div>

            {/* Panel de control */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <FaUserCog className="w-8 h-8 text-white" />
                            <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <FaSync className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </button>
                            <span className="bg-white/20 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
                                Total: {totalUsers}
                            </span>
                        </div>
                    </div>

                    {/* Barra de búsqueda y filtros */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                            <option value="all">Todos los roles</option>
                            <option value="admin">Solo administradores</option>
                            <option value="user">Solo usuarios</option>
                        </select>
                    </div>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                                    onClick={() => handleSort('username')}
                                >
                                    <div className="flex items-center gap-2">
                                        Usuario
                                        {getSortIcon('username')}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-2">
                                        Email
                                        {getSortIcon('email')}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Rol</th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center gap-2">
                                        Registro
                                        {getSortIcon('createdAt')}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <AnimatePresence>
                                {users.map((user, index) => (
                                    <motion.tr 
                                        key={user._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 dark:from-purple-500 dark:to-purple-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-900 dark:text-white">{user.username}</span>
                                                    {user._id === currentUser?.id && (
                                                        <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                                                            Tú
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {user.isAdmin ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                                                    <FaUserShield className="w-3 h-3" />
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm font-medium">
                                                    <FaUser className="w-3 h-3" />
                                                    Usuario
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                                                <FaCalendarAlt className="w-3 h-3" />
                                                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setRoleUser(user)}
                                                    disabled={user._id === currentUser?.id}
                                                    className={`p-2 rounded-lg transition-colors group relative ${
                                                        user._id === currentUser?.id
                                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                            : 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300'
                                                    }`}
                                                    title={user._id === currentUser?.id ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                                                >
                                                    <FaUserShield size={18} />
                                                    {user._id !== currentUser?.id && (
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Cambiar rol
                                                        </span>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setDeletingUser(user)}
                                                    disabled={user._id === currentUser?.id}
                                                    className={`p-2 rounded-lg transition-colors group relative ${
                                                        user._id === currentUser?.id
                                                            ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                            : 'text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300'
                                                    }`}
                                                    title={user._id === currentUser?.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
                                                >
                                                    <FaTrash size={18} />
                                                    {user._id !== currentUser?.id && (
                                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                            Eliminar usuario
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Mensaje si no hay usuarios */}
                {users.length === 0 && (
                    <div className="text-center py-12">
                        <FaUser className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No se encontraron usuarios</p>
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    loadUsers()
                                }}
                                className="mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrando {((currentPage - 1) * usersPerPage) + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers} usuarios
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                            >
                                <FaChevronLeft className="w-4 h-4" />
                            </button>
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                let pageNumber
                                if (totalPages <= 5) {
                                    pageNumber = i + 1
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i
                                } else {
                                    pageNumber = currentPage - 2 + i
                                }
                                
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                                            currentPage === pageNumber
                                                ? 'bg-purple-600 text-white'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                )
                            })}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600 dark:text-gray-400"
                            >
                                <FaChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            <AnimatePresence>
                {roleUser && (
                    <RoleModal
                        user={roleUser}
                        isOpen={!!roleUser}
                        onClose={() => setRoleUser(null)}
                        onConfirm={handleRoleChange}
                        loading={actionLoading}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {deletingUser && (
                    <DeleteConfirmModal
                        user={deletingUser}
                        isOpen={!!deletingUser}
                        onClose={() => setDeletingUser(null)}
                        onConfirm={handleDeleteUser}
                        loading={actionLoading}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

export default TableUsers