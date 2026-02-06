import { Suspense } from 'react'
import { Calculator } from '@/components/calculator/Calculator'
import { StepSkeleton } from '@/components/calculator/StepSkeleton'

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid-bg">
          <div className="max-w-4xl mx-auto px-6 py-12">
            <StepSkeleton variant="categories" />
          </div>
        </div>
      }
    >
      <Calculator />
    </Suspense>
  )
}
