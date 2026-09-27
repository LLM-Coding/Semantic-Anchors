import { describe, it, expect, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

vi.mock('../i18n.js', () => ({
  i18n: {
    t: (key) => key,
    currentLang: () => 'en',
  },
}))

import { renderMain } from './main-content.js'
import { catalogPrompt, CATALOG_VERSION, fromManifest } from '../utils/talk-it-over.js'
import * as manifest from '../utils/llms-index-manifest.js'

const CATALOG_PROMPT = catalogPrompt(fromManifest(manifest))
import { APPEARANCES } from '../data/appearances.js'

describe('renderMain — appearances strip', () => {
  it('shows every appearance above the fold', () => {
    const html = renderMain()
    for (const { href, logo } of APPEARANCES) {
      expect(html).toContain(`href="${href}"`)
      expect(html).toContain(logo)
    }
  })

  // Measured on a 1280x720 laptop: sitting after the how-to-use steps put the
  // strip 35px below the fold, which defeats the point of moving it out of the
  // footer. It belongs directly after the before/after example.
  it('places the strip after the example and before the how-to-use steps', () => {
    const html = renderMain()
    const hero = html.indexOf('id="hero"')
    const strip = html.indexOf('id="appearances"')
    const howTo = html.indexOf('hero.howToUseTitle')
    const filters = html.indexOf('id="filters"')
    expect(hero).toBeGreaterThan(-1)
    expect(strip).toBeGreaterThan(hero)
    expect(strip).toBeLessThan(howTo)
    expect(howTo).toBeLessThan(filters)
  })

  it('keeps press and appearances as separately labelled groups', () => {
    const html = renderMain()
    const strip = html.slice(html.indexOf('id="appearances"'), html.indexOf('id="filters"'))
    expect(strip).toContain('footer.featuredIn')
    expect(strip).toContain('footer.asSeenOn')
  })
})

describe('renderMain — TalkItOver catalog button', () => {
  // .txt, not .md: GitHub Pages serves .md as text/markdown, and ChatGPT
  // refuses that with "400 Unsupported content-type" — then answers from the
  // web instead of saying it could not read the file. Both files hold the same
  // bytes, so only the extension decides whether the reader gets the catalog.
  it('hands over the index, not the full-text file', () => {
    const html = renderMain()

    expect(html).toContain('llms-index.txt')
    expect(html).not.toContain('url="/Semantic-Anchors/llms.txt"')
  })

  // The prompt is all the reader's LLM gets. A path like /Semantic-Anchors/… has
  // no host to resolve against, so the file would simply be unreachable for it.
  // An assistant kept answering from an index we had replaced half an hour
  // earlier. Whatever caches the file between the site and the reader's LLM
  // caches it by URL, so the URL has to change when the content does.
  it('carries the index version, so a stale copy is not reused', async () => {
    const { LLMS_INDEX_VERSION } = manifest
    const url = renderMain().match(/<talk-it-over[\s\S]*?url="([^"]*)"/)[1]

    expect(new URL(url).searchParams.get('v')).toBe(LLMS_INDEX_VERSION)
  })

  it('names the index by a URL that works outside this page', () => {
    const html = renderMain()
    const url = html.match(/<talk-it-over[\s\S]*?url="([^"]*)"/)[1]

    expect(url).toMatch(/^https:\/\//)
    expect(new URL(url).href).toBe(url)
    expect(new URL(url).pathname.endsWith('/llms-index.txt')).toBe(true)
  })

  it('carries the catalog prompt and its version', () => {
    const html = renderMain()

    expect(html).toContain(`data-prompt="${CATALOG_VERSION}"`)
    expect(html).toContain(CATALOG_PROMPT.split('\n')[0])
  })

  // A blank line inside an HTML attribute ends the element in most Markdown and
  // template pipelines, which would tear the page apart at exactly this spot.
  // The serialisation itself is covered in utils/talk-it-over.test.js; here it
  // only matters that the rendered page actually went through it.
  it('keeps the prompt on one line so the attribute survives the markup', () => {
    const html = renderMain()
    const attribute = html.match(/<talk-it-over[\s\S]*?prompt="([^"]*)"/)[1]

    expect(attribute).not.toContain('\n')
    expect(attribute.replace(/&#10;/g, '\n')).toBe(CATALOG_PROMPT)
  })
})

describe('renderMain — the prompt hands over the pages it must not lose', () => {
  // The index is a map, and a map the reader's LLM may not follow: it refuses a
  // URL it only found inside a document it fetched. Every page named here is
  // reachable for it, and every page left out is not.
  it('names every documentation page of the manifest', () => {
    const attribute = renderMain().match(/<talk-it-over[\s\S]*?prompt="([^"]*)"/)[1]
    const prompt = attribute.replace(/&#10;/g, '\n')

    for (const page of manifest.DOC_PAGES) expect(prompt).toContain(page.url)
    expect(prompt).toContain(manifest.CONTRACTS_URL)
    expect(prompt).toContain(manifest.FULL_TEXT_URL)
  })

  // A prompt past the component's ceiling is not broken, it is demoted: every
  // provider falls back to the clipboard and the reader pastes instead of
  // clicks. This is the test that notices the day the list grows too long.
  it('stays inside the budget that keeps the button one click', () => {
    const html = renderMain()
    const url = html.match(/<talk-it-over[\s\S]*?url="([^"]*)"/)[1]
    const attribute = html.match(/<talk-it-over[\s\S]*?prompt="([^"]*)"/)[1]
    const prompt = attribute.replace(/&#10;/g, '\n').replace('{url}', url)
    const source = readFileSync(
      path.join(import.meta.dirname, '../../public/talkitover.js'),
      'utf-8'
    )
    const ceiling = Number(source.match(/MAX_URL_LENGTH = (\d+)/)[1])

    expect(('https://claude.ai/new?q=' + encodeURIComponent(prompt)).length).toBeLessThan(ceiling)
  })
})
