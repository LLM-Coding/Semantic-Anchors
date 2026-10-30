import { i18n } from '../i18n.js'
import { renderAppearances } from '../data/appearances.js'
import {
  catalogPrompt,
  CATALOG_VERSION,
  fromManifest,
  promptAttribute,
} from '../utils/talk-it-over.js'
import { SITE_URL } from '../utils/site.js'
import * as manifest from '../utils/llms-index-manifest.js'

const { LLMS_INDEX_VERSION } = manifest
const CATALOG_PROMPT = catalogPrompt(fromManifest(manifest))

const HERO_EXAMPLE_COUNT = 6

export function renderMain() {
  const exIdx = Math.floor(Math.random() * HERO_EXAMPLE_COUNT) + 1
  const keyWithout = `hero.example.${exIdx}.without`
  const keyPrefix = `hero.example.${exIdx}.prefix`
  const keyAnchor = `hero.example.${exIdx}.anchor`
  const keySuffix = `hero.example.${exIdx}.suffix`
  const keyExpansion = `hero.example.${exIdx}.expansion`

  return `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section id="hero" class="mb-10">
        <div>
          <!-- Bento PoC: the hero is one grid of tiles of unequal size. Tile
               placement lives in bento.css (grid areas), so the source order
               below stays the order screen readers and the tests expect. -->
          <div class="bento-hero">
          <div class="bento-tile bento-tile-title">
            <h1 class="bento-title" data-i18n="hero.title">${i18n.t('hero.title')}</h1>
            <p class="bento-lead" data-i18n="hero.intro">${i18n.t('hero.intro')}</p>
            <p class="bento-emphasis" data-i18n="hero.introEmphasis">${i18n.t('hero.introEmphasis')}</p>
          </div>

          <div class="bento-tile bento-tile-without">
            <div id="hero-without-label" class="bento-label" data-i18n="hero.withoutLabel">
              ${i18n.t('hero.withoutLabel')}
            </div>
            <p class="bento-prompt bento-prompt-long" tabindex="0" role="region" aria-labelledby="hero-without-label" data-i18n="${keyWithout}">
              ${i18n.t(keyWithout)}
            </p>
          </div>
          <div class="bento-tile bento-tile-with">
            <div class="bento-label" data-i18n="hero.withAnchorLabel">
              ${i18n.t('hero.withAnchorLabel')}
            </div>
            <p class="bento-prompt">
              <span data-i18n="${keyPrefix}">${i18n.t(keyPrefix)}</span><strong data-i18n="${keyAnchor}">${i18n.t(keyAnchor)}</strong><span data-i18n="${keySuffix}">${i18n.t(keySuffix)}</span>
            </p>
            <p class="bento-expansion" data-i18n="${keyExpansion}">${i18n.t(keyExpansion)}</p>
          </div>

          <!-- Third-party coverage belongs where people actually look. In the
               footer it sat below ~200 anchor cards, which nobody scrolls to.
               The four groups stay separately labelled: press is written
               about us, an appearance is a conversation we joined, a
               reference is someone else's project pointing here, and a
               listing is a directory or ranking that includes us. -->
          <section
            id="appearances"
            class="bento-tile bento-tile-appearances"
            aria-label="${i18n.t('footer.appearancesLabel')}"
          >
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span class="bento-label" data-i18n="footer.featuredIn">${i18n.t('footer.featuredIn')}</span>
              ${renderAppearances('press', import.meta.env.BASE_URL, (k) => i18n.t(k))}
              <span class="bento-divider" aria-hidden="true"></span>
              <span class="bento-label" data-i18n="footer.asSeenOn">${i18n.t('footer.asSeenOn')}</span>
              ${renderAppearances('appearance', import.meta.env.BASE_URL, (k) => i18n.t(k))}
              <span class="bento-divider" aria-hidden="true"></span>
              <span class="bento-label" data-i18n="footer.adaptedIn">${i18n.t('footer.adaptedIn')}</span>
              ${renderAppearances('adoption', import.meta.env.BASE_URL, (k) => i18n.t(k))}
              <span class="bento-divider" aria-hidden="true"></span>
              <span class="bento-label" data-i18n="footer.listedOn">${i18n.t('footer.listedOn')}</span>
              ${renderAppearances('listing', import.meta.env.BASE_URL, (k) => i18n.t(k))}
            </div>
          </section>

          <div class="bento-tile bento-tile-howto">
            <h2 class="bento-howto-title" data-i18n="hero.howToUseTitle">${i18n.t('hero.howToUseTitle')}</h2>
            <span class="bento-howto-arrow" aria-hidden="true">→</span>
          </div>
          <ol class="bento-steps">
            <li class="bento-tile bento-step">
              <span class="bento-step-num" aria-hidden="true">1</span>
              <span class="bento-step-text">
                <strong data-i18n="hero.step1Title">${i18n.t('hero.step1Title')}</strong> <span data-i18n="hero.step1Desc">${i18n.t('hero.step1Desc')}</span>
              </span>
            </li>
            <li class="bento-tile bento-step">
              <span class="bento-step-num" aria-hidden="true">2</span>
              <span class="bento-step-text">
                <strong data-i18n="hero.step2Title">${i18n.t('hero.step2Title')}</strong> <span data-i18n="hero.step2Desc">${i18n.t('hero.step2Desc')}</span>
              </span>
            </li>
            <li class="bento-tile bento-step">
              <span class="bento-step-num" aria-hidden="true">3</span>
              <span class="bento-step-text">
                <strong data-i18n="hero.step3Title">${i18n.t('hero.step3Title')}</strong> <span data-i18n="hero.step3Desc">${i18n.t('hero.step3Desc')}</span>
              </span>
            </li>
          </ol>

          <!-- The catalog, handed to the reader's own LLM as an INDEX: one link
               per anchor, 23 KB. llms.txt carries the same catalog as full text
               at over half a megabyte, which every LLM truncates — it would then
               answer from whatever happened to fit. Links let it fetch the two
               or three anchors the reader actually asked about. -->
          <div class="bento-tile bento-tile-talk">
            <talk-it-over
              url="${new URL(`${import.meta.env.BASE_URL}llms-index.txt?v=${LLMS_INDEX_VERSION}`, SITE_URL).href}"
              prompt="${promptAttribute(CATALOG_PROMPT)}"
              data-prompt="${CATALOG_VERSION}"
              label="${i18n.t('hero.talkCatalogTitle')}"
            ></talk-it-over>
            <span class="bento-small" data-i18n="hero.talkCatalogHint">
              ${i18n.t('hero.talkCatalogHint')}
            </span>
          </div>

          <div class="bento-tile bento-tile-stat" aria-hidden="true">
            <span class="bento-stat-figure hero-total-count">&nbsp;</span>
            <span class="bento-stat-label" data-i18n="filter.anchors">${i18n.t('filter.anchors')}</span>
          </div>

          <div class="bento-tile bento-tile-links">
            <a href="#/about" class="bento-link" data-i18n="main.aboutLink">${i18n.t('main.aboutLink')}</a>
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors/issues/new?template=propose-anchor.yml"
              target="_blank"
              rel="noopener noreferrer"
              class="bento-link"
              data-i18n="main.proposeAnchor"
            >${i18n.t('main.proposeAnchor')}</a>
            <a
              href="https://github.com/LLM-Coding/Semantic-Anchors"
              target="_blank"
              rel="noopener noreferrer"
              class="bento-link"
              data-i18n="main.starGithub"
            >${i18n.t('main.starGithub')}</a>
            <a href="#filters" class="bento-link bento-link-strong" data-i18n="hero.skipToCatalog">${i18n.t('hero.skipToCatalog')}</a>
          </div>
          </div>
        </div>
        </section>

        <section id="filters" class="mb-6 flex flex-wrap gap-3 items-center">
          <input
            id="search-input"
            type="search"
            data-i18n-placeholder="search.placeholder"
            placeholder="${i18n.t('search.placeholder')}"
            class="sm:hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors duration-300"
          />
          <select
            id="role-filter"
            class="sm:hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-colors duration-300"
          >
            <option value="" data-i18n="filter.allRoles">${i18n.t('filter.allRoles')}</option>
          </select>
          <span id="anchor-count-mobile" class="sm:hidden text-sm text-[var(--color-text-secondary)] ml-auto">
            <span id="visible-count-mobile">0</span> / <span id="total-count-mobile">0</span> <span data-i18n="filter.anchors">${i18n.t('filter.anchors')}</span>
          </span>
        </section>

        <div id="main-content"></div>
      </div>
    </main>
  `
}
