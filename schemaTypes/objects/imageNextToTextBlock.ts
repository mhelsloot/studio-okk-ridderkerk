import {defineArrayMember, defineField, defineType} from 'sanity'

const imageWidthOptions = Array.from({length: 11}, (_, i) => {
  const value = 25 + i * 5
  return {title: `${value}%`, value}
})

export default defineType({
  name: 'imageNextToTextBlock',
  title: 'Afbeelding naast tekst',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Interne titel',
      type: 'string',
      description: 'Alleen zichtbaar in Sanity, handig om blokken te herkennen.',
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
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
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
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imagePosition',
      title: 'Positie afbeelding',
      type: 'string',
      options: {
        list: [
          {title: 'Links', value: 'left'},
          {title: 'Rechts', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'imageWidth',
      title: 'Breedte afbeelding',
      type: 'number',
      options: {
        list: imageWidthOptions,
      },
      initialValue: 50,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      imagePosition: 'imagePosition',
      imageWidth: 'imageWidth',
    },
    prepare({title, media, imagePosition, imageWidth}) {
      const position = imagePosition === 'right' ? 'rechts' : 'links'
      return {
        title: title || 'Afbeelding naast tekst',
        subtitle: `Afbeelding ${position}${imageWidth ? `, ${imageWidth}% breed` : ''}`,
        media,
      }
    },
  },
})
