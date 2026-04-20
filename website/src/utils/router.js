/**
 * History API-based router for single-page navigation
 * Deployed under a base path (e.g., /Semantic-Anchors/)
 */

const routes = new Map()
let currentRoute = null
let routeBeforeModal = null
let scrollBeforeModal = 0

// Base path for GitHub Pages subdirectory deployment
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')

// Page titles for SEO and browser tabs
const ROUTE_TITLES = {
  '/': 'Semantic Anchors — Shared Vocabulary for LLM Communication',
  '/about': 'About — Semantic Anchors',
  '/contracts': 'Semantic Contracts — Semantic Anchors',
  '/workflow': 'Development Workflow — Semantic Anchors',
  '/brownfield': 'Brownfield Workflow — Semantic Anchors',
  '/evaluations': 'Evaluations — Semantic Anchors',
  '/contributing': 'Contributing — Semantic Anchors',
  '/changelog': 'Changelog — Semantic Anchors',
  '/agentskill': 'AgentSkill — Semantic Anchors',
  '/rejected-proposals': 'Rejected Proposals — Semantic Anchors',
  '/all-anchors': 'Full Reference — Semantic Anchors',
}

/**
 * Strip base path from a pathname to get the route
 */
function stripBase(pathname) {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    return pathname.slice(BASE_PATH.length) || '/'
  }
  return pathname || '/'
}

/**
 * Build a full pathname from a route path
 */
function buildPath(route) {
  return BASE_PATH + route
}

/**
 * Register a route handler
 * @param {string} path - Route path (e.g., '/', '/about', '/contributing')
 * @param {Function} handler - Function to call when route is active
 */
export function addRoute(path, handler) {
  routes.set(path, handler)
}

/**
 * Navigate to a specific route
 * @param {string} path - Route path
 */
export function navigate(path) {
  history.pushState(null, '', buildPath(path))
  handleRoute()
}

/**
 * Get current route path
 * @returns {string} Current route path
 */
export function getCurrentRoute() {
  // Support legacy hash URLs for backward compatibility
  if (window.location.hash.startsWith('#/')) {
    return window.location.hash.slice(1)
  }
  return stripBase(window.location.pathname)
}

/**
 * Initialize router and handle navigation
 */
export function initRouter() {
  // Redirect legacy hash URLs to clean URLs
  if (window.location.hash.startsWith('#/')) {
    const route = window.location.hash.slice(1)
    history.replaceState(null, '', buildPath(route))
  }

  // Handle initial route
  handleRoute()

  // Listen for browser back/forward
  window.addEventListener('popstate', handleRoute)

  // Intercept link clicks for SPA navigation
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return

    const href = link.getAttribute('href')

    // Skip external links, new tab links, modifier keys, and non-http links
    if (
      !href ||
      href.startsWith('http') ||
      href.startsWith('mailto:') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return

    // Skip anchor-only links (e.g., #section-heading within a page)
    if (href.startsWith('#') && !href.startsWith('#/')) return

    // Handle legacy hash links (e.g., #/anchor/xxx from rendered AsciiDoc)
    if (href.startsWith('#/')) {
      e.preventDefault()
      history.pushState(null, '', buildPath(href.slice(1)))
      handleRoute()
      return
    }

    // Handle internal route links (e.g., /about, /anchor/xxx)
    if (href.startsWith('/') || href.startsWith(BASE_PATH)) {
      e.preventDefault()
      // Ensure BASE_PATH is prepended for bare routes like /about
      const fullPath = href.startsWith(BASE_PATH) ? href : buildPath(href)
      history.pushState(null, '', fullPath)
      handleRoute()
    }
  })
}

/**
 * Handle route change
 */
function handleRoute() {
  let path = getCurrentRoute()

  // Normalize trailing slash: GitHub Pages 301-redirects /workflow to /workflow/
  // when workflow/index.html is served as a directory index. Without this,
  // routes.get('/workflow/') misses the '/workflow' key and falls through to
  // the home handler.
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }

  // Check for anchor route (/anchor/:id)
  if (path.startsWith('/anchor/')) {
    const anchorId = path.replace('/anchor/', '')
    const safeAnchorId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(anchorId) ? anchorId : null
    if (!safeAnchorId) return

    // Remember the current route and scroll position for restoring after modal close
    routeBeforeModal = currentRoute
    scrollBeforeModal = window.scrollY

    // Only navigate to home if no page is currently rendered
    if (!currentRoute) {
      const homeHandler = routes.get('/')
      if (typeof homeHandler === 'function') {
        currentRoute = '/'
        homeHandler()
      }
    }
    // Restore scroll position
    window.scrollTo(0, scrollBeforeModal)

    // Set title to anchor name
    const readableName = safeAnchorId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    document.title = `${readableName} — Semantic Anchors`

    // Open the anchor modal as overlay on current page
    import('../components/anchor-modal.js').then(({ showAnchorDetails }) => {
      showAnchorDetails(safeAnchorId)
    })
    return
  }

  const handler = routes.get(path)

  if (typeof handler === 'function') {
    currentRoute = path
    document.title = ROUTE_TITLES[path] || 'Semantic Anchors'
    handler()
  } else {
    // Default to home if route not found
    const homeHandler = routes.get('/')
    if (typeof homeHandler === 'function') {
      currentRoute = '/'
      document.title = ROUTE_TITLES['/']
      homeHandler()
    }
  }
}

/**
 * Check if a route is currently active
 * @param {string} path - Route path to check
 * @returns {boolean} True if route is active
 */
export function isActive(path) {
  return currentRoute === path
}

/**
 * Get the route that was active before the anchor modal opened
 * @returns {string|null} Previous route path
 */
export function getRouteBeforeModal() {
  return routeBeforeModal
}

/**
 * Get the scroll position that was active before the anchor modal opened
 * @returns {number} Scroll Y position
 */
export function getScrollBeforeModal() {
  return scrollBeforeModal
}

export { buildPath }
