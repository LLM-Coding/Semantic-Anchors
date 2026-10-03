/**
 * Hide AsciiDoc section anchors from assistive technology.
 *
 * With sectanchors:true Asciidoctor renders an empty
 * `<a class="anchor" href="#id"></a>` inside each heading. An empty link has
 * no accessible name, so screen readers announce just "link" and axe reports
 * `link-name` (WCAG 2.4.4, 4.1.2). Labelling it would not help: the label
 * becomes part of the heading's name, so every heading would be read twice.
 * The link is a mouse-only permalink (the heading id carries the deep link),
 * so we take it out of the accessibility tree and the tab order instead.
 */

const SECTION_ANCHOR = /<a class="anchor" href="(#[^"]*)"><\/a>/g

function hideSectionAnchors(html) {
  return html.replace(
    SECTION_ANCHOR,
    '<a class="anchor" href="$1" aria-hidden="true" tabindex="-1"></a>'
  )
}

module.exports = { hideSectionAnchors }
