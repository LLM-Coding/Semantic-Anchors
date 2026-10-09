#!/usr/bin/env node
/**
 * Generate docs/all-anchors.adoc and website/public/llms.txt
 *
 * all-anchors.adoc: AsciiDoc include-based full reference document
 * llms.txt:         Clean Markdown for LLM consumption
 *
 * Usage: node scripts/generate-llms-txt.js
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const { packBundles, withPageLink } = require('./anchor-bundles.js')

const ROOT = path.join(__dirname, '..')

const categoriesPath = path.join(ROOT, 'website/public/data/categories.json')
let categories
try {
  categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
} catch (err) {
  console.error('❌ Fehler beim Laden von categories.json:', err.message)
  console.error('   Bitte zuerst `node scripts/extract-metadata.js` ausführen.')
  process.exit(1)
}

// ─── AsciiDoc table converter ────────────────────────────────────────────────

function convertAdocTable(body) {
  const lines = body.split('\n')
  const allCells = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.startsWith('|')) continue
    // Split line into cells: |cell1 |cell2 → ['cell1', 'cell2']
    const parts = trimmed.split(/(?=\|)/).filter(Boolean)
    for (const part of parts) {
      if (part.startsWith('|')) allCells.push(part.slice(1).trim())
    }
  }

  if (allCells.length === 0) return ''

  // Determine column count from the first line that has cells
  let colCount = 0
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || !trimmed.startsWith('|')) continue
    colCount = trimmed.split(/(?=\|)/).filter(Boolean).length
    if (colCount > 0) break
  }
  if (colCount <= 0) colCount = 2

  // Group cells into rows, padding incomplete last row with empty cells
  const rows = []
  for (let i = 0; i < allCells.length; i += colCount) {
    const row = allCells.slice(i, i + colCount)
    while (row.length < colCount) row.push('')
    rows.push(row)
  }

  if (rows.length === 0) return ''

  const out = []
  out.push('| ' + rows[0].join(' | ') + ' |')
  out.push('| ' + rows[0].map(() => '---').join(' | ') + ' |')
  for (const row of rows.slice(1)) {
    if (row.length > 0) out.push('| ' + row.join(' | ') + ' |')
  }
  return out.join('\n') + '\n\n'
}

// ─── AsciiDoc → Markdown converter ──────────────────────────────────────────

function adocToMarkdown(adoc) {
  let md = adoc

  // Remove document attributes (:key: value)
  md = md.replace(/^:[a-z][a-z0-9-]*:.*$/gm, '')

  // Headings: = → #, == → ##, etc.
  md = md.replace(/^(=+) (.+)$/gm, (_, eq, title) => '#'.repeat(eq.length) + ' ' + title)

  // [source,lang] + ---- → ```lang / ```
  md = md.replace(
    /\[source(?:,([^\]]*))?\]\s*\n----/g,
    (_, lang) => '```' + (lang ? lang.trim() : '')
  )
  md = md.replace(/^----\s*$/gm, '```')

  // [quote] block: [quote]\n____\ntext\n____ → > text
  md = md.replace(/\[quote[^\]]*\]\s*\n_{4}\s*\n([\s\S]*?)\n_{4}/g, (_, body) =>
    body
      .trim()
      .split('\n')
      .map((l) => '> ' + l)
      .join('\n')
  )

  // Sidebar blocks **** → remove delimiters
  md = md.replace(/^\*{4}\s*$/gm, '')

  // Collapsible: [%collapsible] + ==== delimiters → remove markers, keep content
  md = md.replace(/^\[%collapsible\]\s*$/gm, '')
  md = md.replace(/^====\s*$/gm, '')

  // Tables: convert full blocks including optional attribute line (handles multi-line cells)
  md = md.replace(/(?:\[[^\]]*\]\s*\n)?\|===\s*\n([\s\S]*?)\|===\s*/g, (_, body) =>
    convertAdocTable(body)
  )

  // Remove remaining block attribute lines
  md = md.replace(/^\[(?:horizontal|sidebar|cols[^\]]*|options[^\]]*|%\w+[^\]]*)\]\s*$/gm, '')

  // AsciiDoc line continuation (+) → remove
  md = md.replace(/^\+\s*$/gm, '')

  // Links: link:url[text] → [text](url), resolve special URLs for standalone context
  md = md.replace(/link:([^[]+)\[([^\]]*)\]/g, (_, url, text) => {
    if (/^\.\.\/.*\.adoc$/.test(url)) {
      url = 'https://github.com/LLM-Coding/Semantic-Anchors/blob/main/' + url.slice(3)
    } else if (url === '#/') {
      url = 'https://llm-coding.github.io/Semantic-Anchors/'
    }
    return `[${text}](${url})`
  })

  // Cross-references: <<id,text>> → text, <<id>> → `id`
  // Must run before def-list conversion so terms like <<spc,SPC>>:: are resolved first
  md = md.replace(/<<([^,>]+),([^>]+)>>/g, '$2')
  md = md.replace(/<<([^>]+)>>/g, '`$1`')

  // Nested definition lists: term::: description → - **term**: description
  // Non-greedy term match allows colons in term (e.g. "Anti-pattern: X:::")
  md = md.replace(/^([^\n|#`>]+?):::(?!:)[^\S\n]*(.*)$/gm, (_, term, desc) =>
    desc.trim() ? `- **${term.trim()}**: ${desc.trim()}` : `- **${term.trim()}**`
  )

  // Definition lists: term:: description → **term**: description
  // Non-greedy term match allows colons in term (e.g. "Anti-pattern: Ice cream cone::")
  md = md.replace(/^([^\n|#`>]+?)::[^\S\n]*(.*)$/gm, (_, term, desc) =>
    desc.trim() ? `**${term.trim()}**: ${desc.trim()}` : `**${term.trim()}**`
  )

  // Bold: **text** stays, *text* → **text**
  // Require non-whitespace after opening * to avoid matching list markers (* item)
  md = md.replace(/(?<![*\w])\*(\S[^*\n]*\S|\S)\*(?![*\w])/g, '**$1**')

  // Ordered list items: ". item" → "1. item"
  md = md.replace(/^\. /gm, '1. ')

  // Trailing whitespace and normalize blank lines
  md = md.replace(/[ \t]+$/gm, '')
  md = md.replace(/\n{3,}/g, '\n\n')

  return md.trim()
}

// ─── Generate docs/all-anchors.adoc ─────────────────────────────────────────

function generateAllAnchorsAdoc() {
  const anchoredIds = new Set()
  const lines = [
    '= Semantic Anchors — Complete Reference',
    ':toc:',
    ':toc-placement: preamble',
    ':toclevels: 2',
    '',
    'include::about.adoc[leveloffset=+1]',
    '',
    '<<<',
    '',
  ]

  for (const category of categories) {
    lines.push(`== ${category.name}`)
    lines.push('')
    for (const anchorId of category.anchors) {
      const filepath = path.join(ROOT, 'docs/anchors', `${anchorId}.adoc`)
      if (fs.existsSync(filepath)) {
        // Explicit ID so each anchor section can be reached as
        // all-anchors#<anchor-id> (e.g. #mece) rather than by a
        // title-derived ID ("50/72 Rule" derives 5072-rule, #715).
        // The [[id]] form only parses when the ID starts with a letter,
        // `_` or `:`; for digit-leading IDs (4mat, 50-72-rule) the
        // [#id] shorthand sets the same ID. Multi-category anchors are
        // included once per category — only the first occurrence gets
        // the ID to avoid duplicate-id warnings.
        if (!anchoredIds.has(anchorId)) {
          anchoredIds.add(anchorId)
          lines.push(/^[a-z]/.test(anchorId) ? `[[${anchorId}]]` : `[#${anchorId}]`)
        }
        lines.push(`include::anchors/${anchorId}.adoc[leveloffset=+2]`)
        lines.push('')
      }
    }
    lines.push('<<<')
    lines.push('')
  }

  const output = lines.join('\n')
  fs.writeFileSync(path.join(ROOT, 'docs/all-anchors.adoc'), output, 'utf-8')
  console.warn(`Generated: docs/all-anchors.adoc (${categories.length} categories)`)
}

// Top-level documentation pages (each pre-rendered as a standalone HTML page).
// Shared by llms.txt and llms-index.txt so the two cannot drift apart.
const DOC_PAGES = [
  {
    title: 'About',
    url: 'https://llm-coding.github.io/Semantic-Anchors/about',
    summary:
      'What semantic anchors are, why they matter for LLM communication, and how the catalog is curated.',
  },
  {
    title: 'Spec-Driven Development',
    url: 'https://llm-coding.github.io/Semantic-Anchors/spec-driven-development',
    summary:
      'Greenfield workflow — from requirements to specification to implementation, powered by semantic anchors.',
  },
  {
    title: 'Brownfield Workflow',
    url: 'https://llm-coding.github.io/Semantic-Anchors/brownfield',
    summary:
      'Applying semantic anchors to brownfield codebases using a bounded-context approach with reverse-engineered safety nets.',
  },
  {
    title: 'Brownfield Experiment 1a Report',
    url: 'https://llm-coding.github.io/Semantic-Anchors/brownfield-experiment-report',
    summary:
      'Controlled experiment: delete documentation from a greenfield project, regenerate from code, compare. Methodology, findings, and the Brownfield Preparation Checklist.',
  },
  {
    title: 'Brownfield Fair Comparison',
    url: 'https://llm-coding.github.io/Semantic-Anchors/brownfield-fair-comparison',
    summary:
      'Three approaches (Direct, Socratic, Two-Phase) compared with identical team answers. Measures the structural value of the Question Tree, not the answers.',
  },
  {
    title: 'The Harness Inventory',
    url: 'https://llm-coding.github.io/Semantic-Anchors/harness-inventory',
    summary:
      'Layers of error correction for agentic coding — a categorised inventory of harness checks, sorted by how much project work each one costs to add.',
  },
  {
    title: 'An Anchor Delivers Only as Far as the Prior Reaches',
    url: 'https://llm-coding.github.io/Semantic-Anchors/training-data-vs-practice',
    summary:
      'What a pull request about "use cases" taught us about the limits of anchors: the term fires, the practice behind it does not follow. Includes an experiment you can rerun.',
  },
  {
    title: 'Anchor Prior Test Skill',
    url: 'https://llm-coding.github.io/Semantic-Anchors/anchor-prior-test',
    summary:
      'Installable Claude Code Skill that measures whether naming a term actually triggers the concept in a model you do not control. Clean-room probe battery across model tiers, then a tier rating and a route to anchor, contract or rejection.',
  },
  {
    title: 'Prior-Test Register',
    url: 'https://llm-coding.github.io/Semantic-Anchors/prior-tests',
    summary:
      'The evidence behind each anchor\u2019s measured tier — resolved model identifiers, procedure version, run counts, criteria matrices and verbatim quotes. An anchor without a prior-test date was not tested; that is a statement about our records, not the term.',
  },
  {
    title: 'arc42 Documentation Authoring Skill',
    url: 'https://llm-coding.github.io/Semantic-Anchors/arc42-documentation-skill',
    summary:
      'Installable Claude Code Skill carrying the procedure for authoring an arc42 document — the cross-section rules arc42\u2019s own templates do not enforce. The how-to companion to the Architecture Documentation contract.',
  },
  {
    title: 'Rejected Proposals',
    url: 'https://llm-coding.github.io/Semantic-Anchors/rejected-proposals',
    summary:
      'Anchor proposals that were evaluated and did not meet the quality criteria, each with the reason. Read this before proposing a term — it is also the clearest statement of where the catalog draws its line.',
  },
  {
    title: 'Socratic Code-Theory Recovery Skill',
    url: 'https://llm-coding.github.io/Semantic-Anchors/socratic-recovery-skill',
    summary:
      'Installable Claude Code Skill that packages the brownfield documentation-recovery workflow as a two-phase Question Tree with Q-ID traceability.',
  },
  {
    title: 'Semantic Contracts',
    url: 'https://llm-coding.github.io/Semantic-Anchors/contracts',
    summary:
      'Composable contracts that define what terms mean in your project — pick and copy into your AGENTS.md or CLAUDE.md.',
  },
  {
    title: 'AgentSkill',
    url: 'https://llm-coding.github.io/Semantic-Anchors/agentskill',
    summary:
      'The semantic-anchor-translator AgentSkill — install semantic anchors into Claude Code, Codex, Cursor, and other coding agents.',
  },
  {
    title: 'Evaluations',
    url: 'https://llm-coding.github.io/Semantic-Anchors/evaluations',
    summary: 'Multiple-choice evaluations of semantic anchor recognition across 10 LLMs.',
  },
  {
    title: 'Full Reference',
    url: 'https://llm-coding.github.io/Semantic-Anchors/all-anchors',
    summary:
      'All semantic anchors in one long document — readable offline, linkable, easy to Ctrl-F.',
  },
  {
    title: 'Changelog',
    url: 'https://llm-coding.github.io/Semantic-Anchors/changelog',
    summary: 'Chronological record of all semantic anchors added to the catalog.',
  },
  {
    title: 'Contributing',
    url: 'https://llm-coding.github.io/Semantic-Anchors/contributing',
    summary:
      'How to propose new semantic anchors, quality criteria, and the contribution workflow.',
  },
]

// ─── Generate website/public/anchors/*.md ───────────────────────────────────

/**
 * One small Markdown file per anchor, for whoever fetches a link from the index.
 *
 * The .adoc sources are served by GitHub Pages as application/octet-stream —
 * the extension is unknown to it, so it declares a binary download. A web
 * fetcher, and therefore a reader's LLM, refuses that. Markdown arrives as
 * text/markdown and is read.
 */
function generateAnchorMarkdown() {
  const dest = path.join(ROOT, 'website/public/anchors')
  fs.mkdirSync(dest, { recursive: true })

  let written = 0
  for (const file of fs.readdirSync(path.join(ROOT, 'docs/anchors'))) {
    if (!file.endsWith('.adoc')) continue
    const adoc = fs.readFileSync(path.join(ROOT, 'docs/anchors', file), 'utf-8')
    fs.writeFileSync(
      path.join(dest, file.replace(/\.adoc$/, '.txt')),
      `${adocToMarkdown(adoc)}\n`,
      'utf-8'
    )
    written += 1
  }
  console.warn(`Generated: website/public/anchors/ (${written} text files)`)
}

/*
 * One fetch per category instead of one per anchor.
 *
 * The reader's LLM may only fetch URLs that stood in the message it was given,
 * and one URL per anchor does not fit in the provider URL the button builds.
 * A handful of bundle URLs does. Each bundle carries the full text of its
 * anchors, so nothing is left to follow and nothing is condensed away.
 *
 * The limit is the SMALLEST one that still fits the provider URL, because the
 * two ends pull against each other: the URL must stay under 6000 characters,
 * while a long document risks being truncated by the fetcher — and truncation
 * is silent. Measured against 18 documentation pages:
 *
 *   40 KB   20 bundles   URL 6303   over
 *   50 KB   19 bundles   URL 6156   over
 *   60 KB   17 bundles   URL 5874   fits
 *   70 KB   15 bundles   URL 5558   fits
 *
 * A bundle may still exceed the limit: packing splits between anchors, never
 * inside one, so a single oversized category stays whole.
 */
const BUNDLE_LIMIT = 60 * 1024

function generateAnchorBundles() {
  const source = path.join(ROOT, 'website/public/anchors')
  const dest = path.join(ROOT, 'website/public/bundles')
  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(dest, { recursive: true })

  const sizeOf = (id) => {
    try {
      return fs.statSync(path.join(source, `${id}.txt`)).size
    } catch {
      return undefined
    }
  }
  const bundles = packBundles(categories, sizeOf, BUNDLE_LIMIT)

  for (const bundle of bundles) {
    const body = bundle.anchors.map((id) =>
      withPageLink(
        fs.readFileSync(path.join(source, `${id}.txt`), 'utf-8').trim(),
        `${SITE_URL}anchor/${id}`
      )
    )
    const header = [
      `# ${bundle.title}`,
      '',
      `> ${bundle.anchors.length} semantic anchors in full, from`,
      `> ${SITE_URL}`,
      '',
    ].join('\n')
    fs.writeFileSync(
      path.join(dest, `${bundle.id}.txt`),
      `${header}\n${body.join('\n\n---\n\n')}\n`,
      'utf-8'
    )
  }

  const largest = Math.max(...bundles.map((b) => fs.statSync(path.join(dest, `${b.id}.txt`)).size))
  console.warn(
    `Generated: website/public/bundles/ (${bundles.length} files, largest ` +
      `${Math.round(largest / 1024)} KB)`
  )
  return bundles
}

// ─── The index as HTML ───────────────────────────────────────────────────────

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** The same lines as real markup: headings, and links a parser cannot miss. */
function indexAsHtml(lines) {
  const body = []
  for (const line of lines) {
    if (!line.trim()) continue
    const link = line.match(/^- \[(.+?)\]\((\S+?)\)(?:: (.*))?$/)
    if (link) {
      const [, title, url, summary] = link
      body.push(
        `<li><a href="${escapeHtml(url)}">${escapeHtml(title)}</a>` +
          `${summary ? `: ${escapeHtml(summary)}` : ''}</li>`
      )
      continue
    }
    if (line.startsWith('### ')) body.push(`<h3>${escapeHtml(line.slice(4))}</h3>`)
    else if (line.startsWith('## ')) body.push(`<h2>${escapeHtml(line.slice(3))}</h2>`)
    else if (line.startsWith('# ')) body.push(`<h1>${escapeHtml(line.slice(2))}</h1>`)
    else if (line.startsWith('>')) body.push(`<p>${escapeHtml(line.replace(/^>\s?/, ''))}</p>`)
    else body.push(`<p>${escapeHtml(line)}</p>`)
  }
  return [
    '<!doctype html>',
    '<html lang="en"><head><meta charset="utf-8">',
    '<title>Semantic Anchors — Index of this site</title>',
    '</head><body>',
    ...body,
    '</body></html>',
    '',
  ].join('\n')
}

// ─── Generate website/public/llms-index.txt ─────────────────────────────────

const SITE_URL = 'https://llm-coding.github.io/Semantic-Anchors/'

/** Die AsciiDoc-Quelle eines Ankers. */
function anchorPath(anchorId) {
  return path.join(ROOT, 'docs/anchors', `${anchorId}.adoc`)
}

function anchorTitle(anchorId, filepath) {
  const heading = fs
    .readFileSync(filepath, 'utf-8')
    .split('\n')
    .find((line) => line.startsWith('= '))
  return heading ? heading.slice(2).trim() : anchorId
}

/**
 * An index in the sense of the llms.txt convention: one link per anchor, no
 * definitions. llms.txt carries the full text (over half a megabyte), which an
 * LLM asked to read it truncates — it then answers from whatever fit in its
 * window. A list of links lets it fetch the two or three anchors that actually
 * match the question.
 */
function generateLlmsIndexTxt(bundles) {
  // Counts, so a reader sees the shape of the site before the longest section
  // swamps the others: 210 anchor lines under twelve documentation lines read
  // as an anchor catalogue unless the file says otherwise.
  const anchorCount = new Set(categories.flatMap((c) => c.anchors)).size
  let contractCount
  try {
    contractCount = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'website/public/data/contracts.json'), 'utf-8')
    ).length
  } catch {
    contractCount = 0
  }

  const lines = [
    '# Semantic Anchors — Index of this site',
    '',
    '> This site publishes three kinds of thing, and all of them are listed below:',
    `> ${DOC_PAGES.length} documentation pages, ${contractCount} semantic contracts, and`,
    `> ${anchorCount} anchors in ${categories.length} categories — the anchors both`,
    `> one by one and bundled into ${bundles.length} files that hold a whole category.`,
    '>',
    '> The anchor list is the longest section but not the most important one: a',
    '> question about a workflow, a method or this project is usually answered by a',
    '> documentation page, a question about a single term by an anchor.',
    '>',
    '> No definitions here on purpose — fetch the entries you need. Every link is',
    '> small and served as plain text, except the bundles, which are larger by',
    '> design: one fetch instead of twenty.',
    `> Website: ${SITE_URL}`,
    `> German variant of any anchor: replace .txt with .de.txt`,
    // The .txt files are for reading into a context window. A reader who asks
    // for "the link" wants a page they can open and send to someone.
    `> Page for a human reader: ${SITE_URL}anchor/<id>, where <id> is the file`,
    `> name without .txt. Give that one when someone asks for a link.`,
    '',
    `## Documentation — ${DOC_PAGES.length} pages about this project and how to work with it`,
    '',
    // Trailing slash: without it every page answers 301 first, and a redirect is
    // one more thing that can go wrong on the reader's side.
    ...DOC_PAGES.map(
      (page) =>
        `- [${page.title}](${page.url.replace(/\/?$/, '/')}): ${page.summary.replace(/\s+/g, ' ').trim()}`
    ),
    '',
    `## Semantic Contracts — ${contractCount} ready-made definitions to drop into a project`,
    '',
    `- [All contracts as one text](${SITE_URL}contracts.txt): what terms mean in a project,` +
      ' composed from anchors or defined by a team.',
    `- [Contracts overview](${SITE_URL}contracts/): the same contracts as pages.`,
    '',
    `## Anchor bundles — the same ${anchorCount} terms in full, ${bundles.length} files`,
    '',
    '> One file per category, or per part of a large one. Fetch a bundle instead',
    '> of the single anchors below when you want a whole category at once.',
    '',
    ...bundles.map(
      (bundle) =>
        `- [${bundle.title}](${SITE_URL}bundles/${bundle.id}.txt): ` +
        `${bundle.anchors.length} anchors in full.`
    ),
    '',
    `## Anchors — ${anchorCount} named terms, grouped by category`,
    '',
  ]

  // An anchor that belongs to two categories is listed under both, the same way
  // all-anchors.adoc includes it under both: the entry is a way in, and dropping
  // it from the second category would make that category look incomplete.
  let total = 0
  for (const category of categories) {
    lines.push(`### ${category.name}`)
    lines.push('')
    for (const anchorId of category.anchors) {
      const filepath = path.join(ROOT, 'docs/anchors', `${anchorId}.adoc`)
      if (!fs.existsSync(filepath)) continue
      lines.push(`- [${anchorTitle(anchorId, filepath)}](${SITE_URL}anchors/${anchorId}.txt)`)
      total += 1
    }
    lines.push('')
  }

  const output = lines.join('\n')

  /*
   * The same index in three shapes, because a fetcher's willingness to follow a
   * link depends on how the file arrives:
   *
   *   .md    text/markdown — links are marked up, most tools parse them
   *   .html  real <a href>, which every tool parses
   *   .txt   text/plain, kept for anything that asked for the old name
   *
   * Measured: an assistant read the index, listed the matching entries by name,
   * and then refused to fetch them — "not in any prior search or fetch result".
   * The links were in the file; they had arrived as plain text.
   */
  fs.writeFileSync(path.join(ROOT, 'website/public/llms-index.md'), output, 'utf-8')
  fs.writeFileSync(path.join(ROOT, 'website/public/llms-index.txt'), output, 'utf-8')
  fs.writeFileSync(path.join(ROOT, 'website/public/llms-index.html'), indexAsHtml(lines), 'utf-8')
  const kb = Math.round(Buffer.byteLength(output, 'utf-8') / 1024)
  console.warn(`Generated: website/public/llms-index.{md,txt,html} (${total} entries, ~${kb} KB)`)

  /*
   * The button's URL carries a token derived from this file's content, so that
   * whatever caches it between here and the reader's LLM has to fetch again when
   * the index changes — and only then. A timestamp would change the URL on every
   * deploy and throw away caching that is doing no harm.
   *
   * Measured: an assistant kept answering from an index we had replaced half an
   * hour earlier, and named files that no longer appeared in it.
   */
  const version = crypto.createHash('sha256').update(output).digest('hex').slice(0, 8)

  /*
   * The prompt names these pages itself. Measured: the reader's LLM fetches a
   * URL that stood in the message it was given, and refuses one it only found
   * inside a document it fetched. So the index alone cannot open the site — the
   * pages that answer most questions have to travel in the prompt.
   *
   * Written here rather than typed into the prompt, so the two cannot drift
   * apart when a page is renamed.
   */
  const manifest = [
    `// Generated by scripts/generate-llms-txt.js — do not edit.`,
    `// Changes whenever llms-index.txt changes, and never otherwise.`,
    `export const LLMS_INDEX_VERSION = '${version}'`,
    ``,
    `/** The pages the TalkItOver prompt hands to the reader's LLM by name. */`,
    `export const DOC_PAGES = [`,
    ...DOC_PAGES.map((page) => `  { title: ${JSON.stringify(page.title)}, url: '${page.url}/' },`),
    `]`,
    ``,
    `/** The anchors in full, a few dozen per file, so nothing is left to follow. */`,
    `export const BUNDLES = [`,
    ...bundles.map(
      (bundle) =>
        `  { title: ${JSON.stringify(bundle.title)}, url: '${SITE_URL}bundles/${bundle.id}.txt',` +
        ` terms: ${JSON.stringify(bundle.anchors.map((id) => anchorTitle(id, anchorPath(id))))} },`
    ),
    `]`,
    ``,
    `/** All contracts in one file — one fetch instead of ${contractCount}. */`,
    `export const CONTRACTS_URL = '${SITE_URL}contracts.txt'`,
    ``,
    `/** Everything this site has, in one large file. Last resort, often truncated. */`,
    `export const FULL_TEXT_URL = '${SITE_URL}llms.txt'`,
    ``,
  ].join('\n')
  fs.writeFileSync(path.join(ROOT, 'website/src/utils/llms-index-manifest.js'), manifest, 'utf-8')
  console.warn(
    `Generated: website/src/utils/llms-index-manifest.js (${version}, ${DOC_PAGES.length} pages)`
  )
}

// ─── Generate website/public/llms.txt ───────────────────────────────────────

function generateLlmsTxt() {
  const totalAnchors = categories.reduce((n, c) => n + c.anchors.length, 0)
  const lines = [
    '# Semantic Anchors — Complete Reference',
    '',
    `> ${totalAnchors} well-defined terms, methodologies, and frameworks`,
    '> that serve as precision reference points when communicating with LLMs.',
    '> Source: https://github.com/LLM-Coding/Semantic-Anchors',
    '> Website: https://llm-coding.github.io/Semantic-Anchors/',
    '',
    '---',
    '',
  ]

  // Introductory content from about.adoc
  const aboutPath = path.join(ROOT, 'docs/about.adoc')
  if (fs.existsSync(aboutPath)) {
    lines.push(adocToMarkdown(fs.readFileSync(aboutPath, 'utf-8')))
    lines.push('')
    lines.push('---')
    lines.push('')
  }

  // Documentation pages: see DOC_PAGES above.

  lines.push('## Documentation')
  lines.push('')
  for (const page of DOC_PAGES) {
    lines.push(`- [${page.title}](${page.url}): ${page.summary}`)
  }
  lines.push('')
  lines.push('---')
  lines.push('')

  // Anchors by category
  for (const category of categories) {
    lines.push(`## ${category.name}`)
    lines.push('')

    for (const anchorId of category.anchors) {
      const filepath = path.join(ROOT, 'docs/anchors', `${anchorId}.adoc`)
      if (!fs.existsSync(filepath)) continue

      const raw = fs.readFileSync(filepath, 'utf-8')
      const titleMatch = raw.match(/^= (.+)$/m)
      const title = titleMatch ? titleMatch[1] : anchorId

      lines.push(`### ${title}`)
      lines.push('')

      const body = raw.replace(/^= .+\n/, '')
      lines.push(adocToMarkdown(body))
      lines.push('')
    }

    lines.push('---')
    lines.push('')
  }

  // ─── Append Semantic Contracts ──────────────────────────────────────────────

  const contractsPath = path.join(ROOT, 'website/public/data/contracts.json')
  try {
    const contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf-8'))
    if (contracts.length > 0) {
      lines.push('')
      lines.push('# Semantic Contracts')
      lines.push('')
      lines.push('Semantic Contracts define what a term means in your project — either by')
      lines.push('composing established anchors or by providing custom definitions that only')
      lines.push('exist within your team.')
      lines.push('Add them to your AGENTS.md or CLAUDE.md.')
      lines.push('Select and download: https://llm-coding.github.io/Semantic-Anchors/#/contracts')
      lines.push(
        'Plain text (all contracts): https://llm-coding.github.io/Semantic-Anchors/contracts.txt'
      )
      lines.push('')

      for (const contract of contracts) {
        lines.push(`## ${contract.title}`)
        lines.push('')
        lines.push(contract.template)
        lines.push('')
        if (contract.anchors && contract.anchors.length > 0) {
          lines.push(`*Referenced anchors: ${contract.anchors.join(', ')}*`)
          lines.push('')
        }
      }

      lines.push('---')
      console.warn(`  Including ${contracts.length} Semantic Contracts in llms.txt`)
    }
  } catch {
    // contracts.json not found — skip
  }

  const output = lines.join('\n')
  fs.writeFileSync(path.join(ROOT, 'website/public/llms.txt'), output, 'utf-8')
  const kb = Math.round(Buffer.byteLength(output, 'utf-8') / 1024)
  console.warn(`Generated: website/public/llms.txt (${totalAnchors} anchors, ~${kb} KB)`)
}

// ─── Generate website/public/contracts.txt (contracts-only, LLM-readable) ────

function generateContractsTxt() {
  const contractsPath = path.join(ROOT, 'website/public/data/contracts.json')
  let contracts
  try {
    contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf-8'))
  } catch {
    console.warn('  contracts.json not found — skipping contracts.txt')
    return
  }
  if (!Array.isArray(contracts) || contracts.length === 0) return

  const lines = [
    '# Semantic Contracts',
    '',
    `> ${contracts.length} composable contracts that define what terms mean in your project —`,
    '> by composing established Semantic Anchors or by providing custom team definitions.',
    '> Add them to your AGENTS.md or CLAUDE.md.',
    '> Source: https://github.com/LLM-Coding/Semantic-Anchors',
    '> Select & copy: https://llm-coding.github.io/Semantic-Anchors/#/contracts',
    '',
    '---',
    '',
  ]

  for (const contract of contracts) {
    lines.push(`## ${contract.title}`)
    lines.push('')
    if (contract.description) {
      lines.push(`_${contract.description}_`)
      lines.push('')
    }
    lines.push(contract.template)
    lines.push('')
    if (contract.anchors && contract.anchors.length > 0) {
      lines.push(`*Referenced anchors: ${contract.anchors.join(', ')}*`)
      lines.push('')
    }
  }

  const output =
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  fs.writeFileSync(path.join(ROOT, 'website/public/contracts.txt'), output, 'utf-8')
  const kb = Math.round(Buffer.byteLength(output, 'utf-8') / 1024)
  console.warn(`Generated: website/public/contracts.txt (${contracts.length} contracts, ~${kb} KB)`)
}

// ─── Generate website/public/docs/all-anchors.adoc (inlined, no includes) ────

/**
 * Shift AsciiDoc heading levels by offset (e.g. +1 turns = into ==)
 */
function shiftHeadings(content, offset) {
  return content.replace(/^(=+)( .+)$/gm, (_, eq, rest) => '='.repeat(eq.length + offset) + rest)
}

/**
 * Strip document-level AsciiDoc attributes (:key: value) used as metadata
 */
function stripDocAttrs(content) {
  return content.replace(/^:[a-z][a-z0-9-]*:.*$/gm, '')
}

function generateAllAnchorsWebAdoc() {
  const anchoredIds = new Set()
  const WEB_DOCS = path.join(ROOT, 'website/public/docs')
  fs.mkdirSync(WEB_DOCS, { recursive: true })

  const lines = [
    '= Semantic Anchors — Complete Reference',
    ':toc:',
    ':toc-placement: preamble',
    ':toclevels: 2',
    '',
  ]

  const aboutPath = path.join(ROOT, 'docs/about.adoc')
  if (fs.existsSync(aboutPath)) {
    const aboutContent = fs.readFileSync(aboutPath, 'utf-8')
    lines.push(shiftHeadings(stripDocAttrs(aboutContent), 1))
    lines.push('')
    lines.push("'''")
    lines.push('')
  }

  for (const category of categories) {
    lines.push(`== ${category.name}`)
    lines.push('')
    for (const anchorId of category.anchors) {
      const filepath = path.join(ROOT, 'docs/anchors', `${anchorId}.adoc`)
      if (fs.existsSync(filepath)) {
        const anchorContent = fs.readFileSync(filepath, 'utf-8')
        // Same stable per-anchor section ID as in the include-based
        // docs/all-anchors.adoc (see generateAllAnchorsAdoc).
        if (/^[a-z]/.test(anchorId) && !anchoredIds.has(anchorId)) {
          anchoredIds.add(anchorId)
          lines.push(`[[${anchorId}]]`)
        }
        lines.push(shiftHeadings(stripDocAttrs(anchorContent), 2))
        lines.push('')
      }
    }
    lines.push("'''")
    lines.push('')
  }

  const output = lines.join('\n')
  fs.writeFileSync(path.join(WEB_DOCS, 'all-anchors.adoc'), output, 'utf-8')
  const kb = Math.round(Buffer.byteLength(output, 'utf-8') / 1024)
  console.warn(`Generated: website/public/docs/all-anchors.adoc (~${kb} KB, inlined)`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

generateAllAnchorsAdoc()
generateAllAnchorsWebAdoc()
generateLlmsTxt()
generateAnchorMarkdown()
generateLlmsIndexTxt(generateAnchorBundles())
generateContractsTxt()
