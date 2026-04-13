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
    description:
      'Multiple-choice evaluations of semantic anchor recognition across 10 LLMs.',
  },
]

function readShell() {
  if (!fs.existsSync(SHELL)) {
    console.error(`ERROR: ${SHELL} does not exist. Run 'vite build' first.`)
    process.exit(1)
  }
  return fs.readFileSync(SHELL, 'utf-8')
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c])
}

/**
 * Build the pre-populated markup that goes inside <div id="app">.
 * Mirrors the layout produced at runtime by renderHeader() + renderDocPage()
 * + renderFooter() in website/src/main.js, but statically — so crawlers see
 * real content in the initial HTML response.
 */
function buildAppMarkup(fragmentHtml) {
  return `
    <main class="flex-1">
      <article class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div id="doc-content" class="asciidoc-content">${fragmentHtml}</div>
      </article>
    </main>
  `
}

function prerenderRoute(shell, route) {
  const fragmentPath = path.join(DIST, route.fragment)
  if (!fs.existsSync(fragmentPath)) {
    console.warn(`  skip ${route.path}: fragment not found at ${route.fragment}`)
    return false
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

  // Inject pre-rendered content into #app
  html = html.replace(
    /<div\s+id="app"\s*>\s*<\/div>/,
    `<div id="app">${buildAppMarkup(fragment)}</div>`
  )

  const outDir = path.join(DIST, route.path)
  const outFile = path.join(outDir, 'index.html')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(outFile, html, 'utf-8')
  return true
}

function main() {
  const shell = readShell()
  let written = 0
  for (const route of ROUTES) {
    if (prerenderRoute(shell, route)) {
      console.log(`  ✓ pre-rendered ${route.path}`)
      written += 1
    }
  }
  console.log(`\n✓ Pre-rendered ${written}/${ROUTES.length} routes to dist/<route>/index.html`)
}

main()
