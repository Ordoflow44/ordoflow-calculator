// Stałe dla kalkulatora oszczędności

import type { Currency } from './types'

// Domyślne stawki godzinowe dla każdej waluty
export const DEFAULT_HOURLY_RATES: Record<Currency, number> = {
  PLN: 50,
  EUR: 12,
  USD: 15,
}

// Symbole walut
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  PLN: 'zł',
  EUR: '€',
  USD: '$',
}

// Formatowanie walut - pozycja symbolu
export const CURRENCY_SYMBOL_POSITION: Record<Currency, 'before' | 'after'> = {
  PLN: 'after',
  EUR: 'before',
  USD: 'before',
}

// Separatory dziesiętne i tysięczne
export const CURRENCY_LOCALE: Record<Currency, string> = {
  PLN: 'pl-PL',
  EUR: 'de-DE',
  USD: 'en-US',
}

// Mnożniki do obliczeń
export const WEEKS_PER_MONTH = 4.33
export const WEEKS_PER_YEAR = 52

// Ikony dla kategorii (mapowanie slug → ikona Lucide)
export const CATEGORY_ICONS: Record<string, string> = {
  'social-media-wideo': 'Video',
  'produktywnosc-email': 'Mail',
  'content-marketing': 'FileText',
  'obsuga-klienta-crm': 'Headphones', // "Obsługa" bez ł po slugify
  'lead-generation-sprzedaz': 'Target',
  'e-commerce': 'ShoppingCart',
  'analityka-research': 'BarChart3',
  'hr-rekrutacja': 'Users',
  'zarzadzanie-trescia': 'FolderOpen',
  'marketing-analityka': 'TrendingUp',
  'finanse-analityka': 'Wallet',
  'grafika-design': 'Palette',
  'it-devops': 'Terminal',
}

// Domyślny procent automatyzacji
export const DEFAULT_AUTOMATION_PERCENT = 75

// Limity walidacji
export const VALIDATION = {
  MIN_HOURLY_RATE: 1,
  MAX_HOURLY_RATE: 10000,
  MIN_HOURS_PER_WEEK: 0.5,
  MAX_HOURS_PER_WEEK: 168,
  MIN_AUTOMATION_PERCENT: 0,
  MAX_AUTOMATION_PERCENT: 100,
}

// Animacje - opóźnienia w milisekundach
export const ANIMATION = {
  STEP_TRANSITION: 300,
  CARD_STAGGER: 50,
  NUMBER_COUNTUP: 2000,
}
