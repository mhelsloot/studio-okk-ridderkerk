import {useToast} from '@sanity/ui'
import {useCallback, useState} from 'react'
import type {DocumentActionProps} from 'sanity'
import {useClient} from 'sanity'

type StructureLevel3 = {
  pageId?: string
  slug?: string
}

type StructureLevel2 = {
  pageId?: string
  slug?: string
  children?: StructureLevel3[]
}

type StructureLevel1 = {
  pageId?: string
  slug?: string
  children?: StructureLevel2[]
}

type StructureResult = {
  items?: StructureLevel1[]
}

// Fetch the structure with previewDrafts so draft pages + slugs are also included
const STRUCTURE_QUERY = `*[_id in ["siteStructure", "drafts.siteStructure"]] | order(_updatedAt desc) [0]{
  items[]{
    "pageId": page._ref,
    "slug": page->slug.current,
    children[]{
      "pageId": page._ref,
      "slug": page->slug.current,
      children[]{
        "pageId": page._ref,
        "slug": page->slug.current,
      }
    }
  }
}`

export function GenerateFullSlugsAction(_props: DocumentActionProps) {
  const client = useClient({apiVersion: '2026-06-06'})
  const toast = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const onHandle = useCallback(() => {
    setIsGenerating(true)

    async function generate() {
      // Use previewDrafts so references to draft-only pages also resolve
      const previewClient = client.withConfig({perspective: 'previewDrafts'})
      const structure = await previewClient.fetch<StructureResult>(STRUCTURE_QUERY)

      const updates: Array<{id: string; fullSlug: string}> = []

      for (const level1 of structure?.items ?? []) {
        if (!level1.pageId || !level1.slug) continue
        updates.push({id: level1.pageId, fullSlug: level1.slug})

        for (const level2 of level1.children ?? []) {
          if (!level2.pageId || !level2.slug) continue
          updates.push({id: level2.pageId, fullSlug: `${level1.slug}/${level2.slug}`})

          for (const level3 of level2.children ?? []) {
            if (!level3.pageId || !level3.slug) continue
            updates.push({
              id: level3.pageId,
              fullSlug: `${level1.slug}/${level2.slug}/${level3.slug}`,
            })
          }
        }
      }

      if (updates.length === 0) {
        toast.push({
          title: 'Geen paginas gevonden',
          description: 'Er zijn geen paginas met slugs in de structuur.',
          status: 'warning',
          duration: 4000,
        })
        return
      }

      // Check which document IDs actually exist (published + draft variants)
      const candidateIds = updates.flatMap(({id}) => [id, `drafts.${id}`])
      const existingDocs = await client.fetch<{_id: string}[]>(
        `*[_id in $ids]{_id}`,
        {ids: candidateIds},
      )
      const existingIds = new Set(existingDocs.map((d) => d._id))

      const transaction = client.transaction()
      for (const {id, fullSlug} of updates) {
        const patch = {set: {fullSlug: {_type: 'slug', current: fullSlug}}}
        if (existingIds.has(id)) {
          transaction.patch(id, patch)
        }
        if (existingIds.has(`drafts.${id}`)) {
          transaction.patch(`drafts.${id}`, patch)
        }
      }

      await transaction.commit()

      toast.push({
        title: 'Klaar',
        description: `Volledige slugs gegenereerd voor ${updates.length} pagina${updates.length === 1 ? '' : "'s"}.`,
        status: 'success',
        duration: 4000,
      })
    }

    generate()
      .catch((error: unknown) => {
        toast.push({
          title: 'Fout',
          description:
            error instanceof Error ? error.message : 'Er is een onbekende fout opgetreden.',
          status: 'error',
          duration: 6000,
        })
      })
      .finally(() => {
        setIsGenerating(false)
      })
  }, [client, toast])

  return {
    label: isGenerating ? 'Genereren...' : 'Genereer volledige slugs',
    onHandle,
    disabled: isGenerating,
    tone: 'primary' as const,
  }
}
