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
import { CategoryContextProvider } from './Context/CategoryContext'
import { CartContextProvider } from './Context/CartContext'
import { Toaster } from 'react-hot-toast'
import DetailProduct from './Pages/DetailProduct'
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import GuestRoute from './Components/GuestRoute/GuestRoute'
import AdminRoute from './Components/AdminRoute/AdminRoute'
import Checkout from './Pages/Checkout'
import PaymentSuccess from './Pages/PaymentSuccess'
import PaymentFailure from './Pages/PaymentFailure'
import PaymentPending from './Pages/PaymentPending'
import NotFound from './Pages/NotFound'
import ServerError from './Pages/ServerError'
import VerifyEmail from './Pages/VerifyEmail'
import VerifyEmailPending from './Pages/VerifyEmailPending'
import Contact from './Pages/Contact/Contact'
import Privacy from './Pages/Privacy/Privacy'
import Terms from './Pages/Terms/Terms'

function App() {
    return (
        <UserContextProvider>
            <ProductContextProvider>
                <CategoryContextProvider>
                    <CartContextProvider>
                        <Routes>
                            {/* 🚨 RUTAS CON FOOTER (Layout principal) */}
                            <Route element={<Layout />}>
                                {/* RUTAS PÚBLICAS */}
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/detailProduct/:id"
                                    element={<DetailProduct />}
                                />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/terms" element={<Terms />} />

                                {/* RUTAS DE INVITADOS */}
                                <Route
                                    path="/login"
                                    element={
                                        <GuestRoute>
                                            <Login />
                                        </GuestRoute>
                                    }
                                />
                                <Route
                                    path="/register"
                                    element={
                                        <GuestRoute>
                                            <Register />
                                        </GuestRoute>
                                    }
                                />

                                {/* RUTAS PROTEGIDAS */}
                                <Route
                                    path="/checkout"
                                    element={
                                        <ProtectedRoute>
                                            <Checkout />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute>
                                            <OrdersPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile/settings"
                                    element={
                                        <ProtectedRoute>
                                            <Settings />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* RESULTADOS DE PAGO */}
                                <Route
                                    path="/payment/success"
                                    element={
                                        <ProtectedRoute>
                                            <PaymentSuccess />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/payment/failure"
                                    element={
                                        <ProtectedRoute>
                                            <PaymentFailure />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/payment/pending"
                                    element={
                                        <ProtectedRoute>
                                            <PaymentPending />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>

                            {/* 🚨 ADMINISTRACIÓN - FUERA DEL LAYOUT PRINCIPAL (sin footer) */}
                            <Route
                                path="/admin/dashboard/*"
                                element={
                                    <AdminRoute>
                                        <AdminDashboard />
                                    </AdminRoute>
                                }
                            />

                            {/* 👇 RUTAS DE VERIFICACIÓN DE EMAIL - FUERA DEL LAYOUT PRINCIPAL */}
                            <Route
                                path="/verify-email"
                                element={<VerifyEmail />}
                            />
                            <Route
                                path="/verify-email-pending"
                                element={<VerifyEmailPending />}
                            />

                            {/* 👇 RUTAS DE ERROR - FUERA DEL LAYOUT PRINCIPAL */}
                            <Route path="/500" element={<ServerError />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </CartContextProvider>
                </CategoryContextProvider>
            </ProductContextProvider>
            <Toaster />
        </UserContextProvider>
    )
}

export default App
