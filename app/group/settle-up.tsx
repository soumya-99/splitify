import Avatar from '@/src/components/Avatar';
import Button from '@/src/components/Button';
import Card from '@/src/components/Card';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { calculateBalances } from '@/src/services/splitCalculator';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { useGroupStore } from '@/src/store/useGroupStore';
import { formatCurrencyPlain } from '@/src/utils/currency';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowRight, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettleUpScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const allGroups = useGroupStore((s) => s.groups);
  const group = allGroups.find((g) => g.id === groupId);

  const allExpenses = useExpenseStore((s) => s.expenses);
  const expenses = allExpenses.filter((e) => e.groupId === groupId);

  const allSettlements = useExpenseStore((s) => s.settlements);
  const settlements = allSettlements.filter((s) => s.groupId === groupId);
  const addSettlement = useExpenseStore((s) => s.addSettlement);

  const [selectedBalance, setSelectedBalance] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  if (!group) return null;

  const balances = calculateBalances(expenses, settlements);

  const handleSettle = (fromId: string, toId: string, amount: number) => {
    const settleAmount = customAmount ? parseFloat(customAmount) : amount;
    if (isNaN(settleAmount) || settleAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    addSettlement(groupId!, fromId, toId, settleAmount);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedBalance(null);
    setCustomAmount('');
    Alert.alert('Settled!', 'Payment has been recorded.');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Close"
          >
            <X size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settle Up</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {group.emoji} {group.name}
        </Text>

        {balances.length === 0 ? (
          <View style={styles.allSettled}>
            <Text style={styles.allSettledEmoji}>🎉</Text>
            <Text style={[styles.allSettledTitle, { color: colors.text }]}>All settled up!</Text>
            <Text style={[styles.allSettledSub, { color: colors.textSecondary }]}>
              No outstanding balances in this group.
            </Text>
          </View>
        ) : (
          balances.map((balance, index) => {
            const from = group.members.find((m) => m.id === balance.fromMemberId);
            const to = group.members.find((m) => m.id === balance.toMemberId);
            const isSelected = selectedBalance === index;

            return (
              <Card key={index} style={styles.balanceCard}>
                <Pressable
                  onPress={() => setSelectedBalance(isSelected ? null : index)}
                  style={({ pressed }) => [styles.balanceRow, { opacity: pressed ? 0.8 : 1 }]}
                  accessibilityLabel={`${from?.name} owes ${to?.name} ${formatCurrencyPlain(balance.amount, group.currency)}`}
                >
                  <View style={styles.balanceLeft}>
                    {from && <Avatar name={from.name} color={from.avatarColor} size="md" />}
                    <ArrowRight size={20} color={colors.textSecondary} />
                    {to && <Avatar name={to.name} color={to.avatarColor} size="md" />}
                  </View>
                  <View style={styles.balanceRight}>
                    <Text style={[styles.balanceNames, { color: colors.text }]}>
                      {from?.name} → {to?.name}
                    </Text>
                    <Text style={[styles.balanceAmount, { color: colors.danger }]}>
                      {formatCurrencyPlain(balance.amount, group.currency)}
                    </Text>
                  </View>
                </Pressable>

                {isSelected && (
                  <View style={[styles.settleSection, { borderTopColor: colors.borderLight }]}>
                    <TextInput
                      style={[
                        styles.settleInput,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.text,
                        },
                      ]}
                      placeholder={balance.amount.toFixed(2)}
                      placeholderTextColor={colors.textTertiary}
                      value={customAmount}
                      onChangeText={setCustomAmount}
                      keyboardType="decimal-pad"
                    />
                    <Button
                      title="Record Payment"
                      onPress={() =>
                        handleSettle(balance.fromMemberId, balance.toMemberId, balance.amount)
                      }
                      fullWidth
                    />
                  </View>
                )}
              </Card>
            );
          })
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SCREEN_PADDING,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  allSettled: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  allSettledEmoji: {
    fontSize: 48,
  },
  allSettledTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  allSettledSub: {
    fontSize: 14,
    textAlign: 'center',
  },
  balanceCard: {
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceRight: {
    flex: 1,
  },
  balanceNames: {
    fontSize: 15,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  settleSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  settleInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
