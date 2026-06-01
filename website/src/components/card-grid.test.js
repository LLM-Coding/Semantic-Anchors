import { describe, it, expect, vi } from 'vitest'
import { renderCardGrid } from './card-grid.js'

// Mock i18n module
vi.mock('../i18n.js', () => ({
  i18n: {
    t: (key) => key,
  },
}))

// Mock search-index module
vi.mock('../utils/search-index.js', () => ({
  search: () => [],
  isIndexReady: () => false,
}))

describe('umbrella anchors', () => {
  it('should not render sub-anchors in the main catalog', () => {
    const categories = [{ id: 'design-principles', name: 'Design Principles' }]
    const anchors = [
      {
        id: 'gof-design-patterns',
        title: 'GoF',
        categories: ['design-principles'],
        roles: ['software-developer'],
        subAnchors: ['gof-strategy-pattern'],
        tags: [],
        proponents: [],
      },
      {
        id: 'gof-strategy-pattern',
        title: 'GoF-Strategy',
        categories: ['design-principles'],
        roles: ['software-developer'],
        umbrella: 'gof-design-patterns',
        tier: 1,
        tags: [],
        proponents: [],
      },
    ]
    const html = renderCardGrid(categories, anchors)
    expect(html).toContain('gof-design-patterns')
    expect(html).not.toContain('data-anchor="gof-strategy-pattern"')
  })

  it('should add umbrella class to umbrella cards', () => {
    const categories = [{ id: 'design-principles', name: 'Design Principles' }]
    const anchors = [
      {
        id: 'gof-design-patterns',
        title: 'GoF',
        categories: ['design-principles'],
        roles: ['software-developer'],
        subAnchors: ['gof-strategy-pattern'],
        tags: [],
        proponents: [],
      },
    ]
    const html = renderCardGrid(categories, anchors)
    expect(html).toContain('anchor-card-umbrella')
  })
})

describe('category quick-nav', () => {
  const categories = [
    { id: 'testing-quality', name: 'Testing' },
    { id: 'design-principles', name: 'Design' },
    { id: 'empty-cat', name: 'Empty' },
  ]
  const anchors = [
    {
      id: 'a1',
      title: 'A1',
      categories: ['testing-quality'],
      roles: ['r'],
      tags: [],
      proponents: [],
    },
    {
      id: 'a2',
      title: 'A2',
      categories: ['testing-quality'],
      roles: ['r'],
      tags: [],
      proponents: [],
    },
    {
      id: 'a3',
      title: 'A3',
      categories: ['design-principles'],
      roles: ['r'],
      tags: [],
      proponents: [],
    },
    {
      id: 'sub',
      title: 'Sub',
      categories: ['design-principles'],
      roles: ['r'],
      umbrella: 'a3',
      tier: 1,
      tags: [],
      proponents: [],
    },
  ]

  it('renders a quick-nav with a jump link per non-empty category', () => {
    const html = renderCardGrid(categories, anchors)
    expect(html).toContain('class="category-nav"')
    expect(html).toContain('href="#category-testing-quality"')
    expect(html).toContain('href="#category-design-principles"')
    // nav label must stay i18n-reactive on language switch
    expect(html).toContain('data-i18n-aria="nav.categoryJump"')
  })

  it('omits categories with no non-umbrella anchors from the nav', () => {
    const html = renderCardGrid(categories, anchors)
    expect(html).not.toContain('href="#category-empty-cat"')
  })

  it('shows the non-umbrella anchor count per category in the nav', () => {
    const html = renderCardGrid(categories, anchors)
    // testing-quality has 2 anchors; design-principles has 1 (sub is umbrella, excluded)
    expect(html).toMatch(/category-nav-count[^>]*>2</)
    expect(html).toMatch(/category-nav-count[^>]*>1</)
  })

  it('gives each category section a matching id as the jump target', () => {
    const html = renderCardGrid(categories, anchors)
    expect(html).toContain('id="category-testing-quality"')
    expect(html).toContain('id="category-design-principles"')
  })

  it('labels each icon-only chip with the category name for accessibility', () => {
    const html = renderCardGrid(categories, anchors)
    // icon is decorative; the name carries the accessible label (aria-label + title)
    expect(html).toContain('class="category-nav-icon"')
    expect(html).toContain('aria-label="categories.testing-quality"')
    expect(html).toContain('data-i18n-title="categories.testing-quality"')
  })
})
