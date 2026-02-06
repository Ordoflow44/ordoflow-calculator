import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Img,
  Row,
  Column,
  Preview,
} from '@react-email/components'
import { EmailButton } from './components/EmailButton'
import { EmailFooter } from './components/EmailFooter'

interface AutomationItem {
  automationName: string
  categoryName: string
  hoursPerWeek: number
  automationPercent: number
  yearly: number
}

interface ClientReportEmailProps {
  firstName: string
  currency: 'PLN' | 'EUR' | 'USD'
  totalWeekly: number
  totalMonthly: number
  totalYearly: number
  automations: AutomationItem[]
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

export function ClientReportEmail({
  firstName,
  currency,
  totalWeekly,
  totalMonthly,
  totalYearly,
  automations,
  appUrl = 'https://ordoflow.com',
}: ClientReportEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Twój raport oszczędności: {formatCurrency(totalYearly, currency)} rocznie!
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Logo */}
          <Section style={styles.logoSection}>
            <Img
              src={`${appUrl}/logo.png`}
              alt="Ordoflow"
              width="150"
              height="40"
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Powitanie */}
          <Section style={styles.heroSection}>
            <Heading style={styles.heading}>
              Cześć, {firstName}!
            </Heading>
            <Text style={styles.text}>
              Dziękujemy za skorzystanie z naszego kalkulatora oszczędności. Poniżej znajdziesz podsumowanie potencjalnych korzyści z automatyzacji procesów w Twojej firmie.
            </Text>
          </Section>

          {/* Podsumowanie oszczędności */}
          <Section style={styles.savingsSection}>
            <Heading as="h2" style={styles.subheading}>
              Twoje potencjalne oszczędności
            </Heading>

            <Row style={{ marginBottom: '16px' }}>
              <Column style={styles.savingsCard}>
                <Text style={styles.savingsLabel}>Tygodniowo</Text>
                <Text style={styles.savingsValue}>
                  {formatCurrency(totalWeekly, currency)}
                </Text>
              </Column>
              <Column style={styles.savingsCard}>
                <Text style={styles.savingsLabel}>Miesięcznie</Text>
                <Text style={styles.savingsValue}>
                  {formatCurrency(totalMonthly, currency)}
                </Text>
              </Column>
              <Column style={styles.savingsCardHighlight}>
                <Text style={styles.savingsLabelHighlight}>Rocznie</Text>
                <Text style={styles.savingsValueHighlight}>
                  {formatCurrency(totalYearly, currency)}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Tabela automatyzacji */}
          <Section style={styles.tableSection}>
            <Heading as="h2" style={styles.subheading}>
              Wybrane automatyzacje ({automations.length})
            </Heading>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Automatyzacja</th>
                  <th style={styles.thCenter}>Godz./tyg.</th>
                  <th style={styles.thCenter}>%</th>
                  <th style={styles.thRight}>Rocznie</th>
                </tr>
              </thead>
              <tbody>
                {automations.slice(0, 10).map((item, index) => (
                  <tr key={index}>
                    <td style={styles.td}>
                      <Text style={styles.automationName}>{item.automationName}</Text>
                      <Text style={styles.categoryName}>{item.categoryName}</Text>
                    </td>
                    <td style={styles.tdCenter}>{item.hoursPerWeek}h</td>
                    <td style={styles.tdCenter}>{item.automationPercent}%</td>
                    <td style={styles.tdRight}>
                      {formatCurrency(item.yearly, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {automations.length > 10 && (
              <Text style={styles.moreText}>
                ...i {automations.length - 10} więcej automatyzacji
              </Text>
            )}
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Heading as="h2" style={styles.ctaHeading}>
              Gotowy, żeby zacząć oszczędzać?
            </Heading>
            <Text style={styles.ctaText}>
              Umów bezpłatną konsultację z naszym ekspertem i dowiedz się, jak wdrożyć te automatyzacje w Twojej firmie.
            </Text>
            <EmailButton href="https://ordoflow.com/kontakt">
              Umów bezpłatną konsultację
            </EmailButton>
          </Section>

          <EmailFooter />
        </Container>
      </Body>
    </Html>
  )
}

const styles = {
  body: {
    backgroundColor: '#0A0A0F',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: '40px 0',
  },
  container: {
    backgroundColor: '#111827',
    borderRadius: '16px',
    border: '1px solid #1F2937',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px',
  },
  logoSection: {
    textAlign: 'center' as const,
    marginBottom: '32px',
  },
  heroSection: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  heading: {
    color: '#F9FAFB',
    fontSize: '28px',
    fontWeight: 700,
    margin: '0 0 16px 0',
    lineHeight: '36px',
  },
  subheading: {
    color: '#F9FAFB',
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 20px 0',
  },
  text: {
    color: '#9CA3AF',
    fontSize: '16px',
    lineHeight: '24px',
    margin: 0,
  },
  savingsSection: {
    backgroundColor: '#1F2937',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
  },
  savingsCard: {
    textAlign: 'center' as const,
    padding: '16px',
    width: '33.33%',
  },
  savingsCardHighlight: {
    textAlign: 'center' as const,
    padding: '16px',
    width: '33.33%',
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderRadius: '8px',
  },
  savingsLabel: {
    color: '#9CA3AF',
    fontSize: '12px',
    margin: '0 0 4px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  savingsLabelHighlight: {
    color: '#A78BFA',
    fontSize: '12px',
    margin: '0 0 4px 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  savingsValue: {
    color: '#F9FAFB',
    fontSize: '20px',
    fontWeight: 700,
    margin: 0,
  },
  savingsValueHighlight: {
    color: '#A78BFA',
    fontSize: '22px',
    fontWeight: 700,
    margin: 0,
  },
  tableSection: {
    marginBottom: '32px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: '#1F2937',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    color: '#9CA3AF',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'left' as const,
    padding: '12px 16px',
    borderBottom: '1px solid #374151',
    textTransform: 'uppercase' as const,
  },
  thCenter: {
    color: '#9CA3AF',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'center' as const,
    padding: '12px 8px',
    borderBottom: '1px solid #374151',
    textTransform: 'uppercase' as const,
  },
  thRight: {
    color: '#9CA3AF',
    fontSize: '12px',
    fontWeight: 600,
    textAlign: 'right' as const,
    padding: '12px 16px',
    borderBottom: '1px solid #374151',
    textTransform: 'uppercase' as const,
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #374151',
  },
  tdCenter: {
    color: '#D1D5DB',
    fontSize: '14px',
    textAlign: 'center' as const,
    padding: '12px 8px',
    borderBottom: '1px solid #374151',
  },
  tdRight: {
    color: '#10B981',
    fontSize: '14px',
    fontWeight: 600,
    textAlign: 'right' as const,
    padding: '12px 16px',
    borderBottom: '1px solid #374151',
  },
  automationName: {
    color: '#F9FAFB',
    fontSize: '14px',
    fontWeight: 500,
    margin: '0 0 2px 0',
  },
  categoryName: {
    color: '#6B7280',
    fontSize: '12px',
    margin: 0,
  },
  moreText: {
    color: '#6B7280',
    fontSize: '14px',
    textAlign: 'center' as const,
    marginTop: '12px',
  },
  ctaSection: {
    textAlign: 'center' as const,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    borderRadius: '12px',
    padding: '32px',
    marginBottom: '24px',
  },
  ctaHeading: {
    color: '#F9FAFB',
    fontSize: '20px',
    fontWeight: 600,
    margin: '0 0 12px 0',
  },
  ctaText: {
    color: '#9CA3AF',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '0 0 20px 0',
  },
}

export default ClientReportEmail
