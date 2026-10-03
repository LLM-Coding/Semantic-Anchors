import { describe, it, expect, vi } from 'vitest'
import { renderCardGrid, initCardGrid } from './card-grid.js'

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

describe('advisory badge', () => {
  const categories = [{ id: 'strategic-planning', name: 'Strategy' }]
  const make = (advisory) => [
    {
      id: 'eisenhower-matrix',
      title: 'Eisenhower Matrix',
      categories: ['strategic-planning'],
      roles: ['team-lead'],
      tags: [],
      proponents: [],
      ...(advisory ? { advisory } : {}),
    },
  ]

  it('renders an advisory badge with the label when anchor.advisory is set', () => {
    const html = renderCardGrid(categories, make('Use with caution: primes urgency'))
    expect(html).toContain('anchor-advisory-badge')
    expect(html).toContain('Use with caution: primes urgency')
  })

  it('does not render an advisory badge when anchor.advisory is absent', () => {
    const html = renderCardGrid(categories, make(null))
    expect(html).not.toContain('anchor-advisory-badge')
  })

  it('escapes the advisory label', () => {
    const html = renderCardGrid(categories, make('<script>x</script>'))
    expect(html).not.toContain('<script>x</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('new badge', () => {
  const categories = [{ id: 'strategic-planning', name: 'Strategy' }]
  const make = (addedAt) => [
    {
      id: 'eisenhower-matrix',
      title: 'Eisenhower Matrix',
      categories: ['strategic-planning'],
      roles: ['team-lead'],
      tags: [],
      proponents: [],
      ...(addedAt ? { addedAt } : {}),
    },
  ]
  const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

  it('renders a new badge for anchors added within 30 days', () => {
    expect(renderCardGrid(categories, make(daysAgo(5)))).toContain('anchor-new-badge')
  })

  it('does not render a new badge for anchors older than 30 days', () => {
    expect(renderCardGrid(categories, make(daysAgo(45)))).not.toContain('anchor-new-badge')
  })

  it('does not render a new badge when addedAt is absent', () => {
    expect(renderCardGrid(categories, make(null))).not.toContain('anchor-new-badge')
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

describe('hero visibility during search (#615)', () => {
  function setupDom() {
    document.body.innerHTML = `
      <section id="hero">Hero</section>
      <div class="category-section">
        <div class="anchor-card" data-roles="" data-tags="mece" data-anchor="mece" style="display: block">
          <span class="anchor-card-title">MECE</span>
        </div>
      </div>
      <span id="visible-count">0</span><span id="total-count">0</span>`
  }

  it('collapses the hero while a search query is active', async () => {
    setupDom()
    const { applyCardFilters } = await import('./card-grid.js')
    applyCardFilters('', 'mece')
    expect(document.getElementById('hero').classList.contains('hero-collapsed')).toBe(true)
  })

  it('restores the hero when the query is cleared', async () => {
    setupDom()
    const { applyCardFilters } = await import('./card-grid.js')
    applyCardFilters('', 'mece')
    applyCardFilters('', '')
    expect(document.getElementById('hero').classList.contains('hero-collapsed')).toBe(false)
  })

  it('keeps the hero visible when only the role filter is active', async () => {
    setupDom()
    const { applyCardFilters } = await import('./card-grid.js')
    applyCardFilters('software-architect', '')
    expect(document.getElementById('hero').classList.contains('hero-collapsed')).toBe(false)
  })
})

describe('recently-added filter chip', () => {
  const categories = [
    { id: 'testing-quality', name: 'Testing' },
    { id: 'design-principles', name: 'Design' },
  ]

  // 15 anchors, one day apart, newest first. RECENT_LIMIT is 12, so the three
  // oldest must fall out — that boundary is the whole point of the control.
  const day = 24 * 60 * 60 * 1000
  const anchors = Array.from({ length: 15 }, (_, i) => ({
    id: `a${i}`,
    title: `A${i}`,
    categories: [i % 2 === 0 ? 'testing-quality' : 'design-principles'],
    roles: ['r'],
    tags: [],
    proponents: [],
    addedAt: new Date(Date.now() - i * day).toISOString(),
  }))

  it('marks exactly the twelve most recently added anchors', () => {
    const html = renderCardGrid(categories, anchors)
    const marked = html.match(/data-recent="true"/g) || []
    expect(marked).toHaveLength(12)
  })

  it('marks the newest anchor and not the fifteenth', () => {
    const html = renderCardGrid(categories, anchors)
    const cardOf = (id) => {
      const start = html.indexOf(`data-anchor="${id}"`)
      expect(start).toBeGreaterThan(-1)
      return html.slice(html.lastIndexOf('<div', start), start + 400)
    }
    expect(cardOf('a0')).toContain('data-recent="true"')
    expect(cardOf('a14')).not.toContain('data-recent="true"')
  })

  it('puts the chip first in the quick-nav, ahead of the category chips', () => {
    const html = renderCardGrid(categories, anchors)
    const chip = html.indexOf('data-recent-filter')
    const firstCategory = html.indexOf('href="#category-')
    expect(chip).toBeGreaterThan(-1)
    expect(chip).toBeLessThan(firstCategory)
  })

  // The category chips are jump links. This one filters, so it must not look
  // like a link to assistive tech either — a toggle button says what it does.
  it('is a toggle button, not a jump link', () => {
    const html = renderCardGrid(categories, anchors)
    const chip = html.slice(html.indexOf('data-recent-filter') - 200)
    const el = chip.slice(0, chip.indexOf('</button>') + 9)
    expect(el).toContain('<button')
    expect(el).toContain('aria-pressed="false"')
    expect(el).not.toContain('href=')
  })

  it('omits the chip when no anchor carries a date', () => {
    const undated = anchors.map(({ addedAt: _addedAt, ...rest }) => rest)
    const html = renderCardGrid(categories, undated)
    expect(html).not.toContain('data-recent-filter')
    expect(html).not.toContain('data-recent="true"')
  })
})

describe('recently-added filter behaviour', () => {
  function setupDom() {
    document.body.innerHTML = `
      <div id="main-content">
        <nav class="category-nav">
          <ul class="category-nav-list">
            <li><button data-recent-filter aria-pressed="false" class="category-nav-link category-nav-toggle">
              <span class="category-nav-count">2</span></button></li>
            <li><a class="category-nav-link" data-category-link="c1" href="#category-c1">
              <span class="category-nav-count">2</span></a></li>
          </ul>
        </nav>
        <section class="category-section" id="category-c1">
          <div class="anchor-card" data-anchor="fresh" data-recent="true" data-roles="" data-tags="" style="display: block">
            <span class="anchor-card-title">Fresh</span>
          </div>
          <div class="anchor-card" data-anchor="old" data-roles="" data-tags="" style="display: block">
            <span class="anchor-card-title">Old</span>
          </div>
        </section>
      </div>
      <span id="visible-count">0</span><span id="total-count">0</span>`
  }

  const visibleAnchors = () =>
    Array.from(document.querySelectorAll('.anchor-card'))
      .filter((card) => card.style.display !== 'none')
      .map((card) => card.dataset.anchor)

  it('hides everything that is not recent once the chip is pressed', async () => {
    setupDom()
    const { initCardGrid } = await import('./card-grid.js')
    initCardGrid()
    document.querySelector('[data-recent-filter]').click()
    expect(visibleAnchors()).toEqual(['fresh'])
  })

  it('restores the full grid when the chip is pressed again', async () => {
    setupDom()
    const { initCardGrid } = await import('./card-grid.js')
    initCardGrid()
    const chip = document.querySelector('[data-recent-filter]')
    chip.click()
    chip.click()
    expect(visibleAnchors()).toEqual(['fresh', 'old'])
  })

  it('reports its state through aria-pressed', async () => {
    setupDom()
    const { initCardGrid } = await import('./card-grid.js')
    initCardGrid()
    const chip = document.querySelector('[data-recent-filter]')
    chip.click()
    expect(chip.getAttribute('aria-pressed')).toBe('true')
    chip.click()
    expect(chip.getAttribute('aria-pressed')).toBe('false')
  })

  it('does not open the anchor modal when the chip is clicked', async () => {
    setupDom()
    const { initCardGrid } = await import('./card-grid.js')
    initCardGrid()
    const seen = []
    document.addEventListener('anchor-selected', (e) => seen.push(e.detail.anchorId))
    document.querySelector('[data-recent-filter]').click()
    expect(seen).toEqual([])
  })
})

describe('recency selection invariant', () => {
  const day = 24 * 60 * 60 * 1000
  const categories = [
    { id: 'testing-quality', name: 'Testing' },
    { id: 'design-principles', name: 'Design' },
  ]

  // The property: however the input is shaped, exactly
  // min(12, eligible) anchors are marked — where eligible means non-umbrella
  // and carrying a parsable date. Undated, unparsable and umbrella anchors are
  // not candidates and must never appear in the marked set.
  function buildCorpus(eligibleCount, noise) {
    const eligible = Array.from({ length: eligibleCount }, (_, i) => ({
      id: `ok${i}`,
      title: `OK${i}`,
      categories: [i % 2 === 0 ? 'testing-quality' : 'design-principles'],
      roles: ['r'],
      tags: [],
      proponents: [],
      addedAt: new Date(Date.now() - i * day).toISOString(),
    }))

    const undated = {
      id: 'undated',
      title: 'U',
      categories: ['testing-quality'],
      roles: ['r'],
      tags: [],
      proponents: [],
    }
    const unparsable = { ...undated, id: 'unparsable', addedAt: 'not-a-date' }
    const sub = {
      id: 'sub',
      title: 'S',
      categories: ['design-principles'],
      roles: ['r'],
      tags: [],
      proponents: [],
      umbrella: 'ok0',
      tier: 1,
      addedAt: new Date().toISOString(),
    }

    return noise ? [...eligible, undated, unparsable, sub] : eligible
  }

  const markedIds = (html) => {
    const cards = html.match(/<div[^>]*class="anchor-card[^>]*>/g) || []
    return new Set(
      cards
        .filter((card) => card.includes('data-recent="true"'))
        .map((card) => card.match(/data-anchor="([^"]+)"/)[1])
    )
  }

  it.each([0, 1, 5, 11, 12, 13, 30])('marks min(12, eligible) for %i eligible anchors', (n) => {
    for (const noise of [false, true]) {
      const html = renderCardGrid(categories, buildCorpus(n, noise))
      const ids = markedIds(html)
      expect(ids.size).toBe(Math.min(12, n))
      for (const id of ids) expect(id.startsWith('ok')).toBe(true)
    }
  })

  it('never marks an anchor that is newer only because it is undated', () => {
    const html = renderCardGrid(categories, buildCorpus(3, true))
    const ids = markedIds(html)
    expect(ids.has('undated')).toBe(false)
    expect(ids.has('unparsable')).toBe(false)
    expect(ids.has('sub')).toBe(false)
  })

  it('marks the newest anchors, not an arbitrary twelve', () => {
    const html = renderCardGrid(categories, buildCorpus(20, true))
    const ids = markedIds(html)
    for (let i = 0; i < 12; i++) expect(ids.has(`ok${i}`)).toBe(true)
    for (let i = 12; i < 20; i++) expect(ids.has(`ok${i}`)).toBe(false)
  })
})

describe('card structure — one primary control per card (#791)', () => {
  const CATEGORIES = [{ id: 'design-principles', name: 'Design Principles' }]
  const ANCHORS = [
    {
      id: 'cqs',
      title: 'CQS',
      categories: ['design-principles'],
      roles: ['software-developer'],
      tags: [],
      proponents: [],
    },
  ]

  const mount = () => {
    document.body.innerHTML = '<div id="main-content"></div>'
    const container = document.getElementById('main-content')
    container.innerHTML = renderCardGrid(CATEGORIES, ANCHORS)
    initCardGrid()
    return container
  }

  // axe reports nested-interactive (serious, WCAG 4.1.2): a `button` role
  // exposes its descendants as presentational, so a screen reader may never
  // announce the copy buttons and the edit link that sit inside the card.
  it('does not declare the card itself a button', () => {
    const card = mount().querySelector('.anchor-card')
    expect(card.getAttribute('role')).toBeNull()
    expect(card.getAttribute('tabindex')).toBeNull()
  })

  // The card still has to be reachable and operable by keyboard. A real
  // <button> gives that for free, including Enter and Space.
  it('makes the title a real button that names the anchor', () => {
    const card = mount().querySelector('.anchor-card')
    const opener = card.querySelector('.anchor-card-title button, button.anchor-card-open')
    expect(opener).not.toBeNull()
    expect(opener.tagName).toBe('BUTTON')
    expect(opener.textContent).toContain('CQS')
  })

  it('opens the anchor when the title button is activated', () => {
    const card = mount().querySelector('.anchor-card')
    const opener = card.querySelector('.anchor-card-title button, button.anchor-card-open')
    const seen = []
    document.addEventListener('anchor-selected', (e) => seen.push(e.detail.anchorId))
    opener.click()
    expect(seen).toEqual(['cqs'])
  })

  // The keydown handler matched any Enter/Space inside the card, so a keyboard
  // user pressing Enter on a copy button copied *and* opened the modal. Only
  // the primary control may open the anchor.
  it('does not open the anchor when a copy button is used by keyboard', () => {
    const card = mount().querySelector('.anchor-card')
    const copy = card.querySelector('.anchor-copy-keyword-btn')
    expect(copy).not.toBeNull()
    const seen = []
    document.addEventListener('anchor-selected', (e) => seen.push(e.detail.anchorId))
    copy.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(seen).toEqual([])
  })
})
