// src/Components/ui/SafeTextarea.jsx
import { useState, useCallback, useEffect } from 'react'
import { useSanitize } from '../../Hooks/useSanitize'
import useRateLimit from '../../Hooks/useRateLimit'

const SafeTextarea = ({
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    className = '',
    rows = 4,
    maxLength = 1000,
    required = false,
    disabled = false,
    name,
    id,
    autoComplete = 'off',
    showCharCount = true,
    ...props
}) => {
    const { sanitizeText } = useSanitize()
    const { checkLimit, getTimeUntilReset } = useRateLimit(5, 2000)
    
    const [localValue, setLocalValue] = useState(value || '')
    const [charCount, setCharCount] = useState((value || '').length)
    const [error, setError] = useState('')
    const [touched, setTouched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    // Actualizar valor local cuando cambia el prop value
    useEffect(() => {
        if (value !== localValue && !disabled) {
            setLocalValue(value || '')
            setCharCount((value || '').length)
        }
    }, [value, disabled])

    const validateValue = useCallback((rawValue, sanitized) => {
        let newError = ''
        
        if (required && !sanitized) {
            newError = 'Campo requerido'
        }
        
        if (sanitized && sanitized.length > maxLength) {
            newError = `Máximo ${maxLength} caracteres`
        }
        
        return newError
    }, [required, maxLength])

    const handleChange = useCallback((e) => {
        if (disabled) return
        
        // Rate limiting
        if (!checkLimit()) {
            const timeUntilReset = getTimeUntilReset()
            setError(`Demasiados intentos. Espera ${Math.ceil(timeUntilReset / 1000)} segundos.`)
            return
        }
        
        setIsLoading(true)
        
        let rawValue = e.target.value
        let sanitized = sanitizeText(rawValue)
        
        // Limitar longitud
        if (sanitized.length > maxLength) {
            sanitized = sanitized.slice(0, maxLength)
            setError(`Máximo ${maxLength} caracteres`)
        } else {
            const newError = validateValue(rawValue, sanitized)
            setError(newError)
        }
        
        setLocalValue(sanitized)
        setCharCount(sanitized.length)
        
        if (onChange) {
            onChange({ ...e, target: { ...e.target, value: sanitized, name, id } })
        }
        
        setIsLoading(false)
    }, [sanitizeText, maxLength, onChange, disabled, checkLimit, getTimeUntilReset, validateValue, name, id])

    const handleBlur = useCallback((e) => {
        setTouched(true)
        
        const newError = validateValue(localValue, localValue)
        setError(newError)
        
        if (onBlur) {
            onBlur(e)
        }
    }, [localValue, onBlur, validateValue])

    const handleFocus = useCallback((e) => {
        setTouched(false)
        if (onFocus) {
            onFocus(e)
        }
    }, [onFocus])

    const getCharCountColor = () => {
        const percentage = (charCount / maxLength) * 100
        if (percentage >= 90) return 'text-red-500'
        if (percentage >= 70) return 'text-orange-500'
        return 'text-gray-400'
    }

    return (
        <div className="w-full relative">
            <textarea
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                rows={rows}
                className={`
                    w-full px-3 py-2 border rounded-lg 
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 
                    resize-y min-h-[80px]
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${error && touched ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
                    ${className}
                `}
                maxLength={maxLength}
                required={required}
                disabled={disabled || isLoading}
                autoComplete={autoComplete}
                name={name}
                id={id}
                {...props}
            />
            
            {isLoading && (
                <div className="absolute right-3 top-3">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            
            <div className="flex justify-between mt-1">
                {error && touched && (
                    <p className="text-xs text-red-500 animate-pulse">
                        {error}
                    </p>
                )}
                {showCharCount && (
                    <p className={`text-xs ml-auto ${getCharCountColor()}`}>
                        {charCount}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    )
}

export default SafeTextarea