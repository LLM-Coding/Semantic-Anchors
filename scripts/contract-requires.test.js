import { describe, it, expect } from 'vitest'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
const root = path.join(import.meta.dirname, '..')
const { loadContractRequires, loadContractCatalog } = require('./lib/contract-requires.js')
const { renderContractDetail, renderContract } = require('./render-contracts.js')

const COPIES = [
  'website/public/data/contracts.json',
  'skill/semantic-contracts-installer/data/contracts.json',
  'plugins/semantic-anchors/skills/semantic-contracts-installer/data/contracts.json',
]
const readJson = (rel) => JSON.parse(readFileSync(path.join(root, rel), 'utf-8'))
const catalog = readJson(COPIES[0])
const byId = (id) => catalog.find((c) => c.id === id)

/*
 * Issue #896: a contract may require other contracts. An unknown id or a
 * cycle would make every export path fail or ship a dangling reference, so
 * the catalog is checked here, at test time, not only when someone copies.
 */
describe('contract catalog requires (#896)', () => {
  it('has no unknown ids, cycles or malformed requires', async () => {
    const { validateContracts } = await loadContractRequires()
    expect(validateContracts(catalog)).toEqual([])
  })

  it.each(COPIES.slice(1))('%s matches the website catalog', (rel) => {
    expect(readJson(rel)).toEqual(catalog)
  })

  it('Second Brain Maintenance requires LLM-Wiki Documentation', () => {
    expect(byId('llm-wiki-documentation')).toBeTruthy()
    expect(byId('second-brain-maintenance').requires).toEqual(['llm-wiki-documentation'])
  })

  it('loadContractCatalog rejects a catalog with an unknown id', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'contracts-'))
    const file = path.join(dir, 'contracts.json')
    writeFileSync(file, JSON.stringify([{ id: 'a', requires: ['ghost'] }]))
    await expect(loadContractCatalog(file)).rejects.toThrow(/unknown contract "ghost"/)
  })

  it('loadContractCatalog lists what a contract requires, localized', async () => {
    const { required } = await loadContractCatalog(path.join(root, COPIES[0]))
    expect(required('second-brain-maintenance')).toEqual([
      { id: 'llm-wiki-documentation', title: 'LLM-Wiki Documentation' },
    ])
    expect(required('second-brain-maintenance', 'de')).toEqual([
      { id: 'llm-wiki-documentation', title: 'LLM-Wiki-Dokumentation' },
    ])
    expect(required('specification')).toEqual([])
  })
})

describe('generated outputs mention the dependency (#896)', () => {
  const section = (text, title) => {
    const start = text.indexOf(`## ${title}\n`)
    expect(start, `no section "${title}"`).toBeGreaterThanOrEqual(0)
    const next = text.indexOf('\n## ', start + 1)
    return text.slice(start, next < 0 ? undefined : next)
  }

  it.each(['website/public/contracts.txt', 'website/public/llms.txt'])('%s', (rel) => {
    const text = readFileSync(path.join(root, rel), 'utf-8')
    expect(section(text, 'Second Brain Maintenance')).toContain(
      '*Requires: LLM-Wiki Documentation*'
    )
    expect(section(text, 'Specification')).not.toContain('*Requires:')
  })

  const WIKI_EN = [{ id: 'llm-wiki-documentation', title: 'LLM-Wiki Documentation' }]
  const WIKI_DE = [{ id: 'llm-wiki-documentation', title: 'LLM-Wiki-Dokumentation' }]

  it('the pre-rendered contract page names the required contract (EN + DE)', () => {
    const brain = byId('second-brain-maintenance')
    const en = renderContractDetail(brain, 'en', WIKI_EN)
    const de = renderContractDetail(brain, 'de', WIKI_DE)
    expect(en).toMatch(/Includes:.*contract\/llm-wiki-documentation"[^>]*>LLM-Wiki Documentation</s)
    expect(de).toMatch(/Enthält:.*contract\/llm-wiki-documentation"[^>]*>LLM-Wiki-Dokumentation</s)
    expect(renderContractDetail(byId('specification'), 'en', [])).not.toContain('Includes:')
  })

  it('the pre-rendered overview card names the required contract', () => {
    const html = renderContract(byId('second-brain-maintenance'), WIKI_EN)
    expect(html).toMatch(/Includes:.*LLM-Wiki Documentation/s)
  })
})

/*
 * The installer skill resolves requires in Python (it runs where the website
 * code does not). It must give the same answer as the website resolver.
 */
describe('installer resolver agrees with the website resolver (#896)', () => {
  const script = path.join(root, 'skill/semantic-contracts-installer/scripts/resolve-contracts.py')
  const fixture = [
    { id: 'top', requires: ['left', 'right'] },
    { id: 'left', requires: ['base'] },
    { id: 'right', requires: ['base'] },
    { id: 'base' },
    { id: 'solo' },
    { id: 'loop-a', requires: ['loop-b'] },
    { id: 'loop-b', requires: ['loop-a'] },
    { id: 'broken', requires: ['ghost'] },
  ]
  const dir = mkdtempSync(path.join(tmpdir(), 'resolve-'))
  const file = path.join(dir, 'contracts.json')
  writeFileSync(file, JSON.stringify(fixture))

  const runPy = (ids) => {
    try {
      const out = execFileSync('python3', [script, '--catalog', file, ...ids], {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
      return { ok: true, ids: out.trim().split('\n').filter(Boolean) }
    } catch (err) {
      return { ok: false, message: String(err.stderr) }
    }
  }

  it.each([[['top']], [['solo', 'top']], [['base', 'top']], [['left', 'left']]])(
    'same order for %j',
    async (ids) => {
      const { resolveContracts } = await loadContractRequires()
      const expected = resolveContracts(fixture, ids).map((c) => c.id)
      expect(runPy(ids)).toEqual({ ok: true, ids: expected })
    }
  )

  it.each([
    [['loop-a'], /cycle: loop-a -> loop-b -> loop-a/],
    [['broken'], /unknown contract "ghost" \(required by "broken"\)/],
    [['nope'], /unknown contract "nope"/],
  ])('same error for %j', async (ids, pattern) => {
    const { resolveContracts } = await loadContractRequires()
    expect(() => resolveContracts(fixture, ids)).toThrow(pattern)
    const result = runPy(ids)
    expect(result.ok).toBe(false)
    expect(result.message).toMatch(pattern)
  })

  it('resolves the bundled snapshot by default', () => {
    const out = execFileSync('python3', [script, 'second-brain-maintenance'], { encoding: 'utf-8' })
    expect(out.trim().split('\n')).toEqual(['llm-wiki-documentation', 'second-brain-maintenance'])
  })
})
