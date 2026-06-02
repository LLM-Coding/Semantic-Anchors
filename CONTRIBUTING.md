# Contributing to Semantic Anchors

Thank you for your interest in contributing to the Semantic Anchors catalog! This project aims to build a curated collection of well-defined terms, methodologies, and frameworks that serve as reference points when communicating with Large Language Models (LLMs).

## Table of Contents

- [How to Propose a New Anchor](#how-to-propose-a-new-anchor)
- [Quality Criteria for Semantic Anchors](#quality-criteria-for-semantic-anchors)
- [Testing Methodology](#testing-methodology)
- [Improving Existing Anchors](#improving-existing-anchors)
- [Development Setup](#development-setup)
- [Pull Request Workflow](#pull-request-workflow)
- [Code of Conduct](#code-of-conduct)

## How to Propose a New Anchor

### Using the Issue Template (Recommended)

1. Go to [Issues](https://github.com/LLM-Coding/Semantic-Anchors/issues/new/choose)
2. Select **"🌟 Propose New Semantic Anchor"**
3. Fill out the template completely
4. Submit the issue

The maintainers will review your proposal and provide feedback.

### What Makes a Good Proposal

A good proposal includes:
- **Clear name**: The term or phrase that serves as the anchor
- **Full explanation**: What concepts does this anchor activate?
- **Key proponents**: Who originated or standardized this concept?
- **Use cases**: When should someone invoke this anchor?
- **LLM test results**: Evidence that LLMs recognize and respond appropriately

## Quality Criteria for Semantic Anchors

Before proposing an anchor, verify it meets these criteria:

### ✅ Precise
References a specific, established body of knowledge with clear boundaries.
- ✓ "TDD, London School" - specific variant with defined practices
- ✗ "Best practices" - too vague, no clear boundaries

### ✅ Rich
Activates multiple interconnected concepts, not just a single instruction.
- ✓ "SOLID Principles" - triggers S.O.L.I.D. breakdown, design patterns, OOP principles
- ✗ "TLDR" - just means "summarize," no conceptual depth

### ✅ Consistent
Different users invoking it get similar conceptual activation.
- ✓ "Clean Architecture" - well-documented pattern, consistent interpretation
- ✗ "ELI5" - vague target level, inconsistent results

### ✅ Attributable
Can be traced to key proponents, publications, or documented standards.
- ✓ "Hexagonal Architecture" - Alistair Cockburn, documented pattern
- ✗ "Keep it simple" - no clear origin, just general advice

### ❌ Counter-Examples (NOT Semantic Anchors)

- **"TLDR"** - Underspecified, no defined structure
- **"ELI5"** - Vague target level, no pedagogical framework
- **"Keep it short/simple"** - Pure instruction, no conceptual depth
- **"Best practices"** - Too broad, no specific framework

## Testing Methodology

**IMPORTANT:** Always test your proposed anchor with an LLM before submitting.

### Test Prompt

```
What concepts do you associate with '<your anchor name>'?
```

> **Note:** The proposal template includes a required **LLM Activation Test Result** field. Paste your test output there — it front-loads the Precise/Rich/Consistent signal for reviewers.

### Evaluate the Response

Ask yourself:
- **Recognition**: Does the LLM recognize the term?
- **Accuracy**: Is the interpretation correct?
- **Depth**: Does it activate multiple related concepts?
- **Specificity**: Is the response focused and detailed?

### Example: Good Test Result

**Prompt:** "What concepts do you associate with 'SOLID Principles'?"

**Response should include:**
- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle
- Object-oriented design
- Robert C. Martin (Uncle Bob)

If the LLM provides a detailed, accurate response like this, your anchor is likely good!

### Example: Poor Test Result

**Prompt:** "What concepts do you associate with 'TLDR'?"

**Response might be:**
- "Too Long; Didn't Read"
- Means to summarize
- Used in online communication

This lacks depth and doesn't activate a rich conceptual framework.

## Improving Existing Anchors

Found an issue with an existing anchor? We welcome improvements!

1. Go to [Issues](https://github.com/LLM-Coding/Semantic-Anchors/issues/new/choose)
2. Select **"📝 Improve Existing Anchor"**
3. Fill out the form:
   - Which anchor needs improvement?
   - What's wrong or missing?
   - What change do you propose?
   - References supporting your suggestion
4. Submit the issue

## Development Setup

If you want to contribute code or work on the website:

### Prerequisites

- Node.js 20+
- npm or pnpm
- Git

### Clone the Repository

```bash
git clone https://github.com/LLM-Coding/Semantic-Anchors.git
cd Semantic-Anchors
```

### Install Dependencies

Both `website/` and `scripts/` have their own `package.json`. Install both:

```bash
# Script dependencies (needed for anchor syncing and doc rendering)
cd scripts
npm install

# Website dependencies
cd ../website
npm install
```

### Run Development Server

Always use `npm run dev` (not `npx vite` directly). The `predev` hook syncs anchor `.adoc` files from `docs/anchors/` into `website/public/docs/anchors/`. Without this step, clicking anchor cards results in a 404 error.

```bash
cd website
npm run dev
# → http://localhost:5173/Semantic-Anchors/
```

> **Note:** The dev server URL includes `/Semantic-Anchors/` because of the Vite `base` configuration. This matches the GitHub Pages deployment path.

### Run Tests

```bash
cd website
npm run test
```

### Build for Production

The `prebuild` hook runs three steps automatically: syncing anchors, rendering docs, and rendering contracts. Then Vite builds the bundle and pre-renders static routes.

```bash
cd website
npm run build
```

## Pull Request Workflow

### For Code Contributions

1. **Fork the repository** (if you're not a maintainer)
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write/update tests** if applicable
5. **Run tests**:
   ```bash
   npm run test
   ```
6. **Commit your changes**:
   ```bash
   git commit -m "feat: Add feature description"
   ```
   Use [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `test:` - Test changes
   - `chore:` - Maintenance tasks
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** on GitHub
9. **Wait for review** - Maintainers will review and provide feedback

### For New Anchors

**Note:** Currently, new anchors are added via maintainer workflow after issue approval. In the future (Phase 4), this will be automated via GitHub Copilot.

**Current Process:**
1. Create an issue using the **"Propose New Anchor"** template
2. Maintainers review and approve
3. Maintainers create the anchor file and PR
4. Community reviews the PR

## Issue Title Convention

All issues should follow a consistent `[Type]: <Name>` title format. This makes filtering, searching, and triaging materially easier.

### Recognized Prefixes

| Prefix | Used For | Source |
|--------|----------|--------|
| `[Anchor Proposal]:` | New semantic anchor proposals | Issue template |
| `[Contract Proposal]:` | New semantic contract proposals | Issue template |
| `[Improve]:` | Improvements to existing anchors | Issue template |
| `[Bug]:` | Bug reports | Issue template |
| `[Process Proposal]:` | Changes to project processes | Issue template |
| `[Feature]:` | Feature requests | Free-form |
| `EPIC:` | Tracking issues for larger initiatives | Free-form |

### Guidelines

- **Use the issue template** whenever one exists — the prefix is set automatically.
- **Free-form issues** (no matching template) should manually use one of the recognized prefixes.
- **Apply going forward only** — do not retro-rename closed issues.
- **EPICs** use the bare `EPIC:` prefix without brackets, as a sanctioned exception.

## Code of Conduct

### Our Pledge

We pledge to make participation in this project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behaviors:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project maintainers. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances.

## Questions?

- **General questions**: [GitHub Discussions](https://github.com/LLM-Coding/Semantic-Anchors/discussions)
- **Bug reports**: Use the [Bug Report template](https://github.com/LLM-Coding/Semantic-Anchors/issues/new/choose)
- **Feature requests**: Open a [new issue](https://github.com/LLM-Coding/Semantic-Anchors/issues/new)

## License

By contributing to Semantic Anchors, you agree that your contributions will be licensed under the same license as the project (see [LICENSE](LICENSE)).

---

Thank you for contributing to Semantic Anchors! 🎉
