# Cross-Section Traceability Rules

arc42 templates do not enforce these connections between chapters. This skill does.

## The five rules

1. **Quality Goal → Strategy**: Every Chapter 1.2 quality goal maps to a named approach in Chapter 4 (Solution Strategy).

2. **Context ↔ Building Blocks**: The external systems in Chapter 3 (System Scope and Context) and the Chapter 5 Level-1 building-block view are the same set — one system boundary in both.

3. **Building Block → Runtime**: Every Chapter 5 building block appears in at least one Chapter 6 runtime scenario. Chapter 6 includes at least one error/recovery scenario, not only the happy path.

4. **ADR Index**: Chapter 9 carries an in-document ADR index (ADR | Title | Status), even when the ADRs live in a separate register.

5. **Building Block Completeness**: Each Chapter 5 building block states responsibility, interface, and source location.

## Verification checklist

After producing or updating chapters, verify:

- [ ] Every Chapter 1.2 goal appears by name in Chapter 4
- [ ] Chapter 3 external systems = Chapter 5 Level-1 boundary elements
- [ ] No Chapter 5 building block is absent from Chapter 6
- [ ] Chapter 6 contains ≥1 error/recovery scenario
- [ ] Chapter 9 index is up to date
- [ ] Every Chapter 5 block has: responsibility, interface, source location
