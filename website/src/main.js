import './styles/main.css'
import { i18n, applyTranslations } from './i18n.js'
import { initTheme, toggleTheme, currentTheme } from './theme.js'
import { renderHeader } from './components/header.js'
import { renderMain } from './components/main-content.js'
import { renderFooter } from './components/footer.js'
import {
  renderCardGrid,
  initCardGrid,
  applyCardFilters,
  updateAnchorCount,
} from './components/card-grid.js'
import { fetchData } from './utils/data-loader.js'
import { buildSearchIndex, isIndexReady, isIndexBuilding } from './utils/search-index.js'
import { initRouter, addRoute } from './utils/router.js'
import { renderDocPage, loadDocContent } from './components/doc-page.js'

const APP_VERSION = '0.4.0'

window.copyAnchorLink = async function copyAnchorLink(anchorId) {
  const url = `${window.location.origin}${window.location.pathname}#/anchor/${anchorId}`

  try {
    await navigator.clipboard.writeText(url)
    window.showToast(i18n.t('card.linkCopied'))
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

window.showToast = function showToast(message) {
  const toast = document.createElement('div')
  toast.className =
    'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in'
  toast.textContent = message

  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('animate-fade-out')
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}

let appData = null
let dataLoadingPromise = null
let searchIndexTriggered = false
let anchorModalModulePromise = null

function getAnchorModalModule() {
  if (!anchorModalModulePromise) {
    anchorModalModulePromise = import('./components/anchor-modal.js')
  }
  return anchorModalModulePromise
}

function ensureDataLoaded() {
  if (appData) return Promise.resolve(appData)

  if (!dataLoadingPromise) {
    dataLoadingPromise = fetchData()
      .then((data) => {
        appData = data
        return data
      })
      .catch((error) => {
        dataLoadingPromise = null
        throw error
      })
  }

  return dataLoadingPromise
}

function triggerSearchIndexBuild() {
  if (!appData || searchIndexTriggered || isIndexReady() || isIndexBuilding()) return

  searchIndexTriggered = true
  buildSearchIndex(appData.anchors)
    .then(() => {
      const searchInput = document.getElementById('search-input')
      if (searchInput) {
        searchInput.placeholder = `${i18n.t('search.placeholder')} (full-text)`
      }
    })
    .catch((err) => {
      console.warn('Search index build failed:', err)
      searchIndexTriggered = false
    })
}

function initApp() {
  i18n.init()
  initTheme()
  getAnchorModalModule().then(({ createModal }) => createModal())

  addRoute('/', renderHomePage)
  addRoute('/about', renderAboutPage)
  addRoute('/contributing', renderContributingPage)

  const app = document.querySelector('#app')
  if (!app) return

  app.innerHTML = `
    ${renderHeader()}
    <div id="page-content"></div>
    ${renderFooter(APP_VERSION)}
  `

  applyTranslations()
  updateThemeIcon()
  bindThemeToggle()
  bindLanguageToggle()
  bindMobileMenu()
  updateActiveNavLink()

  initRouter()

  ensureDataLoaded().catch((err) => {
    console.error('Failed to load app data:', err)
  })
}

function renderHomePage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderMain()
  updateActiveNavLink()
  bindAnchorSelection()

  ensureDataLoaded()
    .then(() => {
      initCardGridVisualization()
    })
    .catch((err) => {
      console.error('Failed to initialize home page:', err)
      const container = document.getElementById('main-content')
      if (container) {
        container.innerHTML =
          '<div class="text-red-500 p-8">Failed to load anchors. Please try again later.</div>'
      }
    })
}

function renderAboutPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage('About')
  updateActiveNavLink()
  loadDocContent('docs/about.adoc')
}

function renderContributingPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage('Contributing')
  updateActiveNavLink()
  loadDocContent('CONTRIBUTING.adoc')
}

function updateActiveNavLink() {
  const currentRoute = window.location.hash.slice(1) || '/'
  document.querySelectorAll('.nav-link').forEach((link) => {
    const route = link.dataset.route
    if (route === currentRoute) {
      link.classList.add('font-semibold', 'text-[var(--color-text)]')
      link.classList.remove('text-[var(--color-text-secondary)]')
    } else {
      link.classList.remove('font-semibold', 'text-[var(--color-text)]')
      link.classList.add('text-[var(--color-text-secondary)]')
    }
  })
}

function bindAnchorSelection() {
  document.removeEventListener('anchor-selected', handleAnchorSelection)
  document.addEventListener('anchor-selected', handleAnchorSelection)
}

function handleAnchorSelection(event) {
  const { anchorId } = event.detail
  getAnchorModalModule().then(({ showAnchorDetails }) => showAnchorDetails(anchorId))
}

function initCardGridVisualization() {
  if (!appData) return

  const container = document.getElementById('main-content')
  if (container) {
    container.innerHTML = renderCardGrid(appData.categories, appData.anchors)
  }

  initCardGrid()
  updateAnchorCount(appData.anchors.length, appData.anchors.length)

  bindRoleFilter()
  bindSearchInput()
}

function bindRoleFilter() {
  const roleFilter = document.getElementById('role-filter')
  if (!roleFilter || !appData?.roles) return

  while (roleFilter.options.length > 1) {
    roleFilter.remove(1)
  }

  appData.roles.forEach((role) => {
    const option = document.createElement('option')
    option.value = role.id
    option.textContent = role.name
    roleFilter.appendChild(option)
  })

  roleFilter.onchange = (e) => {
    const searchQuery = document.getElementById('search-input')?.value || ''
    applyCardFilters(e.target.value, searchQuery)
  }
}

function bindSearchInput() {
  const searchInput = document.getElementById('search-input')
  if (!searchInput) return

  searchInput.oninput = (e) => {
    const query = e.target.value
    if (query.trim()) {
      triggerSearchIndexBuild()
    }

    const roleId = document.getElementById('role-filter')?.value || ''
    applyCardFilters(roleId, query)
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

  document.addEventListener('langchange', handleLanguageChange)
}

function handleLanguageChange() {
  const currentRoute = window.location.hash.slice(1) || '/'

  if (currentRoute === '/about') {
    loadDocContent('docs/about.adoc')
  } else if (currentRoute === '/contributing') {
    loadDocContent('CONTRIBUTING.adoc')
  } else if (currentRoute === '/') {
    initCardGridVisualization()
  }

  const modal = document.getElementById('anchor-modal')
  if (modal && !modal.classList.contains('hidden')) {
    const currentAnchor = modal.dataset.currentAnchor
    if (currentAnchor) {
      getAnchorModalModule().then(({ loadAnchorContent }) => loadAnchorContent(currentAnchor))
    }
  }
}

function bindMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu-toggle')
  const mobileMenu = document.getElementById('mobile-menu')

  if (!menuToggle || !mobileMenu) return

  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true'
    menuToggle.setAttribute('aria-expanded', String(!isExpanded))
    mobileMenu.classList.toggle('hidden')
  })

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link')
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false')
      mobileMenu.classList.add('hidden')
    })
  })

  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
      if (!mobileMenu.classList.contains('hidden')) {
        menuToggle.setAttribute('aria-expanded', 'false')
        mobileMenu.classList.add('hidden')
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', initApp)
