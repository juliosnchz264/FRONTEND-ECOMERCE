// src/Pages/AdminDashboard/UpdateProduct.jsx
import UpdateProductForm from '../../Components/AdminDashboard/UpdateProductForm/UpdateProductForm'
import { useParams, Link } from 'react-router'
import { useProduct } from '../../Hooks/useProduct.js'
import { useEffect } from 'react'
import { FiArrowLeft, FiPackage } from 'react-icons/fi'
import { motion } from 'framer-motion'

const UpdateProduct = () => {
    const { id } = useParams()
    const { getProductById, product, productLoading } = useProduct()

    useEffect(() => {
        getProductById(id)
    }, [id, getProductById])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link 
                        to="/admin/dashboard/products"
                        className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 transition-colors group"
                    >
                        <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Volver a productos</span>
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 rounded-2xl">
                            <FiPackage className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                Actualizar Producto
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Modifica la información del producto existente
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Formulario */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-950/50 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    {/* Header decorativo */}
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
                    
                    <div className="p-6 md:p-8">
                        {productLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-500 dark:text-gray-400">Cargando producto...</p>
                            </div>
                        ) : (
                            <UpdateProductForm product={product} />
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UpdateProduct