import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useTheme } from '@/src/hooks/useTheme';
import Card from './Card';
import Avatar from './Avatar';
import { formatCurrencyPlain } from '@/src/utils/currency';
import type { Group } from '@/src/types';

interface GroupCardProps {
  group: Group;
  totalExpenses: number;
  userBalance: number;
  onPress: () => void;
  onLongPress?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  totalExpenses,
  userBalance,
  onPress,
  onLongPress,
}) => {
  const { colors } = useTheme();

  const balanceColor =
    userBalance > 0 ? colors.secondary : userBalance < 0 ? colors.danger : colors.textSecondary;
  const balanceText =
    userBalance > 0
      ? `You are owed ${formatCurrencyPlain(userBalance, group.currency)}`
      : userBalance < 0
        ? `You owe ${formatCurrencyPlain(Math.abs(userBalance), group.currency)}`
        : 'All settled up';

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={200}
      style={({ pressed }) => [
        { opacity: pressed ? 0.95 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
      accessibilityLabel={`Group ${group.name}`}
    >
      <Card>
        <View style={styles.header}>
          <Text style={styles.emoji}>{group.emoji}</Text>
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={[styles.meta, { color: colors.textSecondary }]}>
              {group.members.length} member{group.members.length !== 1 ? 's' : ''} ·{' '}
              {formatCurrencyPlain(totalExpenses, group.currency)} total
            </Text>
          </View>
        </View>

        <View style={styles.avatarRow}>
          {group.members.slice(0, 4).map((member, index) => (
            <View key={member.id} style={[styles.avatarWrap, index > 0 && styles.avatarOverlap]}>
              <Avatar name={member.name} color={member.avatarColor} size="sm" />
            </View>
          ))}
          {group.members.length > 4 && (
            <Text style={[styles.moreMembers, { color: colors.textSecondary }]}>
              +{group.members.length - 4}
            </Text>
          )}
        </View>

        <Text style={[styles.balance, { color: balanceColor }]}>{balanceText}</Text>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrap: {},
  avatarOverlap: {
    marginLeft: -8,
  },
  moreMembers: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  balance: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GroupCard;
