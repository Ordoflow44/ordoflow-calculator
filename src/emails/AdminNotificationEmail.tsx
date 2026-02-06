import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Link,
  Preview,
  Hr,
} from '@react-email/components'

interface AutomationItem {
  automationName: string
  categoryName: string
  hoursPerWeek: number
  automationPercent: number
  yearly: number
}

interface AdminNotificationEmailProps {
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
  appUrl?: string
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  PLN: 'zł',
  EUR: '€',
  USD: '$',
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] || currency
  const formatted = new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount))

  if (currency === 'EUR' || currency === 'USD') {
    return `${symbol}${formatted}`
  }
  return `${formatted} ${symbol}`
}

export function AdminNotificationEmail({
  leadId,
  firstName,
  email,
  phone,
  company,
  currency,
  hourlyRate,
  totalWeekly,
  totalMonthly,
  totalYearly,
  automations,
  marketingConsent,
  appUrl = 'http://localhost:3000',
}: AdminNotificationEmailProps) {
  const payloadUrl = `${appUrl}/admin/collections/leads/${leadId}`

  return (
    <Html>
      <Head />
      <Preview>
        Nowy lead: {firstName} {company ? `(${company})` : ''} - {formatCurrency(totalYearly, currency)}/rok
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Nagłówek */}
          <Section style={styles.header}>
            <Text style={styles.badge}>Nowy lead z kalkulatora</Text>
            <Heading style={styles.heading}>
              {firstName} {company ? `z ${company}` : ''}
            </Heading>
            <Text style={styles.subtext}>
              Potencjalne oszczędności: <strong style={{ color: '#10B981' }}>{formatCurrency(totalYearly, currency)}/rok</strong>
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Dane kontaktowe */}
          <Section style={styles.section}>
            <Heading as="h2" style={styles.sectionTitle}>
              Dane kontaktowe
            </Heading>
            <table style={styles.infoTable}>
              <tbody>
                <tr>
                  <td style={styles.infoLabel}>Imię:</td>
                  <td style={styles.infoValue}>{firstName}</td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}>Email:</td>
                  <td style={styles.infoValue}>
                    <Link href={`mailto:${email}`} style={styles.link}>
                      {email}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}>Telefon:</td>
                  <td style={styles.infoValue}>
                    <Link href={`tel:${phone}`} style={styles.link}>
                      {phone}
                    </Link>
                  </td>
                </tr>
                {company && (
                  <tr>
                    <td style={styles.infoLabel}>Firma:</td>
                    <td style={styles.infoValue}>{company}</td>
                  </tr>
                )}
                <tr>
                  <td style={styles.infoLabel}>Zgoda marketing:</td>
                  <td style={styles.infoValue}>
                    {marketingConsent ? (
                      <span style={{ color: '#10B981' }}>Tak</span>
                    ) : (
                      <span style={{ color: '#EF4444' }}>Nie</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={styles.hr} />

          {/* Podsumowanie finansowe */}
          <Section style={styles.section}>
            <Heading as="h2" style={styles.sectionTitle}>
              Podsumowanie finansowe
            </Heading>
            <table style={styles.infoTable}>
              <tbody>
                <tr>
                  <td style={styles.infoLabel}>Waluta:</td>
                  <td style={styles.infoValue}>{currency}</td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}>Stawka godzinowa:</td>
                  <td style={styles.infoValue}>{formatCurrency(hourlyRate, currency)}/h</td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}>Oszczędność tyg.:</td>
                  <td style={styles.infoValue}>{formatCurrency(totalWeekly, currency)}</td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}>Oszczędność mies.:</td>
                  <td style={styles.infoValue}>{formatCurrency(totalMonthly, currency)}</td>
                </tr>
                <tr>
                  <td style={styles.infoLabel}>Oszczędność roczna:</td>
                  <td style={{ ...styles.infoValue, color: '#10B981', fontWeight: 600 }}>
                    {formatCurrency(totalYearly, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={styles.hr} />

          {/* Lista automatyzacji */}
          <Section style={styles.section}>
            <Heading as="h2" style={styles.sectionTitle}>
              Wybrane automatyzacje ({automations.length})
            </Heading>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Automatyzacja</th>
                  <th style={styles.thCenter}>h/tyg</th>
                  <th style={styles.thCenter}>%</th>
                  <th style={styles.thRight}>Rocznie</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <Text style={styles.automationName}>{item.automationName}</Text>
                      <Text style={styles.categoryName}>{item.categoryName}</Text>
                    </td>
                    <td style={styles.tdCenter}>{item.hoursPerWeek}</td>
                    <td style={styles.tdCenter}>{item.automationPercent}%</td>
                    <td style={styles.tdRight}>{formatCurrency(item.yearly, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Hr style={styles.hr} />

          {/* Link do Payload */}
          <Section style={styles.ctaSection}>
            <Link href={payloadUrl} style={styles.ctaLink}>
              Zobacz szczegóły w panelu admin →
            </Link>
          </Section>

          {/* Stopka */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Wiadomość wygenerowana automatycznie przez Kalkulator Oszczędności Ordoflow
            </Text>
            <Text style={styles.footerText}>
              Lead ID: #{leadId} | {new Date().toLocaleString('pl-PL')}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: '#111827',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: '20px',
  },
  container: {
    backgroundColor: '#1F2937',
    borderRadius: '12px',
    border: '1px solid #374151',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '24px',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#7C3AED',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: '12px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 12px 0',
  },
  heading: {
    color: '#F9FAFB',
    fontSize: '24px',
    fontWeight: 700,
    margin: '0 0 8px 0',
  },
  subtext: {
    color: '#9CA3AF',
    fontSize: '16px',
    margin: 0,
  },
  hr: {
    borderColor: '#374151',
    margin: '24px 0',
  },
  section: {
    marginBottom: '8px',
  },
  sectionTitle: {
    color: '#D1D5DB',
    fontSize: '14px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    margin: '0 0 16px 0',
  },
  infoTable: {
    width: '100%',
  },
  infoLabel: {
    color: '#6B7280',
    fontSize: '14px',
    padding: '6px 0',
    width: '140px',
    verticalAlign: 'top' as const,
  },
  infoValue: {
    color: '#F9FAFB',
    fontSize: '14px',
    padding: '6px 0',
  },
  link: {
    color: '#7C3AED',
    textDecoration: 'none',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: '#111827',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    color: '#6B7280',
    fontSize: '11px',
    fontWeight: 600,
    textAlign: 'left' as const,
    padding: '10px 12px',
    borderBottom: '1px solid #374151',
    textTransform: 'uppercase' as const,
  },
  thCenter: {
    color: '#6B7280',
    fontSize: '11px',
    fontWeight: 600,
    textAlign: 'center' as const,
    padding: '10px 8px',
    borderBottom: '1px solid #374151',
    textTransform: 'uppercase' as const,
  },
  thRight: {
    color: '#6B7280',
    fontSize: '11px',
    fontWeight: 600,
    textAlign: 'right' as const,
    padding: '10px 12px',
    borderBottom: '1px solid #374151',
    textTransform: 'uppercase' as const,
  },
  td: {
    padding: '10px 12px',
    borderBottom: '1px solid #1F2937',
  },
  tdCenter: {
    color: '#9CA3AF',
    fontSize: '13px',
    textAlign: 'center' as const,
    padding: '10px 8px',
    borderBottom: '1px solid #1F2937',
  },
  tdRight: {
    color: '#10B981',
    fontSize: '13px',
    fontWeight: 500,
    textAlign: 'right' as const,
    padding: '10px 12px',
    borderBottom: '1px solid #1F2937',
  },
  automationName: {
    color: '#F9FAFB',
    fontSize: '13px',
    fontWeight: 500,
    margin: '0 0 2px 0',
  },
  categoryName: {
    color: '#6B7280',
    fontSize: '11px',
    margin: 0,
  },
  ctaSection: {
    textAlign: 'center' as const,
    padding: '16px 0',
  },
  ctaLink: {
    display: 'inline-block',
    backgroundColor: '#374151',
    color: '#F9FAFB',
    fontSize: '14px',
    fontWeight: 500,
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
  },
  footer: {
    textAlign: 'center' as const,
    marginTop: '16px',
  },
  footerText: {
    color: '#6B7280',
    fontSize: '12px',
    margin: '4px 0',
  },
}

export default AdminNotificationEmail
