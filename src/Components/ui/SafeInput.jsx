// src/Components/ui/SafeInput.jsx
import { useState, useCallback, useEffect, useRef } from 'react'
import { useSanitize } from '../../Hooks/useSanitize'
import useRateLimit from '../../Hooks/useRateLimit'

const SafeInput = ({
    type = 'text',
    value,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    className = '',
    maxLength = 500,
    required = false,
    disabled = false,
    min,
    max,
    step,
    pattern,
    name,
    id,
    autoComplete = 'off',
    ...props
}) => {
    const { sanitizeText, sanitizeNumber, sanitizeEmail, sanitizeUsername, sanitizePrice, CONSTANTS } = useSanitize()
    const { checkLimit, getRemainingCalls, getTimeUntilReset } = useRateLimit(5, 2000)
    
    const [localValue, setLocalValue] = useState(value || '')
    const [error, setError] = useState('')
    const [touched, setTouched] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef(null)
    
    // Actualizar valor local cuando cambia el prop value
    useEffect(() => {
        if (value !== localValue && !disabled) {
            setLocalValue(value || '')
        }
    }, [value, disabled])

    const validateValue = useCallback((rawValue, sanitized) => {
        let newError = ''
        
        // Validaciones requeridas
        if (required && !sanitized && sanitized !== 0) {
            newError = 'Campo requerido'
        }
        
        // Validaciones por tipo
        if (sanitized && !newError) {
            switch (type) {
                case 'email':
                    if (!sanitized.includes('@')) {
                        newError = 'Email debe contener @'
                    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(sanitized)) {
                        newError = 'Formato de email inválido'
                    }
                    break
                    
                case 'username':
                    if (!/^[a-zA-Z0-9_.-]+$/.test(sanitized)) {
                        newError = 'Solo letras, números, guiones bajos y puntos'
                    }
                    break
                    
                case 'number':
                case 'price':
                    const numValue = parseFloat(sanitized)
                    if (isNaN(numValue)) {
                        newError = 'Debe ser un número válido'
                    } else if (min !== undefined && numValue < min) {
                        newError = `Valor mínimo: ${min}`
                    } else if (max !== undefined && numValue > max) {
                        newError = `Valor máximo: ${max}`
                    }
                    break
                    
                default:
                    if (pattern && !new RegExp(pattern).test(sanitized)) {
                        newError = 'Formato inválido'
                    }
            }
        }
        
        // Validación de longitud
        if (sanitized && typeof sanitized === 'string' && sanitized.length > maxLength) {
            newError = `Máximo ${maxLength} caracteres`
        }
        
        return newError
    }, [type, required, min, max, pattern, maxLength])

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
        let sanitized = rawValue
        
        // Sanitizar según el tipo
        switch (type) {
            case 'email':
                sanitized = sanitizeEmail(rawValue)
                break
                
            case 'username':
                sanitized = sanitizeUsername(rawValue)
                break
                
            case 'number':
                sanitized = String(sanitizeNumber(rawValue))
                break
                
            case 'price':
                if (rawValue === '') {
                    sanitized = ''
                } else {
                    const price = sanitizePrice(rawValue)
                    sanitized = price.toString()
                }
                break
                
            default:
                sanitized = sanitizeText(rawValue)
        }
        
        // Limitar longitud
        if (typeof sanitized === 'string' && sanitized.length > maxLength) {
            sanitized = sanitized.slice(0, maxLength)
        }
        
        // Validar
        const newError = validateValue(rawValue, sanitized)
        setError(newError)
        
        setLocalValue(sanitized)
        
        if (onChange) {
            onChange({ ...e, target: { ...e.target, value: sanitized, name, id } })
        }
        
        setIsLoading(false)
    }, [type, sanitizeText, sanitizeEmail, sanitizeUsername, sanitizeNumber, sanitizePrice, maxLength, onChange, disabled, checkLimit, getTimeUntilReset, validateValue, name, id])

    const handleBlur = useCallback((e) => {
        setTouched(true)
        
        let finalValue = localValue
        
        // Validaciones adicionales en blur
        if (type === 'price' && finalValue && !isNaN(parseFloat(finalValue))) {
            const numValue = parseFloat(finalValue)
            if (numValue < CONSTANTS.MIN_PRICE) {
                finalValue = CONSTANTS.MIN_PRICE.toString()
                setLocalValue(finalValue)
                if (onChange) {
                    onChange({ ...e, target: { ...e.target, value: finalValue, name, id } })
                }
            } else if (numValue > CONSTANTS.MAX_PRICE) {
                finalValue = CONSTANTS.MAX_PRICE.toString()
                setLocalValue(finalValue)
                if (onChange) {
                    onChange({ ...e, target: { ...e.target, value: finalValue, name, id } })
                }
            }
        }
        
        const newError = validateValue(finalValue, finalValue)
        setError(newError)
        
        if (onBlur) {
            onBlur(e)
        }
    }, [localValue, type, onChange, onBlur, validateValue, CONSTANTS, name, id])

    const handleFocus = useCallback((e) => {
        setTouched(false)
        if (onFocus) {
            onFocus(e)
        }
    }, [onFocus])

    // Determinar el tipo de input para el DOM
    const getInputType = () => {
        if (type === 'price') return 'number'
        if (type === 'username') return 'text'
        return type
    }

    // Determinar los atributos específicos para número/precio
    const getNumberProps = () => {
        if (type === 'number' || type === 'price') {
            return {
                min: min !== undefined ? min : (type === 'price' ? CONSTANTS.MIN_PRICE : undefined),
                max: max !== undefined ? max : (type === 'price' ? CONSTANTS.MAX_PRICE : undefined),
                step: step !== undefined ? step : (type === 'price' ? '0.01' : '1')
            }
        }
        return {}
    }

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                type={getInputType()}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={placeholder}
                className={`
                    w-full px-3 py-2 border rounded-lg 
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    ${error && touched ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
                    ${className}
                `}
                maxLength={type !== 'number' && type !== 'price' ? maxLength : undefined}
                required={required}
                disabled={disabled || isLoading}
                autoComplete={autoComplete}
                name={name}
                id={id}
                {...getNumberProps()}
                {...props}
            />
            
            {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            
            {error && touched && (
                <p className="mt-1 text-xs text-red-500 animate-pulse">
                    {error}
                </p>
            )}
            
            {type === 'text' && maxLength && (
                <p className="mt-1 text-xs text-right text-gray-400">
                    {(localValue?.length || 0)}/{maxLength}
                </p>
            )}
        </div>
    )
}

export default SafeInput