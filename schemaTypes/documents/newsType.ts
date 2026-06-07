import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'news',
  title: 'Nieuws',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
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
      name: 'image',
      title: 'Afbeelding',
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
      name: 'date',
      title: 'Datum',
      type: 'date',
      options: {
        dateFormat: 'DD-MM-YYYY',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'introduction',
      title: 'Inleiding',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Bodytekst',
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
        defineArrayMember({
          name: 'inlineImage',
          title: 'Afbeelding',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt-tekst',
              type: 'string',
              description: 'Korte beschrijving voor toegankelijkheid en SEO.',
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
              alt: 'alt',
              media: 'asset',
            },
            prepare({title, alt, media}) {
              return {
                title: title || alt || 'Afbeelding',
                subtitle: 'Afbeelding in tekst',
                media,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare({title, date, media}) {
      return {
        title: title || 'Nieuwsartikel',
        subtitle: date || undefined,
        media,
      }
    },
  },
})
