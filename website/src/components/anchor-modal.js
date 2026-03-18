import { i18n } from '../i18n.js'
import { fetchAnchorsData, fetchFeedbackData } from '../utils/data-loader.js'
import { getRouteBeforeModal, getScrollBeforeModal } from '../utils/router.js'

let asciidoctor = null

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function getAsciidoctor() {
  if (asciidoctor) return asciidoctor
  const module = await import('@asciidoctor/core')
  asciidoctor = module.default()
  return asciidoctor
}

export function createModal() {
  // Check if modal already exists
  if (document.getElementById('anchor-modal')) {
    return document.getElementById('anchor-modal')
  }

  const modal = document.createElement('div')
  modal.id = 'anchor-modal'
  modal.className =
    'fixed inset-0 bg-black/30 backdrop-blur-sm hidden items-center justify-center z-50 p-4'
  modal.innerHTML = `
    <div class="bg-[var(--color-bg)] rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-[var(--color-border)]">
      <div class="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
        <h2 id="modal-title" class="text-2xl font-bold text-[var(--color-text)]"></h2>
        <div class="flex items-center gap-2">
          <button id="modal-share" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-2" data-i18n-aria="modal.share" aria-label="${i18n.t('modal.share')}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
          </button>
          <button id="modal-close" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-2" data-i18n-aria="modal.close" aria-label="${i18n.t('modal.close')}">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      <div id="modal-content" class="flex-1 overflow-y-auto p-6 prose prose-slate dark:prose-invert max-w-none asciidoc-content">
        <div class="flex items-center justify-center h-64">
          <div class="text-[var(--color-text-secondary)]">Loading...</div>
        </div>
      </div>
      <div id="modal-feedback-bar" class="modal-feedback-bar hidden">
        <span class="modal-feedback-cta">${i18n.t('feedback.cta')}</span>
        <div class="feedback-actions">
          <a id="modal-vote-btn" href="#" target="_blank" rel="noopener noreferrer" class="feedback-btn feedback-btn-vote">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
            </svg>
            <span>${i18n.t('feedback.vote')}</span>
          </a>
          <a id="modal-discuss-btn" href="#" target="_blank" rel="noopener noreferrer" class="feedback-btn feedback-btn-discuss">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
            <span>${i18n.t('feedback.discuss')}</span>
          </a>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Close handlers
  const closeBtn = modal.querySelector('#modal-close')
  closeBtn.addEventListener('click', closeModal)

  // Share handler
  const shareBtn = modal.querySelector('#modal-share')
  shareBtn.addEventListener('click', () => {
    const anchorId = modal.dataset.currentAnchor
    if (anchorId) {
      shareAnchor(anchorId, modal.querySelector('#modal-title').textContent)
    }
  })

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal()
    }
  })

  return modal
}

export function openModal() {
  const modal = document.getElementById('anchor-modal')
  if (modal) {
    modal.classList.remove('hidden')
    modal.classList.add('flex')
    document.body.style.overflow = 'hidden'
  }
}

export function closeModal() {
  const modal = document.getElementById('anchor-modal')
  if (modal) {
    modal.classList.add('hidden')
    modal.classList.remove('flex')
    document.body.style.overflow = ''

    // Restore URL to the page that was active before the modal opened
    // Use replaceState to avoid triggering hashchange (which would re-render the page)
    if (window.location.hash.startsWith('#/anchor/')) {
      const returnTo = getRouteBeforeModal() || '/'
      history.replaceState(null, '', '#' + returnTo)
    }
  }
}

const SAFE_ANCHOR_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SAFE_LANG = /^[a-z]{2}$/

function renderSubAnchorList(subAnchorIds, allAnchors) {
  if (!subAnchorIds || subAnchorIds.length === 0) return ''

  const items = subAnchorIds.map((id) => {
    const anchor = allAnchors.find((a) => a.id === id)
    if (!anchor) return ''
    const tier = anchor.tier || 2

    if (tier === 1) {
      return `<li class="sub-anchor-item tier-1">
        <span>${escapeHtml(anchor.title)}</span>
        <span class="text-xs text-gray-400 dark:text-gray-500 ml-2">${i18n.t('umbrella.notAnAnchor')}</span>
      </li>`
    }

    const tierClass = `tier-${tier}`
    return `<li class="sub-anchor-item ${tierClass}">
      <a href="#" data-sub-anchor="${escapeHtml(id)}" class="sub-anchor-link">${escapeHtml(anchor.title)}</a>
    </li>`
  })

  return `
    <div class="sub-anchor-list mt-8 pt-6 border-t border-[var(--color-border)]">
      <h3 class="text-lg font-semibold mb-4 text-[var(--color-text)]">${i18n.t('umbrella.subAnchors')}</h3>
      <ul class="space-y-2">${items.join('')}</ul>
    </div>
  `
}

export async function loadAnchorContent(anchorId) {
  const modal = document.getElementById('anchor-modal')
  const titleEl = modal.querySelector('#modal-title')
  const contentEl = modal.querySelector('#modal-content')

  // Back button for sub-anchor navigation
  const umbrellaId = modal.dataset.umbrellaAnchor
  let existingBackBtn = modal.querySelector('#modal-back')

  if (umbrellaId && anchorId !== umbrellaId) {
    if (!existingBackBtn) {
      existingBackBtn = document.createElement('button')
      existingBackBtn.id = 'modal-back'
      existingBackBtn.className =
        'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-2 mr-2'
      // Safe: static SVG content, no user input
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('class', 'w-5 h-5')
      svg.setAttribute('fill', 'none')
      svg.setAttribute('stroke', 'currentColor')
      svg.setAttribute('viewBox', '0 0 24 24')
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('stroke-linecap', 'round')
      path.setAttribute('stroke-linejoin', 'round')
      path.setAttribute('stroke-width', '2')
      path.setAttribute('d', 'M15 19l-7-7 7-7')
      svg.appendChild(path)
      existingBackBtn.appendChild(svg)
      existingBackBtn.addEventListener('click', () => {
        delete modal.dataset.umbrellaAnchor
        loadAnchorContent(umbrellaId)
      })
      titleEl.parentElement.insertBefore(existingBackBtn, titleEl)
    }
  } else {
    delete modal.dataset.umbrellaAnchor
    if (existingBackBtn) existingBackBtn.remove()
  }

  if (!SAFE_ANCHOR_ID.test(anchorId)) {
    contentEl.innerHTML = '<div class="text-red-500">Invalid anchor ID.</div>'
    return
  }

  try {
    // Try language-specific file first (e.g., tdd-london-school.de.adoc for German)
    const currentLang = i18n.currentLang()
    let response

    const safeLang = SAFE_LANG.test(currentLang) ? currentLang : 'en'

    if (safeLang !== 'en') {
      // Try fetching language-specific anchor file
      response = await fetch(`${import.meta.env.BASE_URL}docs/anchors/${anchorId}.${safeLang}.adoc`)

      // If language-specific file not found, fallback to English
      if (!response.ok) {
        response = await fetch(`${import.meta.env.BASE_URL}docs/anchors/${anchorId}.adoc`)
      }
    } else {
      response = await fetch(`${import.meta.env.BASE_URL}docs/anchors/${anchorId}.adoc`)
    }

    if (!response.ok) {
      throw new Error(`Failed to load anchor: ${response.status}`)
    }

    const adocContent = await response.text()

    // Convert AsciiDoc to HTML
    const asciidocEngine = await getAsciidoctor()
    const htmlContent = asciidocEngine.convert(adocContent, {
      safe: 'secure',
      attributes: {
        showtitle: true,
        sectanchors: true,
      },
    })

    // Extract title from HTML or use anchor ID
    const titleMatch = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/)
    const title = titleMatch ? titleMatch[1] : anchorId

    titleEl.textContent = title
    // Safe: htmlContent is generated by asciidoctor from .adoc files served from our own origin
    contentEl.innerHTML = String(htmlContent)

    // Umbrella anchor support: show sub-anchor list
    const allAnchors = await fetchAnchorsData()
    const currentAnchor = allAnchors.find((a) => a.id === anchorId)

    if (currentAnchor?.subAnchors) {
      // Safe: renderSubAnchorList uses escapeHtml for all dynamic values
      contentEl.innerHTML += renderSubAnchorList(currentAnchor.subAnchors, allAnchors)

      // Add click handlers for sub-anchor links
      contentEl.querySelectorAll('[data-sub-anchor]').forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          const subId = link.dataset.subAnchor
          modal.dataset.umbrellaAnchor = anchorId
          loadAnchorContent(subId)
        })
      })
    }

    // Auto-expand all collapsible sections
    contentEl.querySelectorAll('details').forEach((details) => {
      details.setAttribute('open', '')
    })

    // Convert internal AsciiDoc cross-reference links to router navigation
    contentEl.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href')
      // Only process simple hash links (cross-references), not hash routes
      if (href && href.startsWith('#') && !href.startsWith('#/')) {
        const anchorId = href.substring(1) // Remove the '#'
        link.addEventListener('click', (e) => {
          e.preventDefault()
          // Navigate to the linked anchor
          window.location.hash = `#/anchor/${anchorId}`
        })
      }
    })

    // Feedback section
    const feedback = await fetchFeedbackData()
    const fb = feedback[anchorId]
    const safeFeedbackUrl =
      fb &&
      typeof fb.url === 'string' &&
      /^https:\/\/github\.com\/LLM-Coding\/Semantic-Anchors\/discussions\/\d+$/.test(fb.url)
        ? fb.url
        : null
    // Update sticky feedback bar
    const feedbackBar = document.getElementById('modal-feedback-bar')
    const voteBtn = document.getElementById('modal-vote-btn')
    const discussBtn = document.getElementById('modal-discuss-btn')

    if (safeFeedbackUrl) {
      voteBtn.href = safeFeedbackUrl
      voteBtn.querySelector('span').textContent =
        `${i18n.t('feedback.vote')}${fb.upvotes > 1 ? ` (${fb.upvotes})` : ''}`
      discussBtn.href = safeFeedbackUrl
      discussBtn.querySelector('span').textContent =
        `${i18n.t('feedback.discuss')}${fb.comments > 0 ? ` (${fb.comments})` : ''}`
      feedbackBar.classList.remove('hidden')

      // Show recent comments in content area
      if (fb.recentComments && fb.recentComments.length > 0) {
        const commentsHtml = `
          <div class="feedback-section">
            <div class="feedback-comments">
              ${fb.recentComments
                .map(
                  (c) => `
                <div class="feedback-comment">
                  <img src="${escapeHtml(c.avatar)}" alt="${escapeHtml(c.author)}" class="feedback-avatar" width="24" height="24" />
                  <div class="feedback-comment-body">
                    <span class="feedback-author">${escapeHtml(c.author)}</span>
                    <p class="feedback-text">${escapeHtml(c.body)}</p>
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
        contentEl.insertAdjacentHTML('beforeend', commentsHtml)
      }
    } else {
      feedbackBar.classList.add('hidden')
    }
  } catch (error) {
    console.error('Error loading anchor content:', error)
    titleEl.textContent = 'Error'
    const message = error instanceof Error ? error.message : String(error)
    contentEl.innerHTML = `
      <div class="text-red-500">
        <p><strong>Failed to load anchor content</strong></p>
        <p class="text-sm mt-2">${escapeHtml(message)}</p>
        <p class="text-sm mt-4 text-[var(--color-text-secondary)]">
          Anchor ID: <code>${escapeHtml(anchorId)}</code>
        </p>
      </div>
    `
  }
}

export function showAnchorDetails(anchorId) {
  const modal = document.getElementById('anchor-modal')
  if (modal) {
    modal.dataset.currentAnchor = anchorId
  }
  openModal()
  return loadAnchorContent(anchorId)
}

async function shareAnchor(anchorId, title) {
  const url = `${window.location.origin}${window.location.pathname}#/anchor/${anchorId}`
  const text = `${title} - Semantic Anchors`

  // Try Web Share API first (mobile/modern browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title: text,
        url: url,
      })
      return
    } catch (err) {
      // User cancelled or share failed, fall through to clipboard
      if (err.name !== 'AbortError') {
        console.warn('Share failed:', err)
      }
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(url)
    window.showToast(i18n.t('card.linkCopied'))
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}
