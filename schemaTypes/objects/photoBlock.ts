import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'photoBlock',
  title: 'Foto',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          description: 'Korte beschrijving voor toegankelijkheid en SEO.',
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Bijschrift',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      alt: 'image.alt',
      media: 'image',
    },
    prepare({title, alt, media}) {
      return {
        title: title || alt || 'Foto',
        subtitle: 'Fotoblok',
        media,
      }
    },
  },
})
