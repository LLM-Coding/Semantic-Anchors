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
// website/src/utils/router.js -> ROUTE_TITLES.
// priority: 1.0 homepage, 0.8 top-level content, 0.7 contributing/meta, 0.6 anchors
const PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/workflow', priority: '0.8', changefreq: 'monthly' },
  { path: '/brownfield', priority: '0.8', changefreq: 'monthly' },
  { path: '/contracts', priority: '0.8', changefreq: 'monthly' },
  { path: '/evaluations', priority: '0.8', changefreq: 'monthly' },
  { path: '/all-anchors', priority: '0.8', changefreq: 'weekly' },
  { path: '/agentskill', priority: '0.7', changefreq: 'monthly' },
  { path: '/changelog', priority: '0.7', changefreq: 'weekly' },
  { path: '/contributing', priority: '0.7', changefreq: 'monthly' },
  { path: '/rejected-proposals', priority: '0.5', changefreq: 'monthly' },
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

// Individual anchor pages
anchorsData.forEach((anchor) => {
  sitemap += urlEntry(
    `${BASE_URL}/anchor/${anchor.id}`,
    today,
    'monthly',
    '0.6',
    `Anchor: ${anchor.title}`
  )
})

sitemap += `</urlset>
`

fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf-8')

console.log(`✓ Sitemap generated: ${OUTPUT_FILE}`)
console.log(
  `✓ Total URLs: ${PAGES.length + anchorsData.length} (${PAGES.length} pages + ${anchorsData.length} anchors)`
)
