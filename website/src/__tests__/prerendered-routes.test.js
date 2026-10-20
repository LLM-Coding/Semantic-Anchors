import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..', '..', '..')
const prerenderSource = readFileSync(path.join(root, 'scripts/prerender-routes.js'), 'utf-8')
const mainSource = readFileSync(path.join(root, 'website/src/main.js'), 'utf-8')

// prerender-routes.js runs its build step on import, so read its ROUTES list as text.
function prerenderedPaths() {
  const start = prerenderSource.indexOf('const ROUTES = [')
  const end = prerenderSource.indexOf('\n]', start)
  if (start < 0 || end < 0) throw new Error('ROUTES list not found in prerender-routes.js')
  // One chunk per route object, so key order inside an entry does not matter.
  return prerenderSource
    .slice(start, end)
    .split(/\n {2}\{/)
    .filter((entry) => /\bfragment:/.test(entry) && !/\bredirectTo:/.test(entry))
    .map((entry) => entry.match(/\bpath: ['"`]([^'"`]+)['"`]/)?.[1])
}

function spaRoutes() {
  const code = mainSource.replace(/^\s*\/\/.*$/gm, '')
  return new Set([...code.matchAll(/addRoute\(['"`]([^'"`]+)['"`]/g)].map((m) => m[1]))
}

describe('pre-rendered pages have a SPA route', () => {
  /*
   * A page that is pre-rendered but has no route shows crawlers the right
   * content while the SPA, once booted, replaces it with the home page.
   */
  it('finds the pre-rendered doc routes', () => {
    const paths = prerenderedPaths()
    expect(paths.length).toBeGreaterThan(10)
    expect(paths).not.toContain(undefined)
  })

  it.each(prerenderedPaths())('%s is registered with addRoute in main.js', (route) => {
    expect(spaRoutes()).toContain(route)
  })
})
