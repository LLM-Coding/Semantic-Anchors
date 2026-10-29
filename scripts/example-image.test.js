import { describe, it, expect } from 'vitest'
import { exampleImageHtml, isSafeExampleImage } from './lib/example-image.js'

describe('exampleImageHtml', () => {
  it('renders a figure with image, alt text and a caption linking to the blog post', () => {
    const html = exampleImageHtml('swiss-style.webp', 'Swiss Style', 'en')
    expect(html).toContain('<figure class="anchor-example-image"')
    expect(html).toContain('src="/Semantic-Anchors/examples/swiss-style.webp"')
    expect(html).toMatch(/alt="[^"]*Swiss Style[^"]*"/)
    expect(html).toContain('<figcaption')
    expect(html).toContain('href="https://rdmueller.github.io/pages/blog/design-anchors.html"')
  })

  it('uses the German caption for German pages', () => {
    const en = exampleImageHtml('swiss-style.webp', 'Swiss Style', 'en')
    const de = exampleImageHtml('swiss-style.webp', 'Swiss Style', 'de')
    expect(de).not.toBe(en)
    expect(de).toContain('Beispiel')
  })

  it('escapes the anchor title in the alt text', () => {
    const html = exampleImageHtml('swiss-style.webp', 'A "quoted" <title>', 'en')
    expect(html).not.toContain('<title>')
    expect(html).toContain('&quot;quoted&quot;')
  })

  it('decodes entities Asciidoctor leaves in the title before escaping', () => {
    const html = exampleImageHtml('swiss-style.webp', 'Strunk &amp; White&#8217;s', 'en')
    expect(html).toContain('Strunk &amp; White\u2019s')
    expect(html).not.toContain('&amp;amp;')
  })

  it('returns an empty string when the anchor has no example image', () => {
    expect(exampleImageHtml('', 'Swiss Style', 'en')).toBe('')
    expect(exampleImageHtml(undefined, 'Swiss Style', 'en')).toBe('')
  })

  it('rejects file names that could leave the examples directory', () => {
    expect(isSafeExampleImage('swiss-style.webp')).toBe(true)
    expect(isSafeExampleImage('../secret.webp')).toBe(false)
    expect(isSafeExampleImage('a/b.webp')).toBe(false)
    expect(isSafeExampleImage('x.svg')).toBe(false)
    expect(exampleImageHtml('../x.webp', 'X', 'en')).toBe('')
  })
})
