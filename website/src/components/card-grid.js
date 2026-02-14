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

/**
 * Category color palette (matching previous categories)
 */
const CATEGORY_COLORS = {
  'communication-presentation': '#5470c6',
  'design-principles': '#91cc75',
  'development-workflow': '#fac858',
  'dialogue-interaction': '#ee6666',
  'documentation': '#73c0de',
  'meta': '#3ba272',
  'problem-solving': '#fc8452',
  'requirements-engineering': '#9a60b4',
  'software-architecture': '#ea7ccc',
  'statistical-methods': '#48b8d0',
  'strategic-planning': '#c23531',
  'testing-quality': '#5470c6'
}

/**
 * Category icons for better recognition
 */
const CATEGORY_ICONS = {
  'communication-presentation': '💬',
  'design-principles': '🎯',
  'development-workflow': '⚙️',
  'dialogue-interaction': '🤝',
  'documentation': '📚',
  'meta': '🔍',
  'problem-solving': '💡',
  'requirements-engineering': '📋',
  'software-architecture': '🏗️',
  'statistical-methods': '📊',
  'strategic-planning': '🎯',
  'testing-quality': '🧪'
}

/**
 * Render the complete card grid
 */
export function renderCardGrid(categories, anchors) {
  if (!categories || !anchors) return '<div>Loading...</div>'

  return `
    <div class="card-grid-container">
      ${categories.map(category => renderCategorySection(category, anchors)).join('')}
    </div>
  `
}

/**
 * Render a single category section with its anchors
 */
function renderCategorySection(category, allAnchors) {
  const categoryAnchors = allAnchors.filter(anchor =>
    anchor.categories && anchor.categories.includes(category.id)
  )

  if (categoryAnchors.length === 0) return ''

  const color = CATEGORY_COLORS[category.id] || '#5470c6'
  const icon = CATEGORY_ICONS[category.id] || '📌'
  const categoryName = i18n.t(`categories.${category.id}`) || category.name

  return `
    <section class="category-section" data-category="${escapeHtml(category.id)}">
      <h2 class="category-heading">
        <span class="category-icon" style="background-color: ${color}">${icon}</span>
        <span data-i18n="categories.${escapeHtml(category.id)}">${escapeHtml(categoryName)}</span>
      </h2>

      <div class="anchor-cards-grid">
        ${categoryAnchors.map(anchor => renderAnchorCard(anchor, color)).join('')}
      </div>
    </section>
  `
}

/**
 * Render a single anchor card
 */
function renderAnchorCard(anchor, categoryColor) {
  const rolesCount = anchor.roles ? anchor.roles.length : 0
  const githubEditUrl = `https://github.com/LLM-Coding/Semantic-Anchors/edit/main/docs/anchors/${anchor.id}.adoc`
  const roleText = rolesCount === 1 ? i18n.t('card.roles') : i18n.t('card.rolesPlural')
  const tagsText = i18n.t('card.tags')
  const editTitle = i18n.t('card.edit')
  const copyLinkTitle = i18n.t('card.copyLink')
  const safeId = escapeHtml(anchor.id)

  return `
    <article
      class="anchor-card"
      data-anchor="${safeId}"
      data-roles="${escapeHtml(anchor.roles ? anchor.roles.join(',') : '')}"
      data-tags="${escapeHtml(anchor.tags ? anchor.tags.join(',') : '')}"
      tabindex="0"
      role="button"
      aria-label="${escapeHtml(i18n.t('card.openDetails').replace('{title}', anchor.title))}"
    >
      <div class="anchor-card-header">
        <h3 class="anchor-card-title">${escapeHtml(anchor.title)}</h3>
        <div class="flex gap-1">
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

      ${anchor.proponents && anchor.proponents.length > 0 ? `
        <p class="anchor-card-proponents">${escapeHtml(anchor.proponents.slice(0, 2).join(', '))}</p>
      ` : ''}

      <div class="anchor-card-meta">
        ${rolesCount > 0 ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span data-i18n-role="${rolesCount}">${rolesCount} ${roleText}</span>
          </span>
        ` : ''}

        ${anchor.tags && anchor.tags.length > 0 ? `
          <span class="meta-badge">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <span data-i18n="card.tags">${anchor.tags.length} ${tagsText}</span>
          </span>
        ` : ''}
      </div>

      <div class="anchor-card-indicator" style="background-color: ${categoryColor}"></div>
    </article>
  `
}

// Store handler references to prevent duplicate listeners
let clickHandler = null
let keydownHandler = null

/**
 * Initialize card grid event handlers
 */
export function initCardGrid() {
  const container = document.getElementById('main-content')
  if (!container) return

  // Remove existing listeners if any
  if (clickHandler) {
    container.removeEventListener('click', clickHandler)
  }
  if (keydownHandler) {
    container.removeEventListener('keydown', keydownHandler)
  }

  // Click handler using event delegation
  clickHandler = (e) => {
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

    const card = e.target.closest('.anchor-card')
    if (card) {
      const anchorId = card.dataset.anchor
      const event = new CustomEvent('anchor-selected', {
        detail: { anchorId }
      })
      document.dispatchEvent(event)
    }
  }
  container.addEventListener('click', clickHandler)

  // Keyboard handler (Enter/Space on focused card)
  keydownHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.anchor-card')
      if (card) {
        e.preventDefault()
        const anchorId = card.dataset.anchor
        const event = new CustomEvent('anchor-selected', {
          detail: { anchorId }
        })
        document.dispatchEvent(event)
      }
    }
  }
  container.addEventListener('keydown', keydownHandler)
}

/**
 * Filter cards by role
 */
export function filterCardsByRole(roleId) {
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  cards.forEach(card => {
    const roles = card.dataset.roles.split(',').filter(Boolean)
    const matches = !roleId || roles.includes(roleId)
    card.style.display = matches ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach(section => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card'))
      .filter(card => card.style.display !== 'none')
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}

/**
 * Filter cards by search query
 */
export function filterCardsBySearch(query) {
  if (!query || query.trim() === '') {
    // Show all
    document.querySelectorAll('.anchor-card, .category-section').forEach(el => {
      el.style.display = 'block'
    })
    return
  }

  const lowerQuery = query.toLowerCase().trim()
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  cards.forEach(card => {
    const title = card.querySelector('.anchor-card-title').textContent.toLowerCase()
    const tags = card.dataset.tags.toLowerCase()
    const anchorId = card.dataset.anchor.toLowerCase()

    const matches = title.includes(lowerQuery) ||
                    tags.includes(lowerQuery) ||
                    anchorId.includes(lowerQuery)

    card.style.display = matches ? 'block' : 'none'
  })

  // Hide empty sections
  sections.forEach(section => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card'))
      .filter(card => card.style.display !== 'none')
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })
}

/**
 * Apply combined filters (role + search)
 */
export function applyCardFilters(roleId, searchQuery) {
  const cards = document.querySelectorAll('.anchor-card')
  const sections = document.querySelectorAll('.category-section')

  const lowerQuery = searchQuery ? searchQuery.toLowerCase().trim() : ''

  // Use full-text search if index is ready and query exists
  let matchingAnchorIds = null
  if (lowerQuery && isIndexReady()) {
    matchingAnchorIds = new Set(performFullTextSearch(lowerQuery))
  }

  let visibleCount = 0

  cards.forEach(card => {
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
        searchMatch = title.includes(lowerQuery) ||
                     tags.includes(lowerQuery) ||
                     anchorId.includes(lowerQuery)
      }
    }

    const isVisible = roleMatch && searchMatch
    card.style.display = isVisible ? 'block' : 'none'
    if (isVisible) visibleCount++
  })

  // Hide empty sections
  sections.forEach(section => {
    const visibleCards = Array.from(section.querySelectorAll('.anchor-card'))
      .filter(card => card.style.display !== 'none')
    section.style.display = visibleCards.length > 0 ? 'block' : 'none'
  })

  // Update counter
  updateAnchorCount(visibleCount, cards.length)
}

/**
 * Update the anchor counter display
 */
export function updateAnchorCount(visible, total) {
  const visibleCountEl = document.getElementById('visible-count')
  const totalCountEl = document.getElementById('total-count')

  if (visibleCountEl) visibleCountEl.textContent = visible
  if (totalCountEl) totalCountEl.textContent = total
}
