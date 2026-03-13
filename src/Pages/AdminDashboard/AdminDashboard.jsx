import { Routes, Route } from 'react-router'
import TableProductDashboard from '../../Components/AdminDashboard/TableProductDashboard/TableProductDashboard'
import DashboardLayout from '../../Layout/DashboardLayout'
import CreateProduct from './CreateProduct'
import UpdateProduct from './UpdateProducts'
import Categories from './Categories' // <-- Importar
import Subcategories from './Subcategories' // <-- Importar

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
                </Route>
            </Routes>
        </section>
    )
}

export default AdminDashboard