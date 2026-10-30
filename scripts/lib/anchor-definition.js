/**
 * Shared resolver for an anchor's "direct answer" definition (#580).
 *
 * The answer is the curated `:definition:` AsciiDoc attribute, a standalone
 * "What is X?" paragraph. Every anchor file, English and German, carries one;
 * scripts/anchor-definition.test.js enforces that. There is no fallback (#865):
 * the first Core Concepts entry often describes a part of the concept, not the
 * concept, and no answer beats a wrong one.
 *
 * One source of truth so the rendered answer block (render-docs.js), the
 * DefinedTerm JSON-LD (generate-jsonld.js), the meta description
 * (prerender-routes.js) and anchors.json agree.
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

/**
 * Resolve the curated definition of an anchor file (path relative to the repo
 * root). Returns { text, source: 'curated' }, or null when the file is missing
 * or carries no `:definition:`.
 */
function getAnchorDefinition(filePathRel) {
  const abs = path.join(ROOT, filePathRel)
  if (!fs.existsSync(abs)) return null
  const lines = fs.readFileSync(abs, 'utf-8').split('\n')

  const curated = readDefinitionAttribute(lines)
  return curated ? { text: curated, source: 'curated' } : null
}

/** Longest meta description we emit; search results show less, but cut later. */
const META_DESCRIPTION_MAX = 220

/** Shortest first sentence we end on; a shorter one falls back to a word cut. */
const MIN_SENTENCE = 80

/**
 * Sentence ends: `.`, `!` or `?`, optionally followed by a closing quotation
 * mark, then a space and a capital letter. Not a sentence end: after a single
 * letter (initials such as "E. St. Elmo", German "z. B."), after a common
 * abbreviation ("e.g.", "Dr."), or after a one- or two-digit number (German
 * ordinals: "2. Auflage"). Years and versions ("2001.", "4.0.") do end one.
 * The capital keeps titles such as "Release It! and" whole.
 */
const SENTENCE_END =
  /(?<!\b[A-Za-z])(?<!(?:^|[\s(])\d{1,2})(?<!\b(?:e\.g|i\.e|vs|St|Dr|Mr|Ms|Mrs|No|Nr|Prof|Inc|al|etc|ca|bzw|Aufl))[.!?]["“”»]?(?=\s+[A-ZÄÖÜ„"“])/g

/**
 * Cut text to max characters: after the last full sentence that fits, or at a
 * word boundary with an ellipsis when no sentence of at least MIN_SENTENCE fits.
 */
function cutAtSentence(text, max) {
  if (text.length <= max) return text
  let end = -1
  for (const m of text.matchAll(SENTENCE_END)) {
    const stop = m.index + m[0].length
    if (stop > max) break
    end = stop
  }
  return end >= MIN_SENTENCE ? text.slice(0, end) : capLength(text, max)
}

/**
 * The anchor's meta description: its curated definition, shortened by
 * cutAtSentence to at most META_DESCRIPTION_MAX characters (plus an ellipsis
 * when cut mid-sentence). Null without a definition.
 */
function getAnchorMetaDescription(filePathRel) {
  const def = getAnchorDefinition(filePathRel)
  return def ? cutAtSentence(def.text, META_DESCRIPTION_MAX) : null
}

module.exports = { getAnchorDefinition, getAnchorMetaDescription, cleanAdoc, capLength }
