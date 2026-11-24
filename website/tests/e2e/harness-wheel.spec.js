import { test, expect } from '@playwright/test'

/*
 * #743: the wheel kept its state only in localStorage, so a project could not
 * link to "our wheel" and an iframe embed always started empty — third-party
 * localStorage is partitioned, so pre-seeding it does not work either.
 */

const WHEEL = '/Semantic-Anchors/harness-coverage-wheel.html'
const checkbox = (page, id) => page.locator(`li[data-id="${id}"] input[type="checkbox"]`)
const naToggle = (page, id) => page.locator(`li[data-id="${id}"] .na-toggle`)
const coverage = (page) => page.locator('#cnum')

test.describe('harness wheel — state travels in the URL', () => {
  test('a URL with a tier and a layer list restores exactly that selection', async ({ page }) => {
    await page.goto(`${WHEEL}?tier=2#on=compiler,unit-tests,smoke-tests`)

    await expect(checkbox(page, 'compiler')).toBeChecked()
    await expect(checkbox(page, 'unit-tests')).toBeChecked()
    await expect(checkbox(page, 'smoke-tests')).toBeChecked()
    await expect(checkbox(page, 'type-checker')).not.toBeChecked()
    await expect(page.locator('#tiers button[data-tier="2"]')).toHaveClass(/active/)
  })

  /*
   * A shared link set the tier variable and highlighted the button, but nothing
   * greyed out: applyTier() ran only from the click handler and from render(),
   * never during init. The original test asserted the button's `active` class,
   * which is a claim about the control and not about the wheel — so the defect
   * passed. This asserts the effect instead.
   */
  test('a tier in the URL actually dims the out-of-scope layers', async ({ page }) => {
    await page.goto(`${WHEEL}?tier=1`)

    await expect(page.locator('#tiers button[data-tier="1"]')).toHaveClass(/active/)
    // mintier 2 and above are out of scope at tier 1 and must be dimmed
    await expect(page.locator('li[data-id="unit-tests"]')).toHaveClass(/dim/)
    await expect(page.locator('li[data-id="mutation-testing"]')).toHaveClass(/dim/)
    // mintier 1 stays in scope
    await expect(page.locator('li[data-id="compiler"]')).not.toHaveClass(/dim/)
    // and the wheel's own dots carry it too, not just the list
    expect(await page.locator('.dot.dim').count()).toBeGreaterThan(0)
  })

  /*
   * The dim rule is an invariant, not four separate facts: an item is dimmed
   * exactly when its mintier exceeds the selected tier. Asserting it over the
   * whole supported range, and over every item rather than two hand-picked
   * ones, is what makes it a guard instead of an example. ("By size" is the
   * documented exception — there out-of-scope dots are dropped, not dimmed —
   * so this stays in the default width.)
   *
   * Noted from running these against the unfixed code: tiers 1-3 fail there,
   * tier 4 passes. At tier 4 nothing has a mintier above it, so the invariant
   * holds vacuously — that case documents the range, it cannot catch this bug.
   */
  for (const tier of ['1', '2', '3', '4']) {
    test(`tier ${tier} dims exactly the layers above it`, async ({ page }) => {
      await page.goto(`${WHEEL}?tier=${tier}`)
      await expect(page.locator('#tiers button[data-tier="1"]')).toBeVisible()

      const wrong = await page.evaluate((t) => {
        const bad = []
        document.querySelectorAll('li[data-mintier]').forEach((li) => {
          const shouldDim = +li.dataset.mintier > +t
          if (li.classList.contains('dim') !== shouldDim) {
            bad.push(`${li.dataset.id} mintier=${li.dataset.mintier} dim=${li.classList.contains('dim')}`)
          }
        })
        return bad
      }, tier)

      expect(wrong).toEqual([])
      // the wheel's dots carry the same verdict as the list
      const dimmedItems = await page.locator('li[data-mintier].dim').count()
      const dimmedDots = await page.locator('.dot.dim').count()
      expect(dimmedDots).toBe(dimmedItems)
    })
  }

  /*
   * The bug this file guards against lived in the init path, and a stored tier
   * takes that same path without any URL. Every other test here passes a tier
   * in the URL, so the localStorage branch of readUrlState() was never executed
   * — a regression there would go unseen.
   */
  test('a tier restored from localStorage dims too, with no tier in the URL', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'harness-wheel-v1',
        JSON.stringify({ ids: ['compiler'], na: [], tier: '1', width: 'eq', view: 'harness' })
      )
    })
    await page.goto(WHEEL)

    await expect(page.locator('#tiers button[data-tier="1"]')).toHaveClass(/active/)
    await expect(page.locator('li[data-id="unit-tests"]')).toHaveClass(/dim/)
    await expect(page.locator('li[data-id="compiler"]')).not.toHaveClass(/dim/)
  })

  test('the URL wins over a differing localStorage state', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'harness-wheel-v1',
        JSON.stringify({ ids: ['formatter', 'type-checker'], tier: '4' })
      )
    })
    await page.goto(`${WHEEL}?tier=2#on=compiler`)

    await expect(checkbox(page, 'compiler')).toBeChecked()
    await expect(checkbox(page, 'formatter')).not.toBeChecked()
    await expect(checkbox(page, 'type-checker')).not.toBeChecked()
    await expect(page.locator('#tiers button[data-tier="2"]')).toHaveClass(/active/)
  })

  test('Copy link yields a URL that restores the state in a fresh profile', async ({
    page,
    context,
    browser,
  }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(WHEEL)
    await page.locator('#btnClear').click()
    await checkbox(page, 'compiler').check()
    await checkbox(page, 'unit-tests').check()
    await page.locator('#tiers button[data-tier="2"]').click()

    await page.locator('#btnCopyLink').click()
    const url = await page.evaluate(() => navigator.clipboard.readText())
    expect(url).toContain('compiler')
    expect(url).toContain('tier=2')

    // A fresh context has no localStorage, so only the URL can carry the state.
    const fresh = await browser.newContext()
    const other = await fresh.newPage()
    await other.goto(url)
    await expect(checkbox(other, 'compiler')).toBeChecked()
    await expect(checkbox(other, 'unit-tests')).toBeChecked()
    await expect(checkbox(other, 'formatter')).not.toBeChecked()
    await expect(other.locator('#tiers button[data-tier="2"]')).toHaveClass(/active/)
    await fresh.close()
  })
})

test.describe('harness wheel — not applicable is not a gap', () => {
  test('a not-applicable layer leaves the denominator instead of counting as missing', async ({
    page,
  }) => {
    // Two of three in scope is 67%; marking the uncovered one not-applicable
    // makes it two of two, because a layer that cannot apply is not a gap.
    await page.goto(`${WHEEL}?tier=1#on=compiler,type-checker`)
    const before = await coverage(page).textContent()

    await naToggle(page, 'formatter').click()
    const after = await coverage(page).textContent()

    expect(parseInt(after, 10)).toBeGreaterThan(parseInt(before, 10))
    await expect(page.locator('li[data-id="formatter"]')).toHaveClass(/na/)
    await expect(naToggle(page, 'formatter')).toHaveAttribute('aria-pressed', 'true')
  })

  test('not-applicable survives a Copy link round trip', async ({ page, context, browser }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(`${WHEEL}?tier=2#on=compiler&na=formatter`)
    await expect(page.locator('li[data-id="formatter"]')).toHaveClass(/na/)

    await page.locator('#btnCopyLink').click()
    const url = await page.evaluate(() => navigator.clipboard.readText())
    expect(url).toContain('na=formatter')

    const fresh = await browser.newContext()
    const other = await fresh.newPage()
    await other.goto(url)
    await expect(other.locator('li[data-id="formatter"]')).toHaveClass(/na/)
    await expect(checkbox(other, 'compiler')).toBeChecked()
    await fresh.close()
  })
})

/*
 * The wheel says which layers a harness has; it does not teach them. Layers
 * with a matching practice on "Learning how to verify" link there instead of
 * repeating its explanations and simulators.
 */
test.describe('harness wheel — learning links', () => {
  const BASE = 'https://ewatch.github.io/learning-how-to-verify/en/practices/'
  const MAPPING = {
    compiler: ['type-systems'],
    'type-checker': ['type-systems'],
    linter: ['lint'],
    'unit-tests': ['unit-tests'],
    'property-based-fuzz': ['property-based-tests', 'fuzz-tests'],
    'mutation-testing': ['mutation-tests'],
    'integration-tests': ['integration-tests'],
    'contract-tests': ['contract-tests'],
    'bdd-acceptance-tests': ['acceptance-tests'],
    'end-to-end-ui': ['e2e-tests'],
    'snapshot-visual-regression': ['snapshot-tests'],
    'performance-benchmark': ['performance-tests', 'benchmark-tests'],
    'smoke-tests': ['smoke-tests'],
    'test-integrity': ['test-integrity'],
    'agent-evals': ['evals'],
    'secret-scanning': ['security-scanning'],
    sca: ['security-scanning'],
    sast: ['security-scanning'],
    'threat-modeling': ['threat-modeling'],
    'code-review': ['code-review'],
    'archunit-dependency-cruiser': ['architecture'],
    'config-validation': ['config-tests'],
    'runtime-assertions-invariants': ['contracts'],
    'distributed-tracing': ['tracing'],
    'canary-progressive-delivery': ['canarying'],
    'observability-gates': ['monitoring'],
    'chaos-engineering': ['chaos-testing'],
    'feature-flags': ['feature-flags'],
    'formal-verification': ['formal-verification'],
    'model-checker': ['formal-verification'],
  }

  test('each mapped layer links to its practices, and no other layer does', async ({ page }) => {
    await page.goto(WHEEL)
    const actual = await page.evaluate(() => {
      const out = {}
      document.querySelectorAll('#inv li .learn a').forEach((a) => {
        const id = a.closest('li').dataset.id
        ;(out[id] ||= []).push(a.getAttribute('href'))
      })
      return out
    })
    const expected = Object.fromEntries(
      Object.entries(MAPPING).map(([id, slugs]) => [id, slugs.map((s) => `${BASE}${s}/`)])
    )
    expect(actual).toEqual(expected)
  })

  test('the link is visible in the layer dialog', async ({ page }) => {
    await page.goto(WHEEL)
    await page.locator('li[data-id="mutation-testing"] .name').click()
    await expect(page.locator('#mBody .learn a')).toBeVisible()
  })

  test('test integrity is part of the pragmatic minimum, agent evals are not', async ({ page }) => {
    await page.goto(WHEEL)
    await page.locator('#btnMin').click()
    await expect(checkbox(page, 'test-integrity')).toBeChecked()
    await expect(checkbox(page, 'agent-evals')).not.toBeChecked()
  })
})
