'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { SavingsResult, Currency } from '@/lib/types'
import { formatCurrency } from '@/lib/format'
import { CHART_COLORS, tooltipStyle } from '@/components/charts/ChartTheme'

interface SavingsPieChartProps {
  data: Record<string, SavingsResult>
  currency: Currency
  title?: string
}

interface ChartDataItem {
  name: string
  value: number
  color: string
}

export function SavingsPieChart({ data, currency, title }: SavingsPieChartProps) {
  // Przekształć dane do formatu Recharts
  const chartData: ChartDataItem[] = Object.entries(data)
    .map(([category, savings], index) => ({
      name: category,
      value: savings.yearly,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Brak danych do wyświetlenia
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: ChartDataItem }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div style={tooltipStyle}>
          <p className="text-white font-medium mb-1">{item.name}</p>
          <p className="text-purple-400 font-mono text-lg font-bold">
            {formatCurrency(item.value, currency)}/rok
          </p>
        </div>
      )
    }
    return null
  }

  // Custom legend
  const renderLegend = (props: { payload?: Array<{ value?: string; color?: string }> }) => {
    const { payload } = props
    if (!payload) return null
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color || '#7C3AED' }}
            />
            <span className="text-sm text-gray-400">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
