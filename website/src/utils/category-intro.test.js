import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { renderInlineLinks, getCategoryIntroHtml } from './category-intro.js'
import intros from '../data/category-intros.json'

const here = path.dirname(fileURLToPath(import.meta.url))

describe('renderInlineLinks', () => {
  it('turns [text](https://…) into an external link', () => {
    expect(renderInlineLinks('See [APG](https://www.w3.org/WAI/ARIA/apg/).')).toBe(
      'See <a href="https://www.w3.org/WAI/ARIA/apg/" target="_blank" rel="noopener noreferrer">APG<span class="sr-only"> (opens in a new tab)</span></a>.'
    )
  })

  it('announces the new tab in the given language', () => {
    expect(renderInlineLinks('[x](https://e.org/)', 'de')).toContain(
      '<span class="sr-only"> (öffnet in neuem Tab)</span>'
    )
  })

  it('keeps site-internal links in the same tab (#872)', () => {
    expect(renderInlineLinks('[Gallery](/Semantic-Anchors/style-gallery)')).toBe(
      '<a href="/Semantic-Anchors/style-gallery">Gallery</a>'
    )
  })

  it('does not treat other root-relative paths as links', () => {
    expect(renderInlineLinks('[x](/etc/passwd) [y](//evil.example)')).not.toContain('<a ')
  })

  it('escapes HTML in the text', () => {
    expect(renderInlineLinks('<b>bold</b> & co')).toBe('&lt;b&gt;bold&lt;/b&gt; &amp; co')
  })

  it('leaves non-https targets as plain text', () => {
    const out = renderInlineLinks('[x](javascript:alert(1)) [y](http://example.org)')
    expect(out).not.toContain('<a ')
    expect(out).toContain('[x](javascript:alert(1))')
  })

  it('escapes a quote inside the link target', () => {
    const out = renderInlineLinks('[x](https://e.org/"onmouseover="a)')
    expect(out).not.toContain('"onmouseover="')
  })
})

describe('getCategoryIntroHtml', () => {
  it('returns the intro in the requested language', () => {
    expect(getCategoryIntroHtml(intros, 'ux-visual-design', 'de')).toContain('Bedienelemente')
    expect(getCategoryIntroHtml(intros, 'ux-visual-design', 'en')).toContain('controls')
  })

  it('falls back to English for an unknown language and to empty for an unknown category', () => {
    expect(getCategoryIntroHtml(intros, 'ux-visual-design', 'fr')).toBe(
      getCategoryIntroHtml(intros, 'ux-visual-design', 'en')
    )
    expect(getCategoryIntroHtml(intros, 'no-such-category', 'en')).toBe('')
  })
})

describe('category intros (#869)', () => {
  // Invariant: every category the build emits has an intro in both languages.
  const categories = JSON.parse(
    fs.readFileSync(path.join(here, '..', '..', 'public', 'data', 'categories.json'), 'utf-8')
  )

  it('cover every category in English and German', () => {
    const missing = categories.flatMap((c) =>
      ['en', 'de'].filter((lang) => !intros[c.id]?.[lang]?.trim()).map((lang) => `${c.id}:${lang}`)
    )
    expect(missing).toEqual([])
  })

  it('only use https links or site-internal paths', () => {
    const targets = Object.values(intros)
      .flatMap((i) => Object.values(i))
      .flatMap((text) => [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]))
    expect(
      targets.filter((t) => !t.startsWith('https://') && !t.startsWith('/Semantic-Anchors/'))
    ).toEqual([])
  })

  it('link the style gallery from UX & Visual Design in the matching language', () => {
    expect(getCategoryIntroHtml(intros, 'ux-visual-design', 'en')).toContain(
      'href="/Semantic-Anchors/style-gallery"'
    )
    expect(getCategoryIntroHtml(intros, 'ux-visual-design', 'de')).toContain(
      'href="/Semantic-Anchors/de/style-gallery"'
    )
  })

  it('link the Component Gallery and the APG in UX & Visual Design', () => {
    for (const lang of ['en', 'de']) {
      const html = getCategoryIntroHtml(intros, 'ux-visual-design', lang)
      expect(html).toContain('href="https://component.gallery/design-systems/"')
      expect(html).toContain('href="https://www.w3.org/WAI/ARIA/apg/patterns/"')
    }
  })
})
