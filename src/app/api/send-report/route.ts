import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { sendAllEmails } from '@/lib/email'

// Schema walidacji
const sendReportSchema = z.object({
  leadId: z.number(),
  firstName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string().optional(),
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

export async function POST(request: NextRequest) {
  try {
    // Parsuj body
    const body = await request.json()

    // Walidacja
    const result = sendReportSchema.safeParse(body)
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

    // Wyślij emaile
    const emailResults = await sendAllEmails({
      leadId: data.leadId,
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      currency: data.currency,
      hourlyRate: data.hourlyRate,
      totalWeekly: data.totalSavingsWeekly,
      totalMonthly: data.totalSavingsMonthly,
      totalYearly: data.totalSavingsYearly,
      automations: data.selectedAutomations,
      marketingConsent: data.marketingConsent || false,
    })

    // Zaktualizuj lead z datą wysłania raportu
    if (emailResults.clientEmail.success) {
      try {
        const payload = await getPayload({ config })
        await payload.update({
          collection: 'leads',
          id: data.leadId,
          data: {
            reportSentAt: new Date().toISOString(),
          },
        })
      } catch (updateError) {
        console.error('Error updating reportSentAt:', updateError)
        // Nie zwracamy błędu - email został wysłany
      }
    }

    return NextResponse.json({
      success: true,
      clientEmail: emailResults.clientEmail,
      adminEmail: emailResults.adminEmail,
    })
  } catch (error) {
    console.error('Error sending report:', error)

    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania raportu.' },
      { status: 500 }
    )
  }
}
