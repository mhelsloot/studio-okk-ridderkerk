import {at, defineMigration, unset} from 'sanity/migrate'

export default defineMigration({
  title: 'Verwijder showImageOnPage van pagina’s',
  documentTypes: ['page'],
  filter: 'defined(showImageOnPage)',
  migrate: {
    document() {
      return at('showImageOnPage', unset())
    },
  },
})
