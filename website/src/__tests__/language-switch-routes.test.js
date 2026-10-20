import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..', '..', '..')
const mainSource = readFileSync(path.join(root, 'website/src/main.js'), 'utf-8').replace(
  /^\s*\/\/.*$/gm,
  ''
)

function functionBody(name) {
  const start = mainSource.indexOf(`function ${name}(`)
  if (start < 0) return ''
  const end = mainSource.indexOf('\n}\n', start)
  return mainSource.slice(start, end)
}

// German sources sit next to the English one, or in docs/ for root files
// such as CONTRIBUTING.adoc (render-docs writes both to the same place).
function hasGermanVersion(docPath) {
  const de = docPath.replace(/\.adoc$/, '.de.adoc')
  return existsSync(path.join(root, de)) || existsSync(path.join(root, 'docs', path.basename(de)))
}

// Routes registered with addRoute whose handler loads a doc with a German version.
function bilingualDocRoutes() {
  return [...mainSource.matchAll(/addRoute\(['"`]([^'"`]+)['"`],\s*(\w+)\)/g)]
    .map(([, route, handler]) => ({
      route,
      doc: functionBody(handler).match(/loadDocContent\(['"`]([^'"`]+)['"`]\)/)?.[1],
    }))
    .filter(({ doc }) => doc && hasGermanVersion(doc))
}

// Doc reloads triggered by the language toggle, keyed by route.
function languageSwitchDocs() {
  const body = functionBody('handleLanguageChange')
  return new Map(
    [
      ...body.matchAll(
        /currentRoute === ['"`]([^'"`]+)['"`]\)\s*\{\s*loadDocContent\(['"`]([^'"`]+)['"`]\)/g
      ),
    ].map(([, route, doc]) => [route, doc])
  )
}

describe('language switch reloads every bilingual doc page', () => {
  /*
   * A doc page with a German version that the language toggle does not
   * reload keeps showing the old language until the user navigates away.
   */
  it('finds the bilingual doc routes', () => {
    expect(bilingualDocRoutes().length).toBeGreaterThan(5)
  })

  it.each(bilingualDocRoutes())('$route reloads $doc on language change', ({ route, doc }) => {
    expect(languageSwitchDocs().get(route)).toBe(doc)
  })
})
