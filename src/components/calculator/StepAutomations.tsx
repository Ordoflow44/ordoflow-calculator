'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { Zap, CheckSquare, Square } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'
import { AutomationCard } from '@/components/ui/AutomationCard'
import { SearchInput } from '@/components/ui/SearchInput'
import { StepSkeleton } from './StepSkeleton'
import { WizardNavigation } from './WizardNavigation'
import type { AutomationData, CategoryData } from '@/lib/types'

export function StepAutomations() {
  const {
    state,
    toggleAutomation,
    selectAllInCategory,
    deselectAllInCategory,
    cacheAutomations,
  } = useCalculator()
  const {
    selectedCategoryIds,
    selectedAutomationIds,
    categoriesCache,
    automationsCache,
  } = state

  const [automations, setAutomations] = useState<AutomationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Get selected categories data
  const selectedCategories = useMemo(() => {
    if (!categoriesCache) return []
    return categoriesCache.filter((cat) => selectedCategoryIds.includes(cat.id))
  }, [categoriesCache, selectedCategoryIds])

  // Fetch automations for selected categories
  const fetchAutomations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const allAutomations: AutomationData[] = []
      const categoriesToFetch = selectedCategoryIds.filter(
        (id) => !automationsCache[id]
      )

      // Use cached data
      selectedCategoryIds.forEach((categoryId) => {
        if (automationsCache[categoryId]) {
          allAutomations.push(...automationsCache[categoryId])
        }
      })

      // Fetch missing categories
      if (categoriesToFetch.length > 0) {
        const fetchPromises = categoriesToFetch.map(async (categoryId) => {
          const response = await fetch(
            `/api/automations?where[isActive][equals]=true&where[category][equals]=${categoryId}&depth=1&limit=100`
          )

          if (!response.ok) {
            throw new Error(`Nie udało się pobrać automatyzacji dla kategorii ${categoryId}`)
          }

          const data = await response.json()
          const categoryData = selectedCategories.find((c) => c.id === categoryId)

          const automationsData: AutomationData[] = data.docs.map((auto: Record<string, unknown>) => ({
            id: String(auto.id),
            lp: (auto.lp as number) || 0,
            name: auto.name as string,
            categoryId: categoryId,
            categorySlug: categoryData?.slug || '',
            categoryName: categoryData?.name || '',
            integrations: (auto.integrations as string | null) || null,
            descriptionTechnical: (auto.descriptionTechnical as string | null) || null,
            descriptionMarketing: auto.descriptionMarketing as string,
            savingsMin: auto.savingsMin as number,
            savingsMax: auto.savingsMax as number,
            automationPercent: (auto.automationPercent as number) || 75,
            isActive: auto.isActive as boolean,
          }))

          // Cache the results
          cacheAutomations(categoryId, automationsData)

          return automationsData
        })

        const results = await Promise.all(fetchPromises)
        results.forEach((automationsData) => {
          allAutomations.push(...automationsData)
        })
      }

      // Sort by category and then by lp
      allAutomations.sort((a, b) => {
        const catIndexA = selectedCategoryIds.indexOf(a.categoryId)
        const catIndexB = selectedCategoryIds.indexOf(b.categoryId)
        if (catIndexA !== catIndexB) return catIndexA - catIndexB
        return a.lp - b.lp
      })

      setAutomations(allAutomations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategoryIds, selectedCategories, automationsCache, cacheAutomations])

  useEffect(() => {
    fetchAutomations()
  }, [fetchAutomations])

  // Filter automations by search query
  const filteredAutomations = useMemo(() => {
    if (!searchQuery.trim()) return automations

    const query = searchQuery.toLowerCase()
    return automations.filter(
      (auto) =>
        auto.name.toLowerCase().includes(query) ||
        auto.descriptionMarketing?.toLowerCase().includes(query)
    )
  }, [automations, searchQuery])

  // Group automations by category
  const groupedAutomations = useMemo(() => {
    const grouped: Record<string, { category: CategoryData; automations: AutomationData[] }> = {}

    filteredAutomations.forEach((auto) => {
      if (!grouped[auto.categoryId]) {
        const category = selectedCategories.find((c) => c.id === auto.categoryId)
        if (category) {
          grouped[auto.categoryId] = { category, automations: [] }
        }
      }
      if (grouped[auto.categoryId]) {
        grouped[auto.categoryId].automations.push(auto)
      }
    })

    return grouped
  }, [filteredAutomations, selectedCategories])

  // Check if all automations in a category are selected
  const isAllSelectedInCategory = useCallback(
    (categoryId: string) => {
      const categoryAutomations = automations.filter((a) => a.categoryId === categoryId)
      return (
        categoryAutomations.length > 0 &&
        categoryAutomations.every((a) => selectedAutomationIds.includes(a.id))
      )
    },
    [automations, selectedAutomationIds]
  )

  // Count selected in category
  const getSelectedCountInCategory = useCallback(
    (categoryId: string) => {
      return automations.filter(
        (a) => a.categoryId === categoryId && selectedAutomationIds.includes(a.id)
      ).length
    },
    [automations, selectedAutomationIds]
  )

  // Handle select all in category
  const handleSelectAllInCategory = (categoryId: string) => {
    const categoryAutomations = automations.filter((a) => a.categoryId === categoryId)
    if (isAllSelectedInCategory(categoryId)) {
      deselectAllInCategory(categoryId)
    } else {
      selectAllInCategory(categoryId, categoryAutomations)
    }
  }

  if (isLoading) {
    return <StepSkeleton variant="automations" />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/10 flex items-center justify-center">
            <Zap className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            Błąd ładowania
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button type="button" onClick={fetchAutomations} className="btn-primary">
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
          Wybierz automatyzacje
        </h2>
        <p className="text-gray-400">
          Zaznacz procesy, które chcesz zautomatyzować. Każda automatyzacja pokaże
          szacowane oszczędności czasu.
        </p>
      </div>

      {/* Search & Selection summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Szukaj automatyzacji..."
        />

        {selectedAutomationIds.length > 0 && (
          <span className="tag">
            {selectedAutomationIds.length} wybran{selectedAutomationIds.length === 1 ? 'a' : selectedAutomationIds.length < 5 ? 'e' : 'ych'}
          </span>
        )}
      </div>

      {/* Automations grouped by category */}
      {Object.entries(groupedAutomations).map(([categoryId, { category, automations: catAutomations }]) => {
        const allSelected = isAllSelectedInCategory(categoryId)
        const selectedCount = getSelectedCountInCategory(categoryId)
        const totalCount = automations.filter((a) => a.categoryId === categoryId).length

        return (
          <div key={categoryId} className="space-y-4">
            {/* Category header */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-semibold text-white">
                  {category.name}
                </h3>
                <span className="text-sm text-gray-500">
                  ({selectedCount}/{totalCount})
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSelectAllInCategory(categoryId)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {allSelected ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Odznacz wszystkie
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    Zaznacz wszystkie
                  </>
                )}
              </button>
            </div>

            {/* Automations list */}
            <div className="space-y-3">
              {catAutomations.map((automation, index) => (
                <div
                  key={automation.id}
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <AutomationCard
                    automation={automation}
                    isSelected={selectedAutomationIds.includes(automation.id)}
                    onToggle={() => toggleAutomation(automation.id, automation)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Empty state for search */}
      {filteredAutomations.length === 0 && searchQuery && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Zap className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            Brak wyników
          </h3>
          <p className="text-gray-400">
            Nie znaleziono automatyzacji pasujących do &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      {/* Empty state - no automations at all */}
      {automations.length === 0 && !searchQuery && (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <Zap className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="font-display text-xl font-semibold text-white mb-2">
            Brak automatyzacji
          </h3>
          <p className="text-gray-400">
            Nie znaleziono automatyzacji dla wybranych kategorii.
          </p>
        </div>
      )}

      {/* Navigation */}
      <WizardNavigation />
    </div>
  )
}
