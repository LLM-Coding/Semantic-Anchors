/**
 * Accessible names for AsciiDoc section anchors.
 *
 * With sectanchors:true Asciidoctor renders an empty
 * `<a class="anchor" href="#id"></a>` before each heading's text. An empty
 * link has no accessible name, so screen readers announce just "link" and
 * axe reports `link-name` (WCAG 2.4.4, 4.1.2). We label each one with its
 * heading text, which is language-neutral and tells the user where it leads.
 */

const SECTION_ANCHOR = /<a class="anchor" href="(#[^"]*)"><\/a>([\s\S]*?)(<\/h[1-6]>)/g

function labelSectionAnchors(html) {
  return html.replace(SECTION_ANCHOR, (match, href, inner, close) => {
    const label = inner
      .replace(/<[^>]*>/g, '')
      .replace(/"/g, '&quot;')
      .trim()
    if (!label) return match
    return `<a class="anchor" href="${href}" aria-label="${label}"></a>${inner}${close}`
  })
}

module.exports = { labelSectionAnchors }
