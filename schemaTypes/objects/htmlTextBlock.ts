import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'htmlTextBlock',
  title: 'HTML tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Interne titel',
      type: 'string',
      description: 'Alleen zichtbaar in Sanity, handig om blokken te herkennen.',
    }),
    defineField({
      name: 'html',
      title: 'HTML',
      type: 'text',
      rows: 12,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      html: 'html',
    },
    prepare({title, html}) {
      const fallback = typeof html === 'string' ? html.replace(/<[^>]*>/g, '').trim() : ''

      return {
        title: title || fallback || 'HTML tekst',
        subtitle: 'HTML tekstblok',
      }
    },
  },
})
