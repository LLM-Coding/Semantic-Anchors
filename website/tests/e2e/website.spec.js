import { test, expect } from '@playwright/test'

const WEBSITE_URL = 'https://raifdmueller.github.io/Semantic-Anchors/'

test.describe('Homepage - Card Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL)
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Semantic Anchors/)
    await expect(page.locator('h1')).toContainText('Semantic Anchors')
  })

  test('should display header with navigation', async ({ page }) => {
    // Check header elements
    await expect(page.locator('#theme-toggle')).toBeVisible()
    await expect(page.locator('#lang-toggle')).toBeVisible()
    await expect(page.locator('#lang-toggle')).toHaveText('DE')

    // Check navigation links
    await expect(page.locator('a[data-route="/"]')).toContainText('Catalog')
    await expect(page.locator('a[data-route="/about"]')).toContainText('About')
    await expect(page.locator('a[data-route="/contributing"]')).toContainText('Contributing')
  })

  test('should display card grid with categories', async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('.category-section', { timeout: 10000 })

    // Should have multiple category sections
    const categories = page.locator('.category-section')
    const count = await categories.count()
    expect(count).toBeGreaterThan(0)

    // Each category should have heading with icon
    const firstCategory = categories.first()
    await expect(firstCategory.locator('.category-heading')).toBeVisible()
    await expect(firstCategory.locator('.category-icon')).toBeVisible()

    // Should have anchor cards
    await expect(page.locator('.anchor-card').first()).toBeVisible()
  })

  test('should display search and filter controls', async ({ page }) => {
    await expect(page.locator('#search-input')).toBeVisible()
    await expect(page.locator('#role-filter')).toBeVisible()

    // Role filter should have options
    const roleFilter = page.locator('#role-filter')
    const options = roleFilter.locator('option')
    const count = await options.count()
    expect(count).toBeGreaterThan(1) // At least "All Roles" + 1 role
  })

  test('should filter cards by role', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Count initial cards
    const initialCount = await page.locator('.anchor-card').count()
    expect(initialCount).toBeGreaterThan(0)

    // Select a role
    await page.selectOption('#role-filter', 'software-developer')
    await page.waitForTimeout(500)

    // Some cards should still be visible
    const filteredCount = await page.locator('.anchor-card:visible').count()
    expect(filteredCount).toBeGreaterThan(0)
  })

  test('should filter cards by search query', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Type in search
    await page.fill('#search-input', 'TDD')
    await page.waitForTimeout(500)

    // Some cards should be visible with TDD
    const visibleCards = await page.locator('.anchor-card:visible').count()
    expect(visibleCards).toBeGreaterThan(0)

    // Clear search
    await page.fill('#search-input', '')
    await page.waitForTimeout(500)

    // All cards should be visible again
    const allCards = await page.locator('.anchor-card:visible').count()
    expect(allCards).toBeGreaterThan(visibleCards)
  })

  test('should open anchor modal on card click', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Modal should be hidden initially
    const modal = page.locator('#anchor-modal')
    await expect(modal).toHaveClass(/hidden/)

    // Click first anchor card
    await page.locator('.anchor-card').first().click()

    // Wait for modal to open
    await page.waitForTimeout(1000)

    // Modal should be visible
    await expect(modal).not.toHaveClass(/hidden/)
    await expect(modal.locator('#modal-title')).toBeVisible()
    await expect(modal.locator('#modal-content')).toBeVisible()
    await expect(modal.locator('#modal-close')).toBeVisible()
  })

  test('should close modal with close button', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Open modal
    await page.locator('.anchor-card').first().click()
    await page.waitForTimeout(1000)

    const modal = page.locator('#anchor-modal')
    await expect(modal).not.toHaveClass(/hidden/)

    // Click close button
    await page.click('#modal-close')
    await page.waitForTimeout(500)

    // Modal should be hidden
    await expect(modal).toHaveClass(/hidden/)
  })

  test('should close modal with Escape key', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Open modal
    await page.locator('.anchor-card').first().click()
    await page.waitForTimeout(1000)

    const modal = page.locator('#anchor-modal')
    await expect(modal).not.toHaveClass(/hidden/)

    // Press Escape
    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)

    // Modal should be hidden
    await expect(modal).toHaveClass(/hidden/)
  })

  test('should display edit button on cards', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    const firstCard = page.locator('.anchor-card').first()
    const editBtn = firstCard.locator('.anchor-edit-btn')

    await expect(editBtn).toBeVisible()
    await expect(editBtn).toHaveAttribute('href', /github\.com.*edit/)
  })

  test('should display documentation links', async ({ page }) => {
    // Check for Documentation link
    const docLink = page.locator('a[href*="README.adoc"]')
    await expect(docLink).toBeVisible()
    await expect(docLink).toContainText('Documentation')

    // Check for Propose New Anchor link
    const proposeLink = page.locator('a[href*="issues/new"]')
    await expect(proposeLink).toBeVisible()
    await expect(proposeLink).toContainText('Propose New Anchor')
  })
})

test.describe('Theme and Language', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL)
  })

  test('should toggle theme', async ({ page }) => {
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class')

    // Click theme toggle
    await page.click('#theme-toggle')
    await page.waitForTimeout(500)

    // Theme should have changed
    const newClass = await html.getAttribute('class')
    expect(newClass).not.toBe(initialClass)

    // Should toggle between 'dark' and ''
    const hasDark = newClass?.includes('dark') || initialClass?.includes('dark')
    expect(hasDark).toBe(true)
  })

  test('should toggle language', async ({ page }) => {
    const langToggle = page.locator('#lang-toggle')

    // Initial language
    const initialLang = await langToggle.textContent()
    expect(initialLang).toBe('DE')

    // Click language toggle
    await langToggle.click()
    await page.waitForTimeout(500)

    // Language should change
    const newLang = await langToggle.textContent()
    expect(newLang).toBe('EN')
  })

  test('should persist theme across page reloads', async ({ page }) => {
    // Switch to dark mode
    await page.click('#theme-toggle')
    await page.waitForTimeout(500)

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Reload page
    await page.reload()
    await page.waitForTimeout(500)

    // Should still be dark
    await expect(html).toHaveClass(/dark/)
  })
})

test.describe('Routing - Documentation Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL)
  })

  test('should navigate to About page', async ({ page }) => {
    // Click About link
    await page.click('a[data-route="/about"]')
    await page.waitForTimeout(1000)

    // URL should update
    expect(page.url()).toContain('#/about')

    // About content should be visible
    await expect(page.locator('#doc-content')).toBeVisible()
    await expect(page.locator('h1')).toContainText(/About|What are/)

    // Active nav link should be highlighted
    const aboutLink = page.locator('a[data-route="/about"]')
    await expect(aboutLink).toHaveClass(/font-semibold/)
  })

  test('should navigate to Contributing page', async ({ page }) => {
    // Click Contributing link
    await page.click('a[data-route="/contributing"]')
    await page.waitForTimeout(1000)

    // URL should update
    expect(page.url()).toContain('#/contributing')

    // Contributing content should be visible
    await expect(page.locator('#doc-content')).toBeVisible()
    await expect(page.locator('h1')).toContainText(/Contributing/)

    // Active nav link should be highlighted
    const contributingLink = page.locator('a[data-route="/contributing"]')
    await expect(contributingLink).toHaveClass(/font-semibold/)
  })

  test('should navigate back to Catalog from About', async ({ page }) => {
    // Go to About
    await page.click('a[data-route="/about"]')
    await page.waitForTimeout(1000)

    // Go back to Catalog
    await page.click('a[data-route="/"]')
    await page.waitForTimeout(1000)

    // URL should be home
    expect(page.url()).toMatch(/#\/$|#$/)

    // Card grid should be visible
    await expect(page.locator('.anchor-card').first()).toBeVisible()

    // Catalog link should be highlighted
    const catalogLink = page.locator('a[data-route="/"]')
    await expect(catalogLink).toHaveClass(/font-semibold/)
  })

  test('should handle direct URL to About page', async ({ page }) => {
    // Navigate directly to About
    await page.goto(WEBSITE_URL + '#/about')
    await page.waitForTimeout(1000)

    // About content should be visible
    await expect(page.locator('#doc-content')).toBeVisible()
    await expect(page.locator('h1')).toContainText(/About|What are/)
  })

  test('should handle browser back button', async ({ page }) => {
    // Navigate to About
    await page.click('a[data-route="/about"]')
    await page.waitForTimeout(1000)

    // Go back
    await page.goBack()
    await page.waitForTimeout(1000)

    // Should be on home
    await expect(page.locator('.anchor-card').first()).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.goto(WEBSITE_URL)
    await page.setViewportSize({ width: 375, height: 667 })

    // Page should still be visible
    await expect(page.locator('h1')).toBeVisible()
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('.anchor-card').first()).toBeVisible()

    // Navigation should be hidden on mobile
    const nav = page.locator('.nav-link').first()
    const isVisible = await nav.isVisible()
    expect(isVisible).toBe(false)
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.goto(WEBSITE_URL)
    await page.setViewportSize({ width: 768, height: 1024 })

    await expect(page.locator('h1')).toBeVisible()
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('.anchor-card').first()).toBeVisible()

    // Navigation should be visible on tablet+
    await expect(page.locator('.nav-link').first()).toBeVisible()
  })

  test('should work on desktop viewport', async ({ page }) => {
    await page.goto(WEBSITE_URL)
    await page.setViewportSize({ width: 1920, height: 1080 })

    await expect(page.locator('h1')).toBeVisible()
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('.anchor-card').first()).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL)
  })

  test('should have accessible navigation', async ({ page }) => {
    // Check ARIA labels
    const themeToggle = page.locator('#theme-toggle')
    const ariaLabel = await themeToggle.getAttribute('aria-label')
    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel?.length).toBeGreaterThan(0)
  })

  test('should support keyboard navigation on cards', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Focus first card with Tab
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab') // Skip theme toggle
    await page.keyboard.press('Tab') // Skip lang toggle

    // Card should be focusable
    const firstCard = page.locator('.anchor-card').first()
    await firstCard.focus()

    // Press Enter to open modal
    await page.keyboard.press('Enter')
    await page.waitForTimeout(1000)

    // Modal should open
    const modal = page.locator('#anchor-modal')
    await expect(modal).not.toHaveClass(/hidden/)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check h1 exists
    await expect(page.locator('h1')).toBeVisible()

    // Check h2 headings (category headings)
    const h2s = page.locator('h2')
    const count = await h2s.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(WEBSITE_URL)
  })

  test('should load all required assets', async ({ page }) => {
    // Check for CSS
    const styles = await page.evaluate(() => {
      return Array.from(document.styleSheets).length > 0
    })
    expect(styles).toBe(true)

    // Check for scripts
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).length > 0
    })
    expect(scripts).toBe(true)
  })

  test('should display footer with version', async ({ page }) => {
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // Should contain version number
    await expect(footer).toContainText(/v\d+\.\d+\.\d+/)
  })

  test('should load search index asynchronously', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Wait for search to be ready
    await page.waitForTimeout(3000)

    // Search input placeholder should indicate full-text search
    const searchInput = page.locator('#search-input')
    const placeholder = await searchInput.getAttribute('placeholder')
    expect(placeholder).toContain('full-text')
  })
})
