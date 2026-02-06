'use client'

import { memo, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'
import { calculateTotalSavings } from '@/lib/calculations'
import { formatCurrency } from '@/lib/format'
import type { AutomationData } from '@/lib/types'

interface SavingsPreviewProps {
  automations: AutomationData[]
}

function SavingsPreviewComponent({ automations }: SavingsPreviewProps) {
  const { state } = useCalculator()
  const { currency, hourlyRate, automationConfigs, selectedAutomationIds } = state

  // Get only selected automations
  const selectedAutomations = useMemo(
    () => automations.filter((a) => selectedAutomationIds.includes(a.id)),
    [automations, selectedAutomationIds]
  )

  // Calculate total savings
  const totalSavings = useMemo(() => {
    if (selectedAutomations.length === 0) return null
    return calculateTotalSavings(selectedAutomations, automationConfigs, hourlyRate, currency)
  }, [selectedAutomations, automationConfigs, hourlyRate, currency])

  if (!totalSavings) {
    return null
  }

  return (
    <div className="sticky bottom-0 z-10 mt-8">
      <div className="card-glass p-6 border-t-2 border-purple-500/50">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="font-display text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Podsumowanie oszczędności
          </h3>
        </div>

        {/* Savings grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Weekly */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Tygodniowo</p>
            <p className="font-display text-xl lg:text-2xl font-bold text-white">
              {formatCurrency(totalSavings.total.weekly, currency)}
            </p>
          </div>

          {/* Monthly */}
          <div className="text-center border-x border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Miesięcznie</p>
            <p className="font-display text-xl lg:text-2xl font-bold text-purple-400">
              {formatCurrency(totalSavings.total.monthly, currency)}
            </p>
          </div>

          {/* Yearly */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">Rocznie</p>
            <p className="font-display text-xl lg:text-2xl font-bold text-gradient">
              {formatCurrency(totalSavings.total.yearly, currency)}
            </p>
          </div>
        </div>

        {/* Selected count */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Na podstawie {selectedAutomations.length} wybranych automatyzacji
        </p>
      </div>
    </div>
  )
}

export const SavingsPreview = memo(SavingsPreviewComponent)
