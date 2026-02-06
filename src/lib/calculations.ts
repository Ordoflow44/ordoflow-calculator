// Funkcje obliczeniowe dla kalkulatora oszczędności

import { WEEKS_PER_MONTH, WEEKS_PER_YEAR } from './constants'
import type {
  SavingsResult,
  AutomationSavings,
  CalculationResult,
  SelectedAutomation,
  AutomationData,
  Currency,
} from './types'

/**
 * Oblicza oszczędności dla pojedynczej automatyzacji
 */
export function calculateAutomationSavings(
  automation: AutomationData,
  config: SelectedAutomation,
  hourlyRate: number
): AutomationSavings {
  // oszczędność_tygodniowa = godziny × stawka × (% automatyzacji / 100)
  const weekly = config.hoursPerWeek * hourlyRate * (config.automationPercent / 100)
  const monthly = weekly * WEEKS_PER_MONTH
  const yearly = weekly * WEEKS_PER_YEAR

  return {
    automationId: automation.id,
    automationName: automation.name,
    categoryName: automation.categoryName,
    hoursPerWeek: config.hoursPerWeek,
    automationPercent: config.automationPercent,
    weekly: Math.round(weekly * 100) / 100,
    monthly: Math.round(monthly * 100) / 100,
    yearly: Math.round(yearly * 100) / 100,
  }
}

/**
 * Oblicza pełny wynik kalkulacji dla wszystkich wybranych automatyzacji
 */
export function calculateTotalSavings(
  automations: AutomationData[],
  configs: Record<string, SelectedAutomation>,
  hourlyRate: number,
  currency: Currency
): CalculationResult {
  const byAutomation: AutomationSavings[] = []
  const byCategory: Record<string, SavingsResult> = {}

  let totalWeekly = 0
  let totalMonthly = 0
  let totalYearly = 0

  for (const automation of automations) {
    const config = configs[automation.id]
    if (!config) continue

    const savings = calculateAutomationSavings(automation, config, hourlyRate)
    byAutomation.push(savings)

    // Sumuj całkowite oszczędności
    totalWeekly += savings.weekly
    totalMonthly += savings.monthly
    totalYearly += savings.yearly

    // Grupuj po kategorii
    if (!byCategory[automation.categoryName]) {
      byCategory[automation.categoryName] = { weekly: 0, monthly: 0, yearly: 0 }
    }
    byCategory[automation.categoryName].weekly += savings.weekly
    byCategory[automation.categoryName].monthly += savings.monthly
    byCategory[automation.categoryName].yearly += savings.yearly
  }

  // Zaokrąglij sumy kategorii
  for (const category of Object.keys(byCategory)) {
    byCategory[category].weekly = Math.round(byCategory[category].weekly * 100) / 100
    byCategory[category].monthly = Math.round(byCategory[category].monthly * 100) / 100
    byCategory[category].yearly = Math.round(byCategory[category].yearly * 100) / 100
  }

  return {
    total: {
      weekly: Math.round(totalWeekly * 100) / 100,
      monthly: Math.round(totalMonthly * 100) / 100,
      yearly: Math.round(totalYearly * 100) / 100,
    },
    byAutomation,
    byCategory,
    currency,
    hourlyRate,
  }
}

/**
 * Oblicza domyślną liczbę godzin jako średnią z zakresu min-max
 */
export function getDefaultHours(savingsMin: number, savingsMax: number): number {
  return Math.round((savingsMin + savingsMax) / 2)
}

/**
 * Sortuje automatyzacje według oszczędności rocznych (malejąco)
 */
export function sortByYearlySavings(automations: AutomationSavings[]): AutomationSavings[] {
  return [...automations].sort((a, b) => b.yearly - a.yearly)
}

/**
 * Zwraca top N automatyzacji według oszczędności rocznych
 */
export function getTopAutomations(
  automations: AutomationSavings[],
  limit: number = 5
): AutomationSavings[] {
  return sortByYearlySavings(automations).slice(0, limit)
}
