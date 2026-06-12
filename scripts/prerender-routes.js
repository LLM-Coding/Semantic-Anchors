#!/usr/bin/env node

/**
 * prerender-routes.js
 *
 * Post-build step: generate per-route static HTML so crawlers and non-JS
 * fetchers (claude.ai, curl, search engine bots that skip JS execution) can
 * access doc-style pages directly at their clean URLs.
 *
 * How it works:
 *   1. Reads the built Vite shell at website/dist/index.html
 *   2. For each route that has a pre-rendered content fragment in
 *      website/dist/docs/<fragment>.html, generates
 *      website/dist/<route>/index.html that injects the fragment into
 *      the #app div's initial markup and updates the <title> + meta
 *      description.
 *   3. When a user-agent with JS loads the page, the SPA boots, clears
 *      #app, and re-renders as usual — so users get the normal interactive
 *      experience. Crawlers and no-JS fetchers see real content immediately.
 *
 * GitHub Pages serves <route>/index.html automatically when the clean URL
 * (e.g. /workflow) is requested.
 *
 * Keep ROUTES in sync with website/src/utils/router.js and scripts/render-docs.js.
 */

const fs = require('fs')
const path = require('path')
const { extractDescription } = require('./generate-jsonld.js')

const DIST = path.join(__dirname, '..', 'website', 'dist')
const SHELL = path.join(DIST, 'index.html')

// Each entry maps a clean-URL route to the doc fragment rendered by
// scripts/render-docs.js, plus SEO metadata for the per-route <head>.
const ROUTES = [
  {
    path: '/about',
    fragment: 'docs/about.html',
    title: 'About — Semantic Anchors',
    description:
      'Learn what semantic anchors are, why they matter for LLM communication, and how the catalog is curated.',
    fragmentDe: 'docs/about.de.html',
    titleDe: 'Über — Semantic Anchors',
    descriptionDe:
      'Was semantische Anker sind, warum sie für die Kommunikation mit LLMs zählen und wie der Katalog kuratiert wird.',
  },
  {
    path: '/workflow',
    redirectTo: '/spec-driven-development',
  },
  {
    path: '/spec-driven-development',
    fragment: 'docs/spec-driven-workflow.html',
    title: 'Spec-Driven Development with Semantic Anchors',
    description:
      'Spec-driven development workflow — from requirements to specification to implementation, powered by semantic anchors.',
    fragmentDe: 'docs/spec-driven-workflow.de.html',
    titleDe: 'Spec-Driven Development mit Semantic Anchors',
    descriptionDe:
      'Spec-Driven-Development-Workflow — von den Anforderungen über die Spezifikation zur Implementierung, getragen von semantischen Ankern.',
  },
  {
    path: '/brownfield',
    fragment: 'docs/brownfield-workflow.html',
    title: 'Brownfield Workflow — Semantic Anchors',
    description:
      'Applying semantic anchors to brownfield codebases using a bounded-context approach.',
    fragmentDe: 'docs/brownfield-workflow.de.html',
    titleDe: 'Brownfield-Workflow — Semantic Anchors',
    descriptionDe:
      'Semantische Anker in Brownfield-Codebasen anwenden — mit einem Bounded-Context-Ansatz.',
  },
  {
    path: '/brownfield-experiment-report',
    fragment: 'docs/brownfield-experiment-report.html',
    title: 'Brownfield Experiment 1a Report — Semantic Anchors',
    description:
      'Controlled experiment: delete documentation from a greenfield project, regenerate from code, compare. Methodology, findings, and the Brownfield Preparation Checklist.',
  },
  {
    path: '/brownfield-fair-comparison',
    fragment: 'docs/brownfield-fair-comparison.html',
    title: 'Brownfield Fair Comparison — Semantic Anchors',
    description:
      'Three approaches (Direct, Socratic, Two-Phase) compared with identical team answers. Measures the structural value of the Question Tree, not the answers.',
  },
  {
    path: '/harness-inventory',
    fragment: 'docs/harness-inventory.html',
    title: 'The Harness Inventory — Semantic Anchors',
    description:
      'Layers of error correction for agentic coding. A categorised inventory of harness checks, sorted by how much project work each one requires.',
  },
  {
    path: '/socratic-recovery-skill',
    fragment: 'docs/socratic-recovery-skill.html',
    title: 'Socratic Code-Theory Recovery Skill — Semantic Anchors',
    description:
      'Installable Claude Code Skill that packages the brownfield documentation-recovery workflow. Two-phase Question Tree with [ANSWERED]/[OPEN] leaves, Q-ID traceability. Install on Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, and Amazon Kiro.',
    fragmentDe: 'docs/socratic-recovery-skill.de.html',
    titleDe: 'Socratic Code-Theory Recovery Skill — Semantic Anchors',
    descriptionDe:
      'Installierbarer Claude Code Skill für den Brownfield-Workflow zur Dokumentations-Wiederherstellung. Zweiphasiger Question Tree mit [ANSWERED]/[OPEN]-Blättern und Q-ID-Nachverfolgbarkeit.',
  },
  {
    path: '/training-data-vs-practice',
    fragment: 'docs/training-data-vs-practice.html',
    title: 'An Anchor Delivers Only as Far as the Prior Reaches — Semantic Anchors',
    description:
      "A semantic anchor's power depends on how densely the concept sits in an LLM's training data. A reproducible clean-room experiment across Claude Haiku 4.5, Sonnet 4.6, Opus 4.8 and Fable 5 on the Cockburn use-cases anchor.",
  },
  {
    path: '/contracts',
    fragment: 'docs/contracts.html',
    title: 'Semantic Contracts — Semantic Anchors',
    description:
      'Semantic Contracts define what terms mean in your project — composing established anchors or custom definitions for your AGENTS.md or CLAUDE.md.',
  },
  {
    path: '/changelog',
    fragment: 'docs/changelog.html',
    title: 'Changelog — Semantic Anchors',
    description: 'Chronological record of all semantic anchors added to the catalog.',
  },
  {
    path: '/contributing',
    fragment: 'CONTRIBUTING.html',
    title: 'Contributing — Semantic Anchors',
    description:
      'How to propose new semantic anchors, quality criteria, and the contribution workflow.',
    fragmentDe: 'CONTRIBUTING.de.html',
    titleDe: 'Mitwirken — Semantic Anchors',
    descriptionDe:
      'Wie du neue semantische Anker vorschlägst: Qualitätskriterien und der Beitrags-Workflow.',
  },
  {
    path: '/agentskill',
    fragment: 'docs/agentskill.html',
    title: 'AgentSkill — Semantic Anchors',
    description:
      'The semantic-anchor-translator AgentSkill — install semantic anchors into Claude Code, Codex, Cursor, and other coding agents.',
    fragmentDe: 'docs/agentskill.de.html',
    titleDe: 'AgentSkill — Semantic Anchors',
    descriptionDe:
      'Der semantic-anchor-translator AgentSkill — semantische Anker in Claude Code, Codex, Cursor und andere Coding-Agents installieren.',
  },
  {
    path: '/rejected-proposals',
    fragment: 'docs/rejected-proposals.html',
    title: 'Rejected Proposals — Semantic Anchors',
    description:
      'Anchor proposals that did not meet the quality criteria, with reasoning — useful for understanding the curation bar.',
    fragmentDe: 'docs/rejected-proposals.de.html',
    titleDe: 'Abgelehnte Vorschläge — Semantic Anchors',
    descriptionDe:
      'Anker-Vorschläge, die die Qualitätskriterien nicht erfüllt haben — mit Begründung, nützlich zum Verständnis der Kurationsschwelle.',
  },
  {
    path: '/all-anchors',
    fragment: 'docs/all-anchors.html',
    title: 'Full Reference — Semantic Anchors',
    description:
      'Full reference of all semantic anchors in one long document — readable offline, linkable, easy to Ctrl-F.',
  },
  {
    path: '/evaluations',
    fragment: 'docs/anchor-evaluations.html',
    title: 'Evaluations — Semantic Anchors',
    description: 'Multiple-choice evaluations of semantic anchor recognition across 10 LLMs.',
  },
]

/**
 * Read the Vite-built HTML shell (website/dist/index.html).
 * Exits with an error if the shell is missing — indicates that the caller
 * forgot to run `vite build` before this post-build step.
 * @returns {string} Raw HTML contents of the shell.
 */
function readShell() {
  if (!fs.existsSync(SHELL)) {
    console.error(`ERROR: ${SHELL} does not exist. Run 'vite build' first.`)
    process.exit(1)
  }
  return fs.readFileSync(SHELL, 'utf-8')
}

/**
 * Escape a string for safe insertion into an HTML attribute or text node.
 * Converts &, <, >, ", and ' to their HTML entity equivalents. Used for
 * route titles and descriptions that end up inside <title> and meta tags.
 * @param {string} str - Input string to escape.
 * @returns {string} HTML-safe string.
 */
function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c]
  )
}

const SITE = 'https://llm-coding.github.io/Semantic-Anchors'

/**
 * Apply per-page <head> metadata to a copy of the shell: <title>, meta
 * description, self-referencing canonical URL, honest hreflang alternates
 * (the shell ships home-pointing ones), and the <html lang> attribute for
 * German pages.
 * @param {string} html - Shell HTML.
 * @param {{title: string, description: string, canonicalUrl: string,
 *   enUrl: string, deUrl: (string|null), lang: string}} meta
 * @returns {string} Updated HTML.
 */
/**
 * Cap a meta description at ~160 characters on a word boundary — Google
 * truncates around 160, so longer texts would be cut mid-sentence in SERPs.
 */
function capDescription(text) {
  if (text.length <= 160) return text
  const cut = text.slice(0, 159)
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), 100)) + '…'
}

function applyHead(html, { title, description, canonicalUrl, enUrl, deUrl, lang }) {
  description = capDescription(description)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)

  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`
  )

  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )

  // Drop the shell's home-pointing language alternates, then re-insert
  // per-page ones right after the canonical link.
  html = html.replace(
    /[ \t]*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>\s*\n/g,
    ''
  )
  const alternates = [
    `    <link rel="alternate" hreflang="en" href="${enUrl}" />`,
    deUrl ? `    <link rel="alternate" hreflang="de" href="${deUrl}" />` : null,
    `    <link rel="alternate" hreflang="x-default" href="${enUrl}" />`,
  ]
    .filter(Boolean)
    .join('\n')
  html = html.replace(/(<link\s+rel="canonical"[^>]*>)/, `$1\n${alternates}`)

  // Per-page social metadata (#601): without this every pre-rendered page
  // keeps the shell's home-pointing og:/twitter: values, so shared subpage
  // links render the generic home preview.
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  )
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(title)}" />`
  )
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`
  )
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`
  )

  if (lang === 'de') {
    html = html.replace('<html lang="en">', '<html lang="de">')
    html = html
      .replace(
        /<meta\s+property="og:locale"\s+content="[^"]*"\s*\/?>/,
        '<meta property="og:locale" content="de_DE" />'
      )
      .replace(
        /<meta\s+property="og:locale:alternate"\s+content="[^"]*"\s*\/?>/,
        '<meta property="og:locale:alternate" content="en_US" />'
      )
  }

  return html
}

/**
 * Wrap the doc fragment in the structure that website/src/components/doc-page.js
 * produces at runtime: a centered article container with a #doc-content div.
 * The content is injected into the shell's #page-content div so crawlers and
 * non-JS fetchers see real content in the initial HTML response.
 */
function buildDocContentMarkup(fragmentHtml) {
  return `
    <article class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div id="doc-content" class="asciidoc-content">${fragmentHtml}</div>
    </article>
  `
}

/**
 * Pre-render a single route to website/dist/<route>/index.html.
 * Reads the AsciiDoc fragment produced by scripts/render-docs.js, injects
 * it into a copy of the Vite shell, and updates the <title>, meta
 * description, and canonical URL to match the route. Throws if the
 * fragment is missing so the build fails fast instead of shipping an
 * incomplete set of pre-rendered pages.
 * @param {string} shell - Raw HTML of the Vite build shell.
 * @param {{path: string, fragment: string, title: string, description: string}} route
 *   Route descriptor from the ROUTES list.
 * @throws {Error} When the configured fragment file does not exist.
 */
function prerenderRoute(shell, route) {
  if (route.redirectTo) {
    const outDir = path.join(DIST, route.path)
    const outFile = path.join(outDir, 'index.html')
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(
      outFile,
      `<!doctype html><meta charset="utf-8"><link rel="canonical" href="https://llm-coding.github.io/Semantic-Anchors${route.redirectTo}"><meta http-equiv="refresh" content="0;url=/Semantic-Anchors${route.redirectTo}"><script>location.replace('/Semantic-Anchors${route.redirectTo}')</script>`,
      'utf-8'
    )
    return
  }

  const enUrl = `${SITE}${route.path}`
  const deUrl = route.fragmentDe ? `${SITE}/de${route.path}` : null

  writeRouteVariant(shell, route.path, route.fragment, {
    title: route.title,
    description: route.description,
    canonicalUrl: enUrl,
    enUrl,
    deUrl,
    lang: 'en',
  })

  if (route.fragmentDe) {
    writeRouteVariant(shell, `/de${route.path}`, route.fragmentDe, {
      title: route.titleDe || route.title,
      description: route.descriptionDe || route.description,
      canonicalUrl: deUrl,
      enUrl,
      deUrl,
      lang: 'de',
    })
  }
}

/**
 * Write one language variant of a pre-rendered route: read the fragment,
 * apply the per-page <head> metadata, inject the content into the shell's
 * empty #page-content div, and write dist/<outPath>/index.html. Throws if
 * the fragment is missing so the build fails fast instead of shipping an
 * incomplete set of pre-rendered pages.
 */
function writeRouteVariant(shell, outPath, fragmentRel, headMeta, transformFragment) {
  const fragmentPath = path.join(DIST, fragmentRel)
  if (!fs.existsSync(fragmentPath)) {
    throw new Error(
      `Missing fragment for ${outPath}: ${fragmentRel} (expected at ${fragmentPath}). ` +
        `Make sure scripts/render-docs.js runs before prerender-routes.js and writes the fragment to website/public/docs/.`
    )
  }
  let fragment = fs.readFileSync(fragmentPath, 'utf-8')
  if (transformFragment) fragment = transformFragment(fragment)

  let html = applyHead(shell, headMeta)

  // Inject pre-rendered content into the static shell's #page-content div.
  // The shell (set up in website/index.html and preserved through vite build)
  // contains:
  //   <div id="page-content" ... style="..."></div>
  // We match that empty div by id and fill it with the doc content so crawlers
  // receive real HTML while JS users still get the SPA hydration on top.
  const pageContentRegex = /(<div\s+id="page-content"[^>]*>)\s*(<\/div>)/
  if (!pageContentRegex.test(html)) {
    throw new Error(
      `Shell #page-content div not found in dist/index.html. Did website/index.html lose the skeleton structure?`
    )
  }
  html = html.replace(pageContentRegex, `$1${buildDocContentMarkup(fragment)}$2`)

  const outDir = path.join(DIST, outPath)
  const outFile = path.join(outDir, 'index.html')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, html, 'utf-8')
}

/**
 * Pre-render a crawlable "answer block" into the home page (dist/index.html).
 *
 * The landing page renders its hero client-side, so crawlers and LLM fetchers
 * see only the empty skeleton — the worst case for the query "What is Semantic
 * Anchors?". This fills the empty #page-content with the hero copy (title +
 * definition + emphasis), single-sourced from the EN translations so it never
 * drifts from the live hero. On boot the SPA's home route overwrites
 * #page-content with the full interactive hero + card grid, so users are
 * unaffected. See issue #580.
 *
 * Runs after the ROUTES loop and writes only dist/index.html, so the other
 * routes (already written from the cached shell) keep their empty-skeleton
 * assumption.
 */
function prerenderHome(shell) {
  writeHomeVariant(shell, 'en')
  writeHomeVariant(shell, 'de')
}

/**
 * Load a JSON file relative to the website/ app directory.
 */
function loadWebsiteJson(rel) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'website', rel), 'utf-8'))
}

/**
 * Build the static catalog markup for the home page: one section per
 * category with plain links for every anchor, targeting the stable
 * per-anchor section IDs in the pre-rendered /all-anchors reference.
 * Uses only utility classes that already occur in src/ or index.html, so
 * they are guaranteed to be present in the built stylesheet.
 */
function buildCatalogMarkup(lang, translations) {
  const categories = loadWebsiteJson('public/data/categories.json')
  const anchors = loadWebsiteJson('public/data/anchors.json')
  const byId = new Map(anchors.map((a) => [a.id, a]))
  const heading =
    lang === 'de'
      ? `Der Katalog: ${anchors.length} Anker`
      : `The catalog: ${anchors.length} anchors`

  const linkClasses =
    'rounded-md px-2 py-1 text-sm text-[var(--color-text-secondary)] ' +
    'hover:text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)] transition-colors'

  // Link each anchor to its real pre-rendered page (#597); the German
  // catalog points at the /de variant where the translation exists.
  const hasDePage = (id) =>
    fs.existsSync(path.join(__dirname, '..', 'docs', 'anchors', `${id}.de.adoc`))
  const anchorHref = (id) =>
    lang === 'de' && hasDePage(id)
      ? `/Semantic-Anchors/de/anchor/${id}`
      : `/Semantic-Anchors/anchor/${id}`

  const sections = categories
    .map((category) => {
      const items = (category.anchors || [])
        .map((id) => byId.get(id))
        .filter(Boolean)
        .map(
          (anchor) =>
            `<li><a href="${anchorHref(escapeHtml(anchor.id))}" class="${linkClasses}">${escapeHtml(anchor.title)}</a></li>`
        )
        .join('')
      if (!items) return ''
      const name = translations[`categories.${category.id}`] || category.name
      return `
        <section class="mb-3">
          <h3 class="text-lg font-semibold mb-2">${escapeHtml(name)}</h3>
          <ul class="flex flex-wrap gap-2">${items}</ul>
        </section>`
    })
    .filter(Boolean)
    .join('')

  return `
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold mb-3">${escapeHtml(heading)}</h2>${sections}
      </section>
    `
}

/**
 * Pre-render every anchor to a real page at /anchor/<id>/ (HTTP 200), plus
 * a /de/anchor/<id>/ variant where a German translation exists — fixing the
 * sitemap- and JSON-LD-advertised 404s (#597). With JS the SPA hydrates and
 * shows the anchor as a modal over the home page, exactly as before.
 */
function prerenderAnchorPages(shell) {
  const anchors = loadWebsiteJson('public/data/anchors.json')
  let enCount = 0
  let deCount = 0
  let skipped = 0
  for (const anchor of anchors) {
    const fragment = `docs/anchors/${anchor.id}.html`
    if (!fs.existsSync(path.join(DIST, fragment))) {
      console.warn(`  ! skipped /anchor/${anchor.id} — fragment ${fragment} missing`)
      skipped++
      continue
    }
    const fragmentDe = `docs/anchors/${anchor.id}.de.html`
    const hasDe = fs.existsSync(path.join(DIST, fragmentDe))
    const enUrl = `${SITE}/anchor/${anchor.id}`
    const deUrl = hasDe ? `${SITE}/de/anchor/${anchor.id}` : null
    // Short Core-Concepts extracts ("Dependencies only point inward") get the
    // anchor title prefixed so the SERP snippet stands on its own (#601).
    const withTitle = (extracted) =>
      extracted && extracted.length < 50 ? `${anchor.title} — ${extracted}` : extracted
    const description =
      withTitle(extractDescription(`docs/anchors/${anchor.id}.adoc`)) ||
      `${anchor.title} — a semantic anchor: an established term that activates a rich, well-defined concept in any modern LLM.`

    // The anchor body sits in a [%collapsible] block; expand it on the
    // static page so the content is visible without a click. With JS the
    // SPA replaces the page with the modal anyway.
    const expandDetails = (html) => html.replace(/<details>/g, '<details open>')

    writeRouteVariant(
      shell,
      `/anchor/${anchor.id}`,
      fragment,
      {
        title: `${anchor.title} — Semantic Anchors`,
        description,
        canonicalUrl: enUrl,
        enUrl,
        deUrl,
        lang: 'en',
      },
      expandDetails
    )
    enCount++

    if (hasDe) {
      writeRouteVariant(
        shell,
        `/de/anchor/${anchor.id}`,
        fragmentDe,
        {
          title: `${anchor.title} — Semantic Anchors`,
          description:
            withTitle(extractDescription(`docs/anchors/${anchor.id}.de.adoc`)) || description,
          canonicalUrl: deUrl,
          enUrl,
          deUrl,
          lang: 'de',
        },
        expandDetails
      )
      deCount++
    }
  }
  console.log(
    `  ✓ pre-rendered ${enCount} anchor pages (+ ${deCount} German variants${skipped ? `, ${skipped} skipped` : ''})`
  )
}

/**
 * Write one language variant of the home page: hero copy + static catalog,
 * single-sourced from the translations so it never drifts from the live
 * hero. EN overwrites dist/index.html, DE goes to dist/de/index.html.
 */
function writeHomeVariant(shell, lang) {
  const tr = loadWebsiteJson(`src/translations/${lang}.json`)
  const title = tr['hero.title'] || ''
  const intro = tr['hero.intro'] || ''
  const emphasis = tr['hero.introEmphasis'] || ''

  const block = `
      <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-3xl sm:text-4xl font-bold mb-3 leading-tight">${escapeHtml(title)}</h1>
        <p class="mb-2 max-w-3xl">${escapeHtml(intro)}</p>
        <p class="font-semibold max-w-3xl">${escapeHtml(emphasis)}</p>
      </section>
      ${buildCatalogMarkup(lang, tr)}
    `

  // Real counts from the data files, so the description can never go stale
  // again the way the hard-coded "110+" did (#601).
  const anchorCount = loadWebsiteJson('public/data/anchors.json').length
  const contractCount = loadWebsiteJson('public/data/contracts.json').length

  let html = applyHead(shell, {
    title:
      lang === 'de'
        ? 'Semantic Anchors - Gemeinsames Vokabular für die Kommunikation mit LLMs'
        : 'Semantic Anchors - Shared Vocabulary for LLM Communication',
    description:
      lang === 'de'
        ? `${anchorCount} semantische Anker und ${contractCount} semantische Contracts für präzise LLM-Kommunikation — kuratierte Methoden, Frameworks und Projektkonventionen.`
        : `${anchorCount} semantic anchors and ${contractCount} semantic contracts for precise LLM communication — curated methodologies, frameworks, and composable project conventions.`,
    canonicalUrl: lang === 'de' ? `${SITE}/de/` : `${SITE}/`,
    enUrl: `${SITE}/`,
    deUrl: `${SITE}/de/`,
    lang,
  })

  const pageContentRegex = /(<div\s+id="page-content"[^>]*>)\s*(<\/div>)/
  if (!pageContentRegex.test(html)) {
    throw new Error(
      'Home #page-content div not found (or not empty) in dist/index.html — cannot inject the landing answer block.'
    )
  }
  html = html.replace(pageContentRegex, `$1${block}$2`)

  if (lang === 'de') {
    const outDir = path.join(DIST, 'de')
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8')
    console.log('  ✓ pre-rendered /de/ (home, German)')
  } else {
    fs.writeFileSync(SHELL, html, 'utf-8')
    console.log('  ✓ pre-rendered / (home answer block + catalog)')
  }
}

/**
 * Entry point: read the shell once, then pre-render every route in ROUTES,
 * plus a crawlable answer block on the home page.
 * Throws (via prerenderRoute) if any fragment is missing, so the build
 * fails non-zero instead of shipping an incomplete set of static pages.
 */
/**
 * Pre-render one real page per semantic contract — /contract/<id> plus a
 * /de/contract/<id> variant (#611). Mirrors prerenderAnchorPages: the body
 * fragments are written by render-contracts.js into docs/contracts/ and the
 * per-page head metadata flows through applyHead.
 */
function prerenderContractPages(shell) {
  const contracts = loadWebsiteJson('public/data/contracts.json')
  let count = 0
  let skipped = 0
  // Mirror the router's id validation before ids enter paths and URLs.
  const SAFE_CONTRACT_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  for (const contract of contracts) {
    if (!SAFE_CONTRACT_ID.test(contract.id)) {
      console.warn(`  ! skipped contract with unsafe id: ${JSON.stringify(contract.id)}`)
      skipped++
      continue
    }
    const fragment = `docs/contracts/${contract.id}.html`
    const fragmentDe = `docs/contracts/${contract.id}.de.html`
    if (!fs.existsSync(path.join(DIST, fragment))) {
      console.warn(`  ! skipped /contract/${contract.id} — fragment ${fragment} missing`)
      skipped++
      continue
    }
    const enUrl = `${SITE}/contract/${contract.id}`
    const deUrl = `${SITE}/de/contract/${contract.id}`

    writeRouteVariant(shell, `/contract/${contract.id}`, fragment, {
      title: `${contract.title} — Semantic Anchors`,
      description: `${contract.title} — a semantic contract: ${contract.description}. Composable shared vocabulary for your CLAUDE.md / AGENTS.md.`,
      canonicalUrl: enUrl,
      enUrl,
      deUrl,
      lang: 'en',
    })

    writeRouteVariant(shell, `/de/contract/${contract.id}`, fragmentDe, {
      title: `${contract.titleDe || contract.title} — Semantic Anchors`,
      description: `${contract.titleDe || contract.title} — ein Semantic Contract: ${contract.descriptionDe || contract.description}. Komponierbares gemeinsames Vokabular für deine CLAUDE.md / AGENTS.md.`,
      canonicalUrl: deUrl,
      enUrl,
      deUrl,
      lang: 'de',
    })
    count++
  }
  console.log(
    `  ✓ pre-rendered ${count} contract pages (EN + DE${skipped ? `, ${skipped} skipped` : ''})`
  )
}

function main() {
  const shell = readShell()
  for (const route of ROUTES) {
    prerenderRoute(shell, route)
    console.log(`  ✓ pre-rendered ${route.path}${route.fragmentDe ? ' (+ /de variant)' : ''}`)
  }
  prerenderHome(shell)
  prerenderAnchorPages(shell)
  prerenderContractPages(shell)
  console.log(
    `\n✓ Pre-rendered ${ROUTES.length} routes + home + anchor + contract pages to dist/<route>/index.html`
  )
}

main()
