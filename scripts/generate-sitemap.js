#!/usr/bin/env node

/**
 * generate-sitemap.js
 *
 * Generates sitemap.xml for the Semantic Anchors website.
 *
 * Produces clean (non-hash) URLs that match the History API router in
 * website/src/utils/router.js. Hash-based URLs (#/about) are not crawlable
 * by search engines — every hash URL looks like the homepage to a crawler,
 * and claude.ai / LLM fetchers cannot reach them either.
 *
 * Keep the PAGES list in sync with router.js `ROUTE_TITLES` when adding
 * new routes.
 */

const fs = require('fs')
const path = require('path')

const ANCHORS_DATA = path.join(__dirname, '..', 'website', 'public', 'data', 'anchors.json')
const OUTPUT_FILE = path.join(__dirname, '..', 'website', 'public', 'sitemap.xml')
const BASE_URL = 'https://llm-coding.github.io/Semantic-Anchors'

// Static pages served by the SPA router. Keep in sync with
// website/src/utils/router.js -> ROUTE_TITLES AND with the ROUTES list in
// scripts/prerender-routes.js.
//
// Only routes that can be pre-rendered to static HTML are listed here —
// otherwise the sitemap would advertise URLs that return an empty SPA
// shell to non-JS crawlers and claude.ai fetchers.
//
// Excluded on purpose:
// - /anchor/:id    — rendered per entry via the anchor loop below
//
// priority: 1.0 homepage, 0.8 top-level content, 0.7 contributing/meta, 0.6 anchors
const PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/spec-driven-development', priority: '0.8', changefreq: 'monthly' },
  { path: '/brownfield', priority: '0.8', changefreq: 'monthly' },
  { path: '/brownfield-experiment-report', priority: '0.7', changefreq: 'monthly' },
  { path: '/brownfield-fair-comparison', priority: '0.7', changefreq: 'monthly' },
  { path: '/socratic-recovery-skill', priority: '0.7', changefreq: 'monthly' },
  { path: '/harness-inventory', priority: '0.7', changefreq: 'monthly' },
  { path: '/contracts', priority: '0.7', changefreq: 'monthly' },
  { path: '/evaluations', priority: '0.8', changefreq: 'monthly' },
  { path: '/all-anchors', priority: '0.8', changefreq: 'weekly' },
  { path: '/agentskill', priority: '0.7', changefreq: 'monthly' },
  { path: '/changelog', priority: '0.7', changefreq: 'weekly' },
  { path: '/contributing', priority: '0.7', changefreq: 'monthly' },
  { path: '/rejected-proposals', priority: '0.5', changefreq: 'monthly' },
]

// Pre-rendered German variants under /de/. Keep in sync with the routes in
// scripts/prerender-routes.js that carry a fragmentDe (plus the home page).
const DE_PAGES = [
  '/',
  '/about',
  '/spec-driven-development',
  '/brownfield',
  '/socratic-recovery-skill',
  '/contributing',
  '/agentskill',
  '/rejected-proposals',
]

const anchorsData = JSON.parse(fs.readFileSync(ANCHORS_DATA, 'utf-8'))
const today = new Date().toISOString().split('T')[0]

/**
 * Render one <url> entry for sitemap.xml.
 * @param {string} loc - Fully-qualified URL of the page.
 * @param {string} lastmod - ISO date string (YYYY-MM-DD).
 * @param {string} changefreq - Sitemap changefreq value (weekly, monthly, ...).
 * @param {string} priority - Sitemap priority value ("0.0"–"1.0").
 * @param {string} [comment] - Optional XML comment placed above the entry.
 * @returns {string} One <url>...</url> block with a trailing blank line.
 */
function urlEntry(loc, lastmod, changefreq, priority, comment) {
  return `  ${comment ? `<!-- ${comment} -->\n  ` : ''}<url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>

`
}

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

// Static pages
for (const page of PAGES) {
  const loc = page.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${page.path}`
  sitemap += urlEntry(loc, today, page.changefreq, page.priority)
}

// German variants
for (const dePath of DE_PAGES) {
  const loc = dePath === '/' ? `${BASE_URL}/de/` : `${BASE_URL}/de${dePath}`
  sitemap += urlEntry(loc, today, 'monthly', '0.5')
}

// Individual anchor pages (pre-rendered static pages since #597), plus the
// /de variant where a German translation exists.
let deAnchorCount = 0
anchorsData.forEach((anchor) => {
  sitemap += urlEntry(
    `${BASE_URL}/anchor/${anchor.id}`,
    today,
    'monthly',
    '0.6',
    `Anchor: ${anchor.title}`
  )
  if (fs.existsSync(path.join(__dirname, '..', 'docs', 'anchors', `${anchor.id}.de.adoc`))) {
    sitemap += urlEntry(`${BASE_URL}/de/anchor/${anchor.id}`, today, 'monthly', '0.5')
    deAnchorCount++
  }
})

// Individual contract pages (pre-rendered static pages since #611), each with
// a /de variant — contracts.json carries full German fields for all entries.
const contractsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'website/public/data/contracts.json'), 'utf-8')
)
contractsData.forEach((contract) => {
  sitemap += urlEntry(
    `${BASE_URL}/contract/${contract.id}`,
    today,
    'monthly',
    '0.6',
    `Contract: ${contract.title}`
  )
  sitemap += urlEntry(`${BASE_URL}/de/contract/${contract.id}`, today, 'monthly', '0.5')
})

sitemap += `</urlset>
`

fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf-8')

console.log(`✓ Sitemap generated: ${OUTPUT_FILE}`)
console.log(
  `✓ Total URLs: ${PAGES.length + DE_PAGES.length + anchorsData.length + deAnchorCount + contractsData.length * 2} (${PAGES.length} pages + ${DE_PAGES.length} German pages + ${anchorsData.length} anchors + ${deAnchorCount} German anchors + ${contractsData.length * 2} contract pages)`
)
