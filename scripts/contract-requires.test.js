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

  it('loadContractCatalog rejects a catalog with an unknown id', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'contracts-'))
    const file = path.join(dir, 'contracts.json')
    writeFileSync(file, JSON.stringify([{ id: 'a', requires: ['ghost'] }]))
    await expect(loadContractCatalog(file)).rejects.toThrow(/unknown contract "ghost"/)
  })

  it('loadContractCatalog lists what a contract requires, localized', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'contracts-'))
    const file = path.join(dir, 'contracts.json')
    writeFileSync(
      file,
      JSON.stringify([
        { id: 'base', title: 'Base', titleDe: 'Basis' },
        { id: 'top', title: 'Top', requires: ['base'] },
        { id: 'solo', title: 'Solo' },
      ])
    )
    const { required } = await loadContractCatalog(file)
    expect(required('top')).toEqual([{ id: 'base', title: 'Base' }])
    expect(required('top', 'de')).toEqual([{ id: 'base', title: 'Basis' }])
    expect(required('solo')).toEqual([])
  })
})

describe('generated outputs mention a dependency only where one exists (#896)', () => {
  // A synthetic pair, so these tests do not depend on which real contract,
  // if any, currently uses requires.
  const base = {
    id: 'base',
    title: 'Base',
    titleDe: 'Basis',
    description: 'b',
    template: 'B',
    anchors: [],
  }
  const top = {
    id: 'top',
    title: 'Top',
    description: 't',
    template: 'T',
    anchors: [],
    requires: ['base'],
  }
  const BASE_EN = [{ id: 'base', title: 'Base' }]
  const BASE_DE = [{ id: 'base', title: 'Basis' }]

  it('the pre-rendered contract page names the required contract (EN + DE)', () => {
    const en = renderContractDetail(top, 'en', BASE_EN)
    const de = renderContractDetail(top, 'de', BASE_DE)
    expect(en).toMatch(/Includes:.*contract\/base"[^>]*>Base</s)
    expect(de).toMatch(/Enthält:.*contract\/base"[^>]*>Basis</s)
    expect(renderContractDetail(base, 'en', [])).not.toContain('Includes:')
  })

  it('the pre-rendered overview card names the required contract', () => {
    expect(renderContract(top, BASE_EN)).toMatch(/Includes:.*Base/s)
    expect(renderContract(base, [])).not.toContain('Includes:')
  })

  it.each(['website/public/contracts.txt', 'website/public/llms.txt'])(
    '%s has a Requires line exactly when the catalog declares one',
    (rel) => {
      const text = readFileSync(path.join(root, rel), 'utf-8')
      const declared = catalog.filter((c) => (c.requires || []).length > 0).length
      const lines = (text.match(/^\*Requires: /gm) || []).length
      expect(lines).toBe(declared)
    }
  )
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

  it.each([
    ['a string', { id: 'odd', requires: 'base' }],
    ['a list with a non-string', { id: 'odd', requires: ['base', 7] }],
    ['an object', { id: 'odd', requires: { base: true } }],
  ])('rejects a catalog whose requires is %s', (_label, entry) => {
    const badDir = mkdtempSync(path.join(tmpdir(), 'resolve-bad-'))
    const badFile = path.join(badDir, 'contracts.json')
    writeFileSync(badFile, JSON.stringify([{ id: 'base' }, entry]))
    let failure = null
    try {
      execFileSync('python3', [script, '--catalog', badFile, 'base'], {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    } catch (err) {
      failure = err
    }
    expect(failure, 'resolve-contracts.py accepted a malformed requires').not.toBeNull()
    expect(failure.status).toBe(1)
    expect(String(failure.stderr)).toMatch(
      /^Error: contract "odd": requires must be a list of contract ids/
    )
  })

  it('reads the bundled snapshot by default', () => {
    const out = execFileSync('python3', [script, 'specification'], { encoding: 'utf-8' })
    expect(out.trim().split('\n')).toEqual(['specification'])
  })
})
