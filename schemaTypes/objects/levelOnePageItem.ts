import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'levelOnePageItem',
  title: 'Pagina niveau 1',
  type: 'object',
  fields: [
    defineField({
      name: 'page',
      title: 'Pagina',
      type: 'reference',
      to: [{type: 'page'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'children',
      title: 'Onderliggende pagina’s',
      type: 'array',
      of: [defineArrayMember({type: 'levelTwoPageItem'})],
    }),
  ],
  preview: {
    select: {
      title: 'page.title',
      navigationTitle: 'page.navigationTitle',
    },
    prepare({title, navigationTitle}) {
      return {
        title: navigationTitle || title || 'Pagina niveau 1',
        subtitle: 'Niveau 1',
      }
    },
  },
})
