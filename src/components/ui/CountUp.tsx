'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ANIMATION } from '@/lib/constants'

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  separator?: string
  className?: string
}

// Funkcja ease-out-quad
function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export function CountUp({
  end,
  duration = ANIMATION.NUMBER_COUNTUP,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ' ',
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  // Formatuj liczbę z separatorami
  const formatNumber = useCallback(
    (num: number) => {
      const fixed = num.toFixed(decimals)
      const [integer, decimal] = fixed.split('.')

      // Dodaj separatory tysięcy
      const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, separator)

      return decimal ? `${formatted},${decimal}` : formatted
    },
    [decimals, separator]
  )

  // Intersection Observer
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  // Animacja count-up
  useEffect(() => {
    if (!isVisible || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuad(progress)
      const currentCount = easedProgress * end

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
