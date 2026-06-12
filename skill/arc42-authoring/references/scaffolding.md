# Scaffolding

## Initial setup with docToolchain

Scaffold the arc42 "with-help" template into the project's `src/docs/` directory:

```bash
docToolchain downloadTemplate
```

Each chapter's help text is its structural spec — fill and then replace the help text as the documentation matures.

## Diagram conventions

- **Format**: PlantUML, not Mermaid
- **Building blocks**: C4 via PlantUML's bundled C4-PlantUML standard library
- **Include form**: `!include <C4/...>` (angle brackets = stdlib), never the remote `https://` URL, never vendored file copies
- **Style**: C4 containers and components, not generic boxes
- **Coverage**: Every context, building-block, and runtime chapter carries at least one diagram
