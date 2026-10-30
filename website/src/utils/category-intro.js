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

const LINK = /\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g

/** Escape text and turn `[text](https://…)` into external links. */
export function renderInlineLinks(text) {
  let html = ''
  let last = 0
  for (const match of String(text).matchAll(LINK)) {
    html += escapeHtml(text.slice(last, match.index))
    html += `<a href="${escapeHtml(match[2])}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`
    last = match.index + match[0].length
  }
  return html + escapeHtml(String(text).slice(last))
}

/** The rendered intro for a category in a language (English fallback), or ''. */
export function getCategoryIntroHtml(intros, categoryId, lang) {
  const entry = intros?.[categoryId]
  if (!entry) return ''
  const text = entry[lang] || entry.en
  return text ? renderInlineLinks(text) : ''
}
