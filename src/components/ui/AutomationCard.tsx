'use client'

import { memo, useState } from 'react'
import { ChevronDown, ChevronUp, Check } from 'lucide-react'
import { formatHoursRange } from '@/lib/format'
import type { AutomationData } from '@/lib/types'

interface AutomationCardProps {
  automation: AutomationData
  isSelected: boolean
  onToggle: () => void
}

function AutomationCardComponent({ automation, isSelected, onToggle }: AutomationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hoursLabel = formatHoursRange(automation.savingsMin, automation.savingsMax)

  return (
    <div
      className={`
        card p-4 transition-all duration-300
        ${isSelected
          ? 'border-purple-500 bg-purple-600/5'
          : 'border-gray-800 hover:border-gray-700'
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          className={`
            mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all
            ${isSelected
              ? 'bg-purple-600 border-purple-600'
              : 'border-gray-600 hover:border-gray-500'
            }
          `}
          aria-pressed={isSelected}
          aria-label={isSelected ? `Odznacz ${automation.name}` : `Zaznacz ${automation.name}`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <button
              type="button"
              onClick={onToggle}
              className="text-left flex-1"
            >
              <h4
                className={`
                  font-medium transition-colors
                  ${isSelected ? 'text-white' : 'text-gray-200'}
                `}
              >
                {automation.name}
              </h4>
            </button>

            {/* Hours badge */}
            <span
              className={`
                tag text-xs flex-shrink-0
                ${isSelected
                  ? 'bg-purple-600/30 border-purple-500/40 text-purple-300'
                  : ''
                }
              `}
            >
              {hoursLabel}/tyg
            </span>
          </div>

          {/* Description toggle */}
          {automation.descriptionMarketing && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-gray-500 hover:text-gray-400 flex items-center gap-1 transition-colors"
              >
                {isExpanded ? (
                  <>
                    Ukryj szczegóły
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Pokaż szczegóły
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Expandable description */}
              <div
                className={`
                  overflow-hidden transition-all duration-300
                  ${isExpanded ? 'max-h-96 mt-3' : 'max-h-0'}
                `}
              >
                <p className="text-sm text-gray-400 leading-relaxed">
                  {automation.descriptionMarketing}
                </p>
                {automation.integrations && (
                  <p className="mt-2 text-xs text-gray-500">
                    <span className="font-mono text-purple-400/70">Integracje:</span>{' '}
                    {automation.integrations}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const AutomationCard = memo(AutomationCardComponent)
