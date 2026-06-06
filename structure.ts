import type {StructureResolver} from 'sanity/structure'
import {SiteMapPane} from './components/SiteMapPane'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Website structuur')
        .id('siteStructure')
        .child(
          S.list()
            .title('Website structuur')
            .items([
              S.listItem()
                .title('Sitemap')
                .id('siteMap')
                .child(S.component(SiteMapPane).id('siteMap').title('Sitemap')),
              S.listItem()
                .title('Structuur bewerken')
                .id('editSiteStructure')
                .child(
                  S.document()
                    .schemaType('siteStructure')
                    .documentId('siteStructure')
                    .title('Website structuur'),
                ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pagina’s'),
    ])
