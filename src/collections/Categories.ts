import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Kategoria',
    plural: 'Kategorie',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'displayOrder', 'isActive'],
    group: 'Kalkulator',
    description: 'Kategorie automatyzacji wyświetlane w kalkulatorze',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nazwa kategorii',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'Unikalna nazwa URL (np. "social-media-wideo")',
      },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Ikona (Lucide)',
      admin: {
        description: 'Nazwa ikony z biblioteki Lucide React (np. "Video", "Mail", "ShoppingCart")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Opis',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Kolejność wyświetlania',
      admin: {
        description: 'Mniejsze liczby = wyżej na liście',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktywna',
      admin: {
        description: 'Nieaktywne kategorie nie są widoczne w kalkulatorze',
      },
    },
  ],
}
