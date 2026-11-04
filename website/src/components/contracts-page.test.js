import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../i18n.js', () => ({
  i18n: {
    t: (key) => key,
    currentLang: () => 'en',
  },
}))

import { renderContractCard, renderContractsPage, initContractsPage } from './contracts-page.js'

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

  it('links the LLM Wiki and docToolchain mentions in the LLM-Wiki Documentation contract', () => {
    const html = renderContractCard(
      {
        id: 'llm-wiki-documentation',
        title: 'LLM-Wiki Documentation',
        description: 'd',
        template: "Maintain the documentation as Karpathy's LLM Wiki, built by docToolchain.",
        anchors: ['karpathys-llm-wiki', 'docs-as-code'],
      },
      false
    )
    expect(html).toMatch(/<a href="#\/anchor\/karpathys-llm-wiki"[^>]*>Karpathy's LLM Wiki<\/a>/)
    expect(html).toMatch(/<a href="#\/anchor\/docs-as-code"[^>]*>docToolchain<\/a>/)
  })

  it('links the Building a Second Brain and LLM Wiki mentions in the Second Brain Maintenance contract', () => {
    const html = renderContractCard(
      {
        id: 'second-brain-maintenance',
        title: 'Second Brain Maintenance',
        description: 'd',
        template:
          "The personal brain follows Building a Second Brain (Tiago Forte): the P.A.R.A. Method is the folder structure, Karpathy's LLM Wiki is the engine inside Resources.\n- End every session with a Hemingway Bridge in my personal brain's notes for that project.",
        anchors: [
          'building-a-second-brain',
          'para-method',
          'karpathys-llm-wiki',
          'hemingway-bridge',
        ],
      },
      false
    )
    expect(html).toMatch(
      /<a href="#\/anchor\/building-a-second-brain"[^>]*>Building a Second Brain<\/a>/
    )
    expect(html).toMatch(/<a href="#\/anchor\/karpathys-llm-wiki"[^>]*>Karpathy's LLM Wiki<\/a>/)
  })
})

// Issue #896: a contract may require other contracts. The card says what it
// pulls in, and every copy/download path ships the required contracts first.
describe('contracts that require other contracts (#896)', () => {
  const wiki = {
    id: 'llm-wiki-documentation',
    title: 'LLM-Wiki Documentation',
    description: 'wiki',
    template: 'WIKI RULES',
    anchors: [],
  }
  const brain = {
    id: 'second-brain-maintenance',
    title: 'Second Brain Maintenance',
    description: 'brain',
    template: 'BRAIN RULES',
    anchors: [],
    requires: ['llm-wiki-documentation'],
  }
  const catalog = [wiki, brain]

  function mountPage() {
    document.body.innerHTML = renderContractsPage()
    initContractsPage(catalog, {})
  }

  function mockClipboard() {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    return writeText
  }

  beforeEach(() => localStorage.clear())

  it('shows the required contract on the card', () => {
    const html = renderContractCard(brain, false, catalog)
    expect(html).toContain('contract-requires')
    expect(html).toContain('contracts.includes')
    expect(html).toMatch(/LLM-Wiki Documentation/)
  })

  it('shows no dependency line for a contract without requires', () => {
    expect(renderContractCard(wiki, false, catalog)).not.toContain('contract-requires')
  })

  it('per-card copy puts the required contract before the selected one', async () => {
    const writeText = mockClipboard()
    mountPage()
    document
      .querySelector('.contract-copy-btn[data-contract-id="second-brain-maintenance"]')
      .click()
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    const text = writeText.mock.calls[0][0]
    expect(text).toBe(
      '## LLM-Wiki Documentation\n\nWIKI RULES\n\n## Second Brain Maintenance\n\nBRAIN RULES\n'
    )
  })

  it('multi-select copy includes the required contract once', async () => {
    const writeText = mockClipboard()
    localStorage.setItem('selected-contracts', JSON.stringify(['second-brain-maintenance']))
    mountPage()
    document.getElementById('contracts-copy').click()
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    const text = writeText.mock.calls[0][0]
    expect(text.indexOf('## LLM-Wiki Documentation')).toBeLessThan(
      text.indexOf('## Second Brain Maintenance')
    )
    expect(text.match(/## LLM-Wiki Documentation/g)).toHaveLength(1)
  })

  it('multi-select copy does not duplicate a dependency that is also selected', async () => {
    const writeText = mockClipboard()
    localStorage.setItem(
      'selected-contracts',
      JSON.stringify(['second-brain-maintenance', 'llm-wiki-documentation'])
    )
    mountPage()
    document.getElementById('contracts-copy').click()
    await vi.waitFor(() => expect(writeText).toHaveBeenCalled())
    expect(writeText.mock.calls[0][0].match(/## LLM-Wiki Documentation/g)).toHaveLength(1)
  })
})
