/**
 * Rewrite cross-references between anchors to the pre-rendered anchor pages
 * (#860).
 *
 * Anchor sources link to each other with <<anchor-id,Text>>, which
 * Asciidoctor renders as href="#anchor-id". In the modal the SPA intercepts
 * that fragment; on the pre-rendered /anchor/<id> pages no element carries
 * the id, so the link goes nowhere without JavaScript and crawlers see no
 * link at all. Known anchor ids therefore become clean routes. In-page
 * section links (#core-concepts) and unknown ids stay untouched; so does an
 * anchor id that the page itself defines as a section id, because then the
 * fragment does have a target.
 */

const BASE = '/Semantic-Anchors'

/**
 * @param {string} html rendered anchor fragment
 * @param {{lang: 'en'|'de', anchorIds: Set<string>, germanIds: Set<string>}} ctx
 *   anchorIds: every anchor id; germanIds: ids that have a German version
 */
function rewriteAnchorXrefs(html, { lang, anchorIds, germanIds }) {
  const pageIds = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  return html.replace(/href="#([a-z0-9][a-z0-9-]*)"/g, (match, id) => {
    if (!anchorIds.has(id) || pageIds.has(id)) return match
    const prefix = lang === 'de' && germanIds.has(id) ? `${BASE}/de` : BASE
    return `href="${prefix}/anchor/${id}"`
  })
}

module.exports = { rewriteAnchorXrefs }
