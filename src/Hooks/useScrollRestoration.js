// src/Hooks/useScrollRestoration.js
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export const useScrollRestoration = () => {
  const location = useLocation()
  const scrollPositions = useRef(new Map())
  const isScrolling = useRef(false)

  // Guardar posición antes de navegar
  useEffect(() => {
    const handleBeforeUnload = () => {
      scrollPositions.current.set(location.key, window.scrollY)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [location])

  // Restaurar posición después de navegar
  useEffect(() => {
    const savedPosition = scrollPositions.current.get(location.key)
    
    if (savedPosition && !isScrolling.current) {
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'instant'
        })
        scrollPositions.current.delete(location.key)
      }, 100)
    } else if (!isScrolling.current) {
      window.scrollTo(0, 0)
    }
    
    isScrolling.current = false
  }, [location])

  // Función para navegar manteniendo scroll
  const navigateWithScroll = useCallback((navigate, to, options = {}) => {
    const currentScroll = window.scrollY
    scrollPositions.current.set(location.key, currentScroll)
    isScrolling.current = true
    navigate(to, options)
  }, [location])

  return { navigateWithScroll }
}