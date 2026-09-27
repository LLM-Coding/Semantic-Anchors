import { describe, it, expect } from 'vitest'
import { promptAttribute } from './talk-it-over.js'
import { catalogPrompt, CATALOG_VERSION, fromManifest } from './talk-it-over.js'
import * as realManifest from './llms-index-manifest.js'

const decode = (value) => value.replace(/&#10;/g, '\n')

describe('promptAttribute', () => {
  const prompts = [
    catalogPrompt(fromManifest(realManifest)),
    'one line, no break at all',
    'two\nlines',
    'a paragraph\n\nand another\n\nand a third',
    '\nleading and trailing\n',
    'ümläute, & ampersand, "quotes" and 🤖',
  ]

  // The invariant that matters: every newline becomes exactly one entity, and
  // nothing else changes. A serialiser that swallowed one break, or doubled the
  // last one, would still produce an attribute that looks fine.
  it.each(prompts)('turns every newline into exactly one entity: %j', (prompt) => {
    const attribute = promptAttribute(prompt)
    const newlines = (prompt.match(/\n/g) || []).length
    const entities = (attribute.match(/&#10;/g) || []).length

    expect(entities).toBe(newlines)
    expect(attribute).not.toContain('\n')
  })

  it.each(prompts)('round-trips back to the original prompt: %j', (prompt) => {
    expect(decode(promptAttribute(prompt))).toBe(prompt)
  })

  it('leaves a prompt without newlines untouched', () => {
    expect(promptAttribute('nothing to escape')).toBe('nothing to escape')
  })
})

// ─── catalogPrompt ───────────────────────────────────────────────────────────

import fs from 'node:fs'
import path from 'node:path'

const manifest = {
  bundles: [
    { title: 'Documentation', url: 'https://example.org/site/bundles/documentation.md' },
    { title: 'Testing (1/2)', url: 'https://example.org/site/bundles/testing-1.md' },
  ],
  docPages: [
    { title: 'About', url: 'https://example.org/site/about/' },
    { title: 'Brownfield Workflow', url: 'https://example.org/site/brownfield/' },
  ],
  contractsUrl: 'https://example.org/site/contracts.txt',
  fullTextUrl: 'https://example.org/site/llms.txt',
}

const urlsIn = (text) => text.match(/https?:\/\/\S+/g) || []

/** The component's own ceiling, read from the file the site actually ships. */
function maxUrlLength() {
  const source = fs.readFileSync(
    path.join(import.meta.dirname, '../../public/talkitover.js'),
    'utf-8'
  )
  return Number(source.match(/MAX_URL_LENGTH = (\d+)/)[1])
}

describe('catalogPrompt — the reader’s LLM may only fetch URLs it was given', () => {
  // The measured rule: a URL found inside a fetched document is refused, a URL
  // from the user's own message is not. Every page the prompt names is therefore
  // reachable, and every page it omits may not be.
  it('names every page of the manifest', () => {
    const prompt = catalogPrompt(manifest)

    for (const page of manifest.docPages) expect(prompt).toContain(page.url)
    for (const bundle of manifest.bundles) expect(prompt).toContain(bundle.url)
    expect(prompt).toContain(manifest.contractsUrl)
    expect(prompt).toContain(manifest.fullTextUrl)
  })

  // Cardinality: the prompt must grow with the list, not sample it. A template
  // that hard-coded three lines would pass the example above and fail here.
  it.each([0, 1, 5, 40])('carries all %i pages, however many there are', (count) => {
    const docPages = Array.from({ length: count }, (_, i) => ({
      title: `Page ${i}`,
      url: `https://example.org/site/page-${i}/`,
    }))
    const prompt = catalogPrompt({ ...manifest, docPages })

    for (const page of docPages) expect(prompt).toContain(page.url)
  })

  it.each([0, 1, 5, 40])('carries all %i bundles, however many there are', (count) => {
    const bundles = Array.from({ length: count }, (_, i) => ({
      title: `Category ${i}`,
      url: `https://example.org/site/bundles/cat-${i}.md`,
    }))
    const prompt = catalogPrompt({ ...manifest, bundles })

    for (const bundle of bundles) expect(prompt).toContain(bundle.url)
  })

  // The point of the bundles: after them, nothing the LLM needs is behind a
  // link it may not follow. A prompt that named the bundles but still sent the
  // reader hunting through the index for single anchors would waste them.
  it('tells the LLM the bundles hold the terms in full', () => {
    const prompt = catalogPrompt(manifest).toLowerCase()

    expect(prompt).toContain('in full')
  })

  // A relative path has no host to resolve against once the text sits in a chat
  // window. Every URL in the prompt has to survive that move.
  it('names every page absolutely', () => {
    for (const url of urlsIn(catalogPrompt(manifest))) {
      expect(() => new URL(url)).not.toThrow()
      expect(url).toMatch(/^https:\/\//)
    }
  })

  it('still leaves the index placeholder for the component to fill', () => {
    expect(catalogPrompt(manifest)).toContain('{url}')
  })

  // Searching solved the provenance rule in a measurement, and answered from
  // heise and two unrelated blogs instead of from this site. The prompt keeps
  // the reader's LLM on the pages it was handed.
  it('forbids answering from memory or from elsewhere', () => {
    const prompt = catalogPrompt(manifest).toLowerCase()

    expect(prompt).toContain('do not answer from memory')
    expect(prompt).toContain('elsewhere')
  })

  // The budget that decides whether the button stays one click. Above the
  // component's ceiling every provider falls back to the clipboard, and the
  // reader has to paste instead of click.
  it('leaves the one-click path intact for the real manifest', () => {
    const prompt = catalogPrompt(fromManifest(realManifest)).replace(
      '{url}',
      'https://llm-coding.github.io/Semantic-Anchors/llms-index.txt?v=00000000'
    )
    const providerUrl = 'https://claude.ai/new?q=' + encodeURIComponent(prompt)

    expect(providerUrl.length).toBeLessThan(maxUrlLength())
  })

  // Measured: asked for "the link to the Diátaxis anchor", the reader's LLM
  // handed over the raw file it had fetched — a download, not a page. Those
  // files are how it reads; they are not what a reader sends to a colleague.
  //
  // The extension used to be .md and the rule named it. Since the files are
  // .txt, naming an extension would pin the wrong thing — the rule is about
  // page versus file, not about which suffix the file happens to carry.
  it('says which URL to hand over when the reader asks for a link', () => {
    const prompt = catalogPrompt(manifest).toLowerCase()

    expect(prompt).toContain('link')
    expect(prompt).toMatch(/never the (text|\.txt) file|not the (text|\.txt) file/)
  })

  it('announces its own version', () => {
    expect(CATALOG_VERSION).toBe('katalog@3')
  })
})
