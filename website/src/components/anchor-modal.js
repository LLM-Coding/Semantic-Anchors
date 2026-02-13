import Asciidoctor from '@asciidoctor/core'
import { i18n } from '../i18n.js'

const asciidoctor = Asciidoctor()

export function createModal() {
  // Check if modal already exists
  if (document.getElementById('anchor-modal')) {
    return document.getElementById('anchor-modal')
  }

  const modal = document.createElement('div')
  modal.id = 'anchor-modal'
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 p-4'
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
      <div id="modal-content" class="flex-1 overflow-y-auto p-6 prose prose-slate dark:prose-invert max-w-none">
        <div class="flex items-center justify-center h-64">
          <div class="text-[var(--color-text-secondary)]">Loading...</div>
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

    // Reset URL to home if we're on an anchor route
    if (window.location.hash.startsWith('#/anchor/')) {
      window.location.hash = '#/'
    }
  }
}

export async function loadAnchorContent(anchorId) {
  const modal = document.getElementById('anchor-modal')
  const titleEl = modal.querySelector('#modal-title')
  const contentEl = modal.querySelector('#modal-content')

  try {
    // Try language-specific file first (e.g., tdd-london-school.de.adoc for German)
    const currentLang = i18n.currentLang()
    let response

    if (currentLang !== 'en') {
      // Try fetching language-specific anchor file
      response = await fetch(`${import.meta.env.BASE_URL}docs/anchors/${anchorId}.${currentLang}.adoc`)

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
    const htmlContent = asciidoctor.convert(adocContent, {
      safe: 'safe',
      attributes: {
        showtitle: true,
        sectanchors: true
      }
    })

    // Extract title from HTML or use anchor ID
    const titleMatch = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/)
    const title = titleMatch ? titleMatch[1] : anchorId

    titleEl.textContent = title
    contentEl.innerHTML = htmlContent

    // Auto-expand all collapsible sections
    contentEl.querySelectorAll('details').forEach(details => {
      details.setAttribute('open', '')
    })

  } catch (error) {
    console.error('Error loading anchor content:', error)
    titleEl.textContent = 'Error'
    contentEl.innerHTML = `
      <div class="text-red-500">
        <p><strong>Failed to load anchor content</strong></p>
        <p class="text-sm mt-2">${error.message}</p>
        <p class="text-sm mt-4 text-[var(--color-text-secondary)]">
          Anchor ID: <code>${anchorId}</code>
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
  loadAnchorContent(anchorId)
}

async function shareAnchor(anchorId, title) {
  const url = `${window.location.origin}${window.location.pathname}#/anchor/${anchorId}`
  const text = `${title} - Semantic Anchors`

  // Try Web Share API first (mobile/modern browsers)
  if (navigator.share) {
    try {
      await navigator.share({
        title: text,
        url: url
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
