'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calculator as CalculatorIcon } from 'lucide-react'
import { CalculatorProvider, useCalculator } from '@/store/calculator-context'
import { WizardProgress } from './WizardProgress'
import { StepCategory } from './StepCategory'
import { StepAutomations } from './StepAutomations'
import { StepConfiguration } from './StepConfiguration'
import { StepContact } from './StepContact'
import { StepSummary } from './StepSummary'

function CalculatorContent() {
  const { state, setEmbedMode } = useCalculator()
  const { currentStep, isEmbedMode } = state
  const searchParams = useSearchParams()

  // Detect embed mode from URL params
  useEffect(() => {
    const embed = searchParams.get('embed') === 'true'
    setEmbedMode(embed)
  }, [searchParams, setEmbedMode])

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepCategory />
      case 2:
        return <StepAutomations />
      case 3:
        return <StepConfiguration />
      case 4:
        return <StepContact />
      case 5:
        return <StepSummary />
      default:
        return <StepCategory />
    }
  }

  return (
    <div className="min-h-screen grid-bg">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header - hidden in embed mode */}
        {!isEmbedMode && (
          <header className="text-center mb-12 fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-600/10 border border-purple-500/20 mb-6">
              <CalculatorIcon className="w-8 h-8 text-purple-400" />
            </div>

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
              Kalkulator Oszczędności
              <br />
              <span className="text-gradient">z Automatyzacji</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Odkryj, ile czasu i pieniędzy możesz zaoszczędzić dzięki automatyzacji
              procesów biznesowych.
            </p>
          </header>
        )}

        {/* Wizard progress */}
        <WizardProgress />

        {/* Current step content */}
        <main>{renderStep()}</main>
      </div>
    </div>
  )
}

export function Calculator() {
  return (
    <CalculatorProvider>
      <CalculatorContent />
    </CalculatorProvider>
  )
}
