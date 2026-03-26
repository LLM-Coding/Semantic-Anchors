import { i18n } from '../i18n.js'

const STORAGE_KEY = 'selected-contracts'

function esc(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
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
  const lang = i18n.currentLanguage || 'en'
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
        <p class="text-sm text-[var(--color-text-secondary)] mb-6">
          <a href="https://www.linkedin.com/feed/update/urn:li:activity:7438137401019105281/" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline" data-i18n="contracts.linkedinLink">${i18n.t('contracts.linkedinLink')}</a>
        </p>

        <div class="flex items-center gap-4 mb-6">
          <button
            id="contracts-download"
            class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span data-i18n="contracts.download">${i18n.t('contracts.download')}</span>
            <span id="contracts-count" class="rounded-full bg-blue-500 px-2 py-0.5 text-xs">${selectedCount}</span>
          </button>
          <button
            id="contracts-select-all"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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

function renderContractCard(contract, isSelected) {
  const title = getLocalizedField(contract, 'title')
  const description = getLocalizedField(contract, 'description')
  const template = getLocalizedField(contract, 'template')

  const anchorLinks = contract.anchors
    .map(
      (id) =>
        `<a href="#/anchor/${esc(id)}" class="inline-block rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-xs text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors">${esc(id)}</a>`
    )
    .join(' ')

  const templateHtml = template
    .split('\n')
    .map((line) => {
      if (line.startsWith('- ')) {
        return `<span class="text-[var(--color-text-secondary)]">• ${esc(line.slice(2))}</span>`
      }
      return `<span class="font-medium">${esc(line)}</span>`
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
            <h3 class="text-lg font-semibold text-[var(--color-text)] mb-1">${esc(title)}</h3>
            <p class="text-sm text-[var(--color-text-secondary)] mb-3">${esc(description)}</p>
            <div class="rounded-md bg-[var(--color-bg-secondary)] p-3 mb-3 text-sm leading-relaxed">
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

export function initContractsPage(contracts) {
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

  // Card click toggles checkbox
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.contract-card')
    if (!card || e.target.tagName === 'A' || e.target.tagName === 'INPUT') return
    const checkbox = card.querySelector('.contract-checkbox')
    if (checkbox) {
      checkbox.checked = !checkbox.checked
      checkbox.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  // Download button
  const downloadBtn = document.getElementById('contracts-download')
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => downloadContracts(contracts))
  }

  // Select all
  const selectAllBtn = document.getElementById('contracts-select-all')
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', () => {
      setSelectedContracts(contracts.map((c) => c.id))
      initContractsPage(contracts)
    })
  }

  // Deselect all
  const deselectAllBtn = document.getElementById('contracts-deselect-all')
  if (deselectAllBtn) {
    deselectAllBtn.addEventListener('click', () => {
      setSelectedContracts([])
      initContractsPage(contracts)
    })
  }

  updateUI(contracts)
}

function updateUI() {
  const selected = getSelectedContracts()
  const countEl = document.getElementById('contracts-count')
  if (countEl) countEl.textContent = selected.length

  const downloadBtn = document.getElementById('contracts-download')
  if (downloadBtn) downloadBtn.disabled = selected.length === 0

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

function downloadContracts(contracts) {
  const selected = getSelectedContracts()
  const lang = i18n.currentLanguage || 'en'
  const filtered = contracts.filter((c) => selected.includes(c.id))

  if (filtered.length === 0) return

  let md = '# Semantic Contracts\n\n'
  md +=
    lang === 'de'
      ? 'Füge dies zu deiner AGENTS.md oder CLAUDE.md hinzu.\n\n'
      : 'Add this to your AGENTS.md or CLAUDE.md.\n\n'

  for (const c of filtered) {
    const title = getLocalizedField(c, 'title')
    const template = getLocalizedField(c, 'template')
    md += `## ${title}\n\n${template}\n\n`
  }

  md += '---\n'
  md +=
    lang === 'de'
      ? 'Generiert von https://llm-coding.github.io/Semantic-Anchors/#/contracts\n'
      : 'Generated from https://llm-coding.github.io/Semantic-Anchors/#/contracts\n'

  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'semantic-contracts.md'
  a.click()
  URL.revokeObjectURL(url)
}
