import XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mapowanie kategorii na ikony Lucide
const CATEGORY_ICONS: Record<string, string> = {
  'social-media-wideo': 'Video',
  'produktywnosc-email': 'Mail',
  'content-marketing': 'FileText',
  'obsuga-klienta-crm': 'Headphones', // "Obsługa" bez ł po slugify
  'lead-generation-sprzedaz': 'Target',
  'e-commerce': 'ShoppingCart',
  'analityka-research': 'BarChart3',
  'hr-rekrutacja': 'Users',
  'zarzadzanie-trescia': 'FolderOpen',
  'marketing-analityka': 'TrendingUp',
  'finanse-analityka': 'Wallet',
  'grafika-design': 'Palette',
  'it-devops': 'Terminal',
}

interface RawAutomation {
  LP: number
  'Nazwa po polsku': string
  Kategoria: string
  Integracje: string
  'Opis działania': string
  'Opis marketingowy': string
  'Oszczędność (tyg.)': string
  Aktywna: string
}

interface ParsedCategory {
  name: string
  slug: string
  icon: string
  displayOrder: number
}

interface ParsedAutomation {
  lp: number
  name: string
  categorySlug: string
  integrations: string
  descriptionTechnical: string
  descriptionMarketing: string
  savingsMin: number
  savingsMax: number
  automationPercent: number
  isActive: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseSavings(value: string): { min: number; max: number } {
  if (!value) return { min: 0, max: 0 }

  const cleanValue = String(value).trim()

  // "8-12h" lub "8-12 h" → { min: 8, max: 12 }
  const rangeMatch = cleanValue.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*h?/i)
  if (rangeMatch) {
    return {
      min: parseFloat(rangeMatch[1]),
      max: parseFloat(rangeMatch[2]),
    }
  }

  // "1h" lub "1 h" → { min: 1, max: 1 }
  const singleMatch = cleanValue.match(/(\d+(?:\.\d+)?)\s*h?/i)
  if (singleMatch) {
    const val = parseFloat(singleMatch[1])
    return { min: val, max: val }
  }

  return { min: 0, max: 0 }
}

function parseExcel() {
  const excelPath = path.resolve(__dirname, '../../Ordoflow - Lista Automatyzacji.xlsx')

  console.log(`Reading Excel file: ${excelPath}`)

  const workbook = XLSX.readFile(excelPath)
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]

  const rawData: RawAutomation[] = XLSX.utils.sheet_to_json(worksheet)

  console.log(`Found ${rawData.length} rows in Excel`)

  // Zbierz unikalne kategorie
  const categoryMap = new Map<string, { name: string; count: number }>()

  for (const row of rawData) {
    const categoryName = row['Kategoria']?.trim()
    if (categoryName) {
      const existing = categoryMap.get(categoryName)
      if (existing) {
        existing.count++
      } else {
        categoryMap.set(categoryName, { name: categoryName, count: 1 })
      }
    }
  }

  // Sortuj kategorie po liczbie automatyzacji (malejąco)
  const sortedCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1].count - a[1].count)

  // Twórz kategorie z ikonami
  const categories: ParsedCategory[] = sortedCategories.map(([name, data], index) => {
    const slug = slugify(name)
    return {
      name: data.name,
      slug,
      icon: CATEGORY_ICONS[slug] || 'Folder',
      displayOrder: index + 1,
    }
  })

  console.log(`\nCategories (${categories.length}):`)
  categories.forEach((c) => {
    const count = categoryMap.get(c.name)?.count || 0
    console.log(`  ${c.displayOrder}. ${c.name} (${count}) - icon: ${c.icon}`)
  })

  // Parsuj automatyzacje
  const automations: ParsedAutomation[] = rawData
    .filter((row) => row['LP'] && row['Nazwa po polsku'] && row['Kategoria'])
    .map((row) => {
      const savings = parseSavings(row['Oszczędność (tyg.)'])
      return {
        lp: Number(row['LP']),
        name: row['Nazwa po polsku']?.trim() || '',
        categorySlug: slugify(row['Kategoria']?.trim() || ''),
        integrations: row['Integracje']?.trim() || '',
        descriptionTechnical: row['Opis działania']?.trim() || '',
        descriptionMarketing: row['Opis marketingowy']?.trim() || '',
        savingsMin: savings.min,
        savingsMax: savings.max,
        automationPercent: 75,
        isActive: true,
      }
    })

  console.log(`\nParsed ${automations.length} automations`)

  // Zapisz do JSON
  const outputPath = path.resolve(__dirname, 'data.json')
  const output = {
    categories,
    automations,
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`\nSaved to: ${outputPath}`)

  // Statystyki
  console.log('\n--- Statistics ---')
  console.log(`Total categories: ${categories.length}`)
  console.log(`Total automations: ${automations.length}`)

  const savingsStats = automations.reduce(
    (acc, a) => ({
      minTotal: acc.minTotal + a.savingsMin,
      maxTotal: acc.maxTotal + a.savingsMax,
    }),
    { minTotal: 0, maxTotal: 0 }
  )
  console.log(
    `Total savings range: ${savingsStats.minTotal}h - ${savingsStats.maxTotal}h per week`
  )
}

parseExcel()
