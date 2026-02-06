'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { AutomationSavings, Currency } from '@/lib/types'
import { formatCurrency } from '@/lib/format'
import { CHART_COLORS, AXIS_COLOR, LABEL_COLOR, tooltipStyle } from '@/components/charts/ChartTheme'

interface SavingsBarChartProps {
  data: AutomationSavings[]
  currency: Currency
  limit?: number
  title?: string
}

interface ChartDataItem {
  name: string
  value: number
  fullName: string
}

export function SavingsBarChart({
  data,
  currency,
  limit = 5,
  title,
}: SavingsBarChartProps) {
  // Posortuj i ogranicz do top N
  const chartData: ChartDataItem[] = [...data]
    .sort((a, b) => b.yearly - a.yearly)
    .slice(0, limit)
    .map((automation) => ({
      // Skróć nazwę dla osi Y
      name: automation.automationName.length > 25
        ? automation.automationName.substring(0, 22) + '...'
        : automation.automationName,
      fullName: automation.automationName,
      value: automation.yearly,
    }))

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Brak danych do wyświetlenia
      </div>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload: ChartDataItem }>
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div style={tooltipStyle}>
          <p className="text-white font-medium mb-1 text-sm">{item.fullName}</p>
          <p className="text-purple-400 font-mono text-lg font-bold">
            {formatCurrency(item.value, currency)}/rok
          </p>
        </div>
      )
    }
    return null
  }

  // Formatowanie wartości na osi X
  const formatAxisValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return value.toString()
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={chartData.length * 50 + 40}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
        >
          <XAxis
            type="number"
            tick={{ fill: LABEL_COLOR, fontSize: 12 }}
            axisLine={{ stroke: AXIS_COLOR }}
            tickLine={{ stroke: AXIS_COLOR }}
            tickFormatter={formatAxisValue}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fill: LABEL_COLOR, fontSize: 12 }}
            axisLine={{ stroke: AXIS_COLOR }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }} />
          <Bar
            dataKey="value"
            radius={[0, 6, 6, 0]}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
