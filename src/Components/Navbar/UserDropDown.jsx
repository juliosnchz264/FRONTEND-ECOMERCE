import { useUser } from '../../Hooks/useUser.js'
import { useNavigate, Link } from 'react-router'
import toast from 'react-hot-toast'

// 🚩 Definimos la base del servidor (quitando el /api)
const baseServerUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');

const UserDropDown = () => {
    const { userInfo, logout } = useUser()
    const navigate = useNavigate()

    const handleLogout = async () => {
    try {
        await logout();
        
        toast.success('Sesión cerrada correctamente');
            navigate('/', { replace: true });
    } catch (error) {
        console.error('Error al cerrar sesión', error);
        toast.error('Error al cerrar sesión');
    }
}

    if (!userInfo) return null

    // 🚩 Lógica para construir la URL del avatar
    const getAvatarSrc = () => {
        if (userInfo?.avatar) {
            return userInfo.avatar.startsWith('http') 
                ? userInfo.avatar 
                : `${baseServerUrl}${userInfo.avatar}`;
        }
        // Fallback a iniciales
        return `https://ui-avatars.com/api/?name=${userInfo?.username}&background=random`;
    };

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar border border-base-300"
            >
                <div className="w-10 rounded-full">
                    <img
                        src={getAvatarSrc()}
                        alt="avatar"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username}`;
                        }}
                    />
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow-2xl border border-base-200 z-[100]"
            >
                <li className="px-4 py-2 opacity-70 italic text-xs border-b border-base-200 mb-1">
                    Logueado como: <span className="font-bold">{userInfo?.username}</span>
                </li>

                <li>
                    <Link to="/profile" className="flex justify-between items-center py-2 active:bg-primary">
                        Mi Perfil
                        <span className="badge badge-sm badge-outline">Ver</span>
                    </Link>
                </li>

                {/* 🚩 NUEVO: BOTÓN DE MIS ÓRDENES */}
                <li>
                    <Link to="/orders" className="flex justify-between items-center py-2 active:bg-primary">
                        Mis Pedidos
                        <span className="badge badge-sm badge-ghost">Historial</span>
                    </Link>
                </li>

                <li>
                    <Link to="/profile/settings" className="flex justify-between items-center py-2 active:bg-primary">
                        Configuración
                    </Link>
                </li>

                <div className="divider my-1"></div>
                
                <li>
                    <button 
                        onClick={handleLogout} 
                        className="flex justify-between items-center text-error hover:bg-error/10 active:bg-error/20"
                    >
                        Cerrar sesión
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown