import type { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Ustawienia',
  admin: {
    group: 'Administracja',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description: 'Logo wyświetlane w panelu admina (zalecany rozmiar: 180x50px)',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Nazwa firmy',
      defaultValue: 'Ordoflow',
      admin: {
        description: 'Nazwa wyświetlana gdy brak logo',
      },
    },
  ],
}
