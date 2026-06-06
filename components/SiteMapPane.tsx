import {Box, Button, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useClient} from 'sanity'
import {IntentLink} from 'sanity/router'

type PageReference = {
  _id?: string
  title?: string
  navigationTitle?: string
  slug?: {
    current?: string
  }
}

type SiteMapItem = {
  _key: string
  ref?: string
  page?: PageReference
  children?: SiteMapItem[] | null
}

type SiteMapData = {
  structure?: {
    items?: SiteMapItem[] | null
  }
  pages?: PageReference[]
}

const query = `{
  "structure": *[_id == "siteStructure"][0]{
    items[]{
      _key,
      "ref": page._ref,
      page->{
        _id,
        title,
        navigationTitle,
        slug
      },
      children[]{
        _key,
        "ref": page._ref,
        page->{
          _id,
          title,
          navigationTitle,
          slug
        },
        children[]{
          _key,
          "ref": page._ref,
          page->{
            _id,
            title,
            navigationTitle,
            slug
          }
        }
      }
    }
  },
  "pages": *[_type == "page"]|order(title asc){
    _id,
    title,
    navigationTitle,
    slug
  }
}`

function getPageTitle(page?: PageReference) {
  return page?.navigationTitle || page?.title || 'Pagina zonder titel'
}

function getPageSlug(page?: PageReference) {
  return page?.slug?.current ? `/${page.slug.current}` : 'Geen slug'
}

function normalizeDocumentId(id?: string) {
  return id?.replace(/^drafts\./, '')
}

function normalizeItems(items?: SiteMapItem[] | null) {
  return Array.isArray(items) ? items : []
}

function collectPageIds(items?: SiteMapItem[] | null, pageIds = new Set<string>()) {
  for (const item of normalizeItems(items)) {
    const id = normalizeDocumentId(item.ref || item.page?._id)

    if (id) {
      pageIds.add(id)
    }

    collectPageIds(item.children, pageIds)
  }

  return pageIds
}

function SiteMapNode({item, level = 1}: {item: SiteMapItem; level?: number}) {
  const [isOpen, setIsOpen] = useState(false)
  const children = normalizeItems(item.children)
  const hasChildren = children.length > 0
  const pageId = item.page?._id

  return (
    <Stack space={2}>
      <Card border radius={2} padding={3}>
        <Flex align="flex-start" gap={2}>
          <Button
            aria-label={isOpen ? 'Onderliggende pagina’s sluiten' : 'Onderliggende pagina’s openen'}
            disabled={!hasChildren}
            mode="bleed"
            onClick={() => setIsOpen((current) => !current)}
            padding={2}
            style={{flexShrink: 0, width: 32}}
            text={hasChildren ? (isOpen ? '-' : '+') : ''}
          />
          <Box flex={1}>
            <Stack space={2}>
              <Box style={{lineHeight: '20px'}}>
                {pageId ? (
                  <IntentLink
                    intent="edit"
                    params={{id: pageId, type: 'page'}}
                    style={{display: 'inline-block', lineHeight: '20px'}}
                  >
                    <Text size={1} weight="medium">
                      {getPageTitle(item.page)}
                    </Text>
                  </IntentLink>
                ) : (
                  <Text muted size={1} weight="medium">
                    Ontbrekende pagina
                  </Text>
                )}
              </Box>
              <Text muted size={1} style={{lineHeight: '18px'}}>
                Niveau {level} · {getPageSlug(item.page)}
              </Text>
            </Stack>
          </Box>
          {pageId ? (
            <Button
              as={IntentLink}
              fontSize={1}
              intent="edit"
              mode="ghost"
              params={{id: pageId, type: 'page'}}
              style={{flexShrink: 0}}
              text="Wijzig"
            />
          ) : null}
        </Flex>
      </Card>

      {hasChildren && isOpen ? (
        <Box marginLeft={4}>
          <Stack space={2}>
            {children.map((child) => (
              <SiteMapNode item={child} key={child._key} level={level + 1} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Stack>
  )
}

export function SiteMapPane() {
  const client = useClient({apiVersion: '2026-06-06'}).withConfig({perspective: 'previewDrafts'})
  const [data, setData] = useState<SiteMapData>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>()

  const fetchData = useCallback(async () => {
    try {
      setError(undefined)
      const result = await client.fetch<SiteMapData>(query)
      setData(result)
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Kon sitemap niet ophalen.')
    } finally {
      setIsLoading(false)
    }
  }, [client])

  useEffect(() => {
    fetchData()

    const subscription = client
      .listen(`_id in ["siteStructure", "drafts.siteStructure"]`, {}, {includeResult: false})
      .subscribe(() => fetchData())

    return () => subscription.unsubscribe()
  }, [client, fetchData])

  const items = normalizeItems(data?.structure?.items)
  const unusedPages = useMemo(() => {
    const usedPageIds = collectPageIds(items)

    return (data?.pages || []).filter((page) => {
      const pageId = normalizeDocumentId(page._id)
      return pageId && !usedPageIds.has(pageId)
    })
  }, [data?.pages, items])

  return (
    <Card height="fill" overflow="auto" padding={4}>
      <Stack space={4}>
        <Flex align="center" gap={3} justify="space-between">
          <Box>
          </Box>
          <Button mode="ghost" onClick={fetchData} text="Vernieuwen" />
        </Flex>

        {isLoading ? (
          <Flex align="center" gap={3}>
            <Spinner />
            <Text muted size={1}>
              Sitemap laden...
            </Text>
          </Flex>
        ) : null}

        {error ? (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{error}</Text>
          </Card>
        ) : null}

        {!isLoading && !error && items.length === 0 ? (
          <Card border padding={3} radius={2}>
            <Stack space={3}>
              <Text muted size={1}>
                Er staat nog geen website structuur klaar.
              </Text>
              <Box>
                <IntentLink intent="edit" params={{id: 'siteStructure', type: 'siteStructure'}}>
                  Structuur bewerken
                </IntentLink>
              </Box>
            </Stack>
          </Card>
        ) : null}

        {items.length > 0 ? (
          <Stack space={2}>
            {items.map((item) => (
              <SiteMapNode item={item} key={item._key} />
            ))}
          </Stack>
        ) : null}

        {unusedPages.length > 0 ? (
          <Stack space={2}>
            <Box paddingTop={3}>
              <Text muted size={1} weight="semibold">
                Nog niet in structuur
              </Text>
            </Box>
            {unusedPages.map((page) => (
              <Card border key={page._id} padding={3} radius={2}>
                <Flex align="flex-start" gap={3}>
                  <Box flex={1}>
                    <Stack space={2}>
                      <Box style={{lineHeight: '20px'}}>
                        <IntentLink
                          intent="edit"
                          params={{id: page._id, type: 'page'}}
                          style={{display: 'inline-block', lineHeight: '20px'}}
                        >
                          <Text size={1} weight="medium">
                            {getPageTitle(page)}
                          </Text>
                        </IntentLink>
                      </Box>
                      <Text muted size={1} style={{lineHeight: '18px'}}>
                        {getPageSlug(page)}
                      </Text>
                    </Stack>
                  </Box>
                  {page._id ? (
                    <Button
                      as={IntentLink}
                      fontSize={1}
                      intent="edit"
                      mode="ghost"
                      params={{id: page._id, type: 'page'}}
                      style={{flexShrink: 0}}
                      text="Wijzig"
                    />
                  ) : null}
                </Flex>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Card>
  )
}
