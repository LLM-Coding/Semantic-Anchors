#!/usr/bin/env node

/**
 * generate-sitemap.js
 * 
 * Generates sitemap.xml for the Semantic Anchors website
 */

const fs = require('fs');
const path = require('path');

// Paths
const ANCHORS_DATA = path.join(__dirname, '..', 'website', 'public', 'data', 'anchors.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'website', 'public', 'sitemap.xml');
const BASE_URL = 'https://llm-coding.github.io/Semantic-Anchors';

// Read anchors data
const anchorsData = JSON.parse(fs.readFileSync(ANCHORS_DATA, 'utf-8'));

// Generate sitemap
const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- About Page -->
  <url>
    <loc>${BASE_URL}/#/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Contributing Page -->
  <url>
    <loc>${BASE_URL}/#/contributing</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

`;

// Add all anchors
anchorsData.forEach(anchor => {
  sitemap += `  <!-- Anchor: ${anchor.title} -->
  <url>
    <loc>${BASE_URL}/#/anchor/${anchor.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

`;
});

sitemap += `</urlset>
`;

// Write sitemap
fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf-8');

console.log(`✓ Sitemap generated: ${OUTPUT_FILE}`);
console.log(`✓ Total URLs: ${anchorsData.length + 3} (3 pages + ${anchorsData.length} anchors)`);
