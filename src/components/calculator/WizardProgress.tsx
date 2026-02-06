'use client'

import { memo } from 'react'
import { Check, FolderOpen, Zap, Settings, User, FileText } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'

const STEPS = [
  { number: 1, label: 'Kategorie', icon: FolderOpen },
  { number: 2, label: 'Automatyzacje', icon: Zap },
  { number: 3, label: 'Konfiguracja', icon: Settings },
  { number: 4, label: 'Kontakt', icon: User },
  { number: 5, label: 'Raport', icon: FileText },
]

function WizardProgressComponent() {
  const { state, canProceedToStep, setStep } = useCalculator()
  const { currentStep } = state

  const handleStepClick = (stepNumber: number) => {
    // Można przejść do poprzednich kroków lub jeśli walidacja pozwala
    if (stepNumber < currentStep || canProceedToStep(stepNumber)) {
      setStep(stepNumber)
    }
  }

  return (
    <nav className="mb-10" aria-label="Postęp formularza">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const isClickable = step.number < currentStep || canProceedToStep(step.number)
          const Icon = step.icon

          return (
            <div key={step.number} className="flex items-center">
              {/* Step button */}
              <button
                type="button"
                onClick={() => handleStepClick(step.number)}
                disabled={!isClickable}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-xl transition-all
                  ${isCurrent
                    ? 'bg-purple-600/20 border border-purple-500/40'
                    : isCompleted
                      ? 'hover:bg-gray-800/50'
                      : isClickable
                        ? 'hover:bg-gray-800/50 cursor-pointer'
                        : 'cursor-not-allowed opacity-50'
                  }
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step indicator */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all
                    ${isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                        ? 'bg-purple-600 text-white glow-purple'
                        : 'bg-gray-800 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`
                    font-medium transition-colors
                    ${isCurrent
                      ? 'text-white'
                      : isCompleted
                        ? 'text-gray-300'
                        : 'text-gray-500'
                    }
                  `}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-0.5 mx-2 min-w-[2rem] transition-colors
                    ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-800'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        {/* Progress bar */}
        <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Current step info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center glow-purple">
              {(() => {
                const CurrentIcon = STEPS[currentStep - 1]?.icon || FolderOpen
                return <CurrentIcon className="w-5 h-5 text-white" />
              })()}
            </div>
            <div>
              <p className="text-sm text-gray-500">Krok {currentStep} z {STEPS.length}</p>
              <p className="font-medium text-white">{STEPS[currentStep - 1]?.label}</p>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {STEPS.map((step) => (
              <button
                key={step.number}
                type="button"
                onClick={() => handleStepClick(step.number)}
                disabled={!(step.number < currentStep || canProceedToStep(step.number))}
                className={`
                  w-2.5 h-2.5 rounded-full transition-all
                  ${step.number === currentStep
                    ? 'bg-purple-500 scale-125'
                    : step.number < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                  }
                  ${step.number < currentStep || canProceedToStep(step.number)
                    ? 'cursor-pointer hover:scale-110'
                    : 'cursor-not-allowed'
                  }
                `}
                aria-label={`Przejdź do kroku ${step.number}: ${step.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export const WizardProgress = memo(WizardProgressComponent)
