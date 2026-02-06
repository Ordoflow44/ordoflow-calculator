'use client'

import { useEffect, useState, useCallback } from 'react'
import { FolderOpen } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'
import { CategoryCard } from '@/components/ui/CategoryCard'
import { StepSkeleton } from './StepSkeleton'
import { WizardNavigation } from './WizardNavigation'
import type { CategoryData } from '@/lib/types'

export function StepCategory() {
  const { state, toggleCategory, cacheCategories } = useCalculator()
  const { selectedCategoryIds, categoriesCache } = state

  const [categories, setCategories] = useState<CategoryData[]>(categoriesCache || [])
  const [isLoading, setIsLoading] = useState(!categoriesCache)
  const [error, setError] = useState<string | null>(null)

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch categories
      const categoriesResponse = await fetch(
        '/api/categories?where[isActive][equals]=true&sort=displayOrder&limit=100'
      )

      if (!categoriesResponse.ok) {
        throw new Error('Nie udało się pobrać kategorii')
      }

      const categoriesData = await categoriesResponse.json()
      const fetchedCategories: CategoryData[] = categoriesData.docs.map((cat: Record<string, unknown>) => ({
        id: String(cat.id),
        name: cat.name as string,
        slug: cat.slug as string,
        icon: (cat.icon as string | null) || null,
        description: (cat.description as string | null) || null,
        displayOrder: (cat.displayOrder as number) || 0,
        isActive: cat.isActive as boolean,
        automationsCount: 0, // Will be updated
      }))

      // Fetch automations count per category
      const countsPromises = fetchedCategories.map(async (cat) => {
        try {
          const response = await fetch(
            `/api/automations?where[isActive][equals]=true&where[category][equals]=${cat.id}&limit=0`
          )
          if (response.ok) {
            const data = await response.json()
            return { categoryId: cat.id, count: data.totalDocs || 0 }
          }
          return { categoryId: cat.id, count: 0 }
        } catch {
          return { categoryId: cat.id, count: 0 }
        }
      })

      const counts = await Promise.all(countsPromises)
      const countsMap = new Map(counts.map((c) => [c.categoryId, c.count]))

      // Update categories with counts
      const categoriesWithCounts = fetchedCategories.map((cat) => ({
        ...cat,
        automationsCount: countsMap.get(cat.id) || 0,
      }))

      setCategories(categoriesWithCounts)
      cacheCategories(categoriesWithCounts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania')
    } finally {
      setIsLoading(false)
    }
  }, [cacheCategories])

  useEffect(() => {
    if (!categoriesCache) {
      fetchCategories()
    }
  }, [categoriesCache, fetchCategories])

  const selectedCount = selectedCategoryIds.length
  const totalAutomations = categories
    .filter((c) => selectedCategoryIds.includes(c.id))
    .reduce((sum, c) => sum + (c.automationsCount || 0), 0)

  if (isLoading) {
    return <StepSkeleton variant="categories" />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/10 flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            Błąd ładowania
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            type="button"
            onClick={fetchCategories}
            className="btn-primary"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-white">
          Wybierz kategorie automatyzacji
        </h2>
        <p className="text-gray-400">
          Zaznacz obszary, które chcesz zautomatyzować. Możesz wybrać kilka kategorii.
        </p>
      </div>

      {/* Selection summary */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-4 p-4 bg-purple-600/10 border border-purple-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="tag">
              {selectedCount} {selectedCount === 1 ? 'kategoria' : selectedCount < 5 ? 'kategorie' : 'kategorii'}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-purple-300 text-sm">
              {totalAutomations} dostępnych automatyzacji
            </span>
          </div>
        </div>
      )}

      {/* Categories grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <CategoryCard
              category={category}
              isSelected={selectedCategoryIds.includes(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            Brak kategorii
          </h3>
          <p className="text-gray-400">
            Nie znaleziono żadnych kategorii automatyzacji.
          </p>
        </div>
      )}

      {/* Navigation */}
      <WizardNavigation showBack={false} />
    </div>
  )
}
