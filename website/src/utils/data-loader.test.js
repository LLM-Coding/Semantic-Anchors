import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  buildTreemapData,
  getAnchorsByRole,
  getAnchorsBySearch,
  getFilteredAnchors,
  getCategoryColor,
  fetchData,
  __resetDataCacheForTests
} from './data-loader.js'

const mockCategories = [
  {
    id: 'testing-quality',
    name: 'Testing & Quality',
    anchors: ['tdd-london-school', 'tdd-chicago-school', 'mutation-testing']
  },
  {
    id: 'architecture-design',
    name: 'Architecture & Design',
    anchors: ['clean-architecture', 'hexagonal-architecture']
  }
]

const mockAnchors = [
  { id: 'tdd-london-school', title: 'TDD, London School', categories: ['testing-quality'], roles: ['software-developer', 'qa-engineer'], tags: ['testing', 'tdd', 'mocking'], proponents: ['Steve Freeman', 'Nat Pryce'] },
  { id: 'tdd-chicago-school', title: 'TDD, Chicago School', categories: ['testing-quality'], roles: ['software-developer', 'qa-engineer'], tags: ['testing', 'tdd'], proponents: ['Kent Beck'] },
  { id: 'mutation-testing', title: 'Mutation Testing', categories: ['testing-quality'], roles: ['software-developer', 'qa-engineer'], tags: ['testing', 'quality'], proponents: [] },
  { id: 'clean-architecture', title: 'Clean Architecture', categories: ['architecture-design'], roles: ['software-architect', 'software-developer'], tags: ['architecture', 'design'], proponents: ['Robert C. Martin'] },
  { id: 'hexagonal-architecture', title: 'Hexagonal Architecture', categories: ['architecture-design'], roles: ['software-architect', 'software-developer'], tags: ['architecture', 'ports-and-adapters'], proponents: ['Alistair Cockburn'] }
]

const mockRoles = [
  { id: 'software-developer', name: 'Software Developer / Engineer', anchors: ['tdd-london-school', 'tdd-chicago-school', 'mutation-testing', 'clean-architecture', 'hexagonal-architecture'] },
  { id: 'qa-engineer', name: 'QA Engineer / Tester', anchors: ['tdd-london-school', 'tdd-chicago-school', 'mutation-testing'] },
  { id: 'software-architect', name: 'Software Architect', anchors: ['clean-architecture', 'hexagonal-architecture'] }
]

describe('buildTreemapData', () => {
  it('should create treemap data grouped by categories', () => {
    const result = buildTreemapData(mockCategories, mockAnchors)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Testing & Quality')
    expect(result[0].children).toHaveLength(3)
    expect(result[1].name).toBe('Architecture & Design')
    expect(result[1].children).toHaveLength(2)
  })

  it('should set value to 1 for each anchor leaf node', () => {
    const result = buildTreemapData(mockCategories, mockAnchors)

    const firstChild = result[0].children[0]
    expect(firstChild.value).toBe(1)
    expect(firstChild.id).toBeDefined()
    expect(firstChild.name).toBeDefined()
  })

  it('should include anchor metadata in leaf nodes', () => {
    const result = buildTreemapData(mockCategories, mockAnchors)

    const tddLondon = result[0].children.find(c => c.id === 'tdd-london-school')
    expect(tddLondon).toBeDefined()
    expect(tddLondon.name).toBe('TDD, London School')
    expect(tddLondon.roles).toEqual(['software-developer', 'qa-engineer'])
  })

  it('should handle empty categories gracefully', () => {
    const emptyCategories = [{ id: 'empty', name: 'Empty', anchors: [] }]
    const result = buildTreemapData(emptyCategories, mockAnchors)

    expect(result).toHaveLength(1)
    expect(result[0].children).toHaveLength(0)
  })

  it('should handle missing anchors in categories', () => {
    const categories = [{ id: 'test', name: 'Test', anchors: ['nonexistent'] }]
    const result = buildTreemapData(categories, mockAnchors)

    expect(result[0].children).toHaveLength(0)
  })
})

describe('getAnchorsByRole', () => {
  it('should filter anchors by role', () => {
    const result = getAnchorsByRole(mockAnchors, 'qa-engineer')

    expect(result).toHaveLength(3)
    expect(result.every(a => a.roles.includes('qa-engineer'))).toBe(true)
  })

  it('should return all anchors when no role specified', () => {
    const result = getAnchorsByRole(mockAnchors, '')

    expect(result).toHaveLength(5)
  })

  it('should return empty array for unknown role', () => {
    const result = getAnchorsByRole(mockAnchors, 'unknown-role')

    expect(result).toHaveLength(0)
  })
})

describe('getCategoryColor', () => {
  it('should return a consistent color for the same index', () => {
    const color1 = getCategoryColor(0)
    const color2 = getCategoryColor(0)

    expect(color1).toBe(color2)
  })

  it('should return different colors for different indices', () => {
    const color1 = getCategoryColor(0)
    const color2 = getCategoryColor(1)

    expect(color1).not.toBe(color2)
  })

  it('should wrap around for indices beyond palette length', () => {
    const color = getCategoryColor(100)
    expect(color).toBeDefined()
    expect(color).toMatch(/^#[0-9a-fA-F]{6}$/)
  })
})

describe('getAnchorsBySearch', () => {
  it('should filter anchors by title', () => {
    const result = getAnchorsBySearch(mockAnchors, 'London')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tdd-london-school')
  })

  it('should filter anchors by id', () => {
    const result = getAnchorsBySearch(mockAnchors, 'mutation')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('mutation-testing')
  })

  it('should filter anchors by tags', () => {
    const result = getAnchorsBySearch(mockAnchors, 'mocking')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('tdd-london-school')
  })

  it('should filter anchors by proponents', () => {
    const result = getAnchorsBySearch(mockAnchors, 'Martin')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('clean-architecture')
  })

  it('should be case-insensitive', () => {
    const result = getAnchorsBySearch(mockAnchors, 'ARCHITECTURE')

    expect(result).toHaveLength(2)
  })

  it('should return all anchors for empty query', () => {
    const result = getAnchorsBySearch(mockAnchors, '')

    expect(result).toHaveLength(5)
  })

  it('should trim whitespace from query', () => {
    const result = getAnchorsBySearch(mockAnchors, '  London  ')

    expect(result).toHaveLength(1)
  })

  it('should return empty array when no matches', () => {
    const result = getAnchorsBySearch(mockAnchors, 'nonexistent')

    expect(result).toHaveLength(0)
  })
})

describe('getFilteredAnchors', () => {
  it('should apply only role filter when no search query', () => {
    const result = getFilteredAnchors(mockAnchors, 'qa-engineer', '')

    expect(result).toHaveLength(3)
    expect(result.every(a => a.roles.includes('qa-engineer'))).toBe(true)
  })

  it('should apply only search filter when no role', () => {
    const result = getFilteredAnchors(mockAnchors, '', 'architecture')

    expect(result).toHaveLength(2)
  })

  it('should apply both filters when both provided', () => {
    const result = getFilteredAnchors(mockAnchors, 'software-architect', 'clean')

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('clean-architecture')
  })

  it('should return all anchors when no filters', () => {
    const result = getFilteredAnchors(mockAnchors, '', '')

    expect(result).toHaveLength(5)
  })

  it('should return empty array when filters match nothing', () => {
    const result = getFilteredAnchors(mockAnchors, 'qa-engineer', 'architecture')

    expect(result).toHaveLength(0)
  })
})

describe('fetchData', () => {
  beforeEach(() => {
    __resetDataCacheForTests()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
  })

  it('loads all datasets once and caches the result', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockAnchors })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoles })

    const first = await fetchData()
    const second = await fetchData()

    expect(first).toEqual(second)
    expect(global.fetch).toHaveBeenCalledTimes(3)
    expect(global.fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('data/anchors.json'))
    expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('data/categories.json'))
    expect(global.fetch).toHaveBeenNthCalledWith(3, expect.stringContaining('data/roles.json'))
  })

  it('throws on non-success responses', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
      .mockResolvedValueOnce({ ok: true, json: async () => mockRoles })

    await expect(fetchData()).rejects.toThrow('Failed to load data/anchors.json: 500')
  })
})
