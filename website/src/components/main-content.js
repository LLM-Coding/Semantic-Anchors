import { i18n } from '../i18n.js'

export function renderMain() {
  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[var(--color-text)] mb-2" data-i18n="main.heading">
            ${i18n.t('main.heading')}
          </h2>
          <p class="text-[var(--color-text-secondary)]" data-i18n="main.subheading">
            ${i18n.t('main.subheading')}
          </p>
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

        <section
          id="treemap-container"
          class="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] transition-colors duration-300"
          style="min-height: 500px; height: calc(100vh - 350px);"
        ></section>
      </div>
    </main>
  `
}
