import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import path from 'path'
import { standaloneUrl, countDistinctAnchors, SITE_URL } from './lib/llms-standalone.js'

const root = path.join(import.meta.dirname, '..')

describe('standaloneUrl — links in the plain-text export must resolve outside the site', () => {
  it('turns a legacy in-app route into an absolute site URL', () => {
    expect(standaloneUrl('#/prior-tests')).toBe(`${SITE_URL}prior-tests`)
    expect(standaloneUrl('#/anchor/one-way-two-way-door-decisions')).toBe(
      `${SITE_URL}anchor/one-way-two-way-door-decisions`
    )
  })

  it('keeps the fragment of a route', () => {
    expect(standaloneUrl('#/prior-tests#run-2026-11-27')).toBe(
      `${SITE_URL}prior-tests#run-2026-11-27`
    )
  })

  it('turns the bare home route into the site root', () => {
    expect(standaloneUrl('#/')).toBe(SITE_URL)
  })

  it('turns a relative repo document into a GitHub link', () => {
    expect(standaloneUrl('../CONTRIBUTING.adoc')).toBe(
      'https://github.com/LLM-Coding/Semantic-Anchors/blob/main/CONTRIBUTING.adoc'
    )
  })

  it('leaves absolute URLs and same-page fragments alone', () => {
    expect(standaloneUrl('https://example.org/x')).toBe('https://example.org/x')
    expect(standaloneUrl('#section')).toBe('#section')
  })
})

describe('countDistinctAnchors — an anchor in two categories is one term', () => {
  it('counts each anchor id once', () => {
    const categories = [
      { id: 'a', anchors: ['x', 'y'] },
      { id: 'b', anchors: ['y', 'z'] },
    ]
    expect(countDistinctAnchors(categories)).toBe(3)
  })

  it('stays equal to the sum when no anchor is shared', () => {
    const categories = [
      { id: 'a', anchors: ['x'] },
      { id: 'b', anchors: ['y', 'z'] },
    ]
    expect(countDistinctAnchors(categories)).toBe(3)
  })
})

// The generated file is produced by `npm run generate-llms-txt` before the tests
// run in CI (see .github/workflows/test.yml).
describe('generated llms.txt', () => {
  const llms = readFileSync(path.join(root, 'website/public/llms.txt'), 'utf-8')
  const anchors = JSON.parse(
    readFileSync(path.join(root, 'website/public/data/anchors.json'), 'utf-8')
  )

  it('contains no in-app links that only work inside the site', () => {
    expect(llms).not.toMatch(/\]\(#\//)
  })

  it('states the number of distinct anchors in its header', () => {
    const match = llms.match(/^> (\d+) well-defined terms/m)
    expect(match).not.toBeNull()
    expect(Number(match[1])).toBe(anchors.length)
  })
})
