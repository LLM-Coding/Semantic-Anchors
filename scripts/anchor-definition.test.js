import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getAnchorDefinition } from './lib/anchor-definition.js'

const FIXTURES = 'scripts/__fixtures__/anchor-definition'
const ANCHORS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'anchors')
const germanAnchorFiles = () => fs.readdirSync(ANCHORS_DIR).filter((f) => f.endsWith('.de.adoc'))

describe('getAnchorDefinition', () => {
  it('returns a curated :definition: attribute as source=curated', () => {
    // mece carries a curated :definition: (seeded in #580).
    const def = getAnchorDefinition('docs/anchors/mece.adoc')
    expect(def).toBeTruthy()
    expect(def.source).toBe('curated')
    expect(def.text).toMatch(/Mutually Exclusive, Collectively Exhaustive/)
  })

  it('falls back to a derived definition as source=derived', () => {
    // circuit-breaker has no curated :definition:, so it derives from Core Concepts.
    const def = getAnchorDefinition('docs/anchors/circuit-breaker.adoc')
    expect(def).toBeTruthy()
    expect(def.source).toBe('derived')
    expect(def.text.length).toBeGreaterThan(20)
  })

  // #861: German files head the section "Kernkonzepte", not "Core Concepts".
  it('derives a definition from a German "Kernkonzepte" section', () => {
    const def = getAnchorDefinition(`${FIXTURES}/de-derived.de.adoc`)
    expect(def).toEqual({
      text: 'Ein abgeleiteter deutscher Definitionstext, lang genug für den Antwortblock.',
      source: 'derived',
    })
  })

  // #861: bullet-style Core Concepts have no definition-list entry, so the
  // first `Term::` line after the heading is metadata. No answer beats a wrong one.
  it.each([
    'bullets-then-proponents.adoc',
    'bullets-then-proponent-singular.adoc',
    'bullets-then-proponents.de.adoc',
  ])('never derives a definition from a metadata term (%s)', (file) => {
    expect(getAnchorDefinition(`${FIXTURES}/${file}`)).toBeNull()
  })

  it('derives a German definition wherever the English twin derives one', () => {
    // Invariant over the real catalog: a German file derives a definition
    // whenever its English counterpart does from a definition-list entry.
    const missing = germanAnchorFiles().filter((de) => {
      const en = de.replace(/\.de\.adoc$/, '.adoc')
      const enDef = getAnchorDefinition(`docs/anchors/${en}`)
      return enDef && enDef.source === 'derived' && !getAnchorDefinition(`docs/anchors/${de}`)
    })
    expect(missing).toEqual([])
  })

  it('gives every German anchor a curated definition when its English twin has one', () => {
    const missing = germanAnchorFiles().filter((de) => {
      const en = de.replace(/\.de\.adoc$/, '.adoc')
      const enDef = getAnchorDefinition(`docs/anchors/${en}`)
      const deDef = getAnchorDefinition(`docs/anchors/${de}`)
      return enDef?.source === 'curated' && deDef?.source !== 'curated'
    })
    expect(missing).toEqual([])
  })

  it('returns null for a non-existent file', () => {
    expect(getAnchorDefinition('docs/anchors/does-not-exist.adoc')).toBeNull()
  })
})
