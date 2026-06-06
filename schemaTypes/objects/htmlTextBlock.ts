import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'htmlTextBlock',
  title: 'Tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Interne titel',
      type: 'string',
      description: 'Alleen zichtbaar in Sanity, handig om blokken te herkennen.',
    }),
    defineField({
      name: 'body',
      title: 'Tekst',
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
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      body: 'body',
    },
    prepare({title, body}) {
      const fallback = Array.isArray(body)
        ? body
            .filter((block) => block._type === 'block')
            .flatMap((block) => block.children || [])
            .map((child) => child.text)
            .join(' ')
            .trim()
        : ''

      return {
        title: title || fallback || 'Tekst',
        subtitle: 'Tekstblok',
      }
    },
  },
})
