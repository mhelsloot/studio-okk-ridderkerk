import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'titel',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'omschrijving',
      title: 'Omschrijving',
      type: 'array',
      of: [
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
          },
        }),
      ],
    }),
    defineField({
      name: 'afbeelding1',
      title: 'Afbeelding 1',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          description: 'Korte beschrijving voor toegankelijkheid en SEO.',
        }),
      ],
    }),
    defineField({
      name: 'afbeelding2',
      title: 'Afbeelding 2',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          description: 'Korte beschrijving voor toegankelijkheid en SEO.',
        }),
      ],
    }),
    defineField({
      name: 'afbeelding3',
      title: 'Afbeelding 3',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt-tekst',
          type: 'string',
          description: 'Korte beschrijving voor toegankelijkheid en SEO.',
        }),
      ],
    }),
    defineField({
      name: 'statistieken',
      title: 'Statistieken',
      type: 'array',
      description: 'Maximaal 4 statistieken.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statistiek',
          title: 'Statistiek',
          fields: [
            defineField({
              name: 'statistiekTitel',
              title: 'Statistiek titel',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'statistiekNummer',
              title: 'Statistiek nummer',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'statistiekNummer',
              subtitle: 'statistiekTitel',
            },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'banners',
      title: 'Banners',
      type: 'array',
      description: 'Maximaal 3 banners met links naar pagina\'s.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'page'}],
        }),
      ],
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
      }
    },
  },
})
