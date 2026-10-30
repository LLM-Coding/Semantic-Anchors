import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAnchorDefinition, getAnchorMetaDescription } from './lib/anchor-definition.js'

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

  it.each([
    ['a title with an exclamation mark', 'Release It! and'],
    ['a German ordinal', '(2. Auflage'],
  ])('does not end a sentence at %s', (_, phrase) => {
    const meta = getAnchorMetaDescription(`${FIXTURES}/en-title-and-ordinal.adoc`)
    expect(meta).toContain(phrase)
  })

  it('does not end a sentence at an initial or an abbreviation', () => {
    const meta = getAnchorMetaDescription(`${FIXTURES}/en-initials.adoc`)
    expect(meta.endsWith('…')).toBe(true)
    expect(meta).not.toMatch(/ (E|St|e\.g)\.$/)
  })

  it('cuts at a word boundary when no sentence ends within 220 characters', () => {
    const meta = getAnchorMetaDescription(`${FIXTURES}/en-initials.adoc`)
    expect(meta.length).toBeLessThanOrEqual(221)
    expect(meta.startsWith('Initials Sample Anchor is a fixture')).toBe(true)
    expect(meta).not.toMatch(/\s…$/)
  })

  it('stays within 221 characters for every anchor file', () => {
    const tooLong = anchorFiles().filter(
      (f) => (getAnchorMetaDescription(`docs/anchors/${f}`) || '').length > 221
    )
    expect(tooLong).toEqual([])
  })

  it('returns null without a definition', () => {
    expect(getAnchorMetaDescription(`${FIXTURES}/en-no-definition.adoc`)).toBeNull()
  })
})
