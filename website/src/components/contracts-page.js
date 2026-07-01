import { i18n } from '../i18n.js'

const STORAGE_KEY = 'selected-contracts'

// id -> title map for the anchors a contract declares; set by initContractsPage.
// Used to highlight verbatim anchor mentions inside the rendered template text.
// Copy/download use the raw template, so highlighting never leaks into the export.
let anchorTitleMap = {}

function esc(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Curated surface-form aliases for anchors whose prose mention differs from the
// canonical title (e.g. "MECE Principle" written as just "MECE"). Each alias was
// verified to appear verbatim in at least one contract template (EN or DE) and to
// be unambiguous among the anchors a contract declares. Keyed by anchor id.
const ANCHOR_ALIASES = {
  'cockburn-use-cases': ['Cockburn'],
  'ears-requirements': ['EARS'],
  mece: ['MECE'],
  arc42: ['arc42'],
  'c4-diagrams': ['C4'],
  'adr-according-to-nygard': ['ADRs', 'Nygard'],
  'pugh-matrix': ['Pugh Matrix'],
  'quality-attribute-scenario': ['quality attribute scenario'],
  stride: ['STRIDE'],
  'testing-pyramid': ['testing pyramid'],
  'domain-driven-design': ['Domain-Driven Design', 'Ubiquitous Language'],
  'solid-dip': ['DIP'],
  'solid-principles': ['SOLID'],
  'walking-skeleton': ['walking skeleton'],
  'tracer-bullet': ['Tracer'],
  'spike-solution': ['spike'],
  'definition-of-done': ['Definition of Done'],
  'code-smells': ['code smells', 'Code Smells'],
  dry: ['DRY'],
  'kiss-principle': ['KISS'],
  'socratic-method': ['Socratic Method'],
  'mental-model-according-to-naur': ['Naur'],
  bluf: ['BLUF'],
  'plain-english-strunk-white': ['Strunk & White', 'Plain English'],
  'blooms-taxonomy': ["Bloom's", 'Blooms'],
}

// Highlight mentions of a contract's declared anchors, linked to the anchor.
// Matches each anchor's title plus the curated aliases above, scoped to the
// declared anchors only. Operates on raw text and returns escaped HTML.
function highlightAnchors(text, anchorIds) {
  const terms = []
  for (const id of anchorIds || []) {
    const title = anchorTitleMap[id]
    if (title) terms.push({ id, term: title })
    for (const alias of ANCHOR_ALIASES[id] || []) terms.push({ id, term: alias })
  }
  if (!terms.length) return esc(text)
  terms.sort((a, b) => b.term.length - a.term.length) // longest term first

  // Collect non-overlapping matches; the longest term wins a contested span.
  const matches = []
  for (const { id, term } of terms) {
    const re = new RegExp(`(?<![\\w])${escapeRegex(term)}(?![\\w])`, 'g')
    let m
    while ((m = re.exec(text)) !== null) {
      const start = m.index
      const end = start + m[0].length
      if (!matches.some((x) => start < x.end && end > x.start)) {
        matches.push({ start, end, id, text: m[0] })
      }
    }
  }
  matches.sort((a, b) => a.start - b.start)

  // Rebuild the line, escaping plain text and linking matched anchor names.
  let html = ''
  let pos = 0
  for (const mt of matches) {
    html += esc(text.slice(pos, mt.start))
    html += `<a href="#/anchor/${esc(mt.id)}" class="font-medium text-blue-700 dark:text-blue-300 hover:underline">${esc(mt.text)}</a>`
    pos = mt.end
  }
  html += esc(text.slice(pos))
  return html
}

function getSelectedContracts() {
  try {
    const val = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(val) ? val : []
  } catch {
    return []
  }
}

function setSelectedContracts(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // localStorage may be blocked
  }
}

function getLocalizedField(contract, field) {
  const lang = i18n.currentLang() || 'en'
  if (lang === 'de' && contract[field + 'De']) {
    return contract[field + 'De']
  }
  return contract[field]
}

export function renderContractsPage() {
  const selected = getSelectedContracts()
  const selectedCount = selected.length

  return `
    <div class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[var(--color-text)] mb-2" data-i18n="contracts.title">
          ${i18n.t('contracts.title')}
        </h1>
        <p class="text-[var(--color-text-secondary)] mb-4" data-i18n="contracts.explanation">
          ${i18n.t('contracts.explanation')}
        </p>
        <p class="text-sm text-[var(--color-text-secondary)] mb-2">
          <a href="https://www.linkedin.com/feed/update/urn:li:activity:7438137401019105281/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline" data-i18n="contracts.linkedinLink">${i18n.t('contracts.linkedinLink')}</a>
        </p>
        <p class="text-sm text-[var(--color-text-secondary)] mb-6">
          <a href="contracts.txt" class="text-blue-600 dark:text-blue-400 hover:underline" data-i18n="contracts.plainText">${i18n.t('contracts.plainText')}</a>
        </p>

        <div class="flex items-center gap-3 mb-6">
          <span id="contracts-count" class="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">${selectedCount} <span data-i18n="contracts.selected" class="ml-1">${i18n.t('contracts.selected')}</span></span>
          <button
            id="contracts-download"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="${i18n.t('contracts.download')}"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span data-i18n="contracts.download">${i18n.t('contracts.download')}</span>
          </button>
          <button
            id="contracts-copy"
            class="inline-flex items-center gap-2 rounded-lg border border-blue-600 dark:border-blue-400 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="${i18n.t('contracts.copy')}"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
            </svg>
            <span data-i18n="contracts.copy">${i18n.t('contracts.copy')}</span>
          </button>
          <button
            id="contracts-select-all"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-1"
            data-i18n="contracts.selectAll"
          >${i18n.t('contracts.selectAll')}</button>
          <button
            id="contracts-deselect-all"
            class="text-sm text-[var(--color-text-secondary)] hover:underline"
            data-i18n="contracts.deselectAll"
          >${i18n.t('contracts.deselectAll')}</button>
        </div>
      </div>

      <div id="contracts-grid" class="grid gap-4 md:grid-cols-2">
      </div>
    </div>
  `
}

export function renderContractCard(contract, isSelected) {
  const title = getLocalizedField(contract, 'title')
  const description = getLocalizedField(contract, 'description')
  const template = getLocalizedField(contract, 'template')

  const anchorLinks = contract.anchors
    .map(
      (id) =>
        `<a href="#/anchor/${esc(id)}" class="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors">${esc(id)}</a>`
    )
    .join(' ')

  const anchorIds = contract.anchors || []
  const templateHtml = template
    .split('\n')
    .map((line) => {
      if (line.startsWith('- ')) {
        return `<span class="text-[var(--color-text-secondary)]">• ${highlightAnchors(line.slice(2), anchorIds)}</span>`
      }
      return `<span>${highlightAnchors(line, anchorIds)}</span>`
    })
    .join('<br>')

  return `
    <div class="contract-card rounded-lg border transition-all cursor-pointer
      ${isSelected ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm' : 'border-[var(--color-border)] bg-[var(--color-bg)] hover:border-blue-300 dark:hover:border-blue-700'}"
      data-contract-id="${esc(contract.id)}"
    >
      <div class="p-5">
        <div class="flex items-start gap-3">
          <input
            type="checkbox"
            class="contract-checkbox mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            data-contract-id="${esc(contract.id)}"
            ${isSelected ? 'checked' : ''}
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="text-lg font-semibold text-[var(--color-text)]"><a href="${import.meta.env.BASE_URL}contract/${esc(contract.id)}" class="hover:underline" title="${esc(i18n.t('contracts.permalink'))}">${esc(title)}</a></h3>
              <div class="flex shrink-0 gap-1.5">
              <a
                href="${import.meta.env.BASE_URL}contract/${esc(contract.id)}"
                class="contract-permalink inline-flex items-center justify-center rounded-md border border-[var(--color-border)] p-1.5 text-[var(--color-text-secondary)] hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 dark:hover:border-blue-700 transition-colors"
                title="${esc(i18n.t('contracts.permalink'))}"
                aria-label="${esc(i18n.t('contracts.permalink'))}"
              >
                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"/>
                </svg>
              </a>
              <button
                type="button"
                class="contract-copy-btn shrink-0 inline-flex items-center justify-center rounded-md border border-[var(--color-border)] p-1.5 text-[var(--color-text-secondary)] hover:text-blue-600 hover:border-blue-300 dark:hover:text-blue-400 dark:hover:border-blue-700 transition-colors"
                data-contract-id="${esc(contract.id)}"
                title="${esc(i18n.t('contracts.copyOne'))}"
                aria-label="${esc(i18n.t('contracts.copyOne'))}"
              >
                <svg class="w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                </svg>
              </button>
              </div>
            </div>
            <p class="text-sm text-[var(--color-text-secondary)] mb-3">${esc(description)}</p>
            <div class="rounded-md bg-[var(--color-bg-secondary)] p-3 mb-3 text-sm leading-relaxed max-h-64 overflow-y-auto">
              ${templateHtml}
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${anchorLinks}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

export function initContractsPage(contracts, anchorTitles) {
  if (anchorTitles) anchorTitleMap = anchorTitles
  const oldGrid = document.getElementById('contracts-grid')
  if (!oldGrid || !contracts) return

  // Replace grid to remove stale event listeners from previous init
  const grid = oldGrid.cloneNode(false)
  oldGrid.replaceWith(grid)

  const selected = getSelectedContracts()

  grid.innerHTML = contracts.map((c) => renderContractCard(c, selected.includes(c.id))).join('')

  // Checkbox toggle
  grid.addEventListener('change', (e) => {
    if (e.target.classList.contains('contract-checkbox')) {
      const id = e.target.dataset.contractId
      const current = getSelectedContracts()
      if (e.target.checked) {
        if (!current.includes(id)) current.push(id)
      } else {
        const idx = current.indexOf(id)
        if (idx >= 0) current.splice(idx, 1)
      }
      setSelectedContracts(current)
      updateUI()
    }
  })

  // Per-card copy: copy just this contract, never toggle the card
  grid.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('.contract-copy-btn')
    if (!copyBtn) return
    e.stopPropagation()
    const id = copyBtn.dataset.contractId
    const contract = contracts.find((c) => c.id === id)
    if (contract) copyOneContract(contract, copyBtn)
  })

  // Card click toggles checkbox
  grid.addEventListener('click', (e) => {
    if (e.target.closest('.contract-copy-btn')) return
    const card = e.target.closest('.contract-card')
    if (!card || e.target.tagName === 'A' || e.target.tagName === 'INPUT') return
    const checkbox = card.querySelector('.contract-checkbox')
    if (checkbox) {
      checkbox.checked = !checkbox.checked
      checkbox.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  // Replace buttons via clone to remove stale listeners from previous init
  function rebindButton(id, handler) {
    const old = document.getElementById(id)
    if (!old) return
    const fresh = old.cloneNode(true)
    old.replaceWith(fresh)
    fresh.addEventListener('click', handler)
  }

  rebindButton('contracts-download', () => downloadContracts(contracts))
  rebindButton('contracts-copy', () => copyContracts(contracts))
  rebindButton('contracts-select-all', () => {
    setSelectedContracts(contracts.map((c) => c.id))
    initContractsPage(contracts)
  })
  rebindButton('contracts-deselect-all', () => {
    setSelectedContracts([])
    initContractsPage(contracts)
  })

  updateUI(contracts)
}

function updateUI() {
  const selected = getSelectedContracts()
  const countEl = document.getElementById('contracts-count')
  if (countEl) {
    countEl.querySelector('span:not([data-i18n])') ||
      (countEl.childNodes[0].textContent = selected.length + ' ')
    countEl.firstChild.textContent = selected.length + ' '
  }

  const downloadBtn = document.getElementById('contracts-download')
  if (downloadBtn) downloadBtn.disabled = selected.length === 0

  const copyBtn = document.getElementById('contracts-copy')
  if (copyBtn) copyBtn.disabled = selected.length === 0

  // Update card styles
  document.querySelectorAll('.contract-card').forEach((card) => {
    const id = card.dataset.contractId
    const isSelected = selected.includes(id)
    card.classList.toggle('border-blue-500', isSelected)
    card.classList.toggle('bg-blue-50/50', isSelected)
    card.classList.toggle('dark:bg-blue-900/10', isSelected)
    card.classList.toggle('shadow-sm', isSelected)
    card.classList.toggle('border-[var(--color-border)]', !isSelected)
  })
}

// One contract as paste-ready Markdown: heading + template, no wrapper header
// or footer — so it drops straight into an AGENTS.md / CLAUDE.md.
function contractToMarkdown(contract) {
  const title = getLocalizedField(contract, 'title')
  const template = getLocalizedField(contract, 'template')
  return `## ${title}\n\n${template}`
}

function buildContractsMarkdown(contracts) {
  const selected = getSelectedContracts()
  const filtered = contracts.filter((c) => selected.includes(c.id))

  if (filtered.length === 0) return null

  return filtered.map(contractToMarkdown).join('\n\n') + '\n'
}

async function copyOneContract(contract, btn) {
  try {
    await navigator.clipboard.writeText(contractToMarkdown(contract) + '\n')
    if (!btn) return
    const original = btn.innerHTML
    btn.innerHTML =
      '<svg class="w-4 h-4 pointer-events-none text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
    setTimeout(() => {
      btn.innerHTML = original
    }, 1500)
  } catch {
    // clipboard blocked — ignore
  }
}

function downloadContracts(contracts) {
  const md = buildContractsMarkdown(contracts)
  if (!md) return

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'semantic-contracts.md'
  a.click()
  URL.revokeObjectURL(url)
}

async function copyContracts(contracts) {
  const md = buildContractsMarkdown(contracts)
  if (!md) return

  try {
    await navigator.clipboard.writeText(md)
    const copyBtn = document.getElementById('contracts-copy')
    if (copyBtn) {
      const original = copyBtn.querySelector('span[data-i18n]').textContent
      copyBtn.querySelector('span[data-i18n]').textContent = i18n.t('contracts.copied')
      setTimeout(() => {
        copyBtn.querySelector('span[data-i18n]').textContent = original
      }, 2000)
    }
  } catch {
    // fallback ignored
  }
}
