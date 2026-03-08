import { i18n } from '../i18n.js'

export function renderHeader() {
  const langLabel = i18n.currentLang() === 'en' ? 'DE' : 'EN'

  return `
    <header class="border-b border-[var(--color-border)] bg-[var(--color-bg)] transition-colors duration-300">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Row 1: Logo + Language/Theme -->
        <div class="flex items-center justify-between py-3">
          <div class="flex items-center gap-2">
            <a href="#/" class="no-underline flex flex-col items-start">
              <img src="${import.meta.env.BASE_URL}logo.png" alt="Semantic Anchors" class="max-h-16 sm:max-h-20" />
              <span class="hidden sm:block text-xs text-[var(--color-text-secondary)] leading-tight" data-i18n="header.slogan">${i18n.t('header.slogan')}</span>
            </a>
            <button
              id="onboarding-info-btn"
              class="rounded-full p-1 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              data-i18n-aria="onboarding.infoButton"
              data-i18n-title="onboarding.infoButton"
              aria-label="${i18n.t('onboarding.infoButton')}"
              title="${i18n.t('onboarding.infoButton')}"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-3">
            <button
              id="lang-toggle"
              class="rounded-md px-2 py-1 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label="Toggle language"
            >${langLabel}</button>
            <button
              id="theme-toggle"
              class="rounded-md p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              data-i18n-aria="header.themeToggle.dark"
              aria-label="Switch to dark mode"
            >
              <svg id="theme-icon-moon" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              <svg id="theme-icon-sun" class="h-5 w-5 hidden" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            </button>
            <button
              id="mobile-menu-toggle"
              class="sm:hidden rounded-md p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
              aria-label="Toggle menu"
              aria-expanded="false"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Row 2: Navigation + Search/Filter (desktop) -->
        <div class="hidden sm:flex items-center justify-between pb-3">
          <div class="flex items-center gap-6 text-2xl">
            <a href="#/" class="nav-link text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors" data-route="/" data-i18n="nav.catalog">${i18n.t('nav.catalog')}</a>
            <a href="#/about" class="nav-link text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors" data-route="/about" data-i18n="nav.about">${i18n.t('nav.about')}</a>
            <a href="#/contributing" class="nav-link text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors" data-route="/contributing" data-i18n="nav.contributing">${i18n.t('nav.contributing')}</a>
          </div>
          <div class="flex items-center gap-3">
            <input
              id="header-search-input"
              type="search"
              data-i18n-placeholder="search.placeholder"
              placeholder="${i18n.t('search.placeholder')}"
              class="w-48 lg:w-72 rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-base text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors duration-300"
            />
            <select
              id="header-role-filter"
              class="rounded-lg border-2 border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-base text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-colors duration-300"
            >
              <option value="" data-i18n="filter.allRoles">${i18n.t('filter.allRoles')}</option>
            </select>
          </div>
        </div>

        <!-- Mobile menu -->
        <div id="mobile-menu" class="hidden sm:hidden mt-3 pb-2 border-t border-[var(--color-border)] pt-3">
          <div class="flex flex-col gap-2">
            <a href="#/" class="nav-link mobile-nav-link px-3 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors" data-route="/" data-i18n="nav.catalog">${i18n.t('nav.catalog')}</a>
            <a href="#/about" class="nav-link mobile-nav-link px-3 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors" data-route="/about" data-i18n="nav.about">${i18n.t('nav.about')}</a>
            <a href="#/contributing" class="nav-link mobile-nav-link px-3 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors" data-route="/contributing" data-i18n="nav.contributing">${i18n.t('nav.contributing')}</a>
          </div>
        </div>
      </nav>
    </header>
  `
}
