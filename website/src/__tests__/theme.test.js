import { describe, it, expect, beforeEach } from 'vitest'
import { initTheme, toggleTheme, currentTheme } from '../theme.js'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    // Mock matchMedia to return light preference by default
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })
  })

  describe('initTheme', () => {
    it('defaults to light when no saved preference and no OS preference', () => {
      initTheme()
      expect(currentTheme()).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('restores dark from localStorage', () => {
      localStorage.setItem('theme', 'dark')
      initTheme()
      expect(currentTheme()).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('respects OS dark preference when no saved theme', () => {
      window.matchMedia = (query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      })
      initTheme()
      expect(currentTheme()).toBe('dark')
    })

    it('saved preference overrides OS preference', () => {
      window.matchMedia = (query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      })
      localStorage.setItem('theme', 'light')
      initTheme()
      expect(currentTheme()).toBe('light')
    })
  })

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      initTheme()
      toggleTheme()
      expect(currentTheme()).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('toggles from dark to light', () => {
      localStorage.setItem('theme', 'dark')
      initTheme()
      toggleTheme()
      expect(currentTheme()).toBe('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(localStorage.getItem('theme')).toBe('light')
    })

    it('dispatches themechange event', () => {
      initTheme()
      let receivedTheme = null
      document.addEventListener('themechange', (e) => {
        receivedTheme = e.detail.theme
      })
      toggleTheme()
      expect(receivedTheme).toBe('dark')
    })
  })
})
