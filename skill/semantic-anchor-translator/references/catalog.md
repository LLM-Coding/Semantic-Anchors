# Semantic Anchors Catalog

Source: https://github.com/LLM-Coding/Semantic-Anchors

## Testing & Quality

### TDD, London School
- **Also known as:** Mockist TDD, Outside-In TDD
- **Proponents:** Steve Freeman, Nat Pryce
- **Core:** Mock-heavy, outside-in development, interaction-based testing, interface discovery

### TDD, Chicago School
- **Also known as:** Classicist TDD, Detroit School
- **Proponents:** Kent Beck, Martin Fowler
- **Core:** State-based testing, real objects over mocks, refactoring-focused

### Testing Pyramid
- **Core:** Many unit tests, fewer integration tests, fewest E2E tests

### Mutation Testing
- **Proponents:** Richard Lipton, Richard DeMillo
- **Core:** Inject faults into code, verify tests catch them

### Property-Based Testing
- **Core:** Test properties/invariants with generated inputs (QuickCheck, Hypothesis)

### IEC 61508 SIL Levels
- **Proponents:** International Electrotechnical Commission
- **Core:** Safety integrity levels for safety-critical systems

## Software Architecture

### Clean Architecture
- **Core:** Dependency rule, entities at center, frameworks at edge

### Hexagonal Architecture (Ports & Adapters)
- **Core:** Business logic isolated via ports, adapters for external systems

### Domain-Driven Design (DDD)
- **Proponents:** Eric Evans
- **Core:** Ubiquitous language, bounded contexts, aggregates, entities, value objects

### arc42 Architecture Documentation
- **Proponents:** Gernot Starke, Peter Hruschka
- **Core:** 12-section template for documenting software architecture

### CQRS (Command Query Responsibility Segregation)
- **Proponents:** Greg Young, Bertrand Meyer, Udi Dahan
- **Core:** Separate read/write models, commands return void, queries return data with no side effects, independent scalability

### C4-Diagrams
- **Core:** Context, Container, Component, Code — 4 zoom levels

### ADR according to Nygard
- **Proponents:** Michael Nygard
- **Core:** Lightweight decision records: Title, Status, Context, Decision, Consequences

### MADR
- **Proponents:** Oliver Kopp, Olaf Zimmermann
- **Core:** Markdown ADR template with options considered section

### GoM (Guidelines of Modeling)
- **Proponents:** Jörg Becker, Michael Rosemann
- **Core:** Principles for creating understandable, consistent models

## Design Principles

### SOLID Principles
- **Core:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion

### DRY (Don't Repeat Yourself)
- **Core:** Every piece of knowledge has single, unambiguous representation

### SPOT (Single Point of Truth)
- **Core:** One authoritative source for each piece of data/logic

### SSOT (Single Source of Truth)
- **Core:** One system is the master for specific data

### Patterns of Enterprise Application Architecture (PEAA)
- **Proponents:** Martin Fowler
- **Core:** Repository, Unit of Work, Data Mapper, Active Record, etc.

## Problem-Solving

### Five Whys (Ohno)
- **Proponents:** Taiichi Ohno (Toyota)
- **Core:** Ask "why" repeatedly to find root cause

### Feynman Technique
- **Proponents:** Richard Feynman
- **Core:** Explain concept simply, identify gaps, refine understanding

### Rubber Duck Debugging
- **Core:** Explain code line-by-line to find bugs

### Devil's Advocate
- **Core:** Argue against proposal to stress-test it

### Morphological Box
- **Proponents:** Fritz Zwicky
- **Core:** Matrix of parameters × options to explore solution space

### Chain of Thought (CoT)
- **Proponents:** Wei et al. (Google Research, 2022)
- **Core:** Step-by-step reasoning in prompts for better LLM outputs

### Cynefin Framework
- **Proponents:** Dave Snowden
- **Core:** Clear, Complicated, Complex, Chaotic, Confused — match approach to domain

## Requirements Engineering

### MoSCoW
- **Proponents:** Dai Clegg
- **Core:** Must have, Should have, Could have, Won't have

### EARS-Requirements
- **Core:** Easy Approach to Requirements Syntax — templates for unambiguous requirements

### User Story Mapping
- **Core:** 2D map: user activities (horizontal) × priority (vertical)

### Jobs To Be Done (JTBD)
- **Proponents:** Clayton Christensen, Alan Klement, Bob Moesta
- **Core:** Focus on the "job" users hire your product to do

### Impact Mapping
- **Core:** Why → Who → How → What tree for goal-oriented planning

### Problem Space NVC
- **Core:** Needs-Value-Constraints framework for problem definition

## Communication & Presentation

### BLUF (Bottom Line Up Front)
- **Proponents:** US Military
- **Core:** Lead with conclusion/recommendation, then details

### Pyramid Principle
- **Proponents:** Barbara Minto
- **Core:** Start with answer, group supporting arguments, logical order

### MECE Principle
- **Core:** Mutually Exclusive, Collectively Exhaustive — no overlaps, no gaps

### Chatham House Rule
- **Proponents:** Chatham House
- **Core:** Info can be used but not attributed to speaker/org

### Socratic Method
- **Core:** Ask questions to stimulate critical thinking and illuminate ideas

## Documentation

### Diátaxis Framework
- **Core:** 4 quadrants: Tutorials, How-to guides, Explanations, Reference

### Docs-as-Code
- **Proponents:** Ralf D. Müller
- **Core:** Docs in version control, CI/CD, same workflow as code

## Development Workflow

### Conventional Commits
- **Proponents:** Benjamin E. Coe, James J. Womack, Steve Mao
- **Core:** Structured commit messages: type(scope): description

### Semantic Versioning (SemVer)
- **Core:** MAJOR.MINOR.PATCH — breaking, feature, fix

### BEM Methodology
- **Proponents:** Yandex
- **Core:** Block__Element--Modifier CSS naming convention

### Mental Model (Naur)
- **Proponents:** Peter Naur
- **Core:** Programming as theory building — knowledge lives in developers' heads

### TIMTOWTDI
- **Core:** There Is More Than One Way To Do It — Perl philosophy

### SOTA (State-of-the-Art)
- **Core:** Current best-known methods/results in a field

### Regulated Environment
- **Proponents:** FDA, EMA, ISO 9001, IEC 62304, GAMP 5
- **Core:** Compliance requirements for medical, pharma, safety-critical

### todo.txt-flavoured Markdown
- **Core:** GitHub task lists + todo.txt priorities/contexts/projects

## Statistical Methods

### SPC (Statistical Process Control)
- **Proponents:** Walter A. Shewhart, W. Edwards Deming
- **Core:** Monitor process stability with statistical methods

### Control Chart (Shewhart)
- **Core:** Plot data over time with control limits

### Nelson Rules
- **Core:** 8 rules for detecting non-random patterns in control charts

## Strategic Planning

### Wardley Mapping
- **Proponents:** Simon Wardley
- **Core:** Value chain × evolution stage for strategic positioning

### Pugh Matrix
- **Proponents:** Stuart Pugh
- **Core:** Decision matrix comparing options against criteria with baseline
