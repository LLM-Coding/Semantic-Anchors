import { describe, it, expect } from 'vitest'
import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('extract-metadata', () => {
  it('should extract umbrella, sub-anchors, and tier attributes', () => {
    execFileSync('node', ['scripts/extract-metadata.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    })

    const anchors = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'website', 'public', 'data', 'anchors.json'),
        'utf-8'
      )
    )

    const gof = anchors.find((a) => a.id === 'gof-design-patterns')
    expect(gof).toBeDefined()
    expect(gof.subAnchors).toBeDefined()
    expect(gof.subAnchors.length).toBeGreaterThan(0)
    expect(gof.subAnchors).toContain('gof-strategy-pattern')

    const strategy = anchors.find((a) => a.id === 'gof-strategy-pattern')
    expect(strategy).toBeDefined()
    expect(strategy.umbrella).toBe('gof-design-patterns')
    expect(strategy.tier).toBe(3)
  })

  it('should extract the optional :advisory: attribute', () => {
    execFileSync('node', ['scripts/extract-metadata.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    })

    const anchors = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'website', 'public', 'data', 'anchors.json'),
        'utf-8'
      )
    )

    // Eisenhower Matrix carries an advisory (counter-consensus framing, #624).
    const eisenhower = anchors.find((a) => a.id === 'eisenhower-matrix')
    expect(eisenhower).toBeDefined()
    expect(typeof eisenhower.advisory).toBe('string')
    expect(eisenhower.advisory.length).toBeGreaterThan(0)

    // Anchors without the attribute must not carry an empty advisory field.
    const withoutAdvisory = anchors.find((a) => a.id === 'gof-design-patterns')
    expect(withoutAdvisory).toBeDefined()
    expect(withoutAdvisory.advisory).toBeUndefined()
  })

  it('should extract the optional :example-screenshot: attribute', () => {
    execFileSync('node', ['scripts/extract-metadata.js'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    })

    const anchors = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '..', 'website', 'public', 'data', 'anchors.json'),
        'utf-8'
      )
    )

    const swiss = anchors.find((a) => a.id === 'swiss-style')
    expect(swiss).toBeDefined()
    expect(swiss.exampleImage).toBe('swiss-style.webp')

    // Anchors without the attribute must not carry an empty field.
    const withoutImage = anchors.find((a) => a.id === 'gof-design-patterns')
    expect(withoutImage.exampleImage).toBeUndefined()

    // Every referenced image must ship with the site.
    for (const anchor of anchors.filter((a) => a.exampleImage)) {
      const file = path.join(__dirname, '..', 'website', 'public', 'examples', anchor.exampleImage)
      expect(fs.existsSync(file), `${anchor.id}: ${anchor.exampleImage}`).toBe(true)
    }
  })

  it('never names an attribute so that it reads as an inline image macro', () => {
    // `:example-image: x.webp` contains `image: x.webp`, which the AsciiDoc
    // linter reports as a missing image without alt text.
    const dir = path.join(__dirname, '..', 'docs', 'anchors')
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.adoc'))) {
      const header = fs.readFileSync(path.join(dir, file), 'utf-8').split('\n[')[0]
      expect(header, file).not.toMatch(/^:[\w-]*image:/m)
    }
  })
})
