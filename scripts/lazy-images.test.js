import { describe, it, expect } from 'vitest'
import { lazyImages } from './lib/lazy-images.js'

// #872: the style gallery holds eleven full-page screenshots (~575 KB).
const img = (n) => `<img src="${n}.webp" alt="${n}">`

describe('lazyImages', () => {
  it('leaves the first images eager and lazy-loads the rest', () => {
    const out = lazyImages([1, 2, 3, 4, 5].map(img).join('\n'), 3)
    const lazy = out.split('\n').map((l) => l.includes('loading="lazy"'))
    expect(lazy).toEqual([false, false, false, true, true])
    expect(out).toContain('<img src="4.webp" alt="4" loading="lazy" decoding="async">')
  })

  it('keeps an explicit loading attribute', () => {
    const tag = '<img src="a.webp" loading="eager">'
    expect(lazyImages(`${img(1)}${tag}`, 1)).toBe(`${img(1)}${tag}`)
  })

  it('changes nothing but img tags', () => {
    const html = '<p>imgs <imgx> <a href="x">x</a></p>'
    expect(lazyImages(html, 0)).toBe(html)
  })
})
