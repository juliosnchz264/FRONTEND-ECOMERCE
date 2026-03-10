import { useUser } from '../../Hooks/useUser.js'
import { Navigate } from 'react-router'

const AdminRoute = ({ children }) => {
    const { userInfo, loading } = useUser()

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>
    }

    // 🔒 Seguridad estricta: Si no es admin, al Home
    if (!userInfo || !userInfo.isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}

export default AdminRoute