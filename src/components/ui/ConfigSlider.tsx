'use client'

import { memo, useId } from 'react'

interface ConfigSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label: string
  unit: string
  description?: string
}

function ConfigSliderComponent({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit,
  description,
}: ConfigSliderProps) {
  const id = useId()

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value)
    if (!isNaN(newValue)) {
      // Clamp value between min and max
      const clamped = Math.min(max, Math.max(min, newValue))
      onChange(clamped)
    }
  }

  // Calculate percentage for slider fill
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-2">
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>

      {/* Slider + Input row */}
      <div className="flex items-center gap-4">
        {/* Slider */}
        <div className="flex-1 relative">
          <input
            type="range"
            id={id}
            value={value}
            onChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="config-slider w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7C3AED 0%, #7C3AED ${percentage}%, #374151 ${percentage}%, #374151 100%)`,
            }}
          />
          {/* Min/Max labels */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">
              {min}
              {unit}
            </span>
            <span className="text-xs text-gray-500">
              {max}
              {unit}
            </span>
          </div>
        </div>

        {/* Number input */}
        <div className="w-24 flex-shrink-0">
          <div className="relative">
            <input
              type="number"
              value={value}
              onChange={handleInputChange}
              min={min}
              max={max}
              step={step}
              className="w-full px-3 py-2 pr-8 bg-zinc-800 border border-white/10 rounded-lg text-white text-right font-mono text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
              {unit}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <span className="text-purple-400">💡</span>
          {description}
        </p>
      )}
    </div>
  )
}

export const ConfigSlider = memo(ConfigSliderComponent)
