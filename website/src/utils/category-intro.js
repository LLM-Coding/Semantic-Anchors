/**
 * Category intros (#869): a short text under each category heading that says
 * what the category covers and, where useful, links outside references.
 *
 * The texts live in src/data/category-intros.json as plain text with
 * Markdown-style links `[text](https://…)`. Only https links become anchors;
 * everything else is escaped, so the JSON never injects markup.
 *
 * This module has no imports on purpose: the SPA (card-grid.js) and the
 * Node pre-renderer (scripts/prerender-routes.js) share it and pass the
 * intros in.
 */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// External https links, or site-internal paths under /Semantic-Anchors/ (#872).
const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+|\/Semantic-Anchors\/[^)\s]*)\)/g

// Links open in a new tab; say so to screen-reader users (WCAG G201).
const NEW_TAB = { en: ' (opens in a new tab)', de: ' (öffnet in neuem Tab)' }

/**
 * Escape text and turn `[text](https://…)` into external links (new tab) and
 * `[text](/Semantic-Anchors/…)` into internal links (same tab).
 */
export function renderInlineLinks(text, lang = 'en') {
  const newTab = `<span class="sr-only">${escapeHtml(NEW_TAB[lang] || NEW_TAB.en)}</span>`
  let html = ''
  let last = 0
  for (const match of String(text).matchAll(LINK)) {
    html += escapeHtml(text.slice(last, match.index))
    const href = escapeHtml(match[2])
    html += match[2].startsWith('https://')
      ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[1])}${newTab}</a>`
      : `<a href="${href}">${escapeHtml(match[1])}</a>`
    last = match.index + match[0].length
  }
  return html + escapeHtml(String(text).slice(last))
}

/** The rendered intro for a category in a language (English fallback), or ''. */
export function getCategoryIntroHtml(intros, categoryId, lang) {
  const entry = intros?.[categoryId]
  if (!entry) return ''
  const useLang = entry[lang] ? lang : 'en'
  const text = entry[useLang]
  return text ? renderInlineLinks(text, useLang) : ''
}
