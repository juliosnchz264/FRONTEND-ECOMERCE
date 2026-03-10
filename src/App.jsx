import { Routes, Route } from 'react-router'
import Layout from './Layout/Layout'
import Home from './Pages/Home'
import Register from './Pages/Register'
import Login from './Pages/Login'
import OrdersPage from './Pages/OrdersPage'
import Profile from './Pages/Profile'
import Settings from './Pages/Settings' 
import { UserContextProvider } from './Context/UserContext'
import { ProductContextProvider } from './Context/ProductContext'
import { CartContextProvider } from './Context/CartContext'
import { Toaster } from 'react-hot-toast'
import DetailProduct from './Pages/DetailProduct'
import AdminDashboard from './Pages/AdminDashboard'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import GuestRoute from './Components/GuestRoute/GuestRoute'
import AdminRoute from './Components/AdminRoute/AdminRoute'
import Checkout from './Pages/Checkout'
import PaymentSuccess from './Pages/PaymentSuccess'
import PaymentFailure from './Pages/PaymentFailure'
import PaymentPending from './Pages/PaymentPending'

function App() {
    return (
        <UserContextProvider>
            <ProductContextProvider>
                <CartContextProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            {/* --- RUTAS PÚBLICAS --- */}
                            <Route path="/" element={<Home />} />
                            <Route path="/detailProduct/:id" element={<DetailProduct />} />
                            
                            {/* --- RUTAS DE INVITADOS (Solo si NO están logueados) --- */}
                            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

                            {/* --- RUTAS PROTEGIDAS (Requieren Login) --- */}
                            {/* Al mover Checkout aquí, el invitado será enviado al login al intentar comprar */}
                            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                            
                            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path="/profile/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                            
                            {/* --- RESULTADOS DE PAGO (También protegidos para asegurar que el user esté presente) --- */}
                            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
                            <Route path="/payment/failure" element={<ProtectedRoute><PaymentFailure /></ProtectedRoute>} />
                            <Route path="/payment/pending" element={<ProtectedRoute><PaymentPending /></ProtectedRoute>} />

                            {/* --- ADMINISTRACIÓN --- */}
                            <Route path="/admin/dashboard/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                        </Route>
                    </Routes>
                </CartContextProvider>
            </ProductContextProvider>
            <Toaster />
        </UserContextProvider>
    )
}

export default App