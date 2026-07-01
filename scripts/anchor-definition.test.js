import { describe, it, expect } from 'vitest'
import { getAnchorDefinition } from './lib/anchor-definition.js'

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

  it('returns null for a non-existent file', () => {
    expect(getAnchorDefinition('docs/anchors/does-not-exist.adoc')).toBeNull()
  })
})
