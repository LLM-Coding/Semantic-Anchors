import Asciidoctor from '@asciidoctor/core'

const asciidoctor = Asciidoctor()

/**
 * Render a documentation page from an AsciiDoc file
 * @param {string} docPath - Path to the .adoc file (relative to BASE_URL)
 * @param {string} title - Page title for header
 * @returns {string} HTML string
 */
export function renderDocPage(title) {
  return `
    <main class="flex-1">
      <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div id="doc-content" class="prose prose-slate dark:prose-invert max-w-none">
          <div class="flex items-center justify-center py-12">
            <div class="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        </div>
      </div>
    </main>
  `
}

/**
 * Load and render AsciiDoc documentation
 * @param {string} docPath - Path to the .adoc file
 */
export async function loadDocContent(docPath) {
  const contentEl = document.getElementById('doc-content')
  if (!contentEl) return

  try {
    const response = await fetch(`${import.meta.env.BASE_URL}${docPath}`)
    if (!response.ok) {
      throw new Error(`Failed to load: ${response.status}`)
    }

    const adocContent = await response.text()
    const htmlContent = asciidoctor.convert(adocContent, {
      safe: 'safe',
      attributes: {
        'source-highlighter': 'highlight.js',
        'icons': 'font',
        'sectanchors': true,
        'idprefix': '',
        'idseparator': '-'
      }
    })

    contentEl.innerHTML = htmlContent

    // Auto-expand collapsible sections
    contentEl.querySelectorAll('details').forEach(details => {
      details.setAttribute('open', '')
    })

    // Make external links open in new tab
    contentEl.querySelectorAll('a[href^="http"]').forEach(link => {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noopener noreferrer')
    })
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
        <p class="text-gray-600 dark:text-gray-400">Please try again later or visit the <a href="https://github.com/LLM-Coding/Semantic-Anchors" class="text-blue-500 hover:underline" target="_blank">GitHub repository</a>.</p>
      </div>
    `
  }
}
