import en from './translations/en.json'
import de from './translations/de.json'

const translations = { en, de }
const SUPPORTED_LANGS = ['en', 'de']
const DEFAULT_LANG = 'en'

let currentLang = DEFAULT_LANG

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = i18n.t(el.dataset.i18n)
  })
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = i18n.t(el.dataset.i18nHtml)
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = i18n.t(el.dataset.i18nPlaceholder)
  })
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', i18n.t(el.dataset.i18nAria))
  })
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', i18n.t(el.dataset.i18nTitle))
  })
}

export const i18n = {
  init() {
    const saved = localStorage.getItem('lang')
    currentLang = SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG
    document.documentElement.lang = currentLang
  },

  t(key) {
    const dict = translations[currentLang] || translations[DEFAULT_LANG]
    return dict[key] ?? key
  },

  currentLang() {
    return currentLang
  },

  setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) return
    currentLang = lang
    document.documentElement.lang = lang
    localStorage.setItem('lang', lang)
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }))
  },

  toggleLang() {
    this.setLang(currentLang === 'en' ? 'de' : 'en')
  },
}
