import { i18n } from '../i18n.js'

export function renderMain() {
  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[var(--color-text)] mb-2" data-i18n="main.heading">
            ${i18n.t('main.heading')}
          </h2>
          <p class="text-[var(--color-text-secondary)] mb-4" data-i18n="main.subheading">
            ${i18n.t('main.subheading')}
          </p>
          <div class="flex flex-wrap gap-3 text-sm">
            <a
              href="#/about"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              About
            </a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors/issues/new?template=propose-anchor.yml"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Propose New Anchor
            </a>
          </div>
        </section>

        <section id="filters" class="mb-6 flex flex-wrap gap-3">
          <input
            id="search-input"
            type="search"
            data-i18n-placeholder="search.placeholder"
            placeholder="${i18n.t('search.placeholder')}"
            class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors duration-300"
          />
          <select
            id="role-filter"
            class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors duration-300"
          >
            <option value="" data-i18n="filter.allRoles">${i18n.t('filter.allRoles')}</option>
          </select>
        </section>

        <div id="main-content"></div>
      </div>
    </main>
  `
}
