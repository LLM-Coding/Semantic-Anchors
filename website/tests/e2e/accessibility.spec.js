import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

// axe checks the full WCAG rule set in every pull request, including
// interactive states (open modal, active filter, dark mode). Lighthouse
// covers performance and SEO against the deployed site after merge.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('onboarding-seen', 'true')
  })
})

// Known violations, each excluded for one rule on one selector only and
// tracked in an issue. Remove the entry when the issue is fixed.
const KNOWN_VIOLATIONS = [
  // Cards are role="button" and contain copy buttons and the edit link.
  // https://github.com/LLM-Coding/Semantic-Anchors/issues/791
  { rule: 'nested-interactive', selector: '.anchor-card' },
]

// Drops nodes covered by KNOWN_VIOLATIONS and reports which entries matched.
// Matching runs in one page round trip, because the catalog yields one node
// per card.
async function withoutKnown(page, violations) {
  const checks = violations.flatMap((v) =>
    v.nodes.map((node) => ({
      target: node.target.length === 1 ? node.target[0] : null,
      selectors: KNOWN_VIOLATIONS.map((k) => (k.rule === v.id ? k.selector : null)),
    }))
  )
  // For each node: index of the matching KNOWN_VIOLATIONS entry, or -1.
  const hits = await page.evaluate(
    (items) =>
      items.map(({ target, selectors }) => {
        const el = target && document.querySelector(target)
        return el ? selectors.findIndex((s) => s !== null && el.matches(s)) : -1
      }),
    checks
  )
  let i = 0
  const remaining = violations
    .map((v) => ({ ...v, nodes: v.nodes.filter(() => hits[i++] === -1) }))
    .filter((v) => v.nodes.length > 0)
  return { remaining, matched: new Set(hits.filter((h) => h !== -1)) }
}

// Fails on any violation not covered by KNOWN_VIOLATIONS. Returns the known
// entries that did not occur, so a test can flag exclusions gone stale.
async function expectNoViolations(page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const { remaining, matched } = await withoutKnown(page, results.violations)
  const summary = remaining.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
  return KNOWN_VIOLATIONS.filter((_, idx) => !matched.has(idx))
}

async function openCatalog(page, path = '/') {
  await page.goto(path)
  await page.waitForSelector('.anchor-card', { timeout: 10000 })
}

test.describe('Accessibility (axe)', () => {
  // A full scan of the catalog (one card per anchor) takes 10-15 s on its
  // own and longer when workers share the CPU, so the default 30 s is tight.
  test.describe.configure({ timeout: 90_000 })

  test('catalog home page', async ({ page }) => {
    await openCatalog(page)
    const unused = await expectNoViolations(page)
    // The catalog shows every known violation; one that no longer occurs is
    // fixed, so its KNOWN_VIOLATIONS entry must go.
    expect(unused, 'known violation no longer occurs, remove its entry').toEqual([])
  })

  test('open anchor modal', async ({ page }) => {
    await openCatalog(page)
    await page.locator('.anchor-card').first().click()
    await expect(page.locator('#modal-content')).toBeVisible()
    await expectNoViolations(page)
  })

  test('active search and role filter', async ({ page }) => {
    await openCatalog(page)
    await page.fill('#header-search-input', 'test')
    await page.selectOption('#header-role-filter', 'software-developer')
    // Searching hides the hero; the filter must leave fewer cards visible.
    await expect(page.locator('#hero')).toBeHidden()
    const total = await page.locator('.anchor-card').count()
    await expect(async () => {
      const visible = await page.locator('.anchor-card:visible').count()
      expect(visible).toBeGreaterThan(0)
      expect(visible).toBeLessThan(total)
    }).toPass({ timeout: 10000 })
    await expectNoViolations(page)
  })

  test('dark mode', async ({ page }) => {
    await openCatalog(page)
    await page.click('#theme-toggle')
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expectNoViolations(page)
  })

  test('dark mode with open anchor modal', async ({ page }) => {
    await openCatalog(page)
    await page.click('#theme-toggle')
    await expect(page.locator('html')).toHaveClass(/dark/)
    await page.locator('.anchor-card').first().click()
    await expect(page.locator('#modal-content')).toBeVisible()
    await expectNoViolations(page)
  })

  test('documentation page', async ({ page }) => {
    await page.goto('/Semantic-Anchors/about/')
    await expect(page.locator('#doc-content h1')).toBeVisible()
    await expectNoViolations(page)
  })

  test('German catalog', async ({ page }) => {
    await openCatalog(page, '/Semantic-Anchors/de/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expectNoViolations(page)
  })
})
