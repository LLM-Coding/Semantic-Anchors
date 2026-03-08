import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { i18n } from '../i18n.js'
import {
  createOnboardingModal,
  showOnboarding,
  closeOnboarding,
  shouldShowOnboarding,
} from './onboarding-modal.js'

describe('onboarding-modal', () => {
  let originalMatchMedia

  beforeEach(() => {
    localStorage.clear()
    i18n.init()
    // Note: innerHTML usage here is in test code only, not production.
    // The test DOM is reset between tests and contains no user input.
    document.body.innerHTML = ''
    // Mock matchMedia - default to desktop (min-width: 640px matches)
    originalMatchMedia = window.matchMedia
    window.matchMedia = (query) => ({
      matches: query === '(min-width: 640px)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
    window.matchMedia = originalMatchMedia
  })

  describe('shouldShowOnboarding', () => {
    it('returns true when localStorage has no onboarding-seen key', () => {
      expect(shouldShowOnboarding()).toBe(true)
    })

    it('returns false when onboarding-seen is true', () => {
      localStorage.setItem('onboarding-seen', 'true')
      expect(shouldShowOnboarding()).toBe(false)
    })
  })

  describe('createOnboardingModal', () => {
    it('creates the modal element in the DOM', () => {
      createOnboardingModal()
      const modal = document.getElementById('onboarding-modal')
      expect(modal).toBeTruthy()
      expect(modal.getAttribute('role')).toBe('dialog')
      expect(modal.getAttribute('aria-modal')).toBe('true')
    })

    it('does not create duplicate modals', () => {
      createOnboardingModal()
      createOnboardingModal()
      const modals = document.querySelectorAll('#onboarding-modal')
      expect(modals.length).toBe(1)
    })
  })

  describe('showOnboarding', () => {
    it('shows the modal with content', () => {
      createOnboardingModal()
      showOnboarding()

      const modal = document.getElementById('onboarding-modal')
      expect(modal.classList.contains('hidden')).toBe(false)
      expect(modal.classList.contains('flex')).toBe(true)
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('contains the slogan text', () => {
      createOnboardingModal()
      showOnboarding()

      const modal = document.getElementById('onboarding-modal')
      expect(modal.textContent).toContain('One word, and the AI gets the rest.')
    })

    it('contains the YouTube embed for desktop', () => {
      createOnboardingModal()
      showOnboarding()

      const iframe = document.querySelector('#onboarding-modal iframe')
      expect(iframe).toBeTruthy()
      expect(iframe.src).toContain('youtube.com/embed/Fb7t45E8_HE')
    })

    it('uses German video when language is DE', () => {
      i18n.setLang('de')
      createOnboardingModal()
      showOnboarding()

      const iframe = document.querySelector('#onboarding-modal iframe')
      expect(iframe.src).toContain('youtube.com/embed/cp-qqiHU-MA')
    })

    it('contains YouTube link on mobile instead of iframe', () => {
      window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      })
      createOnboardingModal()
      showOnboarding()

      const link = document.querySelector('#onboarding-modal a[href*="youtube.com/shorts"]')
      expect(link).toBeTruthy()
      expect(link.getAttribute('target')).toBe('_blank')
      const iframe = document.querySelector('#onboarding-modal iframe')
      expect(iframe).toBeNull()
    })
  })

  describe('closeOnboarding', () => {
    it('hides the modal and saves to localStorage', () => {
      createOnboardingModal()
      showOnboarding()
      closeOnboarding()

      const modal = document.getElementById('onboarding-modal')
      expect(modal.classList.contains('hidden')).toBe(true)
      expect(document.body.style.overflow).toBe('')
      expect(localStorage.getItem('onboarding-seen')).toBe('true')
    })

    it('close button triggers close', () => {
      createOnboardingModal()
      showOnboarding()

      document.getElementById('onboarding-close').click()

      const modal = document.getElementById('onboarding-modal')
      expect(modal.classList.contains('hidden')).toBe(true)
    })

    it('CTA button triggers close', () => {
      createOnboardingModal()
      showOnboarding()

      document.getElementById('onboarding-cta').click()

      expect(localStorage.getItem('onboarding-seen')).toBe('true')
    })
  })

  describe('keyboard interaction', () => {
    it('closes on Escape key', () => {
      createOnboardingModal()
      showOnboarding()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

      const modal = document.getElementById('onboarding-modal')
      expect(modal.classList.contains('hidden')).toBe(true)
    })
  })
})
