import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const Asciidoctor = require('@asciidoctor/core')

const root = path.join(import.meta.dirname, '..')
const categories = JSON.parse(
  readFileSync(path.join(root, 'website/public/data/categories.json'), 'utf-8')
)

describe('all-anchors.adoc — every anchor has its catalog ID as a fragment (#715)', () => {
  /*
   * generate-llms-txt.js writes a block anchor before each include so a
   * section can be reached as all-anchors#<anchor-id>. It used to skip
   * digit-leading IDs on the assumption that the title-derived ID matches.
   * That holds for 4mat ("4MAT") but not for 50-72-rule ("50/72 Rule"
   * derives 5072-rule), so the invariant is checked over the whole catalog
   * against what asciidoctor actually renders, with render-docs.js settings.
   */
  const html = Asciidoctor()
    .loadFile(path.join(root, 'docs/all-anchors.adoc'), {
      safe: 'safe',
      attributes: { idprefix: '', idseparator: '-' },
    })
    .convert()
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]))
  const anchorIds = [...new Set(categories.flatMap((c) => c.anchors))]

  it('renders an element with id="<anchor-id>" for every catalog anchor', () => {
    const missing = anchorIds.filter((id) => !ids.has(id))
    expect(missing).toEqual([])
  })

  it('leaves no unparsed block anchor as literal text', () => {
    expect(html).not.toMatch(/\[\[[^\]]+\]\]/)
  })
})
