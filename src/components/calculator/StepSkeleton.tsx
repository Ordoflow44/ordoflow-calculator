'use client'

interface StepSkeletonProps {
  variant: 'categories' | 'automations' | 'configuration'
}

export function StepSkeleton({ variant }: StepSkeletonProps) {
  if (variant === 'configuration') {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-gray-800 rounded-xl animate-pulse mx-auto" />
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mx-auto" />
          <div className="h-5 w-96 bg-gray-800/60 rounded animate-pulse mx-auto" />
        </div>

        {/* Currency selector skeleton */}
        <div className="card p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-2">
              <div className="h-4 w-16 bg-gray-800/60 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-800 rounded-lg animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-gray-800/60 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-800 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Automation config cards skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="card p-6 space-y-6"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-800/60 rounded animate-pulse" />
            </div>
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="h-4 w-64 bg-gray-800/60 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-800 rounded-full animate-pulse" />
            </div>
            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-800/60 rounded animate-pulse" />
              <div className="h-2 w-full bg-gray-800 rounded-full animate-pulse" />
            </div>
            {/* Savings */}
            <div className="pt-6 border-t border-gray-800 flex justify-between">
              <div className="h-4 w-40 bg-gray-800/60 rounded animate-pulse" />
              <div className="h-6 w-24 bg-purple-600/20 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'categories') {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-800 rounded animate-pulse" />
          <div className="h-5 w-96 bg-gray-800/60 rounded animate-pulse" />
        </div>

        {/* Grid of category cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="card p-6 space-y-3"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gray-800 rounded-xl animate-pulse" />
              {/* Title */}
              <div className="h-5 w-32 bg-gray-800 rounded animate-pulse" />
              {/* Badge */}
              <div className="h-6 w-20 bg-gray-800/60 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // variant === 'automations'
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-800 rounded animate-pulse" />
        <div className="h-5 w-96 bg-gray-800/60 rounded animate-pulse" />
      </div>

      {/* Search bar skeleton */}
      <div className="h-12 w-full max-w-md bg-gray-800 rounded-xl animate-pulse" />

      {/* Category groups */}
      {Array.from({ length: 2 }).map((_, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {/* Category header */}
          <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-800/60 rounded animate-pulse" />
          </div>

          {/* Automation cards */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="card p-4 flex items-start gap-4"
                style={{ animationDelay: `${(groupIndex * 3 + cardIndex) * 50}ms` }}
              >
                {/* Checkbox */}
                <div className="w-5 h-5 bg-gray-800 rounded animate-pulse mt-1" />
                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-800 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-800/60 rounded animate-pulse" />
                </div>
                {/* Hours badge */}
                <div className="h-6 w-16 bg-purple-600/20 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
