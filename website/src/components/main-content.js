import { i18n } from '../i18n.js'

const HERO_EXAMPLE_COUNT = 6

export function renderMain() {
  const exIdx = Math.floor(Math.random() * HERO_EXAMPLE_COUNT) + 1
  const keyWithout = `hero.example.${exIdx}.without`
  const keyPrefix = `hero.example.${exIdx}.prefix`
  const keyAnchor = `hero.example.${exIdx}.anchor`
  const keySuffix = `hero.example.${exIdx}.suffix`
  const keyExpansion = `hero.example.${exIdx}.expansion`

  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section id="hero" class="mb-10">
          <h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-3 leading-tight" data-i18n="hero.title">
            ${i18n.t('hero.title')}
          </h1>
          <p class="text-[var(--color-text-secondary)] mb-2 max-w-3xl" data-i18n="hero.intro">
            ${i18n.t('hero.intro')}
          </p>
          <p class="text-[var(--color-text)] font-semibold mb-6 max-w-3xl" data-i18n="hero.introEmphasis">
            ${i18n.t('hero.introEmphasis')}
          </p>

          <div class="grid sm:grid-cols-2 gap-4 mb-3">
            <div class="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
              <div class="text-xs uppercase tracking-wide text-[var(--color-text-secondary)] mb-2 font-semibold" data-i18n="hero.withoutLabel">
                ${i18n.t('hero.withoutLabel')}
              </div>
              <p class="text-sm text-[var(--color-text-secondary)] leading-relaxed font-mono max-h-32 overflow-y-auto pr-2" data-i18n="${keyWithout}">
                ${i18n.t(keyWithout)}
              </p>
            </div>
            <div class="rounded-lg border-2 border-[var(--color-primary)] bg-[var(--color-bg)] p-4">
              <div class="text-xs uppercase tracking-wide text-[var(--color-primary)] mb-2 font-semibold" data-i18n="hero.withAnchorLabel">
                ${i18n.t('hero.withAnchorLabel')}
              </div>
              <p class="text-sm text-[var(--color-text)] leading-relaxed font-mono">
                <span data-i18n="${keyPrefix}">${i18n.t(keyPrefix)}</span><strong data-i18n="${keyAnchor}">${i18n.t(keyAnchor)}</strong><span data-i18n="${keySuffix}">${i18n.t(keySuffix)}</span>
              </p>
            </div>
          </div>
          <p class="text-sm text-[var(--color-text-secondary)] italic mb-8 max-w-3xl" data-i18n="${keyExpansion}">
            ${i18n.t(keyExpansion)}
          </p>

          <h2 class="text-lg font-semibold text-[var(--color-text)] mb-3" data-i18n="hero.howToUseTitle">
            ${i18n.t('hero.howToUseTitle')}
          </h2>
          <ol class="grid sm:grid-cols-3 gap-3 mb-6">
            <li class="flex items-start gap-3 rounded-lg bg-[var(--color-bg-secondary)] p-3">
              <span class="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold">1</span>
              <span class="text-sm text-[var(--color-text)]">
                <strong data-i18n="hero.step1Title">${i18n.t('hero.step1Title')}</strong> <span data-i18n="hero.step1Desc">${i18n.t('hero.step1Desc')}</span>
              </span>
            </li>
            <li class="flex items-start gap-3 rounded-lg bg-[var(--color-bg-secondary)] p-3">
              <span class="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold">2</span>
              <span class="text-sm text-[var(--color-text)]">
                <strong data-i18n="hero.step2Title">${i18n.t('hero.step2Title')}</strong> <span data-i18n="hero.step2Desc">${i18n.t('hero.step2Desc')}</span>
              </span>
            </li>
            <li class="flex items-start gap-3 rounded-lg bg-[var(--color-bg-secondary)] p-3">
              <span class="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold">3</span>
              <span class="text-sm text-[var(--color-text)]">
                <strong data-i18n="hero.step3Title">${i18n.t('hero.step3Title')}</strong> <span data-i18n="hero.step3Desc">${i18n.t('hero.step3Desc')}</span>
              </span>
            </li>
          </ol>

          <div class="flex flex-wrap gap-3 text-sm">
            <a
              href="#/about"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              data-i18n="main.aboutLink"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              ${i18n.t('main.aboutLink')}
            </a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors/issues/new?template=propose-anchor.yml"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              data-i18n="main.proposeAnchor"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              ${i18n.t('main.proposeAnchor')}
            </a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
              data-i18n="main.starGithub"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
              ${i18n.t('main.starGithub')}
            </a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="#filters"
              class="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline ml-auto"
              data-i18n="hero.skipToCatalog"
            >${i18n.t('hero.skipToCatalog')}</a>
          </div>
        </section>

        <section id="filters" class="mb-6 flex flex-wrap gap-3 items-center">
          <input
            id="search-input"
            type="search"
            data-i18n-placeholder="search.placeholder"
            placeholder="${i18n.t('search.placeholder')}"
            class="sm:hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors duration-300"
          />
          <select
            id="role-filter"
            class="sm:hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors duration-300"
          >
            <option value="" data-i18n="filter.allRoles">${i18n.t('filter.allRoles')}</option>
          </select>
          <span id="anchor-count-mobile" class="sm:hidden text-sm text-[var(--color-text-secondary)] ml-auto">
            <span id="visible-count-mobile">0</span> / <span id="total-count-mobile">0</span> <span data-i18n="filter.anchors">${i18n.t('filter.anchors')}</span>
          </span>
        </section>

        <div id="main-content"></div>
      </div>
    </main>
  `
}
