# Product Requirements Document (PRD)
## Semantic Anchors for LLMs - Website & Repository Redesign

**Version:** 1.0
**Date:** 2025-02-13
**Status:** Draft

---

## Executive Summary

The Semantic Anchors repository has grown from a simple README to a comprehensive catalog of 60+ semantic anchors across 10 categories. To better serve its growing user base and enable easier contributions, the project requires:

1. **Website**: A modern, bilingual (EN/DE), responsive website with dark/light mode
2. **Visualization**: Interactive treemap showing MECE-compliant categories and role-based filtering
3. **Repository Structure**: Modular AsciiDoc files replacing the monolithic README
4. **Contribution Workflow**: Automated issue templates and GitHub Actions/Copilot integration for proposing and adding new anchors

---

## Goals & Objectives

### Primary Goals
1. **Improve Discoverability**: Make semantic anchors easier to find through visualization and role-based filtering
2. **Lower Contribution Barrier**: Enable non-technical users to propose new anchors via structured issues
3. **Ensure Quality**: Automate validation that proposed terms meet semantic anchor criteria (precise, rich, consistent, attributable)
4. **Scale Content**: Support growth beyond 100+ anchors through modular structure

### Success Metrics
- Increase in contributions (issues, PRs) by 50% within 3 months
- Reduce time-to-merge for new anchors from manual review to semi-automated workflow
- Website traffic and user engagement (time on site, pages viewed)
- International reach (EN/DE usage split)

---

## User Personas

### Primary Users

**1. Software Developer (Sarah)**
- **Goal**: Find relevant anchors for code reviews, architecture discussions, TDD practices
- **Pain Points**: Current README is too long, hard to scan for relevant anchors
- **Needs**: Role-based filtering, quick search, code examples

**2. Software Architect (Marcus)**
- **Goal**: Reference architecture patterns, decision-making frameworks, quality practices
- **Pain Points**: Needs to share anchors with stakeholders who don't read GitHub
- **Needs**: Sharable links, professional presentation, cross-references between related anchors

**3. Product Owner / Business Analyst (Lisa)**
- **Goal**: Use requirements engineering and communication anchors (User Story Mapping, Impact Mapping, JTBD)
- **Pain Points**: Technical GitHub interface, terminology barrier
- **Needs**: Non-technical language option, role filter, examples from product context

**4. Technical Writer (Tom)**
- **Goal**: Apply documentation frameworks (Docs-as-Code, Diátaxis)
- **Pain Points**: Hard to find documentation-specific anchors among technical ones
- **Needs**: Category filtering, clear structure, contribution guidelines

**5. Contributor (Emma)**
- **Goal**: Propose new semantic anchors from her domain (UX, psychology, education)
- **Pain Points**: Unsure if a term qualifies as semantic anchor, complex contribution process
- **Needs**: Validation tool, simple issue template, clear feedback

### Secondary Users

**6. Educator / Trainer**
- Teaching software engineering concepts, needs reference material

**7. Consultant**
- Needs to quickly reference methodologies during client workshops

**8. QA Engineer / Tester**
- Focus on testing practices (TDD, Property-Based Testing, Mutation Testing)

**9. Data Scientist / Statistician**
- Interested in SPC, Control Charts, Nelson Rules

---

## User Stories

### Discovery & Navigation
- **US-01**: As a software developer, I want to filter anchors by my role so that I see only relevant methodologies
- **US-02**: As a user, I want to visualize anchor categories in a treemap so that I understand the knowledge domain structure
- **US-03**: As a user, I want to search anchors by keyword so that I can quickly find what I need
- **US-04**: As a user, I want to see related anchors so that I can explore connected concepts
- **US-05**: As a German speaker, I want to view the site in German so that I can understand content in my native language

### Reading & Understanding
- **US-06**: As a reader, I want collapsible anchor details so that I can scan quickly and expand when interested
- **US-07**: As a user, I want to switch between dark and light mode so that I can read comfortably in different environments
- **US-08**: As a mobile user, I want a responsive layout so that I can browse on my phone
- **US-09**: As a user, I want my language and theme preferences saved so that I don't have to reconfigure on each visit

### Contributing
- **US-10**: As a contributor, I want to propose a new anchor via a simple issue form so that I don't need to understand AsciiDoc
- **US-11**: As a contributor, I want automated validation of my proposed term so that I know if it qualifies as a semantic anchor
- **US-12**: As a contributor, I want an issue template that guides me through required fields (name, proponents, concepts, use cases)
- **US-13**: As a maintainer, I want GitHub Copilot to draft the AsciiDoc entry so that I can review and merge faster

### Integration
- **US-14**: As a developer, I want to link directly to specific anchors so that I can reference them in documentation or issues
- **US-15**: As a user, I want to see the anchor catalog rendered from the repository so that content is always up-to-date

---

## Role Mapping

Based on the current 60+ semantic anchors, the following roles provide meaningful groupings:

### Technical Roles
1. **Software Developer / Engineer** (35+ anchors)
   - Testing: TDD London/Chicago, Property-Based Testing, Mutation Testing, Testing Pyramid
   - Design: SOLID, DRY, Clean Architecture, Hexagonal Architecture
   - Development: Conventional Commits, Semantic Versioning, BEM, Mental Model (Naur)
   - Interaction: Rubber Duck Debugging, Chain of Thought, Five Whys

2. **Software Architect** (25+ anchors)
   - Architecture: arc42, C4-Diagrams, Clean Architecture, Hexagonal Architecture
   - Design: DDD, SOLID, SPOT, SSOT
   - Decision-Making: ADR (Nygard), MADR, Pugh-Matrix, Wardley Mapping
   - Communication: Pyramid Principle, MECE

3. **QA Engineer / Tester** (12+ anchors)
   - Testing: TDD, Property-Based Testing, Mutation Testing, Testing Pyramid
   - Quality: SPC, Control Charts, Nelson Rules
   - Process: Five Whys, Chain of Thought

4. **DevOps Engineer** (8+ anchors)
   - Development: Conventional Commits, Semantic Versioning
   - Monitoring: SPC, Control Charts, Nelson Rules
   - Practices: Five Whys, SPOT, SSOT

### Product & Business Roles
5. **Product Owner / Product Manager** (15+ anchors)
   - Requirements: User Story Mapping, Impact Mapping, JTBD, EARS
   - Communication: Pyramid Principle, BLUF, MECE
   - Decision-Making: Pugh-Matrix, Cynefin, Wardley Mapping
   - Interaction: Socratic Method, Five Whys

6. **Business Analyst / Requirements Engineer** (12+ anchors)
   - Requirements: User Story Mapping, Impact Mapping, JTBD, EARS, Problem Space NVC
   - Communication: Pyramid Principle, MECE, BLUF
   - Interaction: Socratic Method, Five Whys

### Specialized Roles
7. **Technical Writer / Documentation Specialist** (8+ anchors)
   - Documentation: Docs-as-Code, Diátaxis Framework, arc42
   - Communication: Pyramid Principle, MECE, BLUF
   - Practices: Feynman Technique, SPOT, SSOT

8. **UX Designer / Researcher** (6+ anchors)
   - Requirements: JTBD, User Story Mapping, Impact Mapping, Problem Space NVC
   - Interaction: Socratic Method, Five Whys

9. **Data Scientist / Statistician** (4+ anchors)
   - Statistical Methods: SPC, Control Charts, Nelson Rules
   - Quality: Property-Based Testing

10. **Consultant / Coach** (20+ anchors)
    - Strategy: Wardley Mapping, Cynefin, Impact Mapping
    - Communication: Pyramid Principle, MECE, BLUF, Socratic Method
    - Decision-Making: Pugh-Matrix, ADR, MADR
    - Practices: Five Whys, Feynman Technique, Devil's Advocate

11. **Team Lead / Engineering Manager** (18+ anchors)
    - Process: Five Whys, Cynefin, Mental Model (Naur)
    - Communication: Pyramid Principle, BLUF, MECE, Socratic Method
    - Quality: Testing Pyramid, SPC, Mutation Testing
    - Decision-Making: ADR, MADR, Pugh-Matrix

12. **Educator / Trainer** (12+ anchors)
    - Interaction: Socratic Method, Feynman Technique, Rubber Duck Debugging, Chain of Thought
    - Communication: Pyramid Principle, BLUF
    - Practices: TDD, DDD, SOLID

**Note**: Anchors can (and should) be mapped to multiple roles. Total unique anchors: 60+

---

## Functional Requirements

### FR-1: Website
- **FR-1.1**: Static website generated from repository content
- **FR-1.2**: Bilingual support (EN/DE) with language switcher
- **FR-1.3**: Dark/Light mode toggle
- **FR-1.4**: Responsive design (mobile, tablet, desktop)
- **FR-1.5**: Browser persistence for language and theme preferences (localStorage)
- **FR-1.6**: AsciiDoc rendering via asciidoctor.js
- **FR-1.7**: Deep linking to specific anchors (URL anchors)
- **FR-1.8**: Search functionality (client-side)

### FR-2: Visualization
- **FR-2.1**: Interactive treemap of categories (MECE-compliant)
- **FR-2.2**: Role-based filtering (multi-select)
- **FR-2.3**: Click on treemap node to navigate to anchor details
- **FR-2.4**: Visual indication of anchor density per category
- **FR-2.5**: Responsive treemap (adapts to screen size)

### FR-3: Content Structure
- **FR-3.1**: Split README.adoc into modular files:
  - `docs/index.adoc` (introduction, usage guide)
  - `docs/categories/testing-quality.adoc`
  - `docs/categories/architecture-design.adoc`
  - `docs/categories/<category-name>.adoc` (one per category)
  - `docs/anchors/<anchor-id>.adoc` (optional: one file per anchor for deep modularity)
- **FR-3.2**: Metadata file for each anchor (YAML/JSON):
  - Categories
  - Roles
  - Related anchors
  - Tags/keywords
- **FR-3.3**: Automated generation of category overview pages

### FR-4: Contribution Workflow
- **FR-4.1**: Issue templates:
  - "Propose New Semantic Anchor" (simple form: term + why)
  - "Add Detailed Semantic Anchor" (full template with all fields)
  - "Improve Existing Anchor" (reference existing + proposed changes)
- **FR-4.2**: GitHub Actions workflow:
  - Triggered on issue creation with label "new-anchor"
  - Uses GitHub Copilot API to validate if term is a semantic anchor
  - Posts comment with validation result and guidance
- **FR-4.3**: GitHub Actions workflow for anchor addition:
  - Triggered when maintainer assigns issue to Copilot
  - Generates AsciiDoc entry based on issue content
  - Creates PR with generated content for review
- **FR-4.4**: Contribution guide (CONTRIBUTING.md) with:
  - How to propose anchors
  - Quality criteria
  - Testing methodology
  - Review process

### FR-5: Deployment
- **FR-5.1**: Automated deployment to GitHub Pages on push to main
- **FR-5.2**: Preview deployments for PRs (via GitHub Actions)
- **FR-5.3**: Build status badge in README

---

## Non-Functional Requirements

### NFR-1: Performance
- **NFR-1.1**: Page load time < 2 seconds on 3G connection
- **NFR-1.2**: Lighthouse score > 90 (Performance, Accessibility, Best Practices, SEO)
- **NFR-1.3**: Treemap rendering < 500ms for 100 anchors

### NFR-2: Accessibility
- **NFR-2.1**: WCAG 2.1 Level AA compliance
- **NFR-2.2**: Keyboard navigation support
- **NFR-2.3**: Screen reader compatibility
- **NFR-2.4**: Sufficient color contrast (dark and light mode)

### NFR-3: Maintainability
- **NFR-3.1**: Modular code structure
- **NFR-3.2**: Clear separation of content (AsciiDoc) and presentation (website)
- **NFR-3.3**: Documented build process
- **NFR-3.4**: Automated testing for website (unit, e2e)

### NFR-4: Scalability
- **NFR-4.1**: Support 200+ anchors without performance degradation
- **NFR-4.2**: Support 15+ categories
- **NFR-4.3**: Support 20+ roles

---

## Technical Requirements

### Tech Stack Decision Points

**Static Site Generator** (to be decided):
- **Option A: Astro** (Recommended)
  - ✅ Fast, modern, component-agnostic
  - ✅ Excellent i18n support
  - ✅ Built-in island architecture (interactive treemap)
  - ✅ Good DX, active community
  - ❓ Need to evaluate AsciiDoc integration

- **Option B: VitePress**
  - ✅ Vue-based, simple setup
  - ✅ Good documentation focus
  - ✅ Built-in i18n
  - ⚠️ Less flexible for custom visualizations

- **Option C: Docusaurus**
  - ✅ React-based, mature
  - ✅ Excellent documentation features
  - ✅ Strong i18n support
  - ⚠️ Heavier, more opinionated

**Recommendation**: Astro for flexibility + performance, unless AsciiDoc integration is problematic (then Docusaurus).

### TR-1: Frontend
- Static Site Generator: **Astro** (pending confirmation)
- AsciiDoc rendering: **asciidoctor.js**
- Visualization: **D3.js** or **Apache ECharts** for treemap
- Styling: **Tailwind CSS** (responsive, dark mode support)
- i18n: **i18next** or framework-native solution
- Build: **Vite** (included with Astro)

### TR-2: Backend / Automation
- GitHub Actions for CI/CD
- GitHub Copilot API for semantic anchor validation
- YAML/JSON for anchor metadata

### TR-3: Hosting
- **GitHub Pages**
- Custom domain (optional): `semantic-anchors.dev` or similar

### TR-4: Repository Structure
```
semantic-anchors/
├── .github/
│   ├── workflows/
│   │   ├── deploy.yml (deploy to GitHub Pages)
│   │   ├── preview.yml (PR preview deployments)
│   │   ├── validate-anchor.yml (Copilot validation on issue)
│   │   └── generate-anchor.yml (Copilot PR generation)
│   └── ISSUE_TEMPLATE/
│       ├── propose-anchor.yml
│       ├── detailed-anchor.yml
│       └── improve-anchor.yml
├── docs/
│   ├── index.adoc
│   ├── categories/
│   │   ├── testing-quality.adoc
│   │   ├── architecture-design.adoc
│   │   └── ...
│   └── metadata/
│       ├── categories.yml (MECE category definitions)
│       ├── roles.yml (role definitions)
│       └── anchors.yml (anchor metadata: roles, categories, related)
├── website/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   │   ├── Treemap.astro
│   │   │   ├── RoleFilter.astro
│   │   │   └── AnchorCard.astro
│   │   ├── layouts/
│   │   └── i18n/
│   ├── public/
│   └── astro.config.mjs
├── scripts/
│   └── generate-metadata.js (extract metadata from AsciiDoc)
├── CLAUDE.md
├── PRD.md
├── CONTRIBUTING.md
├── README.md (project overview, links to website)
└── package.json
```

---

## Success Criteria

### Minimum Viable Product (MVP)
- [ ] Website deployed to GitHub Pages
- [ ] Bilingual (EN/DE) support
- [ ] Dark/Light mode
- [ ] Responsive design
- [ ] All existing anchors migrated to modular structure
- [ ] Basic treemap visualization
- [ ] Role-based filtering (top 5 roles)
- [ ] One issue template ("Propose New Anchor")
- [ ] Updated README and CONTRIBUTING guide

### Future Enhancements (Post-MVP)
- [ ] GitHub Copilot validation workflow
- [ ] GitHub Copilot PR generation workflow
- [ ] Advanced search (fuzzy, multi-field)
- [ ] Anchor relationship graph (network visualization)
- [ ] User analytics (privacy-respecting)
- [ ] RSS feed for new anchors
- [ ] API endpoint for programmatic access

---

## Out of Scope

The following are explicitly **not** included in this project phase:

- User accounts / authentication
- User-generated content (comments, ratings)
- CMS / admin interface
- Mobile app
- AI chat interface
- Anchor versioning / history (beyond git)
- Multilingual beyond EN/DE
- Full-text translation of anchor content (only UI/navigation elements)

---

## Timeline & Milestones

### Phase 1: Foundation & Planning (Week 1-2)
- [ ] MECE analysis of current categories
- [ ] Finalize role mapping
- [ ] Finalize tech stack decision
- [ ] Create repository structure
- [ ] Split README.adoc into modular files
- [ ] Create metadata files (categories.yml, roles.yml, anchors.yml)

### Phase 2: Website Development (Week 3-5)
- [ ] Setup Astro project
- [ ] Implement layout, dark/light mode, responsive design
- [ ] Implement i18n (EN/DE)
- [ ] Integrate asciidoctor.js
- [ ] Build category/anchor browsing pages
- [ ] Implement treemap visualization
- [ ] Implement role filtering

### Phase 3: Automation & Deployment (Week 6-7)
- [ ] GitHub Actions for deployment
- [ ] PR preview deployments
- [ ] Issue templates
- [ ] CONTRIBUTING.md guide
- [ ] Testing (e2e, accessibility)
- [ ] Launch MVP

### Phase 4: Enhancement (Week 8+)
- [ ] GitHub Copilot workflows
- [ ] Advanced search
- [ ] User feedback integration
- [ ] Analytics setup

---

## Open Questions

1. **AsciiDoc Metadata**: Should metadata be embedded in AsciiDoc frontmatter or separate YAML files?
   - **Recommendation**: Separate YAML for easier programmatic access

2. **Anchor Granularity**: One file per anchor or one file per category?
   - **Recommendation**: Start with one file per category, split to individual files if needed for scalability

3. **Treemap Library**: D3.js (flexible, complex) vs. Apache ECharts (easier, less flexible) vs. Plotly (balanced)?
   - **Recommendation**: Apache ECharts for ease + good-enough flexibility

4. **Translation Approach**: Human translation or machine translation with review?
   - **Recommendation**: Human translation for quality, start with UI elements, anchor content can remain EN-only initially

5. **MECE Category Validation**: Should we run formal MECE analysis workshop or asynchronous review?
   - **Recommendation**: Asynchronous review with documentation of overlaps and gaps

---

## Approval

**Product Owner**: _[Ralf D. Müller]_
**Date**: _[Pending]_

**Technical Lead**: _[Claude Code]_
**Date**: 2025-02-13

---

## Appendix A: MECE Analysis (To Be Completed in Phase 1)

To be added after analysis of current categories against MECE criteria.

## Appendix B: Wireframes (To Be Completed in Phase 2)

To be added during website design phase.
