import { Routes, Route } from 'react-router'
import TableProductDashboard from '../../Components/AdminDashboard/TableProductDashboard/TableProductDashboard'
import DashboardLayout from '../../Layout/DashboardLayout'
import CreateProduct from './CreateProduct'
import UpdateProduct from './UpdateProducts'
import Categories from './Categories'
import Subcategories from './Subcategories'
import TableUsers from '../../Components/AdminDashboard/TableUsers/TableUsers'

const AdminDashboard = () => {
    return (
        <section>
            <Routes>
                <Route path="/" element={<DashboardLayout />}>
                    {/* Rutas de productos */}
                    <Route index element={<TableProductDashboard />} />
                    <Route path="products" element={<TableProductDashboard />} />
                    <Route path="products/createProduct" element={<CreateProduct />} />
                    <Route path="products/updateProduct/:id" element={<UpdateProduct />} />
                    
                    {/* NUEVAS RUTAS: Categorías y Subcategorías */}
                    <Route path="categories" element={<Categories />} />
                    <Route path="subcategories" element={<Subcategories />} />
                    <Route path="users" element={<TableUsers />} />
                </Route>
            </Routes>
        </section>
    )
}

export default AdminDashboard