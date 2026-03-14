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
 * Render a single AsciiDoc file to HTML.
 * Uses safe:'safe' so include:: directives are resolved from the filesystem.
 */
function renderFile(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return
  try {
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    const html = asciidoctor.convertFile(srcPath, { ...OPTS, to_file: false })
    fs.writeFileSync(destPath, String(html), 'utf-8')
    console.log(`Rendered: ${path.relative(ROOT, destPath)}`)
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

// Pre-rendered HTML docs (no .adoc source available) — copy with link rewriting
function copyHtmlDoc(srcPath, destPath) {
  if (!fs.existsSync(srcPath)) return
  try {
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    let html = fs.readFileSync(srcPath, 'utf-8')
    // Extract content from full HTML page (between <div id="content"> and <div id="footer">)
    const contentStart = html.indexOf('<div id="content">')
    const contentEnd = html.indexOf('<div id="footer">')
    if (contentStart !== -1) {
      const titleMatch = html.match(/<h1>(.*?)<\/h1>/)
      const title = titleMatch ? titleMatch[1] : ''
      const content = html.slice(contentStart, contentEnd !== -1 ? contentEnd : undefined).trim()
      html = `<h1>${title}</h1>\n${content}`
    }
    // Convert absolute Semantic Anchors links to relative hash links
    html = html.replace(
      /https:\/\/llm-coding\.github\.io\/Semantic-Anchors\/#\/anchor\//g,
      '#/anchor/'
    )
    html = html.replace(/https:\/\/llm-coding\.github\.io\/Semantic-Anchors\//g, '#/')
    fs.writeFileSync(destPath, html, 'utf-8')
    console.log(`Copied: ${path.relative(ROOT, destPath)}`)
  } catch (err) {
    console.error(`Failed to copy ${path.relative(ROOT, srcPath)}:`, err.message)
    process.exit(1)
  }
}

copyHtmlDoc(
  path.join(ROOT, 'docs/spec-driven-workflow.html'),
  path.join(WEB_DOCS, 'spec-driven-workflow.html')
)
copyHtmlDoc(
  path.join(ROOT, 'docs/spec-driven-workflow.de.html'),
  path.join(WEB_DOCS, 'spec-driven-workflow.de.html')
)
