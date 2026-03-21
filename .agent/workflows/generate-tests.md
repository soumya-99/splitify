---
description: How to generate tests for Splitify components and logic
---

# Generate Tests Workflow

Follow these steps to generate tests for Splitify code.

## Steps

### 1. Identify the Target
- Determine what needs testing: a **component**, a **hook**, a **utility function**, or a **store**.
- Read the source file to understand its API, props, and behavior.

### 2. Choose the Test Category

| Target           | Test Type            | Location                                      |
| ---------------- | -------------------- | --------------------------------------------- |
| UI Component     | Component test       | `__tests__/components/<ComponentName>.test.tsx` |
| Screen           | Screen test          | `__tests__/screens/<ScreenName>.test.tsx`       |
| Utility function | Unit test            | `__tests__/utils/<utilName>.test.ts`            |
| Zustand store    | Store test           | `__tests__/store/<storeName>.test.ts`           |
| Custom hook      | Hook test            | `__tests__/hooks/<hookName>.test.ts`            |
| Split calculator | Algorithm test       | `__tests__/services/splitCalculator.test.ts`    |

### 3. Write Component Tests
Use **React Native Testing Library** for component tests:

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ComponentName from '@/components/ComponentName';

describe('ComponentName', () => {
  it('renders correctly with required props', () => {
    const { getByText } = render(<ComponentName title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ComponentName title="Test" onPress={onPress} />
    );
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### 4. Write Utility / Algorithm Tests
Use plain **Jest** for utility functions:

```ts
import { splitEqual, splitByPercentage, simplifyDebts } from '@/services/splitCalculator';

describe('splitCalculator', () => {
  describe('splitEqual', () => {
    it('splits 300 among 3 people equally', () => {
      const result = splitEqual(300, ['alice', 'bob', 'charlie']);
      expect(result).toEqual({ alice: 100, bob: 100, charlie: 100 });
    });

    it('handles rounding for non-divisible amounts', () => {
      const result = splitEqual(100, ['alice', 'bob', 'charlie']);
      const total = Object.values(result).reduce((a, b) => a + b, 0);
      expect(total).toBeCloseTo(100, 2);
    });
  });

  describe('simplifyDebts', () => {
    it('minimizes number of transactions', () => {
      // Test the debt simplification algorithm
    });
  });
});
```

### 5. Write Store Tests
Test Zustand stores by invoking actions and checking state:

```ts
import { useGroupStore } from '@/store/useGroupStore';

describe('useGroupStore', () => {
  beforeEach(() => {
    useGroupStore.setState({ groups: [], loading: false });
  });

  it('adds a new group', () => {
    const group = { id: '1', name: 'Test Group', members: [], currency: 'INR' };
    useGroupStore.getState().addGroup(group);
    expect(useGroupStore.getState().groups).toHaveLength(1);
    expect(useGroupStore.getState().groups[0].name).toBe('Test Group');
  });

  it('removes a group by id', () => {
    const group = { id: '1', name: 'Test Group', members: [], currency: 'INR' };
    useGroupStore.setState({ groups: [group] });
    useGroupStore.getState().removeGroup('1');
    expect(useGroupStore.getState().groups).toHaveLength(0);
  });
});
```

### 6. Test Coverage Priorities
Focus testing effort in this order:
1. **Split calculation algorithms** — Most critical business logic.
2. **Debt simplification** — Must produce correct, minimal transactions.
3. **Data export/import** — Must produce valid JSON and handle malformed input.
4. **Zustand stores** — Ensure state transitions are correct.
5. **Core UI components** — Buttons, Cards, ExpenseCard, GroupCard.
6. **Screen rendering** — Verify screens render without crashes.

### 7. Run Tests
```bash
# Run all tests
npx jest

# Run with coverage
npx jest --coverage

# Run specific test file
npx jest __tests__/services/splitCalculator.test.ts

# Run in watch mode
npx jest --watch
```

### 8. Validate
- All tests must pass.
- No console warnings or errors during test runs.
- Coverage should be ≥ 80% for utility/service files.
- Coverage should be ≥ 60% for UI components.
