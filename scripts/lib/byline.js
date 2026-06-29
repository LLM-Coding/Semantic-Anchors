/**
 * Author/date byline for pre-rendered documentation pages.
 *
 * render-docs.js renders doc pages in embedded mode, which drops the document
 * header (`#header`) that AsciiDoctor normally uses for the author + revision
 * date. Authors are declared in the `.adoc` sources (e.g. `Ralf D. Müller` on
 * line 2), so we re-create a minimal byline from the parsed metadata and inject
 * it below the page title. Keeping it here as pure functions makes it testable
 * without running the whole render script.
 */

/** Minimal HTML escape for text injected into rendered fragments. */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Build the byline HTML for an author and/or revision date. Returns '' when
 * both are missing, so pages without an author stay unchanged.
 */
function bylineHtml(author, revdate) {
  if (!author && !revdate) return ''
  const parts = []
  if (author) parts.push(`<span class="doc-byline-author">${escapeHtml(author)}</span>`)
  if (revdate) parts.push(`<span class="doc-byline-date">${escapeHtml(revdate)}</span>`)
  return `<div class="doc-byline">${parts.join('')}</div>\n`
}

/**
 * Inject the byline directly after the leading `<h1>…</h1>` of a rendered
 * fragment. If the fragment has no `<h1>` (rendered without showtitle), the
 * byline is prepended. Unchanged when there is no author or date.
 */
function injectByline(html, author, revdate) {
  const byline = bylineHtml(author, revdate)
  if (!byline) return html
  const close = '</h1>'
  const idx = html.indexOf(close)
  if (idx !== -1) {
    const after = idx + close.length
    return html.slice(0, after) + '\n' + byline + html.slice(after)
  }
  return byline + html
}

module.exports = { bylineHtml, injectByline }
