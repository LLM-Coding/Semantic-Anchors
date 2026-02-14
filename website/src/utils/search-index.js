/**
 * Search Index for full-text search across anchor content
 * Loads and indexes all .adoc files for fast searching
 */

let searchIndex = new Map() // anchorId -> searchable text
let indexReady = false
let buildingPromise = null

const BATCH_SIZE = 8

/**
 * Build search index by loading all anchor .adoc files
 */
export async function buildSearchIndex(anchors) {
  if (indexReady) return
  if (buildingPromise) return buildingPromise

  console.log('Building search index for', anchors.length, 'anchors...')

  buildingPromise = (async () => {
    for (let i = 0; i < anchors.length; i += BATCH_SIZE) {
      const batch = anchors.slice(i, i + BATCH_SIZE)
      const tasks = batch.map(async (anchor) => {
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}docs/anchors/${anchor.id}.adoc`)
          if (!response.ok) {
            console.warn(`Failed to load ${anchor.id}.adoc for indexing`)
            return
          }

          const content = await response.text()
          const searchableText = extractSearchableText(content)

          searchIndex.set(anchor.id, {
            title: anchor.title,
            content: searchableText,
            tags: anchor.tags || [],
            proponents: anchor.proponents || [],
            roles: anchor.roles || [],
            categories: anchor.categories || []
          })
        } catch (error) {
          console.warn(`Error indexing ${anchor.id}:`, error)
        }
      })

      await Promise.allSettled(tasks)
    }

    indexReady = true
    console.log('Search index built:', searchIndex.size, 'anchors indexed')
  })()

  try {
    await buildingPromise
  } finally {
    buildingPromise = null
  }
}

/**
 * Extract searchable text from AsciiDoc content
 * Removes markup but keeps text content
 */
function extractSearchableText(adocContent) {
  let text = adocContent

  // Remove document attributes
  text = text.replace(/^:[^:]+:.*$/gm, '')

  // Remove section markers (==, ===, etc.)
  text = text.replace(/^=+\s+/gm, '')

  // Remove block delimiters
  text = text.replace(/^[*_\-=]{4,}$/gm, '')

  // Remove link syntax but keep text
  text = text.replace(/link:([^\[]+)\[([^\]]+)\]/g, '$2')
  text = text.replace(/<<([^,]+),([^>]+)>>/g, '$2')
  text = text.replace(/<<([^>]+)>>/g, '$1')

  // Remove formatting but keep text
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1') // bold
  text = text.replace(/\*([^*]+)\*/g, '$1') // bold
  text = text.replace(/_([^_]+)_/g, '$1') // italic
  text = text.replace(/`([^`]+)`/g, '$1') // code

  // Remove list markers
  text = text.replace(/^[\*\-]\s+/gm, '')
  text = text.replace(/^\d+\.\s+/gm, '')

  // Remove source blocks
  text = text.replace(/\[source[^\]]*\]/g, '')

  // Normalize whitespace
  text = text.replace(/\n{3,}/g, '\n\n')
  text = text.trim()

  return text.toLowerCase()
}

/**
 * Search across indexed content
 * Returns array of matching anchor IDs
 */
export function search(query) {
  if (!indexReady) {
    console.warn('Search index not ready yet')
    return []
  }

  if (!query || query.trim() === '') {
    return []
  }

  const lowerQuery = query.toLowerCase().trim()
  const words = lowerQuery.split(/\s+/)
  const matches = []

  searchIndex.forEach((data, anchorId) => {
    let score = 0

    // Check each search word
    words.forEach(word => {
      // Title match (highest weight)
      if (data.title.toLowerCase().includes(word)) {
        score += 10
      }

      // Proponents match (high weight)
      if (data.proponents.some(p => p.toLowerCase().includes(word))) {
        score += 5
      }

      // Tags match (medium weight)
      if (data.tags.some(t => t.toLowerCase().includes(word))) {
        score += 3
      }

      // Content match (lower weight)
      if (data.content.includes(word)) {
        score += 1
      }
    })

    // Only include if all words matched
    if (score > 0 && words.every(word =>
      data.title.toLowerCase().includes(word) ||
      data.proponents.some(p => p.toLowerCase().includes(word)) ||
      data.tags.some(t => t.toLowerCase().includes(word)) ||
      data.content.includes(word)
    )) {
      matches.push({ anchorId, score })
    }
  })

  // Sort by score (highest first)
  matches.sort((a, b) => b.score - a.score)

  return matches.map(m => m.anchorId)
}

/**
 * Check if search index is ready
 */
export function isIndexReady() {
  return indexReady
}

export function isIndexBuilding() {
  return Boolean(buildingPromise)
}

/**
 * Get indexed content for an anchor (for debugging)
 */
export function getIndexedContent(anchorId) {
  return searchIndex.get(anchorId)
}

export function __resetSearchIndexForTests() {
  searchIndex = new Map()
  indexReady = false
  buildingPromise = null
}
