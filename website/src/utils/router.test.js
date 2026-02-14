import { describe, it, expect, beforeEach, vi } from 'vitest'
import { addRoute, getCurrentRoute, initRouter, navigate } from './router.js'

describe('router', () => {
  beforeEach(() => {
    window.location.hash = '#/'
  })

  it('returns current route from hash', () => {
    window.location.hash = '#/about'
    expect(getCurrentRoute()).toBe('/about')
  })

  it('navigates to a route via hash', () => {
    navigate('/contributing')
    expect(window.location.hash).toBe('#/contributing')
  })

  it('runs registered handler on init and hash changes', async () => {
    const handler = vi.fn()
    addRoute('/router-test', handler)
    window.location.hash = '#/router-test'

    initRouter()
    expect(handler).toHaveBeenCalledTimes(1)

    window.location.hash = '#/router-test'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(handler).toHaveBeenCalledTimes(2)
  })
})
