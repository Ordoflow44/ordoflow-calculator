'use client'

import type { AutomationSavings, Currency } from '@/lib/types'
import { formatCurrency, formatHours, formatPercent } from '@/lib/format'

interface SavingsTableProps {
  automations: AutomationSavings[]
  currency: Currency
}

export function SavingsTable({ automations, currency }: SavingsTableProps) {
  if (automations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Brak wybranych automatyzacji
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 lg:mx-0">
      <div className="inline-block min-w-full align-middle px-4 lg:px-0">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Automatyzacja
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400 hidden md:table-cell">
                Kategoria
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                Godz./tyg.
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden sm:table-cell">
                %
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden lg:table-cell">
                Tyg.
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400 hidden sm:table-cell">
                Mies.
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">
                Rocznie
              </th>
            </tr>
          </thead>
          <tbody>
            {automations.map((automation, index) => (
              <tr
                key={automation.automationId}
                className={`
                  border-b border-gray-800/50
                  ${index % 2 === 0 ? 'bg-gray-900/30' : 'bg-transparent'}
                `}
              >
                <td className="py-3 px-4">
                  <span className="text-white text-sm font-medium">
                    {automation.automationName}
                  </span>
                </td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className="text-gray-400 text-sm">
                    {automation.categoryName}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-gray-300 text-sm font-mono">
                    {formatHours(automation.hoursPerWeek)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right hidden sm:table-cell">
                  <span className="text-gray-300 text-sm font-mono">
                    {formatPercent(automation.automationPercent)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right hidden lg:table-cell">
                  <span className="text-gray-300 text-sm font-mono">
                    {formatCurrency(automation.weekly, currency)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right hidden sm:table-cell">
                  <span className="text-gray-300 text-sm font-mono">
                    {formatCurrency(automation.monthly, currency)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-purple-400 text-sm font-mono font-semibold">
                    {formatCurrency(automation.yearly, currency)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-purple-500/30 bg-purple-500/5">
              <td className="py-4 px-4" colSpan={2}>
                <span className="text-white font-semibold">Razem</span>
              </td>
              <td className="py-4 px-4 text-right hidden md:table-cell">
                <span className="text-gray-300 text-sm font-mono">
                  {formatHours(
                    automations.reduce((sum, a) => sum + a.hoursPerWeek, 0)
                  )}
                </span>
              </td>
              <td className="py-4 px-4 text-right hidden sm:table-cell">
                <span className="text-gray-400 text-sm">-</span>
              </td>
              <td className="py-4 px-4 text-right hidden lg:table-cell">
                <span className="text-white text-sm font-mono font-semibold">
                  {formatCurrency(
                    automations.reduce((sum, a) => sum + a.weekly, 0),
                    currency
                  )}
                </span>
              </td>
              <td className="py-4 px-4 text-right hidden sm:table-cell">
                <span className="text-white text-sm font-mono font-semibold">
                  {formatCurrency(
                    automations.reduce((sum, a) => sum + a.monthly, 0),
                    currency
                  )}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="text-purple-400 font-mono font-bold">
                  {formatCurrency(
                    automations.reduce((sum, a) => sum + a.yearly, 0),
                    currency
                  )}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
