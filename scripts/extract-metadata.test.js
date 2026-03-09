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
    expect(strategy.tier).toBe(1)
  })
})
