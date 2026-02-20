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

const categories = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'website/public/data/categories.json'), 'utf-8')
)

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

  // Group cells into rows
  const rows = []
  for (let i = 0; i < allCells.length; i += colCount) {
    rows.push(allCells.slice(i, i + colCount))
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
  md = md.replace(/\[source(?:,([^\]]*))?\]\s*\n----/g, (_, lang) => '```' + (lang ? lang.trim() : ''))
  md = md.replace(/^----\s*$/gm, '```')

  // [quote] block: [quote]\n____\ntext\n____ → > text
  md = md.replace(/\[quote[^\]]*\]\s*\n_{4}\s*\n([\s\S]*?)\n_{4}/g, (_, body) =>
    body.trim().split('\n').map((l) => '> ' + l).join('\n')
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

  // Links: link:url[text] → [text](url), resolve relative .adoc paths to GitHub URLs
  md = md.replace(/link:([^[]+)\[([^\]]*)\]/g, (_, url, text) => {
    if (/^\.\.\/.*\.adoc$/.test(url)) {
      url = 'https://github.com/LLM-Coding/Semantic-Anchors/blob/main/' + url.slice(3)
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
  md = md.replace(/(?<![*\w])\*([^*\n]+)\*(?![*\w])/g, '**$1**')

  // Ordered list items: ". item" → "1. item"
  md = md.replace(/^\. /gm, '1. ')

  // Trailing whitespace and normalize blank lines
  md = md.replace(/[ \t]+$/gm, '')
  md = md.replace(/\n{3,}/g, '\n\n')

  return md.trim()
}

// ─── Generate docs/all-anchors.adoc ─────────────────────────────────────────

function generateAllAnchorsAdoc() {
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
  const aboutAdoc = fs.readFileSync(path.join(ROOT, 'docs/about.adoc'), 'utf-8')
  lines.push(adocToMarkdown(aboutAdoc))
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

  const output = lines.join('\n')
  fs.writeFileSync(path.join(ROOT, 'website/public/llms.txt'), output, 'utf-8')
  const kb = Math.round(Buffer.byteLength(output, 'utf-8') / 1024)
  console.warn(`Generated: website/public/llms.txt (${totalAnchors} anchors, ~${kb} KB)`)
}

// ─── Main ────────────────────────────────────────────────────────────────────

generateAllAnchorsAdoc()
generateLlmsTxt()
