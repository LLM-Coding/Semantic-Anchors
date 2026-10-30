import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.join(import.meta.dirname, '..', '..', '..')
const modal = readFileSync(path.join(root, 'website/src/components/anchor-modal.js'), 'utf-8')
const lib = readFileSync(path.join(root, 'scripts/lib/example-image.js'), 'utf-8')

// The modal (browser ESM) and the pre-rendered page (Node CJS) render the same
// figure from two code bases. Their guard and link must stay identical.
function constant(source, name) {
  return source.match(new RegExp(`const ${name} = (.+)`))?.[1].trim()
}

describe('example image: modal and pre-rendered page agree', () => {
  it('accept the same file names', () => {
    expect(constant(modal, 'SAFE_EXAMPLE_IMAGE')).toBeTruthy()
    expect(constant(modal, 'SAFE_EXAMPLE_IMAGE')).toBe(constant(lib, 'SAFE_NAME'))
  })

  it('link to the same gallery page (#872)', () => {
    expect(constant(modal, 'EXAMPLE_GALLERY_PATH')).toBeTruthy()
    expect(constant(modal, 'EXAMPLE_GALLERY_PATH')).toBe(constant(lib, 'GALLERY_PATH'))
  })
})
