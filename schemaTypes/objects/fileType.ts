import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'fileType',
  title: 'Bestand',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Bestand',
      type: 'file',
      options: {
        accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.webp,.svg',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare({title}) {
      return {
        title: title || 'Bestand',
      }
    },
  },
})
