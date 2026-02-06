import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Lead',
    plural: 'Leady',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'email', 'company', 'totalSavingsYearly', 'createdAt'],
    group: 'Sprzedaż',
    description: 'Potencjalni klienci, którzy użyli kalkulatora',
  },
  access: {
    create: () => true, // Publiczny endpoint do tworzenia leadów
    read: ({ req }) => {
      // Tylko zalogowani użytkownicy mogą czytać
      return Boolean(req.user)
    },
    update: ({ req }) => {
      return Boolean(req.user)
    },
    delete: ({ req }) => {
      return Boolean(req.user)
    },
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Imię',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'company',
      type: 'text',
      label: 'Firma',
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'PLN', value: 'PLN' },
        { label: 'EUR', value: 'EUR' },
        { label: 'USD', value: 'USD' },
      ],
      defaultValue: 'PLN',
      label: 'Waluta',
    },
    {
      name: 'hourlyRate',
      type: 'number',
      label: 'Stawka godzinowa',
      admin: {
        description: 'Stawka godzinowa użyta w kalkulacji',
      },
    },
    {
      name: 'selectedAutomations',
      type: 'json',
      label: 'Wybrane automatyzacje',
      admin: {
        description: 'Konfiguracja wybranych automatyzacji (JSON)',
      },
    },
    {
      name: 'totalSavingsWeekly',
      type: 'number',
      label: 'Oszczędności tygodniowe',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalSavingsMonthly',
      type: 'number',
      label: 'Oszczędności miesięczne',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalSavingsYearly',
      type: 'number',
      label: 'Oszczędności roczne',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'reportSentAt',
      type: 'date',
      label: 'Data wysłania raportu',
      admin: {
        date: {
          displayFormat: 'd MMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'marketingConsent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Zgoda marketingowa',
    },
  ],
}
