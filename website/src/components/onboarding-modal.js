import { i18n } from '../i18n.js'

const STORAGE_KEY = 'onboarding-seen'
const YOUTUBE_VIDEOS = {
  en: 'Fb7t45E8_HE',
  de: 'cp-qqiHU-MA',
}

export function shouldShowOnboarding() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'true'
  } catch {
    return false
  }
}

export function createOnboardingModal() {
  if (document.getElementById('onboarding-modal')) return

  const modal = document.createElement('div')
  modal.id = 'onboarding-modal'
  modal.className =
    'fixed inset-0 bg-black/30 backdrop-blur-sm z-50 hidden items-center justify-center p-4'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'onboarding-title')

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeOnboarding()
  })

  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return

    if (e.key === 'Escape') {
      closeOnboarding()
      return
    }

    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  })

  document.body.appendChild(modal)
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function buildModalContent() {
  const lang = i18n.currentLang()
  const videoId = YOUTUBE_VIDEOS[lang] || YOUTUBE_VIDEOS.en
  const youtubeUrl = `https://youtube.com/shorts/${videoId}`
  const embedUrl = `https://www.youtube.com/embed/${videoId}`
  const baseUrl = import.meta.env.BASE_URL

  // All text content is from trusted i18n translation files (not user input).
  // The YouTube video IDs are hardcoded constants above.
  const closeLabel = escapeHtml(i18n.t('modal.close'))
  const slogan2 = escapeHtml(i18n.t('onboarding.slogan2'))
  const text1 = escapeHtml(i18n.t('onboarding.text1'))
  const text2 = escapeHtml(i18n.t('onboarding.text2'))
  const text3 = escapeHtml(i18n.t('onboarding.text3'))
  const text4 = escapeHtml(i18n.t('onboarding.text4'))
  const watchVideo = escapeHtml(i18n.t('onboarding.watchVideo'))
  const cta = escapeHtml(i18n.t('onboarding.cta'))

  return `
    <div class="bg-[var(--color-bg)] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[var(--color-border)]">
      <div class="flex justify-end p-3 pb-0">
        <button
          id="onboarding-close"
          class="rounded-full p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors"
          aria-label="${closeLabel}"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="text-center px-6 pb-4">
        <img src="${baseUrl}logo.png" alt="Semantic Anchors" class="h-24 mx-auto mb-3" />
        <h2 id="onboarding-title" class="text-lg font-medium text-[var(--color-text-secondary)]">
          ${slogan2}
        </h2>
      </div>

      <div class="px-6 pb-4">
        <div class="flex flex-col sm:flex-row gap-6">
          <div class="sm:w-1/2 flex-shrink-0 flex items-center justify-center">
            ${
              window.matchMedia('(min-width: 640px)').matches
                ? `
            <div class="rounded-xl overflow-hidden bg-black aspect-[9/16] max-h-[400px] w-full">
              <iframe
                src="${embedUrl}"
                title="${watchVideo}"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            `
                : `
            <a
              href="${youtubeUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-[var(--color-primary)] hover:underline font-medium py-2"
            >
              <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              ${watchVideo}
            </a>
            `
            }
          </div>

          <div class="sm:w-1/2 flex flex-col gap-3 text-[var(--color-text)] text-sm leading-relaxed">
            <p>${text1}</p>
            <p>${text2}</p>
            <p>${text3}</p>
            <p class="font-medium">${text4}</p>
          </div>
        </div>
      </div>

      <div class="px-6 pb-6 flex justify-end">
        <button
          id="onboarding-cta"
          class="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          ${cta}
        </button>
      </div>
    </div>
  `
}

export function showOnboarding() {
  const modal = document.getElementById('onboarding-modal')
  if (!modal) return

  modal.innerHTML = buildModalContent()

  modal.classList.remove('hidden')
  modal.classList.add('flex')
  document.body.style.overflow = 'hidden'

  document.getElementById('onboarding-close')?.addEventListener('click', closeOnboarding)
  document.getElementById('onboarding-cta')?.addEventListener('click', closeOnboarding)
  document.getElementById('onboarding-close')?.focus()
}

export function closeOnboarding() {
  const modal = document.getElementById('onboarding-modal')
  if (!modal) return

  modal.classList.add('hidden')
  modal.classList.remove('flex')
  document.body.style.overflow = ''
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // localStorage may be blocked (private browsing, security settings)
  }
}
