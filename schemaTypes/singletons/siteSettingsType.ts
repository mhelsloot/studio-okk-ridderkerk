import {defineArrayMember, defineField, defineType} from 'sanity'

const richTextFields = [
  defineArrayMember({
    type: 'block',
    styles: [
      {title: 'Normale tekst', value: 'normal'},
      {title: 'Kop 2', value: 'h2'},
      {title: 'Kop 3', value: 'h3'},
      {title: 'Quote', value: 'blockquote'},
    ],
    lists: [
      {title: 'Opsomming', value: 'bullet'},
      {title: 'Genummerde lijst', value: 'number'},
    ],
    marks: {
      decorators: [
        {title: 'Vet', value: 'strong'},
        {title: 'Cursief', value: 'em'},
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          title: 'Link',
          type: 'object',
          fields: [
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.uri({
                  scheme: ['http', 'https', 'mailto', 'tel'],
                }),
            }),
          ],
        }),
      ],
    },
  }),
]

export default defineType({
  name: 'siteSettings',
  title: 'Website instellingen',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Sitetitel',
      type: 'string',
      description: 'De naam van de website, gebruikt in de browsertab en zoekmachines.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Siteomschrijving',
      type: 'text',
      rows: 3,
      description: 'Standaard meta-omschrijving voor zoekmachines.',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'metaKeywords',
      title: 'Meta zoekwoorden',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Algemene zoekwoorden voor de gehele website.',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (rule) =>
        rule.uri({
          scheme: ['https'],
        }),
    }),
    defineField({
      name: 'snelleLinks',
      title: 'Snelle links',
      type: 'array',
      description: 'Selecteer maximaal 6 pagina\'s voor snelle navigatie.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'page'}],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: 'aboutUs',
      title: 'Over ons',
      type: 'array',
      of: richTextFields,
    }),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'array',
      of: richTextFields,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Website instellingen',
      }
    },
  },
})
