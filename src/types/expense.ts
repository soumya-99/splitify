export type SplitType = 'equal' | 'exact' | 'percentage';

export interface ExpenseSplit {
  memberId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidById: string;
  splitType: SplitType;
  splits: ExpenseSplit[];
  createdAt: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  createdAt: string;
}

export interface Balance {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}
