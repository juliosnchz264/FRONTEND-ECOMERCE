import { useUser } from '../../Hooks/useUser'
import { Navigate, useLocation } from 'react-router'

const ProtectedRoute = ({ children }) => {
    const { userInfo, loading } = useUser()
    const location = useLocation() 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!userInfo || !userInfo.id) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute