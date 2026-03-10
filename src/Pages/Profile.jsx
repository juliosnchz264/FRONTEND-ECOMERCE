import { useUser } from '../Hooks/useUser.js'
import { Link } from 'react-router'

const Profile = () => {
    
    const { userInfo } = useUser()
    // 🚩 Limpiamos la URL para que apunte a la raíz del servidor, no a /api
    const baseServerUrl = import.meta.env.VITE_BACKEND_URL.replace('/api', '');

    const avatarSrc = userInfo?.avatar 
        ? `${baseServerUrl}${userInfo.avatar}` 
        : `https://ui-avatars.com/api/?name=${userInfo?.username || 'User'}`;
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-base-content">Mi Perfil</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tarjeta de Usuario */}
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <figure className="px-10 pt-10">
                        <div className="avatar">
                            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img 
                                    src={avatarSrc} 
                                    alt="Avatar" 
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${userInfo?.username}`; }}
                                />                               
                            </div>
                        </div>
                    </figure>
                    <div className="card-body items-center text-center">
                        <h2 className="card-title">{userInfo?.username}</h2>
                        <div className="badge badge-primary">{userInfo?.isAdmin ? 'Administrador' : 'Cliente'}</div>
                        <p className="text-sm opacity-60">{userInfo?.email}</p>
                    </div>
                </div>

                {/* Información de la cuenta */}
                <div className="md:col-span-2 card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <h3 className="text-lg font-bold mb-4">Detalles de la Cuenta</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium text-base-content/70">Nombre de usuario:</span>
                                <span>{userInfo?.username}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium text-base-content/70">Correo electrónico:</span>
                                <span>{userInfo?.email}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-medium text-base-content/70">Estado de cuenta:</span>
                                <span className="text-success font-bold text-xs uppercase">Activa</span>
                            </div>
                        </div>
                        <div className="card-actions justify-end mt-6">
                            <Link to="/profile/settings" className="btn btn-outline btn-sm">
                                Editar Datos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile