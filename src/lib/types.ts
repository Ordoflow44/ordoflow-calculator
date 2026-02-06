// Typy dla kalkulatora oszczędności

export type Currency = 'PLN' | 'EUR' | 'USD'

export interface CategoryData {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  displayOrder: number
  isActive: boolean
  automationsCount?: number
}

export interface AutomationData {
  id: string
  lp: number
  name: string
  categoryId: string
  categorySlug: string
  categoryName: string
  integrations: string | null
  descriptionTechnical: string | null
  descriptionMarketing: string
  savingsMin: number
  savingsMax: number
  automationPercent: number
  isActive: boolean
}

export interface SelectedAutomation {
  automationId: string
  hoursPerWeek: number
  automationPercent: number
}

export interface CalculatorState {
  // Krok 1
  selectedCategoryIds: string[]

  // Krok 2
  selectedAutomationIds: string[]

  // Krok 3
  currency: Currency
  hourlyRate: number
  automationConfigs: Record<string, SelectedAutomation>

  // Krok 4
  firstName: string
  email: string
  phone: string
  company: string
  rodoConsent: boolean
  marketingConsent: boolean
}

export interface SavingsResult {
  weekly: number
  monthly: number
  yearly: number
}

export interface AutomationSavings extends SavingsResult {
  automationId: string
  automationName: string
  categoryName: string
  hoursPerWeek: number
  automationPercent: number
}

export interface CalculationResult {
  total: SavingsResult
  byAutomation: AutomationSavings[]
  byCategory: Record<string, SavingsResult>
  currency: Currency
  hourlyRate: number
}
