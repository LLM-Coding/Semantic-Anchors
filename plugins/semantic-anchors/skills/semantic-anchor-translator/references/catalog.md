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

### Conway's Law
- **Also known as:** The Mirroring Hypothesis
- **Proponents:** Melvin E. Conway (1968); Skelton & Pais (Team Topologies, 2019)
- **Core:** Organizations produce designs whose structure copies their communication structure; system boundaries mirror team boundaries; Inverse Conway Maneuver shapes teams to fit the target architecture; sociotechnical view of architecture

### CAP Theorem
- **Also known as:** Brewer's Theorem
- **Proponents:** Eric Brewer (2000); Seth Gilbert & Nancy Lynch (2002 proof); PACELC by Daniel Abadi (2012)
- **Core:** A partitioned distributed system must choose between Consistency and Availability; partitions are a given so the real choice is CP vs AP while partitioned; PACELC adds the latency/consistency trade-off when not partitioned

### Fallacies of Distributed Computing
- **Also known as:** Deutsch's Fallacies
- **Proponents:** L. Peter Deutsch & James Gosling (Sun Microsystems)
- **Core:** Eight false network assumptions (reliable, zero latency, infinite bandwidth, secure, fixed topology, one admin, zero transport cost, homogeneous) used as an audit checklist for distributed designs; each maps to a mitigation (retries, locality, zero-trust, service discovery, versioning)

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

### Quality Attribute Scenario
- **Also known as:** Quality Scenario, Six-Part Scenario
- **Proponents:** Len Bass, Paul Clements, Rick Kazman (SEI/CMU)
- **Core:** Six-part template that turns a vague quality goal into a testable statement — Source, Stimulus, Artifact, Environment, Response, Response Measure; the Response Measure (a latency, percentile, throughput, recovery time) is what makes it verifiable; expresses arc42 Chapter 10 quality requirements and the leaves of an ATAM utility tree

### LASR by Toth/Zörner
- **Also known as:** Layers–Aspects–Solution Strategy–Rationale
- **Proponents:** Stefan Toth, Stefan Zörner
- **Core:** Lightweight architecture description framework — describe a system through four lenses: Layers (structural decomposition), Aspects (cross-cutting concerns), Solution Strategy (key technology and design choices), Rationale (documented reasoning behind decisions); pairs naturally with arc42 and ADRs

### Lehman's Software Classification
- **Also known as:** SPE Classification, Lehman's SPE Taxonomy
- **Proponents:** Meir M. Lehman
- **Core:** Three software types by relationship to reality — S-type (formally specifiable, provable), P-type (real problem, only approximable, validate against reality), E-type (embedded in the world, changes the world through use, requirements drift by nature); basis for Lehman's Laws of Software Evolution (Continuing Change, Increasing Complexity, etc.) which explain why E-type systems require ongoing maintenance

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

### Law of Demeter
- **Also known as:** Principle of Least Knowledge, "Don't talk to strangers"
- **Proponents:** Ian Holland & Karl Lieberherr (Northeastern University, 1987)
- **Core:** Only call methods on self, parameters, created objects, and direct components — not on objects returned by those calls; avoids train-wreck chains; favours "tell, don't ask"; a coupling heuristic with deliberate exceptions for fluent builders and query DSLs

### Postel's Law
- **Also known as:** Robustness Principle — "be conservative in what you send, be liberal in what you accept"
- **Proponents:** Jon Postel (RFC 761, 1980)
- **Core:** Emit strictly conforming output, accept input tolerantly to maximize interoperability of independently built systems; strong for evolving protocols/APIs/event schemas; modern caveat — excessive tolerance breeds ambiguity and security risk, so pair with strictness and explicit versioning

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

### Single Level of Abstraction Principle (SLAP)
- **Also known as:** SLAP, One Level of Abstraction Per Function
- **Proponents:** Kent Beck, Robert C. Martin
- **Core:** All statements inside a function should live at one abstraction level; mixing orchestration with mechanics is the main driver of unreadable code; refactor by extracting low-level details into named helpers so the outer function reads like a table of contents; formal expression of Beck's Composed Method pattern, codified as a Clean Code function-design rule by Martin

### Code Smells
- **Also known as:** Bad Smells in Code, Refactoring Smells
- **Proponents:** Kent Beck (coined term), Martin Fowler, Robert C. Martin
- **Core:** Surface indications in code that usually point to deeper design problems; Fowler's *Refactoring* (1999) catalogue groups ~20 smells into Bloaters (Long Method, Large Class, Primitive Obsession), OO Abusers (Switch Statements, Refused Bequest), Change Preventers (Divergent Change, Shotgun Surgery), Dispensables (Duplicate Code, Dead Code, Speculative Generality), Couplers (Feature Envy, Message Chains); Martin's *Clean Code* Appendix A extends with ~65 heuristics across Comments, Functions, Names, Tests; each smell pairs with a canonical refactoring — a smell tells you *where to look*, not *what to do*

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

### First Principles Thinking
- **Also known as:** Reasoning from First Principles, Reasoning from Fundamentals
- **Proponents:** roots in Aristotle and Descartes; popularized in modern engineering discourse
- **Core:** Decompose a problem to irreducible fundamental truths and reason upward, instead of reasoning by analogy; challenge inherited assumptions/constraints; powerful but costly, reserved for high-stakes or stuck problems

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

### Occam's Razor
- **Also known as:** Law of Parsimony, Lex Parsimoniae, Ockham's Razor
- **Proponents:** William of Ockham
- **Core:** Among competing hypotheses that explain the same observations equally well, prefer the one requiring the fewest assumptions; applies to *explanations* (debugging, diagnosis, architecture rationale), distinct from KISS which applies to *solutions*; a selection prior under uncertainty, not a proof of truth; Einstein's corollary "as simple as possible, but no simpler" warns against under-fitting

### What Would Chuck Norris Do? (WWCND)
- **Also known as:** WWCND, Chuck Norris framing
- **Proponents:** Ian Spector, Chuck Norris (co-author of *The Official Chuck Norris Fact Book*, 2009); empirical catalog validation by Cornelius Schumacher (Protocol v3, 2026)
- **Core:** Tier 3 qualified anchor — activates a *disposition* (commit to the most direct, effective solution; refuse hedging, premature optimisation, and unnecessary ceremony), not a methodology; driven by the Chuck Norris meme corpus and its software subcorpus ("Chuck Norris doesn't write unit tests — the code is too afraid to fail"); empirically validated across three models (Claude, Gemini, Codex) with 12/12 recommendation convergence and engagement > "be direct, don't hedge" control; complements Devil's Advocate (commit then challenge); best used with a short qualifier ("WWCND: commit to the most direct solution") and not for situations requiring calibrated judgment between genuinely different outcomes

### Morphological Box
- **Proponents:** Fritz Zwicky
- **Core:** Matrix of parameters × options to explore solution space

### Chain of Thought (CoT)
- **Proponents:** Wei et al. (Google Research, 2022)
- **Core:** Step-by-step reasoning in prompts for better LLM outputs

### Cynefin Framework
- **Proponents:** Dave Snowden
- **Core:** Clear, Complicated, Complex, Chaotic, Confused — match approach to domain

### XY Problem
- **Also known as:** Solution Fixation, Asking the Wrong Question
- **Proponents:** Mark Jason Dominus (coined the term in comp.lang.perl.misc, 2001), Eric S. Raymond ("How To Ask Questions The Smart Way")
- **Core:** Communication anti-pattern — asker requests help with attempted solution Y when the real goal X is hidden; resolution by probing for X first ("What are you actually trying to accomplish?"); applies to support, code review, requirements clarification, and LLM dialogues; canonical references at xyproblem.info and Greg's Wiki

### Double Diamond
- **Also known as:** 4Ds Model, Design Council Double Diamond
- **Proponents:** UK Design Council (2005; expanded as "Framework for Innovation", 2019)
- **Core:** Two divergent-convergent cycles — Discover/Define (problem space) and Develop/Deliver (solution space); "design the right thing, then design the thing right"; explicit iteration; widely used in UX, service design, government innovation

### Luhmann's System Theory
- **Also known as:** Theory of Autopoietic Social Systems, Functional-Structural Systems Theory
- **Proponents:** Niklas Luhmann, Dirk Baecker
- **Core:** Sociological systems theory — system/environment difference, operational closure, autopoiesis, structural coupling, double contingency, communication (not people) as the operation of social systems; for analysing complex socio-technical systems where boundaries are contested and direct control fails

### Simon's Constructivism
- **Also known as:** Simon's Systemic Epistemology, Clinical Epistemology
- **Proponents:** Fritz B. Simon, Humberto Maturana, Gregory Bateson
- **Core:** Introduction to systems theory and constructivism — viability vs. truth, trivial vs. non-trivial machines, second-order cybernetics (the observer is part of the observed), information as "differences that make a difference", perturbation instead of instruction

### Systemic Consulting (Heidelberg School)
- **Also known as:** Systemische Beratung, Heidelberg Model
- **Proponents:** Fritz B. Simon, Helm Stierlin, Gunthard Weber, Paul Watzlawick
- **Core:** Heidelberg School of systemic consulting — all-partiality, neutrality, circular questions, context clarification, problems as emergent relational patterns; the consultant cannot instruct a closed system, only offer irritations it may integrate

## Requirements Engineering

### Cockburn Use Cases
- **Also known as:** Fully Dressed Use Cases, Goal-Level Use Cases
- **Proponents:** Alistair Cockburn
- **Core:** Structured textual use case format — Primary Actor, Stakeholders & Interests, Preconditions, Trigger, Main Success Scenario, Extensions, Postconditions; three Goal Levels (Summary/Kite, User Goal/Sea Level, Subfunction/Fish); Actor-Goal List as discovery technique; deliberately prose-based and notation-agnostic — does NOT prescribe Activity Diagrams, Gherkin, or EARS, which are complementary representations

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

### Inverted Pyramid Style
- **Also known as:** News Style, Front-Loading
- **Proponents:** journalistic convention (late-19th-century American wire-service press)
- **Core:** Lead with the most newsworthy who/what/when/where/why, then detail in decreasing importance so a reader can stop anywhere; allows a long prunable tail; distinct from BLUF (deliberately short) and the Pyramid Principle (complete MECE argument)

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

### Goodhart's Law
- **Also known as:** "When a measure becomes a target, it ceases to be a good measure" (Strathern); related to Campbell's Law
- **Proponents:** Charles Goodhart (1975); Marilyn Strathern (1997 formulation)
- **Core:** Once a metric becomes an incentivized target, people optimize the proxy rather than the goal and the measure degrades; mitigate with balanced/counter metrics, learning-only measures, and qualitative signals; a direct lens for KPI and LLM-evaluation design

### Wardley Mapping
- **Proponents:** Simon Wardley
- **Core:** Value chain × evolution stage for strategic positioning

### Pugh Matrix
- **Proponents:** Stuart Pugh
- **Core:** Decision matrix comparing options against criteria with baseline

### SWOT
- **Proponents:** Albert Humphrey
- **Core:** Strengths, Weaknesses, Opportunities, Threats — internal vs. external strategic analysis

### Kano Model
- **Also known as:** Kano Analysis, Kano-Modell, Customer Satisfaction Model
- **Proponents:** Noriaki Kano (1984, *Hinshitsu* journal)
- **Core:** Two-dimensional quality model — features classified as Must-be (basic, absence dissatisfies), Performance (linear), Attractive (delighter, exceeds expectation), Indifferent or Reverse; surveyed via paired functional/dysfunctional questions ("How would you feel if X were present? / absent?"); categories decay over time (Delighter → Performer → Must-be); complements MoSCoW for backlog prioritisation

### Kotter's 8-Step Change Model
- **Also known as:** Kotter's 8 Steps for Leading Change, Kotter's Change Process
- **Proponents:** John P. Kotter (HBR 1995 *"Leading Change: Why Transformation Efforts Fail"*; book *Leading Change*, 1996)
- **Core:** Eight sequential steps for organisational transformation — (1) establish urgency, (2) form a guiding coalition, (3) develop vision and strategy, (4) communicate the vision, (5) empower broad-based action / remove obstacles, (6) generate short-term wins, (7) consolidate gains and produce more change, (8) anchor changes in culture; the model is the inversion of the eight common errors Kotter identified in failed transformations; widely used in M&A, digital transformation, and agile rollouts; later complemented by *Accelerate* (2014) with a dual operating system of hierarchy plus network

### PERT (Program Evaluation and Review Technique)
- **Also known as:** Three-Point Estimation, PERT Network Analysis
- **Proponents:** D.G. Malcolm, J.H. Roseboom, C.E. Clark, W. Fazar
- **Core:** Stochastic project scheduling using three-point estimates per activity (Optimistic, Most Likely, Pessimistic); weighted average formula E = (O + 4M + P) / 6; standard deviation σ = (P − O) / 6; critical path analysis; probabilistic milestone confidence intervals

### Minimum Viable Product (MVP)
- **Also known as:** MVP, Lean Startup MVP
- **Proponents:** Eric Ries, Frank Robinson
- **Core:** Smallest product that tests a single falsifiable hypothesis about user needs with the least effort; the defining output is *validated learning*, not a feature set or revenue; first turn of the build-measure-learn loop; distinct from a "small v1" — an MVP would be embarrassing to ship in production because its job is learning, not market entry; gives evidence for pivot-or-persevere decisions

### Hoshin Kanri
- **Also known as:** Policy Deployment, Strategy Deployment, Hoshin Planning
- **Proponents:** Yoji Akao ("Hoshin Kanri: Policy Deployment for Successful TQM", 1991), Thomas L. Jackson ("Hoshin Kanri for the Lean Enterprise", 2006)
- **Core:** Lean strategy-deployment discipline — 3-5 year True North breakthrough objectives cascade into annual hoshin via the X-Matrix (long-term strategy × annual objectives × improvement priorities × metrics, with explicit correlations); two-way *catchball* negotiation between levels prevents top-down imposition; monthly *Bowling Chart* reviews drive PDCA on the strategy itself; deliberately restricted to the few vital goals so "business as usual" stays outside the hoshin

### Decisional Balance Sheet
- **Also known as:** Benjamin Franklin Analysis, Moral Algebra, Pros-and-Cons Sheet
- **Proponents:** Irving Janis & Leon Mann ("Decision Making: A Psychological Analysis of Conflict, Choice, and Commitment", 1977); Benjamin Franklin (1772 "moral algebra" letter to Joseph Priestley); adapted by Miller & Rollnick ("Motivational Interviewing", 1991)
- **Core:** Four-cell decision matrix capturing utilitarian gains/losses for self and for significant others, plus self-approval and approval from others; weighted entries surface trade-offs and resolve ambivalence rather than mechanise the choice; simplified two-column pros/cons form is a degenerate case; used in decision coaching and Motivational Interviewing to elicit change-talk; deliberative — weak under time pressure or high uncertainty

### Meaningful Human Control (MHC)
- **Also known as:** MHC, Meaningful Human Control over Individual Attacks
- **Proponents:** Article 36 (coined the term, 2013), Noel Sharkey (five-level framework, 2014), ICRC, UN CCW GGE, IEEE Global Initiative
- **Core:** Requirement that humans retain genuine, substantive control over autonomous systems making high-stakes decisions — not merely formulaic "human-in-the-loop" oversight; demands situational awareness, an identifiable accountability chain (never transferable to machines), positive human authorization of critical actions, and timely intervention/override; Sharkey's five levels (L1 human deliberates → L5 fully autonomous) classify the degree of autonomy; originates in the autonomous-weapons / international humanitarian law debate but applies to medical AI, autonomous driving, and critical infrastructure; underlies the EU AI Act's human-oversight requirements

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
