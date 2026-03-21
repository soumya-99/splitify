import React from 'react';
import { ActionSheetIOS, Alert, Platform, View, Text, FlatList, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Users } from 'lucide-react-native';
import { useTheme } from '@/src/hooks/useTheme';
import { useGroupStore } from '@/src/store/useGroupStore';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import {
  calculateBalances,
  getTotalExpenses,
  getUserBalance,
} from '@/src/services/splitCalculator';
import GroupCard from '@/src/components/GroupCard';
import EmptyState from '@/src/components/EmptyState';
import { SCREEN_PADDING } from '@/src/constants/layout';
import type { Group } from '@/src/types';

export default function GroupsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const groups = useGroupStore((s) => s.groups);
  const removeGroup = useGroupStore((s) => s.removeGroup);
  const expenses = useExpenseStore((s) => s.expenses);
  const settlements = useExpenseStore((s) => s.settlements);

  const handleLongPressGroup = (group: Group) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const options = ['Edit Group', 'Delete Group', 'Cancel'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    const editGroup = () => router.push(`/modals/edit-group?groupId=${group.id}`);
    const deleteGroup = () => {
      Alert.alert(
        'Delete Group',
        `Are you sure you want to delete "${group.name}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => removeGroup(group.id),
          },
        ]
      );
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
          destructiveButtonIndex,
          title: group.name,
          message: 'Manage your group',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) editGroup();
          else if (buttonIndex === destructiveButtonIndex) deleteGroup();
        }
      );
    } else {
      Alert.alert(group.name, 'Manage your group', [
        { text: 'Edit Group', onPress: editGroup },
        { text: 'Delete Group', style: 'destructive', onPress: deleteGroup },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

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
          title="No groups yet"
          description="Create a group to start tracking shared expenses."
          actionTitle="Create Group"
          onAction={() => router.push('/modals/create-group')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Groups</Text>
            <Text style={[styles.count, { color: colors.textSecondary }]}>
              {groups.length} group{groups.length !== 1 ? 's' : ''}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const groupExpenses = expenses.filter((e) => e.groupId === item.id);
          const groupSettlements = settlements.filter((s) => s.groupId === item.id);
          const firstMemberId = item.members[0]?.id;
          const balances = calculateBalances(groupExpenses, groupSettlements);
          const userBalance = firstMemberId ? getUserBalance(firstMemberId, balances) : 0;
          const total = getTotalExpenses(groupExpenses);
          return (
            <View style={styles.cardWrap}>
              <GroupCard
                group={item}
                totalExpenses={total}
                userBalance={userBalance}
                onPress={() => router.push(`/group/${item.id}`)}
                onLongPress={() => handleLongPressGroup(item)}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
  },
  count: {
    fontSize: 14,
  },
  cardWrap: {
    marginBottom: 12,
  },
});
