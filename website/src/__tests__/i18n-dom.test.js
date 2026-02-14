import { describe, it, expect, beforeEach } from 'vitest'
import { i18n, applyTranslations } from '../i18n.js'

describe('applyTranslations (DOM updates)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = 'en'
    i18n.init()
    document.body.innerHTML = ''
  })

  it('sets textContent for elements with data-i18n', () => {
    document.body.innerHTML = '<h2 data-i18n="main.heading"></h2>'
    applyTranslations()
    expect(document.querySelector('h2').textContent).toBe('Explore Semantic Anchors')
  })

  it('sets text content for footer tagline', () => {
    document.body.innerHTML = '<p data-i18n="footer.tagline"></p>'
    applyTranslations()
    const text = document.querySelector('p').textContent
    expect(text).toContain('Semantic Anchors')
    expect(text).toContain('Shared vocabulary for LLM communication')
  })

  it('sets placeholder for elements with data-i18n-placeholder', () => {
    document.body.innerHTML = '<input data-i18n-placeholder="search.placeholder" />'
    applyTranslations()
    expect(document.querySelector('input').placeholder).toBe('Search anchors...')
  })

  it('sets aria-label for elements with data-i18n-aria', () => {
    document.body.innerHTML = '<button data-i18n-aria="header.themeToggle.dark"></button>'
    applyTranslations()
    expect(document.querySelector('button').getAttribute('aria-label')).toBe('Switch to dark mode')
  })

  it('updates translations when switching to German', () => {
    document.body.innerHTML = '<h2 data-i18n="main.heading"></h2>'
    applyTranslations()
    i18n.setLang('de')
    applyTranslations()
    expect(document.querySelector('h2').textContent).toBe('Semantic Anchors erkunden')
  })

  it('updates multiple elements at once', () => {
    document.body.innerHTML = `
      <h2 data-i18n="main.heading"></h2>
      <input data-i18n-placeholder="search.placeholder" />
      <p data-i18n="footer.tagline"></p>
    `
    applyTranslations()
    expect(document.querySelector('h2').textContent).toBe('Explore Semantic Anchors')
    expect(document.querySelector('input').placeholder).toBe('Search anchors...')
    expect(document.querySelector('p').textContent).toContain('Shared vocabulary')
  })
})
