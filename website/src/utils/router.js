/**
 * Simple hash-based router for single-page navigation
 */

const routes = new Map()
let currentRoute = null

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
  window.location.hash = '#' + path
}

/**
 * Get current route path
 * @returns {string} Current route path
 */
export function getCurrentRoute() {
  const hash = window.location.hash.slice(1) || '/'
  return hash
}

/**
 * Initialize router and handle hash changes
 */
export function initRouter() {
  // Handle initial route
  handleRoute()

  // Listen for hash changes
  window.addEventListener('hashchange', handleRoute)
}

/**
 * Handle route change
 */
function handleRoute() {
  const path = getCurrentRoute()

  // Check for anchor route (#/anchor/:id)
  if (path.startsWith('/anchor/')) {
    const anchorId = path.replace('/anchor/', '')
    const safeAnchorId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(anchorId) ? anchorId : null
    if (!safeAnchorId) return

    // Navigate to home first
    const homeHandler = routes.get('/')
    if (typeof homeHandler === 'function') {
      currentRoute = '/'
      homeHandler()
    }
    // Then open the anchor modal
    // Import dynamically to avoid circular dependency
    import('../components/anchor-modal.js').then(({ showAnchorDetails }) => {
      showAnchorDetails(safeAnchorId)
    })
    return
  }

  const handler = routes.get(path)

  if (typeof handler === 'function') {
    currentRoute = path
    handler()
  } else {
    // Default to home if route not found
    const homeHandler = routes.get('/')
    if (typeof homeHandler === 'function') {
      currentRoute = '/'
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
