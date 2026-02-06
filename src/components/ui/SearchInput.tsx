'use client'

import { memo } from 'react'
import { Search, X } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchInputComponent({ value, onChange, placeholder = 'Szukaj...' }: SearchInputProps) {
  return (
    <div className="relative max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-gray-500" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-12 pr-10 py-3
          bg-gray-900/50 border border-gray-800 rounded-xl
          text-white placeholder-gray-500
          focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50
          transition-all
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Wyczyść wyszukiwanie"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export const SearchInput = memo(SearchInputComponent)
