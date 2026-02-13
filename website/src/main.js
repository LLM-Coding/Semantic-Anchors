import './styles/main.css'
import { i18n, applyTranslations } from './i18n.js'
import { initTheme, toggleTheme, currentTheme } from './theme.js'
import { renderHeader } from './components/header.js'
import { renderMain } from './components/main-content.js'
import { renderFooter } from './components/footer.js'
import { initTreemap, updateTreemapByRole } from './components/treemap.js'

const APP_VERSION = '0.2.0'

function initApp() {
  i18n.init()
  initTheme()

  const app = document.querySelector('#app')
  app.innerHTML = `
    ${renderHeader()}
    ${renderMain()}
    ${renderFooter(APP_VERSION)}
  `

  // Initialize i18n and theme
  applyTranslations()
  updateThemeIcon()
  bindThemeToggle()
  bindLanguageToggle()

  // Initialize treemap visualization
  initTreemapVisualization()
}

async function initTreemapVisualization() {
  try {
    const { currentData } = await initTreemap()

    const roleFilter = document.getElementById('role-filter')
    if (roleFilter && currentData.roles) {
      currentData.roles.forEach(role => {
        const option = document.createElement('option')
        option.value = role.id
        option.textContent = role.name
        roleFilter.appendChild(option)
      })

      roleFilter.addEventListener('change', (e) => {
        updateTreemapByRole(e.target.value)
      })
    }
  } catch (err) {
    console.error('Failed to initialize treemap:', err)
  }
}

function bindThemeToggle() {
  const toggle = document.querySelector('#theme-toggle')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    toggleTheme()
    updateThemeIcon()
  })
}

function updateThemeIcon() {
  const moonIcon = document.querySelector('#theme-icon-moon')
  const sunIcon = document.querySelector('#theme-icon-sun')
  const toggle = document.querySelector('#theme-toggle')
  if (!moonIcon || !sunIcon || !toggle) return

  const isDark = currentTheme() === 'dark'
  moonIcon.classList.toggle('hidden', isDark)
  sunIcon.classList.toggle('hidden', !isDark)

  const ariaKey = isDark ? 'header.themeToggle.light' : 'header.themeToggle.dark'
  toggle.setAttribute('aria-label', i18n.t(ariaKey))
  toggle.dataset.i18nAria = ariaKey
}

function bindLanguageToggle() {
  const toggle = document.querySelector('#lang-toggle')
  if (!toggle) return

  toggle.addEventListener('click', () => {
    i18n.toggleLang()
    toggle.textContent = i18n.currentLang() === 'en' ? 'DE' : 'EN'
    applyTranslations()
    updateThemeIcon()
  })
}

document.addEventListener('DOMContentLoaded', initApp)
