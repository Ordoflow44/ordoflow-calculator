// Funkcje formatowania dla kalkulatora oszczędności

import {
  CURRENCY_SYMBOLS,
  CURRENCY_SYMBOL_POSITION,
  CURRENCY_LOCALE,
} from './constants'
import type { Currency } from './types'

/**
 * Formatuje kwotę w danej walucie
 * Przykłady: "12 500 zł", "€4,200", "$5,100"
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const locale = CURRENCY_LOCALE[currency]
  const symbol = CURRENCY_SYMBOLS[currency]
  const position = CURRENCY_SYMBOL_POSITION[currency]

  // Użyj Intl.NumberFormat dla właściwego formatowania liczb
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const formattedNumber = formatter.format(Math.round(amount))

  if (position === 'before') {
    return `${symbol}${formattedNumber}`
  } else {
    return `${formattedNumber} ${symbol}`
  }
}

/**
 * Formatuje kwotę z pełną precyzją (2 miejsca po przecinku)
 */
export function formatCurrencyPrecise(amount: number, currency: Currency): string {
  const locale = CURRENCY_LOCALE[currency]
  const symbol = CURRENCY_SYMBOLS[currency]
  const position = CURRENCY_SYMBOL_POSITION[currency]

  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const formattedNumber = formatter.format(amount)

  if (position === 'before') {
    return `${symbol}${formattedNumber}`
  } else {
    return `${formattedNumber} ${symbol}`
  }
}

/**
 * Formatuje liczbę godzin
 * Przykłady: "8h", "12h", "1.5h"
 */
export function formatHours(hours: number): string {
  if (Number.isInteger(hours)) {
    return `${hours}h`
  }
  return `${hours.toFixed(1)}h`
}

/**
 * Formatuje zakres godzin
 * Przykład: "8-12h"
 */
export function formatHoursRange(min: number, max: number): string {
  if (min === max) {
    return formatHours(min)
  }
  return `${min}-${max}h`
}

/**
 * Formatuje procent
 * Przykład: "75%"
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

/**
 * Formatuje dużą liczbę z separatorami tysięcy
 * Przykład: 12500 → "12 500"
 */
export function formatNumber(value: number, locale: string = 'pl-PL'): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(value))
}

/**
 * Tworzy slug z tekstu
 * Przykład: "Social Media & Wideo" → "social-media-wideo"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // usuń akcenty
    .replace(/[^a-z0-9\s-]/g, '') // usuń znaki specjalne
    .replace(/\s+/g, '-') // zamień spacje na myślniki
    .replace(/-+/g, '-') // usuń wielokrotne myślniki
    .replace(/^-|-$/g, '') // usuń myślniki na początku i końcu
}
