import { describe, it, expect, vi } from 'vitest'

vi.mock('../i18n.js', () => ({
  i18n: {
    t: (key) => key,
    currentLang: () => 'en',
  },
}))

import { renderContractCard } from './contracts-page.js'

describe('renderContractCard', () => {
  const contract = {
    id: 'specification',
    title: 'Specification',
    description: 'What we mean when we say spec',
    template: '- Cockburn use cases\n- Gherkin',
    anchors: ['cockburn-use-cases'],
  }

  it('renders a permalink icon linking to the contract detail page', () => {
    const html = renderContractCard(contract, false)
    expect(html).toContain('contract-permalink')
    expect(html).toMatch(/class="contract-permalink[^"]*"[^>]*/)
    expect(html.match(/contract\/specification/g).length).toBeGreaterThanOrEqual(2)
  })

  it('links the card title to the contract detail page', () => {
    const html = renderContractCard(contract, false)
    expect(html).toContain(`href="${import.meta.env.BASE_URL}contract/specification"`)
    expect(html).toMatch(/<a [^>]*contract\/specification[^>]*>Specification<\/a>/)
  })
})
