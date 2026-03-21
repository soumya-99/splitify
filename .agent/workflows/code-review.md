---
description: How to perform a code review on Splitify source code
---

# Code Review Workflow

Follow these steps to perform a thorough code review on the Splitify codebase.

## Steps

### 1. Identify Changed Files
- List and read the files that have been modified or added.
- Understand the scope of the changes.

### 2. Check TypeScript Compliance
- Ensure **no `any` types** are used (use `unknown` + type narrowing instead).
- Verify all component props have explicit `Props` interfaces.
- Check that strict mode rules are followed.
- Ensure shared types are imported from `src/types/`.

### 3. Check Component Standards
- Verify functional components only (no class components).
- Ensure components are **under 200 lines**.
- **Verify `TouchableOpacity` is NOT used anywhere**. Must use `Pressable` or `RectButton` instead.
- Check `Pressable` components use `({ pressed }) => [...]` style callback for press feedback.
- Check for proper `accessibilityLabel` on all `Pressable` / `RectButton` elements.
- Verify styles use `StyleSheet.create()` — no inline styles.
- Confirm theme tokens are used (no hardcoded colors, spacing, or font sizes).

### 4. Check Icon Usage
- All icons must come from `lucide-react-native`.
- Icon colors must reference theme tokens.
- Icon sizes must follow conventions: `20` (inline), `24` (buttons), `48` (empty states).

### 5. Check State Management
- Zustand stores should be small and single-domain.
- Component-local state uses `useState` or `useReducer`.
- Verify no unnecessary re-renders (check Zustand selectors are granular).

### 6. Check Performance
- Lists must use `FlatList`, not `ScrollView`.
- List items should use `React.memo`.
- Check for missing `key` props in rendered lists.
- Verify no heavy computations in render functions.

### 7. Check Offline Data Integrity
- All data operations must use the local database.
- UUIDs must be generated client-side.
- Verify data export/import follows the shared JSON schema.

### 8. Check Error Handling
- Async operations wrapped in try-catch.
- User-friendly error messages shown via toasts.
- Error boundaries exist for screen-level error catching.

### 9. Provide Feedback
- For each issue found, provide:
  - **File**: The file and line number.
  - **Issue**: A clear description of the problem.
  - **Fix**: The recommended fix.
  - **Severity**: `critical`, `warning`, or `suggestion`.
- Summarize the overall quality of the changes.
