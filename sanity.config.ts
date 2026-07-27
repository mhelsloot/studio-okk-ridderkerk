import {createElement} from 'react'
import {nlNLLocale} from '@sanity/locale-nl-nl'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media} from 'sanity-plugin-media'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {GenerateFullSlugsAction} from './components/GenerateFullSlugsAction'
import {TableInputWithRowControls} from './components/TableInputWithRowControls'

export default defineConfig({
  name: 'default',
  title: 'OKK Ridderkerk',

  projectId: 'w9xl6m4j',
  dataset: 'production',

  plugins: [nlNLLocale(), structureTool({structure}), media(), visionTool(), table()],

  schema: {
    types: schemaTypes,
  },

  form: {
    components: {
      input: (props) => {
        if (props.schemaType.name === 'table') {
          return createElement(TableInputWithRowControls, props as any)
        }
        return props.renderDefault(props)
      },
    },
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
