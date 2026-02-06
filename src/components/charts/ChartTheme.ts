// Paleta kolorów dla wykresów Recharts

export const CHART_COLORS = [
  '#7C3AED', // Purple primary
  '#06B6D4', // Cyan accent
  '#A78BFA', // Purple light
  '#F97316', // Orange accent
  '#22C55E', // Green
  '#EC4899', // Pink
  '#EAB308', // Yellow
  '#3B82F6', // Blue
  '#14B8A6', // Teal
  '#F43F5E', // Rose
] as const

// Kolor dla osi i siatki
export const AXIS_COLOR = '#4B5563' // gray-600
export const GRID_COLOR = '#374151' // gray-700
export const LABEL_COLOR = '#9CA3AF' // gray-400
export const TOOLTIP_BG = '#1F2937' // gray-800
export const TOOLTIP_BORDER = '#374151' // gray-700

// Styl tooltipów
export const tooltipStyle = {
  backgroundColor: TOOLTIP_BG,
  border: `1px solid ${TOOLTIP_BORDER}`,
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
}

// Styl legendy
export const legendStyle = {
  paddingTop: '20px',
}
