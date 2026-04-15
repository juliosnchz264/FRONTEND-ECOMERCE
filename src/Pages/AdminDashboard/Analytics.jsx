// src/Pages/AdminDashboard/Analytics.jsx
import { useState, useEffect } from 'react'
import api from '../../services/api'
import {
    FiShoppingBag,
    FiUsers,
    FiDollarSign,
    FiTrendingUp,
    FiPackage,
    FiClock,
    FiCheckCircle,
    FiRefreshCw,
} from 'react-icons/fi'

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-0.5">{value}</p>
            {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
        </div>
    </div>
)

const BarChart = ({ data, valueKey, labelKey, color = 'bg-purple-500', formatValue }) => {
    if (!data || data.length === 0) {
        return <p className="text-sm text-gray-400 text-center py-6">Sin datos disponibles</p>
    }
    const max = Math.max(...data.map(d => d[valueKey]))
    return (
        <div className="space-y-3">
            {data.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0 truncate">
                        {item[labelKey]}
                    </span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${color} transition-all duration-500`}
                            style={{ width: max > 0 ? `${(item[valueKey] / max) * 100}%` : '0%' }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 w-16 text-right shrink-0">
                        {formatValue ? formatValue(item[valueKey]) : item[valueKey]}
                    </span>
                </div>
            ))}
        </div>
    )
}

const Analytics = () => {
    const [orderStats, setOrderStats] = useState(null)
    const [userStats, setUserStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(null)

    const fetchStats = async () => {
        setLoading(true)
        setError(null)
        try {
            const [ordersRes, usersRes] = await Promise.all([
                api.get('/orders/stats'),
                api.get('/users/stats'),
            ])
            setOrderStats(ordersRes.data.data)
            setUserStats(usersRes.data.data)
            setLastUpdated(new Date())
        } catch (err) {
            setError('No se pudieron cargar las estadísticas.')
            console.error('Error cargando analytics:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const fmt = (n) =>
        Number(n || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    const revenueChartData = (orderStats?.revenueByDay || []).slice(-14).map(d => ({
        label: d._id.slice(5),
        revenue: d.revenue,
        orders: d.orders,
    }))

    const topProductsData = (orderStats?.topProducts || []).map(p => ({
        label: p.name?.slice(0, 18) || 'Producto',
        sold: p.totalSold,
        revenue: p.revenue,
    }))

    const userRegData = (userStats?.registrationsByDay || []).slice(-14).map(d => ({
        label: d._id.slice(5),
        count: d.count,
    }))

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando analíticas...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <p className="text-red-500 dark:text-red-400">{error}</p>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm"
                >
                    <FiRefreshCw className="w-4 h-4" /> Reintentar
                </button>
            </div>
        )
    }

    const { totals } = orderStats
    const conversionRate = totals.totalOrders > 0
        ? ((totals.paidOrders / totals.totalOrders) * 100).toFixed(1)
        : '0.0'

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analíticas</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Resumen general de tu tienda
                        {lastUpdated && ` · Actualizado ${lastUpdated.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm shadow-sm"
                >
                    <FiRefreshCw className="w-4 h-4" /> Actualizar
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={FiDollarSign}
                    label="Ingresos totales"
                    value={`€${fmt(totals.totalRevenue)}`}
                    sub={`${totals.paidOrders} órdenes pagadas`}
                    color="bg-green-500"
                />
                <StatCard
                    icon={FiShoppingBag}
                    label="Total órdenes"
                    value={totals.totalOrders}
                    sub={`${totals.pendingOrders} pendientes`}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={FiUsers}
                    label="Usuarios registrados"
                    value={userStats?.totals?.total ?? '—'}
                    sub={`${userStats?.totals?.admins ?? 0} administradores`}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={FiTrendingUp}
                    label="Tasa de conversión"
                    value={`${conversionRate}%`}
                    sub="órdenes pagadas vs totales"
                    color="bg-orange-500"
                />
            </div>

            {/* Status breakdown + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order status */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4 text-purple-500" /> Estado de órdenes
                    </h2>
                    <div className="space-y-3">
                        {(orderStats?.statusCounts || []).map((s) => {
                            const colors = {
                                paid: 'bg-green-500',
                                pending: 'bg-yellow-400',
                                cancelled: 'bg-red-400',
                                failed: 'bg-red-600',
                            }
                            const labels = {
                                paid: 'Pagada',
                                pending: 'Pendiente',
                                cancelled: 'Cancelada',
                                failed: 'Fallida',
                            }
                            return (
                                <div key={s._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${colors[s._id] || 'bg-gray-400'}`} />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {labels[s._id] || s._id}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white">{s.count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
                        <FiPackage className="w-4 h-4 text-purple-500" /> Productos más vendidos
                    </h2>
                    <BarChart
                        data={topProductsData}
                        valueKey="sold"
                        labelKey="label"
                        color="bg-purple-500"
                        formatValue={(v) => `${v} ud.`}
                    />
                </div>
            </div>

            {/* Revenue last 14 days */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4 text-purple-500" /> Ingresos últimos 14 días
                </h2>
                <BarChart
                    data={revenueChartData}
                    valueKey="revenue"
                    labelKey="label"
                    color="bg-green-500"
                    formatValue={(v) => `€${fmt(v)}`}
                />
            </div>

            {/* Users last 14 days */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
                    <FiClock className="w-4 h-4 text-purple-500" /> Registros de usuarios últimos 14 días
                </h2>
                <BarChart
                    data={userRegData}
                    valueKey="count"
                    labelKey="label"
                    color="bg-blue-500"
                    formatValue={(v) => `${v} usuarios`}
                />
            </div>
        </div>
    )
}

export default Analytics
