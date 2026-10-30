import { test, expect } from '@playwright/test'

// Dismiss onboarding modal before all tests
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('onboarding-seen', 'true')
  })
})

test.describe('Homepage - Card Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Semantic Anchors/)
    await expect(page.locator('main h1').first()).toContainText(/No download|Nichts installieren/)
  })

  test('should display header with navigation', async ({ page }) => {
    // Check header elements
    await expect(page.locator('#theme-toggle')).toBeVisible()
    await expect(page.locator('#lang-toggle')).toBeVisible()
    await expect(page.locator('#lang-toggle')).toHaveText('DE')

    // Check navigation links (use .first() to select desktop nav, not mobile)
    await expect(page.locator('a[data-route="/"]').first()).toContainText('Anchors')
    await expect(page.locator('a[data-route="/about"]').first()).toContainText('About')
    await expect(page.locator('a[data-route="/contributing"]').first()).toContainText(
      'Contributing'
    )
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
    // On desktop, search and filter are in the header
    await expect(page.locator('#header-search-input')).toBeVisible()
    await expect(page.locator('#header-role-filter')).toBeVisible()

    // Role filter should have options (wait for data to load)
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    const roleFilter = page.locator('#header-role-filter')
    const options = roleFilter.locator('option')
    await expect(async () => {
      const count = await options.count()
      expect(count).toBeGreaterThan(1)
    }).toPass({ timeout: 10000 })
  })

  test('should filter cards by role', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Count initial cards
    const initialCount = await page.locator('.anchor-card').count()
    expect(initialCount).toBeGreaterThan(0)

    // Select a role (use header filter on desktop)
    await page.selectOption('#header-role-filter', 'software-developer')

    // Some cards should still be visible
    const filteredCount = await page.locator('.anchor-card:visible').count()
    expect(filteredCount).toBeGreaterThan(0)
  })

  test('should filter cards by search query', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Type in search (use header search on desktop)
    await page.fill('#header-search-input', 'TDD')

    // Some cards should be visible with TDD
    const visibleCards = await page.locator('.anchor-card:visible').count()
    expect(visibleCards).toBeGreaterThan(0)

    // Clear search
    await page.fill('#header-search-input', '')

    // All cards should be visible again
    const allCards = await page.locator('.anchor-card:visible').count()
    expect(allCards).toBeGreaterThan(visibleCards)
  })

  test('hides the hero while searching and restores it on clear (#615)', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('#hero')).toBeVisible()

    await page.fill('#header-search-input', 'TDD')
    await expect(page.locator('#hero')).toBeHidden()

    await page.fill('#header-search-input', '')
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('should open anchor modal on card click', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Modal should be hidden initially
    const modal = page.locator('#anchor-modal')
    await expect(modal).toHaveClass(/hidden/)

    // Click first anchor card
    await page.locator('.anchor-card').first().click()

    // Wait for modal to open

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

    const modal = page.locator('#anchor-modal')
    await expect(modal).not.toHaveClass(/hidden/)

    // Click close button
    await page.click('#modal-close')

    // Modal should be hidden
    await expect(modal).toHaveClass(/hidden/)
  })

  test('should close modal with Escape key', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    // Open modal
    await page.locator('.anchor-card').first().click()

    const modal = page.locator('#anchor-modal')
    await expect(modal).not.toHaveClass(/hidden/)

    // Press Escape
    await page.keyboard.press('Escape')

    // Modal should be hidden
    await expect(modal).toHaveClass(/hidden/)
  })

  test('should display edit button on cards', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })

    const firstCard = page.locator('.anchor-card').first()
    const editBtn = firstCard.locator('.anchor-edit-btn')

    await expect(editBtn).toBeVisible()
    await expect(editBtn).toHaveAttribute('href', /^https:\/\/github\.com\/.+\/edit\/.+/)
  })

  test('should display action links', async ({ page }) => {
    // About link is in the More dropdown — open it
    await page.locator('#more-menu-toggle').click()
    const aboutLink = page.locator('a[href="#/about"]').first()
    await expect(aboutLink).toBeVisible()

    const proposeLink = page.locator('a[href*="issues/new"]')
    await expect(proposeLink).toBeVisible()
    await expect(proposeLink).toContainText('Propose New Anchor')
  })
})

test.describe('Search away from the home grid (#615)', () => {
  test('hides the search controls on non-home routes', async ({ page }) => {
    await page.goto('/Semantic-Anchors/about/')
    await page.waitForSelector('#doc-content h1', { timeout: 10000 })
    await expect(page.locator('#header-search-input')).toBeHidden()
    await expect(page.locator('#anchor-count')).toBeHidden()
  })

  test('shows the search controls on the home route', async ({ page }) => {
    await page.goto('/Semantic-Anchors/')
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('#header-search-input')).toBeVisible()
    await expect(page.locator('#anchor-count')).toBeVisible()
  })
})

test.describe('Theme and Language', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should toggle theme', async ({ page }) => {
    const html = page.locator('html')
    const initialClass = await html.getAttribute('class')

    // Click theme toggle
    await page.click('#theme-toggle')

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

    // Language should change
    const newLang = await langToggle.textContent()
    expect(newLang).toBe('EN')
  })

  test('should persist theme across page reloads', async ({ page }) => {
    // Switch to dark mode
    await page.click('#theme-toggle')

    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)

    // Reload page
    await page.reload()

    // Should still be dark
    await expect(html).toHaveClass(/dark/)
  })
})

test.describe('Routing - Documentation Pages', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should navigate to About page', async ({ page }) => {
    // About is in the More dropdown — open it first
    await page.locator('#more-menu-toggle').click()
    await page.locator('a[data-route="/about"]').first().click()

    // URL should update
    expect(page.url()).toContain('/about')

    // Wait for AsciiDoc content to load and check h1 in content area (not header)
    await page.waitForSelector('#doc-content h1', { timeout: 10000 })
    await expect(page.locator('#doc-content h1')).toContainText(/About|What are/)

    // Active nav link should be highlighted
    const aboutLink = page.locator('a[data-route="/about"]').first()
    await expect(aboutLink).toHaveClass(/font-semibold/)
  })

  test('should navigate to Contributing page', async ({ page }) => {
    // Contributing is in the More dropdown — open it first
    await page.locator('#more-menu-toggle').click()
    await page.locator('a[data-route="/contributing"]').first().click()

    // URL should update
    expect(page.url()).toContain('/contributing')

    // Wait for AsciiDoc content to load and check h1 in content area (not header)
    await page.waitForSelector('#doc-content h1', { timeout: 10000 })
    await expect(page.locator('#doc-content h1')).toContainText(/Contributing/)

    // Active nav link should be highlighted
    const contributingLink = page.locator('a[data-route="/contributing"]').first()
    await expect(contributingLink).toHaveClass(/font-semibold/)
  })

  test('should navigate back to Anchors from About', async ({ page }) => {
    // Go to About via More dropdown
    await page.locator('#more-menu-toggle').click()
    await page.locator('a[data-route="/about"]').first().click()

    // Go back to Anchors
    await page.locator('a[data-route="/"]').first().click()

    // URL should be home
    expect(page.url()).toMatch(/\/$|\/Semantic-Anchors\/?$/)

    // Card grid should be visible
    await expect(page.locator('.anchor-card').first()).toBeVisible()

    // Anchors link should be highlighted (use .first() to select desktop nav)
    const anchorsLink = page.locator('a[data-route="/"]').first()
    await expect(anchorsLink).toHaveClass(/font-semibold/)
  })

  test('should handle direct URL to About page', async ({ page }) => {
    await page.goto('/Semantic-Anchors/about')

    // Wait for AsciiDoc content to load and check h1 in content area (not header)
    await page.waitForSelector('#doc-content h1', { timeout: 10000 })
    await expect(page.locator('#doc-content h1')).toContainText(/About|What are/)
  })

  test('should render doc page when visited via trailing-slash URL', async ({ page }) => {
    // GitHub Pages 301-redirects /spec-driven-development → /spec-driven-development/
    // when served as a directory index. The SPA must handle the trailing-slash
    // form or it falls through to the home handler.
    await page.goto('/Semantic-Anchors/spec-driven-development/')

    await page.waitForSelector('#doc-content h1', { timeout: 10000 })
    await expect(page.locator('#doc-content h1')).toContainText(/Spec-Driven Development/i)

    // Card grid (home-only content) must not be rendered on top
    await expect(page.locator('.anchor-card')).toHaveCount(0)
  })

  test('should handle browser back button', async ({ page }) => {
    // Navigate to About via More dropdown
    await page.locator('#more-menu-toggle').click()
    await page.locator('a[data-route="/about"]').first().click()

    // Go back
    await page.goBack()

    // Should be on home
    await expect(page.locator('.anchor-card').first()).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 375, height: 667 })

    // Page should still be visible (heading is h2 in current layout)
    await expect(page.locator('h2').first()).toBeVisible()
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('.anchor-card').first()).toBeVisible()

    // Desktop navigation should be hidden on mobile
    const desktopNav = page.locator('.hidden.sm\\:flex .nav-link').first()
    const isVisible = await desktopNav.isVisible()
    expect(isVisible).toBe(false)
  })

  test('should work on tablet viewport', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 768, height: 1024 })

    await expect(page.locator('h2').first()).toBeVisible()
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('.anchor-card').first()).toBeVisible()

    // Navigation should be visible on tablet+
    await expect(page.locator('.nav-link').first()).toBeVisible()
  })

  test('should work on desktop viewport', async ({ page }) => {
    await page.goto('/')
    await page.setViewportSize({ width: 1920, height: 1080 })

    await expect(page.locator('h2').first()).toBeVisible()
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await expect(page.locator('.anchor-card').first()).toBeVisible()
  })
})

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
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

    // The card itself is not focusable any more (#791): it holds the copy
    // buttons and the edit link, so a button role on the container would
    // expose those as presentational. The title is the primary control.
    const firstCard = page.locator('.anchor-card').first()
    await expect(firstCard).not.toHaveAttribute('role', 'button')

    const opener = firstCard.locator('.anchor-card-open')
    await opener.focus()
    await expect(opener).toBeFocused()

    await page.keyboard.press('Enter')

    const modal = page.locator('#anchor-modal')
    await expect(modal).not.toHaveClass(/hidden/)

    // Space is the other activation a button owes a keyboard user.
    await page.keyboard.press('Escape')
    await expect(modal).toHaveClass(/hidden/)
    await opener.focus()
    await page.keyboard.press('Space')
    await expect(modal).not.toHaveClass(/hidden/)
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check page heading exists (h2 in current layout)
    await expect(page.locator('h2').first()).toBeVisible()

    // Check h3 headings (category headings)
    await page.waitForSelector('.category-section', { timeout: 10000 })
    const h3s = page.locator('.category-heading')
    const count = await h3s.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
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
    const searchInput = page.locator('#header-search-input')
    await searchInput.fill('tdd')
    await expect(searchInput).toHaveAttribute('placeholder', /full-text/, { timeout: 15000 })
  })
})

test.describe('Umbrella Anchors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show umbrella card with stacked visual', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    const umbrellaCard = page.locator('.anchor-card-umbrella')
    await expect(umbrellaCard.first()).toBeVisible()
  })

  test('should not show sub-anchors in main catalog', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    const strategyCard = page.locator('[data-anchor="gof-strategy-pattern"]')
    await expect(strategyCard).toHaveCount(0)
  })

  test('should show sub-anchor list in umbrella modal', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await page.locator('[data-anchor="gof-design-patterns"]').click()
    await page.waitForSelector('.sub-anchor-list', { timeout: 10000 })
    await expect(page.locator('.sub-anchor-item').first()).toBeVisible()
  })

  test('should navigate to sub-anchor and show back button', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await page.locator('[data-anchor="gof-design-patterns"]').click()
    await page.waitForSelector('.sub-anchor-link', { state: 'visible', timeout: 15000 })
    await page.locator('.sub-anchor-link').first().click()
    await expect(page.locator('#modal-back')).toBeVisible({ timeout: 10000 })
  })

  test('should navigate back to umbrella from sub-anchor', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await page.locator('[data-anchor="gof-design-patterns"]').click()
    await page.waitForSelector('.sub-anchor-link', { state: 'visible', timeout: 15000 })
    await page.locator('.sub-anchor-link').first().click()
    await expect(page.locator('#modal-back')).toBeVisible({ timeout: 10000 })
    await page.locator('#modal-back').click()
    await page.waitForSelector('.sub-anchor-list', { timeout: 10000 })
    await expect(page.locator('.sub-anchor-list')).toBeVisible()
  })

  test('should show tier-1 items as greyed out and not clickable', async ({ page }) => {
    await page.waitForSelector('.anchor-card', { timeout: 10000 })
    await page.locator('[data-anchor="gof-design-patterns"]').click()
    await page.waitForSelector('.sub-anchor-list', { timeout: 10000 })
    const tier1Item = page.locator('.sub-anchor-item.tier-1')
    // tier-1 sub-anchors may not exist in current data — if present, they should not be clickable
    const count = await tier1Item.count()
    if (count > 0) {
      await expect(tier1Item.first()).toBeVisible()
      const linkCount = await tier1Item.first().locator('a').count()
      expect(linkCount).toBe(0)
    }
  })
})

test.describe('Category quick-nav', () => {
  // The quick-nav once had one chip per category in a single scrolling row.
  // With 16 chips it no longer fit even at full width, so the row wraps
  // instead of scrolling, and fits on one line on a desktop screen.
  for (const width of [768, 1024, 1280]) {
    test(`never scrolls horizontally at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      await page.goto('/')
      const list = page.locator('.category-nav-list')
      await expect(list).toBeVisible()
      const { scrollWidth, clientWidth } = await list.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      }))
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
    })
  }

  // Swiss Style PoC: the chips became a numbered text index on a column grid,
  // so the claim is a bounded number of rows rather than a single line.
  test('stays within four index rows on a desktop screen', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await expect(page.locator('.category-nav-list')).toBeVisible()
    const tops = await page
      .locator('.category-nav-list > li')
      .evaluateAll((items) => [
        ...new Set(items.map((li) => Math.round(li.getBoundingClientRect().top))),
      ])
    expect(tops.length).toBeLessThanOrEqual(4)
  })

  test('a jump keeps the category heading below the two-row nav', async ({ page }) => {
    // At 900px the chips wrap to two rows, taller than a fixed scroll margin.
    await page.setViewportSize({ width: 900, height: 800 })
    await page.goto('/')
    await expect(page.locator('.category-nav-list')).toBeVisible()
    // Jump instantly, so the check sees the final position, not a frame of
    // the smooth-scroll animation.
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
    await page.locator('.category-nav-link[data-category-link="ux-visual-design"]').click()
    const gap = () =>
      page.evaluate(() => {
        const nav = document.querySelector('.category-nav').getBoundingClientRect()
        const heading = document
          .querySelector('#category-ux-visual-design .category-heading')
          .getBoundingClientRect()
        return Math.round(heading.top - nav.bottom)
      })
    await expect.poll(gap).toBeGreaterThanOrEqual(0)
    // A missing jump would also leave a positive gap; the heading must be on screen.
    await expect(page.locator('#category-ux-visual-design .category-heading')).toBeInViewport()
  })
})

test.describe('Style gallery (#872)', () => {
  test('opens every section with an unlinked original, one link per style tile', async ({
    page,
  }) => {
    await page.goto('/Semantic-Anchors/style-gallery/')
    const sections = page.locator('.style-gallery')
    // Two starting pages: styles on a homepage, design systems on an app page.
    await expect(sections).toHaveCount(2)
    for (const section of await sections.all()) {
      const tiles = section.locator('.imageblock')
      const count = await tiles.count()
      expect(count).toBeGreaterThan(1)
      await expect(tiles.first().locator('a')).toHaveCount(0)
      await expect(section.locator('a')).toHaveCount(count - 1)
    }
  })

  test('the whole tile opens its anchor', async ({ page }) => {
    await page.goto('/Semantic-Anchors/style-gallery/')
    const tile = page.locator('.style-gallery .imageblock').nth(1)
    const href = await tile.locator('.title a').getAttribute('href')
    // Click on the screenshot area; the stretched title link covers it.
    await tile.click({ position: { x: 40, y: 40 } })
    await expect(page).toHaveURL(new RegExp(`${href}/?$`))
  })

  test('the UX category intro links the gallery in the same tab', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('.category-intro a[href="/Semantic-Anchors/style-gallery"]').first()
    await expect(link).toHaveCount(1)
    await expect(link).not.toHaveAttribute('target', /.+/)
  })
})
