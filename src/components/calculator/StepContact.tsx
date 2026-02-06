'use client'

import { useState, useCallback, type FormEvent } from 'react'
import { User, Mail, Phone, Building2, AlertCircle } from 'lucide-react'
import { useCalculator } from '@/store/calculator-context'
import { WizardNavigation } from './WizardNavigation'
import { FormInput } from '@/components/ui/FormInput'
import { FormCheckbox } from '@/components/ui/FormCheckbox'
import { validateForm, type ContactFormErrors } from '@/lib/validation'

export function StepContact() {
  const {
    state,
    setContactField,
    setConsent,
    nextStep,
    canProceedToStep,
  } = useCalculator()

  const { firstName, email, phone, company, rodoConsent, marketingConsent } = state

  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [honeypot, setHoneypot] = useState('')
  const [touched, setTouched] = useState<Set<string>>(new Set())

  // Walidacja przy próbie przejścia dalej
  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()

      // Sprawdź honeypot (pole wypełnione = bot)
      if (honeypot) {
        console.warn('Bot detected')
        return
      }

      const formData = {
        firstName,
        email,
        phone,
        company: company || '',
        rodoConsent,
        marketingConsent,
      }

      const validationErrors = validateForm(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        // Oznacz wszystkie pola jako touched
        setTouched(new Set(['firstName', 'email', 'phone', 'company', 'rodoConsent']))
        return
      }

      setErrors({})
      nextStep()
    },
    [firstName, email, phone, company, rodoConsent, marketingConsent, honeypot, nextStep]
  )

  // Obsługa blur (oznacz pole jako dotknięte)
  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => new Set(prev).add(field))
  }, [])

  // Walidacja pojedynczego pola przy blur
  const validateOnBlur = useCallback(
    (field: keyof ContactFormErrors) => {
      if (!touched.has(field)) return

      const formData = {
        firstName,
        email,
        phone,
        company: company || '',
        rodoConsent,
      }

      const validationErrors = validateForm(formData)
      setErrors((prev) => ({
        ...prev,
        [field]: validationErrors[field],
      }))
    },
    [firstName, email, phone, company, rodoConsent, touched]
  )

  const canProceed = canProceedToStep(5)

  return (
    <div className="fade-in-up">
      <div className="card p-6 lg:p-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3">
            Dane kontaktowe
          </h2>
          <p className="text-gray-400">
            Podaj swoje dane, aby otrzymać szczegółowy raport oszczędności.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          {/* Honeypot field - ukryte dla użytkowników */}
          <div className="sr-only" aria-hidden="true">
            <label htmlFor="website">Website (nie wypełniaj)</label>
            <input
              type="text"
              id="website"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Imię */}
          <div className="relative">
            <div className="absolute left-4 top-[42px] text-gray-500">
              <User className="w-5 h-5" />
            </div>
            <FormInput
              label="Imię"
              type="text"
              required
              placeholder="Jan"
              value={firstName}
              onChange={(e) => setContactField('firstName', e.target.value)}
              onBlur={() => {
                handleBlur('firstName')
                validateOnBlur('firstName')
              }}
              error={touched.has('firstName') ? errors.firstName : undefined}
              className="pl-12"
              autoComplete="given-name"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute left-4 top-[42px] text-gray-500">
              <Mail className="w-5 h-5" />
            </div>
            <FormInput
              label="Adres e-mail"
              type="email"
              required
              placeholder="jan@firma.pl"
              value={email}
              onChange={(e) => setContactField('email', e.target.value)}
              onBlur={() => {
                handleBlur('email')
                validateOnBlur('email')
              }}
              error={touched.has('email') ? errors.email : undefined}
              className="pl-12"
              autoComplete="email"
            />
          </div>

          {/* Telefon */}
          <div className="relative">
            <div className="absolute left-4 top-[42px] text-gray-500">
              <Phone className="w-5 h-5" />
            </div>
            <FormInput
              label="Numer telefonu"
              type="tel"
              required
              placeholder="+48 123 456 789"
              value={phone}
              onChange={(e) => setContactField('phone', e.target.value)}
              onBlur={() => {
                handleBlur('phone')
                validateOnBlur('phone')
              }}
              error={touched.has('phone') ? errors.phone : undefined}
              className="pl-12"
              autoComplete="tel"
            />
          </div>

          {/* Firma */}
          <div className="relative">
            <div className="absolute left-4 top-[42px] text-gray-500">
              <Building2 className="w-5 h-5" />
            </div>
            <FormInput
              label="Nazwa firmy"
              type="text"
              placeholder="Opcjonalnie"
              value={company}
              onChange={(e) => setContactField('company', e.target.value)}
              className="pl-12"
              autoComplete="organization"
            />
          </div>

          {/* Separator */}
          <div className="border-t border-gray-800 my-6" />

          {/* Zgody */}
          <div className="space-y-4">
            <FormCheckbox
              label={
                <>
                  Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z{' '}
                  <a
                    href="https://ordoflow.com/polityka-prywatnosci"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Polityką Prywatności
                  </a>
                  . <span className="text-purple-400">*</span>
                </>
              }
              checked={rodoConsent}
              onChange={(e) => setConsent('rodoConsent', e.target.checked)}
              error={touched.has('rodoConsent') && !rodoConsent ? errors.rodoConsent : undefined}
            />

            <FormCheckbox
              label="Chcę otrzymywać informacje o nowościach i promocjach Ordoflow."
              checked={marketingConsent}
              onChange={(e) => setConsent('marketingConsent', e.target.checked)}
            />
          </div>

          {/* Komunikat o błędach */}
          {Object.keys(errors).length > 0 && touched.size > 0 && (
            <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">
                Uzupełnij wszystkie wymagane pola, aby kontynuować.
              </p>
            </div>
          )}

          {/* Nawigacja */}
          <div className="pt-4">
            <WizardNavigation
              showNext
              showPrev
              nextLabel="Wygeneruj raport"
              nextDisabled={!canProceed}
              onNext={handleSubmit}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
