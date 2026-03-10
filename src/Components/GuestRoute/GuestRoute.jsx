import { useUser } from '../../Hooks/useUser'
import { Navigate } from 'react-router'

const GuestRoute = ({ children }) => {
    const { userInfo, loading } = useUser()

    if (loading) return null; // O un spinner minimalista

    // Si ya tiene sesión, no tiene sentido que vea el Login
    if (userInfo && userInfo.id) {
        return <Navigate to="/" replace />
    }

    return children
}

export default GuestRoute