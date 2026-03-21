# Global Standards for Splitify

## Project Overview

**Splitify** is a fully offline expense splitter app with sharing capabilities, built with **Expo** (React Native + TypeScript) targeting Android and iOS.

---

## Tech Stack

| Layer            | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Framework        | **Expo** (managed workflow, SDK 52+)              |
| Language         | TypeScript (strict mode)                          |
| Navigation       | **Expo Router** (file-based) + **Bottom Tabs**    |
| State Management | Zustand (lightweight, no boilerplate)              |
| Local Database   | **expo-sqlite** (fully offline)                    |
| Icons            | lucide-react-native                               |
| Styling          | StyleSheet API (React Native) with a theme system  |
| Sharing          | JSON export/import + QR code + expo-sharing        |
| Animations       | React Native Reanimated + Gesture Handler          |
| Fonts            | **expo-font** (Inter / Poppins)                    |
| Haptics          | expo-haptics                                       |
| Testing          | Jest + React Native Testing Library                |

---

## Architecture & Folder Structure

This project uses **Expo Router** (file-based routing). The `app/` directory defines the navigation structure.

```
├── app/                        # Expo Router — file-based navigation
│   ├── _layout.tsx             # Root layout (providers, fonts, splash)
│   ├── index.tsx               # Entry redirect → (tabs)
│   ├── (tabs)/                 # Bottom Tab Navigator group
│   │   ├── _layout.tsx         # Tab bar configuration & styling
│   │   ├── index.tsx           # Home / Dashboard tab
│   │   ├── groups.tsx          # Groups list tab
│   │   ├── activity.tsx        # Recent activity tab
│   │   └── settings.tsx        # Settings tab
│   ├── group/                  # Stack screens for group details
│   │   ├── [id].tsx            # Group detail screen (dynamic route)
│   │   ├── add-expense.tsx     # Add expense screen
│   │   └── settle-up.tsx       # Settle up screen
│   └── modals/                 # Modal screens
│       ├── create-group.tsx    # Create new group modal
│       └── import-group.tsx    # Import group from JSON/QR modal
├── src/
│   ├── components/             # Shared, reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── TabBar.tsx          # Custom bottom tab bar component
│   │   ├── EmptyState.tsx
│   │   └── ...
│   ├── theme/                  # Design tokens & theme configuration
│   │   ├── colors.ts           # Color palette (light + dark)
│   │   ├── typography.ts       # Font sizes, weights, families
│   │   ├── spacing.ts          # Spacing scale
│   │   ├── shadows.ts          # Shadow presets
│   │   └── index.ts            # Unified theme export
│   ├── store/                  # Zustand stores
│   │   ├── useGroupStore.ts
│   │   ├── useExpenseStore.ts
│   │   └── useSettingsStore.ts
│   ├── database/               # expo-sqlite schema, queries, migrations
│   │   ├── schema.ts
│   │   ├── queries/
│   │   └── migrations/
│   ├── services/               # Business logic & utilities
│   │   ├── splitCalculator.ts  # Core splitting algorithms
│   │   ├── shareService.ts     # Export/import/share logic (expo-sharing)
│   │   └── currencyFormatter.ts
│   ├── hooks/                  # Shared custom hooks
│   │   ├── useTheme.ts
│   │   ├── useDatabase.ts
│   │   └── ...
│   ├── types/                  # Global TypeScript types & interfaces
│   │   ├── expense.ts
│   │   ├── group.ts
│   │   ├── member.ts
│   │   ├── navigation.ts       # Route param types
│   │   └── index.ts
│   ├── utils/                  # Pure utility functions
│   │   ├── id.ts               # UUID generation
│   │   ├── date.ts             # Date formatting
│   │   └── validation.ts
│   └── constants/              # App-wide constants
│       └── layout.ts           # Tab bar height, screen padding, etc.
├── assets/                     # Static assets (Expo convention)
│   ├── fonts/
│   └── images/
└── app.json                    # Expo configuration
```

### Bottom Tab Navigation

The app uses a **custom-styled bottom tab bar** as the primary navigation:

| Tab       | Icon (lucide)    | Screen           | Description                  |
| --------- | ---------------- | ---------------- | ---------------------------- |
| Home      | `Home`           | `(tabs)/index`   | Dashboard with overview      |
| Groups    | `Users`          | `(tabs)/groups`  | List of all expense groups   |
| Activity  | `Activity`       | `(tabs)/activity`| Recent expenses & settlements|
| Settings  | `Settings`       | `(tabs)/settings`| Theme, currency, data mgmt   |

**Tab bar styling rules:**
- Use a **custom tab bar component** (`src/components/TabBar.tsx`) for full design control.
- Active tab uses `primary` color with a subtle background pill/indicator.
- Inactive tabs use `textSecondary` color.
- Add a **floating action button (FAB)** above the tab bar for quick "Add Expense" action.
- Apply `expo-haptics` feedback on tab press.
- Tab bar should respect the safe area (use `useSafeAreaInsets`).
- Apply `shadow.md` to the tab bar for elevation.

---

## Coding Standards

### TypeScript
- Use **strict mode** (`"strict": true` in `tsconfig.json`).
- All components must be typed with explicit `Props` interfaces.
- Avoid `any` — use `unknown` when the type is truly unknown, then narrow.
- Use **type** for object shapes and **interface** for component props (consistency).
- Export types from `src/types/` for shared usage.

### Components
- Use **functional components** with hooks exclusively — no class components.
- Each component file exports **one default component**.
- Screen components live in `src/screens/<ScreenName>/index.tsx`.
- Shared components live in `src/components/`.
- Screen-specific components live in `src/screens/<ScreenName>/components/`.
- Keep components **under 200 lines**. Extract logic into hooks or sub-components.

### Naming Conventions
| Item               | Convention         | Example                  |
| ------------------ | ------------------ | ------------------------ |
| Component files    | PascalCase         | `ExpenseCard.tsx`        |
| Hook files         | camelCase (use prefix) | `useGroupStore.ts`   |
| Utility files      | camelCase          | `splitCalculator.ts`     |
| Type files         | camelCase          | `expense.ts`             |
| Constants          | UPPER_SNAKE_CASE   | `MAX_GROUP_MEMBERS`      |
| Component props    | PascalCase + Props | `ExpenseCardProps`       |
| Screens            | PascalCase + Screen| `AddExpenseScreen`       |

### Styling
- Use React Native `StyleSheet.create()` — no inline styles in JSX.
- Reference theme tokens (colors, spacing, typography) from `src/theme/`.
- Support **light and dark mode** via theme context.
- Avoid magic numbers — use spacing and sizing tokens.

### State Management
- Use **Zustand** for global state (groups, expenses, settings).
- Keep stores small and focused — one store per domain.
- Database is the source of truth; Zustand syncs from the DB.
- Use React hooks (`useState`, `useReducer`) for local component state.

### Data & Offline
- All data must be stored **locally on-device** (no server required).
- Use **expo-sqlite** for all structured data storage.
- Support JSON export/import for data sharing between users.
- Generate unique IDs client-side (UUID v4 via `expo-crypto`).

---

## Design & Theme Standards

### Color Palette (Colorful Theme)
The app uses a **vibrant, gradient-rich** palette:

| Token            | Light Mode     | Dark Mode      | Usage                     |
| ---------------- | -------------- | -------------- | ------------------------- |
| `primary`        | `#6C5CE7`      | `#A29BFE`      | Primary actions, headers  |
| `secondary`      | `#00B894`      | `#55EFC4`      | Success, settlements      |
| `accent`         | `#FD79A8`      | `#FF7675`      | Highlights, badges        |
| `warning`        | `#FDCB6E`      | `#FFEAA7`      | Warnings, pending items   |
| `info`           | `#74B9FF`      | `#81ECEC`      | Info indicators           |
| `background`     | `#F8F9FE`      | `#1A1A2E`      | Screen backgrounds        |
| `surface`        | `#FFFFFF`      | `#16213E`      | Cards, sheets             |
| `text`           | `#2D3436`      | `#DFE6E9`      | Primary text              |
| `textSecondary`  | `#636E72`      | `#B2BEC3`      | Muted / secondary text    |
| `border`         | `#E0E0E0`      | `#2C3E50`      | Borders, dividers         |
| `danger`         | `#E17055`      | `#FF6B6B`      | Destructive actions       |

### Icons
- Use **lucide-react-native** as the sole icon library.
- Icon size defaults: `20` for inline, `24` for buttons/nav, `48` for empty states.
- Always pass color from theme — never hardcode icon colors.

### Typography
- Use a custom font (e.g., **Inter** or **Poppins**) loaded via **expo-font** + `useFonts` hook in the root layout.
- Define a typography scale: `xs (10)`, `sm (12)`, `base (14)`, `md (16)`, `lg (20)`, `xl (24)`, `2xl (30)`, `3xl (36)`.
- Use `fontWeight` tokens: `regular (400)`, `medium (500)`, `semibold (600)`, `bold (700)`.

### Spacing
- Follow a **4px base** spacing scale: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.
- Use named tokens: `xs (4)`, `sm (8)`, `md (16)`, `lg (24)`, `xl (32)`, `2xl (48)`.

### Shadows & Elevation
- Define shadow presets: `none`, `sm`, `md`, `lg`.
- Card components use `shadow.sm` by default.
- Floating action buttons use `shadow.lg`.

### Animations
- Use **React Native Reanimated** for performant animations.
- Apply subtle entrance animations on lists (fade + slide-up).
- Use spring physics for interactive gestures (swipe-to-delete, drag).
- Keep animation durations between **200ms – 400ms** for UI transitions.

---

## App Features Summary

### Core Features
1. **Groups** — Create groups with members, each group tracks shared expenses.
2. **Expenses** — Add expenses with payer, split type (equal, exact, percentage), and participants.
3. **Balances** — View who owes whom within a group (simplified debt algorithm).
4. **Settle Up** — Record payments between members to settle debts.
5. **Dashboard** — Overview of all groups, total balances, and recent activity.

### Sharing Features (No Server)
1. **Export Group as JSON** — Serialize a group's data as a JSON file.
2. **Import Group from JSON** — Import and merge a group from a shared file.
3. **QR Code Sharing** — Generate a QR code containing group invite/data.
4. **Share via System Share Sheet** — Use **expo-sharing** to send data via any app.

### Settings
1. **Default Currency** — Choose a default currency for new groups.
2. **Theme Toggle** — Switch between light, dark, and system theme.
3. **Data Management** — Export all data / Clear all data.

---

## Error Handling
- Wrap async operations in try-catch with user-friendly error messages.
- Use a global error boundary component (`ErrorBoundary.tsx`).
- Show toast notifications for transient errors (network, share failures).
- Log errors to console in dev; suppress in production.

## Performance
- Use `React.memo` for list item components.
- Use `FlatList` (not `ScrollView`) for all lists.
- Lazy-load screens with `React.lazy` or React Navigation lazy loading.
- Minimize re-renders by keeping Zustand selectors granular.

## Accessibility
- All touchable components must have `accessibilityLabel`.
- Support dynamic font scaling.
- Ensure color contrast ratios meet WCAG AA standards.
- Test with screen readers (TalkBack / VoiceOver).
