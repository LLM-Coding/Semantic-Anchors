# Worked Examples — [ANSWERED] and [OPEN] Leaves

Concrete examples for each major branch. Use these as templates when phrasing your own leaves. All examples are from a hypothetical *Order Management* bounded context in a small e-commerce backend.

## Q1 — Problem and Users

### Q1.1: Who is the primary user of this bounded context?

```
[ANSWERED]
Evidence: src/auth/Role.java:8 (enum entries), src/api/OrderController.java:18 (@PreAuthorize("hasRole('MANAGER')"))
Users with role MANAGER (Sales Managers) place orders on behalf of
end customers. Customers themselves never interact with this bounded
context directly.
```

### Q1.3: What problem does placing-orders-on-behalf-of-customers solve?

```
[OPEN]
Category: business-context
Ask role: Product Owner, Domain Expert
The code shows the workflow but not the motivation. Is this a phone-sales
channel, a B2B account-management channel, or migration from a legacy
system that did the same? Affects how Q2 use cases should be structured.
```

## Q2 — Specification

### Q2.PUC.PlaceOrder.Trigger

```
[ANSWERED]
Evidence: src/api/OrderController.java:18-25
A Sales Manager triggers the use case by submitting POST /orders with
JSON body { customerId, items[], shippingAddress }. Authentication is
session-based via the existing Auth filter.
```

### Q2.PUC.PlaceOrder.Postconditions

```
[OPEN]
Category: business-context
Ask role: Product Owner, Domain Expert
Code persists status=PENDING and publishes OrderCreated, but no transition
from PENDING is visible in this bounded context (src/service/OrderService.java
line 92 is the last touch). Is PENDING a final state for this bounded
context — i.e. fulfilment lives in a different bounded context — or is the
transition missing? The answer changes whether this use case's Postconditions
should mention "order is queued for fulfilment" or "order is created and
visible to the manager".
```

### Q2.SUC.CreateOrderEndpoint.ErrorResponses

```
[ANSWERED]
Evidence: src/api/OrderController.java:30-58, src/api/ApiExceptionHandler.java:42-71
The endpoint returns:
- 201 Created with order id on success
- 400 Bad Request with field-level errors when validation fails (handled
  in OrderController, lines 30-48)
- 404 Not Found with message "customer not found" when customerId resolves
  to no Customer (lines 50-55)
- 409 Conflict when inventory reservation fails (catches
  InventoryUnavailableException, lines 56-58)
- 500 Internal Server Error from the global handler in ApiExceptionHandler
  for unexpected failures
```

## Q3 — Architecture

### Q3.5: How is the bounded context decomposed into modules?

```
[ANSWERED]
Evidence: src/api/, src/service/, src/persistence/, src/integration/, src/domain/
Five-package decomposition following a hexagonal-architecture-like layout:
- api/ — HTTP controllers, request/response DTOs
- service/ — application services (OrderService, ValidationService)
- domain/ — entities (Order, OrderLine, Customer reference)
- persistence/ — JPA repositories and entity adapters
- integration/ — adapters to Inventory, Pricing, Notification services
Dependencies point inward: api → service → domain. persistence and
integration are adapters depended on by service via ports defined in domain.
```

### Q3.1: Which 3-5 quality goals drive the design?

```
[OPEN]
Category: quality-goals
Ask role: Architect, Product Owner
Code shows mechanisms for several characteristics (idempotency keys,
optimistic locking, audit logging) but does not reveal the priority
ranking. A clear top-3 from Architect + Product Owner is required to
proceed with the Q4 sub-tree and to fill the Pugh matrices in Q3.9 ADRs.
```

## Q3.9 — Architecture Decisions (ADRs)

### Q3.9.HexagonalArchitecture.Decision

```
[ANSWERED]
Evidence: src/domain/OrderRepositoryPort.java, src/persistence/OrderRepositoryAdapter.java, src/integration/InventoryClientPort.java
The system uses Hexagonal Architecture. Domain defines ports (interfaces);
adapters in persistence/ and integration/ implement them; service/ depends
on the ports, not the adapters.
```

### Q3.9.HexagonalArchitecture.Context

```
[OPEN]
Category: design-rationale
Ask role: Architect
The code shows the choice was made, but not why. Was the prior layered
architecture causing test pain? Was the team anticipating multiple
persistence options? Was this driven by an architecture standard outside
this repo? Affects whether the ADR should recommend continuing the
pattern in adjacent bounded contexts.
```

### Q3.9.HexagonalArchitecture.PughMatrix

```
[OPEN]
Category: design-rationale
Ask role: Architect
Alternatives the LLM can list from common practice: Layered Architecture,
Clean Architecture, modular monolith without hexagonal ports. Need the
architect to confirm which were actually considered, score them against
the Q4 priorities once those are answered, and explain the choice.
```

## Q4 — Quality Goals

### Q4.6: How is Security implemented?

```
[ANSWERED]
Evidence: src/auth/AuthFilter.java, src/auth/Role.java, src/api/OrderController.java:18 (@PreAuthorize)
- AuthN: session-based, validated in AuthFilter
- AuthZ: role-based via Spring @PreAuthorize annotations on controllers
- Transport: HTTPS termination is external (no TLS code in this repo)
- Audit: no audit logging in this bounded context
```

### Q4.6.target: What is the Security target for this bounded context?

```
[OPEN]
Category: quality-goals
Ask role: Architect, Operations
Mechanisms are visible but the target is not. Specifically:
- Is audit logging required, and at what granularity (every state change?
  only failed authZ?)
- Are there compliance frameworks in scope (PCI, GDPR, SOC2)?
- What is the threat model — internal abuse, external attackers, both?
Answers affect whether Q3.11 (Risks) flags absent audit logging as debt.
```

## Q5 — Risks and Technical Debt

### Q5.2: What test debt exists?

```
[ANSWERED]
Evidence: src/service/OrderService.java::create (66 lines, cyclomatic complexity 14), test/service/OrderServiceTest.java (3 happy-path tests, no edge-case coverage)
OrderService.create has 14 branches; only the happy path plus two
validation-failure paths have tests. Inventory-failure, persistence-failure,
and notification-failure branches are untested. Adding tests is straightforward
once the team confirms intended behaviour for each branch (see Q2.SUC).
```

### Q5.4: What technical debt is the team already tracking?

```
[OPEN]
Category: future-direction
Ask role: Developer, Architect
No TODO/FIXME/HACK comments in this bounded context, no ADRs marking
decisions as "Superseded", no `.deprecated` package. Either the team has
no tracked debt (unlikely) or the tracking lives elsewhere (issue tracker,
team wiki). Need a pointer to where debt is recorded.
```

## Patterns to copy

- **State the source of the answer explicitly.** "Evidence: file:line" is short, scannable, and verifiable.
- **One claim per leaf.** If a leaf says "and also...", split it.
- **Make `[OPEN]` actionable.** A team member should be able to answer the question without reading the code first. State enough context that the question stands alone.
- **Don't over-decompose `[ANSWERED]` leaves.** Once you can cite file:line and write a 1-3 sentence answer, stop.
- **Don't under-decompose `[OPEN]` leaves.** If the answer would require multiple paragraphs from the team, the question is too broad; split it.
