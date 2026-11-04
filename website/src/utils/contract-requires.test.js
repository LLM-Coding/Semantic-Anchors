import { describe, it, expect } from 'vitest'
import { resolveContracts, requiredContracts, validateContracts } from './contract-requires.js'

// Issue #896: a contract may build on others. Every export path resolves
// `requires` transitively, dependencies first, without duplicates.
const c = (id, requires) => (requires ? { id, title: id.toUpperCase(), requires } : { id })
const ids = (list) => list.map((x) => x.id)

describe('resolveContracts', () => {
  it('returns a contract without requires unchanged', () => {
    expect(ids(resolveContracts([c('a'), c('b')], ['a']))).toEqual(['a'])
  })

  it('puts a required contract before the one that requires it', () => {
    const catalog = [c('wiki'), c('brain', ['wiki'])]
    expect(ids(resolveContracts(catalog, ['brain']))).toEqual(['wiki', 'brain'])
  })

  it('resolves a transitive chain, deepest dependency first', () => {
    const catalog = [c('a', ['b']), c('b', ['c']), c('c')]
    expect(ids(resolveContracts(catalog, ['a']))).toEqual(['c', 'b', 'a'])
  })

  it('emits a contract once, even when selected and required', () => {
    const catalog = [c('wiki'), c('brain', ['wiki'])]
    expect(ids(resolveContracts(catalog, ['wiki', 'brain']))).toEqual(['wiki', 'brain'])
    expect(ids(resolveContracts(catalog, ['brain', 'wiki']))).toEqual(['wiki', 'brain'])
  })

  it('emits a shared dependency once (diamond)', () => {
    const catalog = [
      c('top', ['left', 'right']),
      c('left', ['base']),
      c('right', ['base']),
      c('base'),
    ]
    expect(ids(resolveContracts(catalog, ['top']))).toEqual(['base', 'left', 'right', 'top'])
  })

  it('keeps the requested order for independent contracts', () => {
    const catalog = [c('a'), c('b'), c('x', ['a'])]
    expect(ids(resolveContracts(catalog, ['b', 'x']))).toEqual(['b', 'a', 'x'])
  })

  it('ignores a duplicate request', () => {
    expect(ids(resolveContracts([c('a')], ['a', 'a']))).toEqual(['a'])
  })

  it('returns the catalog entries themselves', () => {
    const catalog = [c('wiki'), c('brain', ['wiki'])]
    expect(resolveContracts(catalog, ['brain'])[0]).toBe(catalog[0])
  })

  it('throws on an unknown requested id', () => {
    expect(() => resolveContracts([c('a')], ['nope'])).toThrow(/unknown contract "nope"/)
  })

  it('throws on an unknown required id and names the requiring contract', () => {
    expect(() => resolveContracts([c('a', ['ghost'])], ['a'])).toThrow(
      /unknown contract "ghost" \(required by "a"\)/
    )
  })

  it('throws on a cycle and shows its path', () => {
    const catalog = [c('a', ['b']), c('b', ['c']), c('c', ['a'])]
    expect(() => resolveContracts(catalog, ['a'])).toThrow(/cycle: a -> b -> c -> a/)
  })

  it('throws on a contract that requires itself', () => {
    expect(() => resolveContracts([c('a', ['a'])], ['a'])).toThrow(/cycle: a -> a/)
  })
})

describe('requiredContracts', () => {
  it('lists what a contract pulls in, without the contract itself', () => {
    const catalog = [c('a', ['b']), c('b', ['c']), c('c')]
    expect(ids(requiredContracts(catalog, 'a'))).toEqual(['c', 'b'])
    expect(requiredContracts(catalog, 'c')).toEqual([])
  })
})

describe('validateContracts', () => {
  it('accepts a valid catalog', () => {
    expect(validateContracts([c('wiki'), c('brain', ['wiki'])])).toEqual([])
  })

  it('reports an unknown id', () => {
    const errors = validateContracts([c('a', ['ghost'])])
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatch(/ghost/)
  })

  it('reports a cycle', () => {
    expect(validateContracts([c('a', ['b']), c('b', ['a'])]).join('\n')).toMatch(/cycle/)
  })

  it('reports a requires field that is not a list of ids', () => {
    expect(validateContracts([{ id: 'a', requires: 'b' }, c('b')]).join('\n')).toMatch(
      /"a": requires must be an array of contract ids/
    )
  })

  it('reports a duplicate id', () => {
    expect(validateContracts([c('a'), c('a')]).join('\n')).toMatch(/duplicate contract id "a"/)
  })
})
