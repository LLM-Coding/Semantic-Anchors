import { i18n } from '../i18n.js'

export function renderFooter(version) {
  return `
    <footer class="border-t border-[var(--color-border)] bg-[var(--color-bg)] transition-colors duration-300">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p class="text-sm text-[var(--color-text-secondary)]" data-i18n="footer.tagline">
            ${i18n.t('footer.tagline')}
          </p>
          <div class="flex items-center gap-4">
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors"
              data-i18n="footer.leaveStar"
              title="${i18n.t('footer.leaveStar')}"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              ${i18n.t('footer.leaveStar')}
            </a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="llms.txt"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.llmsTxt"
              title="LLM-readable full reference"
            >${i18n.t('footer.llmsTxt')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors/blob/main/docs/all-anchors.adoc"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.allAnchors"
            >${i18n.t('footer.allAnchors')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
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
