// src/Components/ui/SafeText.jsx
import { useMemo } from 'react'
import { useSanitize } from '../../Hooks/useSanitize'
import SafeHTML from './SafeHTML'

const SafeText = ({ 
    text, 
    as = 'span', 
    className = '', 
    allowHtml = false,
    truncate = false,
    maxLength = 0,
    lines = 0,
    ...props 
}) => {
    const { sanitizeText } = useSanitize()
    
    const safeText = useMemo(() => {
        if (!text || typeof text !== 'string') return ''
        
        let cleaned = sanitizeText(text)
        
        // Truncar por líneas
        if (lines > 0) {
            const linesArray = cleaned.split('\n')
            if (linesArray.length > lines) {
                cleaned = linesArray.slice(0, lines).join('\n') + '...'
            }
        }
        
        // Truncar por caracteres
        if (truncate && maxLength > 0 && cleaned.length > maxLength) {
            cleaned = cleaned.slice(0, maxLength) + '...'
        }
        
        return cleaned
    }, [text, sanitizeText, truncate, maxLength, lines])
    
    if (!safeText) return null
    
    if (allowHtml) {
        return (
            <SafeHTML 
                html={safeText} 
                className={className} 
                as={as}
                {...props} 
            />
        )
    }
    
    const Component = as
    const style = lines > 0 ? {
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    } : {}
    
    return (
        <Component className={className} style={style} {...props}>
            {safeText}
        </Component>
    )
}

export default SafeText