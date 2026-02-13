# Public Directory

This directory contains static files served by Vite.

## Documentation Files

The following files are copied here from the project root during development and build:

- `CONTRIBUTING.adoc` - Contributing guide (source: `/CONTRIBUTING.adoc`)
- `docs/about.adoc` - About page content (source: `/docs/about.adoc`)
- `docs/anchors/*.adoc` - Individual anchor files (source: `/docs/anchors/`)

**These files are gitignored** as they are copied automatically by the deployment workflow.

## Deployment

In the GitHub Actions workflow (`.github/workflows/deploy.yml`), these files are copied before the build step:

```yaml
- name: Copy documentation files to public directory
  run: |
    mkdir -p website/public/docs
    cp -r docs/anchors website/public/docs/
    cp docs/about.adoc website/public/docs/
    cp CONTRIBUTING.adoc website/public/
```

For local development, run this command from the project root:

```bash
mkdir -p website/public/docs
cp -r docs/anchors website/public/docs/
cp docs/about.adoc website/public/docs/
cp CONTRIBUTING.adoc website/public/
```
