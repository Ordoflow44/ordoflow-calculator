'use client'

import { useId, type InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function FormInput({
  label,
  error,
  hint,
  required,
  className = '',
  ...props
}: FormInputProps) {
  const id = useId()
  const inputId = props.id || id
  const errorId = `${inputId}-error`

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
        {required && <span className="text-purple-400 ml-1">*</span>}
      </label>

      <input
        id={inputId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-gray-900/50 border
          text-white placeholder-gray-500
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-purple-500/50
          ${error
            ? 'border-red-500/50 focus:border-red-500'
            : 'border-gray-700 hover:border-gray-600 focus:border-purple-500'
          }
          ${className}
        `}
        {...props}
      />

      {error && (
        <p id={errorId} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
    </div>
  )
}
