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
  },
  {
    path: '/workflow',
    fragment: 'docs/spec-driven-workflow.html',
    title: 'Development Workflow — Semantic Anchors',
    description:
      'The Semantic Anchors spec-driven development workflow — from requirements to specification to implementation, powered by semantic anchors.',
  },
  {
    path: '/brownfield',
    fragment: 'docs/brownfield-workflow.html',
    title: 'Brownfield Workflow — Semantic Anchors',
    description:
      'Applying semantic anchors to brownfield codebases using a bounded-context approach.',
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
  },
  {
    path: '/agentskill',
    fragment: 'docs/agentskill.html',
    title: 'AgentSkill — Semantic Anchors',
    description:
      'The semantic-anchor-translator AgentSkill — install semantic anchors into Claude Code, Codex, Cursor, and other coding agents.',
  },
  {
    path: '/rejected-proposals',
    fragment: 'docs/rejected-proposals.html',
    title: 'Rejected Proposals — Semantic Anchors',
    description:
      'Anchor proposals that did not meet the quality criteria, with reasoning — useful for understanding the curation bar.',
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
  const fragmentPath = path.join(DIST, route.fragment)
  if (!fs.existsSync(fragmentPath)) {
    throw new Error(
      `Missing fragment for ${route.path}: ${route.fragment} (expected at ${fragmentPath}). ` +
        `Make sure scripts/render-docs.js runs before prerender-routes.js and writes the fragment to website/public/docs/.`
    )
  }
  const fragment = fs.readFileSync(fragmentPath, 'utf-8')

  let html = shell

  // Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)

  // Replace meta description if present
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  )

  // Update canonical URL so each pre-rendered page points to itself
  const canonicalUrl = `https://llm-coding.github.io/Semantic-Anchors${route.path}`
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  )

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

  const outDir = path.join(DIST, route.path)
  const outFile = path.join(outDir, 'index.html')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, html, 'utf-8')
}

/**
 * Entry point: read the shell once, then pre-render every route in ROUTES.
 * Throws (via prerenderRoute) if any fragment is missing, so the build
 * fails non-zero instead of shipping an incomplete set of static pages.
 */
function main() {
  const shell = readShell()
  for (const route of ROUTES) {
    prerenderRoute(shell, route)
    console.log(`  ✓ pre-rendered ${route.path}`)
  }
  console.log(`\n✓ Pre-rendered ${ROUTES.length} routes to dist/<route>/index.html`)
}

main()
