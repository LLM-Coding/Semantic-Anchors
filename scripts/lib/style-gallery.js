/**
 * Style gallery (#872): one starting page per section, redesigned once per anchor.
 *
 * Every anchor with an `:example-screenshot:` gets a tile in the section of its
 * starting page (`:example-page:`, default homepage); each section opens with
 * its original. The page is generated, never hand-edited: a new screenshot
 * shows up by itself. Output is AsciiDoc, so render-docs and the pre-renderer
 * treat it like any other doc page.
 */
const fs = require('fs')
const path = require('path')
const { exampleImageFor, isSafeExampleImage, BLOG_URL } = require('./example-image')

const ROOT = path.join(__dirname, '..', '..')
const ANCHORS = path.join(ROOT, 'docs', 'anchors')
const BASE = '/Semantic-Anchors/'
// Each example redesigns one of two starting pages; each section opens with its
// original. Styles redesign a homepage. Design systems are built for product
// interfaces, so they redesign an app page, where tables, status labels and
// density show the system (#872 follow-up). An anchor names its starting page
// with `:example-page:`; without it, the example is a homepage.
const PAGES = ['homepage', 'team-settings']
const DEFAULT_PAGE = 'homepage'
const originalImage = (page) => `original-${page}.webp`
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
      'Two comparisons, each on its own starting page: visual styles redesign a homepage, design systems an app page. Each page is redesigned once per anchor name, and each version comes from a separate Claude Opus 5.5 session that got the same prompt with only the name changed:',
      'The sessions got the German original: "Gestalte diese Website im Stil von {ANKER} neu. Die Inhalte bleiben unverändert." No description, no reference images, one run per anchor, no rerolls; each session checked its own result in a browser, with one exception noted below. Each style tile links to its anchor.',
      'One run shows what the name sets off, not the only possible result. Another run, or another model, will differ in the details.',
    ],
    sections: {
      homepage: {
        heading: 'Styles: one homepage',
        intro: [
          `The first tile is the original, https://rdmueller.github.io/[rdmueller.github.io] as of 28 October 2026. How these examples came about, and what stood out in each: ${BLOG_URL}[A Design Style Is a Name Your LLM Already Knows] (Ralf D. Müller, 29 October 2026). Material Design 3, Apple's Human Interface Guidelines and the GOV.UK Design System are design systems, but their examples come from that run and stay here.`,
          "Refactoring UI and Bringhurst's The Elements of Typographic Style are rule sets, not styles. Their tiles were added on 30 October 2026 with the same prompt, one run each, and show what the rules change on the same homepage: Bringhurst's in the type at first glance, Refactoring UI's more quietly, in hierarchy, spacing and colour. The Refactoring UI session checked its result in a browser; the Bringhurst session compared the text of every page with the original but does not say it looked at the result.",
        ],
        originalAlt: 'The original homepage before any redesign',
        alt: (t) => `The homepage redesigned in the style of ${t}`,
      },
      'team-settings': {
        heading: 'Design systems: one app page',
        intro: [
          'Design systems are made for product interfaces. Their differences show in tables, status labels, page headers and density, and a homepage has little of that. So the design systems redesign an app page instead: the "Team members" settings page of a fictional admin console, written for this gallery in a deliberately plain style. The first tile is that page.',
          'These sessions ran on 30 October 2026 in a cloud workspace without web access. For the screenshots, the fonts and stylesheets the pages request from Google Fonts and jsDelivr were served locally from the same npm packages; licensed fonts such as Segoe UI or Adobe Clean appear in their fallback.',
        ],
        originalAlt: 'The neutral starting page, a team-members settings page, before any redesign',
        alt: (t) => `The settings page redesigned in the style of ${t}`,
      },
    },
    originalTitle: 'Original',
  },
  de: {
    title: 'Design-Stile im Vergleich',
    intro: [
      'Zwei Vergleiche, jeder auf einer eigenen Ausgangsseite: Visuelle Stile gestalten eine Homepage neu, Design-Systeme eine App-Seite. Jede Seite wird einmal pro Ankername neu gestaltet; jede Fassung stammt aus einer eigenen Session mit Claude Opus 5.5, die denselben Prompt bekam, nur der Name änderte sich:',
      'Keine Beschreibung, keine Referenzbilder, ein Lauf pro Anker, keine Wiederholungen; jede Session prüfte ihr Ergebnis im Browser, mit einer unten genannten Ausnahme. Jede Stil-Kachel verlinkt ihren Anker.',
      'Ein Lauf zeigt, was der Name auslöst, nicht das einzig mögliche Ergebnis. Ein weiterer Lauf oder ein anderes Modell weicht in Details ab.',
    ],
    sections: {
      homepage: {
        heading: 'Stile: eine Homepage',
        intro: [
          `Die erste Kachel ist das Original, https://rdmueller.github.io/[rdmueller.github.io] mit Stand vom 28. Oktober 2026. Wie diese Beispiele entstanden sind und was jeweils auffiel: ${BLOG_URL}[A Design Style Is a Name Your LLM Already Knows] (Ralf D. Müller, 29. Oktober 2026). Material Design 3, Apples Human Interface Guidelines und das GOV.UK Design System sind Design-Systeme, ihre Beispiele stammen aber aus diesem Lauf und bleiben hier.`,
          'Refactoring UI und Bringhursts The Elements of Typographic Style sind Regelwerke, keine Stile. Ihre Kacheln kamen am 30. Oktober 2026 mit demselben Prompt hinzu, je ein Lauf, und zeigen, was die Regeln an derselben Homepage ändern: Bringhursts Regeln sieht man sofort an der Schrift, die von Refactoring UI leiser, an Hierarchie, Abständen und Farbe. Die Session zu Refactoring UI prüfte ihr Ergebnis im Browser; die Session zu Bringhurst verglich den Text jeder Seite mit dem Original, sagt aber nicht, dass sie sich das Ergebnis angesehen hat.',
        ],
        originalAlt: 'Die ursprüngliche Homepage vor der Neugestaltung',
        alt: (t) => `Die Homepage, neu gestaltet im Stil von ${t}`,
      },
      'team-settings': {
        heading: 'Design-Systeme: eine App-Seite',
        intro: [
          'Design-Systeme sind für Produktoberflächen gemacht. Ihre Unterschiede zeigen sich in Tabellen, Status-Labels, Seitenköpfen und Dichte, und davon hat eine Homepage wenig. Deshalb gestalten die Design-Systeme stattdessen eine App-Seite neu: die Einstellungsseite „Team members“ einer erfundenen Admin-Konsole, für diese Galerie bewusst schlicht geschrieben. Die erste Kachel ist diese Seite.',
          'Diese Sessions liefen am 30. Oktober 2026 in einer Cloud-Umgebung ohne Webzugriff. Für die Screenshots wurden die Schriften und Stylesheets, die die Seiten bei Google Fonts und jsDelivr anfordern, lokal aus denselben npm-Paketen ausgeliefert; lizenzierte Schriften wie Segoe UI oder Adobe Clean erscheinen in ihrer Ersatzschrift.',
        ],
        originalAlt:
          'Die neutrale Ausgangsseite, eine Einstellungsseite für Teammitglieder, vor der Neugestaltung',
        alt: (t) => `Die Einstellungsseite, neu gestaltet im Stil von ${t}`,
      },
    },
    originalTitle: 'Original',
  },
}

/**
 * The starting page an anchor's example redesigns (`:example-page:`). An unknown
 * value throws: a typo would otherwise move the tile into the wrong section.
 */
function examplePageFor(file) {
  // The whole value up to the end of the line, so "homepage team-settings" fails.
  const m = fs.readFileSync(file, 'utf-8').match(/^:example-page:[ \t]*(.*?)[ \t]*$/m)
  if (!m) return DEFAULT_PAGE
  if (!PAGES.includes(m[1])) {
    throw new Error(`${file}: unknown :example-page: "${m[1]}" (expected ${PAGES.join(' or ')})`)
  }
  return m[1]
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
      return { id, image, title, page: examplePageFor(path.join(ANCHORS, f)) }
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
  const entries = galleryEntries(lang)
  const sections = PAGES.map((page) => {
    const sec = t.sections[page]
    const tiles = [
      tile(t.originalTitle, originalImage(page), sec.originalAlt, ''),
      ...entries
        .filter((e) => e.page === page)
        .map((e) => tile(e.title, e.image, sec.alt(e.title), anchorBase + e.id)),
    ]
    return [
      `== ${sec.heading}`,
      '',
      ...sec.intro.flatMap((p) => [p, '']),
      '[.style-gallery]',
      '--',
      tiles.join('\n'),
      '--',
      '',
    ].join('\n')
  })
  return [
    `= ${t.title}`,
    ':figure-caption!:',
    '',
    "// Generated by scripts/generate-style-gallery.js from the anchors' :example-screenshot:",
    '// and :example-page: attributes. Do not edit by hand.',
    '',
    t.intro[0],
    '',
    `[quote]\n____\n${PROMPT[lang === 'de' ? 'de' : 'en']}\n____`,
    '',
    t.intro[1],
    '',
    t.intro[2],
    '',
    sections.join('\n'),
  ].join('\n')
}

module.exports = { galleryEntries, buildStyleGallery, tile, examplePageFor, PAGES, originalImage }
