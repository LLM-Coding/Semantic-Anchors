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

### BDD (Behavior-Driven Development)
- **Also known as:** Specification by Example, Executable Specifications
- **Proponents:** Dan North
- **Core:** Given-When-Then scenarios, Gherkin syntax, three amigos, living documentation, outside-in specification

### Gherkin
- **Also known as:** Cucumber DSL, BDD Scenario Language
- **Proponents:** Aslak Hellesøy
- **Core:** Domain-specific language for writing human-readable executable specifications; Feature/Scenario/Given/When/Then keywords; Background, Scenario Outline, Examples; 70+ natural languages; used by Cucumber, SpecFlow, Behave

### Test Double (Meszaros)
- **Proponents:** Gerard Meszaros
- **Core:** Taxonomy of test substitutes — Dummy (unused), Stub (canned responses), Spy (records calls), Mock (verifies interactions), Fake (simplified implementation)

### Testing Pyramid
- **Core:** Many unit tests, fewer integration tests, fewest E2E tests

### Mutation Testing
- **Proponents:** Richard Lipton, Richard DeMillo
- **Core:** Inject faults into code, verify tests catch them

### Property-Based Testing
- **Core:** Test properties/invariants with generated inputs (QuickCheck, Hypothesis)

### Fagan Inspection
- **Also known as:** Formal Code Inspection, Software Inspection
- **Proponents:** Michael Fagan
- **Core:** Structured six-phase review process (Planning, Overview, Preparation, Inspection Meeting, Rework, Follow-up) with defined roles (Moderator, Author, Inspectors, Recorder), entry/exit criteria, and metrics-driven defect classification

### IEC 61508 SIL Levels
- **Proponents:** International Electrotechnical Commission
- **Core:** Safety integrity levels for safety-critical systems

### LINDDUN
- **Also known as:** LINDDUN GO, Privacy Threat Modeling, Privacy STRIDE
- **Proponents:** Kim Wuyts, Riccardo Scandariato, Wouter Joosen (KU Leuven)
- **Core:** Privacy threat modeling framework; acronym for seven threat categories — Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, Non-compliance; used for DPIA, Privacy by Design, GDPR compliance

### STRIDE Threat Model
- **Proponents:** Loren Kohnfelder, Praerit Garg (Microsoft), Adam Shostack
- **Core:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege — structured threat categorization for security design

### LLM-Evaluations
- **Also known as:** LLM Benchmarking, LLM Assessment, Foundation Model Evaluation
- **Proponents:** Percy Liang (Stanford HELM), EleutherAI (Open LLM Leaderboard), LMSYS (Chatbot Arena)
- **Core:** Frameworks and metrics for assessing LLM capabilities — benchmark suites (MMLU, HumanEval, BIG-Bench), automatic vs. human evaluation, HELM, Chatbot Arena Elo ratings, red-teaming, contamination detection

## Software Architecture

### Clean Architecture
- **Core:** Dependency rule, entities at center, frameworks at edge

### Hexagonal Architecture (Ports & Adapters)
- **Core:** Business logic isolated via ports, adapters for external systems

### Domain-Driven Design (DDD)
- **Proponents:** Eric Evans
- **Core:** Ubiquitous language, bounded contexts, aggregates, entities, value objects

### Event-Driven Architecture
- **Also known as:** EDA, Message-Driven Architecture
- **Proponents:** Gregor Hohpe, Bobby Woolf, Martin Fowler
- **Core:** Async decoupling via events, publish-subscribe, event producers/consumers, eventual consistency, idempotency

### arc42 Architecture Documentation
- **Proponents:** Gernot Starke, Peter Hruschka
- **Core:** 12-section template for documenting software architecture

### CQRS (Command Query Responsibility Segregation)
- **Proponents:** Greg Young, Bertrand Meyer, Udi Dahan
- **Core:** Separate read/write models, commands return void, queries return data with no side effects, independent scalability

### Vertical Slice Architecture (VSA)
- **Also known as:** VSA, Feature Slices
- **Proponents:** Jimmy Bogard
- **Core:** Organize features as end-to-end slices spanning request, validation, domain logic, persistence, and API; avoids horizontal layering; feature cohesion over technical layers; naturally pairs with CQRS

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

### ISO/IEC 25010
- **Also known as:** SQuaRE Quality Model, Software Product Quality Model, ISO 25010
- **Proponents:** ISO/IEC JTC 1/SC 7
- **Core:** Product quality model with 8 characteristics (Functional Suitability, Performance Efficiency, Compatibility, Usability, Reliability, Security, Maintainability, Portability) plus Quality in Use model (Effectiveness, Efficiency, Satisfaction, Freedom from Risk, Context Coverage); used for structured software quality assessments, architecture reviews, and defining non-functional requirements

## Design Principles

### SOLID Principles
- **Core:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion

#### SOLID-SRP (Single Responsibility Principle)
- **Proponents:** Robert C. Martin
- **Core:** Each class should have only one reason to change

#### SOLID-OCP (Open/Closed Principle)
- **Proponents:** Robert C. Martin, Bertrand Meyer
- **Core:** Open for extension, closed for modification

#### SOLID-LSP (Liskov Substitution Principle)
- **Proponents:** Robert C. Martin, Barbara Liskov
- **Core:** Subtypes must be substitutable for their base types

#### SOLID-ISP (Interface Segregation Principle)
- **Proponents:** Robert C. Martin
- **Core:** Don't force clients to depend on unused interfaces

#### SOLID-DIP (Dependency Inversion Principle)
- **Proponents:** Robert C. Martin
- **Core:** Depend on abstractions, not concrete implementations

### GRASP
- **Also known as:** General Responsibility Assignment Software Patterns, Responsibility-Driven Design Guidelines
- **Proponents:** Craig Larman
- **Core:** 9 patterns for OO responsibility assignment — Information Expert, Creator, Controller, Low Coupling, High Cohesion, Polymorphism, Pure Fabrication, Indirection, Protected Variations

### CRC-Cards
- **Also known as:** CRC Cards, Class-Responsibility-Collaboration Cards
- **Proponents:** Ward Cunningham, Kent Beck
- **Core:** Index cards for collaborative OO design — each card has Class name, Responsibilities (what it knows/does), and Collaborators (other classes it depends on); role-playing scenarios validate design; deliberately low-tech to encourage iterative thinking

### DRY (Don't Repeat Yourself)
- **Core:** Every piece of knowledge has single, unambiguous representation

### KISS (Keep It Simple, Stupid / Keep It Super Simple)
- **Also known as:** KISS Principle, Keep It Simple
- **Proponents:** Kelly Johnson, Robert C. Martin
- **Core:** Simplicity as design goal, avoid over-engineering, readability over cleverness, simplest working solution first, reduce cognitive load

### SPOT (Single Point of Truth)
- **Core:** One authoritative source for each piece of data/logic

### SSOT (Single Source of Truth)
- **Core:** One system is the master for specific data

### YAGNI (You Aren't Gonna Need It)
- **Proponents:** Ron Jeffries, Kent Beck
- **Core:** Don't build for hypothetical futures, speculative generality anti-pattern, incremental design, delete dead code

### GoF Design Patterns
- **Also known as:** Design Patterns, Gang of Four Patterns
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** 23 patterns in 3 categories (Creational, Structural, Behavioral), pattern language, composition over inheritance, program to an interface

#### Creational Patterns
- **GoF-Abstract Factory** — Families of related objects without specifying concrete classes
- **GoF-Builder** — Construct complex objects step by step
- **GoF-Factory Method** — Let subclasses decide which class to instantiate
- **GoF-Prototype** — Clone existing objects
- **GoF-Singleton** — Ensure single instance with global access

#### Structural Patterns
- **GoF-Adapter** — Convert interface to one clients expect
- **GoF-Bridge** — Separate abstraction from implementation
- **GoF-Composite** — Compose objects into tree structures
- **GoF-Decorator** — Add responsibilities dynamically
- **GoF-Facade** — Simplified interface to a subsystem
- **GoF-Flyweight** — Share fine-grained objects efficiently (not a semantic anchor)
- **GoF-Proxy** — Surrogate controlling access to another object

#### Behavioral Patterns
- **GoF-Chain of Responsibility** — Pass requests along a chain of handlers
- **GoF-Command** — Encapsulate requests as objects
- **GoF-Interpreter** — Grammar and interpreter for a language (not a semantic anchor)
- **GoF-Iterator** — Sequential access without exposing structure
- **GoF-Mediator** — Centralize complex communications
- **GoF-Memento** — Capture and restore object state (not a semantic anchor)
- **GoF-Observer** — Notify dependents of state changes
- **GoF-State** — Alter behavior when internal state changes
- **GoF-Strategy** — Interchangeable algorithm families
- **GoF-Template Method** — Define skeleton, let subclasses fill in steps
- **GoF-Visitor** — Operations on elements without changing their classes (not a semantic anchor)

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

### INVEST
- **Proponents:** Bill Wake
- **Core:** Independent, Negotiable, Valuable, Estimable, Small, Testable — criteria for well-formed user stories

### PRD
- **Also known as:** Product Requirements Document, Product Spec, Feature Spec
- **Proponents:** Marty Cagan, Roman Pichler
- **Core:** Problem statement, goals & success metrics, user personas, functional & non-functional requirements, scope boundaries, constraints, open questions

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

### Gutes Deutsch nach Wolf Schneider
- **Proponents:** Wolf Schneider
- **Core:** Short sentences, active voice, verbs over nouns (no Nominalstil), concrete language, no filler words — clarity-first principles for German writing

### Plain English according to Strunk & White
- **Proponents:** William Strunk Jr., E.B. White
- **Core:** Omit needless words, use active voice, prefer concrete language, write with nouns and verbs — clarity-first principles for English writing ("The Elements of Style")

### Chatham House Rule
- **Proponents:** Chatham House
- **Core:** Info can be used but not attributed to speaker/org

### Socratic Method
- **Core:** Ask questions to stimulate critical thinking and illuminate ideas

### Myers-Briggs Type Indicator (MBTI)
- **Also known as:** MBTI, Myers-Briggs, 16 Personality Types
- **Proponents:** Isabel Briggs Myers, Katharine Cook Briggs, Carl Gustav Jung
- **Core:** Four dichotomies (E/I, S/N, T/F, J/P) produce 16 personality types describing communication preferences, decision-making styles, and team dynamics

## Documentation

### P.A.R.A. Method
- **Also known as:** PARA Framework, Second Brain Organization System
- **Proponents:** Tiago Forte
- **Core:** Organize all information into four categories by actionability — Projects (specific goal + deadline), Areas (ongoing responsibilities), Resources (reference topics), Archive (inactive items)

### Diátaxis Framework
- **Core:** 4 quadrants: Tutorials, How-to guides, Explanations, Reference

### Docs-as-Code
- **Proponents:** Ralf D. Müller
- **Core:** Docs in version control, CI/CD, same workflow as code

## Development Workflow

### GTD — Getting Things Done
- **Also known as:** GTD, GTD by David Allen, Getting Things Done Methodology
- **Proponents:** David Allen
- **Core:** Five-step workflow — Capture (collect all open loops into trusted inboxes), Clarify (define next physical action or discard), Organize (sort into Next Actions/Projects/Waiting For/Someday/Calendar lists), Reflect (weekly review), Engage (act based on context/time/energy); Two-Minute Rule; context tagging (@computer, @phone); trusted external system frees mental RAM

### Definition of Done
- **Also known as:** DoD, Done Criteria
- **Proponents:** Ken Schwaber, Jeff Sutherland
- **Core:** Team-wide checklist of quality criteria every increment must satisfy; transparency on what "done" means; sprint-level vs. product-level DoD; prevents hidden technical debt

### GitHub Flow
- **Proponents:** Scott Chacon
- **Core:** Branch-based workflow — short-lived feature branches, Pull Request reviews, `main` always deployable, merge triggers immediate deployment

### Conventional Commits
- **Proponents:** Benjamin E. Coe, James J. Womack, Steve Mao
- **Core:** Structured commit messages: type(scope): description

### Effective Go
- **Proponents:** The Go Authors
- **Core:** Official guide to idiomatic Go — gofmt formatting, short package names, defer for cleanup, goroutines and channels for concurrency ("share memory by communicating"), implicit interface satisfaction, error-as-value pattern, blank identifier, embedding over inheritance

### Semantic Versioning (SemVer)
- **Core:** MAJOR.MINOR.PATCH — breaking, feature, fix

### BEM Methodology
- **Proponents:** Yandex
- **Core:** Block__Element--Modifier CSS naming convention

### Mental Model (Naur)
- **Proponents:** Peter Naur
- **Core:** Programming as theory building — knowledge lives in developers' heads

### Mikado Method
- **Proponents:** Ola Ellnestam, Daniel Brolund
- **Core:** Incremental refactoring via prerequisite graph — attempt change, revert on breakage, resolve leaf dependencies first

### TIMTOWTDI
- **Core:** There Is More Than One Way To Do It — Perl philosophy

### SOTA (State-of-the-Art)
- **Core:** Current best-known methods/results in a field

### Regulated Environment
- **Proponents:** FDA, EMA, ISO 9001, IEC 62304, GAMP 5
- **Core:** Compliance requirements for medical, pharma, safety-critical

### todo.txt-flavoured Markdown
- **Core:** GitHub task lists + todo.txt priorities/contexts/projects

### Hemingway Bridge
- **Also known as:** Stop Mid-Sentence Technique, Re-entry Point Strategy
- **Proponents:** Tiago Forte (coined the term), inspired by Ernest Hemingway
- **Core:** End each work session before a natural stopping point while you still know what comes next; leave an explicit re-entry note (unfinished sentence, comment, TODO) to eliminate "blank page" paralysis, preserve momentum, and manage creative energy across sessions

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

### SWOT
- **Proponents:** Albert Humphrey
- **Core:** Strengths, Weaknesses, Opportunities, Threats — internal vs. external strategic analysis

### PERT (Program Evaluation and Review Technique)
- **Also known as:** Three-Point Estimation, PERT Network Analysis
- **Proponents:** D.G. Malcolm, J.H. Roseboom, C.E. Clark, W. Fazar
- **Core:** Stochastic project scheduling using three-point estimates per activity (Optimistic, Most Likely, Pessimistic); weighted average formula E = (O + 4M + P) / 6; standard deviation σ = (P − O) / 6; critical path analysis; probabilistic milestone confidence intervals

## Creative Writing & Storytelling

### Three-Act Structure
- **Also known as:** Setup-Confrontation-Resolution, Beginning-Middle-End, Aristotelian Three-Act Structure
- **Proponents:** Aristotle, Syd Field, Robert McKee, Blake Snyder
- **Core:** Setup (introduce world + inciting incident, ~25%) → Confrontation (escalating obstacles + midpoint reversal + all-is-lost, ~50%) → Resolution (climax + denouement, ~25%); the foundational Western narrative scaffold

### Hero's Journey
- **Also known as:** Monomyth, Campbell's Monomyth, The Writer's Journey (Vogler)
- **Proponents:** Joseph Campbell, Christopher Vogler
- **Core:** 12-stage transformation arc: Ordinary World → Call to Adventure → Refusal → Mentor → Threshold → Tests → Ordeal → Reward → Road Back → Resurrection → Return with Elixir; universal mythic structure underlying most Western stories

### Save the Cat! (15-Beat Sheet)
- **Also known as:** Blake Snyder Beat Sheet, BS2
- **Proponents:** Blake Snyder
- **Core:** 15 precisely-timed beats for commercial screenplays: Opening Image → Theme Stated → Set-Up → Catalyst (p.12) → Debate → Break into Two (p.25) → B Story → Fun & Games → Midpoint (p.55) → Bad Guys Close In → All Is Lost (p.75) → Dark Night → Break into Three (p.85) → Finale → Final Image; audience-tested pacing formula

### Fichtean Curve
- **Also known as:** Rising Action Structure, Crisis-Driven Structure
- **Proponents:** John Gardner, Janet Burroway
- **Core:** Constant crisis — story begins in medias res, no traditional Act 1; a series of escalating mini-crises with no lulls; retrospective exposition woven in; climax followed by brief falling action; favoured for short fiction and fast-paced genre writing

### Freytag's Pyramid
- **Also known as:** Five-Act Structure, Dramatic Arc, Dramatic Pyramid
- **Proponents:** Gustav Freytag, John Yorke
- **Core:** Five acts: Exposition → Rising Action → Climax (midpoint) → Falling Action → Dénouement; models classical tragedy with hamartia (protagonist's fatal flaw); the structural ancestor of most dramatic analysis

### Story Circle (Dan Harmon)
- **Also known as:** Harmon Story Circle, Channel 101 Narrative Structure
- **Proponents:** Dan Harmon
- **Core:** 8-step circle derived from Campbell: You → Need → Go → Search → Find → Take → Return → Change; designed for episodic TV at any scale; the engine is the want-vs-need gap driving character transformation

### Kishōtenketsu
- **Also known as:** 起承転結, Four-Act Eastern Structure, Ki-Shō-Ten-Ketsu
- **Proponents:** Classical Chinese and Japanese narrative tradition, Tzvetan Todorov
- **Core:** Ki (introduce) → Shō (develop) → Ten (twist/recontextualise) → Ketsu (reconcile); no protagonist-antagonist conflict required; tension arises from juxtaposition and revelation; used in manga, haiku, and Nintendo game design
