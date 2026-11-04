/**
 * Contract dependencies (#896).
 *
 * A contract may build on other contracts through an optional `requires`
 * field: a list of contract ids. Copying or installing such a contract alone
 * would ship a reference to rules the agent never receives, so every export
 * path resolves `requires` with these functions: transitively, dependencies
 * first, each contract once.
 *
 * Pure functions, no DOM and no Node APIs: the website imports this module
 * directly, the build scripts (CommonJS) load it with a dynamic import(). The
 * installer skill carries the same algorithm in Python
 * (skill/semantic-contracts-installer/scripts/resolve-contracts.py); a parity
 * test in scripts/ keeps the two in step.
 */

function requiresOf(contract) {
  return Array.isArray(contract.requires) ? contract.requires : []
}

/**
 * Resolve the given contract ids into the list of contracts to export.
 * Dependencies come before the contracts that require them; otherwise the
 * requested order is kept. Each contract appears once.
 *
 * @param {object[]} catalog - all contracts (entries of contracts.json)
 * @param {string[]} ids - the selected contract ids
 * @returns {object[]} catalog entries in export order
 * @throws {Error} on an unknown id or a cycle
 */
export function resolveContracts(catalog, ids) {
  const byId = new Map(catalog.map((c) => [c.id, c]))
  const emitted = new Set()
  const result = []

  const visit = (id, path, requiredBy) => {
    if (emitted.has(id)) return
    const contract = byId.get(id)
    if (!contract) {
      const by = requiredBy ? ` (required by "${requiredBy}")` : ''
      throw new Error(`unknown contract "${id}"${by}`)
    }
    if (path.includes(id)) {
      throw new Error(`contract requires cycle: ${[...path, id].join(' -> ')}`)
    }
    for (const dep of requiresOf(contract)) visit(dep, [...path, id], id)
    emitted.add(id)
    result.push(contract)
  }

  for (const id of ids) visit(id, [], null)
  return result
}

/**
 * The contracts one contract pulls in, in export order, without itself.
 * @param {object[]} catalog
 * @param {string} id
 * @returns {object[]}
 */
export function requiredContracts(catalog, id) {
  return resolveContracts(catalog, [id]).filter((c) => c.id !== id)
}

/**
 * Check a whole catalog. Returns a list of error messages, empty when valid:
 * duplicate ids, a malformed `requires`, unknown ids and cycles.
 * @param {object[]} catalog
 * @returns {string[]}
 */
export function validateContracts(catalog) {
  const errors = []
  const seen = new Set()
  let wellFormed = true

  for (const contract of catalog) {
    if (seen.has(contract.id)) errors.push(`duplicate contract id "${contract.id}"`)
    seen.add(contract.id)
    const req = contract.requires
    if (req !== undefined && !(Array.isArray(req) && req.every((r) => typeof r === 'string'))) {
      errors.push(`"${contract.id}": requires must be an array of contract ids`)
      wellFormed = false
    }
  }
  if (!wellFormed) return errors

  for (const contract of catalog) {
    try {
      resolveContracts(catalog, [contract.id])
    } catch (err) {
      if (!errors.includes(err.message)) errors.push(err.message)
    }
  }
  return errors
}
