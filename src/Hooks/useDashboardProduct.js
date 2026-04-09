// src/Hooks/useDashboardProduct.js
import { useContext } from 'react'
import { DashboardProductContext } from '../Context/DashboardProductContext'

export const useDashboardProduct = () => {
    const context = useContext(DashboardProductContext)
    if (!context) {
        throw new Error('useDashboardProduct must be used within DashboardProductProvider')
    }
    return context
}