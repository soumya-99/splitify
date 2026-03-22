import Avatar from '@/src/components/Avatar';
import Button from '@/src/components/Button';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { useExpenseStore } from '@/src/store/useExpenseStore';
import { useGroupStore } from '@/src/store/useGroupStore';
import type { SplitType } from '@/src/types';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, ChevronDown, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
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

const SPLIT_TYPES: { label: string; value: SplitType }[] = [
  { label: 'Equal', value: 'equal' },
  { label: 'Exact', value: 'exact' },
  { label: 'Percentage', value: 'percentage' },
];

export default function AddExpenseScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const allGroups = useGroupStore((s) => s.groups);
  const group = allGroups.find((g) => g.id === groupId);
  const addExpense = useExpenseStore((s) => s.addExpense);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState(group?.members[0]?.id ?? '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    group?.members.map((m) => m.id) ?? []
  );
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [showPayerPicker, setShowPayerPicker] = useState(false);

  const payer = group?.members.find((m) => m.id === paidById);

  const toggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }
    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Select at least one member to split with.');
      return;
    }

    let customSplits;
    if (splitType !== 'equal') {
      let totalAssigned = 0;
      customSplits = selectedMembers.map((memberId) => {
        const val = parseFloat(customAmounts[memberId] || '0');
        let assignedAmount = 0;
        if (splitType === 'percentage') {
          totalAssigned += val;
          assignedAmount = (parsedAmount * val) / 100;
        } else if (splitType === 'exact') {
          totalAssigned += val;
          assignedAmount = val;
        }
        return {
          memberId,
          amount: assignedAmount,
          percentage: splitType === 'percentage' ? val : undefined,
        };
      });

      if (splitType === 'percentage' && Math.abs(totalAssigned - 100) > 0.01) {
        Alert.alert('Error', `Percentages must add up to 100%. Current total: ${totalAssigned}%`);
        return;
      }
      if (splitType === 'exact' && Math.abs(totalAssigned - parsedAmount) > 0.01) {
        Alert.alert(
          'Error',
          `Exact amounts must add up to the total amount. Current total: ${totalAssigned}`
        );
        return;
      }
    }

    addExpense(
      groupId!,
      description.trim(),
      parsedAmount,
      paidById,
      splitType,
      selectedMembers,
      customSplits
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  const perPersonAmount = useMemo(() => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || selectedMembers.length === 0) return 0;
    return parsed / selectedMembers.length;
  }, [amount, selectedMembers]);

  if (!group) return null;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Add Expense</Text>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            accessibilityLabel="Save expense"
          >
            <Check size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Description */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="What was this expense for?"
          placeholderTextColor={colors.textTertiary}
          value={description}
          onChangeText={setDescription}
        />

        {/* Amount */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
        <TextInput
          style={[
            styles.input,
            styles.amountInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="0.00"
          placeholderTextColor={colors.textTertiary}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        {/* Paid by */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Paid by</Text>
        <Pressable
          onPress={() => setShowPayerPicker(!showPayerPicker)}
          style={({ pressed }) => [
            styles.payerBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          accessibilityLabel="Select payer"
        >
          {payer && <Avatar name={payer.name} color={payer.avatarColor} size="sm" />}
          <Text style={[styles.payerName, { color: colors.text }]}>{payer?.name ?? 'Select'}</Text>
          <ChevronDown size={20} color={colors.textSecondary} />
        </Pressable>

        {showPayerPicker && (
          <View
            style={[
              styles.payerList,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {group.members.map((member) => (
              <Pressable
                key={member.id}
                onPress={() => {
                  setPaidById(member.id);
                  setShowPayerPicker(false);
                }}
                style={({ pressed }) => [
                  styles.payerOption,
                  {
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor:
                      member.id === paidById ? colors.primaryLight + '20' : 'transparent',
                  },
                ]}
                accessibilityLabel={`Select ${member.name} as payer`}
              >
                <Avatar name={member.name} color={member.avatarColor} size="sm" />
                <Text style={[styles.payerOptionText, { color: colors.text }]}>{member.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Split type */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Split type</Text>
        <View style={styles.splitToggle}>
          {SPLIT_TYPES.map((type) => (
            <Pressable
              key={type.value}
              onPress={() => setSplitType(type.value)}
              style={({ pressed }) => [
                styles.splitOption,
                {
                  backgroundColor: splitType === type.value ? colors.primary : colors.surface,
                  borderColor: splitType === type.value ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              accessibilityLabel={`Split ${type.label}`}
            >
              <Text
                style={[
                  styles.splitOptionText,
                  { color: splitType === type.value ? colors.white : colors.text },
                ]}
              >
                {type.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Split among */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Split among</Text>
        {group.members.map((member) => {
          const isSelected = selectedMembers.includes(member.id);
          return (
            <Pressable
              key={member.id}
              onPress={() => toggleMember(member.id)}
              style={({ pressed }) => [
                styles.memberRow,
                {
                  backgroundColor: isSelected ? colors.primaryLight + '15' : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              accessibilityLabel={`${isSelected ? 'Remove' : 'Add'} ${member.name}`}
            >
              <View style={styles.memberRowLeft}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Check size={14} color={colors.white} strokeWidth={3} />}
                </View>
                <Avatar name={member.name} color={member.avatarColor} size="sm" />
                <Text style={[styles.memberRowName, { color: colors.text }]}>{member.name}</Text>
              </View>
              {isSelected && splitType === 'equal' && (
                <Text style={[styles.splitAmount, { color: colors.textSecondary }]}>
                  {group.currency}
                  {perPersonAmount.toFixed(2)}
                </Text>
              )}
              {isSelected && splitType !== 'equal' && (
                <View style={styles.customInputContainer}>
                  {splitType === 'exact' && (
                    <Text style={[styles.currencyPrefix, { color: colors.text }]}>
                      {group.currency}
                    </Text>
                  )}
                  <TextInput
                    style={[
                      styles.customAmountInput,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={customAmounts[member.id] || ''}
                    onChangeText={(val) => setCustomAmounts({ ...customAmounts, [member.id]: val })}
                    placeholder="0"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="decimal-pad"
                    maxLength={splitType === 'percentage' ? 3 : undefined}
                  />
                  {splitType === 'percentage' && (
                    <Text style={[styles.percentSuffix, { color: colors.text }]}>%</Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}

        {/* Save Button */}
        <View style={styles.saveBtn}>
          <Button title="Save Expense" onPress={handleSave} fullWidth />
        </View>
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
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '700',
  },
  payerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  payerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  payerList: {
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    overflow: 'hidden',
  },
  payerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  payerOptionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  splitToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  splitOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  splitOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  memberRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberRowName: {
    fontSize: 15,
    fontWeight: '500',
  },
  splitAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
  percentSuffix: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 4,
  },
  customAmountInput: {
    width: 60,
    borderRadius: 8,
    borderWidth: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 24,
  },
});
