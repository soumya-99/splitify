import EmptyState from '@/src/components/EmptyState';
import ExpenseCard from '@/src/components/ExpenseCard';
import GroupCard from '@/src/components/GroupCard';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import {
  calculateBalances,
  getTotalExpenses,
  getUserBalance,
} from '@/src/services/splitCalculator';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { useGroupStore } from '@/src/store/useGroupStore';
import type { Expense, Settlement } from '@/src/types';
import { formatCurrencyPlain } from '@/src/utils/currency';
import { useRouter } from 'expo-router';
import { ArrowRightLeft, Users, Wallet } from 'lucide-react-native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const groups = useGroupStore((s) => s.groups);
  const expenses = useExpenseStore((s) => s.expenses);
  const settlements = useExpenseStore((s) => s.settlements);

  // Calculate overall balance
  const totalOwed = groups.reduce((sum, group) => {
    const groupExpenses = expenses.filter((e) => e.groupId === group.id);
    const groupSettlements = settlements.filter((s) => s.groupId === group.id);
    const balances = calculateBalances(groupExpenses, groupSettlements);
    // For demo, first member is "you"
    const firstMemberId = group.members[0]?.id;
    if (!firstMemberId) return sum;
    const youOwe = balances
      .filter((b) => b.fromMemberId === firstMemberId)
      .reduce((s, b) => s + b.amount, 0);
    const owedToYou = balances
      .filter((b) => b.toMemberId === firstMemberId)
      .reduce((s, b) => s + b.amount, 0);
    return sum + (owedToYou - youOwe);
  }, 0);

  type FeedItem = (Expense & { _type: 'expense' }) | (Settlement & { _type: 'settlement' });

  const recentActivity: FeedItem[] = [
    ...expenses.map((e) => ({ ...e, _type: 'expense' as const })),
    ...settlements.map((s) => ({ ...s, _type: 'settlement' as const })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (groups.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <EmptyState
          icon={Users}
          title="Welcome to Splitify!"
          description="Create your first group to start splitting expenses with friends."
          actionTitle="Create Group"
          onAction={() => router.push('/modals/create-group')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList<FeedItem>
        data={recentActivity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.appTitle, { color: colors.text }]}>Splitify</Text>
              <Wallet size={24} color={colors.primary} />
            </View>

            {/* Balance Card */}
            <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
              <Text style={styles.balanceLabel}>Overall Balance</Text>
              <Text style={styles.balanceAmount}>
                {totalOwed >= 0 ? '+' : '−'}₹{Math.abs(totalOwed).toFixed(2)}
              </Text>
              <Text style={styles.balanceSub}>
                Across {groups.length} group{groups.length !== 1 ? 's' : ''}
              </Text>
            </View>

            {/* Groups Preview */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Groups</Text>
            <FlatList
              data={groups.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.groupsRow}
              renderItem={({ item }) => {
                const groupExpenses = expenses.filter((e) => e.groupId === item.id);
                const groupSettlements = settlements.filter((s) => s.groupId === item.id);
                const firstMemberId = item.members[0]?.id;
                const balances = calculateBalances(groupExpenses, groupSettlements);
                const userBalance = firstMemberId ? getUserBalance(firstMemberId, balances) : 0;
                const total = getTotalExpenses(groupExpenses);

                return (
                  <View style={styles.groupCardWrap}>
                    <GroupCard
                      group={item}
                      totalExpenses={total}
                      userBalance={userBalance}
                      onPress={() => router.push(`/group/${item.id}`)}
                    />
                  </View>
                );
              }}
            />

            {recentActivity.length > 0 && (
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
                Recent Activity
              </Text>
            )}
          </>
        }
        renderItem={({ item }) => {
          const group = groups.find((g) => g.id === item.groupId);
          if (item._type === 'settlement') {
            const from = group?.members.find((m) => m.id === item.fromMemberId);
            const to = group?.members.find((m) => m.id === item.toMemberId);
            return (
              <View
                style={[
                  styles.expenseWrap,
                  {
                    backgroundColor: colors.surface,
                    padding: 16,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  },
                ]}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.primaryLight + '20',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowRightLeft size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: colors.text }}>
                    {from?.name} paid {to?.name}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
                    {group?.name} • {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary }}>
                  {formatCurrencyPlain(item.amount, group?.currency ?? '₹')}
                </Text>
              </View>
            );
          }
          return (
            <View style={styles.expenseWrap}>
              <ExpenseCard
                expense={item}
                members={group?.members ?? []}
                currency={group?.currency ?? '₹'}
              />
            </View>
          );
        }}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 30,
    fontWeight: '700',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 4,
  },
  balanceSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  groupsRow: {
    gap: 12,
  },
  groupCardWrap: {
    width: 260,
  },
  expenseWrap: {
    marginBottom: 8,
  },
});
