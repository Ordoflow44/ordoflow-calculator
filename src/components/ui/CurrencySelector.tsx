'use client'

import { memo } from 'react'
import { DollarSign, Euro, Banknote } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'
import { CURRENCY_SYMBOLS, VALIDATION } from '@/lib/constants'
import type { Currency } from '@/lib/types'

const CURRENCY_OPTIONS: { value: Currency; label: string; icon: typeof DollarSign }[] = [
  { value: 'PLN', label: 'PLN (złoty)', icon: Banknote },
  { value: 'EUR', label: 'EUR (euro)', icon: Euro },
  { value: 'USD', label: 'USD (dolar)', icon: DollarSign },
]

function CurrencySelectorComponent() {
  const { state, setCurrency, setHourlyRate } = useCalculator()
  const { currency, hourlyRate } = state

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as Currency)
  }

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value)) {
      const clamped = Math.min(
        VALIDATION.MAX_HOURLY_RATE,
        Math.max(VALIDATION.MIN_HOURLY_RATE, value)
      )
      setHourlyRate(clamped)
    }
  }

  const symbol = CURRENCY_SYMBOLS[currency]

  return (
    <div className="card p-6 fade-in-up">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Currency select */}
        <div className="flex-1">
          <label
            htmlFor="currency-select"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Waluta
          </label>
          <div className="relative">
            <select
              id="currency-select"
              value={currency}
              onChange={handleCurrencyChange}
              className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            >
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Hourly rate input */}
        <div className="flex-1">
          <label
            htmlFor="hourly-rate"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Stawka godzinowa
          </label>
          <div className="relative">
            {/* Symbol position depends on currency */}
            {currency !== 'PLN' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                {symbol}
              </span>
            )}
            <input
              type="number"
              id="hourly-rate"
              value={hourlyRate}
              onChange={handleRateChange}
              min={VALIDATION.MIN_HOURLY_RATE}
              max={VALIDATION.MAX_HOURLY_RATE}
              className={`
                w-full py-3 bg-zinc-800 border border-white/10 rounded-lg text-white font-mono
                focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
                ${currency === 'PLN' ? 'px-4 pr-12' : 'pl-10 pr-4'}
              `}
            />
            {currency === 'PLN' && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                {symbol}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Twoja stawka za godzinę pracy
          </p>
        </div>
      </div>
    </div>
  )
}

export const CurrencySelector = memo(CurrencySelectorComponent)
