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
    FaUserClock
} from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

// ============================================
// MODAL DE CONFIRMACIÓN PARA ELIMINAR
// ============================================
const DeleteConfirmModal = ({ user, isOpen, onClose, onConfirm, loading }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
                <div className="p-6 text-center">
                    <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <FaTrash className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">¿Eliminar usuario?</h3>
                    <p className="text-gray-600 mb-6">
                        ¿Estás seguro de que quieres eliminar a <strong className="text-gray-800">{user?.username}</strong>?
                        <br />
                        <span className="text-sm text-red-500 mt-2 block">
                            Esta acción no se puede deshacer
                        </span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-all disabled:opacity-50"
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
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar usuario'
                            )}
                        </button>
                    </div>
                </div>
            </div>
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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FaUserShield className="text-purple-600" />
                        Cambiar rol de usuario
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <FiX className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="bg-purple-50 p-4 rounded-xl mb-6">
                        <p className="text-gray-700">
                            Usuario: <span className="font-semibold text-purple-700">{user?.username}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Email: {user?.email}
                        </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <FaUser className={`w-5 h-5 ${!isAdmin ? 'text-purple-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${!isAdmin ? 'text-purple-600' : 'text-gray-500'}`}>
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
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>

                        <div className="flex items-center gap-3">
                            <FaUserShield className={`w-5 h-5 ${isAdmin ? 'text-purple-600' : 'text-gray-400'}`} />
                            <span className={`font-medium ${isAdmin ? 'text-purple-600' : 'text-gray-500'}`}>
                                Admin
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-100 font-medium transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(isAdmin)}
                        disabled={loading || isAdmin === user?.isAdmin}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Guardando...
                            </>
                        ) : (
                            'Guardar cambios'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================
// TARJETAS DE ESTADÍSTICAS
// ============================================
const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all`}>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-600 text-sm mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
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
    const [roleFilter, setRoleFilter] = useState('all') // 'all', 'admin', 'user'
    const [roleUser, setRoleUser] = useState(null)
    const [deletingUser, setDeletingUser] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const usersPerPage = 10
    
    // Ordenamiento
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' })
    
    const { user: currentUser } = useUser()

    // Cargar usuarios y estadísticas
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
        setCurrentPage(1) // Resetear a primera página al buscar
        setTimeout(() => loadUsers(), 500) // Debounce simple
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
        if (sortConfig.key !== key) return <FaSort className="w-3 h-3 text-gray-400" />
        return sortConfig.direction === 'asc' 
            ? <FaSortUp className="w-3 h-3 text-purple-600" />
            : <FaSortDown className="w-3 h-3 text-purple-600" />
    }

    if (loading && !refreshing) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-purple-600 mb-4"></span>
                    <p className="text-gray-500">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
                    <div className="flex items-center justify-between mb-4">
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
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-purple-600"
                                    onClick={() => handleSort('username')}
                                >
                                    <div className="flex items-center gap-2">
                                        Usuario
                                        {getSortIcon('username')}
                                    </div>
                                </th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-purple-600"
                                    onClick={() => handleSort('email')}
                                >
                                    <div className="flex items-center gap-2">
                                        Email
                                        {getSortIcon('email')}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rol</th>
                                <th 
                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-purple-600"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center gap-2">
                                        Registro
                                        {getSortIcon('createdAt')}
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-purple-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-900">{user.username}</span>
                                                {user._id === currentUser?.id && (
                                                    <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                                                        Tú
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        {user.isAdmin ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                <FaUserShield className="w-3 h-3" />
                                                Admin
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                                <FaUser className="w-3 h-3" />
                                                Usuario
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(user.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setRoleUser(user)}
                                                disabled={user._id === currentUser?.id}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    user._id === currentUser?.id
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-purple-600 hover:bg-purple-100 hover:text-purple-700'
                                                }`}
                                                title={user._id === currentUser?.id ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                                            >
                                                <FaUserShield size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeletingUser(user)}
                                                disabled={user._id === currentUser?.id}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    user._id === currentUser?.id
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'text-red-500 hover:bg-red-100 hover:text-red-600'
                                                }`}
                                                title={user._id === currentUser?.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar usuario'}
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mensaje si no hay usuarios */}
                {users.length === 0 && (
                    <div className="text-center py-12">
                        <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
                        {searchTerm && (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    loadUsers()
                                }}
                                className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Limpiar búsqueda
                            </button>
                        )}
                    </div>
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Mostrando {((currentPage - 1) * usersPerPage) + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers} usuarios
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaChevronLeft className="w-4 h-4" />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                                        currentPage === i + 1
                                            ? 'bg-purple-600 text-white'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <FaChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            <RoleModal
                user={roleUser}
                isOpen={!!roleUser}
                onClose={() => setRoleUser(null)}
                onConfirm={handleRoleChange}
                loading={actionLoading}
            />

            <DeleteConfirmModal
                user={deletingUser}
                isOpen={!!deletingUser}
                onClose={() => setDeletingUser(null)}
                onConfirm={handleDeleteUser}
                loading={actionLoading}
            />
        </div>
    )
}

export default TableUsers