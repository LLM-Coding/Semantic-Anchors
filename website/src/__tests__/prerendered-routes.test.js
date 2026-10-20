import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..', '..', '..')
const prerenderSource = readFileSync(path.join(root, 'scripts/prerender-routes.js'), 'utf-8')
const mainSource = readFileSync(path.join(root, 'website/src/main.js'), 'utf-8')

// prerender-routes.js runs its build step on import, so read its ROUTES list as text.
function prerenderedPaths() {
  const start = prerenderSource.indexOf('const ROUTES = [')
  const end = prerenderSource.indexOf('\n]\n', start)
  const block = prerenderSource.slice(start, end)
  return [...block.matchAll(/path: '([^']+)',\s*fragment:/g)].map((m) => m[1])
}

function spaRoutes() {
  return new Set([...mainSource.matchAll(/addRoute\('([^']+)'/g)].map((m) => m[1]))
}

describe('pre-rendered pages have a SPA route', () => {
  /*
   * A page that is pre-rendered but has no route shows crawlers the right
   * content while the SPA, once booted, replaces it with the home page.
   */
  it('finds the pre-rendered doc routes', () => {
    expect(prerenderedPaths().length).toBeGreaterThan(10)
  })

  it.each(prerenderedPaths())('%s is registered with addRoute in main.js', (route) => {
    expect(spaRoutes()).toContain(route)
  })
})
