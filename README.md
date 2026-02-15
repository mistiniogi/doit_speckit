# DoIt Goal Tracker Dashboard

A Next.js-based goal management application with drag-and-drop reordering, responsive design, and localStorage persistence.

## Features

### Phase 1-3: Core MVP
- ✅ Two-column goal dashboard (Current Goals | Completed)
- ✅ Add goals with title and end date
- ✅ Mark goals complete with checkbox
- ✅ Delete goals with confirmation modal
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ localStorage persistence

### Phase 4-7: Goal Reordering (Drag-and-Drop)
- ✅ Drag goals within Active Goals column
- ✅ Drag goals within Completed Goals column
- ✅ Visual feedback: cursor changes (grab/grabbing), dragged goal semi-transparent
- ✅ Drop indicator shows target position
- ✅ Auto-scroll when dragging near column edges (FR-012)
- ✅ Keyboard-accessible goal items (Tab navigation)
- ✅ Prevent drag on interactive elements (checkbox, delete button)
- ✅ Cross-tab synchronization via storage events
- ✅ Error handling and data validation

## Tech Stack

- **Framework**: Next.js 16.1.6 with React 19
- **Styling**: Tailwind CSS v4 with Light Pastels color scheme
- **UI Components**: shadcn/ui (Dialog, Form, Button, Checkbox, Card)
- **Drag-and-Drop**: Sortable.js 1.15.7
- **Storage**: localStorage with custom events for cross-tab sync
- **Language**: TypeScript 5.x

**Constitution v1.1.0**: See [.specify/memory/constitution.md](.specify/memory/constitution.md) for locked dependencies and architecture guidelines.

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## File Structure

```
app/
  ├── page.tsx                 # Main page
  ├── layout.tsx              # Root layout
  ├── globals.css             # Global styles + Tailwind directives
  └── components/             # App-level components

components/
  ├── goal-dashboard.tsx      # Main dashboard container
  ├── goal-column.tsx         # Reusable column (active/completed)
  ├── goal-card.tsx           # Individual goal card
  ├── goal-form.tsx           # Add goal form
  ├── goal-form-modal.tsx     # Add goal modal
  ├── delete-confirmation-modal.tsx
  └── ui/                     # shadcn/ui components

hooks/
  ├── use-goals.ts            # Goal state management
  ├── use-sortable-goals.ts   # Sortable.js integration
  └── use-goal-cross-sync-storage.ts # Cross-tab sync

lib/
  ├── models/
  │   └── goal.ts             # Goal type definitions
  ├── services/
  │   ├── goal-service.ts           # Goal CRUD operations
  │   ├── goal-order-service.ts     # Drag-and-drop reordering logic
  │   ├── goal-storage-service.ts   # localStorage persistence
  │   └── date-service.ts           # Date calculations and formatting
  └── utils.ts                # Utility functions

specs/001-goal-tracker/        # MVP specification documents
specs/002-goal-reorder/        # Drag-and-drop feature specification
```

## Manual Testing Checklist

### Basic Functionality
1. **Load App**
   - Navigate to http://localhost:3000
   - Verify empty state displays properly

2. **Add Goals**
   - Click "Add Goal" button
   - Fill title and end date
   - Click submit
   - Verify goal appears in Current Goals column
   - Populate with 5-10 goals for testing

3. **Goal Completion**
   - Click checkbox on a goal
   - Verify goal moves to Completed column with today's date
   - Verify goal appears with strikethrough text

4. **Goal Deletion**
   - Click delete button on a goal
   - Confirm modal appears
   - Click confirm to delete
   - Verify goal is removed

### Drag-and-Drop Testing
1. **Active Goals Reordering**
   - Hover over goal → cursor changes to grab icon
   - Drag first goal to last position
   - Verify goal moves and order updates immediately
   - Refresh page (F5) → goal remains in new position

2. **Completed Goals Reordering**
   - Complete 2-3 goals
   - Drag within Completed column
   - Verify independent ordering from Active column

3. **Visual Feedback**
   - Hover → grab cursor appears
   - Drag → cursor changes to grabbing, goal semi-transparent
   - Drop → goal returns to full opacity in new position

4. **Drop Indicator**
   - Drag goal slowly across other goals
   - Verify drop position line appears showing target

5. **Interactive Element Safety**
   - Try to drag by checkbox → checkbox toggles, no drag
   - Try to drag by delete button → delete modal, no drag
   - Drag by goal title → drag works normally

### Responsive Design
1. **Mobile (375px)**
   - Open DevTools → Device Toolbar → iPhone 12
   - Verify single-column layout
   - All buttons tappable (44px minimum)

2. **Tablet (768px)**
   - Change viewport to Tablet
   - Verify two-column layout appears

3. **Desktop (1024px+)**
   - Full layout with proper spacing

### Cross-Tab Synchronization
1. Open app in two tabs (Tab A and Tab B)
2. In Tab A: reorder goals, add goal, complete goal
3. Switch to Tab B → verify changes appear automatically
4. Test reverse: make changes in Tab B, verify in Tab A

### Performance
1. Add 20+ goals
2. Drag goals smoothly without jank
3. Auto-scroll works at column edges
4. No console errors (F12 → Console tab)

## Architecture Notes

### Goal Model
```typescript
interface Goal {
  id: string              // UUID
  title: string           // Goal title (1-100 chars)
  endDate: string         // YYYY-MM-DD format
  status: 'active' | 'completed'
  createdDate: string     // ISO timestamp
  completedDate?: string  // ISO timestamp when completed
  order: number           // Position within column (0, 1, 2, ...)
}
```

### Key Services
- **GoalOrderService**: Manages reordering logic, validates order integrity
- **GoalStorageService**: localStorage persistence with cross-tab sync via events
- **GoalService**: CRUD operations combining storage and date services
- **DateService**: Days remaining, urgency (3-day threshold), date formatting

### Drag-and-Drop Implementation
- **useSortableGoals**: React hook wrapping Sortable.js with state management
- **GoalColumn**: Renders `<ul>` for Sortable.js integration
- **Auto-scroll**: Detects cursor proximity to edges, scrolls container

## Deployment

Build and deploy to Vercel:
```bash
npm run build    # Verify build succeeds
npm run start    # Test production build locally
git push origin main  # Deploy via Vercel Git integration
```

## Known Limitations

- **No Backend Sync**: Goals stored only in browser localStorage
- **Single Browser**: No cross-device sync (would need backend + authentication)
- **No Undo/Redo**: Goal reordering is immediate and permanent
- **No Goals Categories/Tags**: Simple flat list only

## Future Enhancements

- [ ] Backend API for data persistence and multi-device sync
- [ ] Goal categories and tags
- [ ] Recurring goals (daily, weekly, monthly)
- [ ] Goal attachments and notes
- [ ] Progress tracking and analytics
- [ ] Dark mode theme variant
- [ ] Mobile app (React Native)

## Constitution v1.1.0

This project follows strict architectural guidelines (see [.specify/memory/constitution.md](.specify/memory/constitution.md)):

- ✅ TypeScript strict mode
- ✅ Tailwind CSS utilities only (no custom CSS)
- ✅ shadcn/ui components for consistency
- ✅ Zero automated tests (manual verification only)
- ✅ Responsive design with Tailwind media queries
- ✅ Sortable.js 1.15.7 locked for drag-and-drop stability

## Contributing

See [specs/001-goal-tracker/quickstart.md](specs/001-goal-tracker/quickstart.md) for feature implementation guidelines and user workflows.

## License

MIT

