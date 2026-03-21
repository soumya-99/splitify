# Skills for Splitify

This document outlines specialized skills the agent can leverage when working on the Splitify project.

---

## Skill: React Native Component Creation

**Description**: Create new React Native components following Splitify conventions.

### Steps
1. Determine if the component is **shared** (`src/components/`) or **screen-specific** (`src/screens/<Screen>/components/`).
2. Create the component file using **PascalCase** naming.
3. Define a `Props` interface at the top of the file.
4. Use `StyleSheet.create()` for styles at the bottom of the file.
5. Import colors, spacing, and typography from `src/theme/`.
6. Use icons from `lucide-react-native` — never hardcode icon colors.
7. Add `accessibilityLabel` to all touchable elements.
8. Export the component as the default export.

### Template
```tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { IconName } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface ComponentNameProps {
  title: string;
  onPress?: () => void;
}

const ComponentName: React.FC<ComponentNameProps> = ({ title, onPress }) => {
  const { colors, spacing } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
      accessibilityLabel={title}
    >
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ComponentName;
```

---

## Skill: Screen Creation

**Description**: Create a new screen with proper Expo Router integration.

### Steps
1. Determine the screen type:
   - **Tab screen** → Create file in `app/(tabs)/`.
   - **Stack screen** → Create file in the appropriate `app/` subdirectory (e.g., `app/group/`).
   - **Modal screen** → Create file in `app/modals/`.
2. Create the route file (e.g., `app/(tabs)/groups.tsx` or `app/group/[id].tsx`).
3. For screen-specific components, create them in `src/components/` (shared) or co-locate if only used by that screen.
4. If it's a **tab screen**, update `app/(tabs)/_layout.tsx` to register the tab with its lucide icon.
5. Define route params type in `src/types/navigation.ts`.
6. Use `SafeAreaView` (from `react-native-safe-area-context`) for consistent layout.
7. Use `useLocalSearchParams()` from `expo-router` for dynamic route params.

---

## Skill: Zustand Store Creation

**Description**: Create a new Zustand store following Splitify patterns.

### Steps
1. Create the store file in `src/store/` with the `use<Domain>Store.ts` naming convention.
2. Define the state interface and actions interface separately.
3. Use the `create` function from Zustand.
4. Sync with the local database for persistence.
5. Keep the store focused on a single domain.

### Template
```tsx
import { create } from 'zustand';

interface GroupState {
  groups: Group[];
  loading: boolean;
}

interface GroupActions {
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  loadGroups: () => Promise<void>;
}

type GroupStore = GroupState & GroupActions;

export const useGroupStore = create<GroupStore>((set) => ({
  groups: [],
  loading: false,
  addGroup: (group) =>
    set((state) => ({ groups: [...state.groups, group] })),
  removeGroup: (id) =>
    set((state) => ({ groups: state.groups.filter((g) => g.id !== id) })),
  loadGroups: async () => {
    set({ loading: true });
    // Load from local DB
    set({ loading: false });
  },
}));
```

---

## Skill: Split Calculation

**Description**: Implement and debug expense splitting algorithms.

### Split Types
1. **Equal Split** — Divide the total equally among all selected participants.
2. **Exact Amounts** — Each participant's share is manually specified.
3. **Percentage Split** — Each participant pays a percentage of the total.

### Debt Simplification Algorithm
- Compute net balance for each member (total paid − total owed).
- Use a greedy approach: match the person with the highest positive balance to the person with the most negative balance.
- Minimize the total number of transactions.

---

## Skill: Offline Data Sharing

**Description**: Implement group data sharing without a server.

### Methods
1. **JSON Export/Import**: Serialize group data (members, expenses, settlements) to a JSON file using `expo-file-system`. Import parses and merges.
2. **QR Code**: Encode a compact group invitation or small data payload as a QR code.
3. **Native Share Sheet**: Use **expo-sharing** to share files via WhatsApp, email, etc.

### Data Schema for Sharing
```json
{
  "version": "1.0",
  "type": "splitify_group",
  "group": {
    "id": "uuid",
    "name": "Trip to Goa",
    "currency": "INR",
    "members": [...],
    "expenses": [...],
    "settlements": [...]
  },
  "exportedAt": "ISO8601 timestamp"
}
```

---

## Skill: Theme System

**Description**: Manage the app's light/dark theme system.

### Implementation
- Use React Context (`ThemeContext`) to provide colors, spacing, typography.
- `useTheme()` hook returns the active theme object.
- Support three modes: `light`, `dark`, `system` (follows device setting via `useColorScheme` from `react-native`).
- All components reference theme tokens — never hardcode colors.
- Persist theme preference using `@react-native-async-storage/async-storage`.
