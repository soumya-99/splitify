import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Expense, Settlement, ExpenseSplit } from '@/src/types';
import { generateId } from '@/src/utils/id';
import { splitEqual } from '@/src/services/splitCalculator';
import { zustandStorage } from './storage';

interface ExpenseState {
  expenses: Expense[];
  settlements: Settlement[];
}

interface ExpenseActions {
  addExpense: (
    groupId: string,
    description: string,
    amount: number,
    paidById: string,
    splitType: 'equal' | 'exact' | 'percentage',
    participantIds: string[],
    customSplits?: ExpenseSplit[]
  ) => Expense;
  removeExpense: (id: string) => void;
  addSettlement: (
    groupId: string,
    fromMemberId: string,
    toMemberId: string,
    amount: number
  ) => Settlement;
  removeSettlement: (id: string) => void;
  getGroupExpenses: (groupId: string) => Expense[];
  getGroupSettlements: (groupId: string) => Settlement[];
  loadData: (expenses: Expense[], settlements: Settlement[]) => void;
}

type ExpenseStore = ExpenseState & ExpenseActions;

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      expenses: [],
      settlements: [],

      addExpense: (
        groupId,
        description,
        amount,
        paidById,
        splitType,
        participantIds,
        customSplits
      ) => {
        let splits: ExpenseSplit[];

        if (splitType === 'equal') {
          splits = splitEqual(amount, participantIds);
        } else if (customSplits) {
          splits = customSplits;
        } else {
          splits = splitEqual(amount, participantIds);
        }

        const expense: Expense = {
          id: generateId(),
          groupId,
          description,
          amount,
          paidById,
          splitType,
          splits,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ expenses: [expense, ...state.expenses] }));
        return expense;
      },

      removeExpense: (id) => {
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
      },

      addSettlement: (groupId, fromMemberId, toMemberId, amount) => {
        const settlement: Settlement = {
          id: generateId(),
          groupId,
          fromMemberId,
          toMemberId,
          amount,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({ settlements: [settlement, ...state.settlements] }));
        return settlement;
      },

      removeSettlement: (id) => {
        set((state) => ({ settlements: state.settlements.filter((s) => s.id !== id) }));
      },

      getGroupExpenses: (groupId) => {
        return get().expenses.filter((e) => e.groupId === groupId);
      },

      getGroupSettlements: (groupId) => {
        return get().settlements.filter((s) => s.groupId === groupId);
      },

      loadData: (expenses, settlements) => {
        set({ expenses, settlements });
      },
    }),
    {
      name: 'splitify-expense-storage',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
