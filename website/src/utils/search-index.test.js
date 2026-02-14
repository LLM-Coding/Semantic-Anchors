import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  buildSearchIndex,
  search,
  isIndexReady,
  isIndexBuilding,
  __resetSearchIndexForTests
} from './search-index.js'

describe('search-index', () => {
  beforeEach(() => {
    __resetSearchIndexForTests()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => '= Test Anchor\n\nA practical testing method for teams.'
    })
  })

  afterEach(() => {
    delete global.fetch
  })

  it('builds index and enables full-text search', async () => {
    const anchors = [
      { id: 'tdd-london-school', title: 'TDD London', tags: ['testing'], proponents: ['Steve Freeman'] },
      { id: 'clean-architecture', title: 'Clean Architecture', tags: ['architecture'], proponents: ['Robert Martin'] }
    ]

    await buildSearchIndex(anchors)

    expect(isIndexReady()).toBe(true)
    expect(isIndexBuilding()).toBe(false)
    expect(search('london')).toContain('tdd-london-school')
    expect(search('robert')).toContain('clean-architecture')
  })

  it('returns empty results when index is not ready', () => {
    expect(isIndexReady()).toBe(false)
    expect(search('anything')).toEqual([])
  })
})
