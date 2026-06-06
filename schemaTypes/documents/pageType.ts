import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Pagina',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'navigationTitle',
      title: 'Navigatietitel',
      type: 'string',
      description: 'Optioneel kortere titel voor menu’s.',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'blocks',
      title: 'Blokken',
      type: 'array',
      of: [defineArrayMember({type: 'htmlTextBlock'}), defineArrayMember({type: 'photoBlock'})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({title, slug}) {
      return {
        title: title || 'Pagina',
        subtitle: slug ? `/${slug}` : undefined,
      }
    },
  },
})
