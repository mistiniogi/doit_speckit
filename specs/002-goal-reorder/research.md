# Research Phase: Goal Reordering via Drag-and-Drop

**Phase**: Phase 0 (Research & Technology Selection)  
**Date**: 2026-02-15  
**Status**: Complete

## Research Summary

All clarifications from the specification have been resolved in the clarification phase. This research phase validates the chosen technology stack (Sortable.js + Tailwind CSS) and confirms it meets the specification requirements.

## Technology Decisions

### Decision 1: Drag-and-Drop Library Selection

**Question**: Which library should handle the drag-and-drop interactions?

**Options Evaluated**:

1. **Native HTML5 Drag-and-Drop API**
   - **Pros**: No external dependency, built into browsers
   - **Cons**: Verbose event handling, poor touch support, no animations, manual accessibility scaffolding required
   - **Effort**: ~500+ lines custom code + cross-browser testing

2. **Sortable.js** ✅ **CHOSEN**
   - **Pros**: Lightweight (29KB), well-maintained (40k+ GitHub stars), excellent accessibility, touch support, smooth animations, vanilla JS (no framework dependency)
   - **Cons**: External dependency (requires Constitution amendment)
   - **Effort**: ~100 lines integration code

3. **React Beautiful DnD**
   - **Pros**: React-first design, great UX, well-documented
   - **Cons**: Large bundle size (190KB+), overkill for simple within-column reordering, heavy dependency

4. **dnd-kit**
   - **Pros**: Modern, React hooks-based, good accessibility
   - **Cons**: Complex API learning curve, heavier than Sortable.js for our use case

**Decision Rationale**: 
Sortable.js is the optimal choice. It provides robust drag-and-drop functionality with minimal overhead, excellent cross-browser and touch support, built-in keyboard accessibility, and smooth 60fps animations. This aligns with the specified performance goals (60fps drag, <200ms drop indicator) without framework overhead or large bundle impact.

**Constitution Impact**: Requires amendment to add Sortable.js to locked dependencies (v1.0.0 → v1.1.0).

### Decision 2: VisualFeedback and CSS Styling

**Question**: How should visual feedback be implemented during drag operations?

**Approach**: Tailwind CSS utilities with data attributes for state management

**Implementation**:
- **Dragged item opacity**: Use `opacity-50` class when `data-dragging="true"`
- **Drop indicator**: Horizontal line created via Tailwind border utilities (e.g., `border-t-2 border-blue-400`)
- **Cursor styles**: Tailwind `cursor-grab` and `cursor-grabbing` utilities
- **Animations**: CSS transitions for smooth feedback (built into Sortable.js)

**Rationale**: 
Tailwind CSS v4 (locked) provides all necessary utilities for visual feedback without custom CSS. Using data attributes keeps the styling approach declarative and readable. This maintains the Constitution's principle of "Simple UX" and "Clean Code."

### Decision 3: State Persistence and Cross-Tab Sync

**Question**: How should goal order be persisted and synced across tabs?

**Approach**: localStorage with storage event listeners

**Implementation**:
1. When user drops a goal, the new order is serialized to JSON and saved to localStorage under key `doit_goal_order_<status>`
2. A `storage` event listener in the Goal service detects changes in other tabs
3. The listener triggers a state update in the React component, which re-renders with the new order
4. No backend or IndexedDB needed for MVP

**Rationale**:
- Uses native browser APIs (no new dependencies beyond Sortable.js)
- Simple and reliable for single-user, single-device scenario
- Meets FR-013 requirement (FR-013: cross-tab sync via localStorage events)
- Aligns with Constitution's "Minimal Dependencies" principle

**Performance**: localStorage is synchronous; for MVP scale, this is acceptable. Updates are immediate (no perceptible lag).

## Specification Alignment

| Requirement | Technology Choice | Validation |
|-------------|-------------------|-----------|
| FR-001: Drag-and-drop in active column | Sortable.js with `data-status="active"` groups | ✅ Native API, touch support, 60fps |
| FR-002: Drag-and-drop in completed column | Sortable.js with `data-status="completed"` groups | ✅ Same as above |
| FR-003: Visual drop indicator | Tailwind `border-t-2 border-blue-400` line | ✅ Sortable.js built-in ghost element |
| FR-004: Semi-transparent dragged item | Tailwind `opacity-50` class | ✅ CSS-based, instant feedback |
| FR-005: Cursor styles (grab/grabbing) | Tailwind `cursor-grab` and `cursor-grabbing` | ✅ Native CSS properties |
| FR-006: Prevent drag on interactive elements | Sortable.js `handle` option or `filter` class | ✅ Sortable.js supports element filtering |
| FR-007: Persist to localStorage | localStorage API | ✅ Immediate persistence, no backend |
| FR-008: Cancel drag on status change | Sortable.js `cancel()` method | ✅ Event-based cancellation |
| FR-009: Smooth 60fps performance | Sortable.js + Tailwind CSS animations | ✅ Hardware-accelerated transforms |
| FR-010: Keyboard accessibility | Sortable.js with `forceFallback: true` for touch | ✅ Sortable.js provides keyboard patterns |
| FR-011: Independent column ordering | Separate Sortable instances per column | ✅ Isolated state per column |
| FR-012: Auto-scroll near edges | Sortable.js `scroll` and `scrollSensitivity` options | ✅ Built-in feature |
| FR-013: Cross-tab sync | localStorage + storage event listeners | ✅ Native browser API |
| SC-001-SC-008: All success criteria | Sortable.js + Tailwind CSS stack | ✅ Meets all measurable outcomes |

## Constitution Compliance

### Current Constitution v1.0.0 Status

**Locked Dependencies (baseline)**:
- Next.js 16.1.6 ✅
- React 19.2.3 ✅
- React-DOM 19.2.3 ✅
- Tailwind CSS v4 ✅
- TypeScript ^5 ✅
- ESLint ^9 ✅

**New Dependency Needed**:
- **Sortable.js** (latest LTS version, pinned)

### Principle Compliance

✅ **I. Clean Code**: Sortable.js reduces custom code; Tailwind CSS provides clean styling utilities
✅ **II. Simple UX**: Drag-and-drop is intuitive; minimal visual complexity
✅ **III. Responsive Design**: Sortable.js touch support; Tailwind CSS responsive utilities
✅ **IV. Minimal Dependencies**: Only 1 new dependency (Sortable.js); justified and necessary
✅ **NO TESTING**: No test files will be created; verification via `npm run dev` visual testing

### Constitutional Amendment Required

**Current**: Constitution v1.0.0 Technology Stack section states locked versions only
**Proposed Change**: Add Sortable.js to the locked dependencies list with version pinning
**Amendment Type**: MINOR (new technology addition)
**New Version**: v1.1.0

**Amendment Text**:
> Locked versions from package.json:
> - **Next.js**: 16.1.6 (main framework)
> - **React**: 19.2.3 (UI library)
> - **React-DOM**: 19.2.3 (DOM rendering)
> - **Tailwind CSS**: v4 (styling engine)
> - **TypeScript**: ^5 (type safety)
> - **ESLint**: ^9 (linting)
> - **Sortable.js**: [latest LTS version] (drag-and-drop interactions)

## Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Sortable.js adds bundle size | Low | Library is 29KB; acceptable for benefit gained |
| Touch support edge cases | Medium | Sortable.js is battle-tested on mobile; test on actual devices during visual QA |
| Cross-browser compatibility | Low | Sortable.js supports IE11+; modern browsers fully compatible |
| localStorage limitations (5-10MB) | Low | Goal order is tiny JSON; no storage limitation risk |
| Race conditions on rapid tab sync | Low | localStorage events include source tab; skip self-updates |

## Next Steps

Phase 1 deliverables:
1. **data-model.md**: Define Goal data structure with `order` property
2. **contracts/**: Define component interfaces for drag-and-drop
3. **quickstart.md**: Setup instructions for Sortable.js integration
4. Update agent context (Technology Stack amendment)

## Conclusion

The selected technology stack (Sortable.js + Tailwind CSS) is well-justified, minimal, and meets all specification requirements. The addition of Sortable.js is the smallest viable dependency to achieve the desired UX quality while maintaining code cleanliness and performance goals.

**Status**: ✅ **APPROVED** - Ready to proceed to Phase 1 (Design & Data Modeling)
