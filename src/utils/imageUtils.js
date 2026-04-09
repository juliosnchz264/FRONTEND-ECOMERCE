// src/utils/imageUtils.js

/** Inline SVG placeholder for broken images (no external dependency). */
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3Ctext x='50' y='54' font-family='sans-serif' font-size='12' fill='%239ca3af' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E"

/**
 * Optimize a Cloudinary image URL with the given dimensions.
 * @param {string} url - Original image URL
 * @param {number} [size=800] - Target width/height
 * @param {'limit'|'fill'} [crop='limit'] - Cloudinary crop mode
 * @returns {string}
 */
export const getOptimizedImage = (url, size = 800, crop = 'limit') => {
    // 👈 VALIDAR QUE url SEA STRING VÁLIDO
    if (!url || typeof url !== 'string') {
        return PLACEHOLDER_IMAGE
    }
    
    if (url.includes('cloudinary')) {
        return url.replace(
            '/upload/',
            `/upload/w_${size},h_${size},c_${crop},q_auto,f_auto/`,
        )
    }
    
    return url
}