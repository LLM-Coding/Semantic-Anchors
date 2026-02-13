import { i18n } from '../i18n.js'

export function renderFooter(version) {
  return `
    <footer class="border-t border-[var(--color-border)] bg-[var(--color-bg)] transition-colors duration-300">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p class="text-sm text-[var(--color-text-secondary)]" data-i18n-html="footer.tagline">
            ${i18n.t('footer.tagline')}
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.github"
            >${i18n.t('footer.github')}</a>
            <span class="text-xs text-[var(--color-text-secondary)]">v${version}</span>
          </div>
        </div>
      </div>
    </footer>
  `
}
