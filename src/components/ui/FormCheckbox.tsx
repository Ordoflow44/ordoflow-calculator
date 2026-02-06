'use client'

import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'

interface FormCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export function FormCheckbox({
  label,
  error,
  checked,
  className = '',
  ...props
}: FormCheckboxProps) {
  const id = useId()
  const inputId = props.id || id

  return (
    <div className="space-y-1">
      <label
        htmlFor={inputId}
        className={`
          flex items-start gap-3 cursor-pointer group
          ${className}
        `}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            id={inputId}
            checked={checked}
            className="sr-only peer"
            aria-invalid={!!error}
            {...props}
          />
          <div
            className={`
              w-5 h-5 rounded-md border-2 transition-all duration-200
              flex items-center justify-center
              ${checked
                ? 'bg-purple-600 border-purple-500'
                : 'bg-gray-900/50 border-gray-600 group-hover:border-gray-500'
              }
              ${error ? 'border-red-500/50' : ''}
            `}
          >
            {checked && (
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        <span className="text-sm text-gray-300 leading-relaxed">
          {label}
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-400 ml-8" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
