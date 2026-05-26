#!/usr/bin/env node
/**
 * Pre-render AsciiDoc documentation pages to HTML for the website build.
 *
 * Runs as a prebuild step so the browser never needs to load asciidoctor.js
 * for doc pages. Individual anchor files (used by the modal) are still
 * rendered client-side via anchor-modal.js.
 *
 * Output:
 *   website/public/docs/about.html
 *   website/public/docs/about.de.html   (if source exists)
 *   website/public/CONTRIBUTING.html
 *   website/public/CONTRIBUTING.de.html (if source exists)
 *   website/public/docs/changelog.html
 *   website/public/docs/all-anchors.html
 *
 * Usage: node scripts/render-docs.js
 */

const fs = require('fs')
const path = require('path')
const Asciidoctor = require('@asciidoctor/core')

const asciidoctor = Asciidoctor()
const ROOT = path.join(__dirname, '..')

const OPTS = {
  safe: 'safe',
  attributes: {
    showtitle: true,
    'source-highlighter': 'highlight.js',
    icons: 'font',
    sectanchors: true,
    idprefix: '',
    idseparator: '-',
  },
}

/**
 * Extract the AsciiDoc-generated `<div id="toc">...</div>` block from the
 * rendered HTML. Returns `{ toc, body }` where `toc` is the TOC HTML (or
 * `null` if the doc has no TOC) and `body` is the HTML with the TOC removed.
 *
 * AsciiDoctor outputs the TOC as a single `<div id="toc" class="toc">` (or
 * `class="toc2"` for `:toc: left`). We depth-count `<div>` open/close tags
 * so a TOC with arbitrarily nested ULs is removed cleanly.
 *
 * Splitting the TOC out at build time lets doc-page.js render it in its own
 * sticky sidebar slot instead of inline at the top of the body.
 */
function extractToc(html) {
  const startMatch = html.match(/<div[^>]*\sid="toc"[^>]*>/)
  if (!startMatch) return { toc: null, body: html }
  const start = startMatch.index
  let depth = 1
  let pos = start + startMatch[0].length
  while (pos < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', pos)
    const nextClose = html.indexOf('</div>', pos)
    if (nextClose === -1) return { toc: null, body: html }
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++
      pos = nextOpen + 4
    } else {
      depth--
      pos = nextClose + 6
    }
  }
  if (depth !== 0) return { toc: null, body: html }
  return { toc: html.slice(start, pos), body: html.slice(0, start) + html.slice(pos) }
}

/**
 * Render a single AsciiDoc file to HTML.
 * Uses safe:'safe' so include:: directives are resolved from the filesystem.
 * If the rendered HTML contains an AsciiDoc TOC, it is extracted into a
 * sidecar `<basename>.toc.html` file so doc-page.js can render it in its
 * own sidebar slot.
 */
function renderFile(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return
  try {
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    const html = String(asciidoctor.convertFile(srcPath, { ...OPTS, to_file: false }))
    const { toc, body } = extractToc(html)
    fs.writeFileSync(destPath, body, 'utf-8')
    console.log(`Rendered: ${path.relative(ROOT, destPath)}`)
    const tocPath = destPath.replace(/\.html$/, '.toc.html')
    if (toc) {
      fs.writeFileSync(tocPath, toc, 'utf-8')
      console.log(`Rendered: ${path.relative(ROOT, tocPath)}`)
    } else if (fs.existsSync(tocPath)) {
      fs.unlinkSync(tocPath)
    }
  } catch (err) {
    console.error(`Failed to render ${path.relative(ROOT, srcPath)}:`, err.message)
    process.exit(1)
  }
}

const WEB_DOCS = path.join(ROOT, 'website/public/docs')
const WEB_PUBLIC = path.join(ROOT, 'website/public')

renderFile(path.join(ROOT, 'docs/about.adoc'), path.join(WEB_DOCS, 'about.html'))
renderFile(path.join(ROOT, 'docs/about.de.adoc'), path.join(WEB_DOCS, 'about.de.html'))

renderFile(path.join(ROOT, 'CONTRIBUTING.adoc'), path.join(WEB_PUBLIC, 'CONTRIBUTING.html'))
renderFile(path.join(ROOT, 'CONTRIBUTING.de.adoc'), path.join(WEB_PUBLIC, 'CONTRIBUTING.de.html'))

renderFile(path.join(ROOT, 'docs/changelog.adoc'), path.join(WEB_DOCS, 'changelog.html'))

renderFile(path.join(ROOT, 'docs/agentskill.adoc'), path.join(WEB_DOCS, 'agentskill.html'))
renderFile(path.join(ROOT, 'docs/agentskill.de.adoc'), path.join(WEB_DOCS, 'agentskill.de.html'))

renderFile(
  path.join(ROOT, 'docs/rejected-proposals.adoc'),
  path.join(WEB_DOCS, 'rejected-proposals.html')
)
renderFile(
  path.join(ROOT, 'docs/rejected-proposals.de.adoc'),
  path.join(WEB_DOCS, 'rejected-proposals.de.html')
)

// all-anchors.adoc uses include:: directives — resolved automatically in Node.js
renderFile(path.join(ROOT, 'docs/all-anchors.adoc'), path.join(WEB_DOCS, 'all-anchors.html'))

renderFile(
  path.join(ROOT, 'docs/spec-driven-workflow.adoc'),
  path.join(WEB_DOCS, 'spec-driven-workflow.html')
)

renderFile(
  path.join(ROOT, 'docs/brownfield-workflow.adoc'),
  path.join(WEB_DOCS, 'brownfield-workflow.html')
)
renderFile(
  path.join(ROOT, 'docs/brownfield-workflow.de.adoc'),
  path.join(WEB_DOCS, 'brownfield-workflow.de.html')
)

renderFile(
  path.join(ROOT, 'docs/brownfield-experiment-report.adoc'),
  path.join(WEB_DOCS, 'brownfield-experiment-report.html')
)

renderFile(
  path.join(ROOT, 'docs/brownfield-fair-comparison.adoc'),
  path.join(WEB_DOCS, 'brownfield-fair-comparison.html')
)

renderFile(
  path.join(ROOT, 'docs/socratic-recovery-skill.adoc'),
  path.join(WEB_DOCS, 'socratic-recovery-skill.html')
)

renderFile(
  path.join(ROOT, 'docs/harness-inventory.adoc'),
  path.join(WEB_DOCS, 'harness-inventory.html')
)
renderFile(
  path.join(ROOT, 'docs/socratic-recovery-skill.de.adoc'),
  path.join(WEB_DOCS, 'socratic-recovery-skill.de.html')
)

renderFile(
  path.join(ROOT, 'docs/anchor-evaluations.adoc'),
  path.join(WEB_DOCS, 'anchor-evaluations.html')
)
renderFile(
  path.join(ROOT, 'docs/spec-driven-workflow.de.adoc'),
  path.join(WEB_DOCS, 'spec-driven-workflow.de.html')
)

// Render contracts page from JSON
require('./render-contracts.js')

// Copy evaluation report (self-contained HTML)
const evalReport = path.join(ROOT, 'evaluations/report.html')
if (fs.existsSync(evalReport)) {
  fs.copyFileSync(evalReport, path.join(WEB_PUBLIC, 'evaluation-report.html'))
  console.log(`Copied: ${path.relative(ROOT, path.join(WEB_PUBLIC, 'evaluation-report.html'))}`)
}

// Copy assets referenced by workflow docs
const workflowDiagram = path.join(ROOT, 'docs/workflow-diagram.svg')
if (fs.existsSync(workflowDiagram)) {
  fs.copyFileSync(workflowDiagram, path.join(WEB_DOCS, 'workflow-diagram.svg'))
  console.log(`Copied: ${path.relative(ROOT, path.join(WEB_DOCS, 'workflow-diagram.svg'))}`)
}
