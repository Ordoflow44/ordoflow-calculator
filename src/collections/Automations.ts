import type { CollectionConfig } from 'payload'

export const Automations: CollectionConfig = {
  slug: 'automations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['lp', 'name', 'category', 'savingsMin', 'savingsMax', 'isActive'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'lp',
      type: 'number',
      required: true,
      label: 'Numer porządkowy (LP)',
      admin: {
        description: 'Numer z oryginalnego arkusza',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nazwa automatyzacji',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Kategoria',
    },
    {
      name: 'integrations',
      type: 'text',
      label: 'Integracje',
      admin: {
        description: 'Lista integracji (np. "HTTP/Webhook, Sheets, Telegram, Google, AI")',
      },
    },
    {
      name: 'descriptionTechnical',
      type: 'textarea',
      label: 'Opis techniczny',
      admin: {
        description: 'Techniczny opis działania automatyzacji (nie widoczny dla klientów)',
      },
    },
    {
      name: 'descriptionMarketing',
      type: 'textarea',
      required: true,
      label: 'Opis marketingowy',
      admin: {
        description: 'Opis widoczny dla klientów w kalkulatorze',
      },
    },
    {
      name: 'savingsMin',
      type: 'number',
      required: true,
      min: 0,
      label: 'Min. oszczędność (h/tyg)',
      admin: {
        description: 'Minimalna oszczędność czasu w godzinach tygodniowo',
      },
    },
    {
      name: 'savingsMax',
      type: 'number',
      required: true,
      min: 0,
      label: 'Max. oszczędność (h/tyg)',
      admin: {
        description: 'Maksymalna oszczędność czasu w godzinach tygodniowo',
      },
    },
    {
      name: 'automationPercent',
      type: 'number',
      defaultValue: 75,
      min: 0,
      max: 100,
      label: 'Domyślny % automatyzacji',
      admin: {
        description: 'Domyślny procent automatyzacji pokazywany w kalkulatorze (0-100)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktywna',
      admin: {
        description: 'Nieaktywne automatyzacje nie są widoczne w kalkulatorze',
      },
    },
  ],
}
