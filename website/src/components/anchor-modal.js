import { i18n } from '../i18n.js'
import { fetchAnchorsData, fetchFeedbackData } from '../utils/data-loader.js'
import { getRouteBeforeModal, buildPath, navigate } from '../utils/router.js'

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
        <div class="flex items-center gap-2">
          <h2 id="modal-title" class="text-2xl font-bold text-[var(--color-text)]"></h2>
          <button id="modal-copy-keyword" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-1.5 rounded hover:bg-[var(--color-bg-secondary)]" data-i18n-aria="card.copyKeyword" aria-label="${i18n.t('card.copyKeyword')}">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
          </button>
        </div>
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

  // Copy keyword handler
  const copyKeywordBtn = modal.querySelector('#modal-copy-keyword')
  copyKeywordBtn.addEventListener('click', () => {
    const title = modal.querySelector('#modal-title').textContent
    if (title) {
      window.copyAnchorKeyword(title)
    }
  })

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
    if (window.location.pathname.includes('/anchor/')) {
      const returnTo = getRouteBeforeModal() || '/'
      history.replaceState(null, '', buildPath(returnTo))
    }
  }
}

const SAFE_ANCHOR_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SAFE_LANG = /^[a-z]{2}$/
// Mirrors scripts/lib/example-image.js: a bare file name in public/examples/.
const SAFE_EXAMPLE_IMAGE = /^[a-z0-9][a-z0-9-]*\.(webp|jpg|jpeg|png)$/
const EXAMPLE_IMAGES_BLOG_URL = 'https://rdmueller.github.io/pages/blog/design-anchors.html'

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

/**
 * Every call to loadAnchorContent takes the next number; only the newest call is
 * allowed to touch the DOM. Without that, two quick clicks race: the slower
 * earlier fetch finishes last and writes its anchor over the one the reader is
 * actually looking at — title, content and the TalkItOver URL together.
 */
let latestAnchorRequest = 0

export async function loadAnchorContent(anchorId) {
  const modal = document.getElementById('anchor-modal')
  const titleEl = modal.querySelector('#modal-title')
  const contentEl = modal.querySelector('#modal-content')

  const request = ++latestAnchorRequest
  const superseded = () => request !== latestAnchorRequest

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

    if (superseded()) return

    const adocContent = await response.text()
    if (superseded()) return

    // Convert AsciiDoc to HTML
    const asciidocEngine = await getAsciidoctor()
    if (superseded()) return
    const htmlContent = asciidocEngine.convert(adocContent, {
      safe: 'secure',
      attributes: {
        showtitle: true,
        sectanchors: true,
      },
    })

    // Extract title from HTML or use anchor ID.
    // Parse via DOMParser so entities like &amp; decode to their characters —
    // setting textContent on a regex-captured string would render
    // "Strunk &amp; White" literally (regressed twice; keep this DOM round-trip).
    const h1El = new DOMParser().parseFromString(htmlContent, 'text/html').querySelector('h1')
    const title = h1El ? h1El.textContent.trim() : anchorId

    titleEl.textContent = title
    // Safe: htmlContent is generated by asciidoctor from .adoc files served from our own origin
    contentEl.innerHTML = String(htmlContent)

    // Umbrella anchor support: show sub-anchor list
    const allAnchors = await fetchAnchorsData()
    if (superseded()) return
    const currentAnchor = allAnchors.find((a) => a.id === anchorId)

    // Both blocks are prepended with insertBefore(firstChild), so the one
    // inserted LAST ends up on top. Insert the definition first and the advisory
    // second, so the final order is: advisory caution, then definition, then
    // content — a caution is never demoted below the definition (#624 + #580).

    // Direct-answer lead (#580): a curated standalone definition, shown above the
    // content as the "What is X?" answer. Only curated definitions land here, so it
    // never duplicates the Core-Concept text rendered below. textContent, no sink.
    if (currentAnchor?.definition) {
      const lead = document.createElement('p')
      lead.className = 'anchor-answer-lead'
      lead.textContent = currentAnchor.definition
      contentEl.insertBefore(lead, contentEl.firstChild)
    }

    // Advisory banner (#624): a counter-consensus-framing caution. The detail and
    // source live in the anchor's Criticism / Current Status section below (SSOT);
    // this banner is only the flag and points the reader there. Built via DOM APIs
    // with textContent (not innerHTML) so the label can never be an HTML sink.
    if (currentAnchor?.advisory) {
      const banner = document.createElement('div')
      banner.className = 'anchor-advisory-banner'
      banner.setAttribute('role', 'note')
      const icon = document.createElement('span')
      icon.setAttribute('aria-hidden', 'true')
      icon.textContent = '⚠'
      banner.append(icon, ` ${currentAnchor.advisory}`)
      contentEl.insertBefore(banner, contentEl.firstChild)
    }

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

    // Example image (`:example-screenshot:`): what a model makes of the anchor name
    // alone. Sits below the anchor text and above the tested-on note. Only plain
    // file names are accepted, so the attribute can never point elsewhere. Built
    // with DOM APIs and textContent, no HTML sink.
    if (currentAnchor?.exampleImage && SAFE_EXAMPLE_IMAGE.test(currentAnchor.exampleImage)) {
      const figure = document.createElement('figure')
      figure.className = 'anchor-example-image'
      const img = document.createElement('img')
      img.src = `${import.meta.env.BASE_URL}examples/${currentAnchor.exampleImage}`
      img.alt = i18n.t('anchor.exampleImageAlt').replace('{title}', currentAnchor.title || title)
      img.setAttribute('width', '720')
      img.setAttribute('height', '900')
      img.setAttribute('loading', 'lazy')
      img.setAttribute('decoding', 'async')
      const caption = document.createElement('figcaption')
      const link = document.createElement('a')
      link.href = EXAMPLE_IMAGES_BLOG_URL
      link.textContent = i18n.t('anchor.exampleImageLink')
      caption.append(`${i18n.t('anchor.exampleImageCaption')} `, link)
      figure.append(img, caption)
      contentEl.append(figure)
    }

    // Tested-on note: every model the anchor was measured against, each with its
    // result. Naming only the models where it worked would read as "the others were
    // not tried", which is a different and weaker claim than "tried, no effect".
    // Provenance rather than caution, so it sits at the foot of the entry. Only
    // rendered when results exist — a date alone says the anchor was tested, not
    // what came out. Built with textContent, no HTML sink.
    if (currentAnchor?.testedOn?.length) {
      const note = document.createElement('p')
      note.className = 'anchor-tested-on'
      note.append(i18n.t('anchor.testedOn'))
      currentAnchor.testedOn.forEach((entry, index) => {
        if (index > 0) note.append(', ')
        const span = document.createElement('span')
        span.className = entry.works ? 'tested-yes' : 'tested-no'
        span.textContent = `${entry.model} ${entry.works ? '✓' : '✗'}`
        span.title = entry.works ? i18n.t('anchor.testedWorks') : i18n.t('anchor.testedNoEffect')
        note.append(span)
      })
      if (currentAnchor.priorTest) {
        const link = document.createElement('a')
        link.href = '#/prior-tests'
        link.textContent = `${i18n.t('anchor.testedMeasured')} ${currentAnchor.priorTest}`
        note.append(' — ', link)
      }
      contentEl.append(note)
    }

    // Auto-expand all collapsible sections
    contentEl.querySelectorAll('details').forEach((details) => {
      details.setAttribute('open', '')
    })

    // Convert internal AsciiDoc cross-reference links to router navigation.
    // Exclude sub-anchor links (handled above) — they share the href="#" shape
    // and would otherwise also fire navigate('/anchor/') with an empty id,
    // which the router treats as a non-anchor route and closes the modal.
    contentEl.querySelectorAll('a[href^="#"]:not([data-sub-anchor])').forEach((link) => {
      const href = link.getAttribute('href')
      // Only process real cross-references: a non-empty id, not a hash route.
      if (href && href.startsWith('#') && !href.startsWith('#/')) {
        const anchorId = href.substring(1) // Remove the '#'
        if (!anchorId) return
        link.addEventListener('click', (e) => {
          e.preventDefault()
          // Navigate to the linked anchor
          navigate(`/anchor/${anchorId}`)
        })
      }
    })

    // Feedback section
    const feedback = await fetchFeedbackData()
    if (superseded()) return
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
            <h4 class="feedback-heading">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
              </svg>
              ${i18n.t('feedback.discussionHeading')}
            </h4>
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
    if (superseded()) return
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
  // Share-link race: handleRoute may invoke us before initApp's createModal()
  // microtask runs. createModal is idempotent.
  const modal = document.getElementById('anchor-modal') || createModal()
  modal.dataset.currentAnchor = anchorId
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
