'use client'

import { useMemo } from 'react'
import { Settings2 } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'
import { CurrencySelector } from '@/components/ui/CurrencySelector'
import { AutomationConfigCard } from '@/components/ui/AutomationConfigCard'
import { SavingsPreview } from '@/components/ui/SavingsPreview'
import { WizardNavigation } from './WizardNavigation'
import { StepSkeleton } from './StepSkeleton'
import type { AutomationData } from '@/lib/types'

export function StepConfiguration() {
  const { state } = useCalculator()
  const { selectedAutomationIds, automationsCache, selectedCategoryIds } = state

  // Get all selected automations from cache
  const selectedAutomations = useMemo<AutomationData[]>(() => {
    const automations: AutomationData[] = []

    for (const categoryId of selectedCategoryIds) {
      const categoryAutomations = automationsCache[categoryId] || []
      for (const automation of categoryAutomations) {
        if (selectedAutomationIds.includes(automation.id)) {
          automations.push(automation)
        }
      }
    }

    return automations
  }, [selectedAutomationIds, automationsCache, selectedCategoryIds])

  // Show skeleton if no automations loaded yet
  if (selectedAutomations.length === 0) {
    return <StepSkeleton variant="configuration" />
  }

  // Group automations by category for display
  const automationsByCategory = useMemo(() => {
    const grouped: Record<string, AutomationData[]> = {}

    for (const automation of selectedAutomations) {
      if (!grouped[automation.categoryName]) {
        grouped[automation.categoryName] = []
      }
      grouped[automation.categoryName].push(automation)
    }

    return grouped
  }, [selectedAutomations])

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 mb-4">
          <Settings2 className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
          Skonfiguruj parametry
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Dostosuj liczbę godzin i procent automatyzacji dla każdego procesu,
          aby zobaczyć realne oszczędności.
        </p>
      </div>

      {/* Currency selector */}
      <CurrencySelector />

      {/* Automations configuration */}
      <div className="space-y-8">
        {Object.entries(automationsByCategory).map(([categoryName, automations]) => (
          <div key={categoryName}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
              <h3 className="font-display text-sm font-semibold text-gray-400 uppercase tracking-wider">
                {categoryName}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
            </div>

            {/* Automation cards */}
            <div className="space-y-4">
              {automations.map((automation, index) => (
                <div
                  key={automation.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <AutomationConfigCard automation={automation} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Savings preview (sticky) */}
      <SavingsPreview automations={selectedAutomations} />

      {/* Navigation */}
      <WizardNavigation />
    </div>
  )
}
