/**
 * Contract dependencies (#896) for the CommonJS build scripts.
 *
 * The resolver lives once, in website/src/utils/contract-requires.js (ESM, so
 * the browser can import it). This module loads it with a dynamic import()
 * and adds the build-time check: a catalog with an unknown id or a cycle
 * fails the build instead of shipping a dangling reference.
 */

const fs = require('fs')
const path = require('path')
const { pathToFileURL } = require('url')

const RESOLVER = path.join(__dirname, '../../website/src/utils/contract-requires.js')

/** The website resolver module: { resolveContracts, requiredContracts, validateContracts }. */
function loadContractRequires() {
  return import(pathToFileURL(RESOLVER).href)
}

/**
 * Read and validate a contracts.json file.
 * @param {string} file - path to contracts.json
 * @returns {Promise<{contracts: object[], required: Function}>} where
 *   required(id, lang) lists the contracts `id` pulls in as {id, title}, in
 *   export order, with the title localized for lang 'de' where available
 * @throws {Error} listing every catalog error (unknown id, cycle, malformed requires)
 */
async function loadContractCatalog(file) {
  const contracts = JSON.parse(fs.readFileSync(file, 'utf-8'))
  const { requiredContracts, validateContracts } = await loadContractRequires()
  const errors = validateContracts(contracts)
  if (errors.length) {
    throw new Error(`Invalid contracts catalog ${file}:\n  ${errors.join('\n  ')}`)
  }
  const required = (id, lang = 'en') =>
    requiredContracts(contracts, id).map((c) => ({
      id: c.id,
      title: (lang === 'de' && c.titleDe) || c.title,
    }))
  return { contracts, required }
}

module.exports = { loadContractRequires, loadContractCatalog }
