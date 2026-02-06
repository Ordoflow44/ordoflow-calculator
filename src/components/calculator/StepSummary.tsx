'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Download,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useCalculator } from '@/store/calculator-context'
import { calculateTotalSavings } from '@/lib/calculations'
import { CURRENCY_SYMBOLS } from '@/lib/constants'
import type { AutomationData } from '@/lib/types'
import { CountUp } from '@/components/ui/CountUp'
import { SavingsTable } from '@/components/ui/SavingsTable'
import { SavingsPieChart } from '@/components/ui/SavingsPieChart'
import { SavingsBarChart } from '@/components/ui/SavingsBarChart'

type SubmitStatus = 'idle' | 'saving' | 'sending' | 'success' | 'error'

export function StepSummary() {
  const { state, reset } = useCalculator()
  const {
    firstName,
    email,
    currency,
    hourlyRate,
    automationConfigs,
    selectedAutomationIds,
    automationsCache,
    marketingConsent,
    phone,
    company,
  } = state

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [leadId, setLeadId] = useState<number | null>(null)

  // Zbierz wszystkie wybrane automatyzacje
  const selectedAutomations = useMemo(() => {
    const allAutomations: AutomationData[] = []
    for (const automations of Object.values(automationsCache)) {
      allAutomations.push(...automations)
    }
    return allAutomations.filter((a) => selectedAutomationIds.includes(a.id))
  }, [automationsCache, selectedAutomationIds])

  // Oblicz oszczędności
  const calculations = useMemo(() => {
    return calculateTotalSavings(
      selectedAutomations,
      automationConfigs,
      hourlyRate,
      currency
    )
  }, [selectedAutomations, automationConfigs, hourlyRate, currency])

  // Wyślij lead do API przy mount
  useEffect(() => {
    if (submitStatus !== 'idle') return

    const submitLead = async () => {
      setSubmitStatus('saving')

      try {
        // Krok 1: Zapisz lead
        const leadResponse = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName,
            email,
            phone,
            company,
            currency,
            hourlyRate,
            selectedAutomations: calculations.byAutomation,
            totalSavingsWeekly: calculations.total.weekly,
            totalSavingsMonthly: calculations.total.monthly,
            totalSavingsYearly: calculations.total.yearly,
            marketingConsent,
          }),
        })

        if (!leadResponse.ok) {
          const data = await leadResponse.json()
          throw new Error(data.error || 'Błąd podczas zapisywania')
        }

        const leadData = await leadResponse.json()
        setLeadId(leadData.leadId)

        // Krok 2: Wyślij emaile
        setSubmitStatus('sending')

        const reportResponse = await fetch('/api/send-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            leadId: leadData.leadId,
            firstName,
            email,
            phone,
            company,
            currency,
            hourlyRate,
            selectedAutomations: calculations.byAutomation,
            totalSavingsWeekly: calculations.total.weekly,
            totalSavingsMonthly: calculations.total.monthly,
            totalSavingsYearly: calculations.total.yearly,
            marketingConsent,
          }),
        })

        const reportData = await reportResponse.json()

        if (reportData.clientEmail?.success) {
          setSubmitStatus('success')
          toast.success('Raport został wysłany na Twój email!', {
            duration: 5000,
          })
        } else {
          // Lead zapisany, ale email nie został wysłany
          setSubmitStatus('success')
          toast.info('Dane zapisane. Email zostanie wysłany wkrótce.', {
            duration: 5000,
          })
        }
      } catch (error) {
        console.error('Error submitting lead:', error)
        setSubmitStatus('error')
        toast.error(
          error instanceof Error
            ? error.message
            : 'Wystąpił błąd podczas zapisywania danych',
          { duration: 5000 }
        )
      }
    }

    submitLead()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Generowanie i pobieranie PDF
  const handleDownloadPDF = useCallback(async () => {
    if (isGeneratingPDF) return

    setIsGeneratingPDF(true)
    toast.info('Generowanie raportu PDF...', { duration: 2000 })

    try {
      // Dynamiczny import modułu PDF (code splitting)
      const { generatePDFReport, getPDFFileName } = await import('@/lib/pdf')

      const pdfBuffer = await generatePDFReport({
        firstName,
        currency,
        hourlyRate,
        totalWeekly: calculations.total.weekly,
        totalMonthly: calculations.total.monthly,
        totalYearly: calculations.total.yearly,
        automations: calculations.byAutomation,
        generatedAt: new Date(),
      })

      // Konwertuj Buffer na Uint8Array i utwórz blob
      const uint8Array = new Uint8Array(pdfBuffer)
      const blob = new Blob([uint8Array], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = getPDFFileName(firstName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Raport PDF został pobrany!', { duration: 3000 })
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Wystąpił błąd podczas generowania PDF', { duration: 5000 })
    } finally {
      setIsGeneratingPDF(false)
    }
  }, [firstName, currency, hourlyRate, calculations, isGeneratingPDF])

  const currencySymbol = CURRENCY_SYMBOLS[currency]

  const getStatusMessage = () => {
    switch (submitStatus) {
      case 'saving':
        return 'Zapisywanie danych...'
      case 'sending':
        return 'Wysyłanie raportu...'
      case 'success':
        return `Raport został wysłany na ${email}`
      case 'error':
        return 'Wystąpił błąd'
      default:
        return null
    }
  }

  return (
    <div className="fade-in-up space-y-8">
      {/* Nagłówek z powitaniem */}
      <div className="card p-6 lg:p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-600/10 border border-green-500/20 mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>

        <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3">
          Gratulacje, {firstName}!
        </h2>

        <p className="text-gray-400 max-w-lg mx-auto">
          Oto podsumowanie potencjalnych oszczędności z automatyzacji procesów w
          Twojej firmie.
        </p>

        {/* Status zapisu */}
        {(submitStatus === 'saving' || submitStatus === 'sending') && (
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            {getStatusMessage()}
          </div>
        )}

        {submitStatus === 'success' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" />
            {getStatusMessage()}
          </div>
        )}
      </div>

      {/* Duże liczby oszczędności */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tygodniowo */}
        <div className="card p-6 text-center group hover:glow-purple transition-all">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/20 mb-4 group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <p className="text-gray-400 text-sm mb-2">Oszczędności tygodniowe</p>
          <p className="font-display text-2xl lg:text-3xl font-bold text-white">
            <CountUp
              end={calculations.total.weekly}
              suffix={` ${currencySymbol}`}
            />
          </p>
        </div>

        {/* Miesięcznie */}
        <div className="card p-6 text-center group hover:glow-purple transition-all">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 mb-4 group-hover:scale-110 transition-transform">
            <CalendarDays className="w-6 h-6 text-cyan-400" />
          </div>
          <p className="text-gray-400 text-sm mb-2">Oszczędności miesięczne</p>
          <p className="font-display text-2xl lg:text-3xl font-bold text-white">
            <CountUp
              end={calculations.total.monthly}
              suffix={` ${currencySymbol}`}
            />
          </p>
        </div>

        {/* Rocznie - wyróżnione */}
        <div className="card p-6 text-center bg-gradient-to-br from-purple-600/20 to-cyan-600/10 border-purple-500/30 group glow-purple">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 mb-4 group-hover:scale-110 transition-transform">
            <CalendarRange className="w-6 h-6 text-purple-300" />
          </div>
          <p className="text-purple-300 text-sm mb-2">Oszczędności roczne</p>
          <p className="font-display text-3xl lg:text-4xl font-bold text-gradient">
            <CountUp
              end={calculations.total.yearly}
              suffix={` ${currencySymbol}`}
            />
          </p>
        </div>
      </div>

      {/* Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wykres kołowy - oszczędności wg kategorii */}
        <div className="card p-6">
          <SavingsPieChart
            data={calculations.byCategory}
            currency={currency}
            title="Oszczędności wg kategorii"
          />
        </div>

        {/* Wykres słupkowy - top 5 automatyzacji */}
        <div className="card p-6">
          <SavingsBarChart
            data={calculations.byAutomation}
            currency={currency}
            limit={5}
            title="Top 5 automatyzacji"
          />
        </div>
      </div>

      {/* Tabela szczegółowa */}
      <div className="card p-6">
        <h3 className="font-display text-lg font-semibold text-white mb-4">
          Szczegółowe zestawienie
        </h3>
        <SavingsTable
          automations={calculations.byAutomation}
          currency={currency}
        />
      </div>

      {/* CTA */}
      <div className="card p-8 text-center bg-gradient-to-br from-purple-600/10 to-transparent border-purple-500/20">
        <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-3">
          Gotowy, żeby zacząć oszczędzać?
        </h3>
        <p className="text-gray-400 mb-6 max-w-lg mx-auto">
          Umów bezpłatną konsultację z naszym ekspertem i dowiedz się, jak
          wdrożyć te automatyzacje w Twojej firmie.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://ordoflow.com/kontakt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Umów bezpłatną konsultację
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generowanie...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Pobierz raport PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Przycisk reset */}
      <div className="text-center">
        <button
          onClick={reset}
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Rozpocznij od nowa
        </button>
      </div>
    </div>
  )
}
