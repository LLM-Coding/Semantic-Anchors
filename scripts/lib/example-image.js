/**
 * Example image for an anchor's detail view (`:example-image:` attribute).
 *
 * Some visual-design anchors carry a screenshot that shows what a model makes of
 * the anchor name alone. The modal renders it client-side; this module renders the
 * same figure into the pre-rendered /anchor/<id> fragments so the image is in the
 * static HTML too. The caption comes from the website translations, so the static
 * page and the modal cannot drift apart.
 */
const fs = require('fs')
const path = require('path')

const BASE = '/Semantic-Anchors/'
const BLOG_URL = 'https://rdmueller.github.io/pages/blog/design-anchors.html'
// A bare file name inside website/public/examples/ — no paths, raster formats only.
const SAFE_NAME = /^[a-z0-9][a-z0-9-]*\.(webp|jpg|jpeg|png)$/

const translationsCache = {}
function translations(lang) {
  const safeLang = lang === 'de' ? 'de' : 'en'
  if (!translationsCache[safeLang]) {
    const file = path.join(
      __dirname,
      '..',
      '..',
      'website',
      'src',
      'translations',
      `${safeLang}.json`
    )
    translationsCache[safeLang] = JSON.parse(fs.readFileSync(file, 'utf-8'))
  }
  return translationsCache[safeLang]
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Asciidoctor hands out document titles with entities (`&amp;`, `&#8217;`).
 * Decode them before escaping, so the alt text never shows `&amp;amp;`.
 */
function decodeEntities(s) {
  return String(s)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function isSafeExampleImage(name) {
  return typeof name === 'string' && SAFE_NAME.test(name)
}

/**
 * Figure HTML for an anchor's example image, or '' when there is none (or the
 * name is not a plain file name), so anchors without the attribute stay unchanged.
 */
function exampleImageHtml(name, title, lang) {
  if (!isSafeExampleImage(name)) return ''
  const tr = translations(lang)
  const alt = tr['anchor.exampleImageAlt'].replace('{title}', decodeEntities(title))
  return (
    `<figure class="anchor-example-image">` +
    `<img src="${BASE}examples/${name}" alt="${escapeHtml(alt)}" width="720" height="900" loading="lazy" decoding="async">` +
    `<figcaption>${escapeHtml(tr['anchor.exampleImageCaption'])} ` +
    `<a href="${BLOG_URL}">${escapeHtml(tr['anchor.exampleImageLink'])}</a></figcaption>` +
    `</figure>\n`
  )
}

module.exports = { exampleImageHtml, isSafeExampleImage, BLOG_URL }
