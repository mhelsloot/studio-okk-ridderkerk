import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteStructure',
  title: 'Website structuur',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Pagina’s',
      type: 'array',
      of: [defineArrayMember({type: 'levelOnePageItem'})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Website structuur',
      }
    },
  },
})
