import { describe, it, expect } from 'vitest'
import { bylineHtml, injectByline } from './lib/byline.js'

describe('bylineHtml', () => {
  it('renders author and revision date', () => {
    const html = bylineHtml('Ralf D. Müller', '2026-03-14')
    expect(html).toContain('doc-byline')
    expect(html).toContain('Ralf D. Müller')
    expect(html).toContain('2026-03-14')
  })

  it('renders the author alone when no date is given', () => {
    const html = bylineHtml('Ralf D. Müller', '')
    expect(html).toContain('Ralf D. Müller')
    expect(html).not.toContain('doc-byline-date')
  })

  it('returns an empty string when neither author nor date is present', () => {
    expect(bylineHtml(undefined, undefined)).toBe('')
    expect(bylineHtml('', '')).toBe('')
  })

  it('escapes HTML in the author name', () => {
    const html = bylineHtml('<script>x</script>', '')
    expect(html).not.toContain('<script>x</script>')
    expect(html).toContain('&lt;script&gt;')
  })
})

describe('injectByline', () => {
  it('inserts the byline directly after the leading h1', () => {
    const out = injectByline('<h1>Title</h1>\n<div>body</div>', 'Ralf D. Müller', '2026-03-14')
    expect(out.indexOf('doc-byline')).toBeGreaterThan(out.indexOf('</h1>'))
    expect(out.indexOf('doc-byline')).toBeLessThan(out.indexOf('<div>body'))
  })

  it('prepends the byline when there is no h1', () => {
    const out = injectByline('<div>body</div>', 'Ralf D. Müller', '')
    expect(out.indexOf('doc-byline')).toBeLessThan(out.indexOf('<div>body'))
  })

  it('leaves the html unchanged when there is no author or date', () => {
    const html = '<h1>Title</h1>\n<div>body</div>'
    expect(injectByline(html, undefined, undefined)).toBe(html)
  })
})
