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
      name: 'fullSlug',
      title: 'Volledige slug',
      type: 'slug',
      description: 'Automatisch gegenereerd via "Genereer volledige slugs" in de website structuur.',
      readOnly: true,
    }),
    defineField({
      name: 'description',
      title: 'Omschrijving',
      type: 'text',
      rows: 3,
      description: 'Meta-omschrijving voor zoekmachines.',
    }),
    defineField({
      name: 'keywords',
      title: 'Zoekwoorden',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      description: 'Zoekwoorden voor zoekmachines.',
    }),
    defineField({
      name: 'cardImage',
      title: 'Kaartafbeelding',
      type: 'image',
      options: {hotspot: true},
      description: 'Afbeelding die wordt gebruikt als kaartweergave voor deze pagina.',
    }),
    defineField({
      name: 'showImageOnPage',
      title: 'Afbeelding tonen op pagina',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'externalUrl',
      title: 'Externe URL',
      type: 'url',
      description: 'Optionele externe URL. Laat leeg voor interne pagina.',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Openen in nieuw tabblad',
      type: 'boolean',
      description: 'Wanneer aangevinkt, opent de link in een nieuw tabblad.',
      initialValue: false,
    }),
    
    defineField({
      name: 'sideBar',
      title: 'Zijbalk',
      type: 'string',
      options: {
        list: [
          {title: 'Geen', value: 'none'},
          {title: 'Laatste nieuws item', value: 'latestNewsItem'},
          {title: '5 Laatste nieuws items', value: 'latestNewsItems'},
          {title: 'Submenu', value: 'subMenu'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'subMenuPage',
      title: 'Submenu-pagina',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'Selecteer de pagina waarvan het submenu in de zijbalk getoond moet worden.',
      hidden: ({parent}) => parent?.sideBar !== 'subMenu',
      options: {disableNew: true},
    }),
    defineField({
      name: 'blocks',
      title: 'Blokken',
      type: 'array',
      of: [
        defineArrayMember({type: 'htmlTextBlock'}),
        defineArrayMember({type: 'imageNextToTextBlock'}),
        defineArrayMember({type: 'photoBlock'}),
      ],
    }),
    defineField({
      name: 'files',
      title: 'Bestanden',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'fileType'}]})],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'fullSlug.current',
    },
    prepare({title, slug}) {
      return {
        title: title || 'Pagina',
        subtitle: slug ? `/${slug}` : undefined,
      }
    },
  },
})
