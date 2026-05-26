import { i18n } from '../i18n.js'
import { hydrateYouTubeFacades } from '../utils/youtube-facade.js'

/**
 * Render a documentation page shell (content loaded async).
 *
 * Layout: on `lg` and up, a sticky TOC sidebar sits to the left of the
 * content. On smaller screens the aside stacks above the content. The
 * aside stays hidden until loadDocContent fetches a TOC sidecar; pages
 * without a TOC keep the full content width.
 *
 * @returns {string} HTML string with loading placeholder
 */
export function renderDocPage() {
  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="lg:flex lg:gap-8">
          <aside
            id="doc-toc"
            class="doc-toc hidden mb-6 max-h-72 overflow-y-auto p-4 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] lg:mb-0 lg:w-64 lg:flex-shrink-0 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:p-0 lg:border-0 lg:rounded-none lg:bg-transparent"
          ></aside>
          <div id="doc-content" class="asciidoc-content min-w-0 lg:flex-1 lg:max-w-4xl">
            <div class="flex items-center justify-center py-12">
              <div class="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `
}

/**
 * Load pre-rendered HTML documentation.
 * Files are rendered at build time by scripts/render-docs.js.
 * @param {string} docPath - Path to the .adoc file (used to derive .html path)
 */
export async function loadDocContent(docPath) {
  const contentEl = document.getElementById('doc-content')
  if (!contentEl) return

  const htmlPath = docPath.replace(/\.adoc$/, '.html')
  const currentLang = i18n.currentLang()

  try {
    let response
    let resolvedPath = htmlPath

    if (currentLang !== 'en') {
      const langPath = htmlPath.replace(/\.html$/, `.${currentLang}.html`)
      response = await fetch(`${import.meta.env.BASE_URL}${langPath}`)
      if (response.ok) {
        resolvedPath = langPath
      } else {
        response = await fetch(`${import.meta.env.BASE_URL}${htmlPath}`)
      }
    } else {
      response = await fetch(`${import.meta.env.BASE_URL}${htmlPath}`)
    }

    if (!response.ok) {
      throw new Error(`Failed to load: ${response.status}`)
    }

    await loadDocToc(resolvedPath)

    contentEl.innerHTML = await response.text()

    // Auto-expand collapsible sections
    contentEl.querySelectorAll('details').forEach((details) => {
      details.setAttribute('open', '')
    })

    // Make external links open in new tab
    contentEl.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
    })

    // Attach click-to-load handlers for any YouTube placeholders in the doc.
    // Keeps us DSGVO-compliant: YouTube is only contacted after user consent.
    hydrateYouTubeFacades(contentEl)

    // Restore deep-link scrolling: if the URL has a hash (e.g. #phase-0-5),
    // the browser tried to scroll there before the SPA replaced #doc-content
    // with this newly fetched HTML. Re-scroll to the target now that the
    // section exists in the DOM.
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const target = document.getElementById(id)
      if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    }
  } catch (error) {
    console.error('Failed to load documentation:', error)
    contentEl.innerHTML = `
      <div class="text-center py-12">
        <div class="text-red-500 dark:text-red-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 class="text-xl font-semibold mb-2">Failed to Load Documentation</h2>
        <p class="text-gray-600 dark:text-gray-400">Please try again later or visit the <a href="https://github.com/LLM-Coding/Semantic-Anchors" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
      </div>
    `
  }
}

/**
 * Fetch the TOC sidecar that render-docs.js extracts at build time and
 * inject it into the #doc-toc aside. Pages without a TOC produce no
 * sidecar — the fetch 404s and the aside stays hidden.
 *
 * Also rewrites the in-page hash links so they bypass the SPA router
 * (which only handles `#/...` routes) and scroll to the target heading.
 */
async function loadDocToc(htmlPath) {
  const aside = document.getElementById('doc-toc')
  if (!aside) return

  aside.innerHTML = ''
  aside.classList.add('hidden')

  const tocPath = htmlPath.replace(/\.html$/, '.toc.html')
  try {
    const tocResponse = await fetch(`${import.meta.env.BASE_URL}${tocPath}`)
    if (!tocResponse.ok) return
    const text = await tocResponse.text()
    // Vite's SPA fallback returns index.html (200 OK) for missing files.
    // Verify the response is actually a TOC fragment, not the SPA shell.
    if (!/^\s*<div[^>]*\sid="toc"/i.test(text)) return
    aside.innerHTML = text
    aside.classList.remove('hidden')

    aside.querySelectorAll('a[href^="#"]').forEach((link) => {
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#/')) return
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const id = decodeURIComponent(href.slice(1))
        const target = document.getElementById(id)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  } catch {
    // No TOC for this page — leave aside hidden.
  }
}
