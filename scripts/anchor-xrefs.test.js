import { describe, it, expect } from 'vitest'
import { rewriteAnchorXrefs } from './lib/anchor-xrefs.js'

// #860: <<id,text>> renders as href="#id", which points nowhere on the
// pre-rendered /anchor/<id> pages. Known anchor ids become clean routes.
const anchorIds = new Set(['pyramid-principle', 'swiss-style', 'only-english'])
const germanIds = new Set(['pyramid-principle', 'swiss-style'])

describe('rewriteAnchorXrefs', () => {
  it('points an English cross-reference at the English anchor page', () => {
    const html = '<a href="#pyramid-principle">Pyramid Principle</a>'
    expect(rewriteAnchorXrefs(html, { lang: 'en', anchorIds, germanIds })).toBe(
      '<a href="/Semantic-Anchors/anchor/pyramid-principle">Pyramid Principle</a>'
    )
  })

  it('points a German cross-reference at the German anchor page', () => {
    const html = '<a href="#swiss-style">Swiss Style</a>'
    expect(rewriteAnchorXrefs(html, { lang: 'de', anchorIds, germanIds })).toBe(
      '<a href="/Semantic-Anchors/de/anchor/swiss-style">Swiss Style</a>'
    )
  })

  it('falls back to the English page when the target has no German version', () => {
    const html = '<a href="#only-english">x</a>'
    expect(rewriteAnchorXrefs(html, { lang: 'de', anchorIds, germanIds })).toBe(
      '<a href="/Semantic-Anchors/anchor/only-english">x</a>'
    )
  })

  it('leaves in-page section links and unknown ids alone', () => {
    const html =
      '<a href="#_core_concepts">Core</a> <a href="#no-such-anchor">?</a> <a href="#/about">a</a>'
    expect(rewriteAnchorXrefs(html, { lang: 'en', anchorIds, germanIds })).toBe(html)
  })

  it('rewrites every cross-reference in a fragment', () => {
    const html = '<a href="#swiss-style">a</a> and <a href="#pyramid-principle">b</a>'
    const out = rewriteAnchorXrefs(html, { lang: 'en', anchorIds, germanIds })
    expect(out.match(/href="#/g)).toBeNull()
    expect(out.match(/href="\/Semantic-Anchors\/anchor\//g)).toHaveLength(2)
  })
})
