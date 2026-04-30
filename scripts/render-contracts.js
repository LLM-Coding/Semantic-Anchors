#!/usr/bin/env node
/**
 * Render a static HTML fragment from contracts.json for pre-rendering.
 *
 * The contracts page is JS-interactive (checkboxes, download), but crawlers
 * and LLMs need to see the content without executing JavaScript.
 * This script generates a plain HTML summary of all contracts that
 * prerender-routes.js injects into the static shell.
 *
 * Output: website/public/docs/contracts.html
 *
 * Usage: node scripts/render-contracts.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const CONTRACTS_JSON = path.join(ROOT, 'website/public/data/contracts.json')
const OUTPUT = path.join(ROOT, 'website/public/docs/contracts.html')

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderTemplate(template) {
  return template
    .split('\n')
    .map((line) => {
      if (line.startsWith('- ')) {
        return `<li>${escapeHtml(line.slice(2))}</li>`
      }
      if (line.trim() === '') return ''
      return `<p>${escapeHtml(line)}</p>`
    })
    .join('\n')
}

function renderContract(contract) {
  const anchors = contract.anchors
    .map(
      (id) =>
        `<a href="#/anchor/${escapeHtml(id)}" class="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">${escapeHtml(id)}</a>`
    )
    .join(' ')

  return `
    <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 mb-4">
      <h3 class="text-lg font-semibold mb-1">${escapeHtml(contract.title)}</h3>
      <p class="text-sm text-[var(--color-text-secondary)] mb-3">${escapeHtml(contract.description)}</p>
      <div class="rounded-md bg-[var(--color-bg-secondary)] p-3 mb-3 text-sm leading-relaxed">
        <ul class="list-disc list-inside space-y-1">
          ${renderTemplate(contract.template)}
        </ul>
      </div>
      <div class="flex flex-wrap gap-1.5">${anchors}</div>
    </div>`
}

function main() {
  if (!fs.existsSync(CONTRACTS_JSON)) {
    console.error(`ERROR: ${CONTRACTS_JSON} not found`)
    process.exit(1)
  }

  const contracts = JSON.parse(fs.readFileSync(CONTRACTS_JSON, 'utf-8'))

  const html = `
<h1>Semantic Contracts</h1>
<p class="text-[var(--color-text-secondary)] mb-6">
  Semantic Anchors reference public knowledge that LLMs already understand.
  But your team's conventions, templates, and definitions need Semantic Contracts.
  A contract defines what a term means in your project — either by composing
  established anchors or by providing custom definitions that only exist within your team.
</p>
<div class="grid gap-4 md:grid-cols-2">
  ${contracts.map(renderContract).join('\n')}
</div>`

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, html, 'utf-8')
  console.log(`Rendered: ${path.relative(ROOT, OUTPUT)}`)
}

main()
