import { Resend } from 'resend'
import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import ClientReportEmail from '@/emails/ClientReportEmail'
import AdminNotificationEmail from '@/emails/AdminNotificationEmail'

// Typy dla danych email
interface AutomationItem {
  automationId: string
  automationName: string
  categoryName: string
  hoursPerWeek: number
  automationPercent: number
  weekly: number
  monthly: number
  yearly: number
}

interface EmailReportData {
  leadId: number
  firstName: string
  email: string
  phone: string
  company?: string
  currency: 'PLN' | 'EUR' | 'USD'
  hourlyRate: number
  totalWeekly: number
  totalMonthly: number
  totalYearly: number
  automations: AutomationItem[]
  marketingConsent: boolean
}

// Konfiguracja Resend (produkcja)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

// Konfiguracja Nodemailer (development / fallback)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '1025', 10),
  secure: false,
  // Brak autoryzacji dla development (Mailpit)
})

const EMAIL_FROM = process.env.EMAIL_FROM || 'Ordoflow <noreply@ordoflow.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'kontakt@ordoflow.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Wysyła email do klienta z raportem oszczędności
 */
export async function sendClientReportEmail(data: EmailReportData): Promise<{ success: boolean; error?: string }> {
  const emailHtml = await render(
    ClientReportEmail({
      firstName: data.firstName,
      currency: data.currency,
      totalWeekly: data.totalWeekly,
      totalMonthly: data.totalMonthly,
      totalYearly: data.totalYearly,
      automations: data.automations.map((a) => ({
        automationName: a.automationName,
        categoryName: a.categoryName,
        hoursPerWeek: a.hoursPerWeek,
        automationPercent: a.automationPercent,
        yearly: a.yearly,
      })),
      appUrl: APP_URL,
    })
  )

  const subject = 'Twój raport oszczędności z automatyzacji - Ordoflow'

  try {
    if (resend) {
      // Produkcja - użyj Resend
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: data.email,
        subject,
        html: emailHtml,
      })

      if (error) {
        console.error('Resend error:', error)
        return { success: false, error: error.message }
      }
    } else {
      // Development - użyj Nodemailer (Mailpit)
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: data.email,
        subject,
        html: emailHtml,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nieznany błąd wysyłki',
    }
  }
}

/**
 * Wysyła powiadomienie do admina o nowym leadzie
 */
export async function sendAdminNotificationEmail(data: EmailReportData): Promise<{ success: boolean; error?: string }> {
  const emailHtml = await render(
    AdminNotificationEmail({
      leadId: data.leadId,
      firstName: data.firstName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      currency: data.currency,
      hourlyRate: data.hourlyRate,
      totalWeekly: data.totalWeekly,
      totalMonthly: data.totalMonthly,
      totalYearly: data.totalYearly,
      automations: data.automations.map((a) => ({
        automationName: a.automationName,
        categoryName: a.categoryName,
        hoursPerWeek: a.hoursPerWeek,
        automationPercent: a.automationPercent,
        yearly: a.yearly,
      })),
      marketingConsent: data.marketingConsent,
      appUrl: APP_URL,
    })
  )

  const subject = `Nowy lead z kalkulatora: ${data.firstName}${data.company ? ` (${data.company})` : ''}`

  try {
    if (resend) {
      // Produkcja - użyj Resend
      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: ADMIN_EMAIL,
        subject,
        html: emailHtml,
      })

      if (error) {
        console.error('Resend error:', error)
        return { success: false, error: error.message }
      }
    } else {
      // Development - użyj Nodemailer (Mailpit)
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: ADMIN_EMAIL,
        subject,
        html: emailHtml,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Admin email send error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nieznany błąd wysyłki',
    }
  }
}

/**
 * Wysyła oba emaile (do klienta i admina)
 */
export async function sendAllEmails(data: EmailReportData): Promise<{
  clientEmail: { success: boolean; error?: string }
  adminEmail: { success: boolean; error?: string }
}> {
  const [clientResult, adminResult] = await Promise.all([
    sendClientReportEmail(data),
    sendAdminNotificationEmail(data),
  ])

  return {
    clientEmail: clientResult,
    adminEmail: adminResult,
  }
}
