#!/usr/bin/env node
/**
 * Generate docs/style-gallery.adoc and docs/style-gallery.de.adoc (#872) from the
 * anchors that carry an `:example-screenshot:`. Run by `npm run build` before
 * render-docs; the committed files are checked against this output by a test.
 */
const fs = require('fs')
const path = require('path')
const { buildStyleGallery } = require('./lib/style-gallery')

const DOCS = path.join(__dirname, '..', 'docs')
for (const [lang, file] of [
  ['en', 'style-gallery.adoc'],
  ['de', 'style-gallery.de.adoc'],
]) {
  fs.writeFileSync(path.join(DOCS, file), buildStyleGallery(lang), 'utf-8')
  console.log(`Generated: docs/${file}`)
}
