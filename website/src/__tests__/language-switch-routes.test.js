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
  if (existsSync(path.join(root, de))) return true
  return path.dirname(de) === '.' && existsSync(path.join(root, 'docs', de))
}

// Routes registered with addRoute whose handler calls loadDocContent.
function docRoutes() {
  return [...mainSource.matchAll(/addRoute\(['"`]([^'"`]+)['"`],\s*(\w+)\)/g)]
    .map(([, route, handler]) => ({ route, body: functionBody(handler) }))
    .filter(({ body }) => body.includes('loadDocContent('))
    .map(({ route, body }) => ({
      route,
      doc: body.match(/loadDocContent\(['"`]([^'"`]+)['"`]\)/)?.[1],
    }))
}

function bilingualDocRoutes() {
  return docRoutes().filter(({ doc }) => doc && hasGermanVersion(doc))
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

  // A handler refactored to a computed doc path would otherwise drop out of
  // the check below without failing.
  it.each(docRoutes())('$route loads a literal doc path', ({ doc }) => {
    expect(doc).toMatch(/\.adoc$/)
  })

  it.each(bilingualDocRoutes())('$route reloads $doc on language change', ({ route, doc }) => {
    expect(languageSwitchDocs().get(route)).toBe(doc)
  })
})
