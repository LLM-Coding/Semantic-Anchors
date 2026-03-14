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
import {
  createOnboardingModal,
  showOnboarding,
  shouldShowOnboarding,
} from './components/onboarding-modal.js'

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
      ;['search-input', 'header-search-input'].forEach((id) => {
        const el = document.getElementById(id)
        if (el) el.placeholder = `${i18n.t('search.placeholder')} ${i18n.t('search.fullText')}`
      })
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
  addRoute('/changelog', renderChangelogPage)
  addRoute('/agentskill', renderAgentSkillPage)
  addRoute('/rejected-proposals', renderRejectedProposalsPage)
  addRoute('/all-anchors', renderAllAnchorsPage)
  addRoute('/workflow', renderWorkflowPage)

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
  bindOnboardingButton()
  updateActiveNavLink()

  createOnboardingModal()
  initRouter()

  if (shouldShowOnboarding()) {
    showOnboarding()
  }

  ensureDataLoaded()
    .then(() => {
      populateHeaderRoleFilter()
      bindHeaderSearchInput()
    })
    .catch((err) => {
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

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('docs/about.adoc')
}

function renderContributingPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('CONTRIBUTING.adoc')
}

function renderChangelogPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('docs/changelog.adoc')
}

function renderAgentSkillPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('docs/agentskill.adoc')
}

function renderRejectedProposalsPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('docs/rejected-proposals.adoc')
}

function renderAllAnchorsPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('docs/all-anchors.adoc')
}

function renderWorkflowPage() {
  const pageContent = document.getElementById('page-content')
  if (!pageContent) return

  pageContent.innerHTML = renderDocPage()
  updateActiveNavLink()
  loadDocContent('docs/spec-driven-workflow.adoc')
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
  const roleFilterIds = ['role-filter', 'header-role-filter']

  roleFilterIds.forEach((id) => {
    const roleFilter = document.getElementById(id)
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
      // Sync the other dropdown
      roleFilterIds.forEach((otherId) => {
        if (otherId !== id) {
          const other = document.getElementById(otherId)
          if (other) other.value = e.target.value
        }
      })
      const searchQuery =
        document.getElementById('header-search-input')?.value ||
        document.getElementById('search-input')?.value ||
        ''
      applyCardFilters(e.target.value, searchQuery)
    }
  })
}

function bindSearchInput() {
  const searchInputIds = ['search-input', 'header-search-input']

  searchInputIds.forEach((id) => {
    const searchInput = document.getElementById(id)
    if (!searchInput) return

    searchInput.oninput = (e) => {
      const query = e.target.value
      // Sync the other search input
      searchInputIds.forEach((otherId) => {
        if (otherId !== id) {
          const other = document.getElementById(otherId)
          if (other) other.value = query
        }
      })
      if (query.trim()) {
        triggerSearchIndexBuild()
      }
      const roleId =
        document.getElementById('header-role-filter')?.value ||
        document.getElementById('role-filter')?.value ||
        ''
      applyCardFilters(roleId, query)
    }
  })
}

function populateHeaderRoleFilter() {
  const roleFilter = document.getElementById('header-role-filter')
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
    // Sync the main content dropdown if it exists
    const mainFilter = document.getElementById('role-filter')
    if (mainFilter) mainFilter.value = e.target.value

    const searchQuery = document.getElementById('header-search-input')?.value || ''
    applyCardFilters(e.target.value, searchQuery)
  }
}

function bindHeaderSearchInput() {
  const searchInput = document.getElementById('header-search-input')
  if (!searchInput) return

  searchInput.oninput = (e) => {
    const query = e.target.value
    // Sync the main content search input if it exists
    const mainSearch = document.getElementById('search-input')
    if (mainSearch) mainSearch.value = query

    if (query.trim()) {
      triggerSearchIndexBuild()
    }

    const roleId = document.getElementById('header-role-filter')?.value || ''
    applyCardFilters(roleId, query)
  }
}

function bindThemeToggle() {
  document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      toggleTheme()
      updateThemeIcon()
    })
  })
}

function updateThemeIcon() {
  const isDark = currentTheme() === 'dark'
  const ariaKey = isDark ? 'header.themeToggle.light' : 'header.themeToggle.dark'

  document.querySelectorAll('#theme-icon-moon, #theme-icon-moon-mobile').forEach((el) => {
    el.classList.toggle('hidden', isDark)
  })
  document.querySelectorAll('#theme-icon-sun, #theme-icon-sun-mobile').forEach((el) => {
    el.classList.toggle('hidden', !isDark)
  })
  document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((el) => {
    el.setAttribute('aria-label', i18n.t(ariaKey))
    el.dataset.i18nAria = ariaKey
  })
}

function bindLanguageToggle() {
  document.querySelectorAll('#lang-toggle, #lang-toggle-mobile').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      i18n.toggleLang()
      const label = i18n.currentLang() === 'en' ? 'DE' : 'EN'
      document.querySelectorAll('#lang-toggle, #lang-toggle-mobile').forEach((el) => {
        el.textContent = label
      })
      applyTranslations()
      updateThemeIcon()
    })
  })

  document.addEventListener('langchange', handleLanguageChange)
}

function handleLanguageChange() {
  const currentRoute = window.location.hash.slice(1) || '/'

  if (currentRoute === '/about') {
    loadDocContent('docs/about.adoc')
  } else if (currentRoute === '/contributing') {
    loadDocContent('CONTRIBUTING.adoc')
  } else if (currentRoute === '/changelog') {
    loadDocContent('docs/changelog.adoc')
  } else if (currentRoute === '/agentskill') {
    loadDocContent('docs/agentskill.adoc')
  } else if (currentRoute === '/rejected-proposals') {
    loadDocContent('docs/rejected-proposals.adoc')
  } else if (currentRoute === '/all-anchors') {
    loadDocContent('docs/all-anchors.adoc')
  } else if (currentRoute === '/workflow') {
    loadDocContent('docs/spec-driven-workflow.adoc')
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

function bindOnboardingButton() {
  document.querySelectorAll('#onboarding-info-btn, #onboarding-info-btn-mobile').forEach((btn) => {
    btn.addEventListener('click', () => showOnboarding())
  })
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
