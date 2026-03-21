# Splitify — Design System

This document defines the complete visual design system for Splitify. Every component, screen, and interaction must follow these guidelines.

---

## Design Philosophy

- **Vibrant & Colorful** — The app should feel alive with a rich, modern color palette. No dull or flat UI.
- **Premium Feel** — Smooth animations, consistent spacing, polished corners, and thoughtful micro-interactions.
- **Clarity First** — Financial data must be readable at a glance. Use visual hierarchy, whitespace, and iconography.
- **Offline-Native** — The UI should never display loading spinners for local data. Everything feels instant.

---

## Color System

### Light Mode

| Token            | Hex        | Usage                                  |
| ---------------- | ---------- | -------------------------------------- |
| `primary`        | `#6C5CE7`  | Headers, primary buttons, tab active   |
| `primaryLight`   | `#A29BFE`  | Pill backgrounds, pressed states       |
| `secondary`      | `#00B894`  | Settlements, positive balances, success|
| `secondaryLight` | `#55EFC4`  | Secondary highlights                   |
| `accent`         | `#FD79A8`  | Badges, expense highlight, FAB         |
| `accentLight`    | `#FAB1C8`  | Accent backgrounds                     |
| `warning`        | `#FDCB6E`  | Pending items, alerts                  |
| `info`           | `#74B9FF`  | Informational badges, links            |
| `danger`         | `#E17055`  | Delete, negative balance, red alerts   |
| `background`     | `#F8F9FE`  | Screen backgrounds                     |
| `surface`        | `#FFFFFF`  | Cards, bottom sheets, tab bar          |
| `surfaceElevated`| `#FFFFFF`  | Elevated cards (with shadow)           |
| `text`           | `#2D3436`  | Primary text                           |
| `textSecondary`  | `#636E72`  | Labels, captions, inactive tabs        |
| `textTertiary`   | `#B2BEC3`  | Placeholders, hints                    |
| `border`         | `#E0E0E0`  | Dividers, input borders                |
| `borderLight`    | `#F0F0F5`  | Subtle separators                      |

### Dark Mode

| Token            | Hex        | Usage                                  |
| ---------------- | ---------- | -------------------------------------- |
| `primary`        | `#A29BFE`  | Headers, primary buttons, tab active   |
| `primaryLight`   | `#6C5CE7`  | Pill backgrounds, pressed states       |
| `secondary`      | `#55EFC4`  | Settlements, positive balances         |
| `secondaryLight` | `#00B894`  | Secondary highlights                   |
| `accent`         | `#FF7675`  | Badges, expense highlight, FAB         |
| `accentLight`    | `#E84393`  | Accent backgrounds                     |
| `warning`        | `#FFEAA7`  | Pending items, alerts                  |
| `info`           | `#81ECEC`  | Informational badges                   |
| `danger`         | `#FF6B6B`  | Delete, negative balance               |
| `background`     | `#1A1A2E`  | Screen backgrounds                     |
| `surface`        | `#16213E`  | Cards, bottom sheets, tab bar          |
| `surfaceElevated`| `#1E2A4A`  | Elevated cards                         |
| `text`           | `#DFE6E9`  | Primary text                           |
| `textSecondary`  | `#B2BEC3`  | Labels, captions, inactive tabs        |
| `textTertiary`   | `#636E72`  | Placeholders, hints                    |
| `border`         | `#2C3E50`  | Dividers, input borders                |
| `borderLight`    | `#243350`  | Subtle separators                      |

### Gradients

Use linear gradients for visual flair on key surfaces:

| Gradient         | Colors                        | Usage                          |
| ---------------- | ----------------------------- | ------------------------------ |
| `primaryGradient`| `#6C5CE7` → `#A29BFE`        | Header backgrounds, FAB        |
| `successGradient`| `#00B894` → `#55EFC4`        | Settlement completed cards     |
| `accentGradient` | `#FD79A8` → `#FDCB6E`        | Onboarding, special highlights |
| `darkGradient`   | `#1A1A2E` → `#16213E`        | Dark mode header backgrounds   |

---

## Typography

### Font Family
- **Primary**: `Inter` (load all needed weights via `expo-font`)
- **Fallback**: System default sans-serif

### Type Scale

| Token   | Size | Weight      | Line Height | Usage                              |
| ------- | ---- | ----------- | ----------- | ---------------------------------- |
| `h1`    | 30   | Bold (700)  | 38          | Screen titles                      |
| `h2`    | 24   | SemiBold (600) | 32       | Section headers                    |
| `h3`    | 20   | SemiBold (600) | 28       | Card titles, group names           |
| `body`  | 16   | Regular (400) | 24        | Body text, descriptions            |
| `bodyBold`| 16 | SemiBold (600) | 24       | Amounts, emphasized body text      |
| `label` | 14   | Medium (500)| 20          | Input labels, tab labels           |
| `caption`| 12  | Regular (400)| 18         | Timestamps, secondary info         |
| `tiny`  | 10   | Medium (500)| 14          | Badges, overlines                  |

### Amount Display
- Expense amounts use `bodyBold` or `h3` size.
- Positive balance (owed to you): `secondary` color + `+` prefix.
- Negative balance (you owe): `danger` color + `−` prefix.
- Settled/zero balance: `textSecondary` color.

---

## Spacing

4px base grid system:

| Token  | Value | Usage                                       |
| ------ | ----- | ------------------------------------------- |
| `xs`   | 4px   | Tight gaps (icon-to-text inline)             |
| `sm`   | 8px   | Small padding, list item gaps                |
| `md`   | 16px  | Standard padding, card padding               |
| `lg`   | 24px  | Section gaps, screen horizontal padding      |
| `xl`   | 32px  | Large spacing between major sections         |
| `2xl`  | 48px  | Extra-large gaps (screen top/bottom margin)  |

### Screen Layout Constants
- **Screen horizontal padding**: `lg` (24px)
- **Tab bar height**: `64px` (+ safe area bottom inset)
- **Header height**: `56px`
- **Card border radius**: `16px`
- **Button border radius**: `12px`
- **Input border radius**: `12px`
- **Avatar border radius**: full circle (`999px`)

---

## Shadows & Elevation

| Token       | iOS Shadow                                        | Android Elevation | Usage                        |
| ----------- | ------------------------------------------------- | ----------------- | ---------------------------- |
| `none`      | —                                                 | 0                 | Flat elements                |
| `sm`        | offset(0,1) blur(3) color(rgba(0,0,0,0.08))      | 2                 | Cards at rest                |
| `md`        | offset(0,4) blur(12) color(rgba(0,0,0,0.12))     | 6                 | Tab bar, elevated cards      |
| `lg`        | offset(0,8) blur(24) color(rgba(0,0,0,0.16))     | 12                | FAB, modals, bottom sheets   |

---

## Icons

### Library
- **lucide-react-native** — the sole icon library.

### Sizing

| Context         | Size  | Stroke Width |
| --------------- | ----- | ------------ |
| Inline text     | 16    | 2            |
| List items      | 20    | 2            |
| Buttons / Tabs  | 24    | 1.5          |
| Empty states    | 48    | 1.5          |
| Hero / Headers  | 64    | 1            |

### Color Rules
- Always use theme color tokens — never hardcode.
- Active tab icons: `primary`
- Inactive tab icons: `textSecondary`
- Expense category icons: Use the `accent` or `info` palette depending on type.

---

## Component Design Specs

### Pressable Elements
> **NEVER use `TouchableOpacity`.** Use `Pressable` or `RectButton`.

- `Pressable`: Standard press targets (buttons, cards, list items).
  - Use `({ pressed }) => [...]` style callback.
  - Pressed state: `opacity: 0.7` or `scale(0.97)` via Reanimated.
- `RectButton` (from `react-native-gesture-handler`): For items inside `FlatList` or swipeable rows.
  - Better native gesture handling for scrollable contexts.

### Cards
- Background: `surface`
- Border radius: `16px`
- Padding: `md` (16px)
- Shadow: `sm`
- Hover/Press: subtle `opacity: 0.95` or slight `scale(0.98)`

```
┌─────────────────────────────────────┐
│  🏖  Trip to Goa                    │
│  4 members · ₹12,500 total          │
│                                     │
│  You owe ₹2,340    [Settle Up →]    │
└─────────────────────────────────────┘
```

### Bottom Tab Bar
- Component: `src/components/TabBar.tsx` (custom)
- Background: `surface` with `shadow.md`
- Height: `64px` + safe area bottom
- 4 tabs: Home, Groups, Activity, Settings
- Active indicator: colored pill behind the active icon
- Active icon + label: `primary` color
- Inactive icon + label: `textSecondary` color
- Haptic feedback on press (`expo-haptics` — `ImpactFeedbackStyle.Light`)

```
┌─────────────────────────────────────────┐
│                  [＋]                    │  ← FAB (accent gradient, shadow.lg)
├──────────┬──────────┬─────────┬─────────┤
│   🏠     │   👥     │   📊    │   ⚙️    │
│  Home    │  Groups  │ Activity│ Settings│
│  ●       │          │         │         │  ← Active pill indicator
└──────────┴──────────┴─────────┴─────────┘
```

### Floating Action Button (FAB)
- Position: centered above the tab bar, partially overlapping
- Size: `56px` circle
- Background: `primaryGradient` (or `accent`)
- Icon: `Plus` from lucide, `28px`, `white`
- Shadow: `lg`
- Press animation: `scale(0.9)` spring + haptic `Medium`
- Action: navigates to Add Expense screen

### Buttons

| Variant    | Background        | Text Color | Border        | Usage                  |
| ---------- | ----------------- | ---------- | ------------- | ---------------------- |
| Primary    | `primary`         | `white`    | none          | Main CTAs              |
| Secondary  | `primaryLight@15%`| `primary`  | none          | Secondary actions      |
| Outline    | `transparent`     | `primary`  | `primary` 1px | Tertiary actions       |
| Danger     | `danger`          | `white`    | none          | Delete, destructive    |
| Ghost      | `transparent`     | `text`     | none          | Subtle actions         |

- All buttons: `12px` border radius, `md` vertical padding, `lg` horizontal padding.
- Press state: `opacity: 0.8` via `Pressable` callback.
- Disabled state: `opacity: 0.4`, no press handler.

### Avatars
- Shape: circle
- Sizes: `sm (32px)`, `md (40px)`, `lg (56px)`
- Background: Generated from member name hash → mapped to a color from the palette.
- Content: First letter(s) of member name, uppercase, `white` text.
- Stack avatars with `-8px` overlap for group member previews.

### Input Fields
- Background: `surface` (light) / `surfaceElevated` (dark)
- Border: `1px solid border`, focused: `2px solid primary`
- Border radius: `12px`
- Padding: `md` (16px)
- Label above input: `label` typography, `textSecondary` color.
- Error state: border `danger`, error text below in `caption` + `danger` color.

### Empty States
- Center-aligned, vertically centered in available space.
- Large icon: `48px`, `textTertiary` color.
- Title: `h3`, `text` color.
- Description: `body`, `textSecondary` color.
- CTA button below if applicable.

---

## Screen Design Specs

### Home / Dashboard

```
┌─────────────────────────────────────────┐
│  Splitify              👤               │  ← Header
├─────────────────────────────────────────┤
│                                         │
│  ┌─── Total Balance Card ────────────┐  │
│  │  primaryGradient background       │  │
│  │  "Overall Balance"                │  │
│  │  ₹2,340.00                        │  │
│  │  You owe across 3 groups          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Recent Activity                        │
│  ┌─ ExpenseCard ─────────────────────┐  │
│  │ 🍕 Dinner   ₹1,200   "Trip Goa"  │  │
│  └───────────────────────────────────┘  │
│  ┌─ ExpenseCard ─────────────────────┐  │
│  │ 🚕 Cab fare  ₹450    "Trip Goa"  │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Your Groups                            │
│  ┌─ GroupCard ─┐ ┌─ GroupCard ─┐        │
│  │ Trip Goa    │ │ Flat Rent   │  →     │
│  │ 4 members   │ │ 3 members   │        │
│  └─────────────┘ └─────────────┘        │
│                                         │
├──── Tab Bar ────────────────────────────┤
```

### Groups List

```
┌─────────────────────────────────────────┐
│  Groups                 [+ New Group]   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ GroupCard ───────────────────────┐  │
│  │ 🏖 Trip to Goa                    │  │
│  │ 👤👤👤👤  ·  ₹12,500             │  │
│  │ You owe ₹2,340                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌─ GroupCard ───────────────────────┐  │
│  │ 🏠 Flat Rent                      │  │
│  │ 👤👤👤  ·  ₹45,000               │  │
│  │ You are owed ₹3,200              │  │
│  └───────────────────────────────────┘  │
│                                         │
├──── Tab Bar ────────────────────────────┤
```

### Group Detail

```
┌─────────────────────────────────────────┐
│  ← Trip to Goa            ⋯ (menu)     │
├─────────────────────────────────────────┤
│                                         │
│  Members: 👤A 👤B 👤C 👤D              │
│  Total: ₹12,500                         │
│                                         │
│  ┌─ Balance Summary ────────────────┐   │
│  │  You owe B   ₹1,200             │   │
│  │  C owes you  ₹860               │   │
│  │  ─────────────────               │   │
│  │  [Settle Up]                     │   │
│  └──────────────────────────────────┘   │
│                                         │
│  Expenses                               │
│  ┌─ ExpenseRow ─────────────────────┐   │
│  │ 🍕 Dinner at Beach   ₹1,200     │   │
│  │ Paid by A · Split equally        │   │
│  └──────────────────────────────────┘   │
│  ┌─ ExpenseRow ─────────────────────┐   │
│  │ 🚕 Cab to Airport    ₹450       │   │
│  │ Paid by B · Split: A, B         │   │
│  └──────────────────────────────────┘   │
│                                         │
│           [+ Add Expense]               │
└─────────────────────────────────────────┘
```

### Add Expense

```
┌─────────────────────────────────────────┐
│  ← Add Expense            ✓ Save       │
├─────────────────────────────────────────┤
│                                         │
│  Description                            │
│  ┌────────────────────────────────────┐ │
│  │ Dinner at beach                    │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Amount                                 │
│  ┌────────────────────────────────────┐ │
│  │ ₹ 1,200.00                        │ │
│  └────────────────────────────────────┘ │
│                                         │
│  Paid by                                │
│  ┌──────────┐                           │
│  │ 👤 Alice  ▾│                          │
│  └──────────┘                           │
│                                         │
│  Split type                             │
│  [ Equal ] [ Exact ] [ Percentage ]     │
│     ●                                   │
│                                         │
│  Split among                            │
│  ☑ Alice    ₹300.00                     │
│  ☑ Bob      ₹300.00                     │
│  ☑ Charlie  ₹300.00                     │
│  ☑ Diana    ₹300.00                     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Animation Guidelines

### Transitions
- **Screen push/pop**: Use Expo Router default stack animation (native).
- **Modal present**: slide-up with spring config `{ damping: 20, stiffness: 200 }`.
- **Tab switch**: Crossfade, `200ms`.

### Micro-interactions
- **List items entering**: Staggered `fade + translateY(20)` with `300ms` delay + `100ms` stagger per item.
- **FAB press**: `scale(0.9)` spring + haptic `ImpactFeedbackStyle.Medium`.
- **Tab press**: Icon `scale(1.1)` spring + haptic `ImpactFeedbackStyle.Light`.
- **Card press**: `opacity: 0.95` or `scale(0.98)`, `200ms`.
- **Swipe-to-delete**: Slide left to reveal `danger` background with `Trash2` icon.
- **Balance change**: Number counter animation using Reanimated shared value.

### Reanimated Config
- Use `withSpring` for interactive elements (default: `damping: 15`, `stiffness: 150`).
- Use `withTiming` for color/opacity transitions (default `duration: 250ms`, Easing `ease-in-out`).
- Use `useAnimatedStyle` for all animated components — never animate via state.

---

## Responsive Design

- Primary target: mobile phones (360–428px width).
- Use `Dimensions.get('window')` for adaptive layouts only when needed.
- Cards: full-width minus `lg * 2` (48px total horizontal padding).
- Horizontal scroll sections (e.g., group previews on Dashboard): use `FlatList horizontal`.
- Never use absolute positioning for layout — only for overlays (FAB, badges).

---

## Dark Mode Considerations

- Background & surface colors are deeply tinted navy (`#1A1A2E`, `#16213E`), not pure black.
- Text colors reduce brightness slightly (never pure `#FFFFFF`).
- Shadows are more subtle in dark mode (lower opacity).
- Gradients remain vibrant but slightly muted.
- All images/icons must look good on both backgrounds.
