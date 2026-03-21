import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { formatCurrencyPlain } from '@/src/utils/currency';
import { formatDate } from '@/src/utils/date';
import type { Expense, Member } from '@/src/types';

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
  currency: string;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, members, currency }) => {
  const { colors } = useTheme();

  const paidBy = members.find((m) => m.id === expense.paidById);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.borderLight },
      ]}
    >
      <View style={styles.left}>
        <Text style={[styles.description, { color: colors.text }]} numberOfLines={1}>
          {expense.description}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          Paid by {paidBy?.name ?? 'Unknown'} · {formatDate(expense.createdAt)}
        </Text>
      </View>
      <Text style={[styles.amount, { color: colors.text }]}>
        {formatCurrencyPlain(expense.amount, currency)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  left: {
    flex: 1,
    marginRight: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
  },
  meta: {
    fontSize: 12,
    marginTop: 3,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ExpenseCard;
