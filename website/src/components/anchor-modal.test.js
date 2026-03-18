import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import { createModal, openModal, closeModal, showAnchorDetails } from './anchor-modal.js'

vi.mock('../utils/data-loader.js', () => ({
  fetchAnchorsData: vi.fn(),
  fetchFeedbackData: vi.fn().mockResolvedValue({}),
}))

describe('anchor-modal', () => {
  let dom
  let document
  let window

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      url: 'http://localhost',
    })
    document = dom.window.document
    window = dom.window
    global.document = document
    global.window = window
  })

  afterEach(() => {
    delete global.document
    delete global.window
  })

  describe('createModal', () => {
    it('should create modal element in DOM', () => {
      createModal()
      const modal = document.getElementById('anchor-modal')
      expect(modal).toBeTruthy()
      expect(modal.classList.contains('hidden')).toBe(true)
    })

    it('should have close button', () => {
      createModal()
      const closeBtn = document.getElementById('modal-close')
      expect(closeBtn).toBeTruthy()
    })

    it('should have title and content containers', () => {
      createModal()
      const title = document.getElementById('modal-title')
      const content = document.getElementById('modal-content')
      expect(title).toBeTruthy()
      expect(content).toBeTruthy()
    })

    it('should only create modal once', () => {
      const modal1 = createModal()
      const modal2 = createModal()
      const modals = document.querySelectorAll('#anchor-modal')
      expect(modals.length).toBe(1) // Should not create duplicates
      expect(modal1).toBe(modal2) // Should return same modal
    })
  })

  describe('openModal', () => {
    beforeEach(() => {
      createModal()
    })

    it('should show modal', () => {
      openModal()
      const modal = document.getElementById('anchor-modal')
      expect(modal.classList.contains('hidden')).toBe(false)
      expect(modal.classList.contains('flex')).toBe(true)
    })

    it('should disable body scroll', () => {
      openModal()
      expect(document.body.style.overflow).toBe('hidden')
    })
  })

  describe('closeModal', () => {
    beforeEach(() => {
      createModal()
      openModal()
    })

    it('should hide modal', () => {
      closeModal()
      const modal = document.getElementById('anchor-modal')
      expect(modal.classList.contains('hidden')).toBe(true)
      expect(modal.classList.contains('flex')).toBe(false)
    })

    it('should restore body scroll', () => {
      closeModal()
      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('showAnchorDetails', () => {
    beforeEach(async () => {
      global.fetch = vi.fn()
      createModal()
      const { fetchAnchorsData } = await import('../utils/data-loader.js')
      fetchAnchorsData.mockResolvedValue([])
    })

    afterEach(() => {
      delete global.fetch
    })

    it('should open modal when called', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Test Anchor\n\nTest content',
      })

      await showAnchorDetails('test-anchor')
      const modal = document.getElementById('anchor-modal')
      expect(modal.classList.contains('hidden')).toBe(false)
    })

    it('should fetch anchor content', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Test Anchor\n\nTest content',
      })

      showAnchorDetails('test-anchor')

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('test-anchor.adoc'))
    })

    it('should handle fetch errors gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))

      await showAnchorDetails('test-anchor')

      // Modal should still be open
      const modal = document.getElementById('anchor-modal')
      expect(modal.classList.contains('hidden')).toBe(false)

      // Should show error message
      const content = document.getElementById('modal-content')
      expect(content.innerHTML).toContain('Failed to load')
    })

    it('should handle 404 responses', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => 'Not found',
      })

      await showAnchorDetails('nonexistent-anchor')

      const content = document.getElementById('modal-content')
      expect(content.innerHTML).toContain('Failed to load')
    })
  })

  describe('umbrella anchors', () => {
    beforeEach(async () => {
      global.fetch = vi.fn()
      createModal()

      const { fetchAnchorsData } = await import('../utils/data-loader.js')
      fetchAnchorsData.mockResolvedValue([
        {
          id: 'umbrella-anchor',
          title: 'Umbrella Anchor',
          subAnchors: ['sub-one', 'sub-two', 'sub-three'],
        },
        { id: 'sub-one', title: 'Sub One', tier: 3 },
        { id: 'sub-two', title: 'Sub Two', tier: 2 },
        { id: 'sub-three', title: 'Sub Three', tier: 1 },
      ])
    })

    afterEach(() => {
      delete global.fetch
    })

    it('should render sub-anchor list when anchor has subAnchors', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Umbrella Anchor\n\nUmbrella content',
      })

      await showAnchorDetails('umbrella-anchor')

      const content = document.getElementById('modal-content')
      expect(content.innerHTML).toContain('sub-anchor-list')
      expect(content.innerHTML).toContain('Sub One')
      expect(content.innerHTML).toContain('Sub Two')
      expect(content.innerHTML).toContain('Sub Three')
    })

    it('should show back button when viewing sub-anchor from umbrella context', async () => {
      // First load umbrella anchor
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Umbrella Anchor\n\nUmbrella content',
      })
      await showAnchorDetails('umbrella-anchor')

      // Click on a sub-anchor link
      const subLink = document.querySelector('[data-sub-anchor="sub-one"]')
      expect(subLink).toBeTruthy()

      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Sub One\n\nSub one content',
      })
      subLink.click()

      // Wait for async load
      await new Promise((r) => setTimeout(r, 50))

      const backBtn = document.getElementById('modal-back')
      expect(backBtn).toBeTruthy()
    })
  })
})
