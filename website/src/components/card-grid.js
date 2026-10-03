import { i18n } from '../i18n.js'
import { search as performFullTextSearch, isIndexReady } from '../utils/search-index.js'

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// An anchor is flagged "new" for 30 days after its first commit (#652). Computed
// at render time against the current date, so the badge expires on its own.
const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000

function isRecentlyAdded(anchor) {
  if (!anchor.addedAt) return false
  const added = new Date(anchor.addedAt).getTime()
  if (Number.isNaN(added)) return false
  return Date.now() - added < NEW_WINDOW_MS
}

// The "recently added" filter shows a fixed number of newest anchors rather
// than a time window. A window empties out between release bursts, and a
// control that filters to nothing is worse than no control. The consequence is
// deliberate: the list and the NEW badge above can disagree at the edge, since
// the badge is a claim about age and this is a claim about order.
const RECENT_LIMIT = 12

// Whether the quick-nav's recency chip is pressed. Held here rather than
// passed in, because the chip lives inside this component while the role and
// search values belong to the header — applyCardFilters reads it directly.
let recentOnly = false

function recentAnchorIds(allAnchors) {
  return new Set(
    allAnchors
      .filter(
        (anchor) => !anchor.umbrella && anchor.addedAt && !Number.isNaN(Date.parse(anchor.addedAt))
      )
      .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt))
      .slice(0, RECENT_LIMIT)
      .map((anchor) => anchor.id)
  )
}

/**
 * Category color palette (matching previous categories)
 */
const CATEGORY_COLORS = {
  'communication-presentation': '#5470c6',
  'design-principles': '#91cc75',
  'development-workflow': '#fac858',
  'dialogue-interaction': '#ee6666',
  documentation: '#73c0de',
  meta: '#3ba272',
  'problem-solving': '#fc8452',
  'requirements-engineering': '#9a60b4',
  'software-architecture': '#ea7ccc',
  'statistical-methods': '#48b8d0',
  'strategic-planning': '#c23531',
  'testing-quality': '#5470c6',
}

/**
 * Category icons for better recognition
 */
const CATEGORY_ICONS = {
  'communication-presentation': '💬',
  'creative-writing': '✍️',
  'design-principles': '🎯',
  'development-workflow': '⚙️',
  'dialogue-interaction': '🤝',
  documentation: '📚',
  'knowledge-management': '🧠',
  meta: '🔍',
  'problem-solving': '💡',
  'requirements-engineering': '📋',
  'software-architecture': '🏗️',
  'statistical-methods': '📊',
  'strategic-planning': '♟️',
  'testing-quality': '🧪',
}

let feedbackData = {}

/**
 * Set feedback data for rendering vote/comment badges
 */
export function setFeedbackData(data) {
  feedbackData = data || {}
}

/**
 * Render the complete card grid
 */
export function renderCardGrid(categories, anchors) {
  if (!categories || !anchors) return '<div>Loading...</div>'

  const recent = recentAnchorIds(anchors)

  return `
    <div class="card-grid-container">
      ${renderCategoryNav(categories, anchors, recent)}
      ${categories.map((category) => renderCategorySection(category, anchors, recent)).join('')}
    </div>
  `
}

/**
 * Count the anchors that actually render in a category section — i.e. anchors
 * assigned to the category, excluding umbrella sub-anchors (which are not shown
 * as standalone cards).
 */
function countCategoryAnchors(category, allAnchors) {
  return allAnchors.filter(
    (anchor) => anchor.categories && anchor.categories.includes(category.id) && !anchor.umbrella
  ).length
}

/**
 * Render the sticky category quick-nav: one jump link per non-empty category,
 * shown as a category icon plus a live anchor count. The category name is the
 * accessible label (title + aria-label) since there is no visible text — the
 * icon itself is decorative (aria-hidden). Links are plain in-page anchors
 * (`#category-<id>`) so they work without JavaScript; the count badges are kept
 * in sync with the active search/role filter by applyCardFilters().
 */
function renderCategoryNav(categories, allAnchors, recent = new Set()) {
  const items = categories
    .map((category) => ({ category, count: countCategoryAnchors(category, allAnchors) }))
    .filter(({ count }) => count > 0)

  if (items.length === 0) return ''

  const links = items
    .map(({ category, count }) => {
      const id = escapeHtml(category.id)
      const name = i18n.t(`categories.${category.id}`) || category.name
      const icon = CATEGORY_ICONS[category.id] || '📌'
      return `
        <li>
          <a
            class="category-nav-link"
            href="#category-${id}"
            data-category-link="${id}"
            title="${escapeHtml(name)}"
            data-i18n-title="categories.${id}"
            aria-label="${escapeHtml(name)}"
            data-i18n-aria="categories.${id}"
          >
            <span class="category-nav-icon" aria-hidden="true">${icon}</span>
            <span class="category-nav-count">${count}</span>
          </a>
        </li>`
    })
    .join('')

  const recentChip =
    recent.size > 0
      ? `
        <li>
          <button
            type="button"
            class="category-nav-link category-nav-toggle"
            data-recent-filter
            aria-pressed="false"
            title="${escapeHtml(i18n.t('nav.recentlyAdded'))}"
            data-i18n-title="nav.recentlyAdded"
            aria-label="${escapeHtml(i18n.t('nav.recentlyAdded'))}"
            data-i18n-aria="nav.recentlyAdded"
          >
            <span class="category-nav-icon" aria-hidden="true">\u2728</span>
            <span class="category-nav-count">${recent.size}</span>
          </button>
        </li>`
      : ''

  return `
    <nav
      class="category-nav"
      aria-label="${escapeHtml(i18n.t('nav.categoryJump'))}"
      data-i18n-aria="nav.categoryJump"
    >
      <ul class="category-nav-list">${recentChip}${links}</ul>
    </nav>
  `
}

/**
 * Render a single category section with its anchors
 */
function renderCategorySection(category, allAnchors, recent = new Set()) {
  const categoryAnchors = allAnchors.filter(
    (anchor) => anchor.categories && anchor.categories.includes(category.id) && !anchor.umbrella
  )

  if (categoryAnchors.length === 0) return ''

  const color = CATEGORY_COLORS[category.id] || '#5470c6'
  const icon = CATEGORY_ICONS[category.id] || '📌'
  const categoryName = i18n.t(`categories.${category.id}`) || category.name

  return `
    <section class="category-section" id="category-${escapeHtml(category.id)}" data-category="${escapeHtml(category.id)}">
      <h2 class="category-heading">
        <span class="category-icon" style="background-color: ${color}">${icon}</span>
        <span data-i18n="categories.${escapeHtml(category.id)}">${escapeHtml(categoryName)}</span>
      </h2>

      <div class="anchor-cards-grid">
        ${categoryAnchors.map((anchor) => renderAnchorCard(anchor, color, category.id, recent.has(anchor.id))).join('')}
      </div>
    </section>
  `
}

/**
 * Render a single anchor card.
 *
 * The optional `categoryId` argument is used to namespace the heading id
 * used by `aria-labelledby`, since the same anchor may appear in multiple
 * category sections (anchors can belong to more than one category) and
 * the DOM must not contain duplicate ids.
 */
function renderAnchorCard(anchor, categoryColor, categoryId, isRecent = false) {
  const isUmbrella = anchor.subAnchors && anchor.subAnchors.length > 0
  const umbrellaClass = isUmbrella ? ' anchor-card-umbrella' : ''
  const rolesCount = anchor.roles ? anchor.roles.length : 0
  const githubEditUrl = `https://github.com/LLM-Coding/Semantic-Anchors/edit/main/docs/anchors/${anchor.id}.adoc`
  const roleText = rolesCount === 1 ? i18n.t('card.roles') : i18n.t('card.rolesPlural')
  const fb = feedbackData[anchor.id]

  const editTitle = i18n.t('card.edit')
  const copyLinkTitle = i18n.t('card.copyLink')
  const safeId = escapeHtml(anchor.id)
  const safeCategoryId = escapeHtml(categoryId || 'uncat')
  const cardTitleId = `anchor-card-title-${safeCategoryId}-${safeId}`

  return `
    <div
      class="anchor-card${umbrellaClass}"
      data-anchor="${safeId}"
      ${isRecent ? 'data-recent="true"' : ''}
      data-roles="${escapeHtml(anchor.roles ? anchor.roles.join(',') : '')}"
      data-tags="${escapeHtml(anchor.tags ? anchor.tags.join(',') : '')}"
    >
      <div class="anchor-card-header">
        <h3 id="${cardTitleId}" class="anchor-card-title"><button type="button" class="anchor-card-open">${escapeHtml(anchor.title)}</button>${
          isRecentlyAdded(anchor)
            ? ` <span class="anchor-new-badge" title="${escapeHtml(i18n.t('card.new'))}">${escapeHtml(i18n.t('card.new'))}</span>`
            : ''
        }</h3>
        <div class="flex gap-1">
          <button
            class="anchor-copy-keyword-btn"
            title="${escapeHtml(i18n.t('card.copyKeyword'))}"
            data-copy-keyword="${escapeHtml(anchor.title)}"
            data-i18n-title="card.copyKeyword"
            aria-label="${escapeHtml(i18n.t('card.copyKeyword'))}"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
          </button>
          <button
            class="anchor-copy-link-btn"
            title="${escapeHtml(copyLinkTitle)}"
            data-copy-link="${safeId}"
            data-i18n-title="card.copyLink"
            aria-label="${escapeHtml(copyLinkTitle)}"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </button>
          <a
            href="${escapeHtml(githubEditUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="anchor-edit-btn"
            title="${escapeHtml(editTitle)}"
            data-i18n-title="card.edit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </a>
        </div>
      </div>

      ${
        anchor.advisory
          ? `
        <div class="anchor-advisory-badge" role="note" aria-label="${escapeHtml(i18n.t('card.advisory'))}: ${escapeHtml(anchor.advisory)}"><span aria-hidden="true">⚠</span> ${escapeHtml(anchor.advisory)}</div>
      `
          : ''
      }

      ${
        anchor.proponents && anchor.proponents.length > 0
          ? `
        <p class="anchor-card-proponents">${escapeHtml(anchor.proponents.slice(0, 2).join(', '))}</p>
      `
          : ''
      }

      <div class="anchor-card-meta">
        ${
          rolesCount > 0
            ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span data-i18n-role="${rolesCount}">${rolesCount} ${roleText}</span>
          </span>
        `
            : ''
        }

        ${''}

        ${
          isUmbrella
            ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>${anchor.subAnchors.length} Sub-Anchors</span>
          </span>
        `
            : ''
        }

        ${
          fb && fb.upvotes > 1
            ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
            <span>${fb.upvotes}</span>
          </span>
        `
            : ''
        }

        ${
          fb && fb.comments > 0
            ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
            <span>${fb.comments}</span>
          </span>
        `
            : ''
        }
      </div>

      <div class="anchor-card-indicator" style="background-color: ${categoryColor}"></div>
    </div>
  `
}

// Store handler references to prevent duplicate listeners
let clickHandler = null

/**
 * Initialize card grid event handlers
 */
export function initCardGrid() {
  const container = document.getElementById('main-content')
  if (!container) return

  // The grid is re-rendered on every return to the catalog, and the fresh chip
  // comes back unpressed. Without this reset the flag would survive the markup
  // that shows it, and the grid would filter with the chip looking inactive.
  recentOnly = false

  // Remove existing listeners if any
  if (clickHandler) {
    container.removeEventListener('click', clickHandler)
  }

  // Click handler using event delegation
  clickHandler = (e) => {
    if (e.target.closest('.anchor-copy-keyword-btn')) {
      const button = e.target.closest('.anchor-copy-keyword-btn')
      const keyword = button?.dataset.copyKeyword
      if (keyword) {
        e.stopPropagation()
        window.copyAnchorKeyword(keyword)
      }
      return
    }

    if (e.target.closest('.anchor-copy-link-btn')) {
      const button = e.target.closest('.anchor-copy-link-btn')
      const anchorId = button?.dataset.copyLink
      if (anchorId) {
        e.stopPropagation()
        window.copyAnchorLink(anchorId)
      }
      return
    }

    if (e.target.closest('.anchor-edit-btn')) {
      e.stopPropagation()
      return
    }

    const recentChip = e.target.closest('[data-recent-filter]')
    if (recentChip) {
      e.stopPropagation()
      recentOnly = !recentOnly
      recentChip.setAttribute('aria-pressed', String(recentOnly))
      recentChip.classList.toggle('category-nav-toggle-active', recentOnly)
      reapplyCurrentFilters()
      return
    }

    const card = e.target.closest('.anchor-card')
    if (card) {
      const anchorId = card.dataset.anchor
      const event = new CustomEvent('anchor-selected', {
        detail: { anchorId },
      })
      document.dispatchEvent(event)
    }
  }
  container.addEventListener('click', clickHandler)
}

/**
 * Filter cards by role
 */
export function filterCardsByRole(roleId) {
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  cards.forEach((card) => {
    const roles = card.dataset.roles.split(',').filter(Boolean)
    const matches = !roleId || roles.includes(roleId)
    card.style.display = matches ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach((section) => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card')).filter(
      (card) => card.style.display !== 'none'
    )
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}

/**
 * Filter cards by search query
 */
export function filterCardsBySearch(query) {
  if (!query || query.trim() === '') {
    // Show all
    document.querySelectorAll('.anchor-card, .category-section').forEach((el) => {
      el.style.display = 'block'
    })
    return
  }

  const lowerQuery = query.toLowerCase().trim()
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  cards.forEach((card) => {
    const title = card.querySelector('.anchor-card-title').textContent.toLowerCase()
    const tags = card.dataset.tags.toLowerCase()
    const anchorId = card.dataset.anchor.toLowerCase()

    const matches =
      title.includes(lowerQuery) || tags.includes(lowerQuery) || anchorId.includes(lowerQuery)

    card.style.display = matches ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach((section) => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card')).filter(
      (card) => card.style.display !== 'none'
    )
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}

/**
 * Re-run the filters after the recency chip toggled. The role and search
 * values live in the header inputs, which own that state; reading them back is
 * how main.js does it too, so there is one source rather than a mirrored copy
 * that can fall behind.
 */
function reapplyCurrentFilters() {
  const roleId =
    document.getElementById('header-role-filter')?.value ||
    document.getElementById('role-filter')?.value ||
    ''
  const query =
    document.getElementById('header-search-input')?.value ||
    document.getElementById('search-input')?.value ||
    ''
  applyCardFilters(roleId, query)
}

/**
 * Apply combined filters (role + search + recency)
 */
export function applyCardFilters(roleId, searchQuery) {
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  const lowerQuery = searchQuery ? searchQuery.toLowerCase().trim() : ''

  // An active search hides the hero so the results sit directly under the
  // header instead of below the fold; clearing the query restores it. The
  // role filter alone deliberately leaves the hero in place (#615).
  const hero = document.getElementById('hero')
  if (hero) hero.classList.toggle('hero-collapsed', !!lowerQuery)

  // Use full-text search if index is ready and query exists
  let matchingAnchorIds = null
  if (lowerQuery && isIndexReady()) {
    matchingAnchorIds = new Set(performFullTextSearch(lowerQuery))
  }

  let visibleCount = 0

  cards.forEach((card) => {
    // Role filter
    const roles = card.dataset.roles.split(',').filter(Boolean)
    const roleMatch = !roleId || roles.includes(roleId)

    // Search filter
    let searchMatch = true
    if (lowerQuery) {
      if (matchingAnchorIds) {
        // Use full-text search results
        searchMatch = matchingAnchorIds.has(card.dataset.anchor)
      } else {
        // Fallback to simple search (if index not ready yet)
        const title = card.querySelector('.anchor-card-title').textContent.toLowerCase()
        const tags = card.dataset.tags.toLowerCase()
        const anchorId = card.dataset.anchor.toLowerCase()
        searchMatch =
          title.includes(lowerQuery) || tags.includes(lowerQuery) || anchorId.includes(lowerQuery)
      }
    }

    const recentMatch = !recentOnly || card.dataset.recent === 'true'

    const isVisible = roleMatch && searchMatch && recentMatch
    card.style.display = isVisible ? 'block' : 'none'
    if (isVisible) visibleCount++
  })

  // Hide empty sections
  sections.forEach((section) => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card')).filter(
      (card) => card.style.display !== 'none'
    )
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })

  // Keep the quick-nav in sync: hide chips for emptied categories, refresh counts
  syncCategoryNav()

  // Update counter
  updateAnchorCount(visibleCount, cards.length)
}

/**
 * Sync the category quick-nav with the currently visible cards: hide the chip
 * for any category whose section has no visible cards, and update each chip's
 * count to the number of visible cards in its section.
 */
function syncCategoryNav() {
  document.querySelectorAll('.category-nav-link').forEach((link) => {
    const id = link.dataset.categoryLink
    const section = document.getElementById(`category-${id}`)
    if (!section) return

    const visible = Array.from(section.querySelectorAll('.anchor-card')).filter(
      (card) => card.style.display !== 'none'
    ).length

    const item = link.closest('li')
    if (item) item.style.display = visible > 0 ? '' : 'none'

    const countEl = link.querySelector('.category-nav-count')
    if (countEl) countEl.textContent = visible
  })
}

/**
 * Update the anchor counter display
 */
export function updateAnchorCount(visible, total) {
  document.querySelectorAll('#visible-count, #visible-count-mobile').forEach((el) => {
    el.textContent = visible
  })
  document.querySelectorAll('#total-count, #total-count-mobile').forEach((el) => {
    el.textContent = total
  })
}
