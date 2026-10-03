/**
 * Where Semantic Anchors has been covered or discussed.
 *
 * The list itself lives in appearances.json, because it is read from two
 * module systems: this ESM module renders it for the app (footer and the
 * strip under the landing hero), and scripts/prerender-routes.js — plain
 * CommonJS — reads the same JSON to emit the static home page. A .js module
 * could not serve both without an async refactor of that script.
 *
 * `kind` splits the list into the three groups the site labels differently:
 * 'press' is coverage written about us, 'appearance' is a conversation we
 * took part in, and 'adoption' is someone else's project referring to this
 * catalog. They are not the same claim and are not merged.
 *
 * The row says "Adapted in", and the entries are kept narrow enough for that
 * to be true: one rebuilt the catalog, one enforces it as a plugin, two took
 * it into their own conventions. A row label has to hold for every entry
 * beneath it, so a project that merely mentions the catalog in passing does
 * not belong here — it would make the label overstate the rest. That is the
 * test to apply before adding one.
 *
 * `logo` is optional. An adoption entry usually has no mark we are licensed
 * to show, so it renders as a label alone rather than as a broken image.
 *
 * `titleKey` is rendered twice on purpose: as `title` for a mouse, and as
 * sr-only text inside the link for everyone else. A tooltip is invisible to
 * keyboard and touch users and is not reliably announced, and a label like
 * "speq-skill (EN)" says nothing on its own about what that project did.
 */

import appearances from './appearances.json'

export const APPEARANCES = appearances

const SEPARATOR = '<span class="text-gray-300 dark:text-gray-600">|</span>'

function renderOne(entry, basePath, t) {
  const imgClass = entry.imgClass || 'h-6 w-auto'
  const linkClass = [
    'inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity',
    // An inline link in a dense strip gives a keyboard user nothing to see
    // without this: the default outline is suppressed site-wide.
    'rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]',
    entry.linkClass || '',
  ]
    .join(' ')
    .trim()
  const labelClass = entry.labelClass || 'text-[var(--color-text-secondary)]'
  const img = entry.logo
    ? `<img
                src="${basePath}${entry.logo}"
                alt="${entry.alt}"
                width="${entry.width}"
                height="${entry.height}"
                class="${imgClass}"
                loading="lazy"
              />
              `
    : ''
  return `<a
              href="${entry.href}"
              target="_blank"
              rel="noopener noreferrer"
              class="${linkClass}"
              title="${t(entry.titleKey)}"
            >
              ${img}<span class="text-xs ${labelClass}">${entry.label}</span><span class="sr-only"> — ${t(entry.titleKey)}</span>
            </a>`
}

/**
 * Render the links of one group, separated by the usual pipe. Returns '' when
 * the group is empty, so a caller can drop the whole row without a special
 * case.
 */
export function renderAppearances(kind, basePath, t) {
  return APPEARANCES.filter((entry) => entry.kind === kind)
    .map((entry) => renderOne(entry, basePath, t))
    .join(`\n            ${SEPARATOR}\n            `)
}
