# Onboarding Modal Design

**Issue:** #145
**Date:** 2026-03-08

## Overview

Modal dialog explaining Semantic Anchors to first-time visitors. Combines logo, explainer video (YouTube Shorts), and concise text.

## Components

### 1. `onboarding-modal.js`

New component (separate from anchor-modal.js):
- `createOnboardingModal()`: Singleton DOM creation
- `showOnboarding()`: Opens modal, sets `overflow: hidden`
- `closeOnboarding()`: Closes, saves `localStorage.setItem('onboarding-seen', 'true')`
- `shouldShowOnboarding()`: Checks `localStorage.getItem('onboarding-seen')`

### 2. Layout

**Desktop:** Logo top, slogan highlighted, video (YouTube embed) left + text right, CTA button bottom.

**Mobile:** Logo top, slogan highlighted, text, YouTube link (no embed), CTA button bottom.

### 3. Header Change

Info icon (i) button next to site title. Calls `showOnboarding()`.

### 4. i18n Keys

New keys in en.json/de.json: `onboarding.slogan1`, `onboarding.slogan2`, `onboarding.text1`-`text4`, `onboarding.cta`, `onboarding.watchVideo`, `onboarding.infoButton`

### 5. Videos

- EN: https://youtube.com/shorts/Fb7t45E8_HE
- DE: https://youtube.com/shorts/cp-qqiHU-MA

### 6. Text Content

**Slogan:**
- EN: "Semantic Anchors. One word, and the AI gets the rest."
- DE: "Semantic Anchors. Ein Wort, und die KI versteht den Rest."

**Body (4 paragraphs, condensed from video scripts):**

EN:
1. Imagine saying just one word - and your counterpart instantly understands an entire concept.
2. A Semantic Anchor is an established term that activates an entire body of knowledge. Like an anchor holding a ship in place - a Semantic Anchor pins your conversation to a precise concept.
3. This works because AI models were trained on millions of texts. Terms like MECE, Clean Architecture, or the Feynman Technique instantly trigger deep contextual knowledge.
4. Instead of writing long prompts, just use the right anchor - and the AI delivers.

DE:
1. Stell dir vor, du sagst ein einziges Wort - und dein Gegenüber versteht sofort ein ganzes Konzept.
2. Ein Semantic Anchor ist ein etablierter Begriff, der ein ganzes Wissensgebiet aktiviert. Wie ein Anker, der ein Schiff an einem festen Punkt hält - so verankert ein Semantic Anchor dein Gespräch an einem präzisen Konzept.
3. Das funktioniert, weil KI-Modelle auf Millionen von Texten trainiert wurden. Begriffe wie MECE, Clean Architecture oder Feynman-Technik lösen sofort tiefes Kontextwissen aus.
4. Statt lange Prompts zu schreiben, sagst du einfach den richtigen Anker - und die KI liefert.

### 7. Accessibility

- Focus trap in modal
- ESC to close
- `role="dialog"`, `aria-modal="true"`

### 8. Not Included (YAGNI)

- No open/close animation
- No "don't show again" checkbox
- No analytics
