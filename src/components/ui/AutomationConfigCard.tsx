'use client'

import { memo, useMemo } from 'react'
import { useCalculator } from '@/store/calculator-context'
import { ConfigSlider } from './ConfigSlider'
import { calculateAutomationSavings } from '@/lib/calculations'
import { formatCurrency, formatHoursRange } from '@/lib/format'
import type { AutomationData } from '@/lib/types'

interface AutomationConfigCardProps {
  automation: AutomationData
}

function AutomationConfigCardComponent({ automation }: AutomationConfigCardProps) {
  const { state, updateAutomationConfig } = useCalculator()
  const { currency, hourlyRate, automationConfigs } = state

  const config = automationConfigs[automation.id]

  // Calculate savings for this automation
  const savings = useMemo(() => {
    if (!config) return null
    return calculateAutomationSavings(automation, config, hourlyRate)
  }, [automation, config, hourlyRate])

  if (!config) return null

  const handleHoursChange = (value: number) => {
    updateAutomationConfig(automation.id, { hoursPerWeek: value })
  }

  const handlePercentChange = (value: number) => {
    updateAutomationConfig(automation.id, { automationPercent: value })
  }

  const hoursRange = formatHoursRange(automation.savingsMin, automation.savingsMax)

  return (
    <div className="card p-6 fade-in-up">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold text-white">
          {automation.name}
        </h3>
        {automation.descriptionMarketing && (
          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
            {automation.descriptionMarketing}
          </p>
        )}
        <p className="mt-2 text-xs text-gray-500">
          Szacowany zakres: <span className="text-purple-400">{hoursRange}/tyg</span>
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-6">
        {/* Hours per week */}
        <ConfigSlider
          value={config.hoursPerWeek}
          onChange={handleHoursChange}
          min={0}
          max={40}
          step={0.5}
          label="Ile godzin tygodniowo poświęcasz na tę czynność?"
          unit="h"
          description="Zostaw domyślną wartość jeśli nie wiesz dokładnie"
        />

        {/* Automation percent */}
        <ConfigSlider
          value={config.automationPercent}
          onChange={handlePercentChange}
          min={0}
          max={100}
          step={5}
          label="Procent automatyzacji"
          unit="%"
          description={`Ta automatyzacja eliminuje ~${config.automationPercent}% pracy ręcznej`}
        />
      </div>

      {/* Savings preview */}
      {savings && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Oszczędność tygodniowa:</span>
            <span className="text-lg font-display font-bold text-purple-400">
              {formatCurrency(savings.weekly, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export const AutomationConfigCard = memo(AutomationConfigCardComponent)
