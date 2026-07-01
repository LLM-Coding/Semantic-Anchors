#!/usr/bin/env node
/**
 * Generate docs/all-anchors.adoc and website/public/llms.txt
 *
 * all-anchors.adoc: AsciiDoc include-based full reference document
 * llms.txt:         Clean Markdown for LLM consumption
 *
 * Usage: node scripts/generate-llms-txt.js
 */

const fs = require('fs')
const path = require('path')

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
        // Explicit block anchor so each anchor section gets its stable
        // catalog ID (e.g. #mece) instead of a title-derived one — the
        // static home catalog links to /all-anchors#<anchor-id> (#595).
        // AsciiDoc anchors must start with a letter; digit-leading IDs
        // (4mat) already match their title-derived ID, so skip those.
        // Multi-category anchors are included once per category — only
        // the first occurrence gets the ID to avoid duplicate-id warnings.
        if (/^[a-z]/.test(anchorId) && !anchoredIds.has(anchorId)) {
          anchoredIds.add(anchorId)
          lines.push(`[[${anchorId}]]`)
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

  // Top-level documentation pages (each pre-rendered as a standalone HTML page)
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
generateContractsTxt()
