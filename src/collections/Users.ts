import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Użytkownik',
    plural: 'Użytkownicy',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Administracja',
    description: 'Administratorzy systemu',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Imię i nazwisko',
    },
  ],
}
