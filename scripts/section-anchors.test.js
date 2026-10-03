import { describe, it, expect } from 'vitest'
import { hideSectionAnchors } from './lib/section-anchors.js'

describe('hideSectionAnchors', () => {
  it('takes the empty section link out of the accessibility tree', () => {
    const html = '<h2 id="why"><a class="anchor" href="#why"></a>Why use it?</h2>'
    expect(hideSectionAnchors(html)).toBe(
      '<h2 id="why"><a class="anchor" href="#why" aria-hidden="true" tabindex="-1"></a>Why use it?</h2>'
    )
  })

  it('does not add text that would repeat in the heading name', () => {
    const html = '<h2 id="why"><a class="anchor" href="#why"></a>Why use it?</h2>'
    expect(hideSectionAnchors(html)).not.toContain('aria-label')
  })

  it('handles every section link in the document', () => {
    const html =
      '<h2 id="a"><a class="anchor" href="#a"></a>A</h2><p>text</p>' +
      '<h3 id="b"><a class="anchor" href="#b"></a>B</h3>'
    const out = hideSectionAnchors(html)
    expect(out.match(/aria-hidden="true" tabindex="-1"/g)).toHaveLength(2)
  })

  it('leaves other links untouched', () => {
    const html = '<p><a href="#a">see A</a></p>'
    expect(hideSectionAnchors(html)).toBe(html)
  })
})
