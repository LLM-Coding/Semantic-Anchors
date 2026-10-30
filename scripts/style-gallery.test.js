import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { galleryEntries, buildStyleGallery } from './lib/style-gallery.js'

// #872: one homepage, many anchor names — the gallery puts the examples side by side.
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
    expect(de.title).toBeTruthy()
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
