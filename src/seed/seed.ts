import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface SeedCategory {
  name: string
  slug: string
  icon: string
  displayOrder: number
}

interface SeedAutomation {
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

interface SeedData {
  categories: SeedCategory[]
  automations: SeedAutomation[]
}

async function seed() {
  console.log('Starting seed process...\n')

  // Wczytaj dane z JSON
  const dataPath = path.resolve(__dirname, 'data.json')

  if (!fs.existsSync(dataPath)) {
    console.error('Error: data.json not found!')
    console.error('Run "pnpm parse-excel" first to generate data.json from Excel file.')
    process.exit(1)
  }

  const seedData: SeedData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  console.log(`Loaded ${seedData.categories.length} categories and ${seedData.automations.length} automations from data.json\n`)

  // Inicjalizuj Payload
  const payload = await getPayload({ config })

  // Sprawdź czy są już dane
  const existingCategories = await payload.find({
    collection: 'categories',
    limit: 1,
  })

  if (existingCategories.totalDocs > 0) {
    console.log('Database already contains data.')
    console.log('To re-seed, first delete existing categories and automations.')
    process.exit(0)
  }

  // Seeduj kategorie
  console.log('Seeding categories...')
  const categoryMap = new Map<string, number>() // slug → id

  for (const cat of seedData.categories) {
    try {
      const created = await payload.create({
        collection: 'categories',
        data: {
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          displayOrder: cat.displayOrder,
          isActive: true,
        },
      })
      categoryMap.set(cat.slug, created.id as number)
      console.log(`  ✓ ${cat.name}`)
    } catch (error) {
      console.error(`  ✗ Failed to create category "${cat.name}":`, error)
    }
  }

  console.log(`\nSeeded ${categoryMap.size} categories\n`)

  // Seeduj automatyzacje
  console.log('Seeding automations...')
  let automationsCreated = 0

  for (const auto of seedData.automations) {
    const categoryId = categoryMap.get(auto.categorySlug)

    if (!categoryId) {
      console.error(`  ✗ Category not found for automation "${auto.name}" (slug: ${auto.categorySlug})`)
      continue
    }

    try {
      await payload.create({
        collection: 'automations',
        data: {
          lp: auto.lp,
          name: auto.name,
          category: categoryId,
          integrations: auto.integrations,
          descriptionTechnical: auto.descriptionTechnical,
          descriptionMarketing: auto.descriptionMarketing,
          savingsMin: auto.savingsMin,
          savingsMax: auto.savingsMax,
          automationPercent: auto.automationPercent,
          isActive: auto.isActive,
        },
      })
      automationsCreated++

      if (automationsCreated % 10 === 0) {
        console.log(`  ... created ${automationsCreated} automations`)
      }
    } catch (error) {
      console.error(`  ✗ Failed to create automation "${auto.name}":`, error)
    }
  }

  console.log(`\nSeeded ${automationsCreated} automations`)

  // Podsumowanie
  console.log('\n--- Seed Complete ---')
  console.log(`Categories: ${categoryMap.size}`)
  console.log(`Automations: ${automationsCreated}`)

  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
