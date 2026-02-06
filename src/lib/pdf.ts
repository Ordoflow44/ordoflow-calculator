import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer'
import { createElement } from 'react'

// Typy
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

interface PDFReportData {
  firstName: string
  currency: 'PLN' | 'EUR' | 'USD'
  hourlyRate: number
  totalWeekly: number
  totalMonthly: number
  totalYearly: number
  automations: AutomationItem[]
  generatedAt: Date
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

// Style PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#0A0A0F',
    color: '#F9FAFB',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2px solid #7C3AED',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 30,
  },
  savingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  savingsCard: {
    width: '30%',
    padding: 16,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    alignItems: 'center',
  },
  savingsCardHighlight: {
    width: '30%',
    padding: 16,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    alignItems: 'center',
  },
  savingsLabel: {
    fontSize: 9,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  savingsLabelHighlight: {
    fontSize: 9,
    color: '#E9D5FF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  savingsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F9FAFB',
  },
  savingsValueHighlight: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
    color: '#F9FAFB',
  },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#374151',
    padding: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #374151',
    backgroundColor: '#1F2937',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #374151',
    backgroundColor: '#111827',
  },
  tableCell: {
    fontSize: 9,
    color: '#D1D5DB',
  },
  tableCellName: {
    flex: 3,
  },
  tableCellCategory: {
    flex: 2,
  },
  tableCellNumber: {
    flex: 1,
    textAlign: 'center',
  },
  tableCellMoney: {
    flex: 1.5,
    textAlign: 'right',
    color: '#10B981',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#6B7280',
  },
  ctaSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1F2937',
    borderRadius: 8,
    borderLeft: '4px solid #7C3AED',
  },
  ctaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F9FAFB',
    marginBottom: 8,
  },
  ctaText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  ctaLink: {
    fontSize: 10,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    color: '#6B7280',
    width: 100,
  },
  infoValue: {
    fontSize: 9,
    color: '#D1D5DB',
  },
})

/**
 * Generuje raport PDF jako Buffer
 */
export async function generatePDFReport(data: PDFReportData): Promise<Buffer> {
  // Tworzymy dokument bezpośrednio zamiast przez createElement
  const document = createElement(
    Document,
    null,
    createElement(
      Page,
      { size: 'A4', style: styles.page },
      // Header
      createElement(
        View,
        { style: styles.header },
        createElement(Text, { style: styles.logo }, 'ORDOFLOW'),
        createElement(
          Text,
          { style: styles.tagline },
          'Automatyzacja procesów biznesowych'
        )
      ),

      // Tytuł
      createElement(
        Text,
        { style: styles.title },
        `Raport oszczędności dla ${data.firstName}`
      ),
      createElement(
        Text,
        { style: styles.subtitle },
        `Wygenerowano: ${data.generatedAt.toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })} | Stawka: ${formatCurrency(data.hourlyRate, data.currency)}/h`
      ),

      // Podsumowanie oszczędności
      createElement(
        View,
        { style: styles.savingsContainer },
        createElement(
          View,
          { style: styles.savingsCard },
          createElement(Text, { style: styles.savingsLabel }, 'Tygodniowo'),
          createElement(
            Text,
            { style: styles.savingsValue },
            formatCurrency(data.totalWeekly, data.currency)
          )
        ),
        createElement(
          View,
          { style: styles.savingsCard },
          createElement(Text, { style: styles.savingsLabel }, 'Miesięcznie'),
          createElement(
            Text,
            { style: styles.savingsValue },
            formatCurrency(data.totalMonthly, data.currency)
          )
        ),
        createElement(
          View,
          { style: styles.savingsCardHighlight },
          createElement(
            Text,
            { style: styles.savingsLabelHighlight },
            'Rocznie'
          ),
          createElement(
            Text,
            { style: styles.savingsValueHighlight },
            formatCurrency(data.totalYearly, data.currency)
          )
        )
      ),

      // Tabela automatyzacji
      createElement(
        Text,
        { style: styles.sectionTitle },
        `Wybrane automatyzacje (${data.automations.length})`
      ),
      createElement(
        View,
        { style: styles.table },
        // Header
        createElement(
          View,
          { style: styles.tableHeader },
          createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.tableCellName } },
            'Automatyzacja'
          ),
          createElement(
            Text,
            {
              style: { ...styles.tableHeaderCell, ...styles.tableCellCategory },
            },
            'Kategoria'
          ),
          createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.tableCellNumber } },
            'h/tyg'
          ),
          createElement(
            Text,
            { style: { ...styles.tableHeaderCell, ...styles.tableCellNumber } },
            '%'
          ),
          createElement(
            Text,
            {
              style: {
                ...styles.tableHeaderCell,
                ...styles.tableCellMoney,
                color: '#9CA3AF',
              },
            },
            'Rocznie'
          )
        ),
        // Rows - limit do 15 dla czytelności
        ...data.automations.slice(0, 15).map((item, index) =>
          createElement(
            View,
            {
              key: index,
              style: index % 2 === 0 ? styles.tableRow : styles.tableRowAlt,
            },
            createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.tableCellName } },
              item.automationName.length > 35
                ? item.automationName.substring(0, 35) + '...'
                : item.automationName
            ),
            createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.tableCellCategory } },
              item.categoryName.length > 20
                ? item.categoryName.substring(0, 20) + '...'
                : item.categoryName
            ),
            createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.tableCellNumber } },
              `${item.hoursPerWeek}h`
            ),
            createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.tableCellNumber } },
              `${item.automationPercent}%`
            ),
            createElement(
              Text,
              { style: { ...styles.tableCell, ...styles.tableCellMoney } },
              formatCurrency(item.yearly, data.currency)
            )
          )
        )
      ),

      // Info jeśli więcej automatyzacji
      data.automations.length > 15
        ? createElement(
            Text,
            { style: { fontSize: 10, color: '#6B7280', marginTop: 8, textAlign: 'center' } },
            `...i ${data.automations.length - 15} więcej automatyzacji`
          )
        : null,

      // CTA
      createElement(
        View,
        { style: styles.ctaSection },
        createElement(
          Text,
          { style: styles.ctaTitle },
          'Gotowy, żeby zacząć oszczędzać?'
        ),
        createElement(
          Text,
          { style: styles.ctaText },
          'Umów bezpłatną konsultację z naszym ekspertem i dowiedz się, jak wdrożyć te automatyzacje w Twojej firmie.'
        ),
        createElement(
          Text,
          { style: styles.ctaLink },
          'ordoflow.com/kontakt'
        )
      ),

      // Footer
      createElement(
        View,
        { style: styles.footer },
        createElement(
          Text,
          { style: styles.footerText },
          '© 2024 Ordoflow - Automatyzacja procesów biznesowych | ordoflow.com'
        )
      )
    )
  )

  const buffer = await renderToBuffer(document)
  return Buffer.from(buffer)
}

/**
 * Generuje nazwę pliku PDF
 */
export function getPDFFileName(firstName: string): string {
  const date = new Date().toISOString().split('T')[0]
  const safeName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '')
  return `ordoflow-raport-${safeName}-${date}.pdf`
}
