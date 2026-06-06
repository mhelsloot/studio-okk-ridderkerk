import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'levelThreePageItem',
  title: 'Pagina niveau 3',
  type: 'object',
  fields: [
    defineField({
      name: 'page',
      title: 'Pagina',
      type: 'reference',
      to: [{type: 'page'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'page.title',
      navigationTitle: 'page.navigationTitle',
    },
    prepare({title, navigationTitle}) {
      return {
        title: navigationTitle || title || 'Pagina niveau 3',
        subtitle: 'Niveau 3',
      }
    },
  },
})
