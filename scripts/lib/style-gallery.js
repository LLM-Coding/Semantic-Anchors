/**
 * Style gallery (#872): one homepage, redesigned once per anchor name.
 *
 * Every anchor with an `:example-screenshot:` gets a tile; the original homepage
 * comes first, so the reader sees the starting point before the variations. The
 * page is generated, never hand-edited: a new screenshot shows up by itself.
 * Output is AsciiDoc, so render-docs and the pre-renderer treat it like any other
 * doc page.
 */
const fs = require('fs')
const path = require('path')
const { exampleImageFor, isSafeExampleImage, BLOG_URL } = require('./example-image')

const ROOT = path.join(__dirname, '..', '..')
const ANCHORS = path.join(ROOT, 'docs', 'anchors')
const BASE = '/Semantic-Anchors/'
const ORIGINAL = 'original-homepage.webp'
// The sessions got the German prompt; the English page shows the translation
// from the blog post and names the original.
const PROMPT = {
  en: 'Redesign this website in the style of {ANCHOR}. Keep the content unchanged.',
  de: 'Gestalte diese Website im Stil von {ANKER} neu. Die Inhalte bleiben unverändert.',
}

const TEXT = {
  en: {
    title: 'Design Styles Compared',
    intro: [
      'One homepage, redesigned once per anchor name. Each version comes from a separate Claude Opus 5.5 session that got the same prompt with only the style name changed:',
      'The sessions got the German original: "Gestalte diese Website im Stil von {ANKER} neu. Die Inhalte bleiben unverändert." No style description, no reference images, one run per anchor, no rerolls; each session checked its own screenshots. The first tile is the original, https://rdmueller.github.io/[rdmueller.github.io] as of 28 October 2026.',
      `How the examples came about, and what stood out in each: ${BLOG_URL}[A Design Style Is a Name Your LLM Already Knows] (Ralf D. Müller, 29 October 2026). Each style tile links to its anchor.`,
      'One run per style shows what the name sets off, not the only possible result. Another run, or another model, will differ in the details.',
    ],
    originalTitle: 'Original',
    originalAlt: 'The original homepage before any redesign',
    alt: (t) => `The homepage redesigned in the style of ${t}`,
  },
  de: {
    title: 'Design-Stile im Vergleich',
    intro: [
      'Eine Homepage, einmal pro Ankername neu gestaltet. Jede Fassung stammt aus einer eigenen Session mit Claude Opus 5.5, die denselben Prompt bekam; nur der Stilname änderte sich:',
      'Keine Stilbeschreibung, keine Referenzbilder, ein Lauf pro Anker, keine Wiederholungen; jede Session prüfte ihre eigenen Screenshots. Die erste Kachel ist das Original, https://rdmueller.github.io/[rdmueller.github.io] mit Stand vom 28. Oktober 2026.',
      `Wie die Beispiele entstanden sind und was jeweils auffiel: ${BLOG_URL}[A Design Style Is a Name Your LLM Already Knows] (Ralf D. Müller, 29. Oktober 2026). Jede Stil-Kachel verlinkt ihren Anker.`,
      'Ein Lauf pro Stil zeigt, was der Name auslöst, nicht das einzig mögliche Ergebnis. Ein weiterer Lauf oder ein anderes Modell weicht in Details ab.',
    ],
    originalTitle: 'Original',
    originalAlt: 'Die ursprüngliche Homepage vor der Neugestaltung',
    alt: (t) => `Die Homepage, neu gestaltet im Stil von ${t}`,
  },
}

/** The anchor title from the first line (`= Title`) of an anchor file. */
function titleOf(file) {
  const first = fs.readFileSync(file, 'utf-8').split('\n')[0]
  return first.replace(/^=\s+/, '').trim()
}

/**
 * Anchors with an example screenshot, sorted by title in the page's language.
 * The image always comes from the English file (validated by extract-metadata);
 * the title comes from the German file on the German page when there is one.
 */
function galleryEntries(lang) {
  return fs
    .readdirSync(ANCHORS)
    .filter((f) => f.endsWith('.adoc') && !f.endsWith('.de.adoc') && !f.startsWith('_'))
    .map((f) => {
      const id = f.replace(/\.adoc$/, '')
      const image = exampleImageFor(path.join(ANCHORS, f))
      if (!isSafeExampleImage(image)) return null
      const de = path.join(ANCHORS, `${id}.de.adoc`)
      const title = titleOf(lang === 'de' && fs.existsSync(de) ? de : path.join(ANCHORS, f))
      return { id, image, title }
    })
    .filter(Boolean)
    .sort((a, b) => a.title.localeCompare(b.title, lang))
}

/**
 * Link text for an AsciiDoc `link:` macro. Besides `]` (ends the macro) and `\`
 * (escapes it), `,` and `=` start attributes, a trailing `^` means "new tab" and
 * `*`, `_`, `` ` ``, `#`, `+`, `~` format text. Every character outside a small
 * safe set becomes a character reference, which carries no AsciiDoc meaning.
 */
function linkText(s) {
  return String(s).replace(/[^\p{L}\p{N} .'()-]/gu, (c) => `&#${c.codePointAt(0)};`)
}

/** Quote-safe text for an AsciiDoc attribute value in double quotes. */
function attr(s) {
  return String(s).replace(/\\/g, '&#92;').replace(/"/g, '&quot;').replace(/]/g, '&#93;')
}

/**
 * One tile: the title links the anchor, the image does not. A second link on the
 * image would add a second tab stop to the same target; CSS stretches the title
 * link over the whole tile instead.
 */
function tile(title, image, alt, link) {
  const heading = link ? `.link:${link}[${linkText(title)}]` : `.${title}`
  return `${heading}\nimage::${BASE}examples/${image}["${attr(alt)}",720,900]\n`
}

/** The whole gallery page as AsciiDoc, for `lang` 'en' or 'de'. */
function buildStyleGallery(lang) {
  const t = TEXT[lang === 'de' ? 'de' : 'en']
  const anchorBase = lang === 'de' ? `${BASE}de/anchor/` : `${BASE}anchor/`
  const tiles = [
    tile(t.originalTitle, ORIGINAL, t.originalAlt, ''),
    ...galleryEntries(lang).map((e) => tile(e.title, e.image, t.alt(e.title), anchorBase + e.id)),
  ]
  return [
    `= ${t.title}`,
    ':figure-caption!:',
    '',
    "// Generated by scripts/generate-style-gallery.js from the anchors' :example-screenshot:",
    '// attribute. Do not edit by hand.',
    '',
    t.intro[0],
    '',
    `[quote]\n____\n${PROMPT[lang === 'de' ? 'de' : 'en']}\n____`,
    '',
    t.intro[1],
    '',
    t.intro[2],
    '',
    t.intro[3],
    '',
    '[.style-gallery]',
    '--',
    tiles.join('\n'),
    '--',
    '',
  ].join('\n')
}

module.exports = { galleryEntries, buildStyleGallery, tile, ORIGINAL }
