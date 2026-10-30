/**
 * Add `loading="lazy"` and `decoding="async"` to rendered images (#872), except
 * the first `eager` ones, which are likely above the fold. Asciidoctor.js does
 * not emit these attributes from the image macro, so render-docs adds them.
 * Images that already set `loading` are left alone.
 */
function lazyImages(html, eager = 3) {
  let seen = 0
  return String(html).replace(/<img\b([^>]*)>/g, (tag, attrs) => {
    seen += 1
    if (seen <= eager || /\sloading=/.test(attrs)) return tag
    return `<img${attrs} loading="lazy" decoding="async">`
  })
}

module.exports = { lazyImages }
