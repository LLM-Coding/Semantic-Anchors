# Semantic Anchors Catalog

Source: https://github.com/LLM-Coding/Semantic-Anchors

## Testing & Quality

### Arrange-Act-Assert (AAA)
- **Also known as:** 3A, Setup-Exercise-Verify, Build-Operate-Check
- **Proponents:** Bill Wake, Gerard Meszaros
- **Core:** Three blocks in one unit test: build the fixture, perform exactly one action, then check. Where Given-When-Then shapes an acceptance scenario in domain language, this shapes the body of a single test in code. Use the written-out name: the bare acronym "AAA" anchors Authentication, Authorization and Accounting instead

### Test Data Builder (Pryce)
- **Also known as:** test builder, builder-based fixture; successor to Object Mother
- **Proponents:** Nat Pryce, Steve Freeman
- **Core:** A builder with safe defaults and fluent `with…()` overrides, so a test states only the field it cares about and a changed constructor breaks the builder instead of two hundred tests. Introduced as the answer to Object Mother's variant explosion

### OWASP ASVS (Application Security Verification Standard)
- **Also known as:** ASVS, usually spoken with its level ("ASVS L2")
- **Proponents:** OWASP Foundation
- **Core:** Numbered, verifiable security requirements at three assurance levels — the testable counterpart to the Top 10's awareness list. Always name the level and the version: v5.0 (May 2025) renumbered requirements, so v4 IDs no longer match

### FMEA
- **Also known as:** Failure Mode and Effects Analysis; FMECA with criticality analysis
- **Proponents:** US Armed Forces (MIL-P-1629, 1949), NASA, AIAG, VDA
- **Core:** Per-failure-mode rows rated for Severity, Occurrence and Detection, ranked and turned into actions; the classic RPN (S x O x D) was replaced by Action Priority in the AIAG-VDA handbook (first edition June 2019)

### Poka-Yoke
- **Also known as:** mistake-proofing, error-proofing; originally baka-yoke ("fool-proofing")
- **Proponents:** Shigeo Shingo, Toyota
- **Core:** Make the wrong action impossible rather than warning against it; a human error is inevitable but must not be allowed to become a defect that flows downstream. Prevention/control is strictly preferred over warning/detection

### Jidoka
- **Also known as:** autonomation, "automation with a human touch"
- **Proponents:** Sakichi Toyoda, Taiichi Ohno, Toyota
- **Core:** Halt on the anomaly instead of passing a defect downstream; one of the two TPS pillars alongside Just-in-Time. Software form: fail fast, circuit breakers, stop the deployment on a failing canary

### Andon
- **Also known as:** andon board, andon cord, stop-the-line authority
- **Proponents:** Taiichi Ohno, Toyota Motor Corporation
- **Core:** A signal nobody can miss, a cord anyone may pull, and a guaranteed response. The radical part is the authority, not the hardware; a rising pull count early on signals that problems are surfacing rather than hiding


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

### MISRA C
- **Also known as:** MISRA guidelines; by edition, e.g. MISRA C:2012
- **Proponents:** MISRA (originally the Motor Industry Software Reliability Association)
- **Core:** A safe subset of C for critical embedded systems: guidelines classed as mandatory, required or advisory, rules checkable from source versus process directives, the essential type model, no dynamic memory or recursion, and documented deviations instead of silent violations. Name the edition; never trust a model's rule numbers without the licensed text or a checker

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

### Test Seam
- **Also known as:** Seam (Feathers), Legacy Seam
- **Proponents:** Michael Feathers
- **Core:** A place where behavior can be altered without editing at that place; each seam has an enabling point (constructor parameter, classpath entry, preprocessor define) that selects which behavior executes; three types — Object (polymorphism/DI), Link (linker/classpath), Preprocessing (macros) — used to break hard dependencies and get legacy code under test without modifying production logic

## Software Architecture

### 4+1 View Model according to Kruchten
- **Also known as:** Kruchten's 4+1, the RUP architecture views
- **Proponents:** Philippe Kruchten
- **Core:** Logical, process, physical and development views, each written for a named stakeholder group, plus scenarios as the cross-check that keeps the four consistent. The stakeholder-per-view mapping is what distinguishes it from arc42 and C4; the view/viewpoint idea was generalised by IEEE/ISO/IEC 42010

### Richardson Maturity Model
- **Also known as:** RMM, the REST maturity levels; Richardson's own term was *Maturity Heuristic*
- **Proponents:** Leonard Richardson, Martin Fowler
- **Core:** A ladder from one endpoint for everything, through resources and HTTP verbs, to hypermedia controls. Useful as a design target ("build this to Level 2"), not as a score: Fowler, who named and numbered it, says it is "not something that should be used in some kind of assessment mechanism"

### Enterprise Integration Patterns (Hohpe/Woolf)
- **Also known as:** EIP, the messaging pattern language
- **Proponents:** Gregor Hohpe, Bobby Woolf
- **Core:** Sixty-five named patterns for messaging — channels, routers, translators, endpoints — with an icon notation that carried the vocabulary into Camel and Spring Integration. Event-driven architecture is the style; this is the vocabulary any messaging solution is built from

### Bulkhead Pattern
- **Also known as:** resource isolation, pool isolation; cell-based architecture at infrastructure scale
- **Proponents:** Michael T. Nygard
- **Core:** Cap how much of the system any one dependency can consume, so a slow partner cannot exhaust the shared pool. A circuit breaker stops calls to a failing dependency; a bulkhead limits the damage while they still run

### Defense in Depth
- **Also known as:** layered security, defence in depth; Swiss cheese model in safety engineering
- **Proponents:** US National Security Agency
- **Core:** Independent layers that are each assumed to fail, so a breach of one is contained by the next. The conditions are what matter and what the name does not supply on its own: independence, diversity, and assumed failure. Correlated controls stacked together are not defence in depth

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

### Residuality Theory
- **Also known as:** residue-based architecture, stressor analysis
- **Proponents:** Barry M. O'Reilly ("Residues", Leanpub 2024; Procedia Computer Science 2020–2022)
- **Core:** Start from a deliberately inadequate naive architecture, apply stressors (technical, regulatory, competitive, organisational), identify the residue — what survives — then redesign for controlled failure; contagion analysis surfaces coupling that only appears in production; inverts the design question from "what do we build?" to "what survives?"

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
- **Also known as:** Lightweight Approach for Software Reviews
- **Proponents:** Stefan Toth, Stefan Zörner
- **Core:** Lightweight review method for efficient software reviews — uncovers weaknesses and challenges architectural ideas; more streamlined than ATAM. Key elements: Lean Mission Statement (shared vision), Evaluation Criteria (quantified quality attributes), Risk-based Review, Quality-focused Analysis, LASR Result Diagram (objectives vs. assessment), workshop format (moderated team event with LASR-Cards). Community-driven and free to use (lasr-reviews.org)

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

### Circuit Breaker
- **Also known as:** Circuit Breaker stability pattern
- **Proponents:** Michael Nygard, Martin Fowler
- **Core:** Wraps remote calls in a closed/open/half-open state machine that trips on a failure threshold to fail-fast and trigger fallbacks, preventing cascading failure; pairs with timeout, retry, and bulkhead

### Strangler Fig
- **Also known as:** Strangler Fig Application
- **Proponents:** Martin Fowler
- **Core:** Incrementally retire a legacy system by placing a routing facade in front of it and migrating capabilities piece by piece into a new system that grows until it "strangles" and replaces the host, avoiding a big-bang rewrite

### Team Topologies
- **Proponents:** Matthew Skelton, Manuel Pais
- **Core:** Org-design framework for fast flow: four team types (stream-aligned, enabling, complicated-subsystem, platform) and three interaction modes (collaboration, X-as-a-Service, facilitating) that limit team cognitive load and operationalize Conway's Law via the Inverse Conway Maneuver and explicit Team APIs

### Twelve-Factor App
- **Also known as:** 12-Factor App
- **Proponents:** Adam Wiggins (Heroku)
- **Core:** Twelve principles for portable, scalable cloud-native/SaaS apps — config in env, stateless disposable processes, backing services as attached resources, strict build-release-run separation, port binding, horizontal concurrency, dev/prod parity, and logs as event streams

## Design Principles

### Refactoring Catalog according to Fowler
- **Also known as:** Fowler's refactorings, named refactorings, or one entry by name (*Extract Function*, *Move Field*)
- **Proponents:** Martin Fowler, Kent Beck, William Opdyke
- **Core:** Named, behaviour-preserving transformations with written mechanics, each small enough to keep the tests green. Code smells say why a change is needed; the catalog says how. Use the qualified form — the bare verb "refactor" covers any code change, including one that alters behaviour

### CQS (Command-Query Separation)
- **Also known as:** CQS; Fowler prefers "modifiers" over "commands"
- **Proponents:** Bertrand Meyer
- **Core:** A method either returns a value and changes nothing, or changes state and returns nothing. Asking a question must not change the answer. This is a rule for every single method, including in code that will never have two models — that is what separates it from CQRS

### Railway Oriented Programming
- **Also known as:** ROP, two-track programming, errors as values
- **Proponents:** Scott Wlaschin
- **Core:** Compose steps on two tracks, success and failure, so a failure short-circuits the rest instead of being thrown. Names the composition style, not a library: `Result` in F# and Rust, Either-style types elsewhere. Wlaschin wrote the counterweight himself — it is a domain-modelling tool, not a default

### Principle of Least Privilege (Saltzer & Schroeder)
- **Also known as:** PoLP, least authority (POLA), need-to-know
- **Proponents:** Jerome H. Saltzer, Michael D. Schroeder
- **Core:** "Every program and every user of the system should operate using the least set of privileges necessary to complete the job" (1975). It earns its keep on the artifacts nobody thinks to scope — CI tokens, IAM policies, agent tool permissions — not on questions that already name the problem

### DRY (Don't Repeat Yourself)
- **Also known as:** DRY Principle; antonym WET ("Write Everything Twice" / "We Enjoy Typing")
- **Proponents:** Andy Hunt & Dave Thomas (*The Pragmatic Programmer*, 1999)
- **Core:** Every piece of knowledge must have a single, unambiguous, authoritative representation within a system; targets duplicated knowledge/intent, not coincidental textual similarity; pair with the Rule of Three (Fowler) and the wrong-abstraction caution ("duplication is far cheaper than the wrong abstraction", Sandi Metz) to avoid premature, leaky abstractions

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

### IOSP (Integration Operation Segregation Principle)
- **Also known as:** IOSP, Ralf Westphal's IOSP
- **Proponents:** Ralf Westphal, Stefan Lieser
- **Core:** A function shall either contain logic (Operation) or call other functions (Integration), but never both; the formal refinement of SRP at function level; separates integration (coordination/sequencing) from operation (business logic/computation); eliminates mock-heavy tests by avoiding new'ing in functions that contain logic; formally checkable via IospAnalyzer (Roslyn); reduces the need for Dependency Injection (DIP) at the function level; narrows the Applicator/Alternator distinction in IODA Architecture

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

### Finite State Machine
- **Also known as:** FSM, finite automaton, state machine
- **Proponents:** George H. Mealy, Edward F. Moore, David Harel
- **Core:** A finite, named set of states, events and a complete transition table in which every state/event cell is a decision, including what happens on an invalid event. Mealy versus Moore output, guards and actions, and Harel statecharts against state explosion. The model behind the GoF State pattern, which is one way to code it

### BlinkWithoutDelay
- **Also known as:** Blink without Delay, the `millis()` pattern, non-blocking timing in a superloop
- **Proponents:** David A. Mellis, Arduino
- **Core:** The Arduino example that never calls `delay()`: each task stores a timestamp and checks `now - last >= interval` on every pass of `loop()`, which stays correct across the `millis()` wrap. One timer per task gives cooperative multitasking without an OS; the next step is a finite state machine

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

### Separation of Concerns
- **Also known as:** SoC
- **Proponents:** Edsger W. Dijkstra
- **Core:** Isolate each distinct aspect or responsibility (correctness vs. efficiency, logic vs. presentation, domain vs. persistence) so it can be reasoned about and changed independently — the structural basis for modularity, high cohesion, and low coupling

### Unix Philosophy
- **Proponents:** Doug McIlroy, Eric S. Raymond
- **Core:** Make each program do one thing well, compose small sharp tools through pipes, and treat plain text streams as the universal interface

### Design by Contract
- **Also known as:** DbC, Programming by Contract
- **Proponents:** Bertrand Meyer
- **Core:** Specifies software correctness as enforceable preconditions (caller's obligation), postconditions (supplier's guarantee), and class invariants — assigning blame on violation, formalizing behavioural subtyping (LSP), and coined for Eiffel by Bertrand Meyer

### Defensive Programming according to McConnell
- **Also known as:** defensive coding
- **Proponents:** Steve McConnell (Code Complete, 2nd ed., chapter 8)
- **Core:** Protect the program from invalid input with a barricade: validate untrusted data once at the public interface, use assertions for conditions that must never occur inside, and choose robustness or correctness per system. Not "try/catch everywhere" and not double-checking in every helper; the barricade is what reconciles it with Design by Contract

### Deep Modules
- **Also known as:** Module Depth, Deep Classes
- **Proponents:** John Ousterhout
- **Core:** Simple interface hiding powerful implementation — a module is deep when its benefit (functionality provided) far exceeds its cost (interface complexity); shallow modules and "classitis" (too many tiny classes) are the anti-patterns; companion principle: "different layer, different abstraction"; rooted in information hiding (Parnas)

### Locality of Behaviour
- **Also known as:** Locality of Behavior (American spelling); LoB — but never use the abbreviation alone, it reads as "Line of Business"
- **Proponents:** Carson Gross (htmx essay, 2020)
- **Core:** "The behaviour of a unit of code should be as obvious as possible by looking only at that unit of code" — optimise for read-time cost over write-time cost; behaviour at a distance (remote handlers, name-binding conventions, invisible framework hooks) is the failure mode, co-location the remedy; an explicit trade against DRY and Separation of Concerns where they scatter one feature across many files, not a claim that they are wrong

### Boy Scout Rule
- **Also known as:** Leave the campground cleaner than you found it, Check in cleaner than you checked out
- **Proponents:** Robert C. Martin (Clean Code, 2008; the rule itself credited by him to the Boy Scouts of America)
- **Core:** Every time you open a file for some other reason, leave it slightly better than you found it -- rename an unclear variable, delete dead code, fix a stale comment -- bounded to the code the task already touched, small enough to need no ticket, and kept separable from the behavioural change

### CUPID Properties
- **Also known as:** The CUPID properties, joyful code
- **Proponents:** Dan North (dannorth.net, 2022)
- **Core:** Five properties of code that is pleasant to work in -- Composable, Unix philosophy, Predictable, Idiomatic, Domain-based -- offered against SOLID as qualities you move toward rather than rules you comply with; note the exact words, since the D is Domain-*based* (not Domain-driven) and the I is *Idiomatic* (not Intelligible)

## Problem-Solving

### Chesterton's Fence
- **Also known as:** the fence across the road; "why is this here?"
- **Proponents:** G.K. Chesterton (*The Thing*, 1929, "The Drift from Domesticity")
- **Core:** Before removing something whose purpose you cannot see, establish why it is there — the odd-looking check is the one most likely to be load-bearing. Not a veto: once a timeboxed, good-faith search turns up nothing, removal is earned, provided it is reversible and observed. Runs *backwards* from an artifact already standing, where Second-Order Thinking runs forwards from a change you are about to make


### DMADV
- **Also known as:** DFSS, Design for Six Sigma
- **Proponents:** Motorola, General Electric
- **Core:** Define, Measure, Analyze, Design, Verify — the design-side sibling of DMAIC, for when the process does not exist yet. Activates CTQ translation, QFD, Kano, Pugh, DOE and tolerance design rather than control charts

### PDCA
- **Also known as:** Plan-Do-Check-Act, the Deming cycle, the Shewhart cycle; PDSA with "Study"
- **Proponents:** Walter A. Shewhart, W. Edwards Deming, Kaoru Ishikawa
- **Core:** State a hypothesis before acting, then standardise the gain after — the two parts that separate it from generic iteration. Deming rejected "Check" as a corruption and insisted on PDSA

### SIPOC
- **Also known as:** COPIS (read right-to-left, customer-first)
- **Proponents:** Total Quality Management practice (no single originator)
- **Core:** Suppliers, Inputs, Process, Outputs, Customers in five columns, drawn to settle where a process starts and stops before anyone argues about details; the Define-phase artifact of DMAIC

### Ishikawa Diagram
- **Also known as:** fishbone diagram, cause-and-effect diagram
- **Proponents:** Kaoru Ishikawa
- **Core:** Causes grouped under named parallel categories (the 6M: Machine, Method, Material, Measurement, Manpower, Milieu), for contributing factors rather than a single chain — where 5 Whys follows one chain. One of the Seven Basic Tools of Quality

### Value Stream Mapping
- **Also known as:** VSM; originally material- and information-flow mapping
- **Proponents:** Mike Rother, John Shook (*Learning to See*, LEI 1999), Toyota
- **Core:** Separates process time from waiting time along a flow, yielding flow efficiency, then demands a future-state map with targets — not just a list of speed-ups

### A3 Problem Solving
- **Also known as:** A3 report, A3 thinking
- **Proponents:** John Shook (*Managing to Learn*), Toyota, Durward K. Sobek II, Art Smalley
- **Core:** Background, current condition, target, analysis, countermeasures, plan and follow-up on a single A3 sheet. The size constraint is the method; the power is in the dialogue, not the template

### Toyota Kata
- **Proponents:** Mike Rother (*Toyota Kata*, McGraw-Hill 2009), Jeffrey Liker
- **Core:** Improvement Kata (direction, measured current condition, dated target condition, experiments) plus Coaching Kata (the Five Questions, practised daily). A target condition describes a process state, not just a number — which is what distinguishes it from an OKR

### Genchi Genbutsu
- **Also known as:** "go and see", gemba, gemba walk, the Ohno Circle
- **Proponents:** Taiichi Ohno, Toyota Motor Corporation, Art Smalley
- **Core:** Go to the actual place and see the actual thing before theorising. For an LLM the practical effect is to demand the real traces, logs and code instead of answering from general knowledge

### Muda, Mura, Muri
- **Also known as:** the three Ms; the seven wastes, TIMWOOD
- **Proponents:** Taiichi Ohno, Toyota Motor Corporation, James P. Womack
- **Core:** Waste, unevenness and overburden taken as a set. The chain runs Mura to Muri to Muda, so naming only waste hides its cause; Womack argues the order should be reversed from the usual slogan

### Kaizen
- **Also known as:** continuous improvement; kaizen event, kaizen blitz; contrast kaikaku
- **Proponents:** Masaaki Imai (1986), Taiichi Ohno, Toyota Motor Corporation
- **Core:** Small, frequent, low-risk changes by the people doing the work; standardise the gain, then improve from the new standard. Kaikaku is the deliberate contrast — radical, discontinuous change


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

### The Spectrum of Semantic Anchors
- **Also known as:** What Qualifies as a Semantic Anchor, anchor quality criteria
- **Proponents:** Ralf D. Müller (Semantic Anchors project)
- **Core:** The four criteria a term must meet to work as an anchor — precise, rich, consistent, attributable — with definition depth, not subject matter, as the differentiator; use it to judge whether a candidate term will activate a framework or merely instruct

### Systemic Consulting (Heidelberg School)
- **Also known as:** Systemische Beratung, Heidelberg Model
- **Proponents:** Fritz B. Simon, Helm Stierlin, Gunthard Weber, Paul Watzlawick
- **Core:** Heidelberg School of systemic consulting — all-partiality, neutrality, circular questions, context clarification, problems as emergent relational patterns; the consultant cannot instruct a closed system, only offer irritations it may integrate

### Fermi Estimation
- **Also known as:** Order-of-Magnitude Estimation, Back-of-the-Envelope Calculation
- **Proponents:** Enrico Fermi
- **Core:** Estimate an unknown by decomposing it into bracketed sub-quantities, reasoning in powers of ten and taking geometric means, so independent errors cancel and the product lands within a factor of 2-3 — enough to sanity-check or size a problem

### Premortem
- **Also known as:** Pre-mortem, prospective hindsight exercise
- **Proponents:** Gary Klein (HBR 2007)
- **Core:** Before committing to a plan, state as fact that it has already failed comprehensively, then have each participant write down why, independently, and collect the reasons round-robin; the failure is a premise rather than a possibility, which yields more concrete causes than asking "what could go wrong?"

### Second-Order Thinking
- **Also known as:** Second-Level Thinking (Howard Marks); second- and third-order consequences (Ray Dalio)
- **Proponents:** Howard Marks, Ray Dalio, Shane Parrish (Farnam Street)
- **Core:** Follow a consequence into the next consequence rather than listing more effects at the same level; first-order effects are immediate and visible, second-order effects are delayed, behavioural and often dominant; applies to inaction too

## Requirements Engineering

### Connextra User Story Format
- **Also known as:** the user story template, role-goal-benefit, "As a … I want … so that …"
- **Proponents:** Rachel Davies, Connextra team, Mike Cohn
- **Core:** Three parts that force a story to name who wants it and why, not just what to build. INVEST judges a story's quality; this names its form. Always say "Connextra user story format" — the bare company name is not a reliable anchor

### QFD
- **Also known as:** Quality Function Deployment; Blitz QFD
- **Proponents:** Yoji Akao, Shigeru Mizuno, Glenn Mazur
- **Core:** A method that deploys customer needs through design, process and production decisions. Its best-known *tool* — not a second name for it — is the House of Quality, a matrix mapping needs (WHATs) to technical characteristics (HOWs) with a correlation "roof" showing where two characteristics reinforce or conflict; that conflict view is what neither Pugh Matrix nor Kano Model carries. Mazur calls HoQ-only QFD "a most common myth"; in Blitz QFD the House may be skipped entirely. Standardised as ISO 16355


### Cockburn Use Cases
- **Also known as:** Fully Dressed Use Cases, Goal-Level Use Cases
- **Proponents:** Alistair Cockburn
- **Core:** Structured textual use case format — Primary Actor, Stakeholders & Interests, Preconditions, Trigger, Main Success Scenario, Extensions, Postconditions; three Goal Levels (Summary/Kite, User Goal/Sea Level, Subfunction/Fish); Actor-Goal List as discovery technique; deliberately prose-based and notation-agnostic — does NOT prescribe Activity Diagrams, Gherkin, or EARS, which are complementary representations

### Event Storming according to Alberto Brandolini
- **Also known as:** EventStorming
- **Proponents:** Alberto Brandolini (2012/2013)
- **Core:** Collaborative workshop that models a domain as past-tense domain events on a timeline using a fixed colour notation (orange Event, blue Command, yellow Aggregate, lilac Policy, green Read Model, pink External System, red Hotspot); runs at three levels (Big Picture, Process Modeling, Design Level); surfaces bounded-context seams via pivotal events and makes assumptions explicit as hotspots; Reverse Event Storming reconstructs legacy systems

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

### Laddering (Interview Technique)
- **Also known as:** Means-End Laddering, Laddering Interview
- **Proponents:** George Kelly, Dennis Hinkle, Thomas Reynolds, Jonathan Gutman
- **Core:** Bidirectional interview technique that maps attribute→consequence→value chains by laddering up ("why is that important to you?") toward values and down ("how / for example?") toward specifics; surfaces a hierarchy of user motivations rather than a single root cause like Five Whys

### req42
- **Proponents:** Peter Hruschka, Markus Meuten
- **Core:** Free, open-source AsciiDoc template for pragmatic agile requirements documentation — the requirements companion to arc42, covering goals, stakeholders, scope, backlog, quality requirements, constraints, and risks

## Communication & Presentation

### Inverted Pyramid Style
- **Also known as:** News Style, Front-Loading
- **Proponents:** journalistic convention (late-19th-century American wire-service press)
- **Core:** Lead with the most newsworthy who/what/when/where/why, then detail in decreasing importance so a reader can stop anywhere; allows a long prunable tail; distinct from BLUF (deliberately short) and the Pyramid Principle (complete MECE argument)

### BLUF (Bottom Line Up Front)
- **Proponents:** US Military
- **Core:** Lead with conclusion/recommendation, then details

### AIDA Model
- **Also known as:** AIDA Funnel; variants AIDAS (+Satisfaction), AIDCA (+Conviction), AIDA-R (+Retention)
- **Proponents:** E. St. Elmo Lewis (1898)
- **Core:** Copywriting/advertising funnel — Attention → Interest → Desire → Action; a sequential hierarchy-of-effects model that makes persuasive copy do each job in turn (hook, relevance, wanting, call to action); a heuristic, not measured cognitive science; for persuasion, not informational writing (use BLUF/Inverted Pyramid there)

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

### Bloom's Taxonomy
- **Also known as:** Bloom's Revised Taxonomy, Anderson & Krathwohl Taxonomy, Taxonomy of Educational Objectives
- **Proponents:** Benjamin Bloom (1956); Lorin Anderson & David Krathwohl (2001 revision)
- **Core:** Six-level hierarchy of cognitive learning objectives — Remember, Understand, Apply, Analyze, Evaluate, Create — each with measurable action verbs; the 2001 revision verb-ifies the levels, reorders the top two (ends in Create), and adds a knowledge dimension (factual/conceptual/procedural/metacognitive); used to write testable learning objectives and assessments that target higher-order thinking rather than recall; a design heuristic, not a strict ladder

### Chatham House Rule
- **Proponents:** Chatham House
- **Core:** Info can be used but not attributed to speaker/org

### Socratic Method
- **Core:** Ask questions to stimulate critical thinking and illuminate ideas

### Myers-Briggs Type Indicator (MBTI)
- **Also known as:** MBTI, Myers-Briggs, 16 Personality Types
- **Proponents:** Isabel Briggs Myers, Katharine Cook Briggs, Carl Gustav Jung
- **Core:** Four dichotomies (E/I, S/N, T/F, J/P) produce 16 personality types describing communication preferences, decision-making styles, and team dynamics

### Big Five (OCEAN) Personality Traits
- **Also known as:** OCEAN, Five-Factor Model (FFM), the Big Five, CANOE
- **Proponents:** Lewis R. Goldberg; Paul T. Costa & Robert R. McCrae
- **Core:** Five continuous, largely independent trait dimensions — Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — scored on a spectrum (not types); the empirically dominant trait model. Name the task ("profile along the five OCEAN dimensions") for reliable activation

### HEXACO Personality Model
- **Also known as:** HEXACO, Six-Factor Model, the H Factor
- **Proponents:** Kibeom Lee & Michael C. Ashton
- **Core:** Six trait dimensions — Honesty-Humility, Emotionality, eXtraversion, Agreeableness, Conscientiousness, Openness. Essentially Big Five plus Honesty-Humility (H), the strongest trait predictor of unethical/exploitative behaviour and the Dark Triad — its distinct value over Big Five. Name the task ("assess along HEXACO, especially Honesty-Humility") for reliable activation

### DISC Model (Marston)
- **Also known as:** DISC, DiSC
- **Proponents:** William Moulton Marston (theory, 1928)
- **Core:** Four behavioural styles — Dominance, Influence, Steadiness, Conscientiousness — a lightweight communication-style shorthand. Advisory: classified as pseudoscience with no demonstrated predictive validity; use for reflection/dialogue, not selection. Name the task ("map onto the DISC quadrants") for reliable activation

### Curse of Knowledge
- **Proponents:** Camerer, Loewenstein & Weber; popularized by Chip & Dan Heath
- **Core:** Once you know something you cannot imagine not knowing it, so experts overestimate shared context and leave jargon and steps unexplained; the antidote is to surface assumptions, define terms, and model the audience

### Four-Sides Model (Schulz von Thun)
- **Also known as:** Communication Square, Four-Ears Model, Vier-Seiten-Modell
- **Proponents:** Friedemann Schulz von Thun
- **Core:** Every message carries four facets at once — factual information (Sachinhalt), self-revelation (Selbstoffenbarung), relationship (Beziehung), and appeal (Appell); the sender speaks with "four beaks" and the receiver listens with "four ears", and mismatched ears cause misunderstanding

### Progressive Disclosure
- **Also known as:** Layered Information Disclosure, Training Wheels Design
- **Proponents:** John M. Carroll (IBM, 1983–1984); popularized by Jakob Nielsen / NN/g
- **Core:** Show only the most important options first; reveal advanced or rarely used features on demand to reduce cognitive load — improves learnability, efficiency, and error rate simultaneously

### Zone of Proximal Development
- **Also known as:** ZPD; Zone of Next Development
- **Proponents:** Lev Vygotsky
- **Core:** Distance between what a learner can do independently (actual development level) and what they can achieve with guidance from a More-Knowledgeable Other (MKO); scaffolding — coined by Wood, Bruner & Ross (1976), not Vygotsky — provides temporary support within the ZPD; fading gradually withdraws that support as competence grows; applicable when pitching instruction, prompting LLMs to calibrate explanation depth, or reviewing documentation for audience fit

### Sender-Receiver Discrepancy
- **Also known as:** Communication Gap, Encoding-Decoding Gap, Sender-Empfänger-Diskrepanz
- **Proponents:** Claude Shannon & Warren Weaver, Friedemann Schulz von Thun, Stuart Hall, Herbert H. Clark & Susan E. Brennan (umbrella — no single proponent)
- **Core:** Intended meaning ≠ received meaning; the sender encodes and the receiver decodes through independent cognitive processes, so the reconstructed meaning is not guaranteed to match the intent. Cause-agnostic umbrella over Shannon-Weaver (noise in channel), Schulz von Thun (four-sides mismatched ears), Hall (active decoding positions), and Clark (insufficient common ground); names the phenomenon before choosing a diagnostic framework. Candidate contract rather than single-proponent anchor.

### Tufte Style
- **Also known as:** Tufte's principles of information design; shipped as `theme_tufte` (ggthemes), Tufte CSS, tufte-latex, matplotlib-tufte
- **Proponents:** Edward R. Tufte
- **Core:** Information-design principles for charts, dashboards and reports — maximize the data-ink ratio, remove chartjunk, keep graphical integrity (lie factor ≈ 1), use small multiples on shared axes, sparklines inline in text, and direct labels instead of legends; density is the goal, not emptiness (remove waste, then spend the space on more information); the name also covers the sidenote page layout of Tufte CSS/tufte-latex, so say which you mean

### Crisis and Emergency Risk Communication (CERC)
- **Also known as:** CERC -- but the bare acronym does not carry the meaning; spell it out
- **Proponents:** Barbara Reynolds and Matthew W. Seeger (Journal of Health Communication, 2005); US CDC as institutional owner of the manual
- **Core:** Six principles for communicating while the facts are still missing -- Be First, Be Right, Be Credible, Express Empathy, Promote Action, Show Respect -- built on the premise that you must speak before you know, and organised along the crisis lifecycle

### Dale Carnegie Principles
- **Also known as:** Carnegie principles, How to Win Friends principles
- **Proponents:** Dale Carnegie (How to Win Friends and Influence People, 1936; revised 1981)
- **Core:** Open with honest appreciation, raise the problem second, point out mistakes indirectly and let the other person keep their standing; ask rather than order, argue from the other person's interest, and never criticise the person in place of the work

## Documentation

### Keep a Changelog
- **Also known as:** the `CHANGELOG.md` convention, the Added/Changed/Fixed format
- **Proponents:** Olivier Lacan
- **Core:** A curated, human-readable release history: an `[Unreleased]` section, latest version first, ISO 8601 dates, and six change types — Added, Changed, Deprecated, Removed, Fixed, Security. Deliberately not generated from the commit log, which is the tension with Conventional Commits

### P.A.R.A. Method
- **Also known as:** PARA Framework, Second Brain Organization System
- **Proponents:** Tiago Forte
- **Core:** Organize all information into four categories by actionability — Projects (specific goal + deadline), Areas (ongoing responsibilities), Resources (reference topics), Archive (inactive items)

### Diátaxis Framework
- **Core:** 4 quadrants: Tutorials, How-to guides, Explanations, Reference

### Docs-as-Code
- **Proponents:** Ralf D. Müller
- **Core:** Docs in version control, CI/CD, same workflow as code

### Simplified Technical English (ASD-STE100)
- **Also known as:** STE; formerly AECMA Simplified English
- **Proponents:** ASD (AeroSpace and Defence Industries Association of Europe), maintained by the STEMG
- **Core:** Controlled language for technical documentation — 53 writing rules in 9 sections plus a dictionary of ~900 approved words (each admitted in one meaning and one part of speech) and ~1,200 non-approved words with alternatives; separate rules for procedures and descriptions; Issue 9 (2025), free of charge. Tier 2: use the qualified form, the spelled-out name carries better than the specification number on weak models

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

### Site Reliability Engineering (SRE)
- **Also known as:** Operations as a software problem, Google SRE
- **Proponents:** Ben Treynor Sloss, Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy
- **Core:** Apply software engineering to operations; SLI/SLO/SLA; error budgets balance reliability vs. feature velocity (100% is the wrong target); eliminate toil with ~50% ops cap; blameless postmortems; four golden signals (latency, traffic, errors, saturation); release & capacity engineering

### Effective Java
- **Proponents:** Joshua Bloch
- **Core:** Catalog of ~90 "Items" of idiomatic Java best practice — static factories & the Builder pattern, the equals/hashCode contracts, minimize mutability, composition over inheritance, generics with PECS, enums over int constants, and try-with-resources

### Effective Python
- **Proponents:** Brett Slatkin
- **Core:** Catalog of ~125 "Items" of idiomatic ("Pythonic") best practice — PEP 8 & the Zen of Python, comprehensions and generators over map/filter, prefer exceptions to returning None, keyword-only arguments, compose classes and use @property, threads for I/O vs. the GIL, asyncio and concurrent.futures for concurrency

### 50/72 Rule
- **Also known as:** Git Commit Message Convention, Seven Rules of Git Commits
- **Proponents:** Tim Pope
- **Core:** Subject line ≤ 50 characters, imperative mood, blank line separator, body wrapped at 72 characters, body explains why not how; enables `git log`, `rebase`, and `format-patch` to display history cleanly across terminals, UIs, and email patches

## Statistical Methods

### SPC (Statistical Process Control)
- **Proponents:** Walter A. Shewhart, W. Edwards Deming
- **Core:** Monitor process stability with statistical methods

### Control Chart (Shewhart)
- **Core:** Plot data over time with control limits

### Nelson Rules
- **Core:** 8 rules for detecting non-random patterns in control charts

### DMAIC
- **Also known as:** the Six Sigma improvement cycle; sibling DMADV/DFSS for new designs
- **Proponents:** Bill Smith (Motorola, 1986), Mikel J. Harry, General Electric (Jack Welch, 1995)
- **Core:** Five gated phases — Define (charter, CTQs), Measure (baseline), Analyze (validated root causes), Improve (piloted solutions), Control (control plan, usually SPC) — that force measurement before improvement and cause before solution; standardized as ISO 13053-1:2011

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

### OKR (Objectives and Key Results)
- **Proponents:** Andy Grove, John Doerr
- **Core:** A qualitative Objective paired with 3-5 measurable Key Results, set on a quarterly cadence as ambitious stretch goals (~0.7 = success), kept transparent for alignment and decoupled from compensation

### Eisenhower Matrix
- **Also known as:** Urgent-Important Matrix, Eisenhower Box, Time Management Matrix
- **Proponents:** Dwight D. Eisenhower (attrib.), Stephen Covey
- **Core:** Plots tasks on two axes — urgency × importance — into four quadrants (Do, Schedule, Delegate, Delete) to separate genuine importance from manufactured urgency; admitted with a Criticism section (mere-urgency effect) since its framing is contested

### Consent vs. Consensus
- **Proponents:** Gerard Endenburg (Sociocracy), Brian Robertson (Holacracy)
- **Core:** Consensus requires everyone's active "yes"; consent requires only the absence of a paramount, reasoned objection ("good enough for now, safe enough to try"), so objections are argued and integrated rather than vetoed — speeding decisions and avoiding lowest-common-denominator outcomes and groupthink

## Knowledge Management

### Dreyfus Model of Skill Acquisition
- **Proponents:** Stuart Dreyfus, Hubert Dreyfus
- **Core:** Five stages from Novice to Expert (Novice, Advanced Beginner, Competent, Proficient, Expert) tracing a shift from rigid rule-following to intuitive pattern recognition, so teaching and explanation depth should match the learner's stage

### ADDIE Model
- **Also known as:** ADDIE, Instructional Systems Design (ISD)
- **Proponents:** Florida State University; Robert Maribe Branch
- **Core:** Five-phase instructional-design process — Analysis, Design, Development, Implementation, Evaluation (formative + summative, often paired with Kirkpatrick) — modern usage iterative rather than strict waterfall

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
