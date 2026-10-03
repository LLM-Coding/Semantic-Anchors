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

// Drops nodes covered by KNOWN_VIOLATIONS. Matching runs in one page round
// trip, because the catalog yields one node per card.
async function withoutKnown(page, violations) {
  const checks = violations.flatMap((v) =>
    v.nodes.map((node) => ({
      target: node.target.length === 1 ? node.target[0] : null,
      selectors: KNOWN_VIOLATIONS.filter((k) => k.rule === v.id).map((k) => k.selector),
    }))
  )
  const known = await page.evaluate(
    (items) =>
      items.map(({ target, selectors }) => {
        if (!target || selectors.length === 0) return false
        const el = document.querySelector(target)
        return !!el && selectors.some((s) => el.matches(s))
      }),
    checks
  )
  let i = 0
  return violations
    .map((v) => ({ ...v, nodes: v.nodes.filter(() => !known[i++]) }))
    .filter((v) => v.nodes.length > 0)
}

async function expectNoViolations(page) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze()
  const violations = await withoutKnown(page, results.violations)
  const summary = violations.map((v) => ({
    rule: v.id,
    impact: v.impact,
    help: v.help,
    targets: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
  }))
  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
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
    await expectNoViolations(page)
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
    await expect(page.locator('.anchor-card:visible').first()).toBeVisible()
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
