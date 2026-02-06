'use client'

import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Folder,
  Video,
  Mail,
  FileText,
  Headphones,
  Target,
  ShoppingCart,
  BarChart3,
  Users,
  FolderOpen,
  TrendingUp,
  Wallet,
  Palette,
  Terminal,
  Check,
} from 'lucide-react'
import { CATEGORY_ICONS } from '@/lib/constants'
import type { CategoryData } from '@/lib/types'

// Map of icon names to components
const ICON_MAP: Record<string, LucideIcon> = {
  Folder,
  Video,
  Mail,
  FileText,
  Headphones,
  Target,
  ShoppingCart,
  BarChart3,
  Users,
  FolderOpen,
  TrendingUp,
  Wallet,
  Palette,
  Terminal,
}

interface CategoryCardProps {
  category: CategoryData
  isSelected: boolean
  onToggle: () => void
}

function CategoryCardComponent({ category, isSelected, onToggle }: CategoryCardProps) {
  // Pobierz ikonę na podstawie slug kategorii
  const iconName = category.icon || CATEGORY_ICONS[category.slug] || 'Folder'
  const IconComponent = ICON_MAP[iconName] || Folder

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`
        card hover-card w-full text-left p-6 transition-all duration-300 relative
        ${isSelected
          ? 'border-purple-500 bg-purple-600/10 glow-purple'
          : 'border-gray-800 hover:border-gray-700'
        }
      `}
      aria-pressed={isSelected}
    >
      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
          ${isSelected
            ? 'bg-purple-600/20 text-purple-400'
            : 'bg-gray-800 text-gray-400'
          }
        `}
      >
        <IconComponent className="w-6 h-6" />
      </div>

      {/* Name */}
      <h3
        className={`
          font-display font-semibold mb-2 transition-colors
          ${isSelected ? 'text-white' : 'text-gray-200'}
        `}
      >
        {category.name}
      </h3>

      {/* Automations count badge */}
      {category.automationsCount !== undefined && category.automationsCount > 0 && (
        <span
          className={`
            tag text-xs
            ${isSelected
              ? 'bg-purple-600/30 border-purple-500/40 text-purple-300'
              : ''
            }
          `}
        >
          {category.automationsCount} automatyzacji
        </span>
      )}

      {/* Selection indicator */}
      <div
        className={`
          absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
          ${isSelected
            ? 'bg-purple-600 border-purple-600'
            : 'border-gray-600'
          }
        `}
      >
        {isSelected && (
          <Check className="w-4 h-4 text-white" />
        )}
      </div>
    </button>
  )
}

export const CategoryCard = memo(CategoryCardComponent)
