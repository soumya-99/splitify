import type { Expense, Settlement, Balance, ExpenseSplit } from '@/src/types';

export function splitEqual(amount: number, memberIds: string[]): ExpenseSplit[] {
  const count = memberIds.length;
  if (count === 0) return [];

  const baseShare = Math.floor((amount * 100) / count) / 100;
  const remainder = Math.round((amount - baseShare * count) * 100) / 100;

  return memberIds.map((memberId, index) => ({
    memberId,
    amount: index === 0 ? baseShare + remainder : baseShare,
  }));
}

export function calculateBalances(expenses: Expense[], settlements: Settlement[]): Balance[] {
  const netBalances: Record<string, number> = {};

  // Process expenses
  for (const expense of expenses) {
    const payerId = expense.paidById;
    netBalances[payerId] = (netBalances[payerId] || 0) + expense.amount;

    for (const split of expense.splits) {
      netBalances[split.memberId] = (netBalances[split.memberId] || 0) - split.amount;
    }
  }

  // Process settlements
  for (const settlement of settlements) {
    netBalances[settlement.fromMemberId] =
      (netBalances[settlement.fromMemberId] || 0) + settlement.amount;
    netBalances[settlement.toMemberId] =
      (netBalances[settlement.toMemberId] || 0) - settlement.amount;
  }

  return simplifyDebts(netBalances);
}

export function simplifyDebts(netBalances: Record<string, number>): Balance[] {
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const [id, balance] of Object.entries(netBalances)) {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ id, amount: Math.abs(rounded) });
    } else if (rounded > 0.01) {
      creditors.push({ id, amount: rounded });
    }
  }

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const result: Balance[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i];
    const credit = creditors[j];
    const settleAmount = Math.min(debt.amount, credit.amount);

    if (settleAmount > 0.01) {
      result.push({
        fromMemberId: debt.id,
        toMemberId: credit.id,
        amount: Math.round(settleAmount * 100) / 100,
      });
    }

    debt.amount -= settleAmount;
    credit.amount -= settleAmount;

    if (debt.amount < 0.01) i++;
    if (credit.amount < 0.01) j++;
  }

  return result;
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getUserBalance(memberId: string, balances: Balance[]): number {
  const youOwe = balances
    .filter((b) => b.fromMemberId === memberId)
    .reduce((s, b) => s + b.amount, 0);
  const owedToYou = balances
    .filter((b) => b.toMemberId === memberId)
    .reduce((s, b) => s + b.amount, 0);
  return owedToYou - youOwe;
}
