/**
 * Helpers for the plain-text exports (llms.txt, per-anchor Markdown, bundles).
 *
 * Anchor files link with in-app routes such as `link:#/prior-tests[...]`. The
 * website router resolves them, but a reader or an LLM that opens llms.txt on
 * its own only sees a fragment of the text file. The exports therefore rewrite
 * such links to absolute site URLs. The router uses clean paths and redirects
 * legacy `#/` hashes, so `#/x` maps to `<site>/x`.
 */

const SITE_URL = 'https://llm-coding.github.io/Semantic-Anchors/'
const REPO_BLOB_URL = 'https://github.com/LLM-Coding/Semantic-Anchors/blob/main/'

/** Resolve a link target from an anchor file so it works outside the website. */
function standaloneUrl(url) {
  if (/^\.\.\/.*\.adoc$/.test(url)) return REPO_BLOB_URL + url.slice(3)
  if (url.startsWith('#/')) return SITE_URL + url.slice(2)
  return url
}

/** Number of distinct anchors across categories; an anchor may sit in several. */
function countDistinctAnchors(categories) {
  return new Set(categories.flatMap((c) => c.anchors)).size
}

module.exports = { SITE_URL, standaloneUrl, countDistinctAnchors }
