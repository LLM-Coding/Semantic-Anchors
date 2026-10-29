import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Asciidoctor from '@asciidoctor/core'
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

describe('anchor cross-references in the catalog', () => {
  // Invariant: every <<id>> in an anchor source resolves, either to another
  // anchor (rewritten to its page) or to a section of the same document.
  // A target that is neither is a dead link on every surface, modal included.
  it('resolve to an anchor or to a section of the same document', () => {
    const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'anchors')
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.adoc') && !f.startsWith('_'))
    const ids = new Set(files.map((f) => f.replace(/(\.de)?\.adoc$/, '')))
    const asciidoctor = Asciidoctor()
    const dangling = []
    for (const file of files) {
      const src = fs.readFileSync(path.join(dir, file), 'utf-8')
      const targets = [...src.matchAll(/<<([^,>]+)(?:,[^>]*)?>>/g)].map((m) => m[1].trim())
      if (targets.length === 0) continue
      const refs = asciidoctor
        .load(src, { safe: 'safe', attributes: { idprefix: '', idseparator: '-' } })
        .getRefs()
      for (const t of targets) {
        if (!ids.has(t) && !(t in refs)) dangling.push(`${file}: <<${t}>>`)
      }
    }
    expect(dangling).toEqual([])
  })
})
