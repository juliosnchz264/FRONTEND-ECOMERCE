// src/Components/HeroCarousel/HeroCarousel.jsx
import { useState, useEffect, useCallback, useRef } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useProduct } from '../../Hooks/useProduct.js'

const images = [
    {
        src: '/carrousel/deporte-banner.webp',
        alt: 'Deportes',
        title: 'Deportes',
        description: 'Equipamiento deportivo de primera calidad',
        category: 'Deportes',
    },
    {
        src: '/carrousel/tecnologia-banner.webp',
        alt: 'Tecnología',
        title: 'Tecnología',
        description: 'Lo último en gadgets y electrónica',
        category: 'Electrónica',
    },
    {
        src: '/carrousel/ropa-banner.webp',
        alt: 'Ropa',
        title: 'Moda',
        description: 'Las últimas tendencias en moda',
        category: 'Ropa',
    },
]

const HeroCarousel = () => {
    const { filterByCategory } = useProduct()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loadedImages, setLoadedImages] = useState([])
    const [isTransitioning, setIsTransitioning] = useState(false)
    const intervalRef = useRef(null)

    useEffect(() => {
        images.forEach((image, index) => {
            const img = new Image()
            img.src = image.src
            img.onload = () => {
                setLoadedImages((prev) => [...prev, index])
            }
        })
    }, [])

    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            nextSlide()
        }, 5000)
    }, [])

    useEffect(() => {
        startAutoPlay()
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [startAutoPlay])

    const nextSlide = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning])

    const prevSlide = useCallback(() => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setTimeout(() => setIsTransitioning(false), 500)
    }, [isTransitioning])

    const goToSlide = (index) => {
        if (isTransitioning || index === currentIndex) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const handleViewMore = (category) => {
        filterByCategory(category)
        setTimeout(() => {
            document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
    }

    const handleMouseEnter = () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const handleMouseLeave = () => {
        startAutoPlay()
    }

    return (
        <div
            className="relative w-full aspect-[16/9] max-h-[500px] lg:max-h-[550px] xl:max-h-[600px] overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                className="relative w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                <div className="flex w-full h-full">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative w-full h-full flex-shrink-0"
                            style={{ width: '100%' }}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                                loading={index === 0 ? 'eager' : 'lazy'}
                                fetchPriority={index === 0 ? 'high' : 'auto'}
                                style={{
                                    opacity: loadedImages.includes(index) ? 1 : 0,
                                    transition: 'opacity 0.3s ease',
                                }}
                            />

                            <div className="absolute inset-0 bg-black/40" />

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                                <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
                                    {image.title}
                                </h2>
                                <p className="text-lg md:text-xl lg:text-2xl text-purple-100 max-w-2xl mb-8 animate-fade-in-up delay-200">
                                    {image.description}
                                </p>
                                
                                <button
                                    onClick={() => handleViewMore(image.category)}
                                    className="group relative inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white/20 backdrop-blur-sm hover:bg-purple-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in-up delay-300 border border-white/30 hover:border-purple-400"
                                >
                                    <span className="text-sm md:text-base">Ver más</span>
                                    <svg 
                                        className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 hover:scale-110"
                aria-label="Anterior"
            >
                <FiChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-300 hover:scale-110"
                aria-label="Siguiente"
            >
                <FiChevronRight className="w-6 h-6" />
            </button>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            currentIndex === index
                                ? 'w-8 h-2 bg-white'
                                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                        }`}
                        aria-label={`Ir a slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}

export default HeroCarousel