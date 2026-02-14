---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Verification**: Manual verification via `npm run dev` visual inspection and code review. Per Constitution, NO automated testing (unit/integration/e2e) of any kind.

**Organization**: Tasks are grouped by user story to enable independent implementation and visual verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `app/` at repository root
- **Web app**: `app/`, `public/` (for Next.js projects)
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Visually verified independently (via npm run dev)
  - Delivered as an MVP increment
  
  NOTE: Per Constitution v1.0.0, NO TESTS of any kind are permitted.
  Verification happens through code review + visual inspection during development.
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Manual Verification**: [How to visually verify this story works - e.g., "Run npm run dev and verify [UI/behavior]"].

### Implementation for User Story 1

- [ ] T010 [P] [US1] Create [Entity1] model in app/lib/models/[entity1].ts
- [ ] T011 [P] [US1] Create [Entity2] model in app/lib/models/[entity2].ts
- [ ] T012 [US1] Implement [Service] in app/lib/services/[service].ts (depends on T010, T011)
- [ ] T013 [US1] Implement [Component] in app/components/[component].tsx
- [ ] T014 [US1] Add form validation and error handling
- [ ] T015 [US1] Code review: Verify clean code principles (readability, TypeScript typing, modularity)
- [ ] T016 [US1] Visual verification: Run `npm run dev` and verify responsive design across viewports

**Checkpoint**: At this point, User Story 1 should be fully functional and visually verified independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Manual Verification**: [How to visually verify this story works independently via npm run dev]

### Implementation for User Story 2

- [ ] T017 [P] [US2] Create [Entity] model in app/lib/models/[entity].ts
- [ ] T018 [US2] Implement [Service] in app/lib/services/[service].ts
- [ ] T019 [US2] Implement [Component] in app/components/[component].tsx
- [ ] T020 [US2] Integrate with User Story 1 components (if needed)
- [ ] T021 [US2] Code review: Verify clean code and responsive design
- [ ] T022 [US2] Visual verification: Run `npm run dev` across mobile/tablet/desktop

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Manual Verification**: [How to visually verify this story works independently via npm run dev]

### Implementation for User Story 3

- [ ] T023 [P] [US3] Create [Entity] model in app/lib/models/[entity].ts
- [ ] T024 [US3] Implement [Service] in app/lib/services/[service].ts
- [ ] T025 [US3] Implement [Component] in app/components/[component].tsx
- [ ] T026 [US3] Code review: Verify clean code principles
- [ ] T027 [US3] Visual verification: Test across all viewport sizes

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in README.md and docs/
- [ ] TXXX Code cleanup and refactoring for clean code principles
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX Accessibility verification (WCAG standards)
- [ ] TXXX Layout testing across responsive breakpoints
- [ ] TXXX [P] Run quickstart.md validation
- [ ] TXXX Dependency audit: Verify minimal dependency constraint is maintained

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Core implementation before integration
- Code review before visual verification
- Visual verification across all viewport sizes
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in app/lib/models/[entity1].ts"
Task: "Create [Entity2] model in app/lib/models/[entity2].ts"

# Then implement service and component:
Task: "Implement [Service] in app/lib/services/[service].ts"
Task: "Implement [Component] in app/components/[component].tsx"

# Finally, verify visually:
Task: "Code review + npm run dev visual verification"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Visually verify User Story 1 independently via `npm run dev`
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Visually verify independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Visually verify independently → Deploy/Demo
4. Add User Story 3 → Visually verify independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (visual verification)
   - Developer B: User Story 2 (visual verification)
   - Developer C: User Story 3 (visual verification)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and visually verifiable
- Verification via `npm run dev` + code review, NOT automated testing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
