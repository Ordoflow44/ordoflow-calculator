'use client'

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type {
  Currency,
  CategoryData,
  AutomationData,
  SelectedAutomation,
  CalculatorState,
} from '@/lib/types'
import { DEFAULT_HOURLY_RATES, DEFAULT_AUTOMATION_PERCENT } from '@/lib/constants'
import { getDefaultHours } from '@/lib/calculations'

// Rozszerzony stan z metadanymi wizarda
interface CalculatorContextState extends CalculatorState {
  currentStep: number
  isEmbedMode: boolean
  // Cache danych z API
  categoriesCache: CategoryData[] | null
  automationsCache: Record<string, AutomationData[]> // klucz = categoryId
}

// Akcje
type CalculatorAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_EMBED_MODE'; payload: boolean }
  | { type: 'TOGGLE_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'TOGGLE_AUTOMATION'; payload: { automationId: string; automation?: AutomationData } }
  | { type: 'SELECT_ALL_IN_CATEGORY'; payload: { categoryId: string; automations: AutomationData[] } }
  | { type: 'DESELECT_ALL_IN_CATEGORY'; payload: string }
  | { type: 'SET_CURRENCY'; payload: Currency }
  | { type: 'SET_HOURLY_RATE'; payload: number }
  | { type: 'UPDATE_AUTOMATION_CONFIG'; payload: { automationId: string; config: Partial<SelectedAutomation> } }
  | { type: 'SET_CONTACT_FIELD'; payload: { field: keyof Pick<CalculatorState, 'firstName' | 'email' | 'phone' | 'company'>; value: string } }
  | { type: 'SET_CONSENT'; payload: { field: 'rodoConsent' | 'marketingConsent'; value: boolean } }
  | { type: 'CACHE_CATEGORIES'; payload: CategoryData[] }
  | { type: 'CACHE_AUTOMATIONS'; payload: { categoryId: string; automations: AutomationData[] } }
  | { type: 'RESET' }

// Stan początkowy
const initialState: CalculatorContextState = {
  currentStep: 1,
  isEmbedMode: false,
  selectedCategoryIds: [],
  selectedAutomationIds: [],
  currency: 'PLN',
  hourlyRate: DEFAULT_HOURLY_RATES.PLN,
  automationConfigs: {},
  firstName: '',
  email: '',
  phone: '',
  company: '',
  rodoConsent: false,
  marketingConsent: false,
  categoriesCache: null,
  automationsCache: {},
}

// Reducer
function calculatorReducer(
  state: CalculatorContextState,
  action: CalculatorAction
): CalculatorContextState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: Math.max(1, Math.min(5, action.payload)) }

    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(5, state.currentStep + 1) }

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) }

    case 'SET_EMBED_MODE':
      return { ...state, isEmbedMode: action.payload }

    case 'TOGGLE_CATEGORY': {
      const categoryId = action.payload
      const isSelected = state.selectedCategoryIds.includes(categoryId)

      if (isSelected) {
        // Odznacz kategorię i usuń automatyzacje z tej kategorii
        const automationsInCategory = Object.values(state.automationsCache)
          .flat()
          .filter((a) => a.categoryId === categoryId)
          .map((a) => a.id)

        const newSelectedAutomationIds = state.selectedAutomationIds.filter(
          (id) => !automationsInCategory.includes(id)
        )

        const newAutomationConfigs = { ...state.automationConfigs }
        automationsInCategory.forEach((id) => delete newAutomationConfigs[id])

        return {
          ...state,
          selectedCategoryIds: state.selectedCategoryIds.filter((id) => id !== categoryId),
          selectedAutomationIds: newSelectedAutomationIds,
          automationConfigs: newAutomationConfigs,
        }
      } else {
        return {
          ...state,
          selectedCategoryIds: [...state.selectedCategoryIds, categoryId],
        }
      }
    }

    case 'SET_CATEGORIES':
      return { ...state, selectedCategoryIds: action.payload }

    case 'TOGGLE_AUTOMATION': {
      const { automationId, automation } = action.payload
      const isSelected = state.selectedAutomationIds.includes(automationId)

      if (isSelected) {
        const newAutomationConfigs = { ...state.automationConfigs }
        delete newAutomationConfigs[automationId]
        return {
          ...state,
          selectedAutomationIds: state.selectedAutomationIds.filter((id) => id !== automationId),
          automationConfigs: newAutomationConfigs,
        }
      } else {
        // Dodaj automatyzację z domyślną konfiguracją
        const defaultConfig: SelectedAutomation = {
          automationId,
          hoursPerWeek: automation
            ? getDefaultHours(automation.savingsMin, automation.savingsMax)
            : 5,
          automationPercent: automation?.automationPercent ?? DEFAULT_AUTOMATION_PERCENT,
        }
        return {
          ...state,
          selectedAutomationIds: [...state.selectedAutomationIds, automationId],
          automationConfigs: {
            ...state.automationConfigs,
            [automationId]: defaultConfig,
          },
        }
      }
    }

    case 'SELECT_ALL_IN_CATEGORY': {
      const { categoryId, automations } = action.payload
      const automationIds = automations.map((a) => a.id)

      // Dodaj tylko te, które nie są jeszcze zaznaczone
      const newAutomationIds = automationIds.filter(
        (id) => !state.selectedAutomationIds.includes(id)
      )

      const newConfigs = { ...state.automationConfigs }
      automations.forEach((automation) => {
        if (!newConfigs[automation.id]) {
          newConfigs[automation.id] = {
            automationId: automation.id,
            hoursPerWeek: getDefaultHours(automation.savingsMin, automation.savingsMax),
            automationPercent: automation.automationPercent,
          }
        }
      })

      // Upewnij się, że kategoria jest zaznaczona
      const selectedCategoryIds = state.selectedCategoryIds.includes(categoryId)
        ? state.selectedCategoryIds
        : [...state.selectedCategoryIds, categoryId]

      return {
        ...state,
        selectedCategoryIds,
        selectedAutomationIds: [...state.selectedAutomationIds, ...newAutomationIds],
        automationConfigs: newConfigs,
      }
    }

    case 'DESELECT_ALL_IN_CATEGORY': {
      const categoryId = action.payload
      const automationsInCategory = Object.values(state.automationsCache)
        .flat()
        .filter((a) => a.categoryId === categoryId)
        .map((a) => a.id)

      const newSelectedAutomationIds = state.selectedAutomationIds.filter(
        (id) => !automationsInCategory.includes(id)
      )

      const newAutomationConfigs = { ...state.automationConfigs }
      automationsInCategory.forEach((id) => delete newAutomationConfigs[id])

      return {
        ...state,
        selectedAutomationIds: newSelectedAutomationIds,
        automationConfigs: newAutomationConfigs,
      }
    }

    case 'SET_CURRENCY':
      return {
        ...state,
        currency: action.payload,
        hourlyRate: DEFAULT_HOURLY_RATES[action.payload],
      }

    case 'SET_HOURLY_RATE':
      return { ...state, hourlyRate: action.payload }

    case 'UPDATE_AUTOMATION_CONFIG': {
      const { automationId, config } = action.payload
      return {
        ...state,
        automationConfigs: {
          ...state.automationConfigs,
          [automationId]: {
            ...state.automationConfigs[automationId],
            ...config,
          },
        },
      }
    }

    case 'SET_CONTACT_FIELD':
      return { ...state, [action.payload.field]: action.payload.value }

    case 'SET_CONSENT':
      return { ...state, [action.payload.field]: action.payload.value }

    case 'CACHE_CATEGORIES':
      return { ...state, categoriesCache: action.payload }

    case 'CACHE_AUTOMATIONS':
      return {
        ...state,
        automationsCache: {
          ...state.automationsCache,
          [action.payload.categoryId]: action.payload.automations,
        },
      }

    case 'RESET':
      return { ...initialState }

    default:
      return state
  }
}

// Interfejs kontekstu
interface CalculatorContextValue {
  state: CalculatorContextState
  // Nawigacja
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setEmbedMode: (embed: boolean) => void
  // Kategorie
  toggleCategory: (categoryId: string) => void
  setCategories: (categoryIds: string[]) => void
  // Automatyzacje
  toggleAutomation: (automationId: string, automation?: AutomationData) => void
  selectAllInCategory: (categoryId: string, automations: AutomationData[]) => void
  deselectAllInCategory: (categoryId: string) => void
  // Konfiguracja
  setCurrency: (currency: Currency) => void
  setHourlyRate: (rate: number) => void
  updateAutomationConfig: (automationId: string, config: Partial<SelectedAutomation>) => void
  // Kontakt
  setContactField: (field: 'firstName' | 'email' | 'phone' | 'company', value: string) => void
  setConsent: (field: 'rodoConsent' | 'marketingConsent', value: boolean) => void
  // Cache
  cacheCategories: (categories: CategoryData[]) => void
  cacheAutomations: (categoryId: string, automations: AutomationData[]) => void
  // Walidacja
  canProceedToStep: (step: number) => boolean
  getValidationMessage: (step: number) => string | null
  // Reset
  reset: () => void
}

const CalculatorContext = createContext<CalculatorContextValue | null>(null)

// Provider
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  // Nawigacja
  const setStep = useCallback((step: number) => {
    dispatch({ type: 'SET_STEP', payload: step })
  }, [])

  const nextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' })
  }, [])

  const prevStep = useCallback(() => {
    dispatch({ type: 'PREV_STEP' })
  }, [])

  const setEmbedMode = useCallback((embed: boolean) => {
    dispatch({ type: 'SET_EMBED_MODE', payload: embed })
  }, [])

  // Kategorie
  const toggleCategory = useCallback((categoryId: string) => {
    dispatch({ type: 'TOGGLE_CATEGORY', payload: categoryId })
  }, [])

  const setCategories = useCallback((categoryIds: string[]) => {
    dispatch({ type: 'SET_CATEGORIES', payload: categoryIds })
  }, [])

  // Automatyzacje
  const toggleAutomation = useCallback((automationId: string, automation?: AutomationData) => {
    dispatch({ type: 'TOGGLE_AUTOMATION', payload: { automationId, automation } })
  }, [])

  const selectAllInCategory = useCallback((categoryId: string, automations: AutomationData[]) => {
    dispatch({ type: 'SELECT_ALL_IN_CATEGORY', payload: { categoryId, automations } })
  }, [])

  const deselectAllInCategory = useCallback((categoryId: string) => {
    dispatch({ type: 'DESELECT_ALL_IN_CATEGORY', payload: categoryId })
  }, [])

  // Konfiguracja
  const setCurrency = useCallback((currency: Currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency })
  }, [])

  const setHourlyRate = useCallback((rate: number) => {
    dispatch({ type: 'SET_HOURLY_RATE', payload: rate })
  }, [])

  const updateAutomationConfig = useCallback(
    (automationId: string, config: Partial<SelectedAutomation>) => {
      dispatch({ type: 'UPDATE_AUTOMATION_CONFIG', payload: { automationId, config } })
    },
    []
  )

  // Kontakt
  const setContactField = useCallback(
    (field: 'firstName' | 'email' | 'phone' | 'company', value: string) => {
      dispatch({ type: 'SET_CONTACT_FIELD', payload: { field, value } })
    },
    []
  )

  const setConsent = useCallback((field: 'rodoConsent' | 'marketingConsent', value: boolean) => {
    dispatch({ type: 'SET_CONSENT', payload: { field, value } })
  }, [])

  // Cache
  const cacheCategories = useCallback((categories: CategoryData[]) => {
    dispatch({ type: 'CACHE_CATEGORIES', payload: categories })
  }, [])

  const cacheAutomations = useCallback((categoryId: string, automations: AutomationData[]) => {
    dispatch({ type: 'CACHE_AUTOMATIONS', payload: { categoryId, automations } })
  }, [])

  // Walidacja
  const canProceedToStep = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 2:
          // Można przejść do kroku 2, jeśli wybrano przynajmniej 1 kategorię
          return state.selectedCategoryIds.length > 0
        case 3:
          // Można przejść do kroku 3, jeśli wybrano przynajmniej 1 automatyzację
          return state.selectedAutomationIds.length > 0
        case 4:
          // Można przejść do kroku 4, jeśli wszystkie konfiguracje są poprawne
          return state.selectedAutomationIds.every((id) => {
            const config = state.automationConfigs[id]
            return (
              config &&
              config.hoursPerWeek > 0 &&
              config.automationPercent >= 0 &&
              config.automationPercent <= 100
            )
          })
        case 5:
          // Można przejść do kroku 5, jeśli dane kontaktowe są wypełnione
          return (
            state.firstName.trim().length > 0 &&
            state.email.trim().length > 0 &&
            state.phone.trim().length > 0 &&
            state.rodoConsent
          )
        default:
          return true
      }
    },
    [state]
  )

  const getValidationMessage = useCallback(
    (step: number): string | null => {
      switch (step) {
        case 2:
          if (state.selectedCategoryIds.length === 0) {
            return 'Wybierz przynajmniej jedną kategorię'
          }
          break
        case 3:
          if (state.selectedAutomationIds.length === 0) {
            return 'Wybierz przynajmniej jedną automatyzację'
          }
          break
        case 4:
          // Sprawdź konfiguracje
          for (const id of state.selectedAutomationIds) {
            const config = state.automationConfigs[id]
            if (!config || config.hoursPerWeek <= 0) {
              return 'Uzupełnij konfigurację wszystkich automatyzacji'
            }
          }
          break
        case 5:
          if (!state.firstName.trim()) return 'Podaj imię'
          if (!state.email.trim()) return 'Podaj adres e-mail'
          if (!state.phone.trim()) return 'Podaj numer telefonu'
          if (!state.rodoConsent) return 'Zaakceptuj politykę prywatności'
          break
      }
      return null
    },
    [state]
  )

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  const value = useMemo<CalculatorContextValue>(
    () => ({
      state,
      setStep,
      nextStep,
      prevStep,
      setEmbedMode,
      toggleCategory,
      setCategories,
      toggleAutomation,
      selectAllInCategory,
      deselectAllInCategory,
      setCurrency,
      setHourlyRate,
      updateAutomationConfig,
      setContactField,
      setConsent,
      cacheCategories,
      cacheAutomations,
      canProceedToStep,
      getValidationMessage,
      reset,
    }),
    [
      state,
      setStep,
      nextStep,
      prevStep,
      setEmbedMode,
      toggleCategory,
      setCategories,
      toggleAutomation,
      selectAllInCategory,
      deselectAllInCategory,
      setCurrency,
      setHourlyRate,
      updateAutomationConfig,
      setContactField,
      setConsent,
      cacheCategories,
      cacheAutomations,
      canProceedToStep,
      getValidationMessage,
      reset,
    ]
  )

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

// Hook do użycia kontekstu
export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
