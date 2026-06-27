import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { injectInto } from './generate-jsonld.js'

// The tag must carry SET_ID (the catalog @id) for the idempotency check to fire.
const TAG =
  '<script type="application/ld+json">{"@id":"https://llm-coding.github.io/Semantic-Anchors/#catalog"}</script>'

describe('injectInto', () => {
  let dir
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jsonld-'))
  })
  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('returns false for a missing file (no existsSync TOCTOU)', () => {
    expect(injectInto(path.join(dir, 'nope.html'), TAG)).toBe(false)
  })

  it('injects the tag before </head> and returns true', () => {
    const f = path.join(dir, 'index.html')
    fs.writeFileSync(f, '<html><head><title>x</title></head><body></body></html>')
    expect(injectInto(f, TAG)).toBe(true)
    const out = fs.readFileSync(f, 'utf-8')
    expect(out).toContain('application/ld+json')
    expect(out.indexOf(TAG)).toBeLessThan(out.indexOf('</head>'))
  })

  it('is idempotent — a second call does not inject again', () => {
    const f = path.join(dir, 'index.html')
    fs.writeFileSync(f, '<html><head></head></html>')
    expect(injectInto(f, TAG)).toBe(true)
    expect(injectInto(f, TAG)).toBe(false)
    const out = fs.readFileSync(f, 'utf-8')
    expect(out.match(/application\/ld\+json/g)).toHaveLength(1)
  })

  it('returns false when there is no </head>', () => {
    const f = path.join(dir, 'frag.html')
    fs.writeFileSync(f, '<div>no head here</div>')
    expect(injectInto(f, TAG)).toBe(false)
  })
})
