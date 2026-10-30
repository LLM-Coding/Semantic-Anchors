import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import AsciidoctorFactory from '@asciidoctor/core'
import { galleryEntries, buildStyleGallery, tile } from './lib/style-gallery.js'

// #872: one homepage, many anchor names — the gallery puts the examples side by side.
const Asciidoctor = () => AsciidoctorFactory()
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const ANCHORS = path.join(ROOT, 'docs', 'anchors')

const withScreenshot = fs
  .readdirSync(ANCHORS)
  .filter((f) => f.endsWith('.adoc') && !f.endsWith('.de.adoc') && !f.startsWith('_'))
  .filter((f) => /^:example-screenshot:/m.test(fs.readFileSync(path.join(ANCHORS, f), 'utf-8')))
  .map((f) => f.replace(/\.adoc$/, ''))

describe('galleryEntries', () => {
  it('lists every anchor with an example screenshot, and only those', () => {
    const ids = galleryEntries('en').map((e) => e.id)
    expect(ids.sort()).toEqual([...withScreenshot].sort())
  })

  it('uses the German anchor title on the German page', () => {
    const de = galleryEntries('de').find((e) => e.id === 'dieter-rams-ten-principles')
    const en = galleryEntries('en').find((e) => e.id === 'dieter-rams-ten-principles')
    expect(de.title).toMatch(/Thesen/)
    expect(de.title).not.toBe(en.title)
    expect(en.title).toMatch(/Rams/)
  })

  it('points every entry at an existing image file', () => {
    for (const e of galleryEntries('en')) {
      expect(fs.existsSync(path.join(ROOT, 'website', 'public', 'examples', e.image))).toBe(true)
    }
  })
})

describe('buildStyleGallery', () => {
  const en = buildStyleGallery('en')
  const de = buildStyleGallery('de')

  it('opens with the original homepage, before any style', () => {
    const original = en.indexOf('examples/original-homepage.webp')
    const firstStyle = Math.min(
      ...withScreenshot.map((id) => en.indexOf(`/anchor/${id}`)).filter((i) => i >= 0)
    )
    expect(original).toBeGreaterThan(-1)
    expect(original).toBeLessThan(firstStyle)
  })

  it('links every tile to its anchor page, German tiles to German pages', () => {
    for (const id of withScreenshot) {
      expect(en).toContain(`.link:/Semantic-Anchors/anchor/${id}[`)
      expect(de).toContain(`.link:/Semantic-Anchors/de/anchor/${id}[`)
    }
  })

  it('gives each tile one link, not two: the title, without literal quotes', () => {
    // A linked image plus a linked title means two tab stops per tile; CSS
    // stretches the title link over the tile instead.
    expect(en).not.toContain(',link=')
    expect(en).not.toMatch(/\.link:[^\n]*\["/)
  })

  it('quotes the prompt and links the blog post', () => {
    // The sessions got the German prompt; the English page also names it.
    expect(en).toContain('Redesign this website in the style of {ANCHOR}')
    expect(en).toContain('Gestalte diese Website im Stil von {ANKER} neu.')
    expect(de).toContain('Gestalte diese Website im Stil von {ANKER} neu.')
    for (const page of [en, de]) {
      expect(page).toContain('https://rdmueller.github.io/pages/blog/design-anchors.html')
    }
  })

  it('gives every image an alt text naming its style', () => {
    for (const e of galleryEntries('en')) {
      expect(en).toMatch(new RegExp(`examples/${e.image}\\["[^"]*${e.title.slice(0, 6)}`))
    }
  })

  it('switches off the "Figure n." prefix', () => {
    expect(en).toContain(':figure-caption!:')
  })

  it('matches the committed files, so the build output never drifts', () => {
    expect(fs.readFileSync(path.join(ROOT, 'docs', 'style-gallery.adoc'), 'utf-8')).toBe(en)
    expect(fs.readFileSync(path.join(ROOT, 'docs', 'style-gallery.de.adoc'), 'utf-8')).toBe(de)
  })
})

describe('tile', () => {
  // CodeQL: escaping only `]` with a backslash leaves a `\` in the text free to
  // escape the closing bracket or quote. Character references carry no escapes.
  it('keeps brackets and backslashes in a title from breaking the link macro', () => {
    const out = tile('A [b] c\\', 'x.webp', 'alt', '/Semantic-Anchors/anchor/x')
    expect(out.split('\n')[0]).toBe('.link:/Semantic-Anchors/anchor/x[A &#91;b&#93; c&#92;]')
    const html = Asciidoctor().convert(out)
    expect(html).toContain('<a href="/Semantic-Anchors/anchor/x">A &#91;b&#93; c&#92;</a>')
  })

  it('keeps commas, equals signs, carets and markup in a title literal', () => {
    const out = tile('Foo a=b, c *x* _y_^', 'x.webp', 'alt', '/Semantic-Anchors/anchor/x')
    const html = Asciidoctor().convert(out)
    const link = html.match(/<a [^>]*>.*?<\/a>/)[0]
    expect(link).toMatch(/^<a href="\/Semantic-Anchors\/anchor\/x">/)
    expect(link).not.toMatch(/target=|<strong>|<em>/)
    const text = link
      .replace(/<[^>]+>/g, '')
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n))
    expect(text).toBe('Foo a=b, c *x* _y_^')
  })

  it('keeps quotes and backslashes in the alt text from breaking the image macro', () => {
    const out = tile('T', 'x.webp', 'say "hi" \\', '')
    const html = Asciidoctor().convert(out)
    expect(html).toContain('alt="say &quot;hi&quot; &#92;" width="720"')
  })
})
