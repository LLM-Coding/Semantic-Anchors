Use these semantic anchors as the default working vocabulary unless the user overrides them.

- `{{PRIMARY_ANCHOR_1}}`: `{{PRIMARY_EXPLAINER_1}}`
- `{{PRIMARY_ANCHOR_2}}`: `{{PRIMARY_EXPLAINER_2}}`
- `{{PRIMARY_ANCHOR_3}}`: `{{PRIMARY_EXPLAINER_3}}`

Precedence rules:

- Explicit user instructions override these defaults.
- If two anchors point to different actions, ask which one should dominate before making a major change.
- Keep the selected set small and stable; move exploratory anchors back to task-local prompting.
