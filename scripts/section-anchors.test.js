import { describe, it, expect } from 'vitest'
import { labelSectionAnchors } from './lib/section-anchors.js'

describe('labelSectionAnchors', () => {
  it('names the empty section link after its heading', () => {
    const html = '<h2 id="why"><a class="anchor" href="#why"></a>Why use it?</h2>'
    expect(labelSectionAnchors(html)).toBe(
      '<h2 id="why"><a class="anchor" href="#why" aria-label="Why use it?"></a>Why use it?</h2>'
    )
  })

  it('strips inline markup from the heading text', () => {
    const html = '<h3 id="x"><a class="anchor" href="#x"></a>The <code>dtcw</code> wrapper</h3>'
    expect(labelSectionAnchors(html)).toContain('aria-label="The dtcw wrapper"')
  })

  it('keeps entities and escapes double quotes in the label', () => {
    const html = '<h2 id="s"><a class="anchor" href="#s"></a>Strunk &amp; "White"</h2>'
    expect(labelSectionAnchors(html)).toContain('aria-label="Strunk &amp; &quot;White&quot;"')
  })

  it('labels every section link in the document', () => {
    const html =
      '<h2 id="a"><a class="anchor" href="#a"></a>A</h2><p>text</p>' +
      '<h3 id="b"><a class="anchor" href="#b"></a>B</h3>'
    const out = labelSectionAnchors(html)
    expect(out).toContain('href="#a" aria-label="A"')
    expect(out).toContain('href="#b" aria-label="B"')
  })

  it('leaves other links untouched', () => {
    const html = '<p><a href="#a">see A</a></p>'
    expect(labelSectionAnchors(html)).toBe(html)
  })
})
