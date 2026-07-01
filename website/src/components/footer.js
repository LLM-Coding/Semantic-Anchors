import { i18n } from '../i18n.js'

export function renderFooter(version) {
  return `
    <footer class="border-t border-[var(--color-border)] bg-[var(--color-bg)] transition-colors duration-300">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center gap-2">
          <div class="flex flex-wrap items-center justify-center gap-4">
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
              href="${import.meta.env.BASE_URL}llms.txt"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.llmsTxt"
              title="LLM-readable full reference"
            >${i18n.t('footer.llmsTxt')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="${import.meta.env.BASE_URL}all-anchors"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.allAnchors"
            >${i18n.t('footer.allAnchors')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="${import.meta.env.BASE_URL}rejected-proposals"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.rejectedProposals"
            >${i18n.t('footer.rejectedProposals')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="${import.meta.env.BASE_URL}evaluations"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.evaluations"
            >${i18n.t('footer.evaluations')}</a>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.github"
            >${i18n.t('footer.github')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="https://lexler.github.io/augmented-coding-patterns/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              data-i18n="footer.augmentedPatterns"
            >${i18n.t('footer.augmentedPatterns')}</a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <span class="text-xs text-[var(--color-text-secondary)]">v${version}</span>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span class="text-xs text-[var(--color-text-secondary)]" data-i18n="footer.asSeenOn">${i18n.t('footer.asSeenOn')}</span>
            <a
              href="https://www.youtube.com/watch?v=rQj-B3VTx48"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              title="${i18n.t('footer.hmzeAlt')}"
            >
              <img
                src="${import.meta.env.BASE_URL}hmze-logo.png"
                alt="HMZE Podcast"
                width="28"
                height="24"
                class="h-6 w-auto"
                loading="lazy"
              />
              <span class="text-xs text-[var(--color-text-secondary)]">HMZE (DE)</span>
            </a>
            <span class="text-gray-300 dark:text-gray-600">|</span>
            <a
              href="https://rabauer.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              title="${i18n.t('footer.rabauerAlt')}"
            >
              <img
                src="${import.meta.env.BASE_URL}rabauer-logo.png"
                alt="rabauer.dev"
                width="24"
                height="24"
                class="h-6 w-auto"
                loading="lazy"
              />
              <span class="text-xs text-[var(--color-text-secondary)]">rabauer.dev (EN)</span>
            </a>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span class="text-xs text-[var(--color-text-secondary)]" data-i18n="footer.featuredIn">${i18n.t('footer.featuredIn')}</span>
            <a
              href="https://www.heise.de/news/Semantische-Anker-verkuerzen-den-Kontext-fuer-das-agentische-Coden-11311061.html"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity rounded bg-white px-1.5 py-0.5"
              title="${i18n.t('footer.heiseAlt')}"
            >
              <img
                src="${import.meta.env.BASE_URL}heise-logo.svg"
                alt="heise online"
                width="24"
                height="21"
                class="h-5 w-auto"
                loading="lazy"
              />
              <span class="text-xs text-gray-700">heise online (DE)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `
}
