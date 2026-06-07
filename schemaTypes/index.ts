import newsType from './documents/newsType'
import pageType from './documents/pageType'
import siteStructureType from './documents/siteStructureType'
import htmlTextBlock from './objects/htmlTextBlock'
import levelOnePageItem from './objects/levelOnePageItem'
import levelThreePageItem from './objects/levelThreePageItem'
import levelTwoPageItem from './objects/levelTwoPageItem'
import photoBlock from './objects/photoBlock'
import homepageType from './singletons/homepageType'
import siteSettingsType from './singletons/siteSettingsType'

export const schemaTypes = [
  siteStructureType,
  siteSettingsType,
  homepageType,
  newsType,
  pageType,
  htmlTextBlock,
  photoBlock,
  levelOnePageItem,
  levelTwoPageItem,
  levelThreePageItem,
]
