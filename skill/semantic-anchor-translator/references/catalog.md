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

### Test Double Dummy
- **Proponents:** Gerard Meszaros
- **Core:** Placeholder passed to fill required parameters but never actually used in the test; has no behavior

### Test Double Stub
- **Proponents:** Gerard Meszaros
- **Core:** Returns predefined (canned) responses to calls; does not verify interactions, only supplies data

### Test Double Spy
- **Proponents:** Gerard Meszaros
- **Core:** Stub that also records how it was called; assertions happen after the action, not as pre-programmed expectations

### Test Double Mock
- **Proponents:** Gerard Meszaros
- **Core:** Pre-programmed with expectations about which calls should be made; verifies interactions and fails immediately if expectations are violated

### Test Double Fake
- **Proponents:** Gerard Meszaros
- **Core:** Working but simplified implementation unsuitable for production; has real behavior (e.g. in-memory database) but takes shortcuts

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

### Red/Green TDD
- **Also known as:** Red-Green-Refactor, Classical TDD Cycle, Test-First Development
- **Proponents:** Kent Beck
- **Core:** Classical TDD cycle — write failing test first (red), minimal code to pass (green), then refactor; watch it fail for the right reason; one failing test at a time; test names describe behavior, not method signatures; counters the default LLM habit of writing tests after the implementation

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

### ATAM
- **Also known as:** Architecture Tradeoff Analysis Method
- **Proponents:** Rick Kazman, Mark Klein, Paul Clements (SEI/CMU)
- **Core:** Scenario-driven evaluation of software architectures against quality attributes; elicits stakeholder quality-attribute scenarios, maps them to architectural decisions, identifies sensitivity points, tradeoff points, and risks; produces a documented risk list and tradeoff catalog

### LASR by Toth/Zörner
- **Also known as:** Layers–Aspects–Solution Strategy–Rationale
- **Proponents:** Stefan Toth, Stefan Zörner
- **Core:** Lightweight architecture description framework — describe a system through four lenses: Layers (structural decomposition), Aspects (cross-cutting concerns), Solution Strategy (key technology and design choices), Rationale (documented reasoning behind decisions); pairs naturally with arc42 and ADRs

### OWASP Top 10
- **Also known as:** OWASP Top Ten, Open Worldwide Application Security Project Top 10
- **Proponents:** OWASP Foundation
- **Core:** Consensus ranking of the ten most critical web-application security risks (Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Authentication Failures, Data Integrity Failures, Logging Failures, SSRF); used as a baseline checklist for secure code review, threat modeling, and compliance

### Walking Skeleton
- **Also known as:** Skeleton Architecture, End-to-End Thin Implementation
- **Proponents:** Alistair Cockburn
- **Core:** Minimal end-to-end implementation touching every architectural layer (UI → logic → persistence → deployment) that is production-capable from day one; validates integration and structure before any significant feature work; grown iteratively rather than thrown away like a prototype

### Tracer Bullet
- **Also known as:** Tracer Bullet Development, Tracer Code
- **Proponents:** Andy Hunt, David Thomas
- **Core:** Lightweight end-to-end slice that validates architectural direction on real infrastructure; unlike a spike, tracer code is kept and refined into the final system; enables rapid directional correction via the "aim-fire-adjust" loop; primary goal is architecture validation, not feature delivery

## Design Principles

### SOLID Principles
- **Core:** Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion

### SOLID-SRP
- **Also known as:** Single Responsibility Principle
- **Proponents:** Robert C. Martin
- **Core:** Each class should have only one reason to change

### SOLID-OCP
- **Also known as:** Open/Closed Principle
- **Proponents:** Robert C. Martin, Bertrand Meyer
- **Core:** Open for extension, closed for modification

### SOLID-LSP
- **Also known as:** Liskov Substitution Principle
- **Proponents:** Robert C. Martin, Barbara Liskov
- **Core:** Subtypes must be substitutable for their base types

### SOLID-ISP
- **Also known as:** Interface Segregation Principle
- **Proponents:** Robert C. Martin
- **Core:** Don't force clients to depend on unused interfaces

### SOLID-DIP
- **Also known as:** Dependency Inversion Principle
- **Proponents:** Robert C. Martin
- **Core:** Depend on abstractions, not concrete implementations

### GRASP
- **Also known as:** General Responsibility Assignment Software Patterns, Responsibility-Driven Design Guidelines
- **Proponents:** Craig Larman
- **Core:** 9 patterns for OO responsibility assignment — Information Expert, Creator, Controller, Low Coupling, High Cohesion, Polymorphism, Pure Fabrication, Indirection, Protected Variations

### Cohesion Criteria (Constantine & Yourdon)
- **Also known as:** Levels of Cohesion, Cohesion Scale, Module Cohesion Types
- **Proponents:** Larry Constantine, Edward Yourdon
- **Core:** 7 levels of module cohesion from worst to best — Coincidental (arbitrary grouping), Logical (similar activities via flag), Temporal (same time), Procedural (execution sequence), Communicational (same data), Sequential (pipeline), Functional (single task, ideal)

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

### GoF-Abstract Factory Pattern
- **Also known as:** Kit
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Create families of related objects without specifying concrete classes (Creational)

### GoF-Builder Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Separate construction of a complex object from its representation; same process can create different representations (Creational)

### GoF-Factory Method Pattern
- **Also known as:** Virtual Constructor
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Define an interface for creating an object, but let subclasses decide which class to instantiate (Creational)

### GoF-Prototype Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Create new objects by copying a prototypical instance (Creational)

### GoF-Singleton Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Ensure a class has only one instance with a global access point (Creational)

### GoF-Adapter Pattern
- **Also known as:** Wrapper
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Convert an interface into another interface clients expect; makes incompatible interfaces work together (Structural)

### GoF-Bridge Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Decouple an abstraction from its implementation so both can vary independently (Structural)

### GoF-Composite Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Compose objects into tree structures to represent part-whole hierarchies; treat individual objects and compositions uniformly (Structural)

### GoF-Decorator Pattern
- **Also known as:** Wrapper
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Attach additional responsibilities to an object dynamically; flexible alternative to subclassing (Structural)

### GoF-Facade Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Provide a unified interface to a set of interfaces in a subsystem; defines a higher-level interface (Structural)

### GoF-Flyweight Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Use sharing to support large numbers of fine-grained objects efficiently (Structural)

### GoF-Proxy Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Provide a surrogate or placeholder for another object to control access to it (Structural)

### GoF-Chain of Responsibility Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Pass requests along a chain of handlers; each handler decides to process or forward (Behavioral)

### GoF-Command Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Encapsulate a request as an object, enabling parameterization, queuing, logging, and undoable operations (Behavioral)

### GoF-Interpreter Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Define a representation for a language's grammar and an interpreter to process sentences (Behavioral)

### GoF-Iterator Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Provide a way to access elements of an aggregate object sequentially without exposing its underlying representation (Behavioral)

### GoF-Mediator Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Define an object that encapsulates how a set of objects interact; promotes loose coupling (Behavioral)

### GoF-Memento Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Capture and externalize an object's internal state so it can be restored later, without violating encapsulation (Behavioral)

### GoF-Observer Pattern
- **Also known as:** Publish-Subscribe, Event-Listener
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Define a one-to-many dependency so that when one object changes state, all dependents are notified (Behavioral)

### GoF-State Pattern
- **Also known as:** Objects for States
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Allow an object to alter its behavior when its internal state changes; the object will appear to change its class (Behavioral)

### GoF-Strategy Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Define a family of algorithms, encapsulate each one, and make them interchangeable (Behavioral)

### GoF-Template Method Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Define the skeleton of an algorithm in an operation, deferring some steps to subclasses (Behavioral)

### GoF-Visitor Pattern
- **Proponents:** Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
- **Core:** Represent an operation to be performed on elements of an object structure without changing their classes (Behavioral)

### Patterns of Enterprise Application Architecture (PEAA)
- **Proponents:** Martin Fowler
- **Core:** Repository, Unit of Work, Data Mapper, Active Record, etc.

## Problem-Solving

### Five Whys (Ohno)
- **Proponents:** Taiichi Ohno (Toyota)
- **Core:** Ask "why" repeatedly to find root cause

### Feynman Technique
- **Proponents:** Richard Feynman
- **Core:** Explain concepts simply, identify gaps, refine understanding

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

### 4MAT
- **Also known as:** 4MAT System of Instruction, McCarthy's 4MAT, 4MAT Learning Cycle
- **Proponents:** Bernice McCarthy
- **Core:** Four-quadrant learning cycle structuring explanations and presentations — Why (motivation, relevance), What (facts, concepts), How (practical application, examples), What If (extension, transfer); order matters to serve all four learner types (Innovative/Analytic/Common Sense/Dynamic) instead of only analytic learners

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

### Thin Vertical Slice
- **Also known as:** Vertical Slicing, End-to-End Slice
- **Proponents:** Alistair Cockburn, Mike Cohn
- **Core:** Delivery technique where each increment implements one small feature end-to-end through every technical layer (UI → logic → persistence → integration); keeps the system shippable after each slice; distinct from Vertical Slice Architecture (structural pattern vs. delivery technique); surfaces integration issues early and often

### Spike Solution
- **Also known as:** Spike, Technical Spike, Research Spike
- **Proponents:** Kent Beck
- **Core:** Time-boxed, disposable experiment written to answer one specific technical question before committing to an approach; output is a decision, not a deliverable; deliberately rough quality — no tests, no review, no polish; time-boxing is mandatory or the spike becomes speculative development

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

### Minimum Viable Product (MVP)
- **Also known as:** MVP, Lean Startup MVP
- **Proponents:** Eric Ries, Frank Robinson
- **Core:** Smallest product that tests a single falsifiable hypothesis about user needs with the least effort; the defining output is *validated learning*, not a feature set or revenue; first turn of the build-measure-learn loop; distinct from a "small v1" — an MVP would be embarrassing to ship in production because its job is learning, not market entry; gives evidence for pivot-or-persevere decisions

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
