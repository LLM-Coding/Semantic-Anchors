import { describe, it, expect, beforeEach, vi } from 'vitest'
import { addRoute, getCurrentRoute, initRouter, navigate } from './router.js'
import { i18n } from '../i18n.js'

describe('router', () => {
  beforeEach(() => {
    // Reset to base path
    history.replaceState(null, '', '/')
    window.location.hash = ''
  })

  it('returns current route from pathname', () => {
    history.replaceState(null, '', '/about')
    expect(getCurrentRoute()).toBe('/about')
  })

  it('supports legacy hash URLs for backward compatibility', () => {
    window.location.hash = '#/about'
    expect(getCurrentRoute()).toBe('/about')
  })

  it('navigates to a route via pushState', () => {
    navigate('/contributing')
    expect(window.location.pathname).toBe('/contributing')
  })

  it('runs registered handler on init and popstate', async () => {
    const handler = vi.fn()
    addRoute('/router-test', handler)
    history.replaceState(null, '', '/router-test')

    initRouter()
    expect(handler).toHaveBeenCalledTimes(1)

    history.pushState(null, '', '/router-test')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('reports a GoatCounter pageview with the path on SPA navigation', () => {
    window.goatcounter = { count: vi.fn() }
    addRoute('/gc-test', vi.fn())
    // The very first route of the run is skipped by design (count.js auto-counts
    // the initial load); clear and navigate again so we assert a later change.
    navigate('/gc-test')
    window.goatcounter.count.mockClear()
    navigate('/gc-test')
    expect(window.goatcounter.count).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/gc-test' })
    )
    delete window.goatcounter
  })
})

describe('router language prefix (/de)', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/')
    window.location.hash = ''
    localStorage.clear()
    i18n.init()
  })

  it('strips the /de prefix from the current route', () => {
    history.replaceState(null, '', '/de/about')
    expect(getCurrentRoute()).toBe('/about')
  })

  it('maps bare /de to the home route', () => {
    history.replaceState(null, '', '/de')
    expect(getCurrentRoute()).toBe('/')
  })

  it('resolves the underlying route handler and switches to German', () => {
    const handler = vi.fn()
    addRoute('/de-prefix-test', handler)
    history.replaceState(null, '', '/de/de-prefix-test')

    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(handler).toHaveBeenCalled()
    expect(i18n.currentLang()).toBe('de')
  })

  it('leaves the language untouched on unprefixed routes', () => {
    addRoute('/en-route-test', vi.fn())
    history.replaceState(null, '', '/en-route-test')

    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(i18n.currentLang()).toBe('en')
  })
})

describe('router route-change event (#615)', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/')
    window.location.hash = ''
    localStorage.clear()
    i18n.init()
  })

  it('dispatches route:changed with the resolved path', () => {
    const listener = vi.fn()
    document.addEventListener('route:changed', listener)
    addRoute('/event-test', vi.fn())
    history.replaceState(null, '', '/event-test')

    window.dispatchEvent(new PopStateEvent('popstate'))

    expect(listener).toHaveBeenCalled()
    expect(listener.mock.calls.at(-1)[0].detail.path).toBe('/event-test')
    document.removeEventListener('route:changed', listener)
  })
})

describe('router contract route (/contract/:id)', () => {
  beforeEach(() => {
    history.replaceState(null, '', '/')
    window.location.hash = ''
    localStorage.clear()
    i18n.init()
    document.body.innerHTML = ''
    // jsdom does not implement scrollIntoView
    window.Element.prototype.scrollIntoView = vi.fn()
  })

  function addContractsRoute() {
    const handler = vi.fn(() => {
      document.body.innerHTML = `
        <div data-contract-id="specification"><h3>Specification</h3></div>`
    })
    addRoute('/contracts', handler)
    return handler
  }

  it('renders the contracts page for /contract/:id', async () => {
    const handler = addContractsRoute()
    history.replaceState(null, '', '/contract/specification')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 0))

    expect(handler).toHaveBeenCalled()
  })

  it('sets the document title from the contract card heading', async () => {
    addContractsRoute()
    history.replaceState(null, '', '/contract/specification')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 0))

    expect(document.title).toBe('Specification — Semantic Anchors')
  })

  it('scrolls the contract card into view', async () => {
    addContractsRoute()
    const scrollSpy = vi.fn()
    window.Element.prototype.scrollIntoView = scrollSpy
    history.replaceState(null, '', '/contract/specification')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 0))

    expect(scrollSpy).toHaveBeenCalled()
  })

  it('rejects unsafe contract ids', async () => {
    const handler = addContractsRoute()
    history.replaceState(null, '', '/contract/NOT%20a%20valid..id')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 0))

    expect(handler).not.toHaveBeenCalled()
  })

  it('finds the card even when the contracts page renders late', async () => {
    // Direct page loads fetch contracts.json first — the card appears well
    // after the route handler returns. The router polls instead of checking
    // once (#611 follow-up).
    const handler = vi.fn(() => {
      setTimeout(() => {
        document.body.innerHTML = `
        <div data-contract-id="specification"><h3>Specification</h3></div>`
      }, 150)
    })
    addRoute('/contracts', handler)
    history.replaceState(null, '', '/contract/specification')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 400))

    expect(document.title).toBe('Specification — Semantic Anchors')
  })

  it('highlights the card persistently and clears it on the next route', async () => {
    addContractsRoute()
    addRoute('/elsewhere', vi.fn())
    history.replaceState(null, '', '/contract/specification')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 0))

    const card = document.querySelector('[data-contract-id="specification"]')
    expect(card.classList.contains('ring-2')).toBe(true)

    history.replaceState(null, '', '/elsewhere')
    window.dispatchEvent(new PopStateEvent('popstate'))
    expect(card.classList.contains('ring-2')).toBe(false)
  })

  it('switches to German for /de/contract/:id', async () => {
    const handler = addContractsRoute()
    history.replaceState(null, '', '/de/contract/specification')

    window.dispatchEvent(new PopStateEvent('popstate'))
    await new Promise((r) => setTimeout(r, 0))

    expect(handler).toHaveBeenCalled()
    expect(i18n.currentLang()).toBe('de')
  })
})
