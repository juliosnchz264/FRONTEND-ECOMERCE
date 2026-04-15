// src/Components/SidebarFilters/SidebarFilters.jsx
import { useState, useEffect, useRef } from 'react'
import { useProduct } from '../../Hooks/useProduct'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown, FiChevronRight, FiRotateCcw } from 'react-icons/fi'
import { FaLayerGroup } from 'react-icons/fa'
import { BsSortDown, BsCurrencyEuro, BsBoxSeam } from 'react-icons/bs'
import api from '../../services/api'

// ── Opciones de ordenamiento ──────────────────────────────────────────────────
const SORT_OPTIONS = [
    { value: 'newest',     label: 'Más reciente' },
    { value: 'price_asc',  label: 'Precio: menor a mayor' },
    { value: 'price_desc', label: 'Precio: mayor a menor' },
    { value: 'name_asc',   label: 'Nombre A–Z' },
    { value: 'name_desc',  label: 'Nombre Z–A' },
]

// ── Animación de sección colapsable ──────────────────────────────────────────
const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen)
    const sectionRef = useRef(null)

    const handleToggle = () => {
        const willOpen = !open
        setOpen(willOpen)
        if (willOpen) {
            // Scroll to show the expanded content after animation starts
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }, 240)
        }
    }

    return (
        <div ref={sectionRef} className="border-t border-gray-100 dark:border-gray-700/60">
            <button
                onClick={handleToggle}
                className="flex items-center justify-between w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {title}
                    </span>
                </div>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <FiChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-1">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ── Componente principal ──────────────────────────────────────────────────────
const SidebarFilters = ({ onOpenChange, isOpen: externalIsOpen, onFilter }) => {
    const {
        selectedCategory,
        selectedSubcategory,
        categories: dbCategories,
        selectedSort,
        selectedMinPrice,
        selectedMaxPrice,
        selectedInStock,
        setSort,
        setPriceRange,
        setInStock,
        resetFilters,
    } = useProduct()

    const [internalIsOpen, setInternalIsOpen] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState(null)
    const [subcategories, setSubcategories] = useState({})
    const [loadingSubcategories, setLoadingSubcategories] = useState({})

    // Ref to track the optimistic inStock value so rapid clicks use the latest
    // intended value instead of the stale context value before re-render
    const pendingInStockRef = useRef(selectedInStock)
    pendingInStockRef.current = selectedInStock

    // Precio local con buffer (se aplica al hacer click en "Aplicar")
    const [localMin, setLocalMin] = useState(selectedMinPrice)
    const [localMax, setLocalMax] = useState(selectedMaxPrice)

    // Sincronizar inputs locales si el contexto cambia externamente (ej: limpiar filtros)
    useEffect(() => { setLocalMin(selectedMinPrice) }, [selectedMinPrice])
    useEffect(() => { setLocalMax(selectedMaxPrice) }, [selectedMaxPrice])

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen

    const toggleSidebar = () => {
        if (onOpenChange) onOpenChange(!isOpen)
        else setInternalIsOpen(!internalIsOpen)
    }

    // ── Subcategorías lazy ────────────────────────────────────────────────────
    const loadSubcategories = async (categoryId) => {
        if (!categoryId || subcategories[categoryId]) return
        try {
            setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: true }))
            const response = await api.get(`/subcategories/category/${categoryId}`)
            setSubcategories((prev) => ({ ...prev, [categoryId]: response.data }))
        } catch (error) {
            console.error('Error cargando subcategorías:', error)
        } finally {
            setLoadingSubcategories((prev) => ({ ...prev, [categoryId]: false }))
        }
    }

    // ── Handlers de categoría ─────────────────────────────────────────────────
    const handleCategoryClick = (cat) => {
        if (cat === 'todos' || cat === 'Todos') {
            onFilter?.('Todos', null)
            setExpandedCategory(null)
            toggleSidebar()
            return
        }
        if (expandedCategory === cat._id) {
            setExpandedCategory(null)
        } else {
            setExpandedCategory(cat._id)
            loadSubcategories(cat._id)
        }
    }

    const handleMainCategoryClick = (cat) => {
        onFilter?.(cat.name, null)
        toggleSidebar()
    }

    const handleSubcategoryClick = (subcat) => {
        let categoryName = null
        if (subcat.category?.name) {
            categoryName = subcat.category.name
        } else {
            const parent = dbCategories.find((c) => c._id === subcat.category)
            if (parent) categoryName = parent.name
        }
        if (categoryName) onFilter?.(categoryName, subcat.name)
        toggleSidebar()
    }

    // ── Precio ────────────────────────────────────────────────────────────────
    const handleApplyPrice = () => {
        const min = localMin !== '' ? Number(localMin) : ''
        const max = localMax !== '' ? Number(localMax) : ''
        if (max !== '' && min !== '' && Number(min) > Number(max)) return
        setPriceRange(min, max)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleClearPrice = () => {
        setLocalMin('')
        setLocalMax('')
        setPriceRange('', '')
    }

    // ── Estado de filtros activos ─────────────────────────────────────────────
    const hasAdvancedFilters =
        selectedSort !== 'newest' || selectedMinPrice !== '' || selectedMaxPrice !== '' || selectedInStock
    const hasCategoryFilter = selectedCategory !== 'Todos'
    const hasAnyFilter = hasAdvancedFilters || hasCategoryFilter

    const priceInputClass =
        'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-600 focus:border-transparent transition'

    const catButtonActive = 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/40'
    const catButtonIdle   = 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400'

    return (
        <>
            {/* ── Botón flotante mobile ─────────────────────────────────────── */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-violet-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                aria-label="Abrir filtros"
            >
                <FiFilter className="h-6 w-6" />
                {hasAnyFilter && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {/* ── Overlay mobile ────────────────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* ── Sidebar ───────────────────────────────────────────────────── */}
            <aside
                className={`
                    fixed lg:sticky top-0 left-0
                    w-80 h-screen
                    bg-white dark:bg-gray-800
                    shadow-2xl dark:shadow-gray-950/50
                    transition-transform duration-300 ease-in-out
                    z-[100] lg:z-auto
                    flex flex-col
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                {/* ── Header ────────────────────────────────────────────────── */}
                <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl">
                            <FaLayerGroup className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-base font-bold bg-gradient-to-r from-purple-600 to-violet-600 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent">
                            Filtros
                        </h2>
                        {hasAnyFilter && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
                                Activos
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {hasAnyFilter && (
                            <button
                                onClick={() => { resetFilters(); onFilter?.('Todos', null) }}
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                title="Limpiar todos los filtros"
                            >
                                <FiRotateCcw className="w-3 h-3" />
                                Limpiar
                            </button>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                        >
                            <FiX className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* ── Cuerpo scrollable ──────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── Categorías ──────────────────────────────────────────── */}
                    <div className="p-3 space-y-0.5">
                        {/* Todos */}
                        <button
                            onClick={() => handleCategoryClick('todos')}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                                selectedCategory === 'Todos' && !selectedSubcategory
                                    ? catButtonActive
                                    : catButtonIdle
                            }`}
                        >
                            Todos los productos
                        </button>

                        {/* Lista de categorías */}
                        {dbCategories?.map((cat) => (
                            <div key={cat._id}>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleMainCategoryClick(cat)}
                                        className={`flex-1 text-left px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                                            selectedCategory === cat.name && !selectedSubcategory
                                                ? catButtonActive
                                                : catButtonIdle
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                    <button
                                        onClick={() => handleCategoryClick(cat)}
                                        className={`p-2.5 rounded-xl transition-all ${
                                            expandedCategory === cat._id
                                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-500'
                                        }`}
                                    >
                                        <motion.span
                                            animate={{ rotate: expandedCategory === cat._id ? 90 : 0 }}
                                            transition={{ duration: 0.18 }}
                                            className="block"
                                        >
                                            <FiChevronRight className="h-3.5 w-3.5" />
                                        </motion.span>
                                    </button>
                                </div>

                                {/* Subcategorías */}
                                <AnimatePresence initial={false}>
                                    {expandedCategory === cat._id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                            className="overflow-hidden ml-3 pl-3 border-l-2 border-purple-200 dark:border-purple-800 mt-1"
                                        >
                                            {loadingSubcategories[cat._id] ? (
                                                <div className="py-2 px-2 text-xs text-purple-500 dark:text-purple-400 flex items-center gap-2">
                                                    <span className="loading loading-spinner loading-xs" />
                                                    Cargando...
                                                </div>
                                            ) : (
                                                subcategories[cat._id]?.map((subcat) => (
                                                    <button
                                                        key={subcat._id}
                                                        onClick={() => handleSubcategoryClick(subcat)}
                                                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all mb-0.5 ${
                                                            selectedSubcategory === subcat._id
                                                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold border-l-2 border-purple-500'
                                                                : 'text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600'
                                                        }`}
                                                    >
                                                        {subcat.name}
                                                    </button>
                                                ))
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* ── Ordenar por ───────────────────────────────────────── */}
                    <Section title="Ordenar por" icon={BsSortDown} defaultOpen>
                        <div className="space-y-1">
                            {SORT_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setSort(opt.value)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${
                                        selectedSort === opt.value
                                            ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/40'
                                    }`}
                                >
                                    <span>{opt.label}</span>
                                    {selectedSort === opt.value && (
                                        <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* ── Rango de precio ───────────────────────────────────── */}
                    <Section
                        title="Rango de precio"
                        icon={BsCurrencyEuro}
                        defaultOpen={selectedMinPrice !== '' || selectedMaxPrice !== ''}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Mínimo
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={localMin}
                                            onChange={(e) => setLocalMin(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                                            placeholder="0"
                                            className={`${priceInputClass} pl-6`}
                                        />
                                    </div>
                                </div>
                                <span className="text-gray-400 dark:text-gray-600 mt-5">—</span>
                                <div className="flex-1">
                                    <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Máximo
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={localMax}
                                            onChange={(e) => setLocalMax(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                                            placeholder="∞"
                                            className={`${priceInputClass} pl-6`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Validación cruzada */}
                            {localMin !== '' && localMax !== '' && Number(localMin) > Number(localMax) && (
                                <p className="text-xs text-red-500 dark:text-red-400">
                                    El mínimo no puede ser mayor que el máximo.
                                </p>
                            )}

                            <div className="flex gap-2">
                                <button
                                    onClick={handleApplyPrice}
                                    disabled={localMin !== '' && localMax !== '' && Number(localMin) > Number(localMax)}
                                    className="flex-1 py-2 text-xs font-semibold bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl hover:from-purple-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                                >
                                    Aplicar
                                </button>
                                {(selectedMinPrice !== '' || selectedMaxPrice !== '') && (
                                    <button
                                        onClick={handleClearPrice}
                                        className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 bg-gray-100 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <FiX className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            {/* Preview del rango activo */}
                            {(selectedMinPrice !== '' || selectedMaxPrice !== '') && (
                                <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                                    Activo:{' '}
                                    {selectedMinPrice !== '' ? `${selectedMinPrice}€` : '0€'}{' '}
                                    —{' '}
                                    {selectedMaxPrice !== '' ? `${selectedMaxPrice}€` : '∞'}
                                </p>
                            )}
                        </div>
                    </Section>

                    {/* ── Disponibilidad ────────────────────────────────────── */}
                    <Section title="Disponibilidad" icon={BsBoxSeam} defaultOpen={selectedInStock}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Solo productos en stock
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    Oculta los artículos agotados
                                </p>
                            </div>
                            <button
                                role="switch"
                                aria-checked={selectedInStock}
                                onClick={() => {
                                    const next = !pendingInStockRef.current
                                    pendingInStockRef.current = next
                                    setInStock(next)
                                }}
                                className="relative flex-shrink-0 ml-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
                                style={{ width: '40px', height: '22px' }}
                            >
                                <div
                                    className={`w-full h-full rounded-full transition-colors duration-200 ${
                                        selectedInStock
                                            ? 'bg-purple-600 dark:bg-purple-500'
                                            : 'bg-gray-200 dark:bg-gray-600'
                                    }`}
                                />
                                <motion.div
                                    animate={{ x: selectedInStock ? 20 : 2 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"
                                />
                            </button>
                        </div>
                    </Section>
                </div>
            </aside>
        </>
    )
}

export default SidebarFilters
