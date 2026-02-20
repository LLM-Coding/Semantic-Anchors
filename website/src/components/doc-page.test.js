import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { i18n } from '../i18n.js'
import { loadDocContent } from './doc-page.js'

describe('doc-page', () => {
  beforeEach(() => {
    localStorage.clear()
    i18n.init()
    document.body.innerHTML = '<div id="doc-content"></div>'
    global.fetch = vi.fn()
  })

  afterEach(() => {
    delete global.fetch
  })

  it('falls back to English when localized document is missing', async () => {
    i18n.setLang('de')

    global.fetch.mockResolvedValueOnce({ ok: false, status: 404 }).mockResolvedValueOnce({
      ok: true,
      text: async () => '= About\n\nlink:https://example.com[Example]',
    })

    await loadDocContent('docs/about.adoc')

    expect(global.fetch).toHaveBeenNthCalledWith(1, expect.stringContaining('docs/about.de.adoc'))
    expect(global.fetch).toHaveBeenNthCalledWith(2, expect.stringContaining('docs/about.adoc'))

    const link = document.querySelector('#doc-content a[href="https://example.com"]')
    expect(link).toBeTruthy()
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
  })

  it('renders an error state when loading fails', async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 })

    await loadDocContent('docs/about.adoc')

    expect(document.getElementById('doc-content').textContent).toContain(
      'Failed to Load Documentation'
    )
  })
})
