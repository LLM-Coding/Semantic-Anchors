import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getAnchorDefinition,
  getAnchorMetaDescription,
  cleanAdoc,
} from './lib/anchor-definition.js'

const FIXTURES = 'scripts/__fixtures__/anchor-definition'
const ANCHORS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'anchors')
const anchorFiles = () =>
  fs.readdirSync(ANCHORS_DIR).filter((f) => f.endsWith('.adoc') && !f.startsWith('_'))

describe('getAnchorDefinition', () => {
  it('returns a curated :definition: attribute as source=curated', () => {
    // mece carries a curated :definition: (seeded in #580).
    const def = getAnchorDefinition('docs/anchors/mece.adoc')
    expect(def).toBeTruthy()
    expect(def.source).toBe('curated')
    expect(def.text).toMatch(/Mutually Exclusive, Collectively Exhaustive/)
  })

  // #865: no fallback. A Core Concepts entry describes a part of the concept,
  // often not the concept itself; no answer beats a wrong one.
  it('returns null for a file without :definition:, even with Core Concepts', () => {
    expect(getAnchorDefinition(`${FIXTURES}/en-no-definition.adoc`)).toBeNull()
  })

  it('returns null for a non-existent file', () => {
    expect(getAnchorDefinition('docs/anchors/does-not-exist.adoc')).toBeNull()
  })

  // #865: the catalog invariant that lets the fallback go. Every anchor file,
  // English and German, carries its own curated definition.
  it('finds a curated definition in every anchor file, English and German', () => {
    const missing = anchorFiles().filter(
      (f) => getAnchorDefinition(`docs/anchors/${f}`)?.source !== 'curated'
    )
    expect(missing).toEqual([])
  })
})

describe('cleanAdoc', () => {
  it('strips bold, italic and monospace markers', () => {
    expect(cleanAdoc('*Bold*, _italic_ and `mono` text')).toBe('Bold, italic and mono text')
  })

  // CodeRabbit on #889: BEM's block__element--modifier lost its underscores.
  it('keeps underscores inside identifiers', () => {
    expect(cleanAdoc('the block__element--modifier structure and snake_case names')).toBe(
      'the block__element--modifier structure and snake_case names'
    )
  })
})

describe('getAnchorMetaDescription', () => {
  it('uses the curated definition unchanged when it fits', () => {
    expect(getAnchorMetaDescription(`${FIXTURES}/en-short-definition.adoc`)).toBe(
      'Short Sample Anchor is a fixture whose curated definition fits a search result as it is.'
    )
  })

  it('ends a long definition after the last full sentence that fits', () => {
    expect(getAnchorMetaDescription(`${FIXTURES}/en-long-definition.adoc`)).toBe(
      'Long Sample Anchor is a fixture whose curated definition runs well past the length a search result shows, so the meta description has to be cut.'
    )
  })

  // Each trap below is the last candidate between MIN_SENTENCE and the limit,
  // so a missing guard would end the description there instead of cutting at a
  // word boundary.
  it.each([
    ['an initial', 'trap-initial', 'E. St. Elmo Lewis'],
    ['an abbreviation', 'trap-abbrev', 'e.g. Sample work by Dr. Jane'],
    ['a German ordinal', 'trap-ordinal', '2. Auflage'],
    ['a title with an exclamation mark', 'trap-title', 'Release It! and'],
    ['"z. B."', 'trap-zb', 'z. B. Kanban'],
  ])('does not end a sentence at %s', (_, fixture, phrase) => {
    const meta = getAnchorMetaDescription(`${FIXTURES}/${fixture}.adoc`)
    expect(meta).toContain(phrase)
    expect(meta.endsWith('…')).toBe(true)
    expect(meta.length).toBeLessThanOrEqual(160)
    expect(meta).not.toMatch(/\s…$/)
  })

  it('cuts at a word boundary rather than end on a first sentence under 40 characters', () => {
    const meta = getAnchorMetaDescription(`${FIXTURES}/short-first.adoc`)
    expect(meta.startsWith('Short First Anchor is a fixture. Its second sentence')).toBe(true)
    expect(meta.endsWith('…')).toBe(true)
  })

  it('ends a sentence after a year', () => {
    expect(getAnchorMetaDescription(`${FIXTURES}/end-year.adoc`)).toMatch(/published in 2001\.$/)
  })

  it('ends a sentence after a closing quotation mark', () => {
    expect(getAnchorMetaDescription(`${FIXTURES}/end-quote.adoc`)).toMatch(/annimmst\.“$/)
  })

  it('stays within the 160 characters prerender-routes.js allows, for every anchor file', () => {
    const tooLong = anchorFiles().filter(
      (f) => (getAnchorMetaDescription(`docs/anchors/${f}`) || '').length > 160
    )
    expect(tooLong).toEqual([])
  })

  it('returns null without a definition', () => {
    expect(getAnchorMetaDescription(`${FIXTURES}/en-no-definition.adoc`)).toBeNull()
  })
})
