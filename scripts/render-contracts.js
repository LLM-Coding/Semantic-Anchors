#!/usr/bin/env node
/**
 * Render static HTML fragments from contracts.json for pre-rendering.
 *
 * The contracts page is JS-interactive (checkboxes, download), but crawlers
 * and LLMs need to see the content without executing JavaScript.
 * This script generates:
 *   - a plain HTML summary of all contracts (the /contracts page fragment)
 *   - one detail fragment per contract, EN and DE, for the pre-rendered
 *     /contract/<id> and /de/contract/<id> pages (#611)
 *
 * Output:
 *   website/public/docs/contracts.html
 *   website/public/docs/contracts/<id>.html
 *   website/public/docs/contracts/<id>.de.html
 *
 * Usage: node scripts/render-contracts.js
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const CONTRACTS_JSON = path.join(ROOT, 'website/public/data/contracts.json')
const OUTPUT = path.join(ROOT, 'website/public/docs/contracts.html')
const DETAIL_DIR = path.join(ROOT, 'website/public/docs/contracts')
const BASE = '/Semantic-Anchors'

// Same pattern the SPA router enforces before using ids in DOM selectors —
// here it guards path.join/file writes against a malformed contracts.json
// entry (defense-in-depth; the file is repo-maintained and trusted).
const SAFE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

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

// German anchor pages exist only where a .de.adoc source does — mirror the
// hasDePage check from prerender-routes.js so DE contract pages link to DE
// anchor pages where available and fall back to the EN page otherwise.
function hasDeAnchorPage(id) {
  return fs.existsSync(path.join(ROOT, 'docs/anchors', `${id}.de.adoc`))
}

function renderAnchorChips(contract, lang) {
  return contract.anchors
    .map((id) => {
      const href =
        lang === 'de' && hasDeAnchorPage(id)
          ? `${BASE}/de/anchor/${escapeHtml(id)}`
          : `${BASE}/anchor/${escapeHtml(id)}`
      return `<a href="${href}" class="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300">${escapeHtml(id)}</a>`
    })
    .join(' ')
}

function renderContract(contract) {
  return `
    <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 mb-4">
      <h3 class="text-lg font-semibold mb-1"><a href="${BASE}/contract/${escapeHtml(contract.id)}" class="hover:underline">${escapeHtml(contract.title)}</a> <a href="${BASE}/contract/${escapeHtml(contract.id)}" class="inline-flex items-center align-middle text-[var(--color-text-secondary)] hover:text-blue-600 transition-colors" aria-label="Link to this contract"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"/></svg></a></h3>
      <p class="text-sm text-[var(--color-text-secondary)] mb-3">${escapeHtml(contract.description)}</p>
      <div class="rounded-md bg-[var(--color-bg-secondary)] p-3 mb-3 text-sm leading-relaxed">
        <ul class="list-disc list-inside space-y-1">
          ${renderTemplate(contract.template)}
        </ul>
      </div>
      <div class="flex flex-wrap gap-1.5">${renderAnchorChips(contract, 'en')}</div>
    </div>`
}

/**
 * Detail-page fragment for one contract (the /contract/<id> body).
 * @param {object} contract - entry from contracts.json
 * @param {('en'|'de')} lang
 */
function renderContractDetail(contract, lang) {
  const de = lang === 'de'
  const title = de ? contract.titleDe || contract.title : contract.title
  const description = de ? contract.descriptionDe || contract.description : contract.description
  const template = de ? contract.templateDe || contract.template : contract.template
  const backText = de ? '← Alle Semantic Contracts' : '← All Semantic Contracts'
  const intro = de
    ? 'Ein Semantic Contract: Vokabular, das dein Projekt selbst mitliefert — zum Einsetzen in deine CLAUDE.md / AGENTS.md.'
    : 'A semantic contract: vocabulary your project supplies itself — ready to drop into your CLAUDE.md / AGENTS.md.'
  const relatedHeading = de ? 'Verwandte Anker' : 'Related Anchors'

  return `
<p class="mb-4"><a href="${BASE}/contracts" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">${backText}</a></p>
<h1>${escapeHtml(title)}</h1>
<p class="text-[var(--color-text-secondary)] mb-2">${escapeHtml(description)}</p>
<p class="text-sm text-[var(--color-text-secondary)] mb-4">${intro}</p>
<div class="rounded-md bg-[var(--color-bg-secondary)] p-4 mb-4 text-sm leading-relaxed">
  <ul class="list-disc list-inside space-y-1">
    ${renderTemplate(template)}
  </ul>
</div>
<h2 class="text-lg font-semibold mb-2">${relatedHeading}</h2>
<div class="flex flex-wrap gap-1.5">${renderAnchorChips(contract, lang)}</div>`
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

  fs.mkdirSync(DETAIL_DIR, { recursive: true })
  for (const contract of contracts) {
    if (!SAFE_ID_PATTERN.test(contract.id)) {
      console.warn(`  ! skipped contract with unsafe id: ${JSON.stringify(contract.id)}`)
      continue
    }
    fs.writeFileSync(
      path.join(DETAIL_DIR, `${contract.id}.html`),
      renderContractDetail(contract, 'en'),
      'utf-8'
    )
    fs.writeFileSync(
      path.join(DETAIL_DIR, `${contract.id}.de.html`),
      renderContractDetail(contract, 'de'),
      'utf-8'
    )
  }
  console.log(
    `Rendered: ${contracts.length} contract detail fragments (EN + DE) to website/public/docs/contracts/`
  )
}

main()
