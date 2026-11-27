#!/usr/bin/env node
/**
 * Generate docs/style-gallery.adoc and docs/style-gallery.de.adoc (#872) from the
 * anchors that carry an `:example-screenshot:`, grouped by `:example-page:`. Part
 * of `npm run generate`, which runs before render-docs in every build. The
 * output is not committed (see .gitignore).
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
