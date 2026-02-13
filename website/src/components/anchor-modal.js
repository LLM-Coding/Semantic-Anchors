import Asciidoctor from '@asciidoctor/core'

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
        <button id="modal-close" class="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors p-2" aria-label="Close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
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
  }
}

export async function loadAnchorContent(anchorId) {
  const modal = document.getElementById('anchor-modal')
  const titleEl = modal.querySelector('#modal-title')
  const contentEl = modal.querySelector('#modal-content')

  try {
    // Fetch the AsciiDoc file (from public/docs/anchors, copied to dist/docs/anchors during build)
    const response = await fetch(`${import.meta.env.BASE_URL}docs/anchors/${anchorId}.adoc`)

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
  openModal()
  loadAnchorContent(anchorId)
}
