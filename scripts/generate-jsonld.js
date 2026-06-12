#!/usr/bin/env node
/**
 * Generate schema.org DefinedTermSet / DefinedTerm JSON-LD from anchors.json
 * and inject it into the pre-rendered catalog pages.
 *
 * Why: the catalog is 160+ well-defined terms, but only their prose is
 * crawlable (via /all-anchors). Search engines and retrieval-grounded AI need
 * a machine-readable entity graph to resolve "Semantic Anchors" as a distinct
 * DefinedTermSet and each anchor as a DefinedTerm with a canonical URL. This is
 * the canonical schema.org type for a glossary/controlled vocabulary and is the
 * structured-data half of issue #579 (the human-readable definitions already
 * ship in crawlable HTML).
 *
 * Per-term `description` is extracted from the first "Core Concepts" definition
 * in each anchor's .adoc when it is cleanly available, and omitted otherwise —
 * crisp 40-60 word answer blocks are issue #580's job, and will later supersede
 * these as the DefinedTerm descriptions.
 *
 * Runs AFTER prerender-routes.js so it only touches the home page and
 * /all-anchors (the canonical locations for the set), not every route shell.
 * When the dist build is absent it prints the JSON-LD to stdout for inspection.
 *
 * Usage: node scripts/generate-jsonld.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const ANCHORS_JSON = path.join(ROOT, 'website/public/data/anchors.json')
const CONTRACTS_JSON = path.join(ROOT, 'website/public/data/contracts.json')
const DIST = path.join(ROOT, 'website/dist')
const BASE = 'https://llm-coding.github.io/Semantic-Anchors'
const SET_ID = `${BASE}/#catalog`

// Pages that should carry the DefinedTermSet: the catalog root and the full
// reference. Both represent the whole set; other routes do not.
const TARGETS = [path.join(DIST, 'index.html'), path.join(DIST, 'all-anchors', 'index.html')]

/**
 * Pull a short definition for an anchor from the first "Core Concepts" entry in
 * its .adoc. Returns a cleaned, length-capped string, or null when nothing
 * usable is found (safe to omit — DefinedTerm.description is optional).
 */
function extractDescription(filePath) {
  const abs = path.join(ROOT, filePath)
  if (!fs.existsSync(abs)) return null
  const lines = fs.readFileSync(abs, 'utf-8').split('\n')

  const ccIndex = lines.findIndex((l) => /Core Concepts/i.test(l))
  if (ccIndex === -1) return null

  // First definition-list description after the Core Concepts heading:
  //   Term:: definition text
  for (let i = ccIndex + 1; i < lines.length && i < ccIndex + 12; i++) {
    const m = lines[i].match(/^.+?::\s+(.+)$/)
    if (m) {
      const cleaned = cleanAdoc(m[1])
      return cleaned.length >= 20 ? capLength(cleaned, 220) : null
    }
  }
  return null
}

/** Strip the AsciiDoc inline markup that would be noise in a description. */
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

/** Build the DefinedTermSet object from anchors.json. */
function buildDefinedTermSet() {
  const anchors = JSON.parse(fs.readFileSync(ANCHORS_JSON, 'utf-8'))
  const list = Array.isArray(anchors) ? anchors : anchors.anchors || []

  const terms = list
    .filter((a) => a && a.id && a.title)
    .map((a) => {
      const url = `${BASE}/anchor/${a.id}`
      const term = {
        '@type': 'DefinedTerm',
        '@id': url,
        name: a.title,
        termCode: a.id,
        url,
        inDefinedTermSet: SET_ID,
      }
      const description = a.filePath ? extractDescription(a.filePath) : null
      if (description) term.description = description
      return term
    })

  // Contracts are first-class defined terms too — each has a real page at
  // /contract/<id> since #611.
  const contracts = fs.existsSync(CONTRACTS_JSON)
    ? JSON.parse(fs.readFileSync(CONTRACTS_JSON, 'utf-8'))
    : []
  for (const c of contracts) {
    if (!c || !c.id || !c.title) continue
    const url = `${BASE}/contract/${c.id}`
    const term = {
      '@type': 'DefinedTerm',
      '@id': url,
      name: c.title,
      termCode: c.id,
      url,
      inDefinedTermSet: SET_ID,
    }
    if (c.description) term.description = c.description
    terms.push(term)
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': SET_ID,
    name: 'Semantic Anchors',
    url: `${BASE}/`,
    description:
      'A curated catalog of semantic anchors and semantic contracts — well-defined terms, methodologies, and frameworks used as shared vocabulary when communicating with Large Language Models.',
    hasDefinedTerm: terms,
  }
}

/**
 * Serialize as a <script> tag. `<` is escaped to < so a stray "</script>"
 * inside any description can never break out of the element (standard JSON-LD
 * hardening).
 */
function buildScriptTag() {
  const json = JSON.stringify(buildDefinedTermSet(), null, 2).replace(/</g, '\\u003c')
  return `<script type="application/ld+json">\n${json}\n</script>`
}

/** Insert the script tag before </head>, unless the set is already present. */
function injectInto(file, scriptTag) {
  if (!fs.existsSync(file)) return false
  let html = fs.readFileSync(file, 'utf-8')
  if (html.includes(SET_ID)) return false // idempotent
  if (!html.includes('</head>')) return false
  html = html.replace('</head>', `  ${scriptTag}\n  </head>`)
  fs.writeFileSync(file, html, 'utf-8')
  return true
}

function main() {
  const set = buildDefinedTermSet()
  const scriptTag = buildScriptTag()

  const anyDist = TARGETS.some((f) => fs.existsSync(f))
  if (!anyDist) {
    // No build present — print for inspection so the output can be validated
    // without a full vite build.
    process.stdout.write(JSON.stringify(set, null, 2) + '\n')
    console.warn(
      `\n(no dist build found — printed ${set.hasDefinedTerm.length} DefinedTerms to stdout; run after 'vite build' to inject)`
    )
    return
  }

  let injected = 0
  for (const file of TARGETS) {
    if (injectInto(file, scriptTag)) {
      injected++
      console.log(`  ✓ injected DefinedTermSet into ${path.relative(ROOT, file)}`)
    }
  }
  const withDesc = set.hasDefinedTerm.filter((t) => t.description).length
  console.log(
    `\n✓ DefinedTermSet: ${set.hasDefinedTerm.length} terms (${withDesc} with description) injected into ${injected} page(s)`
  )
}

if (require.main === module) main()

module.exports = { buildDefinedTermSet, buildScriptTag, extractDescription }
