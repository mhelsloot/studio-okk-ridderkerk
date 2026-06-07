import {CogIcon, DocumentsIcon, EarthGlobeIcon, EditIcon, HomeIcon, MasterDetailIcon} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'
import {SiteMapPane} from './components/SiteMapPane'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .id('homepage')
        .icon(HomeIcon)
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
            .title('Homepage'),
        ),
      S.divider(),
      S.documentTypeListItem('page').title("Pagina's").icon(DocumentsIcon),
      S.divider(),
      S.listItem()
        .title('Website structuur')
        .id('siteStructure')
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title('Website structuur')
            .items([
              S.listItem()
                .title('Sitemap')
                .id('siteMap')
                .icon(MasterDetailIcon)
                .child(S.component(SiteMapPane).id('siteMap').title('Sitemap')),
              S.listItem()
                .title('Structuur bewerken')
                .id('editSiteStructure')
                .icon(EditIcon)
                .child(
                  S.document()
                    .schemaType('siteStructure')
                    .documentId('siteStructure')
                    .title('Website structuur'),
                ),
            ]),
        ),
      S.divider(),
      
      S.listItem()
        .title('Website instellingen')
        .id('siteSettings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Website instellingen'),
        ),
      S.divider(),
      
    ])
