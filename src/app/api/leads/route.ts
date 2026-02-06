import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

// Schema walidacji
const leadSchema = z.object({
  firstName: z.string().min(2).max(50),
  email: z.string().email().max(100),
  phone: z.string().min(9).max(20),
  company: z.string().max(100).optional().or(z.literal('')),
  currency: z.enum(['PLN', 'EUR', 'USD']),
  hourlyRate: z.number().positive(),
  selectedAutomations: z.array(
    z.object({
      automationId: z.string(),
      automationName: z.string(),
      categoryName: z.string(),
      hoursPerWeek: z.number().positive(),
      automationPercent: z.number().min(0).max(100),
      weekly: z.number(),
      monthly: z.number(),
      yearly: z.number(),
    })
  ),
  totalSavingsWeekly: z.number(),
  totalSavingsMonthly: z.number(),
  totalSavingsYearly: z.number(),
  marketingConsent: z.boolean().optional(),
})

// Prosty rate limiting w pamięci (dla produkcji użyj Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minuta
  const maxRequests = 3

  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Wyczyść stare wpisy co 5 minut
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip)
    }
  }
}, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    // Pobierz IP
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Sprawdź rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Zbyt wiele żądań. Spróbuj ponownie za chwilę.' },
        { status: 429 }
      )
    }

    // Parsuj body
    const body = await request.json()

    // Walidacja
    const result = leadSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Niepoprawne dane',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = result.data

    // Uzyskaj instancję Payload
    const payload = await getPayload({ config })

    // Utwórz lead
    const lead = await payload.create({
      collection: 'leads',
      data: {
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        company: data.company || '',
        currency: data.currency,
        hourlyRate: data.hourlyRate,
        selectedAutomations: data.selectedAutomations,
        totalSavingsWeekly: data.totalSavingsWeekly,
        totalSavingsMonthly: data.totalSavingsMonthly,
        totalSavingsYearly: data.totalSavingsYearly,
        marketingConsent: data.marketingConsent || false,
      },
    })

    // Zwróć pełne dane potrzebne do wysyłki emaili
    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        leadData: {
          ...data,
          leadId: lead.id,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating lead:', error)

    return NextResponse.json(
      { error: 'Wystąpił błąd podczas zapisywania danych.' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
