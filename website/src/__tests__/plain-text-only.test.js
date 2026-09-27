import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'

vi.mock('../i18n.js', () => ({
  i18n: { t: (key) => key, currentLang: () => 'en' },
}))

import * as manifest from '../utils/llms-index-manifest.js'

/**
 * Everything the button names must be served as text/plain.
 *
 * GitHub Pages derives the content type from the extension: .md becomes
 * text/markdown, and ChatGPT answers that with "400 Unsupported content-type".
 * It does not tell the reader it lacks the file — it searches the web and
 * answers from what it finds. Measured 2026-09-14: asked three times about
 * files it could not fetch, wrong three times, each answer plausible enough to
 * pass unnoticed without the file in hand.
 *
 * So .txt is not cosmetic here. It is the difference between a reader getting
 * the catalog and a reader getting something invented about the catalog.
 */

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const PUBLIC = path.join(ROOT, 'website/public')

/** Every address the prompt hands to the reader's LLM. */
function addressesInPrompt() {
  return [
    ...manifest.BUNDLES.map((bundle) => bundle.url),
    ...manifest.DOC_PAGES.map((page) => page.url),
    manifest.CONTRACTS_URL,
    manifest.FULL_TEXT_URL,
  ].filter(Boolean)
}

describe('a split bundle says which part holds what', () => {
  /*
   * "Design Principles & Patterns (1/2)" tells the reader's LLM nothing about
   * what is inside. It has to guess which half holds the term it wants, and a
   * wrong guess costs a fetch and looks like an answer.
   *
   * Measured: shrinking the bundles makes this worse, not better — at a 10 KB
   * limit, 61 of 64 bundles are nameless parts. The fix is not smaller bundles
   * but listing the terms, which the raised URL budget now affords.
   */
  it('gives every bundle its terms', () => {
    const without = manifest.BUNDLES.filter((bundle) => !bundle.terms?.length)

    expect(without.map((bundle) => bundle.title)).toEqual([])
  })

  it('loses no term on the way into the prompt', () => {
    const terms = manifest.BUNDLES.flatMap((bundle) => bundle.terms)

    expect(terms.length).toBeGreaterThan(100)

    // 14 anchors sit in two categories each. That is deliberate: the reader
    // finds them in whichever category they look. So the list is longer than
    // the set, and asserting uniqueness here would be asserting the wrong
    // thing — measured 210 entries, 196 distinct.
    expect(new Set(terms).size).toBeLessThanOrEqual(terms.length)
    expect(terms.filter((term) => !term.trim())).toEqual([])
  })

  it('puts the terms into the prompt, not just the manifest', async () => {
    const { catalogPrompt, fromManifest } = await import('../utils/talk-it-over.js')
    const prompt = catalogPrompt(fromManifest(manifest))

    for (const bundle of manifest.BUNDLES) {
      for (const term of bundle.terms) {
        expect(prompt, `"${term}" fehlt im Prompt`).toContain(term)
      }
    }
  })
})

describe('no generated file links to a markdown address', () => {
  /*
   * The prompt was checked, llms-index was not — and it kept linking the
   * bundles as .md after the rename. Seventeen dead links in the file the
   * reader's LLM is pointed at, live, unnoticed by a green test suite.
   *
   * A test that covers one output and not its siblings is how that happens.
   * This one walks every generated file.
   */
  const GENERATED = [
    'llms.txt',
    'llms-index.txt',
    'llms-index.md',
    'llms-index.html',
    'contracts.txt',
  ]

  for (const file of GENERATED) {
    it(`${file} names no bundle or anchor as .md`, () => {
      const full = path.join(PUBLIC, file)
      if (!fs.existsSync(full)) return

      const dead = [
        ...fs.readFileSync(full, 'utf-8').matchAll(/(?:bundles|anchors)\/[A-Za-z0-9._-]+\.md/g),
      ].map((found) => found[0])

      expect([...new Set(dead)]).toEqual([])
    })
  }
})

describe('the button only names plain text', () => {
  it('names no address with a markdown extension', () => {
    const markdown = addressesInPrompt().filter((url) => url.endsWith('.md'))

    expect(
      markdown,
      'These are served as text/markdown. ChatGPT refuses them and invents an ' +
        'answer instead of saying so.'
    ).toEqual([])
  })

  /*
   * The addresses above all travel through the manifest. The button's own `url`
   * attribute does not — it is built inline in main-content.js, so it sat
   * outside every guard in this file and stayed .md after the rename. ChatGPT
   * refused it with "400 Unsupported content-type" and answered from the web
   * instead, which is the exact failure the header of this file describes.
   *
   * So the check has to read the rendered attribute, not the manifest.
   */
  it('hands over the index as .txt, not .md', async () => {
    const { renderMain } = await import('../components/main-content.js')
    const url = renderMain().match(/<talk-it-over[\s\S]*?url="([^"]*)"/)[1]

    expect(
      new URL(url).pathname,
      'The button is served as text/markdown. ChatGPT refuses it and invents ' +
        'an answer instead of saying so.'
    ).toMatch(/\.txt$/)
  })

  it('writes every bundle as .txt', () => {
    const dir = path.join(PUBLIC, 'bundles')
    if (!fs.existsSync(dir)) return // not generated in this checkout

    expect(fs.readdirSync(dir).filter((file) => !file.endsWith('.txt'))).toEqual([])
  })

  it('writes every anchor file as .txt', () => {
    const dir = path.join(PUBLIC, 'anchors')
    if (!fs.existsSync(dir)) return

    expect(fs.readdirSync(dir).filter((file) => !file.endsWith('.txt'))).toEqual([])
  })

  it('names a bundle that was actually written', () => {
    const dir = path.join(PUBLIC, 'bundles')
    if (!fs.existsSync(dir)) return

    const missing = manifest.BUNDLES.map((bundle) => bundle.url.split('/bundles/')[1]).filter(
      (file) => file && !fs.existsSync(path.join(dir, file))
    )

    expect(missing, 'The prompt names a file the build did not write').toEqual([])
  })
})
