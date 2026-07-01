/**
 * Shared resolver for an anchor's "direct answer" definition (#580).
 *
 * Precedence:
 *   1. a curated `:definition:` AsciiDoc attribute (a standalone ~40-60 word
 *      "What is X?" answer), when the anchor author has written one;
 *   2. otherwise the first "Core Concepts" definition-list entry, derived.
 *
 * One source of truth so the rendered answer block (render-docs.js), the
 * DefinedTerm JSON-LD (generate-jsonld.js), and any data consumer agree.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', '..')

/** Strip the AsciiDoc inline markup that would be noise in a plain-text answer. */
function cleanAdoc(s) {
  return s
    .replace(/link:[^[]*\[([^\]]*)\]/g, '$1') // link:url[text] -> text
    .replace(/<<[^,>]+,\s*([^>]+)>>/g, '$1') // <<id,text>> -> text
    .replace(/<<([^>]+)>>/g, '$1') // <<id>> -> id
    .replace(/[*_`]/g, '') // bold/italic/mono markers
    .replace(/\s+/g, ' ')
    .trim()
}

/** Cap at a word boundary, appending an ellipsis when truncated. */
function capLength(s, max) {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).trim()}…`
}

/** Read a curated `:definition:` attribute from the .adoc header, if present. */
function readDefinitionAttribute(lines) {
  for (const line of lines) {
    const m = line.match(/^:definition:\s+(.+)$/)
    if (m) {
      const cleaned = cleanAdoc(m[1])
      return cleaned.length >= 20 ? cleaned : null
    }
    // Attributes live in the header; stop once the document body starts.
    if (/^\[%collapsible\]/.test(line) || /^====/.test(line)) break
  }
  return null
}

/** Derive a description from the first "Core Concepts" definition-list entry. */
function extractDescription(filePathRel) {
  const abs = path.join(ROOT, filePathRel)
  if (!fs.existsSync(abs)) return null
  const lines = fs.readFileSync(abs, 'utf-8').split('\n')

  const ccIndex = lines.findIndex((l) => /Core Concepts/i.test(l))
  if (ccIndex === -1) return null

  for (let i = ccIndex + 1; i < lines.length && i < ccIndex + 12; i++) {
    const m = lines[i].match(/^.+?::\s+(.+)$/)
    if (m) {
      const cleaned = cleanAdoc(m[1])
      return cleaned.length >= 20 ? capLength(cleaned, 220) : null
    }
  }
  return null
}

/**
 * Resolve the best available definition for an anchor file (relative to repo
 * root). Returns { text, source: 'curated'|'derived' } or null when neither is
 * available.
 */
function getAnchorDefinition(filePathRel) {
  const abs = path.join(ROOT, filePathRel)
  if (!fs.existsSync(abs)) return null
  const lines = fs.readFileSync(abs, 'utf-8').split('\n')

  const curated = readDefinitionAttribute(lines)
  if (curated) return { text: curated, source: 'curated' }

  const derived = extractDescription(filePathRel)
  if (derived) return { text: derived, source: 'derived' }

  return null
}

module.exports = { getAnchorDefinition, extractDescription, cleanAdoc, capLength }
