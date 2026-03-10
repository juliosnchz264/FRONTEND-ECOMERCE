import { Link } from 'react-router'
import AuthButtons from './AuthButtons'
import Cart from './Cart'
import UserDropDown from './UserDropDown'
import { useUser } from '../../Hooks/useUser.js'

const Navbar = () => {
    // Extraemos isAuthenticated para una lectura más clara
    const { loading, userInfo, isAuthenticated } = useUser()

    return (
        <header>
            {/* 1. Solo mostramos botones de Login/Register si NO está autenticado y NO está cargando */}
            {!loading && !isAuthenticated() && <AuthButtons />}

            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="navbar-start">
                    <Link className="btn btn-ghost text-xl" to="/">
                        E-comerce
                    </Link>
                </div>
                
                <div className="navbar-end gap-3">
                    {/* 2. Dashboard solo para admins */}
                    {userInfo?.isAdmin && (
                        <Link
                            to="/admin/dashboard/products"
                            className="btn btn-primary"
                        >
                            Dashboard
                        </Link>
                    )}
                    
                    <Cart />

                    {/* 3. Menú de usuario solo si hay sesión */}
                    {!loading && isAuthenticated() && <UserDropDown />}
                </div>
            </nav>
        </header>
    )
}

export default Navbar