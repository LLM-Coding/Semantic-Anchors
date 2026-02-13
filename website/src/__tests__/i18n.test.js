import { describe, it, expect, beforeEach, vi } from 'vitest'
import { i18n } from '../i18n.js'

describe('i18n', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.lang = 'en'
    i18n.init()
  })

  describe('init', () => {
    it('defaults to English when no saved preference', () => {
      localStorage.clear()
      i18n.init()
      expect(i18n.currentLang()).toBe('en')
    })

    it('restores saved language preference from localStorage', () => {
      localStorage.setItem('lang', 'de')
      i18n.init()
      expect(i18n.currentLang()).toBe('de')
    })

    it('sets document lang attribute on init', () => {
      localStorage.setItem('lang', 'de')
      i18n.init()
      expect(document.documentElement.lang).toBe('de')
    })
  })

  describe('t() translation function', () => {
    it('returns English translation by default', () => {
      expect(i18n.t('main.heading')).toBe('Explore Semantic Anchors')
    })

    it('returns German translation when language is de', () => {
      i18n.setLang('de')
      expect(i18n.t('main.heading')).toBe('Semantic Anchors erkunden')
    })

    it('returns the key itself when translation is missing', () => {
      expect(i18n.t('nonexistent.key')).toBe('nonexistent.key')
    })
  })

  describe('setLang', () => {
    it('switches language and updates document.lang', () => {
      i18n.setLang('de')
      expect(i18n.currentLang()).toBe('de')
      expect(document.documentElement.lang).toBe('de')
    })

    it('persists language to localStorage', () => {
      i18n.setLang('de')
      expect(localStorage.getItem('lang')).toBe('de')
    })

    it('dispatches langchange event on document', () => {
      const handler = vi.fn()
      document.addEventListener('langchange', handler)
      i18n.setLang('de')
      expect(handler).toHaveBeenCalledTimes(1)
      expect(handler.mock.calls[0][0].detail.lang).toBe('de')
      document.removeEventListener('langchange', handler)
    })

    it('does not dispatch event if language is unchanged', () => {
      const handler = vi.fn()
      document.addEventListener('langchange', handler)
      i18n.setLang('en')
      expect(handler).not.toHaveBeenCalled()
      document.removeEventListener('langchange', handler)
    })
  })

  describe('toggleLang', () => {
    it('toggles from en to de', () => {
      i18n.toggleLang()
      expect(i18n.currentLang()).toBe('de')
    })

    it('toggles from de to en', () => {
      i18n.setLang('de')
      i18n.toggleLang()
      expect(i18n.currentLang()).toBe('en')
    })
  })
})
