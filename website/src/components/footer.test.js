import { describe, it, expect, vi } from 'vitest'

vi.mock('../i18n.js', () => ({
  i18n: {
    t: (key) => key,
    currentLang: () => 'en',
  },
}))

import { renderFooter } from './footer.js'
import { APPEARANCES } from '../data/appearances.js'

describe('renderFooter — "as seen on" row', () => {
  // Every appearance is one external link plus one logo. A future edit that
  // drops one of them is silent otherwise: the row still renders, just shorter.
  const appearances = [
    { label: 'HMZE', href: 'https://www.youtube.com/watch?v=rQj-B3VTx48', logo: 'hmze-logo.png' },
    { label: 'rabauer.dev', href: 'https://rabauer.dev', logo: 'rabauer-logo.png' },
    {
      label: 'Beyond Code',
      href: 'https://byndcode.com/episodes/ep016-ralf-d-mueller/',
      logo: 'byndcode-logo.png',
    },
  ]

  // Slice out the one <a> element that carries this href, so a logo sitting
  // on the wrong link cannot satisfy the assertion from somewhere else in
  // the footer.
  const anchorFor = (html, href) => {
    const start = html.indexOf(`href="${href}"`)
    expect(start).toBeGreaterThan(-1)
    const open = html.lastIndexOf('<a', start)
    const close = html.indexOf('</a>', start)
    return html.slice(open, close)
  }

  it.each(appearances)('links to $label with its own logo', ({ href, logo }) => {
    const anchor = anchorFor(renderFooter('1.2.3'), href)
    expect(anchor).toContain(logo)
  })

  it('opens every appearance in a new tab without handing over the opener', () => {
    const html = renderFooter('1.2.3')
    for (const { href } of appearances) {
      const anchor = anchorFor(html, href)
      expect(anchor).toContain('target="_blank"')
      expect(anchor).toContain('rel="noopener noreferrer"')
    }
  })

  it('marks the German-language appearances so English readers are not surprised', () => {
    const html = renderFooter('1.2.3')
    expect(html).toContain('HMZE (DE)')
    expect(html).toContain('Beyond Code (DE)')
  })
})

describe('renderFooter — "adapted in" row', () => {
  // A project that refers to this catalog is neither coverage written about
  // us nor a conversation we joined, so it gets its own row and its own
  // label. These assertions pin that separation: the claim is what the row
  // says, and folding it into "featured in" would overstate it.
  const ADOPTIONS = APPEARANCES.filter((entry) => entry.kind === 'adoption')

  const anchorFor = (html, href) => {
    const start = html.indexOf(`href="${href}"`)
    expect(start).toBeGreaterThan(-1)
    const open = html.lastIndexOf('<a', start)
    const close = html.indexOf('</a>', start)
    return html.slice(open, close)
  }

  it('gives the group its own label', () => {
    expect(renderFooter('1.2.3')).toContain('footer.adaptedIn')
  })

  // We hold no licence to these projects' marks, and some of them carry
  // Anthropic's Claude logos, which on this site would read as an
  // endorsement. So an entry is a label and no <img> at all — not an <img>
  // with an empty src. Checked over every entry, so a new one with a stray
  // `logo` key cannot slip in unseen.
  it('renders every entry as a label with no image', () => {
    const html = renderFooter('1.2.3')
    expect(ADOPTIONS.length).toBeGreaterThan(1)
    for (const entry of ADOPTIONS) {
      const anchor = anchorFor(html, entry.href)
      expect(anchor).not.toContain('<img')
      expect(anchor).toContain(entry.label)
    }
  })

  // The label alone is a bare repository name. What each project actually did
  // with the catalog sat only in `title`, which a screen reader may skip and
  // which keyboard and touch users never see at all. It has to be in the
  // text, so it survives with JavaScript off too.
  it('carries each description in the markup, not only in a tooltip', () => {
    const html = renderFooter('1.2.3')
    for (const entry of ADOPTIONS) {
      const anchor = anchorFor(html, entry.href)
      expect(anchor).toContain('sr-only')
      expect(anchor).toContain(entry.titleKey)
    }
  })

  it('shows keyboard focus, which an unstyled inline link does not', () => {
    const anchor = anchorFor(renderFooter('1.2.3'), ADOPTIONS[0].href)
    expect(anchor).toContain('focus:ring-2')
  })

  it('opens each project in a new tab without handing over the opener', () => {
    const html = renderFooter('1.2.3')
    for (const entry of ADOPTIONS) {
      const anchor = anchorFor(html, entry.href)
      expect(anchor).toContain('target="_blank"')
      expect(anchor).toContain('rel="noopener noreferrer"')
    }
  })
})
