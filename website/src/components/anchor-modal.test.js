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

    it('should decode HTML entities in the modal title (regression)', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Plain English according to Strunk & White\n\nBody.',
      })

      await showAnchorDetails('plain-english-strunk-white')

      const title = document.getElementById('modal-title').textContent
      expect(title).toBe('Plain English according to Strunk & White')
      expect(title).not.toContain('&amp;')
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

    it('should not crash when modal element is missing (share-link race, #470)', async () => {
      const existing = document.getElementById('anchor-modal')
      if (existing) existing.remove()

      global.fetch.mockResolvedValue({
        ok: true,
        text: async () => '= Test Anchor\n\nTest content',
      })

      await expect(showAnchorDetails('test-anchor')).resolves.not.toThrow()

      const modal = document.getElementById('anchor-modal')
      expect(modal).not.toBeNull()
      expect(modal.classList.contains('hidden')).toBe(false)
    })
  })

  describe('overlapping loads', () => {
    beforeEach(async () => {
      global.fetch = vi.fn()
      createModal()
      const { fetchAnchorsData } = await import('../utils/data-loader.js')
      fetchAnchorsData.mockResolvedValue([])
    })

    afterEach(() => {
      delete global.fetch
    })

    it('lets the newer anchor win when two loads overlap', async () => {
      // The first fetch resolves LAST: without a guard its late write would land
      // on top of the anchor the reader actually clicked second.
      let releaseFirst
      global.fetch.mockReturnValueOnce(
        new Promise((resolve) => {
          releaseFirst = () =>
            resolve({
              ok: true,
              url: 'http://localhost/Semantic-Anchors/docs/anchors/slow.adoc',
              text: async () => '= Slow\n\nSlow body.',
            })
        })
      )
      global.fetch.mockResolvedValue({
        ok: true,
        url: 'http://localhost/Semantic-Anchors/docs/anchors/fast.adoc',
        text: async () => '= Fast\n\nFast body.',
      })

      const slow = showAnchorDetails('slow')
      await showAnchorDetails('fast')
      releaseFirst()
      await slow

      expect(document.getElementById('modal-title').textContent).toBe('Fast')
      expect(document.getElementById('modal-content').innerHTML).toContain('Fast body.')
      expect(document.getElementById('modal-content').innerHTML).not.toContain('Slow body.')
    })
  })

  describe('tested-on note', () => {
    beforeEach(async () => {
      global.fetch = vi.fn()
      createModal()

      const { fetchAnchorsData } = await import('../utils/data-loader.js')
      fetchAnchorsData.mockResolvedValue([
        {
          id: 'works-everywhere',
          title: 'Works Everywhere',
          priorTest: '2026-08-14',
          testedOn: [
            { model: 'haiku-4.5', works: true },
            { model: 'sonnet-5', works: true },
            { model: 'opus-5', works: true },
          ],
        },
        {
          id: 'partial-anchor',
          title: 'Partial Anchor',
          priorTest: '2026-08-14',
          testedOn: [
            { model: 'haiku-4.5', works: false },
            { model: 'sonnet-5', works: true },
            { model: 'opus-5', works: true },
          ],
        },
        { id: 'unmeasured-anchor', title: 'Unmeasured Anchor' },
        { id: 'dated-only-anchor', title: 'Dated Only', priorTest: '2026-08-14' },
      ])
    })

    afterEach(() => {
      delete global.fetch
    })

    it('should name every model that was tested, including ones where it did not work', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Partial\n\nContent' })

      await showAnchorDetails('partial-anchor')

      const note = document.querySelector('.anchor-tested-on')
      expect(note).not.toBeNull()
      expect(note.textContent).toContain('haiku-4.5')
      expect(note.textContent).toContain('sonnet-5')
      expect(note.textContent).toContain('opus-5')
    })

    it('should distinguish a model where the anchor did not work from one where it did', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Partial\n\nContent' })

      await showAnchorDetails('partial-anchor')

      const failed = document.querySelector('.anchor-tested-on .tested-no')
      const worked = document.querySelector('.anchor-tested-on .tested-yes')
      expect(failed).not.toBeNull()
      expect(failed.textContent).toContain('haiku-4.5')
      expect(worked).not.toBeNull()
      expect(worked.textContent).toContain('sonnet-5')
    })

    it('should mark every model as working when the anchor worked everywhere', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Works\n\nContent' })

      await showAnchorDetails('works-everywhere')

      expect(document.querySelectorAll('.anchor-tested-on .tested-yes')).toHaveLength(3)
      expect(document.querySelectorAll('.anchor-tested-on .tested-no')).toHaveLength(0)
    })

    it('should link the note to the prior-test register', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Works\n\nContent' })

      await showAnchorDetails('works-everywhere')

      const link = document.querySelector('.anchor-tested-on a')
      expect(link.getAttribute('href')).toContain('/prior-tests')
    })

    it('should render nothing for an anchor that was never measured', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Unmeasured\n\nContent' })

      await showAnchorDetails('unmeasured-anchor')

      expect(document.querySelector('.anchor-tested-on')).toBeNull()
    })

    it('should render nothing when a date exists but no models are recorded', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Dated Only\n\nContent' })

      await showAnchorDetails('dated-only-anchor')

      expect(document.querySelector('.anchor-tested-on')).toBeNull()
    })
  })

  describe('example image', () => {
    beforeEach(async () => {
      global.fetch = vi.fn()
      createModal()

      const { fetchAnchorsData } = await import('../utils/data-loader.js')
      fetchAnchorsData.mockResolvedValue([
        {
          id: 'swiss-style',
          title: 'Swiss Style',
          exampleImage: 'swiss-style.webp',
          priorTest: '2026-10-25',
          testedOn: [{ model: 'opus-5-5', works: true }],
        },
        { id: 'plain-anchor', title: 'Plain Anchor' },
        { id: 'evil-anchor', title: 'Evil Anchor', exampleImage: '../evil.webp' },
      ])
    })

    afterEach(() => {
      delete global.fetch
    })

    it('should show the example image with alt text and a caption linking to the style gallery', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Swiss Style\n\nContent' })

      await showAnchorDetails('swiss-style')

      const figure = document.querySelector('#modal-content figure.anchor-example-image')
      expect(figure).not.toBeNull()
      const img = figure.querySelector('img')
      expect(img.getAttribute('src')).toMatch(/examples\/swiss-style\.webp$/)
      expect(img.getAttribute('alt')).toContain('Swiss Style')
      expect(img.getAttribute('loading')).toBe('lazy')
      const link = figure.querySelector('figcaption a')
      // The gallery (#872) shows all examples side by side and links the blog post.
      expect(link.getAttribute('href')).toMatch(/\/style-gallery$/)
      expect(link.getAttribute('href')).not.toContain('/de/')
    })

    it('should place the image below the description and above the tested-on note', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Swiss Style\n\nContent' })

      await showAnchorDetails('swiss-style')

      const content = document.getElementById('modal-content')
      const figure = content.querySelector('figure.anchor-example-image')
      const note = content.querySelector('.anchor-tested-on')
      const paragraph = content.querySelector('.paragraph')
      // DOCUMENT_POSITION_FOLLOWING = 4
      expect(paragraph.compareDocumentPosition(figure) & 4).toBeTruthy()
      expect(figure.compareDocumentPosition(note) & 4).toBeTruthy()
    })

    it('should show the German caption and use the rendered (German) title in the alt text', async () => {
      const { i18n } = await import('../i18n.js')
      global.localStorage = window.localStorage
      i18n.setLang('de')
      try {
        global.fetch.mockResolvedValue({
          ok: true,
          text: async () => '= Schweizer Stil\n\nInhalt',
        })

        await showAnchorDetails('swiss-style')

        const figure = document.querySelector('#modal-content figure.anchor-example-image')
        expect(figure.querySelector('figcaption').textContent).toContain('Claude Opus 5.5')
        expect(figure.querySelector('figcaption').textContent).toContain('Stil')
        expect(figure.querySelector('img').getAttribute('alt')).toContain('Schweizer Stil')
      } finally {
        i18n.setLang('en')
        delete global.localStorage
      }
    })

    it('should name the model in the caption', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Swiss Style\n\nContent' })

      await showAnchorDetails('swiss-style')

      expect(document.querySelector('.anchor-example-image figcaption').textContent).toContain(
        'Claude Opus 5.5'
      )
    })

    it('should render no image for an anchor without one', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Plain\n\nContent' })

      await showAnchorDetails('plain-anchor')

      expect(document.querySelector('.anchor-example-image')).toBeNull()
    })

    it('should ignore an image name that points outside the examples directory', async () => {
      global.fetch.mockResolvedValue({ ok: true, text: async () => '= Evil\n\nContent' })

      await showAnchorDetails('evil-anchor')

      expect(document.querySelector('.anchor-example-image')).toBeNull()
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
