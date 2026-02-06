// Schema walidacji dla formularza kontaktowego
import { z } from 'zod'

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(50, 'Imię może mieć maksymalnie 50 znaków')
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/,
      'Imię może zawierać tylko litery, spacje i myślniki'
    ),
  email: z
    .string()
    .min(1, 'Adres e-mail jest wymagany')
    .email('Podaj poprawny adres e-mail')
    .max(100, 'E-mail może mieć maksymalnie 100 znaków'),
  phone: z
    .string()
    .min(9, 'Numer telefonu musi mieć minimum 9 cyfr')
    .max(20, 'Numer telefonu może mieć maksymalnie 20 znaków')
    .regex(/^[+]?[\d\s\-()]+$/, 'Podaj poprawny numer telefonu'),
  company: z
    .string()
    .max(100, 'Nazwa firmy może mieć maksymalnie 100 znaków')
    .optional()
    .or(z.literal('')),
  rodoConsent: z.boolean().refine((val) => val === true, {
    message: 'Zgoda na przetwarzanie danych jest wymagana',
  }),
  marketingConsent: z.boolean().optional(),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export type ContactFormErrors = {
  firstName?: string
  email?: string
  phone?: string
  company?: string
  rodoConsent?: string
  marketingConsent?: string
}

// Walidacja pojedynczego pola
export function validateField(
  field: keyof ContactFormData,
  value: unknown
): string | null {
  try {
    const fieldSchema = contactFormSchema.shape[field]
    fieldSchema.parse(value)
    return null
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Niepoprawna wartość'
    }
    return 'Niepoprawna wartość'
  }
}

// Walidacja całego formularza
export function validateForm(data: Partial<ContactFormData>): ContactFormErrors {
  const errors: ContactFormErrors = {}

  const result = contactFormSchema.safeParse(data)

  if (!result.success) {
    for (const error of result.error.errors) {
      const field = error.path[0] as keyof ContactFormData
      if (!errors[field]) {
        errors[field] = error.message
      }
    }
  }

  return errors
}
