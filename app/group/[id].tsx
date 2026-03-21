import Avatar from '@/src/components/Avatar';
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import EmptyState from '@/src/components/EmptyState';
import ExpenseCard from '@/src/components/ExpenseCard';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { exportGroupToSpt } from '@/src/services/shareService';
import { calculateBalances, getTotalExpenses } from '@/src/services/splitCalculator';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { useGroupStore } from '@/src/store/useGroupStore';
import type { Expense, Settlement } from '@/src/types';
import { formatCurrencyPlain } from '@/src/utils/currency';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRightLeft, Plus, Receipt, Share } from 'lucide-react-native';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const allGroups = useGroupStore((s) => s.groups);
  const group = allGroups.find((g) => g.id === id);

  const allExpenses = useExpenseStore((s) => s.expenses);
  const expenses = allExpenses.filter((e) => e.groupId === id);

  const allSettlements = useExpenseStore((s) => s.settlements);
  const settlements = allSettlements.filter((s) => s.groupId === id);

  if (!group) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}
      >
        <Text style={[styles.errorText, { color: colors.text }]}>Group not found</Text>
      </View>
    );
  }

  const balances = calculateBalances(expenses, settlements);
  const totalExpenses = getTotalExpenses(expenses);

  type FeedItem = (Expense & { _type: 'expense' }) | (Settlement & { _type: 'settlement' });

  const feed: FeedItem[] = [
    ...expenses.map((e) => ({ ...e, _type: 'expense' as const })),
    ...settlements.map((s) => ({ ...s, _type: 'settlement' as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleShareGroup = async () => {
    try {
      await exportGroupToSpt(group, expenses, settlements);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList<FeedItem>
        data={feed}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top }]}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
                accessibilityLabel="Go back"
              >
                <ArrowLeft size={24} color={colors.text} />
              </Pressable>
              <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                {group.emoji} {group.name}
              </Text>
              <Pressable
                onPress={handleShareGroup}
                style={({ pressed }) => [styles.moreBtn, { opacity: pressed ? 0.6 : 1 }]}
                accessibilityLabel="Share group"
              >
                <Share size={24} color={colors.text} />
              </Pressable>
            </View>

            {/* Members Row */}
            <View style={styles.membersSection}>
              <View style={styles.membersRow}>
                {group.members.map((member) => (
                  <View key={member.id} style={styles.memberChip}>
                    <Avatar name={member.name} color={member.avatarColor} size="sm" />
                    <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
                      {member.name}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.totalText, { color: colors.textSecondary }]}>
                Total: {formatCurrencyPlain(totalExpenses, group.currency)}
              </Text>
            </View>

            {/* Balances */}
            {balances.length > 0 && (
              <Card style={styles.balancesCard}>
                <Text style={[styles.balancesTitle, { color: colors.text }]}>Balances</Text>
                {balances.map((balance, index) => {
                  const from = group.members.find((m) => m.id === balance.fromMemberId);
                  const to = group.members.find((m) => m.id === balance.toMemberId);
                  return (
                    <View key={index} style={styles.balanceRow}>
                      <Text style={[styles.balanceText, { color: colors.text }]}>
                        {from?.name ?? '?'} owes {to?.name ?? '?'}
                      </Text>
                      <Text style={[styles.balanceAmount, { color: colors.danger }]}>
                        {formatCurrencyPlain(balance.amount, group.currency)}
                      </Text>
                    </View>
                  );
                })}
                <View style={styles.settleBtn}>
                  <Button
                    title="Settle Up"
                    onPress={() =>
                      router.push({ pathname: '/group/settle-up', params: { groupId: group.id } })
                    }
                    variant="secondary"
                    icon={ArrowRightLeft}
                  />
                </View>
              </Card>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Add Expense"
                onPress={() =>
                  router.push({ pathname: '/group/add-expense', params: { groupId: group.id } })
                }
                icon={Plus}
                fullWidth
              />
            </View>

            {feed.length > 0 && (
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity</Text>
            )}
          </>
        }
        renderItem={({ item }) => {
          if (item._type === 'settlement') {
            const from = group.members.find((m) => m.id === item.fromMemberId);
            const to = group.members.find((m) => m.id === item.toMemberId);
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
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary }}>
                  {formatCurrencyPlain(item.amount, group.currency)}
                </Text>
              </View>
            );
          }
          return (
            <View style={styles.expenseWrap}>
              <ExpenseCard expense={item} members={group.members} currency={group.currency} />
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon={Receipt}
            title="No activity yet"
            description="Add your first expense or payment."
          />
        }
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  moreBtn: {
    padding: 4,
  },
  membersSection: {
    marginBottom: 16,
  },
  membersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '500',
  },
  totalText: {
    fontSize: 14,
    marginTop: 4,
  },
  balancesCard: {
    marginBottom: 16,
  },
  balancesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  balanceText: {
    fontSize: 14,
    flex: 1,
  },
  balanceAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  settleBtn: {
    marginTop: 12,
  },
  actions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  expenseWrap: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
