import Avatar from '@/src/components/Avatar';
import Button from '@/src/components/Button';
import { SCREEN_PADDING } from '@/src/constants/layout';
import { useTheme } from '@/src/hooks/useTheme';
import { useGroupStore } from '@/src/store/useGroupStore';
import { getAvatarColor } from '@/src/utils/avatar';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Plus, Trash2, UserPlus, X } from 'lucide-react-native';
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

const GROUP_EMOJIS = ['🏖️', '🏠', '✈️', '🍕', '🎉', '🚗', '💼', '🎮', '☕', '🛒', '🎬', '💪'];

export default function CreateGroupScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const router = useRouter();
  const addGroup = useGroupStore((s) => s.addGroup);

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏖️');
  const [currency, setCurrency] = useState('₹');
  const [memberName, setMemberName] = useState('');
  const [members, setMembers] = useState<string[]>(['You']);

  const addMember = () => {
    const trimmed = memberName.trim();
    if (!trimmed) return;
    if (members.includes(trimmed)) {
      Alert.alert('Duplicate', 'This member already exists.');
      return;
    }
    setMembers((prev) => [...prev, trimmed]);
    setMemberName('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a group name.');
      return;
    }
    if (members.length < 2) {
      Alert.alert('Error', 'Add at least 2 members.');
      return;
    }

    addGroup(name.trim(), emoji, currency, members);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>New Group</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Emoji Picker */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Icon</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
          {GROUP_EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={({ pressed }) => [
                styles.emojiBtn,
                {
                  backgroundColor: emoji === e ? colors.primaryLight + '30' : colors.surface,
                  borderColor: emoji === e ? colors.primary : colors.border,
                  transform: [{ scale: pressed ? 0.9 : 1 }],
                },
              ]}
              accessibilityLabel={`Select emoji ${e}`}
            >
              <Text style={styles.emojiText}>{e}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Group Name */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Group Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="e.g., Trip to Goa"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
        />

        {/* Currency */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Currency Symbol</Text>
        <TextInput
          style={[
            styles.input,
            styles.currencyInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="₹"
          placeholderTextColor={colors.textTertiary}
          value={currency}
          onChangeText={setCurrency}
          maxLength={3}
        />

        {/* Members */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Members ({members.length})
        </Text>

        {members.map((member, index) => (
          <View
            key={index}
            style={[
              styles.memberRow,
              { backgroundColor: colors.surface, borderColor: colors.borderLight },
            ]}
          >
            <View style={styles.memberRowLeft}>
              <Avatar name={member} color={getAvatarColor(member)} size="sm" />
              <Text style={[styles.memberRowName, { color: colors.text }]}>{member}</Text>
              {index === 0 && (
                <View style={[styles.youBadge, { backgroundColor: colors.primaryLight + '30' }]}>
                  <Text style={[styles.youBadgeText, { color: colors.primary }]}>You</Text>
                </View>
              )}
            </View>
            {index > 0 && (
              <Pressable
                onPress={() => removeMember(index)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                accessibilityLabel={`Remove ${member}`}
              >
                <Trash2 size={18} color={colors.danger} />
              </Pressable>
            )}
          </View>
        ))}

        {/* Add Member Input */}
        <View style={styles.addMemberRow}>
          <TextInput
            style={[
              styles.input,
              styles.addMemberInput,
              { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
            ]}
            placeholder="Add member name"
            placeholderTextColor={colors.textTertiary}
            value={memberName}
            onChangeText={setMemberName}
            onSubmitEditing={addMember}
            returnKeyType="done"
          />
          <Pressable
            onPress={addMember}
            style={({ pressed }) => [
              styles.addMemberBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityLabel="Add member"
          >
            <UserPlus size={20} color={colors.white} />
          </Pressable>
        </View>

        {/* Create Button */}
        <View style={styles.createBtn}>
          <Button title="Create Group" onPress={handleCreate} fullWidth icon={Plus} />
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
    marginTop: 20,
  },
  emojiRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  emojiText: {
    fontSize: 24,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  currencyInput: {
    width: 80,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  memberRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberRowName: {
    fontSize: 15,
    fontWeight: '500',
  },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  addMemberRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addMemberInput: {
    flex: 1,
  },
  addMemberBtn: {
    width: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtn: {
    marginTop: 32,
  },
});
