import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Plik',
    plural: 'Media',
  },
  admin: {
    group: 'Administracja',
    description: 'Pliki graficzne (logo, obrazy)',
  },
  access: {
    read: () => true,
  },
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 100,
        height: 100,
        position: 'centre',
      },
      {
        name: 'logo',
        width: 300,
        height: 100,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Tekst alternatywny',
    },
  ],
}
