'use client'

import { memo } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'

interface WizardNavigationProps {
  showBack?: boolean
  showPrev?: boolean
  showNext?: boolean
  nextLabel?: string
  nextDisabled?: boolean
  onNext?: (e?: React.FormEvent) => void
  isLoading?: boolean
}

function WizardNavigationComponent({
  showBack = true,
  showPrev,
  showNext = true,
  nextLabel = 'Dalej',
  nextDisabled,
  onNext,
  isLoading = false,
}: WizardNavigationProps) {
  const { state, prevStep, nextStep, canProceedToStep, getValidationMessage } = useCalculator()
  const { currentStep } = state

  // Use showPrev if provided, otherwise fall back to showBack
  const shouldShowBack = showPrev !== undefined ? showPrev : showBack
  const canGoNext = nextDisabled !== undefined ? !nextDisabled : canProceedToStep(currentStep + 1)
  const validationMessage = getValidationMessage(currentStep + 1)

  const handleNext = (e?: React.FormEvent) => {
    if (onNext) {
      onNext(e)
    } else {
      nextStep()
    }
  }

  return (
    <div className="mt-10 pt-6 border-t border-gray-800">
      <div className="flex items-center justify-between gap-4">
        {/* Back button */}
        <div>
          {shouldShowBack && currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="btn-secondary gap-2"
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4" />
              Wstecz
            </button>
          )}
        </div>

        {/* Validation message & Next button */}
        <div className="flex items-center gap-4">
          {/* Validation message */}
          {!canGoNext && validationMessage && (
            <p className="text-amber-400 text-sm hidden sm:block">
              {validationMessage}
            </p>
          )}

          {/* Next button */}
          {showNext && (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext || isLoading}
              className={`
                btn-primary gap-2
                ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ładowanie...
                </>
              ) : (
                <>
                  {nextLabel}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile validation message */}
      {!canGoNext && validationMessage && (
        <p className="text-amber-400 text-sm mt-4 text-center sm:hidden">
          {validationMessage}
        </p>
      )}
    </div>
  )
}

export const WizardNavigation = memo(WizardNavigationComponent)
