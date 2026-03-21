# Global Standards for Splitify

> **Rule**: This file must remain under **12,000 characters**. Move detailed specs to `DESIGN.md` or `SKILLS.md`.

## Project Overview

**Splitify** — Fully offline expense splitter with sharing. Built with **Expo** (React Native + TypeScript) for Android & iOS.

---

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Framework      | Expo (managed workflow, SDK 52+)             |
| Language       | TypeScript (strict mode)                     |
| Navigation     | Expo Router (file-based) + Bottom Tabs       |
| State          | Zustand                                      |
| Database       | expo-sqlite                                  |
| Icons          | lucide-react-native                          |
| Styling        | StyleSheet API + theme system                |
| Sharing        | expo-sharing + JSON export/import + QR       |
| Animations     | React Native Reanimated + Gesture Handler    |
| Fonts          | expo-font (Inter / Poppins)                  |
| Haptics        | expo-haptics                                 |
| Testing        | Jest + React Native Testing Library          |

---

## Folder Structure (Expo Router)

```
├── app/                        # File-based navigation
│   ├── _layout.tsx             # Root layout (providers, fonts, splash)
│   ├── index.tsx               # Entry redirect → (tabs)
│   ├── (tabs)/                 # Bottom Tab Navigator
│   │   ├── _layout.tsx         # Tab bar config & styling
│   │   ├── index.tsx           # Home / Dashboard
│   │   ├── groups.tsx          # Groups list
│   │   ├── activity.tsx        # Recent activity
│   │   └── settings.tsx        # Settings
│   ├── group/                  # Group stack screens
│   │   ├── [id].tsx            # Group detail (dynamic)
│   │   ├── add-expense.tsx     # Add expense
│   │   └── settle-up.tsx       # Settle up
│   └── modals/                 # Modal screens
│       ├── create-group.tsx
│       └── import-group.tsx
├── src/
│   ├── components/             # Shared UI (Button, Card, Avatar, TabBar, etc.)
│   ├── theme/                  # colors.ts, typography.ts, spacing.ts, shadows.ts
│   ├── store/                  # Zustand stores (useGroupStore, useExpenseStore, useSettingsStore)
│   ├── database/               # expo-sqlite schema, queries/, migrations/
│   ├── services/               # splitCalculator.ts, shareService.ts, currencyFormatter.ts
│   ├── hooks/                  # useTheme, useDatabase, etc.
│   ├── types/                  # expense.ts, group.ts, member.ts, navigation.ts
│   ├── utils/                  # id.ts, date.ts, validation.ts
│   └── constants/              # layout.ts (tab bar height, padding, etc.)
├── assets/                     # fonts/, images/
└── app.json
```

---

## Bottom Tabs

| Tab      | Icon (lucide) | Route            |
| -------- | ------------- | ---------------- |
| Home     | `Home`        | `(tabs)/index`   |
| Groups   | `Users`       | `(tabs)/groups`  |
| Activity | `Activity`    | `(tabs)/activity`|
| Settings | `Settings`    | `(tabs)/settings`|

- Custom tab bar component (`src/components/TabBar.tsx`).
- Active: `primary` color + pill indicator. Inactive: `textSecondary`.
- FAB (floating action button) above tab bar for "Add Expense".
- Haptic feedback on tab press. Respect safe area insets.

---

## Coding Standards

### TypeScript
- Strict mode enabled. No `any` — use `unknown` + narrowing.
- `type` for object shapes, `interface` for component props.
- Export shared types from `src/types/`.

### Components
- Functional components only. One default export per file.
- **Never use `TouchableOpacity`**. Use `Pressable` or `RectButton` (gesture-handler).
- `Pressable` style: `({ pressed }) => [...]` for press feedback.
- Screen components in Expo Router route files (`app/`). Shared components in `src/components/`.
- Max **200 lines** per component file.

### Naming

| Item            | Convention          | Example             |
| --------------- | ------------------- | ------------------- |
| Components      | PascalCase          | `ExpenseCard.tsx`   |
| Hooks           | camelCase + `use`   | `useGroupStore.ts`  |
| Utils/Services  | camelCase           | `splitCalculator.ts`|
| Types           | camelCase           | `expense.ts`        |
| Constants       | UPPER_SNAKE_CASE    | `MAX_GROUP_MEMBERS` |
| Props           | PascalCase + Props  | `ExpenseCardProps`  |

### Styling
- `StyleSheet.create()` only — no inline styles.
- Reference theme tokens from `src/theme/`. Support light + dark mode.
- No magic numbers — use spacing/sizing tokens.

### State
- Zustand for global state. One store per domain.
- DB is source of truth; Zustand syncs from it.
- `useState`/`useReducer` for local component state.

### Data & Offline
- All data stored locally via **expo-sqlite**. No server.
- JSON export/import for sharing. UUIDs via `expo-crypto`.

---

## Design Tokens (Summary)

> Full specs in `DESIGN.md`.

| Token          | Light       | Dark        |
| -------------- | ----------- | ----------- |
| `primary`      | `#6C5CE7`   | `#A29BFE`   |
| `secondary`    | `#00B894`   | `#55EFC4`   |
| `accent`       | `#FD79A8`   | `#FF7675`   |
| `warning`      | `#FDCB6E`   | `#FFEAA7`   |
| `info`         | `#74B9FF`   | `#81ECEC`   |
| `background`   | `#F8F9FE`   | `#1A1A2E`   |
| `surface`      | `#FFFFFF`   | `#16213E`   |
| `text`         | `#2D3436`   | `#DFE6E9`   |
| `textSecondary`| `#636E72`   | `#B2BEC3`   |
| `border`       | `#E0E0E0`   | `#2C3E50`   |
| `danger`       | `#E17055`   | `#FF6B6B`   |

- Icons: lucide-react-native. Sizes: `20` inline, `24` buttons, `48` empty states.
- Typography: Inter/Poppins via expo-font. Scale: `xs(10)` `sm(12)` `base(14)` `md(16)` `lg(20)` `xl(24)` `2xl(30)` `3xl(36)`.
- Spacing (4px base): `xs(4)` `sm(8)` `md(16)` `lg(24)` `xl(32)` `2xl(48)`.
- Shadows: `none`, `sm`, `md`, `lg`. Cards use `sm`, FAB uses `lg`.
- Animations: Reanimated. Durations: 200–400ms. Spring for gestures.

---

## Features

**Core**: Groups, Expenses (equal/exact/percentage split), Balances (simplified debts), Settle Up, Dashboard.

**Sharing (offline)**: JSON export/import, QR code, expo-sharing via system share sheet.

**Settings**: Default currency, theme toggle (light/dark/system), data export/clear.

---

## Quality

- **Errors**: try-catch with user-friendly messages. Global `ErrorBoundary`. Toast notifications.
- **Performance**: `React.memo` for list items. `FlatList` always. Lazy-load screens. Granular Zustand selectors.
- **Accessibility**: `accessibilityLabel` on all `Pressable`/`RectButton`. Dynamic font scaling. WCAG AA contrast. Screen reader testing.
