// src/Components/ui/SafeHTML.jsx
import { useMemo } from 'react'
import DOMPurify from 'dompurify'

/**
 * Función para validar URLs de forma segura
 * @param {string} url - URL a validar
 * @returns {boolean} - true si la URL es segura
 */
const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false
    
    // Decodificar URL primero para detectar ataques codificados
    let decodedUrl = url
    let previousUrl = ''
    let maxIterations = 5
    
    while (decodedUrl !== previousUrl && maxIterations-- > 0) {
        previousUrl = decodedUrl
        try {
            decodedUrl = decodeURIComponent(decodedUrl)
        } catch {
            break
        }
    }
    
    // Lista de protocolos peligrosos
    const dangerousProtocols = [
        /^javascript:/i,
        /^data:/i,
        /^vbscript:/i,
        /^file:/i,
        /^about:/i,
        /^chrome:/i,
        /^webkit:/i,
        /^view-source:/i,
        /^jar:/i
    ]
    
    for (const protocol of dangerousProtocols) {
        if (protocol.test(decodedUrl)) {
            return false
        }
    }
    
    // Validar que sea URL HTTP/HTTPS válida
    try {
        const parsed = new URL(decodedUrl)
        return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
        return false
    }
}

/**
 * Procesa nodos de enlace para asegurar que las URLs sean seguras
 * @param {Node} node - Nodo del DOM a procesar
 */
const processLinks = (node) => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
        const href = node.getAttribute('href')
        if (!isValidUrl(href)) {
            node.setAttribute('href', '#')
            node.setAttribute('class', (node.getAttribute('class') || '') + ' text-red-500 line-through cursor-not-allowed')
            node.setAttribute('title', 'URL bloqueada por seguridad')
            node.setAttribute('onclick', 'return false;')
        }
        // Añadir atributos de seguridad para enlaces externos
        node.setAttribute('rel', 'noopener noreferrer')
        node.setAttribute('target', '_blank')
    }
    return node
}

/**
 * Componente seguro para renderizar HTML sanitizado
 * @param {Object} props
 * @param {string} props.html - HTML a renderizar
 * @param {string} props.className - Clases CSS
 * @param {string} props.as - Elemento HTML (div, span, p, etc.)
 * @param {Object} props.config - Configuración de DOMPurify
 */
const SafeHTML = ({ 
    html, 
    className = '', 
    as: Component = 'div',
    config = {},
    ...props 
}) => {
    // Sanitizar HTML con DOMPurify
    const sanitizedHtml = useMemo(() => {
        if (!html || typeof html !== 'string') return ''
        
        const defaultConfig = {
            ALLOWED_TAGS: [
                'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'li', 'ol', 
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'a'
            ],
            ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id'],
            FORBID_TAGS: [
                'script', 'style', 'iframe', 'object', 'embed', 
                'form', 'input', 'button', 'textarea', 'select'
            ],
            FORBID_ATTR: [
                'onclick', 'onload', 'onerror', 'onmouseover', 
                'onfocus', 'onblur', 'onchange', 'onsubmit'
            ],
            ALLOW_DATA_ATTR: false,
            USE_PROFILES: { html: true },
            // Hook para procesar nodos después de sanitizar
            AFTER_SANITIZE_DOM: (sanitizedNode) => {
                const traverseAndProcess = (node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processLinks(node)
                        node.childNodes.forEach(traverseAndProcess)
                    }
                }
                traverseAndProcess(sanitizedNode)
                return sanitizedNode
            }
        }
        
        const mergedConfig = { ...defaultConfig, ...config }
        
        try {
            return DOMPurify.sanitize(html, mergedConfig)
        } catch (error) {
            console.error('Error sanitizando HTML:', error)
            return ''
        }
    }, [html, config])

    if (!sanitizedHtml) return null

    // eslint-disable-next-line react/no-danger
    return <Component className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} {...props} />
}

export default SafeHTML