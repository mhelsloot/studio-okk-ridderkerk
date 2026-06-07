import {nlNLLocale} from '@sanity/locale-nl-nl'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {GenerateFullSlugsAction} from './components/GenerateFullSlugsAction'

export default defineConfig({
  name: 'default',
  title: 'OKK Ridderkerk',

  projectId: 'w9xl6m4j',
  dataset: 'production',

  plugins: [nlNLLocale(), structureTool({structure}), media(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, ctx) => {
      if (ctx.schemaType === 'siteStructure') {
        return [...prev, GenerateFullSlugsAction]
      }
      return prev
    },
  },
})
