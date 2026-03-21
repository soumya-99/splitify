import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity as ActivityIcon } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useGroupStore } from '@/src/store/useGroupStore';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import ExpenseCard from '@/src/components/ExpenseCard';
import EmptyState from '@/src/components/EmptyState';
import { SCREEN_PADDING } from '@/src/constants/layout';

export default function ActivityScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const groups = useGroupStore((s) => s.groups);
  const expenses = useExpenseStore((s) => s.expenses);

  if (expenses.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="Expenses and settlements will appear here as they're added to your groups."
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        ListHeaderComponent={<Text style={[styles.title, { color: colors.text }]}>Activity</Text>}
        renderItem={({ item }) => {
          const group = groups.find((g) => g.id === item.groupId);
          return (
            <View style={styles.cardWrap}>
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
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 16,
  },
  cardWrap: {
    marginBottom: 8,
  },
});
